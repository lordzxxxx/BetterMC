import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { governmentOffices } from "../../src/governmentOffices";
import jobsHandler from "../../api/jobs";
import adminAuthHandler from "../../api/admin/auth";
import adminJobsHandler from "../../api/admin/jobs";
import { resetSecurityRateLimitsForTests } from "../../api/_lib/pesoSecurity";

function makeRequest(
  url: string,
  method = "GET",
  options: { body?: unknown; headers?: Record<string, string> } = {},
): Request {
  const headers = new Headers(options.headers ?? {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return new Request(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

describe("PESO public jobs & authenticated admin APIs", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetSecurityRateLimitsForTests();
    process.env = { ...originalEnv };
    delete process.env.BETTERMC_ADMIN_TOKEN;
    delete process.env.BETTERMC_ADMIN_PASSWORD;
    delete process.env.BETTERMC_SESSION_SECRET;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("serves public PESO listings and automatically marks past CSC Form No. 9 vacancies expired", async () => {
    const res = await jobsHandler(makeRequest("https://www.bettermalaybalay.cloud/api/jobs"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      persistenceMode: string;
      opportunities: Array<{ slug: string; lifecycle: { displayStatus: string } }>;
    };
    expect(json.ok).toBe(true);
    expect(json.persistenceMode).toBe("static-readonly");

    const cscSample = json.opportunities.find((o) => o.slug === "csc-2024-planning-officer-iv-cpdo");
    expect(cscSample?.lifecycle.displayStatus).toBe("expired");
  });

  it("fails closed on admin auth when environment secrets are missing and rejects disallowed origins", async () => {
    const statusRes = await adminAuthHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/auth"),
    );
    expect(statusRes.status).toBe(200);
    const statusJson = (await statusRes.json()) as { authConfigured: boolean; authenticated: boolean };
    expect(statusJson.authConfigured).toBe(false);
    expect(statusJson.authenticated).toBe(false);

    const loginUnconfigured = await adminAuthHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/auth", "POST", {
        body: { passcode: "test-passcode" },
        headers: { origin: "https://www.bettermalaybalay.cloud" },
      }),
    );
    expect(loginUnconfigured.status).toBe(503);

    process.env.BETTERMC_ADMIN_TOKEN = "super-secret-admin-passcode";
    process.env.BETTERMC_SESSION_SECRET = "super-secret-session-signing-key";

    const evilOrigin = await adminAuthHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/auth", "POST", {
        body: { passcode: "super-secret-admin-passcode" },
        headers: { origin: "https://evil-attacker.example" },
      }),
    );
    expect(evilOrigin.status).toBe(403);

    const badPass = await adminAuthHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/auth", "POST", {
        body: { passcode: "wrong-pass" },
        headers: { origin: "https://www.bettermalaybalay.cloud" },
      }),
    );
    expect(badPass.status).toBe(401);
  });

  it("performs authenticated CRUD, Zod URL validation, draft hiding, and deletion with mocked Upstash REST store", async () => {
    process.env.BETTERMC_ADMIN_TOKEN = "verified-peso-pass";
    process.env.BETTERMC_SESSION_SECRET = "verified-hmac-secret-32-chars-minimum";
    process.env.UPSTASH_REDIS_REST_URL = "https://mock-upstash.example";
    process.env.UPSTASH_REDIS_REST_TOKEN = "mock-upstash-token";

    const kvMemory = new Map<string, string>();
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      const parts = url.split("/");
      const op = parts[parts.length - 2];
      const key = decodeURIComponent(parts[parts.length - 1]);
      if (op === "get") {
        return new Response(JSON.stringify({ result: kvMemory.get(key) ?? null }), { status: 200 });
      }
      if (op === "set") {
        kvMemory.set(key, String(init?.body ?? ""));
        return new Response(JSON.stringify({ result: "OK" }), { status: 200 });
      }
      return new Response("Not found", { status: 404 });
    }) as typeof fetch;

    // 1. Sign in and obtain HttpOnly signed cookie
    const loginRes = await adminAuthHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/auth", "POST", {
        body: { passcode: "verified-peso-pass" },
        headers: { origin: "https://peso.bettermalaybalay.cloud" },
      }),
    );
    expect(loginRes.status).toBe(200);
    const setCookie = loginRes.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("bm_peso_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    const cookiePair = setCookie.split(";")[0];

    // 2. Unauthenticated mutation rejected 401
    const unauthPost = await adminJobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/jobs", "POST", {
        body: { slug: "test" },
        headers: { origin: "https://www.bettermalaybalay.cloud" },
      }),
    );
    expect(unauthPost.status).toBe(401);

    // 3. Reject dangerous javascript: URL in Zod validation
    const invalidPayloadRes = await adminJobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/jobs", "POST", {
        headers: { origin: "https://www.bettermalaybalay.cloud", cookie: cookiePair },
        body: {
          slug: "bad-url-posting",
          title: "Malicious Script Vacancy",
          opportunityType: "job-vacancy",
          employer: "Test Employer",
          location: "Malaybalay City",
          employmentType: "Full-Time",
          description: "Valid description length for testing schema safety.",
          qualifications: ["College graduate"],
          requirements: ["Resume"],
          applicationProcess: ["Apply at PESO"],
          contactDetails: ["0907-688-5735"],
          publishedDate: "2026-11-20",
          publicationStatus: "published",
          sourceLabel: "Test Source",
          sourceUrl: "javascript:alert(1)",
        },
      }),
    );
    expect(invalidPayloadRes.status).toBe(400);

    // 4. Create valid job posting
    const validBody = {
      slug: "bukidnon-cooperative-cashier-2026",
      title: "Cashier — Verified Cooperative Opening",
      opportunityType: "job-vacancy",
      employer: "Sample Malaybalay Cooperative",
      location: "Poblacion, Malaybalay City",
      vacanciesCount: 2,
      employmentType: "Full-Time",
      salaryGradeOrCompensation: "Region 10 Minimum Wage",
      description: "Verified test vacancy entry created through authenticated admin API test.",
      qualifications: ["BS Accountancy or Business graduate"],
      requirements: ["Application Letter & Updated Resume"],
      applicationProcess: ["Submit at PESO Malaybalay Desk"],
      contactDetails: ["pesomalaybalaycity@gmail.com"],
      publishedDate: "2026-11-20",
      deadlineDate: "2026-12-30",
      isRecurringProgram: false,
      publicationStatus: "published",
      sourceLabel: "PESO Official Notice",
      sourceUrl: "https://www.facebook.com/profile.php?id=61589180493733",
    };

    const createRes = await adminJobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/jobs", "POST", {
        headers: { origin: "https://www.bettermalaybalay.cloud", cookie: cookiePair },
        body: validBody,
      }),
    );
    expect(createRes.status).toBe(201);

    // 5. Public GET shows created posting
    const afterCreateGet = await jobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/jobs?q=Cooperative"),
    );
    const afterCreateJson = (await afterCreateGet.json()) as {
      persistenceMode: string;
      opportunities: Array<{ slug: string }>;
    };
    expect(afterCreateJson.persistenceMode).toBe("kv-rest");
    expect(afterCreateJson.opportunities.some((o) => o.slug === validBody.slug)).toBe(true);

    // 6. Patch status to draft -> hidden from public GET, visible when includeDrafts=1 with cookie
    const unpublishRes = await adminJobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/admin/jobs", "PATCH", {
        headers: { origin: "https://www.bettermalaybalay.cloud", cookie: cookiePair },
        body: { slug: validBody.slug, publicationStatus: "draft" },
      }),
    );
    expect(unpublishRes.status).toBe(200);

    const publicAfterUnpublish = await jobsHandler(
      makeRequest("https://www.bettermalaybalay.cloud/api/jobs?q=Cooperative"),
    );
    const pubJson = (await publicAfterUnpublish.json()) as {
      opportunities: Array<{ slug: string }>;
    };
    expect(pubJson.opportunities.some((o) => o.slug === validBody.slug)).toBe(false);

    // 7. Delete posting cleanly
    const deleteRes = await adminJobsHandler(
      makeRequest(
        `https://www.bettermalaybalay.cloud/api/admin/jobs?slug=${validBody.slug}`,
        "DELETE",
        { headers: { origin: "https://www.bettermalaybalay.cloud", cookie: cookiePair } },
      ),
    );
    expect(deleteRes.status).toBe(200);
  });

  it("verifies every office with Verified Local Asset points to a real non-empty image under public/", () => {
    const localAssets = governmentOffices.filter((o) => o.logoStatus === "Verified Local Asset");
    expect(localAssets.length).toBeGreaterThanOrEqual(25);
    for (const office of localAssets) {
      const diskPath = path.join(process.cwd(), "public", office.logoPath!);
      expect(fs.existsSync(diskPath), `Missing image asset on disk: ${diskPath}`).toBe(true);
      expect(fs.statSync(diskPath).size).toBeGreaterThan(500);
    }
  });
});
