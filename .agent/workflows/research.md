---
description: Research module workflow - admin CRUD, public pages, and media handling
---

# Research Module Workflow

## Overview
This workflow covers the research database module for faculty research project management.

## Backend API

### Research Projects
```
GET    /api/research/projects          → Public list (published projects)
GET    /api/research/projects/:slug    → Public detail by slug
GET    /api/research/admin/projects      → Admin list (all projects)
GET    /api/research/admin/projects/:id  → Admin detail by ID
POST   /api/research/admin/projects      → Create project
PUT    /api/research/admin/projects/:id  → Update project
DELETE /api/research/admin/projects/:id  → Delete project
```

### Upload
```
POST   /api/upload/research             → Upload research cover image
DELETE /api/upload/research             → Delete research cover image
```

## Features Completed

### Admin Form (ResearchForm.tsx)
- [x] Cover image upload with preview
- [x] Cover image replacement and deletion
- [x] SDG selection with popup descriptions (SDG 1-17)
- [x] Staff member selection from existing staff data
- [x] External member name as free-form text
- [x] Removed organization/position fields from member flow
- [x] Google Maps coordinate helper (paste link, extract lat/lng)
- [x] Project locations with lat/lng

### Public Pages
- [x] `/research/database` - List with search, filter, pagination
- [x] `/research/database/[slug]` - Detail with SDG popup info
- [x] Member names link to `/about/staff/[id]` for internal staff
- [x] Cover image display

### Backend
- [x] Research project CRUD with Drizzle ORM
- [x] Cover image upload endpoint
- [x] Cover image cleanup on replace/delete (backend-side)
- [x] Staff member integration (staffProfileId)
- [x] Removed organization/positionTitle from member DTO

## Data Models

### ResearchProject
- id, slug, titleTh, titleEn
- abstractTh, abstractEn
- year, budget, fundingSource
- status (ONGOING, COMPLETED, PUBLISHED, CANCELLED)
- isSocialService, isCommercial
- coverImageUrl
- keywords[]
- isPublished, publishedAt

### ProjectMember
- staffProfileId (optional, links to faculty staff)
- externalName (optional, free-form text)
- role (HEAD, CO_RESEARCHER, ADVISOR, ASSISTANT, EXTERNAL_EXPERT)
- sortOrder

### ProjectLocation
- subDistrict, district, province
- lat, lng

### ProjectOutput
- outputType, title, journalName
- publicationDate, volume, issue, pages
- citation, doiUrl, tciUrl, externalUrl, tier

### ProjectAttachment
- fileName, fileType, fileUrl

## SDG Descriptions (RESEARCH_SDG_DESCRIPTIONS)
- SDG 1-17 with Thai title and description
- Popup display on click in both admin and public

## Image Handling
- Upload: Sharp processing, WebP conversion, 1600px max width
- Storage: `/uploads/research/[uuid].webp`
- Cleanup: Backend deletes old image on replace/delete
- Frontend preview before save

## Related Workflows
- `/faculty-admin.md` - Faculty admin dashboard operations
- `/content-population.md` - Populating research data
- `/release-checklist.md` - QA before deployment