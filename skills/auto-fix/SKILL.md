---
name: auto-fix
description: "Generates a fully corrected version of reviewed code"
metadata:
  allowed-tools:
    - Read
    - Write
---

# Auto Fix

After reviewing code, generate a fully fixed version:
1. Apply all [BUG] and [SECURITY] fixes
2. Fix naming convention violations
3. Add missing error handling
4. Remove hardcoded secrets - replace with process.env references
5. Add this header to the fixed file:

// ✅ Auto-fixed by code-review-agent v0.1.0
// Issues resolved: [count]
// Original file: [filename]
// Fixed on: [date]

Rules:
- Never change business logic
- Only fix clear violations
- Keep all comments from original
- Output the COMPLETE fixed file, not just changed lines
