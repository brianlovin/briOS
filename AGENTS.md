# AGENT INSTRUCTIONS

This repository is a Next.js 15 project built with TypeScript and Tailwind CSS. The following conventions should be followed when contributing code or updating documentation.

## Repository Overview

- `src/app` – Next.js App Router routes. Files and folders here correspond to pages and API routes. Server components are default; add `"use client"` at the top of client components.
- `src/components` – Reusable React components. `src/components/ui` contains primitives (Button, IconButton, etc.). `src/components/icons` holds SVG icon components that accept `IconProps` from `src/components/icons/types.ts`.
- `src/lib` – Utility modules (Notion API helpers, Hacker News utilities, summary generation, etc.).
- `src/atoms` – Jotai atoms for client state.
- `src/hooks` – React hooks (SWR based data fetching utilities).
- `src/data` – Static data used by pages (e.g. security checklist).

### Tooling

- **Package manager:** use [Bun](https://bun.sh/) (`bun install`, `bun add package-name`). Do not use npm or yarn commands.
- **Styling:** Tailwind CSS is used exclusively. Keep styles in class names or in `globals.css`. Do not add CSS modules or other styling frameworks.
- **Linting:** run `bunx next lint` before committing. The project uses ESLint with Prettier, simple-import-sort and unused-imports rules (see `eslint.config.mjs`). Fix lint errors before submitting.
- **TypeScript:** use strict TypeScript. Path alias `@/*` maps to the `src` directory (`tsconfig.json`). Prefer explicit types for function parameters and return values when the type is not obvious.

## Coding Conventions

- Components are exported as named functions:
  ```ts
  export function MyComponent() {
    return <div />;
  }
  ```
- Client components include `"use client"` as the first line.
- Keep code formatted with Prettier defaults (no custom config). Semicolons are required.
- Use the utility `cn` from `src/lib/utils.ts` to concatenate class names.
- When adding icons, create a file in `src/components/icons/Name.tsx` exporting `export function Name(props: IconProps) { ... }`.
- Use SWR for client‑side data fetching (`import useSWR from "swr";`).
- All data fetching hooks should be client-side hooks placed in `src/hooks/` with `"use client"` directive at the top.
- Favor React hooks and functional components over class components.

## Programmatic Checks

Before submitting changes run:

```bash
bunx next lint
```

Commit only when the linter passes.

## Additional Notes

- Keep environment specific values (API keys, etc.) in `.env` files which are git‑ignored.
- Follow the existing folder structure when adding new pages or APIs.
