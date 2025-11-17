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
  - `ADMIN_USER_ID` - Admin user restriction

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
