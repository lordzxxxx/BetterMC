# BetterMC — Better Malaybalay City

BetterMC is an independent public information and transparency portal for Malaybalay City, Bukidnon. It organizes official public records, government contacts, barangays, service references, and correction requests without presenting itself as an official government website.

## Current verified scope

- Source-linked 2022–2026 Full Disclosure catalog structure
- Current executive, legislative, and sectoral leadership listed by the official city website
- Searchable city-office and emergency-contact directory
- Complete 46-barangay name index
- DILG-listed Punong Barangay names and valid published contact fields
- Uniform barangay profiles with satellite/street map switching, map-derived
  center coordinates, and indicative PSGC-matched boundary outlines
- 2025 Q2 income, operating expenditure, non-operating expenditure, and cash-position breakdown
- Institution-attributed ordinances, mayoral executive issuances, project reports, and verified city recognition
- Layered, subdued Malaybalay City Hall hero background with readable foreground content
- Scope-labeled BAC procurement links for infrastructure, goods and services, and small-value procurement
- Official Citizen's Charter and public-service entry points
- Compact access to every primary portal page from the global navigation
- Community correction intake with shared validation, optional Turnstile verification, and email forwarding through Resend
- Responsive, keyboard-accessible public interface

Published financial and project figures are labeled with their reporting period and source. A listed document is not treated as proof of legal compliance, current project completion, or individual political credit. Procurement award details remain outside the verified scope of this release.

## Stack

- React 19, TypeScript strict mode, Vite
- React Router with URL-backed public record filters
- Zod validation in the browser and Vercel serverless function
- Vitest and Playwright

The architecture is informed by [BetterLosBaños](https://github.com/BetterLosBanos/betterlb) and the [BetterGov LGU ecosystem](https://lgu.bettergov.ph/). No Los Baños content is reused as Malaybalay data.

## Local development

```bash
npm install
npm run dev
```

The public portal works in Vite development. To run the public submission API locally, use the Vercel CLI and configure the Resend environment variables described in `.env.example`:

```bash
npm install
npm run dev
# In a second terminal, run the Vercel development server when testing /api routes.
npx vercel dev
```

Configure `RESEND_API_KEY`, `CONTACT_EMAIL`, and `RESEND_FROM` in Vercel for
submission email forwarding. Turnstile verification is optional; when enabled,
configure `VITE_TURNSTILE_SITE_KEY` for the browser and `TURNSTILE_SECRET_KEY`
as a server-only variable. Never put the secret in a `VITE_*` variable.
Submissions are forwarded by email; this deployment does not provide durable
submission storage, a moderation queue, or rate limiting.

## Verification

```bash
npm run check
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

`npm run check` runs ESLint, unit/API tests, strict frontend and Vercel API
type-checking, and the production build. See
[docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) for the reviewed controls and
the deployment steps that still require Vercel configuration.

## Source and editorial rules

Every published civic fact must retain its original source, a last-verified date, a workflow state, and revision history for moderated content. Missing records are described as “Not yet available in verified public sources.” BetterMC does not infer noncompliance, misconduct, or spending from availability, absence, appropriation, or proposal data.

See [docs/RESEARCH_INVENTORY.md](docs/RESEARCH_INVENTORY.md) for audited sources and [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) for delivery boundaries.

### Map provenance

Barangay pages load a trimmed local GeoJSON snapshot derived from the national
PSA/NAMRIA barangay-boundary release dated 2023-11-06. These outlines are
orientation aids, not surveyed cadastral or ownership boundaries. Satellite
tiles are provided by Esri World Imagery and street tiles by OpenStreetMap;
each provider is attributed in the map control. Tile imagery, roads, and the
boundary snapshot can have different update dates.

The portal links to the City Government's published contact route and official
Facebook page. It does not invent a separate barangay Facebook account when a
reliable public page cannot be established.

## Independence

BetterMC is not affiliated with, endorsed by, or operated by the City Government of Malaybalay. Government documents and information are attributed to their original sources. Official transactions and certifications must go through the responsible government office.

## License and attribution

This repository retains its existing CC BY 4.0 license.

### Civic-tech credits and references

- [BetterGov.ph](https://bettergov.ph/) — public-service discovery and civic-information reference
- [BetterGov.ph open-source repository](https://github.com/bettergovph/bettergov) — upstream civic-tech reference, dedicated under CC0 1.0
- [BetterGov LGU ecosystem](https://lgu.bettergov.ph/) — local-government portal reference
- [BetterLosBaños](https://github.com/BetterLosBanos/betterlb) — information-architecture reference, dedicated under CC0 1.0

BetterMC is independently maintained. These acknowledgements do not imply endorsement, affiliation, or shared responsibility for BetterMC content.
