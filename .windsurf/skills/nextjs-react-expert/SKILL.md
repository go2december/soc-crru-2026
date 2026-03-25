---
name: nextjs-react-expert
description: Next.js 16 and React 19 implementation and performance guidance for SOC-CRRU. Use for App Router design, server/client boundaries, eliminating waterfalls, bundle reduction, and frontend performance reviews.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Next.js React Expert

> Use this skill for React and Next.js implementation decisions, especially when performance, App Router patterns, and server/client boundaries matter.

## 🎯 Selective Reading Rule

**Read ONLY the relevant guidance file for the current problem.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `app-router-and-fetching.md` | App Router patterns, SSR, server-friendly data fetching, waterfall avoidance | When building or reviewing route logic |
| `client-boundaries-and-rerenders.md` | Client components, re-render control, memoization, UI responsiveness | When editing interactive components |
| `bundle-and-performance.md` | Bundle size, dynamic imports, image/rendering performance | When optimizing frontend performance |

## ✅ Checklist

- [ ] Use App Router conventions correctly
- [ ] Prefer server-friendly data fetching where possible
- [ ] Avoid sequential waterfalls for independent requests
- [ ] Keep client boundaries minimal and intentional
- [ ] Review bundle size and rendering impact for large UI changes
