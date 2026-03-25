---
name: soc-crru-public-frontend
description: Public frontend implementation rules for SOC-CRRU. Use for Faculty public pages and Chiang Rai Studies public routes built with Next.js App Router, DaisyUI, and Tailwind CSS v4.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Public Frontend

> Public-facing pages in this project must use DaisyUI patterns, project design tokens, and server-friendly Next.js App Router conventions.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `routing-and-scope.md` | Public route boundaries and framework separation | When editing public pages |
| `design-and-theming.md` | DaisyUI, `socTheme`, branding, and style constraints | When editing UI/styling |
| `data-and-media.md` | SSR fetch, API prefixes, image URL resolution | When editing data-driven public pages |

## ✅ Checklist

- [ ] Confirm the route is public, not admin
- [ ] Use DaisyUI classes and project tokens, not shadcn/ui
- [ ] Keep fetch patterns compatible with SSR/server components when appropriate
- [ ] Preserve `/api` and image URL conventions
- [ ] Verify affected public list/detail pages stay consistent
