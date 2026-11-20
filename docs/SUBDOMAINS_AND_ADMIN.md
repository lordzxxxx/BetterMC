# Subdomain Architecture, PESO Job Sync Reality & Admin Provisioning

## 1. Unified Subdomain Routing (`*.bettermalaybalay.cloud`)

BetterMC already terminates wildcard subdomain DNS (`*.bettermalaybalay.cloud`) via Vercel DNS (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`, documented in `docs/HOSTINGER_SUBDOMAIN_SETUP.md`).

When any request arrives on the SPA shell (`src/App.tsx`), hostname resolution runs deterministically without collisions across three verified namespaces:

1. **Government Offices & Services (`src/governmentOffices.ts` — `officeSlugFromHostname`)**
   - `peso.bettermalaybalay.cloud` -> renders the full **PESO Malaybalay Hub** (`PesoPortalPage`)
   - `cswdo.bettermalaybalay.cloud`, `cho.bettermalaybalay.cloud`, `drrmo.bettermalaybalay.cloud`, `bpld.bettermalaybalay.cloud`, `tourism.bettermalaybalay.cloud`, `agriculture.bettermalaybalay.cloud`, `cenro.bettermalaybalay.cloud`, etc. -> renders the standardized `OfficeLandingPage` for that office
   - Localhost / preview deployments support `?office=<slug>` (for example `/?office=peso`, `/?office=cho`).
   - `.vercel.app` multi-segment preview deployment URLs (`better-mc-git-...vercel.app`) do **not** trigger false subdomain matches because only exact verified office/barangay/school slugs resolve.
2. **46 Barangays (`src/barangayProfiles.ts` — `barangaySlugFromHostname`)**
3. **122 Schools & Institutions (`src/civicDirectories.ts` — `schoolSlugFromHostname`)**

Collision invariance across all three slug sets + aliases is automatically verified in `src/governmentOffices.test.ts`.

---

## 2. PESO Facebook & Vacancy Data Sourcing Architecture

### Why Automated Unauthenticated Facebook Scraping Is NOT Used
The official PESO Malaybalay Facebook Page (`https://www.facebook.com/profile.php?id=61589180493733`) publishes daily employer posters as Facebook posts/images without an open, unauthenticated public RSS or JSON API. Attempting unauthorized HTML scraping violates Meta platform terms, trips anti-bot walls reliably, and produces brittle incomplete data.

### Sustainable Multi-Channel Approach Implemented
1. **Verified Direct Official Link & Poster Guidance:** Every PESO view prominently surfaces the verified Facebook page so jobseekers can inspect same-day private employer posters safely.
2. **Curated Recurring PESO & DOLE Programs (`src/pesoData.ts`):** Documents all 10 verified Citizen's Charter 2026 PESO services, SPES/WAP, TUPAD coordination, OJT placement, Career Guidance (CGAP), Livelihood endorsements, and DMW/OWWA referral channels.
3. **Structured Historical CSC Form No. 9 Records (`CS-Form-No-9-Publication-2024-4th-Tranche-1-1.pdf`):** Real plantilla job items (Salary Grades, monthly PHP pay, Qualification Standards, Item Nos., Plantilla Nos.) automatically resolved as **Expired (closed `2024-08-31`)** by `resolveOpportunityLifecycle()` to prevent misleading active applicants.
4. **Role-Protected PESO Admin Publishing (`/admin/peso` + `api/admin/jobs.ts`):** Allows authorized PESO staff or maintainers to publish, edit, unpublish (draft), archive, and expire live vacancies sourced directly from official PESO bulletins.

---

## 3. Database Migration & Live Server Persistence Provisioning

The repository currently runs without external database environment variables in `.env` / Vercel Production. As a result:

- **Schema Migration Ready:** [`db/migrations/001_peso_opportunities.sql`](../db/migrations/001_peso_opportunities.sql) defines `peso_opportunities`, `peso_admin_audit_log`, and `peso_opportunities_with_status` for PostgreSQL / Neon / Vercel Postgres deployments.
- **Edge Runtime KV Persistence Ready:** [`api/jobs.ts`](../api/jobs.ts), [`api/admin/auth.ts`](../api/admin/auth.ts), and [`api/admin/jobs.ts`](../api/admin/jobs.ts) integrate with Upstash Redis REST / Vercel KV using HMAC-SHA256 signed `HttpOnly; SameSite=Strict; Secure` session cookies and Zod input validation (blocking `javascript:` and untrusted URLs, enforcing IP rate limits and origin checks).

### Provisioning Steps on Vercel to Enable Live Multi-User Server Publishing

1. Set the following **Production & Preview** environment variables in Vercel Project Settings:
   - `BETTERMC_ADMIN_TOKEN`: Strong passphrase / staff publishing secret (minimum 16 characters).
   - `BETTERMC_SESSION_SECRET`: Random 32+ byte HMAC signing key (`openssl rand -hex 32`).
   - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis / Vercel KV REST endpoint URL.
   - `UPSTASH_REDIS_REST_TOKEN`: Matching REST write token.
2. Redeploy. Once provisioned:
   - `/api/admin/auth` accepts sign-in via the passcode form (`POST /api/admin/auth`) or Bearer token.
   - `/api/admin/jobs` persists create/update/publish/unpublish/archive/delete mutations globally.
   - Until those variables are provisioned, `/admin/peso` transparently runs in **Local Browser Preview & JSON Export Mode** (`localStorage`), never faking server persistence.
