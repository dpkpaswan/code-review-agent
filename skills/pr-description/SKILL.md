---
name: pr-description
description: "Generates a pull request description from code diff"
allowed-tools:
  - Read
  - Bash
---

# PR Description Generator

Given a git diff or changed files:
1. Summarize what changed in plain English
2. List files modified
3. Highlight any breaking changes
4. Suggest PR title

Output format:
## PR Title
[suggested title]

## Summary
[2-3 sentence summary]

## Changes
- [file]: [what changed]

## Breaking Changes
[none / list them]
