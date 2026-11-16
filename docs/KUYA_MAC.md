# Kuya MAC

Kuya MAC (Malaybalay AI Companion) is BetterMC's independent, source-first public-information guide. It is not a City Government representative and it does not submit applications, modify records, or make legal or compliance findings.

## Retrieval and source boundaries

- The service retrieves matching entries from `src/searchIndex.ts`, the same index used by BetterMC's portal search. That index is built from the versioned, source-backed public datasets already displayed by the portal.
- Every response returns direct BetterMC record links. A response must not invent a public official, amount, contact detail, or verification date when no matching record is retrieved.
- Updating a verified portal dataset updates the retrieval corpus on the next deployment. This is build-synchronized data, not a claim of live government-system synchronization.
- The assistant accepts greetings and BetterMC/Malaybalay civic-information questions only. Off-topic prompts, private-system requests, and prompt-injection attempts are rejected by the server.
- Kuya MAC has no external model provider, chatbot API key, or tool access. It returns concise directory guidance and direct BetterMC record links only.

## Security and operations

- `POST /api/kuya-mac` accepts a size-limited, Zod-validated question.
- Requests must be same-origin or local development origin. A per-instance fixed-window limit protects a warm serverless instance from burst traffic. Configure an edge/WAF rate limit for global enforcement; serverless memory is not shared across all instances.
- Re-run `npm run check` and the assistant retrieval tests whenever public datasets or its retrieval rules change.

## QA checklist

Test English, Filipino, and Cebuano questions; source links; unavailable information; off-topic refusal; attempts to obtain prompts/secrets; keyboard opening, Escape dismissal, and a narrow mobile viewport.
