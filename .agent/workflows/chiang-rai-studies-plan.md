---
description: Workflow for developing the Chiang Rai Studies Center Microservice
---

# Chiang Rai Studies Center Development Workflow

This workflow guides the development of the Chiang Rai Studies Center website as a microservice/module within the project.

## Phase 1: Foundation & Database
- [x] **Define Data Models (NestJS + Drizzle)**
    - [x] Create `chiang_rai_identities` table.
    - [x] Create `chiang_rai_artifacts` table.
    - [x] Create `chiang_rai_articles` table.
    - [x] Create `chiang_rai_staff` table.
    - [x] Create `chiang_rai_activities` table + `cr_activity_type` enum (NEWS, EVENT, ANNOUNCEMENT).
- [x] **Verify Database Schema**
    - [x] Run migrations and verify tables.

## Phase 2: Frontend Implementation & Branding
- [x] **Brand Identity Setup (Chiang Rai Brand)**
    - [x] Define Colors: Lotus Purple (#702963), Puang Said Orange (#F97316).
    - [x] Setup global CSS variables and animations.
- [x] **Develop UI Components**
    - [x] Design and implement ChiangRaiNavbar & ChiangRaiFooter.
    - [x] Apply premium Modern Lanna styling across all components.
- [x] **Implement Core Pages**
    - [x] `page.tsx`: Redesigned Home with Bold Hero and Identity Grid.
    - [x] `archive/page.tsx`: Digital Archive with category filters and search.
    - [x] `archive/[id]/page.tsx`: Premium detailed view for artifacts.
    - [x] `staff/page.tsx`: Organized staff directory with role-based grouping.
    - [x] `articles/page.tsx`: Academic articles listing (Connected to API).

## Phase 3: Integration & Content
- [x] **Admin Dashboard Development**
    - [x] Setup Admin Layout (`/chiang-rai-studies/admin`).
    - [x] Implement Staff Management with Faculty Import.
    - [x] Create CRUD interfaces for Artifacts & Articles (List/Create/Edit/Delete).
    - [x] Create CRUD interface for Activities (List/Create/Edit/Delete) — 3 types, event fields, featured, tags.
    - [x] Dashboard stats: Artifacts, Staff, Articles, Activities counts + Quick Actions.
- [x] **Image Management System** *(Enhanced 2026-02-13)*
    - [x] Client-side image resize (max 1024px, WebP) before upload.
    - [x] Server-side resize via Sharp (1024px, WebP quality 80).
    - [x] Image cleanup on content edit (orphan detection via Quill HTML diff).
    - [x] Server-side image delete endpoint: `DELETE /api/upload/chiang-rai`.
    - [x] Shared across Artifacts, Articles, and Activities modules.
- [x] **Connect Public Frontend to Backend**
    - [x] Fetch Artifacts (Archive & Detail) from Backend API.
    - [x] Fetch Staff (Directory) from Backend API.
    - [x] **Implement API calls for Articles page.**
    - [ ] Implement full-text search (Server-side optimization).
- [ ] **Content Population**
    - [ ] Input initial sample data for 5 Identities.

## Phase 4: Quality & Deployment
- [ ] **SEO Optimization**
    - [ ] Add Metadata (Titles, Descriptions, OG Tags) to all routes.
- [ ] **Responsive Audit**
    - [ ] Audit Mobile/Tablet view usability and performance.
- [ ] **Deployment Preparation**
    - [ ] Production build verification and merge to main.
