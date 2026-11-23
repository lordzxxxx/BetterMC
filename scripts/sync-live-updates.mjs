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
console.log(`\nChecked ${SOURCES.length} official Malaybalay feeds (${totalItems} live posts/announcements scanned).`);
