---
name: lint-and-validate
description: "Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers on keywords: lint, format, check, validate, types, static analysis."
---

# Lint and Validate Skill

> **MANDATORY:** Run appropriate validation tools after EVERY code change. Do not finish a task until the code is error-free.

### Procedures by Ecosystem

#### Node.js / TypeScript (Multi-app / Monorepo)

For this workspace, commands should be run targeting the respective sub-project:

1. **Frontend (`frontend/`):**
   - **Lint/Fix:** `npm --prefix frontend run lint`
   - **Types:** `npx --prefix frontend tsc --noEmit`

2. **Backend (`backend/`):**
   - **Lint/Fix:** `npm --prefix backend run lint`
   - **Types:** `npx --prefix backend tsc --noEmit`
   - **Format:** `npm --prefix backend run format`

#### Python (if applicable)
1. **Linter (Ruff):** `ruff check "path" --fix` (Fast & Modern)
2. **Security (Bandit):** `bandit -r "path" -ll`
3. **Types (MyPy):** `mypy "path"`

## The Quality Loop
1. **Write/Edit Code**
2. **Run Audit:** Run `python .agent/skills/lint-and-validate/scripts/lint_runner.py .` or run sub-app lint commands.
3. **Analyze Report:** Check the audit report output for errors or warnings.
4. **Fix & Repeat:** Submitting code with lint or type errors is NOT allowed.

## Error Handling
- If `lint` fails: Fix the style or syntax issues immediately.
- If `tsc` fails: Correct type mismatches before proceeding.
- If no tool is configured: Check the sub-project directory for ESLint/TypeScript configuration.

---
**Strict Rule:** No code should be committed or reported as "done" without passing these checks.

---

## Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/lint_runner.py` | Unified lint check (auto-detects frontend/backend) | `python .agent/skills/lint-and-validate/scripts/lint_runner.py <project_path>` |
| `scripts/type_coverage.py` | Type coverage analysis | `python .agent/skills/lint-and-validate/scripts/type_coverage.py <project_path>` |
