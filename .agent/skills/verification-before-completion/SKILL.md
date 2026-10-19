---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or finishing a task. Requires running verification commands and confirming output before making any success claims; evidence before assertions always.
---

# Verification Before Completion

> **Adapted from `obra/superpowers` for the `soc-crru-web` Antigravity Kit & Ponytail environment.**

## Overview

**Core principle:** Evidence before claims, always.

Claiming work is complete without verification is not efficiency—it is dishonesty. This skill enforces running actual verification commands and inspecting their output in the current turn before reporting completion.

## The Iron Law

```plaintext
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this session/turn, you cannot claim it passes.

## The Gate Function

```plaintext
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
   - Backend (`apps/backend`): `npm run build --workspace=backend` / `npm run test --workspace=backend`
   - Frontend (`apps/frontend`): `npm run lint --workspace=frontend` / `npm run build --workspace=frontend`
   - Project Audit: `python .agent/scripts/checklist.py .`
2. RUN: Execute the FULL command via `run_command` (fresh, complete)
3. READ: Full output, check exit code, count errors/failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence (exit code + summary)
5. ONLY THEN: Make the completion claim

Skip any step = guessing, not verifying.
```

## Common Failures vs. Required Evidence

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| **Tests pass** | Test command output showing 0 failures | Previous run, "should pass", code inspection |
| **TypeScript / Linter clean** | `tsc` / `eslint` / `lint_runner.py` output with 0 errors | Partial check, IDE cache extrapolation |
| **Build succeeds** | Build command with `exit code 0` | Linter passing, logs look good |
| **Bug fixed** | Original symptom reproduced & verified passing | Code changed, assumed fixed |
| **Subagent completed** | `git status` / `git diff` + verification command | Subagent message saying "Done!" |
| **Requirements met** | Line-by-line check against plan/request | Tests passing alone |

## Harmonization with Ponytail Rule

- **Trivial one-liners:** Still require verifying that the file compiles/lints cleanly or the UI renders without syntax errors.
- **Non-trivial logic:** Must leave **ONE runnable check** behind and execute it to prove green status before finishing.

## Red Flags — STOP Immediately

If you catch yourself thinking or writing any of the following before running a command, **STOP and run the verification**:

- Using words like *"should"*, *"probably"*, *"seems to"*, or *"I've fixed"* before checking output
- Expressing satisfaction (*"Great!"*, *"All done!"*, *"Fixed!"*) before verification runs
- Trusting a subagent's self-reported success without checking the actual files and build/test status
- Relying on a partial check when a full build/typecheck is needed
