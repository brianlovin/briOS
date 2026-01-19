# Architecture

## Data Layer

**Notion as CMS**: All content (stacks, AMA, writing, music, speaking, etc.) lives in separate Notion databases.

**Schema generation**: TypeScript schemas are auto-generated from Notion database properties via `generateNotionSchemas.ts`. The dev server runs this automatically on startup.

**API routes**: Next.js route handlers with 24-hour caching. Data flows from Notion → API route → SWR hook → component.

**Client-side fetching**: SWR hooks in `/hooks/` handle data fetching and caching.

## UI Layer

**Layout system**:

- `PrimarySidebar` — Collapsible navigation sidebar
- `CommandMenu` — Global command palette
- `ListDetailLayout` — Consistent list-detail navigation pattern

**State management**: Jotai for global state (sidebar toggle, etc.)

**Styling**: TailwindCSS with custom design tokens, Radix UI primitives

**Hotkeys**: Global keyboard shortcuts via `react-hotkeys-hook`

## Key Patterns

**Route structure**: App router with nested layouts per content section

**Infinite scroll**: `InfiniteScrollList` component + `useInfiniteScroll` hook

**Theming**: `next-themes` for dark/light mode

**Content rendering**: Notion blocks → React components via `renderBlocks.tsx`

## Notion Webhooks

Webhook endpoints called by Notion database automations (button properties). All webhooks verify the `x-webhook-secret` header against `NOTION_WEBHOOK_VERIFICATION_SECRET` if configured.

**Endpoints**:

- `/api/webhooks/generate-short-id` — Generates a unique 7-char Short ID for writing posts
- `/api/webhooks/optimize-writing-images` — Optimizes and uploads blog images to R2
- `/api/webhooks/process-stack-icon` — Optimizes existing stack page icons to R2
- `/api/webhooks/update-site-icon` — Fetches and optimizes favicons for good websites

**Notion automation setup**:

1. Add a button property to the database
2. Configure action: "Send webhook"
3. URL: `https://yoursite.com/api/webhooks/<endpoint>`
4. Add header: `x-webhook-secret: <your-secret>`
5. Body template: `{ "data": { "id": "{{id}}" } }` (or include properties as needed)

## Migration Scripts

These scripts were used for one-time data migrations and are rarely needed:

- `backfillStacksToNotion.ts` — Migrated JSON stack data to Notion
- `backfillAmaToNotion.ts` — Migrated AMA questions to Notion
- `migrateSimplecast.ts` — Mirrored podcast episodes to S3
