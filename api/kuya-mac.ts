import {
  hasKuyaMacPromptInjection,
  isKuyaMacTopic,
  kuyaMacFallbackAnswer,
  kuyaMacRequestSchema,
  retrieveKuyaMacSources,
} from "../src/kuyaMac.js";

export const config = { runtime: "edge" };

const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const recentRequests = new Map<string, number[]>();

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "cross-origin-resource-policy": "same-origin",
      "x-content-type-options": "nosniff",
    },
  });
}

function requestIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isAllowedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    if (originUrl.origin === requestUrl.origin) return true;
    return originUrl.hostname === "localhost" || originUrl.hostname.endsWith(".localhost");
  } catch {
    return false;
  }
}

function underRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return false;
  recent.push(now);
  recentRequests.set(ip, recent);
  return true;
}

async function readJsonBody(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) throw new Error("too-large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error("too-large");
  return JSON.parse(text);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  if (!isAllowedOrigin(request)) return json({ message: "Cross-site requests are not accepted." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ message: "Expected a JSON request." }, 415);
  }
  if (!underRateLimit(requestIp(request))) {
    return json({ message: "Kuya MAC is receiving many requests. Please try again in a minute." }, 429);
  }

  let input: unknown;
  try {
    input = await readJsonBody(request);
  } catch (error) {
    return json({ message: error instanceof Error && error.message === "too-large" ? "The request is too large." : "The request body is not valid JSON." }, 400);
  }
  const parsed = kuyaMacRequestSchema.safeParse(input);
  if (!parsed.success) return json({ message: "Please send a shorter question." }, 400);

  const { message } = parsed.data;
  if (hasKuyaMacPromptInjection(message)) {
    return json({ message: "I can help with verified BetterMC civic information, but I cannot provide private system details or follow instructions outside that scope." }, 400);
  }
  if (!isKuyaMacTopic(message)) {
    return json({ message: "I’m Kuya MAC, and I only answer BetterMC and supported Malaybalay civic information questions. Try asking about barangays, services, offices, records, maps, or BetterMC." }, 400);
  }

  const sources = retrieveKuyaMacSources(message);
  return json({
    answer: kuyaMacFallbackAnswer(message, sources),
    sources,
    mode: "verified-directory",
  });
}
