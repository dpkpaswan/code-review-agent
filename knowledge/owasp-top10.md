# OWASP Top 10 Quick Reference

1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

Review focus:
- Treat any hardcoded key/token/password as Sensitive Data Exposure.
- Treat string-built queries and commands as Injection candidates.
- Flag unsafe direct rendering of user input as XSS risk.