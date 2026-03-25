---
name: api-patterns
description: API design and endpoint decision-making for SOC-CRRU. Use for REST resource naming, response shape, pagination, auth-sensitive endpoint planning, and API contract consistency.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns

> Use this skill when changing or designing API contracts, especially where frontend consumers and backend endpoints must remain aligned.

## 🎯 Selective Reading Rule

**Read ONLY the guidance file relevant to the current API problem.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `rest-and-resource-design.md` | Resource naming, HTTP methods, endpoint consistency | When editing routes/controllers |
| `response-and-pagination.md` | Response shape, error handling, pagination behavior | When changing API outputs |
| `auth-and-contract-consumers.md` | Auth-sensitive endpoints and frontend consumer alignment | When changing protected or shared contracts |

## ✅ Checklist

- [ ] Confirm affected API consumers
- [ ] Keep REST naming and method usage consistent
- [ ] Preserve or intentionally update response contracts
- [ ] Verify auth assumptions when relevant
- [ ] Update all affected frontend callers if a contract changes
