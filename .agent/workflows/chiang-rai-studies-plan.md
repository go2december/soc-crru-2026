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
    - [ ] `articles/page.tsx`: Academic articles listing (Pending API).

## Phase 3: Integration & Content
- [x] **Admin Dashboard Development**
    - [x] Setup Admin Layout (`/chiang-rai-studies/admin`).
    - [x] Implement Staff Management with Faculty Import.
    - [x] Create CRUD interfaces for Artifacts & Articles.
- [x] **Connect Public Frontend to Backend**
    - [x] Fetch Artifacts (Archive & Detail) from Backend API.
    - [x] Fetch Staff (Directory) from Backend API.
    - [ ] **Implement API calls for Articles page.**
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
