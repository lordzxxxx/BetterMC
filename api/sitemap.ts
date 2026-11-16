import { barangayMicrosites } from "../src/barangayProfiles.js";
import { serviceCategories } from "../src/serviceCatalog.js";

export const config = { runtime: "edge" };

const SITE_URL = "https://www.bettermalaybalay.cloud";
const staticPaths = ["/", "/transparency", "/government", "/legislation", "/procurement/bidding-opportunities", "/barangays", "/services", "/participate", "/about"];

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export default function handler(): Response {
  const paths = [
    ...staticPaths,
    ...serviceCategories.map((category) => `/services/${category.slug}`),
    ...barangayMicrosites.map((barangay) => `/barangays/${barangay.slug}`),
  ];
  const urls = [...new Set(paths)]
    .map((path) => `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc><changefreq>weekly</changefreq></url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      "x-content-type-options": "nosniff",
    },
  });
}
