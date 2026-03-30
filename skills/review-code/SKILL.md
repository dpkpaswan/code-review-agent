---
name: review-code
description: "Use when reviewing code or diffs to flag bugs, security issues, and performance concerns."
allowed-tools:
  - Read
  - Bash
---

- Read the provided diff or file content (use diff-reader when available).
- Identify bugs, security risks, performance issues, and structural flaws with concise evidence.
- Categorize every finding per RULES.md and include file paths with line numbers or ranges.
- Note positive patterns briefly when they strengthen safety or maintainability.
- Close with the required verdict format after summarizing critical blockers.
