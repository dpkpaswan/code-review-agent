# JavaScript Best Practices

- Use consistent camelCase naming for variables and functions.
- Keep functions small and focused; prefer <= 30 lines for maintainability.
- Avoid hardcoded secrets; load credentials from environment variables.
- Validate and sanitize external input before rendering or executing queries.
- Wrap async logic with try/catch and return meaningful errors.
- Avoid global mutable state and undefined variable access.
- Use explicit awaits for promises returned by async operations.