# School registry audit

Updated 18 November 2026.

BetterMC uses `src/civicDirectories.ts` as the authoritative school registry for the public directory, school profiles, search index, sitemap, and hostname resolution. Existing records are merged by URL-safe school slug so an integrated school is represented once with multiple educational levels.

## Verification model

- Records backed by the reviewed DepEd, CHED, TESDA, or institutional source keep that source and its review date.
- Every public, private, technical-vocational, and higher-education institution in the Malaybalay City directory now includes its localized barangay assignment and street/sitio/purok address in Malaybalay City, Bukidnon, along with the DepEd Schools Division of Malaybalay City address (`Sayre Highway, Purok 6, Barangay Casisang, Malaybalay City, 8700 Bukidnon`).
- Logos are optional. The UI shows a consistent fallback when a school logo was not located in an authoritative source; it never substitutes another institution's logo.

## School subdomains

Every registry record receives a deterministic host such as `bangcud-central-school.bettermalaybalay.cloud`. The existing hostname resolver now supports school hosts alongside barangay hosts and renders the same school profile component, so there is no duplicated tenant application.

The code path is ready for wildcard DNS and SSL, but each host still depends on the production provider serving `*.bettermalaybalay.cloud`. A host should be called operational only after DNS, certificate, and live HTTP checks pass.

## Remaining verification work

The supplied inventory contains entries with missing IDs, conflicting names, and classifications that require an individual current DepEd or institutional record. Those entries are intentionally labeled pending. Official school logos, current administrators, direct contacts, and school-specific announcement feeds also require source-by-source confirmation before publication.
