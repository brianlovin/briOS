# Architecture

## Data Layer

**Notion as CMS**: All content (stacks, AMA, writing, music, speaking, etc.) lives in separate Notion databases.

**Schema generation**: TypeScript schemas are auto-generated from Notion database properties via `generateNotionSchemas.ts`. The dev server runs this automatically on startup.

**API routes**: Next.js route handlers with 24-hour caching. Data flows from Notion → API route → SWR hook → component.

**Client-side fetching**: SWR hooks in `/hooks/` handle data fetching and caching.

## UI Layer

**Layout system**:

- `MobileNavMenu` — Full-screen nav overlay (`sidebarAtom` = overlay open)
- `CommandMenu` — Global command palette (separate jump surface)
- `ListDetailLayout` — List-detail panes; list vs detail is derived from the URL (`backHref` vs pathname), dual-pane at `@3xl`
- `BodyLock` — Single owner of `document.body.style.overflow` (list-detail mounted or overlay open)
- Visible pane registers `scrollTargetAtom` for top-bar click-to-top

**State management**: Jotai for global state (sidebar toggle, etc.)

**Styling**: TailwindCSS with custom design tokens, Radix UI primitives

**Hotkeys**: Global keyboard shortcuts via `react-hotkeys-hook`

## Key Patterns

**Route structure**: App router with nested layouts per content section

**Infinite scroll**: `InfiniteScrollList` component + `useInfiniteScroll` hook

**Theming**: `next-themes` for dark/light mode

**Content rendering**: Notion blocks → React components via `renderBlocks.tsx`

## GitHub Activity Webhook

`POST /api/webhooks/github` receives GitHub `pull_request` and `star` events and writes them to the public `/activity` feed via in-process `ingestActivityEvent`. It does not use the HMAC ingest URL.

Verify `X-Hub-Signature-256` (`sha256=<hex>`) against `GITHUB_ACTIVITY_WEBHOOK_SECRET` with `safeCompare`. Missing secret → 503. Bad signature → 401. Ignored events (ping, bots, star deletions, closed-unmerged PRs) return 200 so GitHub does not retry.

Recorded types: `pr_opened`, `pr_merged`, `repo_starred`. Private repositories are recorded with generic copy — no repo name, title, or URL. Dependabot PRs are skipped; coding-agent PRs (e.g. `cursor[bot]`) are kept. Stars are humans only.

**GitHub hook setup** (after `GITHUB_ACTIVITY_WEBHOOK_SECRET` is set in Vercel):

1. Repo → **Settings → Webhooks → Add webhook**
2. Payload URL: `https://brianlovin.com/api/webhooks/github`
3. Content type: `application/json` (not form-encoded)
4. Secret: the same value as `GITHUB_ACTIVITY_WEBHOOK_SECRET`
5. Events: **Let me select individual events** → **Pull requests** and **Stars**
6. Active → **Add webhook**. GitHub sends a `ping`; a 200 means the endpoint is up.

Repeat per repo (including private). One hook does not cover a personal account. For every repo under one install, use a GitHub App webhook with the same URL, secret, and `pull_request` + `star` events.

## Notion Webhooks

Webhook endpoints called by Notion database automations (button properties). All webhooks verify the `x-webhook-secret` header against `NOTION_WEBHOOK_VERIFICATION_SECRET` if configured.

**Endpoints**:

- `/api/webhooks/generate-short-id` — Generates a unique 7-char Short ID for writing posts
- `/api/webhooks/optimize-writing-images` — Optimizes and uploads blog images to R2
- `/api/webhooks/illustrate-journal` — Acks immediately, then replaces Journal page photos in place with 4:3 rubber-stamp field-note posters
- `/api/webhooks/process-stack-icon` — Optimizes existing stack page icons to R2
- `/api/webhooks/update-site-icon` — Fetches and optimizes favicons for good websites

**Illustrate Journal button** (Journal database; share the DB with the Notion integration after merge):

1. Add a button property (or automation) that sends a webhook
2. URL: `https://brianlovin.com/api/webhooks/illustrate-journal`
3. Header: `x-webhook-secret` = `NOTION_WEBHOOK_VERIFICATION_SECRET`
4. Body: the automation page payload, `{ "data": { "id": "{{id}}" } }`
5. The route returns 200 immediately (`{ accepted: true, pageId }`) so Notion does not time out. Gemini + Sharp + R2 run after the response via Next.js `after()` (`maxDuration` 300). Each run walks image blocks (max 8), skips captions already marked `field-note`, and replaces the block URL with the poster. Videos are ignored. Do not keep originals.

**Cache purge buttons** (same `CACHE_PURGE_SECRET` as `/api/purge-cache`):

- Writing / TIL / AMA / Stack / Sites / Computer: `https://brianlovin.com/api/purge-cache?secret=<CACHE_PURGE_SECRET>&type=<type>`
- Computer tips (`type=computer`) should also be added as a Notion button on the Tips database or the How to Computer Better parent page. Publishing a tip in Notion does not invalidate the site until this button is pressed.

**Notion automation setup**:

1. Add a button property to the database
2. Configure action: "Send webhook"
3. URL: `https://yoursite.com/api/webhooks/<endpoint>` (or `/api/purge-cache?secret=<CACHE_PURGE_SECRET>&type=computer` for tips)
4. Add header: `x-webhook-secret: <your-secret>` (webhook endpoints) — purge buttons use the `secret` query param instead
5. Body template: `{ "data": { "id": "{{id}}" } }` (or include properties as needed)

## Migration Scripts

These scripts were used for one-time data migrations and are rarely needed:

- `backfillStacksToNotion.ts` — Migrated JSON stack data to Notion
- `backfillAmaToNotion.ts` — Migrated AMA questions to Notion
- `migrateSimplecast.ts` — Mirrored podcast episodes to S3
