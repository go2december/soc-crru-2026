---
name: lint-and-validate
description: Quality-control and verification skill for SOC-CRRU. Use after code changes to run lint, type, and targeted verification before reporting work as complete.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Lint and Validate

> Use this skill before claiming implementation is finished.

## 🎯 Selective Reading Rule

**Read ONLY the validation guidance relevant to the changed area.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `frontend-validation.md` | Frontend lint/type checks and UI-surface validation | After frontend changes |
| `backend-validation.md` | Backend lint/test checks and API-surface validation | After backend changes |
| `completion-standard.md` | Completion rules and evidence expectations | Before final summary |

## ✅ Checklist

- [ ] Run relevant frontend lint/type verification
- [ ] Run relevant backend lint/test verification
- [ ] Check affected UI/API surfaces, not just static analysis
- [ ] Avoid claiming success without evidence
