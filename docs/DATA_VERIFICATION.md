# Verifying transparency figures

Every figure on the Transparency pages must trace to an official document. Use this checklist before publishing or updating numbers.

## 1. Check that sources are reachable
```
npm run verify:sources
```
Requests every cited URL with normal TLS verification and lists failures. A failure means residents (and reviewers) cannot open that source right now, which must be fixed or disclosed before the figure is trusted.

Notes on results:
- `CERT_HAS_EXPIRED` / `SELF_SIGNED_CERT_IN_CHAIN`: the host's certificate is bad; browsers will warn or show a blank page.
- `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`: usually a server missing its intermediate certificate; confirm in a browser.
- `MANUAL CHECK (Drive)`: Google Drive blocks scripts; open these links in a browser.

Common causes of a blank page or browser warning:
- **Expired or invalid SSL certificate** on the city host (`*.malaybalaycity.gov.ph`). Browsers block or blank the page. Only the city's IT office can renew it. Do not instruct users to bypass the warning.
- PDF moved or renamed after a site migration (the city site has used `sakata.` and `staging.` hosts).

## 2. Check every figure against the document
For each figure, record: document title, page, quarter/year, and the exact value as printed. Re-enter figures by hand from the PDF; do not copy from secondary sites. Totals must equal the sum of their line items.

## 3. Use independent cross-checks
- Commission on Audit Annual Audit Reports: https://www.coa.gov.ph
- DBM Local Budget Circulars and NTA/IRA schedules: https://www.dbm.gov.ph
- Bureau of Local Government Finance SRE data: https://blgf.gov.ph
- DILG Full Disclosure Policy Portal: https://fdpp.dilg.gov.ph
- PhilGEPS awards: https://notices.philgeps.gov.ph

If the city's own copy and an independent source disagree, publish both and flag the discrepancy.

## 4. If the official source is down
- Ask the city (Mayor's Office / ICT / Budget Office) for a corrected link or a copy, and keep the request on record.
- Save a dated copy of the PDF once obtained, with its SHA-256 hash, so figures remain checkable if the source disappears.
- Mark the figure "unverified: source unavailable" in the UI instead of leaving a dead link.

Re-run `npm run verify:sources` before every release.
