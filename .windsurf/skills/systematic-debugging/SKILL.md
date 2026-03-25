---
name: systematic-debugging
description: Evidence-based debugging workflow for SOC-CRRU. Use when debugging bugs in admin CRUD, auth flows, API mismatches, SSR/client issues, media handling, or inconsistent frontend/backend behavior.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Systematic Debugging

> Use this skill to debug by reproducing, isolating, understanding, and verifying instead of making random changes.

## 🎯 Selective Reading Rule

**Read ONLY the guidance relevant to the current debugging phase.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `reproduce-and-isolate.md` | Reproduction and isolation checklist | At the start of debugging |
| `root-cause-analysis.md` | Root cause reasoning and evidence gathering | After narrowing the issue |
| `fix-and-verify.md` | Verification and regression-prevention checklist | After implementing a fix |

## ✅ Checklist

- [ ] Reproduce the issue clearly
- [ ] Isolate the smallest useful surface or trigger
- [ ] Identify the root cause, not only the symptom
- [ ] Verify the fix and related behavior
- [ ] State any remaining risks if not fully verified
