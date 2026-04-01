# Review Memory

## Patterns I've Seen
- SQL injection via string concatenation (seen 3x)
- Hardcoded API keys in index.js files (seen 2x)
- Missing null checks on user objects (seen 5x)

## Team Preferences
- This codebase uses camelCase for all variables
- Functions should not exceed 30 lines
- All async functions must have try/catch