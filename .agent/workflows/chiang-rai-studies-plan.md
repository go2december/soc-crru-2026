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
- [x] **Admin Authentication Fix** *(2026-02-18)*
    - [x] Add `POST /api/auth/dev/token` endpoint (returns JWT as JSON, no redirect chain).
    - [x] Chiang Rai login page uses `fetch` for Dev Login → saves token client-side → `router.push` directly.
    - [x] Layout skips auth for login + callback pages; passes `redirect` query param.
    - [x] Google OAuth stores `redirect_after_login` in localStorage for cross-callback redirect.
- [x] **Archive Media Galleries** *(2026-02-18)*
    - [x] Update sample artifacts with rich `mediaUrls` (images + YouTube videos).
    - [x] Archive list page: media count badge, preview strip, media type indicators (รูปภาพ/วิดีโอ).
    - [x] Archive detail page: Galleries section below article content with image grid, YouTube embeds, external links.
    - [x] Sidebar media summary card showing counts by type.
    - [x] Cinematic `ImageLightbox` client component:
        - Ambient blur background from current image.
        - Slide transitions (fade + translate) with directional animation.
        - Progress bar (orange gradient) showing position.
        - Monospaced counter (`01 / 03`) editorial style.
        - Filmstrip thumbnails with active ring glow, grayscale inactive, auto-scroll.
        - Swipe gesture support for touch devices.
        - Keyboard navigation (← → Escape).
        - Responsive: mobile/tablet/desktop breakpoints, safe-area support.
    - [x] Fix YouTube video embeds (replaced placeholder IDs with real video IDs).
- [ ] **Content Population**
    - [ ] Input initial sample data for 5 Identities.

## Phase 4: Quality & Deployment
- [ ] **SEO Optimization**
    - [ ] Add Metadata (Titles, Descriptions, OG Tags) to all routes.
- [ ] **Responsive Audit**
    - [ ] Audit Mobile/Tablet view usability and performance.
- [ ] **Deployment Preparation**
    - [ ] Production build verification and merge to main.
