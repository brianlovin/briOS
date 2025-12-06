---
description: Automatically fix bugs from Notion Site Ideas database, one at a time
allowed-tools: Bash(git:*), Bash(gh:*), Bash(bun:*), Read, Write, Edit, Grep, Glob, AskUserQuestion
---

# Automated Bug Fixer

I will automatically work through bugs from your Notion Site Ideas database. You only need to review changes and approve PRs.

## Workflow for each bug:

1. Fetch bug from Notion and update status to "Doing"
2. Create branch `fix/bug-{id}` from main
3. Analyze and implement the fix
4. Run `bun run lint:fix && bun run format` to fix all formatting issues
5. Run `bun run build` to verify no build errors
6. Show you the diff for review
7. On approval: commit, push, create PR, update Notion to "Done"
8. Ask if you want to continue to the next bug

**Important:** Always run `bun run lint:fix && bun run format` before committing to ensure eslint and prettier are in sync, avoiding CI failures.

## Starting the workflow:

```bash
bun run scripts/bugfixer.ts list | jq '.[0]'
```

I'll now fetch the first bug and begin working on it automatically. You'll only need to:
- Review the changes I show you
- Approve or request adjustments
- Decide whether to continue to the next bug
