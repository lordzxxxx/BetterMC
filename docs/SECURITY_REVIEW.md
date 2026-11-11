# Security review

Reviewed: **2026-11-11**

## Scope

This is a repository-level review of the Vercel deployment configuration, browser response policy, and public email-forwarding endpoint. It is not a penetration test or a guarantee against every vulnerability.

## Controls in the repository

- The public submission body is size-limited and validated with the shared Zod schema; source URLs are restricted to HTTP and HTTPS.
- Cross-site browser requests are rejected, and optional Turnstile verification fails closed when a secret is configured.
- Resend requests have a timeout; user-provided text is escaped before inclusion in the notification email.
- API responses use `no-store`, `nosniff`, and same-origin resource policy headers.
- Vercel response headers define CSP, clickjacking, referrer, transport-security, and browser-capability policies.
- Secrets are documented as server-only environment variables and are not part of the Vite client bundle.

## Known limitations

- The endpoint forwards email but does not persist submissions or enforce a rate limit. Email forwarding is not a moderation queue or an auditable case-management system.
- Turnstile is an optional Cloudflare service used only for bot verification; it does not host or deploy the site.
- CSP permits the external tile, image, and Turnstile providers required by the current interface. Review this list if providers change.
- Production headers and environment values must be verified on the deployed Vercel domain.

## Verification

```bash
npm run check
npm run test:e2e
npm audit --omit=dev
```
