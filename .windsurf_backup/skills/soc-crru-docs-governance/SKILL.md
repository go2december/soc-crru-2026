---
name: soc-crru-docs-governance
description: Documentation and workflow synchronization rules for SOC-CRRU. Use when feature status, workflow behavior, or project operating procedures change.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Docs Governance

> Medium and large tasks in this project often require synchronized updates across status, plans, workflows, and rules.

## 🎯 Selective Reading Rule

**Read ONLY the docs relevant to the changed scope.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `source-of-truth.md` | Canonical read order and artifact hierarchy | Before syncing docs |
| `update-rules.md` | When to update status, plans, and rules | After medium/large tasks |
| `status-taxonomy.md` | Standard labels and checklist formatting | When editing docs |

## ✅ Checklist

- [ ] Review source-of-truth docs in the correct order
- [ ] Update project status if feature status changed
- [ ] Update matching plan/docs if behavior changed
- [ ] Keep `.windsurf/workflows/` aligned when execution steps changed
- [ ] Use standard status labels and checklist formats only
