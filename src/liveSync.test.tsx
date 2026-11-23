import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import announcementsHandler from "../api/announcements";
import App from "./App";
import { civicRecordings } from "./civicRecordings";
import {
  evaluateCivicAnnouncementRelevance,
  evaluateCivicRecordingTrigger,
  evaluatePesoOpportunityRelevance,
  mergeAnnouncementsWithLive,
  mergeOpportunitiesWithLive,
  mergeRecordingsWithLive,
  normalizeSocialText,
  OFFICIAL_LIVESTREAM_VIDEO_SOURCES,
  OFFICIAL_MALAYBALAY_SYNC_SOURCES,
  parseFacebookPluginTimeline,
  parseFacebookVideosTab,
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

  it("accurately triggers and extracts Vice Mayor Estelito 'Litoy' R. Marabe SP Regular Session livestreams and BAC/Bidding livestreams with thumbnails and embedded players", () => {
    const marabeChannel = OFFICIAL_LIVESTREAM_VIDEO_SOURCES.find(
      (c) => c.id === "fb-videos-vice-mayor-marabe",
    )!;
    const cityGovChannel = OFFICIAL_LIVESTREAM_VIDEO_SOURCES.find(
      (c) => c.id === "fb-videos-city-gov-malaybalay",
    )!;

    const mockMarabeVideosHtml = `
      <html><body><script>
      {"__typename":"ChannelTabVideoThumbnailWithReactionsRenderer","video":{
        "id":"9988776655443322",
        "publish_time":1795485600,
        "canonical_uri_with_fallback":"https://www.facebook.com/estelitolitoymarabe/videos/71st-regular-session/9988776655443322/",
        "savable_title":{"text":"71ST REGULAR SESSION"},
        "image":{"uri":"https://scontent.fmnl13-1.fna.fbcdn.net/v/t15.5256-10/71st_sp_session_thumb.jpg"},
        "video_thumbnail_overlays_renderer":{"video":{"broadcast_status":"VOD_READY","playable_duration":9125}},
        "creation_story":{"message":{"text":"71ST REGULAR SESSION - 10th Sangguniang Panlungsod of Malaybalay City presided by Vice Mayor Estelito Litoy R. Marabe"}}
      }}
      </script></body></html>
    `;

    const marabeNodes = parseFacebookVideosTab(mockMarabeVideosHtml, marabeChannel);
    expect(marabeNodes).toHaveLength(1);
    expect(marabeNodes[0].id).toBe("9988776655443322");
    expect(marabeNodes[0].duration).toBe("2:32:05");
    expect(marabeNodes[0].thumbnailUrl).toContain("71st_sp_session_thumb.jpg");
    expect(marabeNodes[0].embedUrl).toContain(
      "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Festelitolitoymarabe%2Fvideos%2F9988776655443322%2F",
    );

    const spRecording = evaluateCivicRecordingTrigger(marabeNodes[0]);
    expect(spRecording).not.toBeNull();
    expect(spRecording?.category).toBe("Legislative session");
    expect(spRecording?.publisher).toBe('Estelito "Litoy" R. Marabe');
    expect(spRecording?.title).toBe("71st Regular Session · 10th Sangguniang Panlungsod");
    expect(spRecording?.poster).toBe(
      "https://scontent.fmnl13-1.fna.fbcdn.net/v/t15.5256-10/71st_sp_session_thumb.jpg",
    );
    expect(spRecording?.embedUrl).toContain("facebook.com/plugins/video.php");

    const mockBacVideosHtml = `
      <html><body><script>
      {"__typename":"ChannelTabVideoThumbnailWithReactionsRenderer","video":{
        "id":"8877665544332211",
        "publish_time":1795572000,
        "savable_title":{"text":"Bids and Awards Committee Meeting"},
        "image":{"uri":"https://scontent.fmnl13-1.fna.fbcdn.net/v/t15.5256-10/bac_nov25_thumb.jpg"},
        "video_thumbnail_overlays_renderer":{"video":{"broadcast_status":"VOD_READY","playable_duration":10845}},
        "creation_story":{"message":{"text":"Bids and Awards Committee Meeting\\nPrice Schedule for Procurement Projects presented during the Pre-Bid Conference:\\nhttps://drive.google.com/drive/folders/16Y5k6czs9rs_bjZoc7By1AU7m4t9BRKL?usp=drive_link"}}
      }}
      </script></body></html>
    `;

    const bacNodes = parseFacebookVideosTab(mockBacVideosHtml, cityGovChannel);
    expect(bacNodes).toHaveLength(1);
    const bacRecording = evaluateCivicRecordingTrigger(bacNodes[0]);
    expect(bacRecording).not.toBeNull();
    expect(bacRecording?.category).toBe("BAC meeting");
    expect(bacRecording?.publisher).toBe("City Government of Malaybalay");
    expect(bacRecording?.duration).toBe("3:00:45");
    expect(bacRecording?.poster).toBe(
      "https://scontent.fmnl13-1.fna.fbcdn.net/v/t15.5256-10/bac_nov25_thumb.jpg",
    );
    expect(bacRecording?.relatedSource?.url).toContain(
      "drive.google.com/drive/folders/16Y5k6czs9rs_bjZoc7By1AU7m4t9BRKL",
    );

    const merged = mergeRecordingsWithLive(civicRecordings, [spRecording!, bacRecording!]);
    expect(merged.addedCount).toBe(2);
    expect(merged.merged[0].id).toBe("9988776655443322");
    expect(merged.merged[1].id).toBe("8877665544332211");
  });

  it("renders embedded SP Regular Session livestreams from Vice Mayor Marabe on /hearings and syncs new livestreams via the trigger button", async () => {
    const origFetch = globalThis.fetch;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (urlStr.includes("/api/announcements")) {
        return new Response(
          JSON.stringify({
            ok: true,
            recordings: [
              {
                id: "9988776655443322",
                title: "71st Regular Session · 10th Sangguniang Panlungsod",
                category: "Legislative session",
                publisher: 'Estelito "Litoy" R. Marabe',
                sourceUrl: "https://www.facebook.com/estelitolitoymarabe/videos/9988776655443322/",
                embedUrl:
                  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Festelitolitoymarabe%2Fvideos%2F9988776655443322%2F&show_text=false&width=900",
                duration: "2:32:05",
                eventDate: "24 November 2026",
                description:
                  'Full 71st regular session livestream recording published on Vice Mayor Estelito "Litoy" R. Marabe\'s public video page.',
                sourceContext:
                  "The Vice Mayor's public page identifies this livestream as the 71st regular session of Malaybalay City's 10th Sangguniang Panlungsod.",
                poster: "/images/recordings/1139814078783195.jpg",
              },
              ...civicRecordings,
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return origFetch(input, init);
    });

    render(
      <MemoryRouter initialEntries={["/hearings"]}>
        <App />
      </MemoryRouter>,
    );

    const syncVideosBtn = screen.getByRole("button", {
      name: /Sync latest Sangguniang Panlungsod session livestreams from Vice Mayor Estelito Litoy Marabe Facebook page/i,
    });
    fireEvent.click(syncVideosBtn);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Open 71st Regular Session · 10th Sangguniang Panlungsod/i,
        }),
      ).toBeInTheDocument();
    });

    // Open the newly synced 71st Regular Session card and play its embedded Facebook livestream
    fireEvent.click(
      screen.getByRole("button", {
        name: /Open 71st Regular Session · 10th Sangguniang Panlungsod/i,
      }),
    );
    const playBtn = screen.getByRole("button", { name: /Play original Facebook video/i });
    fireEvent.click(playBtn);
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toContain("9988776655443322");
  });
});
