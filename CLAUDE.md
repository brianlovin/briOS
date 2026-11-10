# CLAUDE.md

Personal website built with Next.js and Notion as CMS.

## Quick Reference

- **Package manager**: Bun
- **Dev server**: Locally, always running on port 3000 (do not start). In cloud sessions nothing is running: start it with `bun run dev` when you need it
- **Build**: `bun run build`
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Actions pinning**: `bun run lint:actions` (every `uses:` must be a full commit SHA; see `AGENTS.md`)
- **Format**: `bun run format`
- **Generate schemas**: `bun run generate-schemas`

## Documentation

- [Architecture](.claude/architecture.md) — Data flow, UI patterns, tech stack
- [Commands](.claude/commands.md) — All available scripts and their usage
- [Observability](.claude/skills/observability/SKILL.md) — Axiom events, logger, route wrapper, APL queries

## Testing

Tests cover user flows and logic (copy, hrefs, ingest/rollup). Do not add tests that assert on CSS classes, Tailwind tokens, SVG path `d` values, or icon markup unless explicitly asked. See `AGENTS.md`.

## Verification

After making changes:

- `bun run lint` - Run ESLint
- `bun run build` - Production build (needs the app's environment variables)

In cloud sessions, `bun run lint` is the required check before committing; remote CI runs the rest on the PR. To run exactly what CI runs (CI script tests, lint, every app test, production build), use `bun run ci:all`. It supplies its own placeholder variables, uses no network, and requires Node 22 and Bun 1.3.3.
