import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import announcementsHandler from "../api/announcements";
import App from "./App";
import {
  evaluateCivicAnnouncementRelevance,
  evaluatePesoOpportunityRelevance,
  mergeAnnouncementsWithLive,
  mergeOpportunitiesWithLive,
  normalizeSocialText,
  OFFICIAL_MALAYBALAY_SYNC_SOURCES,
  parseFacebookPluginTimeline,
  parseWordPressRssFeed,
  type RawSyncedFeedItem,
} from "./liveSync";
import { INITIAL_PESO_OPPORTUNITIES, pesoOpportunityInputSchema } from "./pesoData";
import { newsletterUpdates } from "./publicInformation";

describe("Automatic Malaybalay Facebook & LGU Website Live Sync Mechanism", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("normalizes Unicode Mathematical Bold/Italic social media headers into clean searchable ASCII", () => {
    const fancy = "🚨 𝐇𝐈𝐑𝐄𝐃 𝐎𝐍 𝐓𝐇𝐄 𝐒𝐏𝐎𝐓! 𝟏𝟐𝟎 𝐋𝐢𝐟𝐞𝐠𝐮𝐚𝐫𝐝𝐬 𝐔𝐧𝐝𝐞𝐫𝐠𝐨 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠";
    expect(normalizeSocialText(fancy)).toBe(
      "🚨 HIRED ON THE SPOT! 120 Lifeguards Undergo Training",
    );
  });

  it("parses Facebook Page Plugin timelinePosts JSON including shared City Government stories", () => {
    const pesoSource = OFFICIAL_MALAYBALAY_SYNC_SOURCES.find(
      (s) => s.id === "fb-peso-malaybalay",
    )!;
    const mockHtml = `
      <html><body><script>
      ServerJS.handle({"props":{"pageID":"61589180493733","pageName":"PESO Malaybalay City","timelinePosts":[
        {
          "message":"📢 JOB OPPORTUNITY ABROAD!\\n\\nOASIA GLOBAL RESOURCES, INC. is inviting applicants for DOMESTIC HELPER positions.\\n📅 Screening Interview: November 24–25, 2026\\n📍 Venue: Malaybalay New City Hall Lobby, Casisang, Malaybalay City",
          "createdTime":1795219305,
          "attachmentType":"photo"
        }
      ]}});
      </script></body></html>
    `;

    const items = parseFacebookPluginTimeline(mockHtml, pesoSource);
    expect(items).toHaveLength(1);
    expect(items[0].publishedIso).toBe("2026-11-21");
    expect(items[0].message).toContain("OASIA GLOBAL RESOURCES, INC.");
  });

  it("parses WordPress RSS feed XML from sakata.malaybalaycity.gov.ph", () => {
    const rssSource = OFFICIAL_MALAYBALAY_SYNC_SOURCES.find(
      (s) => s.id === "lgu-main-rss",
    )!;
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0"><channel>
        <item>
          <title>EXECUTIVE ORDER NO. 99 Series of 2026</title>
          <link>https://sakata.malaybalaycity.gov.ph/executive-order-no-99/</link>
          <pubDate>Tue, 24 Nov 2026 02:00:00 +0000</pubDate>
          <description><![CDATA[<p>An Order establishing the Malaybalay City Digital Public Service Hub at New City Hall.</p>]]></description>
        </item>
      </channel></rss>`;

    const items = parseWordPressRssFeed(mockXml, rssSource);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("EXECUTIVE ORDER NO. 99 Series of 2026");
    expect(items[0].sourceUrl).toBe("https://sakata.malaybalaycity.gov.ph/executive-order-no-99/");
  });

  it("accepts relevant Malaybalay civic announcements and rejects personal/non-civic social posts", () => {
    const baseItem: Omit<RawSyncedFeedItem, "message"> = {
      sourceId: "fb-mayor-pabillaran",
      sourceLabel: "Office of the City Mayor — Mayor Jay Warren R. Pabillaran",
      sourceUrl: "https://www.facebook.com/mayorwarrenpabillaran",
      channelRole: "executive",
      defaultCategory: "City Announcements",
      defaultInternalRoute: "/government",
      verificationTier: "Verified Public Announcement",
      publishedIso: "2026-11-24",
      publishedDisplay: "November 24, 2026",
      timestampMs: 1795480000000,
    };

    const personalBirthday = evaluateCivicAnnouncementRelevance({
      ...baseItem,
      message:
        "🎉 Happy Birthday to our wonderful staff member! Wishing you joy and birthday cheers today!",
    });
    expect(personalBirthday).toBeNull();

    const relevantCivicPost = evaluateCivicAnnouncementRelevance({
      ...baseItem,
      message:
        "Ordinance No. 1140, Series of 2026 Approved\nThe 10th Sangguniang Panlungsod and City Mayor approved Ordinance No. 1140 establishing expanded watershed protection across Malaybalay City barangays.",
    });
    expect(relevantCivicPost).not.toBeNull();
    expect(relevantCivicPost?.category).toBe("Resolutions & Ordinances");
    expect(relevantCivicPost?.internalRoute).toBe("/legislation");

    const mergedNews = mergeAnnouncementsWithLive(newsletterUpdates, [relevantCivicPost!]);
    expect(mergedNews.addedCount).toBe(1);
    expect(mergedNews.merged[0].id).toBe(relevantCivicPost!.id);
  });

  it("extracts schema-valid PesoOpportunity records from PESO Facebook job announcements and deduplicates", () => {
    const rawPesoPost: RawSyncedFeedItem = {
      sourceId: "fb-peso-malaybalay",
      sourceLabel: "PESO Malaybalay City — Official Facebook Page",
      sourceUrl: "https://www.facebook.com/profile.php?id=61589180493733",
      channelRole: "peso",
      defaultCategory: "City Announcements",
      defaultInternalRoute: "/peso",
      verificationTier: "Verified Public Announcement",
      message:
        "📢 URGENT HIRING: Bukidnon Agri-Processing Corp. is hiring 15 Production Technicians in Malaybalay City!\n📍 Venue: PESO Desk, 2nd Floor, New City Hall, Casisang, Malaybalay City\nSubmit your updated resume and valid ID at the PESO Desk.",
      publishedIso: "2026-11-24",
      publishedDisplay: "November 24, 2026",
      timestampMs: 1795480000000,
    };

    const extracted = evaluatePesoOpportunityRelevance(rawPesoPost);
    expect(extracted).not.toBeNull();
    expect(pesoOpportunityInputSchema.safeParse(extracted).success).toBe(true);

    const { merged, addedCount } = mergeOpportunitiesWithLive(INITIAL_PESO_OPPORTUNITIES, [
      extracted!,
    ]);
    expect(addedCount).toBe(1);
    expect(merged[0].slug).toBe(extracted!.slug);
  });

  it("renders the newly added November 2026 announcements and PESO job posts and syncs live updates on demand", async () => {
    const origFetch = globalThis.fetch;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (urlStr.includes("/api/announcements")) {
        return new Response(
          JSON.stringify({
            ok: true,
            checkedSourcesCount: 14,
            announcements: [
              {
                id: "live-new-city-water-advisory-2026",
                title: "MCGWSS & CEEDMO Water Supply Maintenance Advisory for Brgy. Casisang",
                description:
                  "Scheduled pipeline valve maintenance by CEEDMO-MCGWSS on November 26, 2026 in Barangay Casisang.",
                publishedDate: "November 24, 2026",
                category: "Public Advisories",
                verificationStatus: "Verified Public Announcement",
                sourceAttribution: "City Government of Malaybalay Official Feed",
                sourceUrl: "https://www.facebook.com/profile.php?id=100063747444247",
                internalRoute: "/offices/ceedmo",
              },
              ...newsletterUpdates,
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return origFetch(input, init);
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    // Verified November 2026 announcements are displayed immediately
    expect(
      screen.getByText(
        /Ordinance No\. 1132, s\. 2026: Ban on Election Paraphernalia & Ads on Public Trees Approved/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CDRRMO 120-Lifeguard Aquatic Rescue Training/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/PESO Malaybalay 11\/20 Job Fair \(26 Employers\)/i),
    ).toBeInTheDocument();

    // Clicking "Sync Live Updates" fetches /api/announcements and merges new live announcements
    const syncBtn = screen.getByRole("button", {
      name: /Sync latest updates from City of Malaybalay Facebook and website feeds/i,
    });
    fireEvent.click(syncBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/MCGWSS & CEEDMO Water Supply Maintenance Advisory/i),
      ).toBeInTheDocument();
    });
  });

  it("serves live-synced announcements from /api/announcements with category filtering and 405 method protection", async () => {
    const getRes = await announcementsHandler(
      new Request("https://www.bettermalaybalay.cloud/api/announcements?category=Resolutions%20%26%20Ordinances"),
    );
    expect(getRes.status).toBe(200);
    const json = (await getRes.json()) as {
      ok: boolean;
      total: number;
      announcements: Array<{ id: string; category: string; title: string }>;
    };
    expect(json.ok).toBe(true);
    expect(json.total).toBeGreaterThanOrEqual(3);
    expect(
      json.announcements.every((a) => a.category === "Resolutions & Ordinances"),
    ).toBe(true);
    expect(
      json.announcements.some((a) => a.title.includes("Ordinance No. 1132")),
    ).toBe(true);

    const postRes = await announcementsHandler(
      new Request("https://www.bettermalaybalay.cloud/api/announcements", { method: "POST" }),
    );
    expect(postRes.status).toBe(405);
  });
});
