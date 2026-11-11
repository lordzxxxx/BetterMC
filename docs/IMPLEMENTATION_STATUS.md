# BetterMC implementation status

Updated: **2026-11-11**

## Implemented

- Responsive Vite/React portal with dedicated home, transparency, government, barangay, service, procurement, legislative, and participation routes.
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
