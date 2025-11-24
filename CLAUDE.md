# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `bun run dev` - Start development server with Turbopack (auto-generates schemas) - **ALWAYS RUNNING ON PORT 3000** (do not attempt to start)
- `bun run build` - Build production bundle
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run format` - Format code with Prettier
- `bun run generate-schemas` - Generate TypeScript schemas from Notion databases

### Environment Setup

- Use Bun for package management (not npm/yarn)
- Use TailwindCSS for styling (latest version)
- Required environment variables for full functionality:
  - `NOTION_TOKEN` - Notion API token
  - `NOTION_STACK_DATABASE_ID` - Stack items database
  - `NOTION_AMA_DATABASE_ID` - AMA questions database
  - `NOTION_MUSIC_DATABASE_ID` - Music/listening history database
  - `JOURNAL_DATABASE_ID` - Journal entries database (for linking music to daily journal)
  - `ADMIN_USER_ID` - Admin user restriction
  - **Spotify Integration**:
    - `SPOTIFY_CLIENT_ID` - Spotify app client ID
    - `SPOTIFY_CLIENT_SECRET` - Spotify app client secret
    - `SPOTIFY_REDIRECT_URI` - OAuth callback URL (e.g., `http://localhost:3000/api/spotify/callback`)
    - `SPOTIFY_TOKEN_DATABASE_ID` - Notion database for storing refresh token
  - **QStash** (for async Spotify sync):
    - `QSTASH_TOKEN` - Upstash QStash API token
    - `QSTASH_CURRENT_SIGNING_KEY` - QStash signature verification key
    - `QSTASH_NEXT_SIGNING_KEY` - QStash next signing key (for key rotation)
    - `CRON_SECRET` - Secret for protecting cron endpoints

## Architecture Overview

### Data Management

- **Notion as CMS**: All content (stacks, AMA, writing) is stored in separate Notion databases
- **Schema Generation**: TypeScript schemas are auto-generated from Notion database properties via `generateNotionSchemas.ts`
- **API Routes**: Next.js route handlers provide cached API endpoints (24-hour cache) for each content type
- **Data Fetching**: SWR for client-side data fetching with custom hooks in `/hooks/`

### UI Architecture

- **Layout System**: Main layout with collapsible sidebar (`PrimarySidebar`) and command menu (`CommandMenu`)
- **List-Detail Pattern**: Consistent navigation pattern with `ListDetailLayout` component
- **State Management**: Jotai for global state (sidebar toggle)
- **Styling**: TailwindCSS with custom design tokens, Radix UI components
- **Hotkeys**: Global keyboard shortcuts via react-hotkeys-hook

### Key Patterns

- **Route Structure**: App router with nested layouts for each content section
- **Infinite Scroll**: Custom `InfiniteScrollList` component with `useInfiniteScroll` hook
- **Theme Support**: next-themes for dark/light mode switching
- **Content Rendering**: Notion blocks rendered to React components in `renderBlocks.tsx`

### Migration Scripts

- `backfillStacksToNotion.ts` - Migrate JSON stack data to Notion
- `backfillAmaToNotion.ts` - Migrate AMA questions to Notion
- `migrateSimplecast.ts` - Mirror podcast episodes to S3

### API Caching

All API routes use Next.js route handlers with 24-hour caching. Data is fetched from Notion and transformed using generated schemas for type safety.

### Spotify Sync Integration

- **Purpose**: Automatically syncs recently played Spotify tracks to Notion Music database
- **Architecture**: Queue-based processing using Upstash QStash
- **Flow**:
  1. Vercel cron job runs hourly (`/api/spotify/sync` GET endpoint)
  2. Fetches last 50 tracks from Spotify API
  3. Filters to unique tracks from last 6 hours
  4. Queues each track to QStash for async processing
  5. QStash calls `/api/spotify/worker` for each track
  6. Worker validates track, finds/links journal entry, and adds to Notion
- **Rate Limiting**: 400ms delay between Notion writes (≤3 req/sec)
- **Timezone**: Converts UTC timestamps to Pacific time for journal linking
- **OAuth**: Use `/api/spotify/callback` for initial Spotify authorization
- **Manual Trigger**: POST to `/api/spotify/sync` to trigger sync manually
- **Libraries**: `@upstash/qstash` for queue management, `src/lib/spotify` for sync logic
