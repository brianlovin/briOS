# CLAUDE.md

Personal website built with Next.js and Notion as CMS.

## Quick Reference

- **Package manager**: Bun
- **Dev server**: Always running on port 3000 (do not start)
- **Build**: `bun run build`
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Format**: `bun run format`
- **Generate schemas**: `bun run generate-schemas`

## Documentation

- [Architecture](.claude/architecture.md) — Data flow, UI patterns, tech stack
- [Commands](.claude/commands.md) — All available scripts and their usage

## Testing

Tests cover user flows and logic (copy, hrefs, ingest/rollup). Do not add tests that assert on CSS classes, Tailwind tokens, SVG path `d` values, or icon markup unless explicitly asked. See `AGENTS.md`.

## Verification

After making changes:
- `bun run lint` - Run ESLint
- `bun run build` - Production build
