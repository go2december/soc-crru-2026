---
name: soc-crru-backend-nest-drizzle
description: Backend implementation rules for SOC-CRRU using NestJS, TypeScript, Drizzle ORM, PostgreSQL, auth, DTO validation, and `/api`-prefixed REST endpoints.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Backend NestJS + Drizzle

> Backend work in this project must preserve NestJS module boundaries, DTO validation patterns, Drizzle-based data access, and the `/api` global prefix.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the module you are changing.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `module-and-controller-rules.md` | Module/controller/service responsibilities and API prefix rules | Before backend edits |
| `drizzle-and-data-access.md` | Drizzle ORM and PostgreSQL consistency rules | When changing schema or queries |
| `auth-and-validation.md` | Auth flow, DTOs, validation, and integration constraints | When changing protected or validated endpoints |

## ✅ Checklist

- [ ] Edit code under `backend/src/`
- [ ] Preserve controller/service/module responsibilities
- [ ] Keep routes aligned with the `/api` global prefix
- [ ] Respect existing DTO and validation patterns
- [ ] Verify likely frontend consumers when changing central API contracts
