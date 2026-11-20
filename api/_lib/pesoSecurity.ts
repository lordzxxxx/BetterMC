import {
  INITIAL_PESO_OPPORTUNITIES,
  pesoOpportunitySchema,
  type PesoOpportunity,
} from "../../src/pesoData";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 12;
const WRITE_MAX_ATTEMPTS = 60;
const authAttemptsByIp = new Map<string, { count: number; resetAt: number }>();
const writeAttemptsByIp = new Map<string, { count: number; resetAt: number }>();

export const SESSION_COOKIE_NAME = "bm_peso_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const KV_RECORDS_KEY = "bettermc:peso:opportunities:v1";
const KV_TOMBSTONES_KEY = "bettermc:peso:deleted:v1";
const KV_AUDIT_KEY = "bettermc:peso:audit:v1";

function getEnv(name: string): string {
  if (typeof process !== "undefined" && process.env) {
    return (process.env[name] ?? "").trim();
  }
  return "";
}

export function resetSecurityRateLimitsForTests() {
  authAttemptsByIp.clear();
  writeAttemptsByIp.clear();
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkBucket(
  store: Map<string, { count: number; resetAt: number }>,
  ip: string,
  maxCount: number,
): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= maxCount) return true;
  entry.count += 1;
  return false;
}

export const isAuthRateLimited = (ip: string) =>
  checkBucket(authAttemptsByIp, ip, AUTH_MAX_ATTEMPTS);

export const isWriteRateLimited = (ip: string) =>
  checkBucket(writeAttemptsByIp, ip, WRITE_MAX_ATTEMPTS);

export function isAllowedOrigin(request: Request): boolean {
  const rawOrigin = request.headers.get("origin");
  const rawReferer = request.headers.get("referer");
  const candidate = rawOrigin ?? rawReferer;
  if (!candidate) return true; // non-browser curl / server calls handled by token/session check

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  if (
    host === "bettermalaybalay.cloud" ||
    host.endsWith(".bettermalaybalay.cloud") ||
    host === "bettergov.org" ||
    host.endsWith(".bettergov.org") ||
    host === "bettermc.ph" ||
    host.endsWith(".bettermc.ph") ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
    return true;
  }
  if (/^(bettermc|bettermalaybalay|better-mc)(-[a-z0-9-]+)?\.vercel\.app$/.test(host)) {
    return true;
  }
  const configuredOrigin = getEnv("ALLOWED_ORIGIN");
  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }
  return false;
}

export function jsonResponse(
  body: unknown,
  status = 200,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
      ...headers,
    },
  });
}

export async function readBoundedJson(
  request: Request,
  maxBytes = 64 * 1024,
): Promise<{ data?: unknown; error?: string; status?: number }> {
  const lenHeader = request.headers.get("content-length");
  if (lenHeader) {
    const num = Number(lenHeader);
    if (Number.isFinite(num) && num > maxBytes) {
      return { error: "Payload exceeds maximum allowed size.", status: 413 };
    }
  }
  try {
    const text = await request.text();
    const bytes = new TextEncoder().encode(text).length;
    if (bytes > maxBytes) {
      return { error: "Payload exceeds maximum allowed size.", status: 413 };
    }
    return { data: text ? JSON.parse(text) : {} };
  } catch {
    return { error: "Malformed JSON request body.", status: 400 };
  }
}

export function getAdminEnvStatus() {
  const adminToken = getEnv("BETTERMC_ADMIN_TOKEN") || getEnv("BETTERMC_ADMIN_PASSWORD");
  const sessionSecret = getEnv("BETTERMC_SESSION_SECRET") || adminToken;
  const kvUrl = getEnv("UPSTASH_REDIS_REST_URL") || getEnv("KV_REST_API_URL");
  const kvToken = getEnv("UPSTASH_REDIS_REST_TOKEN") || getEnv("KV_REST_API_TOKEN");

  return {
    authConfigured: Boolean(adminToken && sessionSecret),
    storageConfigured: Boolean(kvUrl && kvToken),
    adminToken,
    sessionSecret,
    kvUrl: kvUrl.replace(/\/+$/, ""),
    kvToken,
  };
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  } catch {
    return null;
  }
}

async function sha256Bytes(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

export async function timingSafeEqualStrings(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256Bytes(a), sha256Bytes(b)]);
  if (ha.length !== hb.length) return false;
  let diff = 0;
  for (let i = 0; i < ha.length; i += 1) {
    diff |= ha[i] ^ hb[i];
  }
  return diff === 0;
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(new Uint8Array(sig));
}

export async function createSignedSessionToken(
  actor: string,
  secret: string,
  nowMs = Date.now(),
): Promise<string> {
  const exp = Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS;
  const payloadJson = JSON.stringify({ sub: actor, role: "peso-admin", exp });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadJson));
  const sig = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export async function verifySignedSessionToken(
  token: string,
  secret: string,
  nowMs = Date.now(),
): Promise<{ valid: boolean; actor?: string }> {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return { valid: false };

  const expectedSig = await hmacSign(payloadB64, secret);
  const equal = await timingSafeEqualStrings(sigB64, expectedSig);
  if (!equal) return { valid: false };

  const decoded = fromBase64Url(payloadB64);
  if (!decoded) return { valid: false };
  try {
    const parsed = JSON.parse(new TextDecoder().decode(decoded)) as {
      sub?: string;
      role?: string;
      exp?: number;
    };
    if (parsed.role !== "peso-admin" || typeof parsed.exp !== "number") {
      return { valid: false };
    }
    if (parsed.exp <= Math.floor(nowMs / 1000)) {
      return { valid: false };
    }
    return { valid: true, actor: parsed.sub || "peso-admin" };
  } catch {
    return { valid: false };
  }
}

export function parseCookieHeader(cookieHeader: string | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) map.set(key, decodeURIComponent(val));
  }
  return map;
}

export function formatSessionCookie(value: string, request: Request, maxAge = SESSION_TTL_SECONDS): string {
  const url = new URL(request.url);
  const isHttps = url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ];
  if (isHttps) parts.push("Secure");
  return parts.join("; ");
}

export async function authenticateAdminRequest(request: Request): Promise<{
  authenticated: boolean;
  configured: boolean;
  actor?: string;
}> {
  const env = getAdminEnvStatus();
  if (!env.authConfigured) {
    return { authenticated: false, configured: false };
  }

  // Support Bearer token (for server-to-server / CLI publishing) OR HttpOnly signed cookie
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const supplied = authHeader.slice(7).trim();
    const matched = await timingSafeEqualStrings(supplied, env.adminToken);
    if (matched) return { authenticated: true, configured: true, actor: "api-token" };
  }

  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const cookieToken = cookies.get(SESSION_COOKIE_NAME);
  if (!cookieToken) {
    return { authenticated: false, configured: true };
  }
  const verified = await verifySignedSessionToken(cookieToken, env.sessionSecret);
  return verified.valid
    ? { authenticated: true, configured: true, actor: verified.actor }
    : { authenticated: false, configured: true };
}

async function kvGet(kvUrl: string, kvToken: string, key: string): Promise<string | null> {
  const res = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${kvToken}` },
  });
  if (!res.ok) throw new Error(`KV read failed (${res.status})`);
  const json = (await res.json()) as { result?: string | null };
  return json.result ?? null;
}

async function kvSet(kvUrl: string, kvToken: string, key: string, value: string): Promise<void> {
  const res = await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken}`,
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: value,
  });
  if (!res.ok) throw new Error(`KV write failed (${res.status})`);
}

export type MergedOpportunitiesResult = {
  opportunities: PesoOpportunity[];
  persistenceMode: "kv-rest" | "static-readonly";
  storedCustomRecords: PesoOpportunity[];
  deletedSlugs: string[];
};

export async function loadMergedOpportunities(): Promise<MergedOpportunitiesResult> {
  const env = getAdminEnvStatus();
  if (!env.storageConfigured) {
    return {
      opportunities: [...INITIAL_PESO_OPPORTUNITIES],
      persistenceMode: "static-readonly",
      storedCustomRecords: [],
      deletedSlugs: [],
    };
  }

  const storedRecords: PesoOpportunity[] = [];
  let deletedSlugs: string[] = [];

  try {
    const raw = await kvGet(env.kvUrl, env.kvToken, KV_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const check = pesoOpportunitySchema.safeParse(item);
          if (check.success) storedRecords.push(check.data);
        }
      }
    }
    const rawDeleted = await kvGet(env.kvUrl, env.kvToken, KV_TOMBSTONES_KEY);
    if (rawDeleted) {
      const parsedDel = JSON.parse(rawDeleted) as unknown;
      if (Array.isArray(parsedDel)) {
        deletedSlugs = parsedDel.filter((v): v is string => typeof v === "string");
      }
    }
  } catch {
    // Degrade gracefully on read while reporting configured persistence
  }

  const bySlug = new Map<string, PesoOpportunity>();
  for (const seed of INITIAL_PESO_OPPORTUNITIES) {
    if (!deletedSlugs.includes(seed.slug)) {
      bySlug.set(seed.slug, seed);
    }
  }
  for (const rec of storedRecords) {
    bySlug.set(rec.slug, rec);
  }

  const opportunities = [...bySlug.values()].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );

  return {
    opportunities,
    persistenceMode: "kv-rest",
    storedCustomRecords: storedRecords,
    deletedSlugs,
  };
}

export async function saveOpportunityStoreState(
  records: PesoOpportunity[],
  deletedSlugs: string[],
  auditEntry?: { action: string; slug: string; actor: string },
): Promise<void> {
  const env = getAdminEnvStatus();
  if (!env.storageConfigured) {
    throw new Error("Server persistence is not configured.");
  }
  await kvSet(env.kvUrl, env.kvToken, KV_RECORDS_KEY, JSON.stringify(records));
  await kvSet(env.kvUrl, env.kvToken, KV_TOMBSTONES_KEY, JSON.stringify(deletedSlugs));
  if (auditEntry) {
    const existingRaw = await kvGet(env.kvUrl, env.kvToken, KV_AUDIT_KEY).catch(() => null);
    const logs = existingRaw ? (JSON.parse(existingRaw) as unknown[]) : [];
    const nextLogs = [
      { ...auditEntry, timestamp: new Date().toISOString() },
      ...(Array.isArray(logs) ? logs.slice(0, 99) : []),
    ];
    await kvSet(env.kvUrl, env.kvToken, KV_AUDIT_KEY, JSON.stringify(nextLogs)).catch(() => {});
  }
}
