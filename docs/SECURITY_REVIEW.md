# Security review

Reviewed: 2026-11-08

## Executive summary

The public React interface and Cloudflare Pages Function were reviewed for
common TypeScript/React and public-form risks. No known vulnerable production
dependency was reported by `npm audit --omit=dev`. The changes below close the
repository-visible issues found in the submission path and add an explicit
browser-security policy for Cloudflare Pages.

This is an application-level review, not a penetration test or a guarantee
against every vulnerability. Runtime Cloudflare configuration and response
headers must still be verified after deployment.

## Remediated findings

### WEB-INPUT-001

- Severity: Medium
- Location: `functions/api/submissions.ts:23-110`
- Evidence: the prior endpoint parsed the request body without a byte ceiling
  and accepted every URL scheme recognized by the URL parser.
- Impact: oversized bodies could consume unnecessary worker resources, and
  non-web source schemes could enter moderation data.
- Fix: requests are capped at 16 KiB while streaming, invalid JSON is rejected,
  and the shared schema permits only `http:` and `https:` source URLs.
- Mitigation: Cloudflare platform request limits remain an additional boundary.
- False-positive notes: none.

### WEB-REQUEST-002

- Severity: Medium
- Location: `functions/api/submissions.ts:90-117`
- Evidence: the prior public endpoint did not validate browser request origin;
  configured Turnstile calls also had no timeout/error boundary.
- Impact: a third-party page could attempt browser-driven form abuse, and a
  verification outage could leave a request waiting on an external service.
- Fix: cross-site browser submissions are rejected, Turnstile is bounded to a
  five-second verification window, and verification fails closed whenever the
  secret is configured.
- Mitigation: the existing honeypot, hourly hashed-IP limit, and D1 constraints
  remain layered controls.
- False-positive notes: non-browser clients without an `Origin` header remain
  possible because this is an intentionally public intake; Turnstile and rate
  limiting are the controls for that path.

### WEB-HEADERS-003

- Severity: Medium
- Location: `public/_headers:1-18`
- Evidence: no deployable CSP, clickjacking, MIME-sniffing, referrer, or browser
  capability policy was previously defined in the repository.
- Impact: production would depend entirely on undocumented edge defaults.
- Fix: Cloudflare Pages headers now constrain scripts, frames, connections,
  images, and forms; deny framing; disable unused browser capabilities; and
  apply appropriate API and asset caching policies.
- Mitigation: confirm the emitted headers on the production domain after each
  hosting change.
- False-positive notes: an upstream Cloudflare policy may add further headers;
  that cannot be proven from this repository alone.

### WEB-VALIDATION-004

- Severity: Low
- Location: `src/feedback.ts:1-50`
- Evidence: client and worker previously maintained separate validation schemas.
- Impact: the rules could drift and accept different payloads at each boundary.
- Fix: both layers now use one strict, typed Zod schema, and worker code is part
  of the normal TypeScript build.
- Mitigation: six API regression tests cover origin, size, URL scheme, rate
  limiting, successful persistence, and Turnstile failure.
- False-positive notes: none.

## Deployment controls still required

1. Replace the D1 placeholder in `wrangler.toml` with the production database
   identifier through the deployment environment.
2. Configure matching `VITE_TURNSTILE_SITE_KEY` and
   `TURNSTILE_SECRET_KEY` values. The site key is public; the secret must exist
   only in Cloudflare secrets or local `.dev.vars` and must never be committed.
3. Apply D1 migrations before enabling the public correction form.
4. Verify the production CSP and other headers with an actual HTTPS response.

## Verification commands

```bash
npm run check
npm run test:e2e
npm audit --omit=dev
```
