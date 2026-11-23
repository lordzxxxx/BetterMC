import {
  OFFICIAL_MALAYBALAY_SYNC_SOURCES,
  syncLiveMalaybalayFeeds,
} from "../src/liveSync";
import {
  INITIAL_PESO_OPPORTUNITIES,
  resolveOpportunityLifecycle,
} from "../src/pesoData";

export const config = {
  runtime: "edge",
};

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
      ...extraHeaders,
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type")?.trim() ?? "";
  const statusFilter = url.searchParams.get("status")?.trim() ?? "";
  const queryFilter = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

  let sourceOpportunities = INITIAL_PESO_OPPORTUNITIES;
  let syncedAt = new Date().toISOString();
  let newlyAddedCount = 0;

  const pesoSources = OFFICIAL_MALAYBALAY_SYNC_SOURCES.filter(
    (s) =>
      s.channelRole === "peso" ||
      s.channelRole === "lgu-website" ||
      s.id === "fb-councilor-flores",
  );

  try {
    const syncResult = await syncLiveMalaybalayFeeds({
      sources: pesoSources,
      timeoutMs: 5000,
    });
    sourceOpportunities = syncResult.mergedOpportunities;
    syncedAt = syncResult.syncedAt;
    newlyAddedCount = syncResult.newlyAddedOpportunitiesCount;
  } catch {
    sourceOpportunities = INITIAL_PESO_OPPORTUNITIES;
  }

  const now = new Date();
  const items = sourceOpportunities
    .map((opportunity) => ({
      ...opportunity,
      lifecycle: resolveOpportunityLifecycle(opportunity, now),
    }))
    .filter((item) => {
      if (!item.lifecycle.isVisibleToPublic) return false;
      if (typeFilter && typeFilter !== "all" && item.opportunityType !== typeFilter) {
        return false;
      }
      if (statusFilter && statusFilter !== "all" && item.lifecycle.displayStatus !== statusFilter) {
        return false;
      }
      if (queryFilter) {
        const haystack = [
          item.title,
          item.employer,
          item.location,
          item.description,
          item.salaryGradeOrCompensation ?? "",
          ...item.qualifications,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(queryFilter)) return false;
      }
      return true;
    });

  return jsonResponse({
    ok: true,
    source: "code-managed",
    liveSync: "enabled",
    syncedAt,
    newlyAddedCount,
    total: items.length,
    opportunities: items,
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return GET(request);
  }
  return jsonResponse(
    { ok: false, error: "Method not allowed. Use GET for public job listings." },
    405,
    { Allow: "GET" },
  );
}
