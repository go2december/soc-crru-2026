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
    - [x] `archive/page.tsx`: Digital Archive with category filters, search, and server-side pagination.
    - [x] `archive/[id]/page.tsx`: Premium detailed view for artifacts.
    - [x] `ChiangRaiPagination.tsx`: Reusable pagination component (Chiang Rai theme, ellipsis, responsive).
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
    - [x] Implement full-text search (Server-side optimization).
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
- [x] **Archive Pagination** *(2026-02-19)*
    - [x] Backend: `getArtifacts` API supports `page` and `limit` query params.
    - [x] Backend: Returns `{ data, meta: { page, limit, total, totalPages } }` format.
    - [x] Frontend: `ChiangRaiPagination` reusable component (themed, ellipsis, prev/next).
    - [x] Frontend: Archive page integrates pagination, resets to page 1 on filter/search change.
    - [x] Scroll-to-top on page change for smooth UX.
- [x] **Content Population & Search Optimization** *(2026-02-19)*
    - [x] Populated 25 real Chiang Rai artifacts (5 per identity: HISTORY, ARCHAEOLOGY, CULTURE, ARTS, WISDOM).
    - [x] Content includes real historical data, descriptions, and Wikimedia Commons image URLs.
    - [x] Enhanced full-text search: ILIKE across `title`, `description`, `content`, and `author` fields.
    - [x] **Staff Management System Overhaul** *(2026-02-19)*
        - [x] **Database Schema**: Refactored to 3 Groups (`ADVISOR`, `EXECUTIVE`, `COMMITTEE`).
        - [x] **Admin Interface**: 
            - [x] Tabbed UI for managing each group separately.
            - [x] **Manual Entry**: For Advisors (Name/Position).
            - [x] **Faculty Import**: For Executives & Committee (select from Faculty DB, auto-fetch image/title).
            - [x] Inline editing for Sort Order and Positions.
        - [x] **Public Directory**: 
            - [x] Dynamic rendering of staff by hierarchy (Director > Deputy > Heads > Committee > Advisors).
            - [x] Premium Modern Lanna design with role-based styling.
            - [x] Fallback images for missing profiles.

    - [x] **System Reliability Fixes** *(2026-02-19)*
        - [x] Fixed Docker internal networking (Frontend -> Backend 500 error) via `INTERNAL_API_URL`.
        - [x] Implemented robust error handling in Public Staff Page to prevent crashes.
    - [x] **General Settings & Hero Management** *(2026-02-19)*
        - [x] **Admin Settings Page**: `/chiang-rai-studies/admin/settings` for managing global configurations.
        - [x] **Hero Image Upload**:
            - [x] Drag & drop interface with preview.
            - [x] Client-side validation (JPG/PNG/WebP, Max 5MB).
            - [x] Server-side processing (Resize to 1920px width, Convert to WebP, Quality 80).
            - [x] Direct URL input fallback.
        - [x] **Dynamic Hero Content**: Configurable Title and Subtitle.
        - [x] **UI/UX Enhancements**:
            - [x] Adjusted Hero background opacity (50%) and gradient (10% end opacity) for better visibility.
            - [x] Optimized content positioning (shifted up via `pb-16`).
            - [x] Added visual cues (loading states, success toasts) for upload actions.


## Phase 4: Quality, SEO & Performance
- [x] **SEO & Metadata Strategy** *(2026-02-19)*
    - [x] **Dynamic Metadata:** Implemented `generateMetadata` for:
        - `archive/[id]/page.tsx`: Uses Artifact title/description/thumbnail.
        - `articles/[slug]/page.tsx`: Uses Article title/abstract/thumbnail.
        - `activities/[slug]/page.tsx`: Uses Activity title/content snippet/thumbnail as OG Image.
    - [x] **Open Graph (OG) Tags:** Configured `openGraph` and `twitter` cards (summary_large_image) for all detail pages.
    - [ ] **JSON-LD Schema:** Add Structured Data (Article, Organization, BreadcrumbList) for rich results.
    - [x] **Sitemap.xml:** Created `sitemap.ts` to dynamically generate XML for all static and dynamic routes (activities/articles).

- [x] **Performance Optimization** *(2026-02-19)*
    - [x] **Image Optimization:**
        - [x] Configured `remotePatterns` in `next.config.ts` for Unsplash, Wikimedia, localhost, and internal docker services.
        - [x] Replaced `<img>` with `next/image` in Home, Activities, Articles, and Staff pages for automatic WebP/AVIF and lazy loading.
        - [x] Optimized Hero and Gallery images with `priority` and `sizes` props.
    - [ ] **Code Splitting & Bundle Analysis:** Check for large dependencies.
    - [x] **Caching Strategy:**
        - [x] Implemented `next: { revalidate: 60 }` for Home Page and Activities List to reduce DB load while keeping content fresh.
        - [x] Configured `force-dynamic` where real-time data is critical.

## Phase 5: Usage & Maintenance (Launch Prep)
- [ ] **User Manual / Handover**
    - [ ] Create simple guide for Admin staff (How to add Artifacts, manage Galleries).
- [ ] **Final Deployment Check**
    - [ ] E2E Testing of critical flows (Login -> Create -> Edit -> Delete).
    - [ ] Verify environment variables for Production (`NEXT_PUBLIC_API_URL`, `DATABASE_URL`).
    - [ ] Full Docker build test.
