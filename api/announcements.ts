import { civicRecordings } from "../src/civicRecordings";
import {
  OFFICIAL_LIVESTREAM_VIDEO_SOURCES,
  OFFICIAL_MALAYBALAY_SYNC_SOURCES,
  syncLiveMalaybalayFeeds,
} from "../src/liveSync";
import { newsletterUpdates } from "../src/publicInformation";

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
  const categoryFilter = url.searchParams.get("category")?.trim() ?? "";

  try {
    const syncResult = await syncLiveMalaybalayFeeds({ timeoutMs: 5500 });
    const items =
      categoryFilter && categoryFilter !== "All"
        ? syncResult.mergedAnnouncements.filter((item) => item.category === categoryFilter)
        : syncResult.mergedAnnouncements;

    return jsonResponse({
      ok: true,
      source: "live-synced",
      syncedAt: syncResult.syncedAt,
      checkedSourcesCount: syncResult.checkedSourcesCount,
      rawItemsCount: syncResult.rawItemsCount,
      newlyAddedCount: syncResult.newlyAddedAnnouncementsCount,
      newlyAddedRecordingsCount: syncResult.newlyAddedRecordingsCount,
      total: items.length,
      announcements: items,
      liveDetected: syncResult.liveAnnouncements,
      recordings: syncResult.mergedRecordings,
      liveRecordings: syncResult.liveRecordings,
      monitoredSources: [
        ...OFFICIAL_MALAYBALAY_SYNC_SOURCES.map((s) => ({
          id: s.id,
          label: s.label,
          url: s.url,
          kind: s.kind,
        })),
        ...OFFICIAL_LIVESTREAM_VIDEO_SOURCES.map((v) => ({
          id: v.id,
          label: v.label,
          url: v.videosPageUrl,
          kind: "facebook-videos-tab",
        })),
      ],
    });
  } catch {
    const items =
      categoryFilter && categoryFilter !== "All"
        ? newsletterUpdates.filter((item) => item.category === categoryFilter)
        : newsletterUpdates;

    return jsonResponse({
      ok: true,
      source: "verified-baseline",
      syncedAt: new Date().toISOString(),
      checkedSourcesCount:
        OFFICIAL_MALAYBALAY_SYNC_SOURCES.length + OFFICIAL_LIVESTREAM_VIDEO_SOURCES.length,
      rawItemsCount: 0,
      newlyAddedCount: 0,
      newlyAddedRecordingsCount: 0,
      total: items.length,
      announcements: items,
      liveDetected: [],
      recordings: civicRecordings,
      liveRecordings: [],
    });
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return GET(request);
  }
  return jsonResponse(
    { ok: false, error: "Method not allowed. Use GET for public announcements." },
    405,
    { Allow: "GET" },
  );
}
