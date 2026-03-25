---
name: soc-crru-chiang-rai-crud
description: Chiang Rai Studies CRUD operating skill for admin and public consistency. Use for backend `backend/src/chiang-rai/`, admin routes, public detail/list consumers, media cleanup, tags, metadata, and sitemap-sensitive changes.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Chiang Rai CRUD

> Chiang Rai Studies work is multi-surface: backend API, admin CRUD, public list/detail pages, metadata, tags, stats, and media behavior must remain aligned.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the entity being changed.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `authoritative-paths.md` | Core backend/frontend areas and API namespace rules | Before editing Chiang Rai features |
| `entity-checklists.md` | Per-entity checks for articles, artifacts, activities, learning-sites, staff, settings | When editing a specific entity |
| `media-and-public-consumers.md` | Image cleanup, slug/detail, metadata, sitemap, and public consumer rules | When edits affect media or public output |

## ✅ Checklist

- [ ] Review matching frontend admin route and backend chiang-rai handler
- [ ] Verify `/api/chiang-rai/...` paths remain correct
- [ ] Verify admin CRUD plus public list/detail consumers
- [ ] Preserve relative media paths and cleanup behavior
- [ ] Check metadata, tags, sitemap, and JSON-LD if affected
