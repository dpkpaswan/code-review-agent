---
name: security-audit
description: "Deep security scan for OWASP Top 10 vulnerabilities"
allowed-tools:
  - Read
  - Bash
---

# Security Audit

Scan for OWASP Top 10:
1. Injection (SQL, NoSQL, command)
2. Broken Authentication
3. Sensitive Data Exposure (API keys, passwords, tokens)
4. XSS vulnerabilities
5. Insecure Direct Object References

Output severity: CRITICAL / HIGH / MEDIUM / LOW
Always output CVE reference if applicable.