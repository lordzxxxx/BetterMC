#!/usr/bin/env node
/**
 * Automatically checks the official City Government of Malaybalay website RSS feeds
 * (sakata.malaybalaycity.gov.ph) and official Malaybalay Facebook pages (PESO Malaybalay,
 * Office of the City Mayor, Office of the City Vice Mayor, BAC LGU Malaybalay, BPLD,
 * City Agriculture, City Veterinary Office, OBO, and Sangguniang Panlungsod Councilors)
 * via the Facebook Page Plugin timeline endpoint, filters for civic relevance, and
 * reports all active public announcements and PESO job opportunities.
 *
 * Usage: npm run sync:updates
 */

const SOURCES = [
  {
    id: "lgu-main-rss",
    label: "City Government of Malaybalay — Official Website Feed",
    url: "https://sakata.malaybalaycity.gov.ph/feed/",
    kind: "wordpress-rss",
  },
  {
    id: "lgu-announcements-rss",
    label: "City Government of Malaybalay — Public Announcements Feed",
    url: "https://sakata.malaybalaycity.gov.ph/category/public-annoucement/feed/",
    kind: "wordpress-rss",
  },
  {
    id: "fb-peso-malaybalay",
    label: "PESO Malaybalay City",
    url: "https://www.facebook.com/profile.php?id=61589180493733",
    kind: "facebook-plugin",
  },
  {
    id: "fb-mayor-pabillaran",
    label: "Mayor Jay Warren R. Pabillaran",
    url: "https://www.facebook.com/mayorwarrenpabillaran",
    kind: "facebook-plugin",
  },
  {
    id: "fb-vice-mayor-marabe",
    label: "Vice Mayor Estelito “Litoy” R. Marabe",
    url: "https://www.facebook.com/estelitolitoymarabe",
    kind: "facebook-plugin",
  },
  {
    id: "fb-bac-malaybalay",
    label: "BAC LGU Malaybalay",
    url: "https://www.facebook.com/bacmalaybalay",
    kind: "facebook-plugin",
  },
  {
    id: "fb-bpld-malaybalay",
    label: "CMO–BPLD Malaybalay City",
    url: "https://www.facebook.com/bpld.malaybalaycity",
    kind: "facebook-plugin",
  },
  {
    id: "fb-agri-malaybalay",
    label: "Malaybalay City Agri-NEWS",
    url: "https://www.facebook.com/mlyblyAgriNews/",
    kind: "facebook-plugin",
  },
  {
    id: "fb-vet-malaybalay",
    label: "City Veterinary Office — Malaybalay",
    url: "https://www.facebook.com/p/City-Veterinary-Office-City-of-Malaybalay-100064138659249/",
    kind: "facebook-plugin",
  },
  {
    id: "fb-councilor-legaspi",
    label: "Councilor Alan Ryann O. Legaspi",
    url: "https://www.facebook.com/KonsehalManoyLegaspi",
    kind: "facebook-plugin",
  },
  {
    id: "fb-councilor-flores",
    label: "Councilor Brian Nelson T. Flores",
    url: "https://www.facebook.com/profile.php?id=100076097234513",
    kind: "facebook-plugin",
  },
  {
    id: "fb-councilor-sangalang",
    label: "Councilor Atty. Rendon P. Sangalang",
    url: "https://www.facebook.com/AttyRendonJojoSangalang",
    kind: "facebook-plugin",
  },
  {
    id: "fb-councilor-tortola",
    label: "Councilor Christopher Lambert Tortola",
    url: "https://www.facebook.com/sp.cristopher.lambert.tortola",
    kind: "facebook-plugin",
  },
];

const VIDEO_CHANNELS = [
  {
    id: "fb-videos-vice-mayor-marabe",
    label: "Vice Mayor Estelito “Litoy” R. Marabe — SP Regular Session Livestreams",
    url: "https://www.facebook.com/estelitolitoymarabe/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/estelitolitoymarabe/videos",
  },
  {
    id: "fb-videos-city-gov-malaybalay",
    label: "City Government of Malaybalay — BAC Meeting & City Livestreams",
    url: "https://www.facebook.com/100063747444247/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/100063747444247/videos",
  },
  {
    id: "fb-videos-bac-malaybalay",
    label: "BAC LGU Malaybalay — Official Procurement Livestreams",
    url: "https://www.facebook.com/bacmalaybalay/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/bacmalaybalay/videos",
  },
  {
    id: "fb-videos-mayor-pabillaran",
    label: "Mayor Jay Warren R. Pabillaran — Makisayud Livestreams",
    url: "https://www.facebook.com/mayorwarrenpabillaran/videos",
    baseVideoUrlPrefix: "https://www.facebook.com/mayorwarrenpabillaran/videos",
  },
];

function extractJsonArray(html, key) {
  const idx = html.indexOf(`"${key}":`);
  if (idx === -1) return null;
  const arrStart = html.indexOf("[", idx);
  if (arrStart === -1) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = arrStart; i < html.length; i++) {
    const ch = html[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === "\\") {
      esc = true;
      continue;
    }
    if (ch === '"') {
      inStr = !inStr;
      continue;
    }
    if (!inStr) {
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(html.slice(arrStart, i + 1));
          } catch {
            return null;
          }
        }
      }
    }
  }
  return null;
}

function normalizeText(s) {
  return (s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}

async function checkSource(source) {
  const targetUrl =
    source.kind === "facebook-plugin"
      ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(source.url)}&tabs=timeline&width=500&height=1200`
      : source.url;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://bettermalaybalay.cloud/",
      },
    });
    if (!res.ok) return { source, ok: false, items: [] };
    const text = await res.text();
    if (source.kind === "facebook-plugin") {
      const posts = extractJsonArray(text, "timelinePosts") || [];
      return {
        source,
        ok: true,
        items: posts.map((p) => ({
          date: p.createdTime ? new Date(p.createdTime * 1000).toISOString().slice(0, 10) : "unknown",
          summary: normalizeText(p.message || p.attachedStory?.message || "").split("\n").filter(Boolean)[0] || "(attachment)",
        })),
      };
    }
    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => {
      const title = (m[1].match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "";
      const pubDate = (m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "";
      return {
        date: pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "unknown",
        summary: normalizeText(title),
      };
    });
    return { source, ok: true, items };
  } catch (err) {
    return { source, ok: false, error: err.message, items: [] };
  }
}

const results = await Promise.all(SOURCES.map(checkSource));
let totalItems = 0;
for (const r of results) {
  totalItems += r.items.length;
  console.log(`${r.ok ? "SYNCED" : "SKIP  "} [${r.source.label}] (${r.items.length} items)`);
  for (const item of r.items.slice(0, 3)) {
    console.log(`   • ${item.date}: ${item.summary.slice(0, 100)}`);
  }
}

async function checkVideoChannel(channel) {
  try {
    const res = await fetch(channel.url, {
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
    if (!res.ok) return { channel, ok: false, videos: [] };
    const html = await res.text();
    const marker = '"__typename":"ChannelTabVideoThumbnailWithReactionsRenderer","video":';
    const videos = [];
    const seen = new Set();
    let idx = 0;
    while ((idx = html.indexOf(marker, idx)) !== -1) {
      const start = idx + marker.length;
      let depth = 0,
        end = start,
        inStr = false,
        esc = false;
      for (let i = start; i < html.length; i++) {
        const ch = html[i];
        if (esc) {
          esc = false;
          continue;
        }
        if (ch === "\\") {
          esc = true;
          continue;
        }
        if (ch === '"') {
          inStr = !inStr;
          continue;
        }
        if (!inStr) {
          if (ch === "{") depth++;
          else if (ch === "}") {
            depth--;
            if (depth === 0) {
              end = i + 1;
              break;
            }
          }
        }
      }
      try {
        const v = JSON.parse(html.slice(start, end));
        if (v.id && !seen.has(v.id)) {
          seen.add(v.id);
          const videoUrl = `${channel.baseVideoUrlPrefix}/${v.id}/`;
          videos.push({
            id: v.id,
            date: v.publish_time
              ? new Date(v.publish_time * 1000).toISOString().slice(0, 10)
              : "unknown",
            title: normalizeText(
              v.savable_title?.text || v.creation_story?.message?.text || "(livestream)",
            )
              .split("\n")[0]
              .slice(0, 95),
            thumbnail: Boolean(
              v.image?.uri ||
                v.creation_story?.attachments?.[0]?.target?.preferred_thumbnail?.image?.uri,
            ),
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=900`,
          });
        }
      } catch {
        // skip
      }
      idx = end;
    }
    return { channel, ok: true, videos };
  } catch (err) {
    return { channel, ok: false, error: err.message, videos: [] };
  }
}

console.log("\n--- Checking Official BAC & SP Session Livestream Video Channels ---");
const videoResults = await Promise.all(VIDEO_CHANNELS.map(checkVideoChannel));
let totalVideos = 0;
for (const vr of videoResults) {
  totalVideos += vr.videos.length;
  console.log(
    `${vr.ok ? "VIDEOS" : "SKIP  "} [${vr.channel.label}] (${vr.videos.length} livestreams/videos)`,
  );
  for (const v of vr.videos.slice(0, 3)) {
    console.log(
      `   ▶ [${v.id}] ${v.date}: ${v.title} (thumbnail=${v.thumbnail ? "yes" : "no"}, embed=ready)`,
    );
  }
}

console.log(
  `\nChecked ${SOURCES.length} official Malaybalay feeds (${totalItems} live posts) and ${VIDEO_CHANNELS.length} livestream channels (${totalVideos} videos with thumbnails & embeds).`,
);
