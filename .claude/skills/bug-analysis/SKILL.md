---
name: bug-analysis
description: Analyze bugs from Notion Site Ideas to understand root cause and plan fixes. Use this when given bug reports that need investigation before implementation.
---

# Bug Analysis Skill

When analyzing bugs from Notion Site Ideas database, follow this systematic approach:

## 1. Parse the Bug Report

Extract key information from the Notion page:
- **Title**: What is the bug called?
- **Description**: What behavior is reported?
- **Steps to reproduce**: How can the bug be triggered?
- **Expected vs actual**: What should happen vs what does happen?

## 2. Categorize the Bug

Determine the bug type:
- **UI/Visual**: Layout, styling, or rendering issues
- **Functionality**: Features not working as expected
- **Data**: Incorrect data display or processing
- **Performance**: Slow loading or responsiveness issues
- **Integration**: Issues with Notion API or external services

## 3. Locate Affected Code

Search strategy based on bug type:
- For UI bugs: Check components in `src/components/` and page files in `src/app/`
- For API bugs: Check route handlers in `src/app/api/`
- For Notion bugs: Check `src/lib/notion/` for queries and data processing
- For state bugs: Check hooks in `src/hooks/` and Jotai atoms

## 4. Root Cause Analysis

Ask these questions:
- When did this start happening? (check recent commits)
- Is it reproducible consistently?
- Does it affect all users or specific scenarios?
- Are there related error messages in console/logs?

## 5. Plan the Fix

Before implementing:
- Identify the minimal change needed
- Consider edge cases the fix might affect
- Check if tests exist for this area
- Estimate complexity (simple fix vs refactor needed)

## Output

Provide a clear analysis with:
1. Bug summary in your own words
2. Likely root cause
3. Affected files (with line numbers if possible)
4. Recommended fix approach
5. Risk assessment (low/medium/high)

## Before Committing

Always run these commands before pushing:
1. `bun run lint:fix && bun run format` - Fix all formatting issues (eslint + prettier)
2. `bun run build` - Verify no build errors

Running both lint:fix and format ensures eslint and prettier are in sync, preventing CI failures.
