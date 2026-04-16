---
name: soc-crru-admin-dashboard
description: Admin dashboard implementation rules for SOC-CRRU. Use for Faculty admin and Chiang Rai admin pages built with shadcn/ui, Next.js App Router, and API-backed CRUD flows.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Admin Dashboard

> Admin routes in this project must use shadcn/ui components, preserve current auth flows, and keep CRUD screens aligned with backend DTOs and public consumers.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `route-scope-and-auth.md` | Admin route boundaries and auth flow constraints | When editing admin routes |
| `ui-and-component-rules.md` | shadcn/ui usage and styling constraints | When changing admin UI |
| `crud-surface-checks.md` | Required CRUD and multi-surface verification rules | When changing admin entities |

## ✅ Checklist

- [ ] Confirm the route is an admin route
- [ ] Use shadcn/ui components from `frontend/components/ui/`
- [ ] Preserve auth and callback flow
- [ ] Keep forms aligned with backend DTOs and enums
- [ ] Verify list/create/edit/delete and related public consumers
