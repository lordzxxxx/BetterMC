import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "./submissions";

const validPayload = {
  category: "correction",
  subject: "Correct an office contact",
  details: "The published office number appears to have changed recently.",
  sourceUrl: "https://example.gov.ph/contact",
  email: "resident@example.com",
  website: "",
};

class FakeStatement {
  constructor(
    private readonly query: string,
    private readonly recentCount: number,
  ) {}

  bind(...values: unknown[]) {
    void values;
    return this;
  }

  async first<T>() {
    return (this.query.includes("COUNT")
      ? { count: this.recentCount }
      : null) as T | null;
  }

  async run() {
    return { success: true };
  }
}

function database(recentCount = 0) {
  return {
    prepare(query: string) {
      return new FakeStatement(query, recentCount);
    },
  };
}

function request(
  payload: unknown = validPayload,
  headers: Record<string, string> = {},
) {
  return new Request("https://bettermc.example/api/submissions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://bettermc.example",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

describe("public submission API", () => {
  afterEach(() => vi.restoreAllMocks());

  it("saves a valid same-origin submission", async () => {
    const response = await onRequestPost({
      request: request(),
      env: { DB: database() },
    });

    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining("moderator review"),
    });
  });

  it("rejects cross-site browser submissions", async () => {
    const response = await onRequestPost({
      request: request(validPayload, { origin: "https://attacker.example" }),
      env: { DB: database() },
    });

    expect(response.status).toBe(403);
  });

  it("rejects oversized request bodies before parsing", async () => {
    const response = await onRequestPost({
      request: request(validPayload, { "content-length": "20000" }),
      env: { DB: database() },
    });

    expect(response.status).toBe(413);
  });

  it("accepts only public http or https source URLs", async () => {
    const response = await onRequestPost({
      request: request({ ...validPayload, sourceUrl: "file:///etc/passwd" }),
      env: { DB: database() },
    });

    expect(response.status).toBe(400);
  });

  it("enforces the hourly rate limit", async () => {
    const response = await onRequestPost({
      request: request(),
      env: { DB: database(5) },
    });

    expect(response.status).toBe(429);
  });

  it("fails closed when configured Turnstile verification is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const response = await onRequestPost({
      request: request({ ...validPayload, turnstileToken: "token" }),
      env: { DB: database(), TURNSTILE_SECRET_KEY: "test-secret" },
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining("verification failed"),
    });
  });
});
