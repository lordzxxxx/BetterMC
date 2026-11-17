# Hostinger and school subdomains

Updated 17 November 2026.

## Current production arrangement

`bettermalaybalay.cloud` is registered through Hostinger, but its authoritative
nameservers are currently:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

The BetterMC Vercel project (`better-mc`) owns these domains:

- `bettermalaybalay.cloud`
- `www.bettermalaybalay.cloud`
- `*.bettermalaybalay.cloud`

The wildcard record means the application does not need one DNS record per
school. Every registry record receives a deterministic host such as
`bangcud-central-school.bettermalaybalay.cloud`, and the application resolves
that host to the matching school profile.

## Do not add duplicate records in Hostinger DNS

While the domain uses Vercel nameservers, DNS records entered in Hostinger's
DNS zone are not authoritative. The live wildcard must be maintained in Vercel
DNS. The existing wildcard has been checked against all 107 school profile
hosts and each returned HTTP 200 over HTTPS.

## If DNS must be moved back to Hostinger

Only do this if the deployment owner intentionally wants Hostinger to manage
DNS. First add the domain to the Vercel project and copy the exact records
shown by Vercel's domain setup screen. Then, in Hostinger DNS, add the Vercel
records for the apex and `www`, plus a wildcard record for `*`. Do not guess
the target value: use the value Vercel displays for the project, then wait for
DNS and certificate propagation before changing nameservers.

After any DNS change, verify:

```sh
dig +short NS bettermalaybalay.cloud
dig +short bangcud-central-school.bettermalaybalay.cloud
curl -I https://bangcud-central-school.bettermalaybalay.cloud/
```

The expected production response is HTTP 200, and the browser should render
the school-specific profile rather than the generic education directory.
