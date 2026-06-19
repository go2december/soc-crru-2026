# Plan: Add Ponytail (add-ponytail)

## Overview
This plan implements the integration of Ponytail (the lazy senior dev ruleset and skills) into the Antigravity Kit of the SOC-CRRU project.

## Success Criteria
- [x] 5 Ponytail skills copied to `.agent/skills/`
- [x] Global Rules (`.agent/rules/GEMINI.md`) modified to include Ponytail rules
- [x] IDE config files (.cursor, .windsurf, .clinerules, .github) copied to workspace root
- [x] Temp directory `ponytail-temp` deleted

## Success Metrics
- Codebase contains ponytail skills and config files.
- GEMINI.md has ponytail ladder always-on rules.

## Tech Stack
- Antigravity Kit (agent framework)
- IDE configs (Cursor, Windsurf, Cline, Copilot)

## File Structure
```
.agent/
  rules/
    GEMINI.md (Modified)
  skills/
    ponytail/
      SKILL.md
    ponytail-review/
      SKILL.md
    ponytail-audit/
      SKILL.md
    ponytail-debt/
      SKILL.md
    ponytail-help/
      SKILL.md
.cursor/
  rules/
    ponytail.mdc
.windsurf/
  rules/
    ponytail.md
.clinerules/
  ponytail.md
.github/
  copilot-instructions.md
```

## Task Breakdown
- [x] Task 1: Create skills directories and copy SKILL.md files.
- [x] Task 2: Update GEMINI.md global rules.
- [x] Task 3: Create IDE rule directories and copy files.
- [x] Task 4: Run verification checks and cleanup temp clone.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Schema: ✅ Pass
- Tests: ✅ Pass
- Date: 2026-06-18

