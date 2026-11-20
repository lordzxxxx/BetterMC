import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { governmentOffices } from "../../src/governmentOffices";
import jobsHandler from "../../api/jobs";

describe("PESO public jobs Edge API and local logo assets", () => {
  it("serves code-managed PESO listings and automatically marks past CSC Form No. 9 vacancies expired", async () => {
    const res = await jobsHandler(new Request("https://www.bettermalaybalay.cloud/api/jobs"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      source: string;
      total: number;
      opportunities: Array<{ slug: string; lifecycle: { displayStatus: string } }>;
    };
    expect(json.ok).toBe(true);
    expect(json.source).toBe("code-managed");
    expect(json.total).toBeGreaterThanOrEqual(15);

    const cscSample = json.opportunities.find((o) => o.slug === "csc-2024-planning-officer-iv-cpdo");
    expect(cscSample?.lifecycle.displayStatus).toBe("expired");
  });

  it("supports ?type=, ?status=, and ?q= filters and rejects non-GET requests with 405", async () => {
    const filteredRes = await jobsHandler(
      new Request("https://www.bettermalaybalay.cloud/api/jobs?type=job-fair&status=recurring-program"),
    );
    expect(filteredRes.status).toBe(200);
    const filteredJson = (await filteredRes.json()) as {
      opportunities: Array<{ opportunityType: string }>;
    };
    expect(filteredJson.opportunities.length).toBeGreaterThanOrEqual(1);
    expect(filteredJson.opportunities.every((o) => o.opportunityType === "job-fair")).toBe(true);

    const searchRes = await jobsHandler(
      new Request("https://www.bettermalaybalay.cloud/api/jobs?q=Pharmacist"),
    );
    const searchJson = (await searchRes.json()) as {
      opportunities: Array<{ slug: string }>;
    };
    expect(searchJson.opportunities.some((o) => o.slug === "csc-2024-pharmacist-i-cho")).toBe(true);

    const postRes = await jobsHandler(
      new Request("https://www.bettermalaybalay.cloud/api/jobs", { method: "POST" }),
    );
    expect(postRes.status).toBe(405);
    expect(postRes.headers.get("Allow")).toBe("GET");
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
