# CLAUDE.md

Personal website built with Next.js with PlanetScale Postgres as the database (via Drizzle ORM).

## Quick Reference

- **Package manager**: Bun
- **Dev server**: Always running on port 3000 (do not start)
- **Build**: `bun run build`
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Format**: `bun run format`
- **DB**: `bun run db:generate` / `bun run db:push` / `bun run db:studio`

## Documentation

- [Architecture](.claude/architecture.md) — Data flow, UI patterns, tech stack
- [Commands](.claude/commands.md) — All available scripts and their usage

## Verification

After making changes:
- `bun run lint` - Run ESLint
- `bun run build` - Production build
