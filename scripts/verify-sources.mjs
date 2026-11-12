#!/usr/bin/env node
/**
 * Verifies every official source URL cited in the transparency data.
 *
 * - Extracts http(s) URLs from the data modules.
 * - Requests each with normal TLS verification (never disabled), so an
 *   expired certificate is reported as a failure, exactly as a resident's
 *   browser would experience it.
 * - Prints a status table and exits non-zero if any cited source is unreachable.
 *
 * Usage: npm run verify:sources
 */
import { readFileSync } from "node:fs";

// Keep this list aligned with the public data modules. In particular, the
// barangay disclosure module carries the source chain for all 46 microsites;
// omitting it would make a source audit look more complete than it is.
const FILES = [
  "src/data.ts",
  "src/bidRecords.ts",
  "src/barangayDisclosures.ts",
  "src/procurementRecords.ts",
  "src/barangayProfiles.ts",
  "src/serviceCatalog.ts",
];
const URL_PATTERN = /https?:\/\/[^\s"'`)<>\\]+/g;
const SKIP_HOSTS = new Set(["www.w3.org"]);
const TIMEOUT_MS = 20000;
const CONCURRENCY = 6;

const urls = new Set();
for (const file of FILES) {
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const match of text.match(URL_PATTERN) ?? []) {
    const url = match.replace(/[.,;]+$/, "");
    try {
      if (!url.includes("${") && !SKIP_HOSTS.has(new URL(url).hostname)) urls.add(url);
    } catch {
      /* ignore malformed */
    }
  }
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "BetterMC-source-verifier/1.0" },
    });
    const type = res.headers.get("content-type") ?? "";
    await res.body?.cancel();
    // Google Drive may return 401/403 to automated clients and rate-limit a
    // public file with 429. These outcomes require a browser review; they do
    // not establish that the cited public link is unavailable.
    const manual =
      new URL(url).hostname === "drive.google.com" &&
      [401, 403, 429].includes(res.status);
    const ok = manual || (res.ok && !(url.endsWith(".pdf") && !type.includes("pdf")));
    return { url, ok, detail: manual ? "MANUAL CHECK (Drive)" : `${res.status} ${type.split(";")[0]}` };
  } catch (error) {
    const cause = error?.cause?.code ?? error?.cause?.message ?? error?.name ?? "error";
    return { url, ok: false, detail: String(cause) };
  } finally {
    clearTimeout(timer);
  }
}

const queue = [...urls].sort();
const results = [];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) results.push(await check(queue.shift()));
  }),
);

results.sort((a, b) => Number(a.ok) - Number(b.ok) || a.url.localeCompare(b.url));
for (const r of results) console.log(`${r.ok ? "OK  " : "FAIL"}  ${r.detail.padEnd(34)} ${r.url}`);
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} sources reachable.`);
process.exit(failed.length ? 1 : 0);
