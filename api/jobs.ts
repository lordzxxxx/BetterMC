import { resolveOpportunityLifecycle } from "../src/pesoData";
import {
  authenticateAdminRequest,
  jsonResponse,
  loadMergedOpportunities,
} from "./_lib/pesoSecurity";

export const config = {
  runtime: "edge",
};

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type")?.trim() ?? "";
  const statusFilter = url.searchParams.get("status")?.trim() ?? "";
  const queryFilter = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const includeDraftsRequested = url.searchParams.get("includeDrafts") === "1";

  const auth = includeDraftsRequested
    ? await authenticateAdminRequest(request)
    : { authenticated: false };

  const store = await loadMergedOpportunities();
  const now = new Date();

  const items = store.opportunities
    .map((opportunity) => ({
      ...opportunity,
      lifecycle: resolveOpportunityLifecycle(opportunity, now),
    }))
    .filter((item) => {
      if (!item.lifecycle.isVisibleToPublic && !auth.authenticated) {
        return false;
      }
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
    persistenceMode: store.persistenceMode,
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
