import { z } from "zod";
import {
  pesoOpportunityInputSchema,
  resolveOpportunityLifecycle,
  type PesoOpportunity,
} from "../../src/pesoData";
import {
  authenticateAdminRequest,
  clientIpFromRequest,
  getAdminEnvStatus,
  isAllowedOrigin,
  isWriteRateLimited,
  jsonResponse,
  loadMergedOpportunities,
  readBoundedJson,
  saveOpportunityStoreState,
} from "../_lib/pesoSecurity";

export const config = {
  runtime: "edge",
};

const statusPatchSchema = z.object({
  slug: z.string().trim().min(3).max(96),
  publicationStatus: z.enum(["published", "draft", "archived"]),
});

async function guardAdminMutation(request: Request): Promise<
  | { ok: true; actor: string }
  | { ok: false; response: Response }
> {
  if (!isAllowedOrigin(request)) {
    return {
      ok: false,
      response: jsonResponse({ ok: false, error: "Request origin is not permitted." }, 403),
    };
  }
  const ip = clientIpFromRequest(request);
  if (isWriteRateLimited(ip)) {
    return {
      ok: false,
      response: jsonResponse({ ok: false, error: "Rate limit exceeded. Try again shortly." }, 429),
    };
  }
  const env = getAdminEnvStatus();
  if (!env.authConfigured) {
    return {
      ok: false,
      response: jsonResponse(
        { ok: false, error: "PESO Admin authentication env variables are not configured." },
        503,
      ),
    };
  }
  const auth = await authenticateAdminRequest(request);
  if (!auth.authenticated) {
    return {
      ok: false,
      response: jsonResponse({ ok: false, error: "Admin sign-in required." }, 401),
    };
  }
  if (!env.storageConfigured) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          error:
            "Server persistence store is not provisioned (configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Use Admin Local Preview / JSON export instead.",
        },
        503,
      ),
    };
  }
  return { ok: true, actor: auth.actor ?? "peso-admin" };
}

export async function GET(request: Request): Promise<Response> {
  const auth = await authenticateAdminRequest(request);
  if (!auth.configured) {
    return jsonResponse({ ok: false, error: "PESO Admin auth not configured." }, 503);
  }
  if (!auth.authenticated) {
    return jsonResponse({ ok: false, error: "Admin sign-in required." }, 401);
  }
  const store = await loadMergedOpportunities();
  const now = new Date();
  return jsonResponse({
    ok: true,
    persistenceMode: store.persistenceMode,
    opportunities: store.opportunities.map((item) => ({
      ...item,
      lifecycle: resolveOpportunityLifecycle(item, now),
    })),
  });
}

export async function POST(request: Request): Promise<Response> {
  const guard = await guardAdminMutation(request);
  if (!guard.ok) return guard.response;

  const bodyResult = await readBoundedJson(request);
  if (bodyResult.error) {
    return jsonResponse({ ok: false, error: bodyResult.error }, bodyResult.status ?? 400);
  }

  const parsed = pesoOpportunityInputSchema.safeParse(bodyResult.data);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid opportunity fields." },
      400,
    );
  }

  const store = await loadMergedOpportunities();
  if (store.opportunities.some((item) => item.slug === parsed.data.slug)) {
    return jsonResponse(
      { ok: false, error: `An opportunity with slug "${parsed.data.slug}" already exists.` },
      409,
    );
  }

  const nowIso = new Date().toISOString();
  const created: PesoOpportunity = {
    ...parsed.data,
    id: `peso-${crypto.randomUUID()}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    createdBy: "peso-admin",
  };

  const nextCustom = [created, ...store.storedCustomRecords.filter((r) => r.slug !== created.slug)];
  const nextDeleted = store.deletedSlugs.filter((s) => s !== created.slug);
  await saveOpportunityStoreState(nextCustom, nextDeleted, {
    action: "create",
    slug: created.slug,
    actor: guard.actor,
  });

  return jsonResponse(
    {
      ok: true,
      opportunity: { ...created, lifecycle: resolveOpportunityLifecycle(created) },
    },
    201,
  );
}

export async function PUT(request: Request): Promise<Response> {
  const guard = await guardAdminMutation(request);
  if (!guard.ok) return guard.response;

  const bodyResult = await readBoundedJson(request);
  if (bodyResult.error) {
    return jsonResponse({ ok: false, error: bodyResult.error }, bodyResult.status ?? 400);
  }

  const parsed = pesoOpportunityInputSchema.safeParse(bodyResult.data);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid opportunity fields." },
      400,
    );
  }

  const store = await loadMergedOpportunities();
  const existing = store.opportunities.find((item) => item.slug === parsed.data.slug);
  if (!existing) {
    return jsonResponse(
      { ok: false, error: `Opportunity "${parsed.data.slug}" not found.` },
      404,
    );
  }

  const nowIso = new Date().toISOString();
  const updated: PesoOpportunity = {
    ...existing,
    ...parsed.data,
    updatedAt: nowIso,
  };

  const nextCustom = [updated, ...store.storedCustomRecords.filter((r) => r.slug !== updated.slug)];
  await saveOpportunityStoreState(nextCustom, store.deletedSlugs, {
    action: "update",
    slug: updated.slug,
    actor: guard.actor,
  });

  return jsonResponse({
    ok: true,
    opportunity: { ...updated, lifecycle: resolveOpportunityLifecycle(updated) },
  });
}

export async function PATCH(request: Request): Promise<Response> {
  const guard = await guardAdminMutation(request);
  if (!guard.ok) return guard.response;

  const bodyResult = await readBoundedJson(request, 8 * 1024);
  if (bodyResult.error) {
    return jsonResponse({ ok: false, error: bodyResult.error }, bodyResult.status ?? 400);
  }

  const parsed = statusPatchSchema.safeParse(bodyResult.data);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "Invalid status update payload." }, 400);
  }

  const store = await loadMergedOpportunities();
  const existing = store.opportunities.find((item) => item.slug === parsed.data.slug);
  if (!existing) {
    return jsonResponse({ ok: false, error: "Opportunity not found." }, 404);
  }

  const updated: PesoOpportunity = {
    ...existing,
    publicationStatus: parsed.data.publicationStatus,
    updatedAt: new Date().toISOString(),
  };

  const nextCustom = [updated, ...store.storedCustomRecords.filter((r) => r.slug !== updated.slug)];
  await saveOpportunityStoreState(nextCustom, store.deletedSlugs, {
    action: parsed.data.publicationStatus,
    slug: updated.slug,
    actor: guard.actor,
  });

  return jsonResponse({
    ok: true,
    opportunity: { ...updated, lifecycle: resolveOpportunityLifecycle(updated) },
  });
}

export async function DELETE(request: Request): Promise<Response> {
  const guard = await guardAdminMutation(request);
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim().toLowerCase() ?? "";
  if (!slug) {
    return jsonResponse({ ok: false, error: "Specify ?slug=<opportunity-slug> to delete." }, 400);
  }

  const store = await loadMergedOpportunities();
  const existing = store.opportunities.find((item) => item.slug === slug);
  if (!existing) {
    return jsonResponse({ ok: false, error: "Opportunity not found." }, 404);
  }

  const nextCustom = store.storedCustomRecords.filter((r) => r.slug !== slug);
  const nextDeleted = existing.seedLocked
    ? [...new Set([...store.deletedSlugs, slug])]
    : store.deletedSlugs;

  await saveOpportunityStoreState(nextCustom, nextDeleted, {
    action: "delete",
    slug,
    actor: guard.actor,
  });

  return jsonResponse({ ok: true, deletedSlug: slug });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") return GET(request);
  if (request.method === "POST") return POST(request);
  if (request.method === "PUT") return PUT(request);
  if (request.method === "PATCH") return PATCH(request);
  if (request.method === "DELETE") return DELETE(request);
  return jsonResponse(
    { ok: false, error: "Method not allowed." },
    405,
    { Allow: "GET, POST, PUT, PATCH, DELETE" },
  );
}
