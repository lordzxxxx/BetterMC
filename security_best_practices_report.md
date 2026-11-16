# BetterMC security review

Reviewed: 2026-11-16

## Executive summary

No critical client-side secret exposure, DOM-XSS sink, dynamic-code execution, or unsafe cross-window messaging was found in the audited repository paths. The deployment already supplies a restrictive CSP, frame-embedding protection, `nosniff`, referrer policy, and HSTS. This review also fixed development-email HTML escaping, narrowed the submission origin allowlist, and added bounded per-instance request limits to public endpoints.

## Resolved findings

### SEC-001 — Development notification HTML accepted unescaped input

- Severity: Medium (development environment)
- Location: `vite.config.ts`, development `/api/submissions` middleware
- Evidence: user-controlled category, subject, email, source URL, and details were interpolated into an HTML email preview.
- Impact: a local reviewer could receive a rendered HTML payload from untrusted form input.
- Fix: values are now HTML-escaped before entering the generated preview markup.
- False-positive note: this middleware is not the Vercel production endpoint; the production email handler already escaped values.

### SEC-002 — Broad preview-origin allowance on public submissions

- Severity: Medium
- Location: `api/submissions.ts:84-108`
- Evidence: the prior allowlist accepted any hostname ending in `.vercel.app`.
- Impact: an unrelated Vercel site could make browser-originated requests to the endpoint.
- Fix: the broad suffix allowance was replaced with a project-name-bound Vercel preview pattern. Requests must be same-origin, an explicitly named BetterMC domain, local development, or a BetterMC-named preview.

### SEC-003 — No application-side throttling for public email forwarding

- Severity: Medium
- Location: `api/submissions.ts:12-14`, `api/submissions.ts:111-120`, `api/submissions.ts:242-249`
- Evidence: submissions are now tracked in an eight-request, 60-second fixed window per observed IP on a warm instance.
- Impact: reduces burst abuse and mail-provider cost exposure.
- Fix: implemented in this change.
- Remaining mitigation: configure a Vercel WAF or edge rate limit. In-memory state is per serverless instance and cannot provide global abuse control.

## Controls verified in code

- `api/submissions.ts:58-81` bounds and parses request bodies before validation.
- `api/submissions.ts:278-285` validates public input with the shared Zod schema.
- `api/submissions.ts:144-150` escapes email-bound values before HTML rendering.
- `vercel.json:20-47` configures CSP, clickjacking defenses, referrer policy, capability restrictions, and HSTS.

## Required production verification

1. Configure the server-only environment variables listed in `.env.example`; do not use a `VITE_` prefix for secrets.
2. Add edge/WAF rate limits for `/api/submissions`.
3. Verify live response headers, API behavior, and Vercel environment configuration after deployment.
4. Re-run `npm run check` and `npm audit --omit=dev` after data or endpoint changes.
