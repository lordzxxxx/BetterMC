# BetterMC implementation status

Updated: **2026-11-07**

## Implemented and locally testable

- Public application shell, responsive navigation, footer disclaimer, GitHub contribution link, official city channels, BetterGov attribution, metadata, and 404 state
- Homepage with computed portal-record counts and global record search
- Current Malaybalay weather, an interactive 24-hour outlook, loading state, and provider caveat
- Latest official city and barangay population counts available in 2026, labeled as 2024 POPCEN data with PSA release dates
- Full Disclosure catalog with URL-backed year, quarter, category, and title filters
- Searchable officials, office, hotline, barangay, and service directories
- Source and last-verified metadata on government records
- Client/server correction form validation, honeypot, D1 rate limit, pending-verification persistence
- Version-ready content and audit-log database schema
- Reduced-motion, keyboard focus, mobile layouts, print rules, and tap-sized controls
- Unit and cross-viewport browser tests
- Detailed 2025 Q2 financial breakdown with source-linked accounting caveats
- Institution-scoped ordinances and executive orders, reported project status, and verified recognition
- All 46 DILG-listed Punong Barangay names plus valid published phone/email fields
- Layered, softened aerial City Hall hero background; the former image carousel has been removed
- Scope-labeled BAC procurement source cards that distinguish bids, awards, and completion evidence
- Dedicated internal procurement and legislative context pages that retain links to the original public source
- Live Malaybalay date and time in the top utility bar on every page
- Direct global access to every primary portal route on desktop and mobile
- Compact disclosure index rows replacing the oversized decorative disclosure card
- Clickable financial summary and breakdown rows with definitions, percentages, and direct source verification
- Smooth, URL-addressable expandable profiles for all 15 listed city leaders with official profile links, contact-scope labels, office address, and attribution-safe record coverage
- Compact mobile finance controls and leader details designed to reduce tall cards while preserving readable tap targets
- Expanded official archive index covering mayoral executive orders, council ordinances, and an unattributed memorandum circular
- Indicative barangay boundary outlines from the documented PSA/NAMRIA snapshot, rendered without polygon fill and explicitly labeled as non-survey boundaries

## Real limitations — not presented as completed

- The supplied BetterMC logo assets and original BetterMC favicon are implemented.
- The D1 production database ID and Turnstile keys are deployment-owned values and are not configured in source.
- An authenticated administration interface and server-enforced role management are not yet implemented. The schema provides versioned records and audit logs, but no production admin claim is made.
- Voting records, resolutions, committee assignments, and Citizen's Charter procedures require further record-by-record extraction and verification. The reviewed official pages did not expose a complete individual-sponsor ledger.
- The official City Government host currently presents an expired TLS certificate. BetterMC cannot repair or guarantee the availability of external government infrastructure.
- No production deployment, domain, analytics, search indexing, or live form delivery was verified in this implementation pass.
- Barangay map centers and generalized boundary outlines are orientation aids, not surveyed cadastral, jurisdictional, or ownership boundaries.

## Deployment readiness

- The public portal, routes, local data, and weather interface build successfully as a Vite production bundle in `dist/`.
- Cloudflare Pages configuration and the D1 migration are present in the repository.
- Before enabling the public correction form in production, replace the placeholder D1 database ID in `wrangler.toml`, apply the migrations, and configure matching Turnstile site and secret keys.
- A static deployment can present the public-information portal without the intake service, but it must not represent correction submissions as operational until the D1 and Turnstile checks pass in the target environment.

## Next evidence gates

1. Provision D1 and Turnstile; run the migration; verify saved submissions and rate-limit behavior in a preview environment.
2. Implement identity-provider-backed admin authentication and server-side roles before exposing moderation tools.
3. Build an ingestion ledger for each official PDF with checksum, source URL, extraction reviewer, and reconciliation status.
4. Add procurement, voting, resolution, and committee datasets only after their source-specific checks pass.
