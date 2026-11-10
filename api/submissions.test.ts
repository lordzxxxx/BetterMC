import { afterEach, describe, expect, it, vi } from "vitest";
import handler, { POST } from "./submissions";

const validPayload = {
  category: "correction",
  subject: "Correct an office contact",
  details: "The published office number appears to have changed recently.",
  sourceUrl: "https://example.gov.ph/contact",
  email: "resident@example.com",
  website: "",
};

function request(
  payload: unknown = validPayload,
  headers: Record<string, string> = {},
) {
  return new Request("https://bettermalaybalay.cloud/api/submissions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://bettermalaybalay.cloud",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

describe("Vercel Edge submissions API", () => {
  const originalEnv = process.env;

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it("dispatches notification email via Resend when configured", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key";
    process.env.CONTACT_EMAIL = "bettermc.org@gmail.com";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "resend_test_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await POST(request());

    expect(response.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test_dummy_key",
        }),
      }),
    );
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining("moderator review"),
    });
  });

  it("handles handler default export for POST requests", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key";

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "resend_test_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await handler(request());
    expect(response.status).toBe(201);
  });

  it("rejects non-POST methods with 405", async () => {
    const getRequest = new Request("https://bettermalaybalay.cloud/api/submissions", {
      method: "GET",
    });
    const response = await handler(getRequest);
    expect(response.status).toBe(405);
  });

  it("rejects cross-site browser submissions", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key";
    const response = await POST(
      request(validPayload, { origin: "https://attacker.example" }),
    );
    expect(response.status).toBe(403);
  });

  it("accepts valid submissions from barangay subdomains and vercel previews", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "resend_test_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const subdomainResponse = await POST(
      request(validPayload, {
        origin: "https://casisang.bettermalaybalay.cloud",
      }),
    );
    expect(subdomainResponse.status).toBe(201);

    const vercelResponse = await POST(
      request(validPayload, {
        origin: "https://bettermc-preview.vercel.app",
      }),
    );
    expect(vercelResponse.status).toBe(201);
  });

  it("returns 503 if RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(request());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining("bettermc.org@gmail.com"),
    });
  });
});
