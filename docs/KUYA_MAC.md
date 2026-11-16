# Kuya MAC

Kuya MAC (Malaybalay AI Companion) is BetterMC's independent, source-first public-information guide. It is not a City Government representative and it does not submit applications, modify records, or make legal or compliance findings.

## Retrieval and source boundaries

- The service retrieves matching entries from `src/searchIndex.ts`, the same index used by BetterMC's portal search. That index is built from the versioned, source-backed public datasets already displayed by the portal.
- Every response returns direct BetterMC record links. A response must not invent a public official, amount, contact detail, or verification date when no matching record is retrieved.
- Updating a verified portal dataset updates the retrieval corpus on the next deployment. This is build-synchronized data, not a claim of live government-system synchronization.
- The assistant accepts greetings and BetterMC/Malaybalay civic-information questions only. Off-topic prompts, private-system requests, and prompt-injection attempts are rejected by the server before an optional model request.

## Production configuration

The assistant always has a verified-directory fallback. To enable model-written, multilingual summaries, set these **server-only** Vercel environment variables:

```text
KUYA_MAC_OPENAI_API_KEY=...
KUYA_MAC_OPENAI_MODEL=...
```

Do not prefix either variable with `VITE_`, do not put either in browser code, and do not commit either value. The endpoint uses the Responses API with `store: false`; it has no tools and cannot access records beyond its supplied retrieval context.

## Security and operations

- `POST /api/kuya-mac` accepts a size-limited, Zod-validated message and at most six short context turns.
- Requests must be same-origin or local development origin. A per-instance fixed-window limit protects a warm serverless instance from burst traffic. Configure an edge/WAF rate limit for global enforcement; serverless memory is not shared across all instances.
- Model requests time out and return a source-only response when the provider is unavailable. Neither the browser nor returned error messages expose API keys or provider details.
- Re-run `npm run check` and the assistant retrieval tests whenever public datasets or its retrieval rules change.

## QA checklist

Test English, Filipino, and Cebuano questions; source links; unavailable information; off-topic refusal; attempts to obtain prompts/secrets; keyboard opening, Escape dismissal, and a narrow mobile viewport. Verify that the Vercel environment variables exist before claiming AI-generated answers are live.
