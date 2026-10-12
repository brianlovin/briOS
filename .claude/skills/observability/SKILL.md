---
name: observability
description: Add or query Axiom events and logs in briOS. Use when adding a route, cron, webhook, mutation, or client interaction that should be tracked, or when debugging production behavior in Axiom.
---

# Observability (Axiom)

Server events and warn/error logs go to the Axiom dataset `brios` (org `brios-n08p`).
Without `AXIOM_TOKEN` every call is a no-op, so local dev and tests need no setup.

## Pieces

- `src/lib/axiom.ts` — `track(event, data)`, `trackStep(event, data, fn)`, `flushEvents()`.
  Every event must be declared in `EventFieldMap`; `track` adds `_time`, `event`,
  `environment` and `deployment`.
- `src/lib/logger.ts` — `logger.info` is console-only; `logger.warn` / `logger.error`
  also emit a `log` event with `level`, `message` and context. Use it instead of
  `console.error` on the server.
- `src/lib/observability/axiom-route.ts` — wrap every route handler:
  `export const POST = withAxiom(handler, { name: "/api/thing" })`.
  - `kind: "cron"` → `cron.completed` (always emitted); `kind: "webhook"` →
    `webhook.received` (always); default `api` → `api.request` for mutations and
    for any GET that fails (successful reads are skipped as noise).
  - `quiet: true` emits only on failure (beacons).
  - `annotate({ ... })` inside the handler merges fields into that summary event.
  - The wrapper flushes via `after()`; do not read `request.url`/headers in it
    (GET handlers are prerendered under `cacheComponents`).
- `src/lib/request-context.ts` — `requestContext(request)` gives coarse geo
  (country/region), referrer host/path, hashed `visitor`, `user_agent`, `is_bot`.
  Never log raw IPs.
- Client interactions: add the event to `ClientEventFieldMap` in
  `src/lib/client-events.ts` and a strict schema in `src/lib/client-events-schema.ts`,
  then call `trackClientEvent(event, data)`. It beacons to `/api/events`, which
  validates, drops bots and cross-site posts, and forwards to Axiom.

## Tests

Use `installAxiomMock()` from `src/lib/axiom-test-utils.ts` at the top of a test
file, call `enable()` in `beforeEach` and `disable()` in `afterEach`, then assert on
`events("event.name")`.

## Querying (APL)

```apl
['brios'] | where event == "hn.digest.run" | project _time, total_subscribers, sent, failed, status
['brios'] | where event == "log" and level == "error" | summarize count() by message | order by count_ desc
['brios'] | where event in ("api.request", "cron.completed", "webhook.received") and status >= 500
```
