# Office Subdomains & Code-First PESO Publishing Workflow

## 1. Unified Subdomain Routing (`*.bettermalaybalay.cloud`)

BetterMC terminates wildcard DNS (`*.bettermalaybalay.cloud`) on Vercel DNS (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`, documented in `docs/HOSTINGER_SUBDOMAIN_SETUP.md`).

When a request arrives on the SPA shell (`src/App.tsx`), hostname lookup resolves deterministically across three collision-free namespaces:

1. **Government Offices & Services (`src/governmentOffices.ts` — `officeSlugFromHostname`)**
   - `peso.bettermalaybalay.cloud` -> renders the **PESO Malaybalay Hub** (`PesoPortalPage`)
   - `cswdo.bettermalaybalay.cloud`, `cho.bettermalaybalay.cloud`, `drrmo.bettermalaybalay.cloud`, `bpld.bettermalaybalay.cloud`, `tourism.bettermalaybalay.cloud`, `agriculture.bettermalaybalay.cloud`, `cenro.bettermalaybalay.cloud`, etc. -> renders the standardized `OfficeLandingPage`
   - Localhost / preview deployments support `?office=<slug>` (for example `/?office=peso`, `/?office=cho`).
   - `.vercel.app` multi-segment preview deployment URLs (`better-mc-git-...vercel.app`) never trigger false subdomain matches because only verified slugs match.
2. **46 Barangays (`src/barangayProfiles.ts` — `barangaySlugFromHostname`)**
3. **122 Schools & Institutions (`src/civicDirectories.ts` — `schoolSlugFromHostname`)**

Collision invariance across all three slug sets + aliases is automatically enforced by `src/governmentOffices.test.ts`.

---

## 2. Code-Managed PESO Jobs & Programs (`src/pesoData.ts`)

Because BetterMC's content is managed directly in code via Git commits & Pull Requests (no online admin database or extra Vercel environment secrets required):

1. Open `src/pesoData.ts` and add or update an entry inside `INITIAL_PESO_OPPORTUNITIES`.
2. Set `deadlineDate: "YYYY-MM-DD"` for finite hirings — `resolveOpportunityLifecycle()` automatically transitions listings to **Closing Soon** (<=7 days left) and **Expired** once the `Asia/Manila` closing date passes, both on `/peso`, `/jobs`, `/jobs/:slug`, and `GET /api/jobs`.
3. Every added record is automatically Zod-checked (`pesoOpportunityInputSchema`) during `npm test` so malformed dates, slugs, or unsafe URLs (`javascript:`) are caught before deployment.
4. Daily single-company Facebook posters continue linking directly to the verified PESO Malaybalay Facebook Page (`https://www.facebook.com/profile.php?id=61589180493733`) rather than fragile scraping.
