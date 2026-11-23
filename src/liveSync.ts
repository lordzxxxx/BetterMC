import {
  buildFacebookVideoEmbedUrl,
  civicRecordings,
  type CivicRecording,
} from "./civicRecordings";
import {
  INITIAL_PESO_OPPORTUNITIES,
  PESO_FACEBOOK_PAGE_URL,
  pesoOpportunityInputSchema,
  slugifyOpportunityTitle,
  type OpportunityType,
  type PesoOpportunity,
} from "./pesoData";
import {
  newsletterUpdates,
  OFFICIAL_CITY_FB_URL,
  type NewsCardCategory,
  type NewsletterUpdateCard,
  type VerificationTier,
} from "./publicInformation";

export type OfficialVideoChannelConfig = {
  id: string;
  label: string;
  videosPageUrl: string;
  baseVideoUrlPrefix: string;
  publisher: string;
  channelRole: "legislative-video" | "procurement-video" | "lgu-video" | "executive-video";
  defaultCategory: CivicRecording["category"];
};

export const OFFICIAL_LIVESTREAM_VIDEO_SOURCES: OfficialVideoChannelConfig[] = [
  {
    id: "fb-videos-vice-mayor-marabe",
    label: "Office of the City Vice Mayor — Estelito “Litoy” R. Marabe (SP Regular Session Livestreams)",
    videosPageUrl: "https://www.facebook.com/estelitolitoymarabe/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/estelitolitoymarabe/videos",
    publisher: 'Estelito "Litoy" R. Marabe',
    channelRole: "legislative-video",
    defaultCategory: "Legislative session",
  },
  {
    id: "fb-videos-city-gov-malaybalay",
    label: "City Government of Malaybalay — Official BAC & City Activity Livestreams",
    videosPageUrl: "https://www.facebook.com/100063747444247/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/100063747444247/videos",
    publisher: "City Government of Malaybalay",
    channelRole: "lgu-video",
    defaultCategory: "BAC meeting",
  },
  {
    id: "fb-videos-bac-malaybalay",
    label: "BAC LGU Malaybalay — Official Procurement Livestream Page",
    videosPageUrl: "https://www.facebook.com/bacmalaybalay/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/bacmalaybalay/videos",
    publisher: "BAC LGU Malaybalay",
    channelRole: "procurement-video",
    defaultCategory: "BAC meeting",
  },
  {
    id: "fb-videos-mayor-pabillaran",
    label: "Office of the City Mayor — Mayor Jay Warren R. Pabillaran (Makisayud Livestreams)",
    videosPageUrl: "https://www.facebook.com/mayorwarrenpabillaran/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/mayorwarrenpabillaran/videos",
    publisher: "Mayor Warren Pabillaran",
    channelRole: "executive-video",
    defaultCategory: "City activity",
  },
];

export type RawSyncedVideoNode = {
  id: string;
  channelId: string;
  publisher: string;
  channelRole: OfficialVideoChannelConfig["channelRole"];
  defaultCategory: CivicRecording["category"];
  title: string;
  caption: string;
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration?: string;
  broadcastStatus?: string;
  eventDate: string;
  publishedIso: string;
  timestampMs: number;
};

export type OfficialFeedSourceConfig = {
  id: string;
  label: string;
  url: string;
  kind: "wordpress-rss" | "facebook-plugin";
  channelRole:
    | "lgu-website"
    | "peso"
    | "executive"
    | "legislative"
    | "procurement"
    | "department";
  defaultCategory: NewsCardCategory;
  defaultInternalRoute: string;
  verificationTier: VerificationTier;
};

export const OFFICIAL_MALAYBALAY_SYNC_SOURCES: OfficialFeedSourceConfig[] = [
  {
    id: "lgu-main-rss",
    label: "City Government of Malaybalay — Official Website Feed",
    url: "https://sakata.malaybalaycity.gov.ph/feed/",
    kind: "wordpress-rss",
    channelRole: "lgu-website",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/legislation",
    verificationTier: "Confirmed Official Record",
  },
  {
    id: "lgu-announcements-rss",
    label: "City Government of Malaybalay — Public Announcements Archive",
    url: "https://sakata.malaybalaycity.gov.ph/category/public-annoucement/feed/",
    kind: "wordpress-rss",
    channelRole: "lgu-website",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/legislation",
    verificationTier: "Confirmed Official Record",
  },
  {
    id: "fb-peso-malaybalay",
    label: "PESO Malaybalay City — Official Facebook Page",
    url: PESO_FACEBOOK_PAGE_URL,
    kind: "facebook-plugin",
    channelRole: "peso",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/peso",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-mayor-pabillaran",
    label: "Office of the City Mayor — Mayor Jay Warren R. Pabillaran",
    url: "https://www.facebook.com/mayorwarrenpabillaran",
    kind: "facebook-plugin",
    channelRole: "executive",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/government",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-vice-mayor-marabe",
    label: "Office of the City Vice Mayor — Estelito “Litoy” R. Marabe",
    url: "https://www.facebook.com/estelitolitoymarabe",
    kind: "facebook-plugin",
    channelRole: "legislative",
    defaultCategory: "Council & Legislative",
    defaultInternalRoute: "/hearings",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-bac-malaybalay",
    label: "BAC LGU Malaybalay — Official Procurement Page",
    url: "https://www.facebook.com/bacmalaybalay",
    kind: "facebook-plugin",
    channelRole: "procurement",
    defaultCategory: "Procurement & Bidding",
    defaultInternalRoute: "/procurement/livestreams",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-bpld-malaybalay",
    label: "CMO–BPLD Malaybalay City — Business Permits & Licensing",
    url: "https://www.facebook.com/bpld.malaybalaycity",
    kind: "facebook-plugin",
    channelRole: "department",
    defaultCategory: "Public Advisories",
    defaultInternalRoute: "/offices/bpld",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-agri-malaybalay",
    label: "Malaybalay City Agri-NEWS — City Agriculture Office",
    url: "https://www.facebook.com/mlyblyAgriNews/",
    kind: "facebook-plugin",
    channelRole: "department",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/offices/agriculture",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-vet-malaybalay",
    label: "City Veterinary Office — City of Malaybalay",
    url: "https://www.facebook.com/p/City-Veterinary-Office-City-of-Malaybalay-100064138659249/",
    kind: "facebook-plugin",
    channelRole: "department",
    defaultCategory: "Public Advisories",
    defaultInternalRoute: "/offices/veterinary",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-obo-malaybalay",
    label: "Office of the Building Official (OBO Malaybalay)",
    url: "https://www.facebook.com/profile.php?id=100089883944248",
    kind: "facebook-plugin",
    channelRole: "department",
    defaultCategory: "Public Advisories",
    defaultInternalRoute: "/offices/obo",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-councilor-legaspi",
    label: "10th Sangguniang Panlungsod — Councilor Alan Ryann O. Legaspi",
    url: "https://www.facebook.com/KonsehalManoyLegaspi",
    kind: "facebook-plugin",
    channelRole: "legislative",
    defaultCategory: "Resolutions & Ordinances",
    defaultInternalRoute: "/legislation",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-councilor-flores",
    label: "10th Sangguniang Panlungsod — Councilor Brian Nelson T. Flores",
    url: "https://www.facebook.com/profile.php?id=100076097234513",
    kind: "facebook-plugin",
    channelRole: "legislative",
    defaultCategory: "Public Advisories",
    defaultInternalRoute: "/hearings",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-councilor-sangalang",
    label: "10th Sangguniang Panlungsod — Councilor Atty. Rendon P. Sangalang",
    url: "https://www.facebook.com/AttyRendonJojoSangalang",
    kind: "facebook-plugin",
    channelRole: "legislative",
    defaultCategory: "Council & Legislative",
    defaultInternalRoute: "/hearings",
    verificationTier: "Verified Public Announcement",
  },
  {
    id: "fb-councilor-tortola",
    label: "10th Sangguniang Panlungsod — SK Federation Pres. Christopher Lambert Tortola",
    url: "https://www.facebook.com/sp.cristopher.lambert.tortola",
    kind: "facebook-plugin",
    channelRole: "legislative",
    defaultCategory: "City Announcements",
    defaultInternalRoute: "/hearings",
    verificationTier: "Verified Public Announcement",
  },
];

export type RawSyncedFeedItem = {
  sourceId: string;
  sourceLabel: string;
  sourceUrl: string;
  channelRole: OfficialFeedSourceConfig["channelRole"];
  defaultCategory: NewsCardCategory;
  defaultInternalRoute: string;
  verificationTier: VerificationTier;
  title?: string;
  message: string;
  publishedIso: string; // YYYY-MM-DD
  publishedDisplay: string; // e.g. "November 23, 2026"
  timestampMs: number;
  externalLink?: string;
};

/**
 * Normalizes Unicode Mathematical Bold / Italic characters (commonly used in
 * Facebook headers like "𝐇𝐈𝐑𝐄𝐃 𝐎𝐍 𝐓𝐇𝐄 𝐒𝐏𝐎𝐓") into standard readable ASCII
 * while preserving Philippine Peso signs (₱), accents, and line breaks.
 */
export function normalizeSocialText(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;|&apos;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;|&hellip;/g, "...")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

export function formatManilaDisplayDate(timestampMs: number): {
  iso: string;
  display: string;
} {
  const safeMs = Number.isFinite(timestampMs) && timestampMs > 0 ? timestampMs : Date.now();
  const manilaMs = safeMs + 8 * 60 * 60 * 1000;
  const iso = new Date(manilaMs).toISOString().slice(0, 10);
  const display = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(safeMs));
  return { iso, display };
}

/**
 * Extracts a JSON array property (such as `"timelinePosts":[...]`) from a
 * Facebook Page Plugin HTML response using balanced bracket scanning.
 */
export function extractJsonArrayFromHtml(html: string, key: string): unknown[] | null {
  const marker = `"${key}":`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const arrStart = html.indexOf("[", idx + marker.length);
  if (arrStart === -1) return null;

  let depth = 0;
  let inStr = false;
  let escaped = false;
  for (let i = arrStart; i < html.length; i++) {
    const ch = html[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inStr = !inStr;
      continue;
    }
    if (!inStr) {
      if (ch === "[") {
        depth += 1;
      } else if (ch === "]") {
        depth -= 1;
        if (depth === 0) {
          try {
            const parsed = JSON.parse(html.slice(arrStart, i + 1));
            return Array.isArray(parsed) ? parsed : null;
          } catch {
            return null;
          }
        }
      }
    }
  }
  return null;
}

type RawFbTimelinePost = {
  message?: string | null;
  createdTime?: number | null;
  attachedStory?: {
    actorName?: string | null;
    message?: string | null;
    createdTime?: number | null;
  } | null;
};

/**
 * Parses a Facebook Page Plugin HTML document (`plugins/page.php`) into normalized
 * `RawSyncedFeedItem` objects, including shared stories from `City Government of Malaybalay`.
 */
export function parseFacebookPluginTimeline(
  html: string,
  source: OfficialFeedSourceConfig,
): RawSyncedFeedItem[] {
  const rawPosts = extractJsonArrayFromHtml(html, "timelinePosts") as RawFbTimelinePost[] | null;
  if (!rawPosts || rawPosts.length === 0) return [];

  const results: RawSyncedFeedItem[] = [];
  for (const post of rawPosts) {
    const ownMsg = normalizeSocialText(post.message ?? "");
    const attachedActor = normalizeSocialText(post.attachedStory?.actorName ?? "");
    const attachedMsg = normalizeSocialText(post.attachedStory?.message ?? "");

    let combinedMsg = ownMsg;
    let effectiveSourceLabel = source.label;
    let effectiveSourceUrl = source.url;

    if (attachedMsg) {
      const isOfficialAttached =
        /City Government of Malaybalay|PESO Malaybalay|Ceedmo Malaybalay|BUKSU/i.test(attachedActor);
      if (!ownMsg || ownMsg.length < 40 || /^malaybalay city agri-news$/i.test(ownMsg)) {
        combinedMsg = attachedMsg;
        if (/City Government of Malaybalay/i.test(attachedActor)) {
          effectiveSourceLabel = `City Government of Malaybalay (via ${source.label.split("—")[0].trim()})`;
          effectiveSourceUrl = source.url;
        }
      } else if (isOfficialAttached && !ownMsg.includes(attachedMsg.slice(0, 40))) {
        combinedMsg = `${ownMsg}\n\n${attachedMsg}`;
      }
    }

    if (!combinedMsg) continue;
    const unixSec = post.createdTime || post.attachedStory?.createdTime || Math.floor(Date.now() / 1000);
    const timestampMs = unixSec * 1000;
    const { iso, display } = formatManilaDisplayDate(timestampMs);

    // Extract any embedded Google Drive or malaybalaycity.gov.ph URL
    const embeddedLinkMatch = combinedMsg.match(
      /https?:\/\/(?:sakata\.malaybalaycity\.gov\.ph|drive\.google\.com)\/[^\s)]+/i,
    );

    results.push({
      sourceId: source.id,
      sourceLabel: effectiveSourceLabel,
      sourceUrl: effectiveSourceUrl,
      channelRole: source.channelRole,
      defaultCategory: source.defaultCategory,
      defaultInternalRoute: source.defaultInternalRoute,
      verificationTier: source.verificationTier,
      message: combinedMsg,
      publishedIso: iso,
      publishedDisplay: display,
      timestampMs,
      externalLink: embeddedLinkMatch ? embeddedLinkMatch[0] : undefined,
    });
  }

  return results;
}

/**
 * Parses a WordPress RSS 2.0 XML feed from `sakata.malaybalaycity.gov.ph/feed/`.
 */
export function parseWordPressRssFeed(
  xml: string,
  source: OfficialFeedSourceConfig,
): RawSyncedFeedItem[] {
  if (!xml || !xml.includes("<item>")) return [];
  const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  const results: RawSyncedFeedItem[] = [];

  for (const match of itemBlocks) {
    const block = match[1];
    const rawTitle = (block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] ?? "";
    const rawLink = (block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] ?? "";
    const rawPubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] ?? "";
    const rawDesc =
      (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
        block.match(/<description>([\s\S]*?)<\/description>/i) ||
        [])[1] ?? "";

    const title = normalizeSocialText(decodeHtmlEntities(rawTitle.replace(/<[^>]+>/g, " ")));
    const description = normalizeSocialText(
      decodeHtmlEntities(rawDesc.replace(/<[^>]+>/g, " ")).replace(
        /\s*continue reading\s*:.*$/i,
        "",
      ),
    );
    const link = rawLink.trim() || source.url;
    if (!title) continue;

    const parsedMs = Date.parse(rawPubDate.trim());
    const timestampMs = Number.isFinite(parsedMs) ? parsedMs : Date.now();
    const { iso, display } = formatManilaDisplayDate(timestampMs);

    results.push({
      sourceId: source.id,
      sourceLabel: source.label,
      sourceUrl: link,
      channelRole: source.channelRole,
      defaultCategory: source.defaultCategory,
      defaultInternalRoute: source.defaultInternalRoute,
      verificationTier: source.verificationTier,
      title,
      message: description ? `${title}\n${description}` : title,
      publishedIso: iso,
      publishedDisplay: display,
      timestampMs,
      externalLink: link,
    });
  }

  return results;
}

const NON_CIVIC_EXCLUSION_REGEX =
  /\b(?:happy birthday|adlawng natawhan|birthday cheers|blessed birthday|another day, another food trip|hoi an lantern|lantern experience, vietnam|musika cdoc|thanksgiving celebration, grace fundamental|glitz and glam night|another week of public service|tgif|pulso sa katawhan, husto ka john)\b/i;

const CIVIC_RELEVANCE_KEYWORDS_REGEX =
  /\b(?:ordinance|executive order|proclamation|memorandum circular|sangguniang panlungsod|regular session|public hearing|committee hearing|annual budget|bids and awards|bac meeting|pre-bid|invitation to bid|procurement|peso|job fair|job opportunity|hiring|recruitment|domestic helper|tupad|spes|skills training|livelihood|cdrrmo|lifeguard|aquatic rescue|abaca|tilapia|fisherfolk|african swine fever|asf surveillance|rabies|veterinary|bpld|recorrida|business one stop shop|boss 2027|kadiwa|benteng bigas|price monitoring|automated weather station|project sarai|super health center|turnover|classroom|school building|box culvert|farm to market road|water system|work suspension|office advisory|obo advisory|women's empowerment|gender and development|magna carta of women|bspo congress)\b/i;

function cleanHeadlineLine(line: string): string {
  return line
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s•]+/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+$/gu, "")
    .replace(/#[A-Za-z0-9_]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHashtagsAndCleanBody(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/#[A-Za-z0-9_]+/g, "").trim())
    .filter((line) => line.length > 0 && !/^(?:Report|Photo by|Disclaimer)\s*:/i.test(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyAnnouncementRouteAndCategory(
  text: string,
  fallbackCategory: NewsCardCategory,
  fallbackRoute: string,
): { category: NewsCardCategory; internalRoute: string } {
  const lower = text.toLowerCase();

  if (/\bordinance\s+no\.?\s*1132\b/i.test(lower)) {
    return {
      category: "Resolutions & Ordinances",
      internalRoute: "/legislation/ordinance-no-1132-series-of-2026",
    };
  }
  if (/\bordinance\s+no\.?\s*1118\b/i.test(lower)) {
    return {
      category: "Resolutions & Ordinances",
      internalRoute: "/legislation/ordinance-no-1118-series-of-2026",
    };
  }
  if (/\bordinance\s+no\.?\s*1095\b/i.test(lower)) {
    return {
      category: "Council & Legislative",
      internalRoute: "/legislation/ordinance-no-1095-series-of-2026",
    };
  }
  if (/\bordinance\s+no\.?\s*1092\b/i.test(lower)) {
    return {
      category: "Resolutions & Ordinances",
      internalRoute: "/legislation/ordinance-no-1092-series-of-2026",
    };
  }
  if (/\bexecutive\s+order\s+no\.?\s*93\b/i.test(lower)) {
    return {
      category: "City Announcements",
      internalRoute: "/legislation/executive-order-no-93-series-of-2026",
    };
  }
  if (/\b(?:ordinance\s+no|executive\s+order\s+no|presidential\s+proclamation)\b/i.test(lower)) {
    return { category: "Resolutions & Ordinances", internalRoute: "/legislation" };
  }
  if (/\b(?:bids and awards|bac meeting|pre-bid|invitation to bid|procurement)\b/i.test(lower)) {
    return { category: "Procurement & Bidding", internalRoute: "/procurement/livestreams" };
  }
  if (
    /\b(?:peso|job fair|job opportunity|hiring|recruitment|domestic helper|tupad|spes|skills training)\b/i.test(
      lower,
    )
  ) {
    return { category: "City Announcements", internalRoute: "/peso" };
  }
  if (/\b(?:regular session|sangguniang panlungsod|public hearing|committee hearing)\b/i.test(lower)) {
    return { category: "Council & Legislative", internalRoute: "/hearings" };
  }
  if (/\b(?:bpld|recorrida|business one stop shop|boss 2027|business permit)\b/i.test(lower)) {
    return { category: "Public Advisories", internalRoute: "/offices/bpld" };
  }
  if (/\b(?:african swine fever|asf|rabies|veterinary|slaughterhouse)\b/i.test(lower)) {
    return { category: "Public Advisories", internalRoute: "/offices/veterinary" };
  }
  if (/\b(?:cdrrmo|lifeguard|aquatic rescue|disaster preparedness)\b/i.test(lower)) {
    return { category: "City Announcements", internalRoute: "/offices/drrmo" };
  }
  if (/\b(?:abaca|tilapia|fisherfolk|city agriculture|agroforestry|project sarai)\b/i.test(lower)) {
    return { category: "City Announcements", internalRoute: "/offices/agriculture" };
  }
  if (/\b(?:obo advisory|building official|pd 1096|emergency demolition)\b/i.test(lower)) {
    return { category: "Public Advisories", internalRoute: "/offices/obo" };
  }
  if (/\b(?:lunokan integrated school)\b/i.test(lower)) {
    return { category: "City Announcements", internalRoute: "/education/lunokan-integrated-school" };
  }

  return { category: fallbackCategory, internalRoute: fallbackRoute };
}

/**
 * Evaluates whether a raw Facebook or LGU RSS post is a relevant Malaybalay
 * civic announcement and transforms it into a `NewsletterUpdateCard`.
 */
export function evaluateCivicAnnouncementRelevance(
  item: RawSyncedFeedItem,
): NewsletterUpdateCard | null {
  const normalized = normalizeSocialText(item.message);
  if (!normalized || normalized.length < 35) return null;
  if (NON_CIVIC_EXCLUSION_REGEX.test(normalized)) return null;
  if (!CIVIC_RELEVANCE_KEYWORDS_REGEX.test(normalized)) return null;
  // Only auto-promote active recent posts (November 2026 onward) so older archive posts
  // or past temporary office closures from earlier quarters do not displace current news.
  if (item.publishedIso && item.publishedIso < "2026-11-01") return null;

  const lines = normalized
    .split("\n")
    .map(cleanHeadlineLine)
    .filter((line) => line.length >= 4);
  if (lines.length === 0) return null;

  let headline = item.title ? cleanHeadlineLine(item.title) : lines[0];
  if (headline.length < 18 && lines.length > 1) {
    headline = `${headline}: ${lines[1]}`;
  }
  if (headline.length > 115) {
    headline = `${headline.slice(0, 112).trim()}...`;
  }

  const bodyClean = stripHashtagsAndCleanBody(normalized);
  let description = bodyClean;
  if (description.toLowerCase().startsWith(headline.toLowerCase().slice(0, 28))) {
    description = description.slice(headline.length).replace(/^[:\-–—\s]+/, "").trim() || bodyClean;
  }
  if (description.length < 30) {
    description = bodyClean;
  }
  if (description.length > 260) {
    description = `${description.slice(0, 257).trim()}...`;
  }

  const { category, internalRoute } = classifyAnnouncementRouteAndCategory(
    normalized,
    item.defaultCategory,
    item.defaultInternalRoute,
  );

  const slugSeed = slugifyOpportunityTitle(`${item.sourceId}-${item.publishedIso}-${headline}`);

  return {
    id: `live-${slugSeed}`,
    title: headline,
    description,
    publishedDate: item.publishedDisplay,
    category,
    verificationStatus: item.verificationTier,
    sourceAttribution: item.sourceLabel,
    sourceUrl: item.externalLink || item.sourceUrl,
    internalRoute,
    secondarySourceUrl: item.sourceUrl !== OFFICIAL_CITY_FB_URL ? OFFICIAL_CITY_FB_URL : undefined,
    secondarySourceLabel:
      item.sourceUrl !== OFFICIAL_CITY_FB_URL ? "City Government Facebook Page" : undefined,
  };
}

const PESO_OPPORTUNITY_Trigger_REGEX =
  /\b(?:job opportunity|hiring|job fair|tupad|spes|skills training|recruitment|domestic helper|vacanc(?:y|ies)|work abroad|screening interview)\b/i;

/**
 * Evaluates whether a raw social/web feed item announces a PESO job vacancy,
 * overseas recruitment screening, job fair, skills training, or TUPAD/SPES batch,
 * and converts it into a schema-validated `PesoOpportunity`.
 */
export function evaluatePesoOpportunityRelevance(
  item: RawSyncedFeedItem,
): PesoOpportunity | null {
  const normalized = normalizeSocialText(item.message);
  if (!normalized || normalized.length < 40) return null;
  if (NON_CIVIC_EXCLUSION_REGEX.test(normalized)) return null;

  const isPesoChannel = item.channelRole === "peso";
  if (!isPesoChannel && !/\b(?:tupad|spes|peso|job fair|job opportunity)\b/i.test(normalized)) {
    return null;
  }
  if (!PESO_OPPORTUNITY_Trigger_REGEX.test(normalized)) {
    return null;
  }

  // Skip congratulatory "HIRED ON THE SPOT" photo recap if we already have the Job Fair notice
  if (/\bhired on the spot\b/i.test(normalized) && !/\bparticipating companies\b/i.test(normalized)) {
    return null;
  }

  const lines = normalized
    .split("\n")
    .map(cleanHeadlineLine)
    .filter((line) => line.length >= 4);
  if (lines.length === 0) return null;

  let rawTitle = item.title ? cleanHeadlineLine(item.title) : lines[0];
  if (rawTitle.length < 22 && lines.length > 1) {
    rawTitle = `${rawTitle} — ${lines[1]}`;
  }
  if (rawTitle.length > 130) {
    rawTitle = `${rawTitle.slice(0, 127).trim()}...`;
  }

  let opportunityType: OpportunityType = "job-vacancy";
  if (/\bjob fair\b/i.test(normalized)) {
    opportunityType = "job-fair";
  } else if (/\b(?:tupad|spes|livelihood)\b/i.test(normalized)) {
    opportunityType = "livelihood-program";
  } else if (/\bskills training\b/i.test(normalized)) {
    opportunityType = "skills-training";
  } else if (/\b(?:screening interview|recruitment|work overseas|abroad)\b/i.test(normalized)) {
    opportunityType = "recruitment-event";
  }

  const venueMatch = normalized.match(/(?:Venue|Lugar|WHERE)\s*:\s*([^\n]+)/i);
  const location = venueMatch
    ? venueMatch[1].trim().slice(0, 160)
    : "PESO Desk / New City Hall, Barangay Casisang, Malaybalay City";

  const bodyClean = stripHashtagsAndCleanBody(normalized);
  const cardSummary = bodyClean.length > 175 ? `${bodyClean.slice(0, 172).trim()}...` : bodyClean;
  const slug = `live-${slugifyOpportunityTitle(`${item.publishedIso}-${rawTitle}`)}`;

  const candidateInput = {
    slug,
    title: rawTitle,
    opportunityType,
    employer:
      item.channelRole === "peso"
        ? "PESO Malaybalay City & Partner Employer / Agency"
        : "City Government of Malaybalay / DOLE–PESO Coordination",
    location,
    employmentType:
      opportunityType === "livelihood-program"
        ? ("Part-Time / Seasonal" as const)
        : opportunityType === "skills-training"
          ? ("Program Benefit" as const)
          : ("Full-Time" as const),
    cardSummary,
    description: bodyClean.slice(0, 2400),
    qualifications: [
      "Refer to the official PESO Malaybalay announcement for position-specific age, skill, and eligibility criteria.",
    ],
    requirements: [
      "Updated Resume / Bio-data and valid Government-Issued ID",
      "NSRP Jobseeker Profile Form or program-specific documentary requirements at PESO Desk",
    ],
    applicationProcess: [
      "Review the full schedule and venue details in the linked official PESO Malaybalay Facebook post.",
      "Visit the PESO Malaybalay Desk (2nd Floor, New City Hall, Brgy. Casisang) or email pesomalaybalaycity@gmail.com for verification.",
    ],
    contactDetails: [
      "PESO Malaybalay Desk: 0907-688-5735 / 0915-542-3434",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: item.publishedIso,
    isRecurringProgram: opportunityType === "skills-training",
    publicationStatus: "published" as const,
    sourceLabel: `${item.sourceLabel} (${item.publishedDisplay})`,
    sourceUrl: item.externalLink || item.sourceUrl,
    applicationUrl: item.sourceUrl,
  };

  const parsed = pesoOpportunityInputSchema.safeParse(candidateInput);
  if (!parsed.success) return null;

  return {
    ...parsed.data,
    id: slug,
    createdAt: new Date(item.timestampMs).toISOString(),
    updatedAt: new Date(item.timestampMs).toISOString(),
    createdBy: "verified-seed",
  };
}

function normalizeFingerprintText(text: string): string {
  return normalizeSocialText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Checks whether a live announcement card is already represented in the curated
 * `baseCards` list (by ID, specific ordinance/EO number, or high keyword overlap).
 */
export function isDuplicateAnnouncement(
  candidate: NewsletterUpdateCard,
  existingCards: NewsletterUpdateCard[],
): boolean {
  const candNorm = `${normalizeFingerprintText(candidate.title)} ${normalizeFingerprintText(candidate.description)}`;

  // Specific measure / event fingerprints
  const measureMatch = candNorm.match(/\b(?:ordinance|executive order|proclamation)\s+no\s+(\d+)\b/);
  const candMeasureNo = measureMatch ? measureMatch[1] : null;

  for (const existing of existingCards) {
    if (existing.id === candidate.id) return true;
    if (
      existing.sourceUrl === candidate.sourceUrl &&
      existing.sourceUrl.includes("sakata.malaybalaycity.gov.ph/") &&
      !existing.sourceUrl.endsWith("/category/public-annoucement/")
    ) {
      return true;
    }

    const existNorm = `${normalizeFingerprintText(existing.title)} ${normalizeFingerprintText(existing.description)}`;
    if (candMeasureNo && existNorm.includes(`no ${candMeasureNo}`)) {
      return true;
    }

    // Topic fingerprint matching for known recent announcements
    const topicFingerprints = [
      ["120", "lifeguard"],
      ["abaca", "spindle"],
      ["dumalahay"],
      ["house turnover"],
      ["oasia", "domestic helper"],
      ["job fair"],
      ["recorrida", "2027"],
      ["69th", "regular session"],
      ["70th", "regular session"],
      ["71st", "regular session"],
      ["226", "barangay"],
      ["asf", "surveillance"],
      ["project sarai"],
      ["lunokan", "integrated school"],
      ["box culvert"],
      ["rcbc"],
      ["san martin", "turnover"],
      ["bspo", "congress"],
      ["tilapia"],
      ["agroforestry"],
      ["sloping agricultural land technology"],
      ["price monitoring"],
      ["work and financial plan"],
      ["tupad", "street sweepers"],
      ["fashion designing"],
      ["bac meeting"],
    ];
    for (const tokens of topicFingerprints) {
      if (
        tokens.every((t) => candNorm.includes(t)) &&
        tokens.every((t) => existNorm.includes(t))
      ) {
        return true;
      }
    }
  }
  return false;
}

export function mergeAnnouncementsWithLive(
  baseCards: NewsletterUpdateCard[],
  liveCards: NewsletterUpdateCard[],
): { merged: NewsletterUpdateCard[]; addedCount: number } {
  const merged = [...baseCards];
  const added: NewsletterUpdateCard[] = [];

  for (const card of liveCards) {
    if (!isDuplicateAnnouncement(card, [...added, ...merged])) {
      added.push(card);
    }
  }

  return {
    merged: [...added, ...merged],
    addedCount: added.length,
  };
}

export function isDuplicateOpportunity(
  candidate: PesoOpportunity,
  existingList: PesoOpportunity[],
): boolean {
  const candNorm = `${normalizeFingerprintText(candidate.title)} ${normalizeFingerprintText(candidate.description)}`;

  for (const existing of existingList) {
    if (existing.slug === candidate.slug || existing.id === candidate.id) return true;
    const existNorm = `${normalizeFingerprintText(existing.title)} ${normalizeFingerprintText(existing.description)}`;

    const jobFingerprints = [
      ["oasia", "domestic helper"],
      ["11 20", "job fair"],
      ["participating companies", "job fair"],
      ["fashion designing"],
      ["tupad", "street sweepers"],
    ];
    for (const tokens of jobFingerprints) {
      if (
        tokens.every((t) => candNorm.includes(t)) &&
        tokens.every((t) => existNorm.includes(t))
      ) {
        return true;
      }
    }
  }
  return false;
}

export function mergeOpportunitiesWithLive(
  baseOpportunities: PesoOpportunity[],
  liveOpportunities: PesoOpportunity[],
): { merged: PesoOpportunity[]; addedCount: number } {
  const merged = [...baseOpportunities];
  const added: PesoOpportunity[] = [];

  for (const item of liveOpportunities) {
    if (!isDuplicateOpportunity(item, [...added, ...merged])) {
      added.push(item);
    }
  }

  return {
    merged: [...added, ...merged],
    addedCount: added.length,
  };
}

export function formatDurationSeconds(totalSeconds?: number | null): string | undefined {
  if (typeof totalSeconds !== "number" || !Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return undefined;
  }
  const sec = Math.round(totalSeconds);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatRecordingDayMonthYear(timestampMs: number): string {
  const safeMs = Number.isFinite(timestampMs) && timestampMs > 0 ? timestampMs : Date.now();
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(safeMs));
}

type RawFbChannelVideoObject = {
  id?: string | null;
  publish_time?: number | null;
  playable_duration_in_ms?: number | null;
  canonical_uri_with_fallback?: string | null;
  url?: string | null;
  savable_title?: { text?: string | null } | null;
  title?: { text?: string | null } | null;
  image?: { uri?: string | null } | null;
  video_thumbnail_overlays_renderer?: {
    video?: {
      broadcast_status?: string | null;
      playable_duration?: number | null;
    } | null;
  } | null;
  creation_story?: {
    message?: { text?: string | null } | null;
    attachments?: Array<{
      target?: {
        preferred_thumbnail?: {
          image?: { uri?: string | null } | null;
        } | null;
      } | null;
    }> | null;
  } | null;
};

/**
 * Extracts `"__typename":"ChannelTabVideoThumbnailWithReactionsRenderer","video":{...}`
 * nodes from a public Facebook `/videos` tab HTML document using balanced brace scanning.
 */
export function parseFacebookVideosTab(
  html: string,
  channel: OfficialVideoChannelConfig,
): RawSyncedVideoNode[] {
  if (!html) return [];
  const marker = '"__typename":"ChannelTabVideoThumbnailWithReactionsRenderer","video":';
  const results: RawSyncedVideoNode[] = [];
  const seenIds = new Set<string>();

  let idx = 0;
  while ((idx = html.indexOf(marker, idx)) !== -1) {
    const start = idx + marker.length;
    let depth = 0;
    let end = start;
    let inStr = false;
    let escaped = false;
    for (let i = start; i < html.length; i++) {
      const ch = html[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inStr = !inStr;
        continue;
      }
      if (!inStr) {
        if (ch === "{") {
          depth += 1;
        } else if (ch === "}") {
          depth -= 1;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
    }

    if (end <= start) {
      idx = start + 1;
      continue;
    }

    try {
      const parsed = JSON.parse(html.slice(start, end)) as RawFbChannelVideoObject;
      const id = String(parsed.id ?? "").trim();
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        const rawTitle = normalizeSocialText(
          parsed.savable_title?.text ?? parsed.title?.text ?? "",
        );
        const rawCaption = normalizeSocialText(
          parsed.creation_story?.message?.text ?? "",
        );
        const unixSec =
          typeof parsed.publish_time === "number" && parsed.publish_time > 0
            ? parsed.publish_time
            : Math.floor(Date.now() / 1000);
        const timestampMs = unixSec * 1000;
        const { iso } = formatManilaDisplayDate(timestampMs);
        const eventDate = formatRecordingDayMonthYear(timestampMs);
        const durationSec =
          parsed.video_thumbnail_overlays_renderer?.video?.playable_duration ??
          (typeof parsed.playable_duration_in_ms === "number"
            ? Math.round(parsed.playable_duration_in_ms / 1000)
            : undefined);
        const duration = formatDurationSeconds(durationSec);
        const videoUrl = `${channel.baseVideoUrlPrefix}/${id}/`;
        const embedUrl = buildFacebookVideoEmbedUrl(videoUrl);
        const thumbnailUrl =
          parsed.image?.uri ??
          parsed.creation_story?.attachments?.[0]?.target?.preferred_thumbnail?.image?.uri ??
          "";

        if (rawTitle || rawCaption) {
          results.push({
            id,
            channelId: channel.id,
            publisher: channel.publisher,
            channelRole: channel.channelRole,
            defaultCategory: channel.defaultCategory,
            title: rawTitle || rawCaption.split("\n")[0] || "",
            caption: rawCaption || rawTitle,
            videoUrl,
            embedUrl,
            thumbnailUrl,
            duration,
            broadcastStatus:
              parsed.video_thumbnail_overlays_renderer?.video?.broadcast_status ?? undefined,
            eventDate,
            publishedIso: iso,
            timestampMs,
          });
        }
      }
    } catch {
      // Ignore malformed individual block and continue scanning
    }

    idx = end;
  }

  return results;
}

const KNOWN_LOCAL_RECORDING_POSTERS = new Set(
  civicRecordings.map((item) => item.id),
);

/**
 * Evaluates a raw Facebook video node from Vice Mayor Estelito "Litoy" R. Marabe,
 * City Government of Malaybalay, BAC LGU Malaybalay, or Mayor Jay Warren R. Pabillaran,
 * and returns a structured `CivicRecording` with thumbnail (`poster`) and embedded
 * livestream URL (`embedUrl`) when it matches an official SP Session, BAC/Bidding
 * Livestream, or City Activity broadcast.
 */
export function evaluateCivicRecordingTrigger(
  node: RawSyncedVideoNode,
): CivicRecording | null {
  const combined = normalizeSocialText(`${node.title}\n${node.caption}`);
  if (!combined || combined.length < 6) return null;
  if (NON_CIVIC_EXCLUSION_REGEX.test(combined)) return null;

  const poster = KNOWN_LOCAL_RECORDING_POSTERS.has(node.id)
    ? `/images/recordings/${node.id}.jpg`
    : node.thumbnailUrl || "/images/bac-meeting-2026-11-18.jpg";

  // 1. Trigger for Sangguniang Panlungsod (SP) Regular Sessions (from Vice Mayor Estelito "Litoy" R. Marabe)
  const spSessionMatch = combined.match(/\b(\d+(?:st|nd|rd|th))\s+regular\s+session\b/i);
  const isSpKeyword =
    /\b(?:regular\s+session|sangguniang\s+panlungsod|sp\s+session|city\s+council\s+session|committee\s+hearing)\b/i.test(
      combined,
    );

  if (
    spSessionMatch ||
    (node.channelRole === "legislative-video" && isSpKeyword)
  ) {
    const ordinalRaw = spSessionMatch ? spSessionMatch[1] : null;
    const ordinal = ordinalRaw
      ? `${ordinalRaw.slice(0, -2)}${ordinalRaw.slice(-2).toLowerCase()}`
      : null;
    const isShortHighlight =
      node.duration !== undefined &&
      /^(?:0:\d{2}|1:\d{2}|2:\d{2})$/.test(node.duration) &&
      !/\b2:\d{2}:\d{2}\b/.test(node.duration);

    const title = ordinal
      ? `${ordinal} Regular Session${isShortHighlight ? " Highlights" : ""} · 10th Sangguniang Panlungsod`
      : cleanHeadlineLine(node.title || combined.split("\n")[0]).slice(0, 110);

    const description = ordinal
      ? isShortHighlight
        ? `Short video highlight from the ${ordinal} Regular Session of the 10th Sangguniang Panlungsod published on Vice Mayor Estelito "Litoy" R. Marabe's Facebook page.`
        : `Full ${ordinal.toLowerCase()} regular session livestream recording published on Vice Mayor Estelito "Litoy" R. Marabe's public video page.`
      : `Sangguniang Panlungsod legislative session recording published on ${node.publisher}'s public video page.`;

    const sourceContext = ordinal
      ? `The Vice Mayor's public page identifies this livestream as the ${ordinal.toLowerCase()} regular session of Malaybalay City's 10th Sangguniang Panlungsod. This page keeps the full recording, thumbnail, and embedded player together for residents.`
      : `${node.publisher}'s public page published this Sangguniang Panlungsod proceeding on ${node.eventDate}.`;

    return {
      id: node.id,
      title,
      category: "Legislative session",
      publisher: node.publisher,
      sourceUrl: node.videoUrl,
      embedUrl: node.embedUrl,
      duration: node.duration,
      eventDate: node.eventDate,
      description,
      sourceContext,
      poster,
    };
  }

  // 2. Trigger for BAC / Bidding Livestreams (from City Government of Malaybalay or BAC LGU Malaybalay)
  const isBacLivestream =
    /\b(?:bids\s+and\s+awards\s+committee|bac\s+meeting|pre-bid\s+conference|public\s+bidding|bid\s+opening)\b/i.test(
      combined,
    );

  if (isBacLivestream) {
    const driveMatch = combined.match(
      /https?:\/\/drive\.google\.com\/drive\/folders\/[^\s)]+/i,
    );
    const title = `Bids and Awards Committee Meeting · ${node.eventDate}`;
    const hasPriceFolder = Boolean(driveMatch);

    return {
      id: node.id,
      title,
      category: "BAC meeting",
      publisher: node.publisher,
      sourceUrl: node.videoUrl,
      embedUrl: node.embedUrl,
      duration: node.duration,
      eventDate: node.eventDate,
      description: hasPriceFolder
        ? `Full BAC meeting livestream recording published by ${node.publisher} on ${node.eventDate} with linked pre-bid price schedule documents.`
        : `Full BAC meeting livestream recording published by ${node.publisher} on ${node.eventDate}.`,
      sourceContext: hasPriceFolder
        ? `The publisher identifies a Bids and Awards Committee meeting broadcast on ${node.eventDate} and links a price schedule folder for procurement projects presented at the pre-bid conference.`
        : `The publisher identifies this recording as a Bids and Awards Committee meeting broadcast on ${node.eventDate}. Residents can watch the original proceeding through the embedded video player.`,
      relatedSource: driveMatch
        ? { label: "Publisher-linked price schedule folder", url: driveMatch[0] }
        : undefined,
      poster,
    };
  }

  // 3. Trigger for Official City Activities & Executive Governance Broadcasts (Convocations, Kapihan, Kalihukan sa Semana, Makisayud)
  const isCityActivityVideo =
    /\b(?:makisayud\s+sa\s+city\s+government|convocation\s+program|kapihan|kalihukan\s+sa\s+semana|state\s+of\s+the\s+city|charter\s+day)\b/i.test(
      combined,
    );

  if (isCityActivityVideo) {
    let cleanTitle = cleanHeadlineLine(node.title || combined.split("\n")[0]);
    if (/^makisayud sa city government of malaybalay$/i.test(cleanTitle)) {
      cleanTitle = `Makisayud sa City Government of Malaybalay · ${node.eventDate}`;
    } else if (/convocation program/i.test(cleanTitle) && !cleanTitle.includes(node.eventDate)) {
      cleanTitle = `${cleanTitle} · ${node.eventDate}`;
    }

    return {
      id: node.id,
      title: cleanTitle.slice(0, 120),
      category: "City activity",
      publisher: node.publisher,
      sourceUrl: node.videoUrl,
      embedUrl: node.embedUrl,
      duration: node.duration,
      eventDate: node.eventDate,
      description: `Official city activity broadcast published by ${node.publisher} on ${node.eventDate}.`,
      sourceContext: `${node.publisher} published this public broadcast ('${cleanTitle}') on ${node.eventDate}.`,
      poster,
    };
  }

  return null;
}

export function isDuplicateRecording(
  candidate: CivicRecording,
  existingList: CivicRecording[],
): boolean {
  for (const existing of existingList) {
    if (existing.id === candidate.id) return true;
    if (existing.sourceUrl === candidate.sourceUrl) return true;
  }
  return false;
}

export function mergeRecordingsWithLive(
  baseRecordings: CivicRecording[],
  liveRecordings: CivicRecording[],
): { merged: CivicRecording[]; addedCount: number } {
  const merged = [...baseRecordings];
  const added: CivicRecording[] = [];

  for (const rec of liveRecordings) {
    if (!isDuplicateRecording(rec, [...added, ...merged])) {
      added.push(rec);
    }
  }

  return {
    merged: [...added, ...merged],
    addedCount: added.length,
  };
}

/**
 * Converts a newly triggered BAC Meeting or SP Regular Session livestream recording
 * into a homepage `NewsletterUpdateCard` so live video broadcasts also surface in
 * the main Public Announcements feed.
 */
export function convertRecordingToAnnouncementCard(
  recording: CivicRecording,
): NewsletterUpdateCard {
  const isBac = recording.category === "BAC meeting";
  const isSp = recording.category === "Legislative session";
  return {
    id: `live-video-${recording.id}`,
    title: `${recording.title}${recording.duration ? ` (${recording.duration} Livestream)` : ""}`,
    description: recording.description,
    publishedDate: recording.eventDate ?? recording.publishedDate ?? "November 2026",
    category: isBac
      ? "Procurement & Bidding"
      : isSp
        ? "Hearings & Sessions"
        : "City Announcements",
    verificationStatus: "Verified Public Announcement",
    sourceAttribution: `${recording.publisher} — Official Facebook Livestream`,
    sourceUrl: recording.sourceUrl,
    internalRoute: `/recordings/${recording.id}`,
    secondarySourceUrl: recording.relatedSource?.url,
    secondarySourceLabel: recording.relatedSource?.label,
  };
}

async function fetchSingleVideoChannel(
  channel: OfficialVideoChannelConfig,
  timeoutMs = 6500,
): Promise<RawSyncedVideoNode[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(channel.videosPageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
      },
    });
    if (!response.ok) return [];
    const html = await response.text();
    return parseFacebookVideosTab(html, channel);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSingleFeedSource(
  source: OfficialFeedSourceConfig,
  timeoutMs = 6500,
): Promise<RawSyncedFeedItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const targetUrl =
      source.kind === "facebook-plugin"
        ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(source.url)}&tabs=timeline&width=500&height=1200`
        : source.url;

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "iframe",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        Referer: "https://bettermalaybalay.cloud/",
      },
    });
    if (!response.ok) return [];
    const body = await response.text();
    if (source.kind === "facebook-plugin") {
      return parseFacebookPluginTimeline(body, source);
    }
    return parseWordPressRssFeed(body, source);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches live posts across official City of Malaybalay website RSS feeds and
 * official Facebook pages, filters for civic relevance, and merges any newly
 * discovered announcements and PESO job posts with the portal's verified baseline.
 */
export async function syncLiveMalaybalayFeeds(options?: {
  sources?: OfficialFeedSourceConfig[];
  videoChannels?: OfficialVideoChannelConfig[];
  timeoutMs?: number;
}): Promise<{
  syncedAt: string;
  checkedSourcesCount: number;
  rawItemsCount: number;
  liveAnnouncements: NewsletterUpdateCard[];
  mergedAnnouncements: NewsletterUpdateCard[];
  newlyAddedAnnouncementsCount: number;
  liveOpportunities: PesoOpportunity[];
  mergedOpportunities: PesoOpportunity[];
  newlyAddedOpportunitiesCount: number;
  liveRecordings: CivicRecording[];
  mergedRecordings: CivicRecording[];
  newlyAddedRecordingsCount: number;
}> {
  const sources = options?.sources ?? OFFICIAL_MALAYBALAY_SYNC_SOURCES;
  const videoChannels = options?.videoChannels ?? OFFICIAL_LIVESTREAM_VIDEO_SOURCES;
  const timeoutMs = options?.timeoutMs ?? 6500;

  const [batches, videoBatches] = await Promise.all([
    Promise.all(sources.map((src) => fetchSingleFeedSource(src, timeoutMs))),
    Promise.all(videoChannels.map((ch) => fetchSingleVideoChannel(ch, timeoutMs))),
  ]);

  const allRawItems = batches
    .flat()
    .sort((a, b) => b.timestampMs - a.timestampMs);

  const allVideoNodes = videoBatches
    .flat()
    .sort((a, b) => b.timestampMs - a.timestampMs);

  const liveAnnouncements: NewsletterUpdateCard[] = [];
  const liveOpportunities: PesoOpportunity[] = [];
  const liveRecordings: CivicRecording[] = [];

  for (const videoNode of allVideoNodes) {
    const recording = evaluateCivicRecordingTrigger(videoNode);
    if (recording && !isDuplicateRecording(recording, liveRecordings)) {
      liveRecordings.push(recording);
      // If a brand-new livestream recording (not yet in baseline civicRecordings) is detected,
      // also surface it as a live announcement card
      if (!isDuplicateRecording(recording, civicRecordings)) {
        const videoCard = convertRecordingToAnnouncementCard(recording);
        if (!isDuplicateAnnouncement(videoCard, liveAnnouncements)) {
          liveAnnouncements.push(videoCard);
        }
      }
    }
  }

  for (const raw of allRawItems) {
    const card = evaluateCivicAnnouncementRelevance(raw);
    if (card && !isDuplicateAnnouncement(card, liveAnnouncements)) {
      liveAnnouncements.push(card);
    }
    const opp = evaluatePesoOpportunityRelevance(raw);
    if (opp && !isDuplicateOpportunity(opp, liveOpportunities)) {
      liveOpportunities.push(opp);
    }
  }

  const mergedNews = mergeAnnouncementsWithLive(newsletterUpdates, liveAnnouncements);
  const mergedJobs = mergeOpportunitiesWithLive(INITIAL_PESO_OPPORTUNITIES, liveOpportunities);
  const mergedVideos = mergeRecordingsWithLive(civicRecordings, liveRecordings);

  return {
    syncedAt: new Date().toISOString(),
    checkedSourcesCount: sources.length + videoChannels.length,
    rawItemsCount: allRawItems.length + allVideoNodes.length,
    liveAnnouncements,
    mergedAnnouncements: mergedNews.merged,
    newlyAddedAnnouncementsCount: mergedNews.addedCount,
    liveOpportunities,
    mergedOpportunities: mergedJobs.merged,
    newlyAddedOpportunitiesCount: mergedJobs.addedCount,
    liveRecordings,
    mergedRecordings: mergedVideos.merged,
    newlyAddedRecordingsCount: mergedVideos.addedCount,
  };
}
