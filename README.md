# 🤖 code-review-agent

> A git-native AI agent that reviews your code like a senior engineer — catching bugs, security vulnerabilities, and style violations, then auto-fixing them.

Built for the **[GitAgent Hackathon](https://hackculture.in)** using the [gitagent open standard](https://github.com/open-gitagent/gitagent).

---

## ✨ What It Does

Drop any JavaScript file in front of this agent and it will:

- 🐛 **Catch bugs** — undefined variables, missing awaits, logic errors
- 🔒 **Flag security issues** — SQL injection, hardcoded API keys, XSS vulnerabilities
- 📐 **Enforce standards** — naming conventions, function length, error handling
- 🔧 **Auto-fix** — generates a corrected `.fixed.js` file automatically
- 📊 **Grade your code** — assigns an A–F severity score with reasoning
- 📝 **Save reports** — timestamped `REVIEW-YYYY-MM-DD.md` after every run

---

## 🗂️ Agent Structure

```
code-review-agent/
├── agent.yaml                    # Manifest: model, skills, version
├── SOUL.md                       # Agent identity & communication style
├── RULES.md                      # Hard constraints & review format
├── DUTIES.md                     # Role separation (checker, not maker)
├── skills/
│   ├── review-code/SKILL.md      # Core review logic with categorized output
│   ├── check-standards/SKILL.md  # Naming, length, error handling checks
│   ├── suggest-fixes/SKILL.md    # Before/After fix snippets
│   ├── security-audit/SKILL.md   # OWASP Top 10 vulnerability scanning
│   └── auto-fix/SKILL.md         # Generates fully corrected files
├── tools/
│   └── diff-reader.yaml          # Tool schema for reading diffs
├── memory/
│   └── review-history.md         # Agent remembers recurring patterns
├── knowledge/
│   └── owasp-top10.md            # Reference docs for security checks
└── demo/
    ├── bad-code.js               # Intentionally vulnerable demo file
    ├── bad-code.fixed.js         # Auto-generated fixed version
    ├── run-demo.js               # Agent runner script
    └── REVIEW-2026-04-01.md      # Sample review report
```

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/dpkpaswan/code-review-agent
cd code-review-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your API key

```bash
# Windows
set GEMINI_API_KEY=your-key-here

# Mac/Linux
export GEMINI_API_KEY=your-key-here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 4. Run the agent

```bash
# Review all files in demo/
node demo/run-demo.js

# Review any specific file
node demo/run-demo.js src/auth.js
node demo/run-demo.js src/database.js
```

---

## 📋 Sample Output

```
🤖 CodeReview Agent starting...
📄 Reviewing 1 file(s)

🔍 Reviewing: demo/bad-code.js

[SECURITY] Line 1 — Hardcoded API key exposed in source.
  Replace with: process.env.API_KEY

[BUG] Line 12 — SQL query built via string concatenation.
  Vulnerable to injection. Use parameterized queries.

[BUG] Line 24 — Missing await on res.json().
  Will return a Promise instead of data silently.

[SECURITY] Line 31 — document.innerHTML assigned unsanitized input.
  XSS vulnerability. Use textContent or sanitize first.

[STYLE] Line 38 — Function doStuff() has 15 parameters and 30+ lines.
  Break into smaller, named functions.

[STYLE] Line 52 — Mixed naming: user_name, userAge, User_Email.
  Use camelCase consistently throughout.

## Overall Grade: F (20/100)
Reason: Critical security vulnerabilities and multiple bugs found.

────────────────────────────────────────────────────────────
🔧 Generating auto-fix for demo\bad-code.js...
✅ Fixed file saved: demo\bad-code.fixed.js

════════════════════════════════════════════════════════════
📊 SUMMARY
════════════════════════════════════════════════════════════
  demo\bad-code.js               Grade: F  Issues: 8
────────────────────────────────────────────────────────────
  Overall Codebase Grade: F (20/100)
  Total Issues Found:     8
════════════════════════════════════════════════════════════
📝 Full report: demo/REVIEW-2026-04-01.md
✅ Review complete.
```

---

## 🧠 How It Works

This agent follows the **gitagent open standard** — its entire identity, rules, and skills live as readable files in this repo. No framework lock-in.

```
Your code file
      ↓
run-demo.js reads SOUL.md + RULES.md + all SKILL.md files
      ↓
Builds a system prompt (what gitagent CLI would generate)
      ↓
Sends to Gemini 2.5 Flash with your code as user message
      ↓
Structured review → auto-fix → graded report saved to disk
```

The agent cascades through multiple models automatically if one is rate-limited — same resilience pattern used in production systems.

---

## 🎭 Agent Personality (SOUL.md)

The agent is defined as a **senior software engineer** — direct but encouraging, never shaming bad code, always explaining *why* something is wrong and *how* to fix it. It celebrates good patterns when it sees them.

Every finding is categorized:

| Tag | Meaning |
|-----|---------|
| `[BUG]` | Logic error or crash risk |
| `[SECURITY]` | Vulnerability — never approved |
| `[STYLE]` | Convention violation |
| `[PERFORMANCE]` | Inefficiency |
| `[SUGGESTION]` | Optional improvement |

Every review ends with a verdict: **APPROVE / REQUEST CHANGES / DISCUSS**

---

## 📏 Skills

| Skill | What it does |
|-------|-------------|
| `review-code` | Core review with categorized findings and verdict |
| `check-standards` | Naming, function length, hardcoded secrets, error handling |
| `suggest-fixes` | Before/After code snippets for every issue |
| `security-audit` | OWASP Top 10 scan with severity ratings |
| `auto-fix` | Generates complete corrected file with fix header |

---

## 🔒 Rules (RULES.md)

The agent **must always:**
- Include line numbers on every finding
- Explain the reason behind every suggestion
- End with APPROVE / REQUEST CHANGES / DISCUSS

The agent **must never:**
- Approve code with security vulnerabilities
- Give vague feedback like "improve this"
- Rewrite entire files — targeted changes only
- Be condescending or discouraging

---

## 📦 Built With

- [gitagent standard](https://github.com/open-gitagent/gitagent) — agent definition format
- [Gemini 2.5 Flash](https://aistudio.google.com) — LLM backend (free tier)
- Node.js — runner script
- No frameworks, no lock-in

---

## 👨‍💻 Author

**Deepak Paswan**
B.Com ISM, University of Madras
[github.com/dpkpaswan](https://github.com/dpkpaswan)

---

## 📄 License

MIT — fork it, extend it, use it in your own projects.

---

*Built for the GitAgent Hackathon 2026 — organized by Lyzr AI on HackCulture*
