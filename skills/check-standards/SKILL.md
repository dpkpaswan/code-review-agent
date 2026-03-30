---
name: check-standards
description: "Use when checking code against standards and maintainability guidelines."
allowed-tools:
  - Read
---

- Verify consistent naming conventions; flag mixed styles within the same scope.
- Flag any function longer than 40 lines as needing refactor or decomposition.
- Ensure no hardcoded secrets, keys, or credentials are present.
- Confirm errors are handled or surfaced appropriately instead of silently ignored.
- Request brief comments for complex logic paths to aid future maintainers.
