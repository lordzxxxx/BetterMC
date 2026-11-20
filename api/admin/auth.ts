import { z } from "zod";
import {
  authenticateAdminRequest,
  clientIpFromRequest,
  createSignedSessionToken,
  formatSessionCookie,
  getAdminEnvStatus,
  isAllowedOrigin,
  isAuthRateLimited,
  jsonResponse,
  readBoundedJson,
  timingSafeEqualStrings,
} from "../_lib/pesoSecurity";

export const config = {
  runtime: "edge",
};

const loginSchema = z.object({
  passcode: z.string().min(4).max(256),
});

export async function GET(request: Request): Promise<Response> {
  const env = getAdminEnvStatus();
  const auth = await authenticateAdminRequest(request);
  return jsonResponse({
    ok: true,
    authenticated: auth.authenticated,
    authConfigured: env.authConfigured,
    storageConfigured: env.storageConfigured,
    actor: auth.authenticated ? auth.actor ?? "peso-admin" : null,
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: "Request origin is not permitted." }, 403);
  }

  const ip = clientIpFromRequest(request);
  if (isAuthRateLimited(ip)) {
    return jsonResponse(
      { ok: false, error: "Too many sign-in attempts. Please wait 10 minutes before retrying." },
      429,
      { "Retry-After": "600" },
    );
  }

  const env = getAdminEnvStatus();
  if (!env.authConfigured) {
    return jsonResponse(
      {
        ok: false,
        error:
          "PESO Admin authentication is not provisioned on this deployment yet. Configure BETTERMC_ADMIN_TOKEN and BETTERMC_SESSION_SECRET.",
      },
      503,
    );
  }

  const parsedBody = await readBoundedJson(request, 8 * 1024);
  if (parsedBody.error) {
    return jsonResponse({ ok: false, error: parsedBody.error }, parsedBody.status ?? 400);
  }

  const parsed = loginSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "Passcode is required." }, 400);
  }

  const valid = await timingSafeEqualStrings(parsed.data.passcode.trim(), env.adminToken);
  if (!valid) {
    return jsonResponse({ ok: false, error: "Invalid administrator passcode." }, 401);
  }

  const token = await createSignedSessionToken("peso-admin", env.sessionSecret);
  const cookieHeader = formatSessionCookie(token, request);

  return jsonResponse(
    {
      ok: true,
      authenticated: true,
      authConfigured: env.authConfigured,
      storageConfigured: env.storageConfigured,
    },
    200,
    { "Set-Cookie": cookieHeader },
  );
}

export async function DELETE(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: "Request origin is not permitted." }, 403);
  }
  const clearedCookie = formatSessionCookie("", request, 0);
  return jsonResponse({ ok: true, authenticated: false }, 200, { "Set-Cookie": clearedCookie });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") return GET(request);
  if (request.method === "POST") return POST(request);
  if (request.method === "DELETE") return DELETE(request);
  return jsonResponse({ ok: false, error: "Method not allowed." }, 405, { Allow: "GET, POST, DELETE" });
}
