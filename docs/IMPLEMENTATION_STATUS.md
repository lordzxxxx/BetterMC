# BetterMC implementation status

Updated: **2026-11-18**

## Implemented

- Responsive Vite/React portal with dedicated home, transparency, budget (`/budget`), legislative hearings (`/hearings`), BAC livestream & procurement (`/procurement/livestreams`), government, barangay, education (`/education`), document guide (`/documents`), service, and participation routes.
- First-time visitor welcome card with persistent `localStorage` dismissal and reopen control, plus a mobile app-like bottom navigation bar (`MobileAppTabBar`).
- Homepage newsletter-style news & updates section with category tabs (`City Announcements`, `Resolutions & Ordinances`, `Council & Legislative`, `Hearings & Sessions`, `Procurement & Bidding`, `Public Advisories`) and in-depth civic discussion cards.
- Dedicated BAC LGU Malaybalay Livestream Monitoring & Documentation hub (`/procurement/livestreams`) kept separate from legislative hearings, providing downloadable `.docx` and `.txt` documentation (`docs/BAC_LGU_MALAYBALAY_LIVESTREAM_DOCUMENTATION.docx` and `.txt`), on-demand Facebook Page plugin, documented platform access boundaries, and confirmed FDP Form 10a bidding outcomes.
- Dedicated Legislative Sessions & Public Hearings section (`/hearings`) referencing `https://budget.bettergov.ph/hearings` alongside 10th Sangguniang Panlungsod sessions, committee hearings, and public consultations.
- Dedicated Government Budget Transparency section (`/budget`) referencing `https://budget.bettergov.ph/hgab/2027/overview` with clear fiscal-year and jurisdictional separation between Malaybalay City local funds and national FY 2027 HGAB (HB 10858) line items.
- Official Facebook pages (`<FacebookIcon />`) attached to 11 verified council and government official profiles, with 5 numeric `profile.php?id=` links explicitly flagged in the identity verification ledger rather than guessed by list order.
- Complete localized addresses and barangay mappings across all Malaybalay City schools and DepEd division offices in `src/civicDirectories.ts`.
- BetterGov.PH Kapwa typography (`Inter` loaded non-blocking via `index.html`) and over 1.4 MB of public image asset optimization.
- Source-linked public records and current population figures labeled with their official reference period and release date.
- Shared profiles for all 46 barangays, including overview, leadership, source references, procurement/disclosure records, maps, services, contacts, and emergency links.
- Barangay leadership appears directly after the overview; the section navigation follows the same order.
- Searchable barangay selector with keyboard support and a compact, styled option list.
- Compact text-first disclosure records and concise overview content to reduce repeated decorative cards.
- Vercel production configuration, SPA routing, security headers, immutable asset caching, and API no-store headers.
- Optional Turnstile verification and shared Zod validation for public submissions.
- Vercel API forwards validated submissions to the BetterMC review email through Resend.

## Operational limits

- Public submissions are forwarded by email; they are not stored in a database, and there is no moderation queue or rate limit in this deployment.
- Turnstile is an optional third-party anti-bot service and is unrelated to the hosting provider.
- Production deployment, custom-domain routing, environment variables, and email delivery must be verified in Vercel after each release.
- Barangay map centers and generalized boundary outlines are orientation aids, not surveyed cadastral, jurisdictional, or ownership boundaries.
- BetterMC does not claim an authenticated administration interface or server-enforced editorial roles.

## Vercel deployment

The project is a Vite single-page application. `vercel.json` defines the build, output directory, SPA fallback, and response headers. Configure the Resend variables in the Vercel project to enable email forwarding. Configure Turnstile site and secret keys only if anti-bot verification is enabled. Do not commit environment values.

## Next evidence gates

1. Verify production domain aliases and Vercel project environment variables.
2. Submit a test correction through a deployment preview and verify delivery at the review inbox.
3. Add durable persistence and rate limiting before representing the correction desk as a tracked moderation workflow.
4. Continue record-by-record source reconciliation before adding claims about individual legislative authorship, project completion, or procurement savings.

---

## Expansion Update (2026-11-20 — `feat/offices-peso-subdomains`)

- **City Offices Directory (`/offices`) & Standardized Subdomain Microsites (`<slug>.bettermalaybalay.cloud` / `/offices/:slug`):** Added 35 researched offices, CMO divisions (PESO, Community Affairs Scholarships/CSOs, OSCA, BPLD, Tourism, TMC), legislative bodies (SP, Vice Mayor, PLEB), and national partner desks (DILG, BFP, PNP, MTCC Br. 2, DepEd), plus 18 EO-backed Local Special Bodies and 28 locally mirrored official emblems under `public/images/offices/`.
- **PESO Malaybalay Hub (`/peso` & `peso.bettermalaybalay.cloud`), Jobs Board (`/jobs`), & Detail Pages (`/jobs/:slug`):** Integrated verified PESO profile, 10 Citizen's Charter 2026 services, DOLE–LGU flagship programs (SPES, TUPAD, DMW/OWWA desk), automatically expiring CSC Form No. 9 archival vacancies, and a code-managed `src/pesoData.ts` + read-only `/api/jobs` Edge endpoint (zero external database or admin secrets required).
