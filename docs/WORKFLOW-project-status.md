# 📋 Workflow & Plan - SOC-CRRU Web Application
**Updated:** April 3, 2026

---

## 🎯 ภาพรวมสถานะโครงการ (Project Status Overview)

| Component | Status | Progress | Notes |
|-----------|--------|----------|-------|
| **เว็บคณะสังคมศาสตร์ (Faculty)** | 🔄 IN PROGRESS | ~80% | Public pages และ admin หลักพร้อมแล้ว รวมถึง news public/admin flow ใหม่ เหลือ SEO, responsive, content work, และ research search/filter |
| **ศูนย์เชียงรายศึกษา (CR Studies)** | 🔄 IN PROGRESS | ~90% | CRUD, SEO core, detail pages, และ admin surfaces พร้อมแล้ว เหลือ content population, responsive, และ deployment validation |
| **Backend API** | 🔄 IN PROGRESS | ~85% | NestJS + Drizzle พร้อมใช้งาน แต่ยังมีงาน optimization และ release-readiness บางส่วน |
| **Database** | ✅ COMPLETE | 100% | PostgreSQL 18 + Drizzle ORM |
| **Infrastructure** | ✅ COMPLETE | 100% | Docker Compose, 4 services |

---

## 🗂️ โครงสร้างเอกสารและเวิร์กโฟลว์ (Documentation & Workflow Structure)

### Canonical written references (`docs/`)
- `PLAN-soc-crru-baseline.md` → project-wide baseline, scope, and constraints
- `PLAN-chiang-rai-studies.md` → Chiang Rai Studies implementation phases and remaining work
- `PLAN-workflow-standardization.md` → governance rules for workflow/plan maintenance
- `WORKFLOW-faculty-admin.md` → human-readable Faculty admin operating workflow
- `WORKFLOW-chiang-rai-admin.md` → human-readable Chiang Rai admin operating workflow
- `WORKFLOW-project-status.md` → latest consolidated status snapshot

### Executable workflows (`.windsurf/workflows/`)
- `chiang-rai-admin.md` → execution workflow for Chiang Rai admin feature work
- `content-population.md` → workflow for populating and validating real content
- `faculty-admin.md` → execution workflow for Faculty admin feature work
- `local-deployment.md` → workflow for local deployment, QA, and release preparation
- `release-checklist.md` → QA, SEO, responsive, and deployment readiness
- `project-status-review.md` → workflow for reviewing and synchronizing plans and workflows
- Before release or deployment: run `.windsurf/workflows/release-checklist.md`
- During project review: run `.windsurf/workflows/project-status-review.md`

### Local skill selection (`.windsurf/skills/`)
- Use project-local Windsurf skills to choose the primary work mode for public frontend, admin dashboard, backend/API, media cleanup, SEO, debugging, and docs sync tasks.
- See `README.md` for the team-facing local skill map.
- See `.windsurfrules` for the detailed primary/companion skill map and route-specific constraints.

---

## 🏗️ เทคโนโลยีหลัก (Technology Stack)
```
Frontend:
├── Next.js 16.1.1 (App Router, Server Components)
├── React 19.2.3
├── Tailwind CSS v4.0 + DaisyUI v5.5.14
├── Lucide React (Icons)
├── date-fns (Date formatting)
├── ReactQuill (Rich text editor)
└── TypeScript v5

Backend:
├── NestJS (Node.js v25)
├── Drizzle ORM
├── PostgreSQL 18
├── JWT + Google OAuth
├── Sharp (Image processing)
└── Multer (File upload)

Infrastructure:
├── Docker Compose (4 services)
├── soc_frontend  → Port 4000
├── soc_backend   → Port 4001
├── soc_postgres  → Port 5432
└── soc_pgadmin   → Port 5050
```

---

# 📘 ส่วนที่ 1: เว็บคณะสังคมศาสตร์ (Faculty Website)

## 📁 เส้นทางฝั่ง Public (Faculty Frontend Routes)
```
/                              → หน้าแรกคณะ
/news                          → ข่าวสารคณะ (list)
/news/[slug]                   → ข่าวสารคณะ (detail)
/about                         → เกี่ยวกับคณะ (overview)
/about/executive               → ผู้บริหาร
/about/staff                   → บุคลากร (list)
/about/staff/[id]              → บุคลากร (detail)
/about/strategy                → แผนยุทธศาสตร์ (list)
/about/strategy/[id]           → แผนยุทธศาสตร์ (detail)
/about/structure               → โครงสร้างองค์กร
/programs                      → หลักสูตรทั้งหมด
/programs/[code]               → หลักสูตร (detail by code)
/programs/social-sci           → สาขาสังคมศาสตร์
/programs/social-sci/sociology → สาขาสังคมวิทยา
/programs/social-sci/crm       → สาขา CRM
/programs/home-eco             → สาขาคหกรรมศาสตร์
/programs/home-eco/applied     → คหกรรมประยุกต์
/programs/home-eco/culinary    → อาหารและโภชนาการ
/academics/overview            → ภาพรวมวิชาการ
/academics/credit-bank         → คลังหน่วยกิต
/academics/short-courses       → หลักสูตรระยะสั้น
/admissions                    → รับสมัครนักศึกษา
/research/database             → ฐานข้อมูลงานวิจัย
/research/services             → บริการวิชาการ
/research/startups             → ส่งเสริมผู้ประกอบการ
/eservice/calendar             → ปฏิทินกิจกรรม
/eservice/staff                → ระบบบุคลากร
/eservice/student              → ระบบนักศึกษา
```

## 📁 เส้นทางฝั่ง Admin (Faculty Admin Routes)
```
/admin/login                   → เข้าสู่ระบบ
/admin/callback                → Auth callback
/admin/(dashboard)/dashboard   → แดชบอร์ด
/admin/(dashboard)/staff       → จัดการบุคลากร
/admin/(dashboard)/departments → จัดการภาควิชา
/admin/(dashboard)/positions   → จัดการตำแหน่ง
/admin/(dashboard)/users       → จัดการผู้ใช้
/admin/(dashboard)/news        → จัดการข่าวสาร
/admin/(dashboard)/news/create → สร้างข่าว
/admin/(dashboard)/news/edit/[id] → แก้ไขข่าว
```

## 🔧 จุดเชื่อมต่อ Backend (Faculty Backend API)
```
Auth:
  GET    /api/auth/google
  GET    /api/auth/google/callback
  GET    /api/auth/dev/login
  GET    /api/auth/profile

Staff:
  GET    /api/staff              → List all
  GET    /api/staff/:id          → Get by ID
  POST   /api/staff              → Create
  PUT    /api/staff/:id          → Update
  DELETE /api/staff/:id          → Delete
  + 5 more (positions, search, etc.)

Departments:
  GET    /api/departments        → List
  POST   /api/departments        → Create
  PUT    /api/departments/:id    → Update
  DELETE /api/departments/:id    → Delete

Programs:
  GET    /api/programs           → List
  GET    /api/programs/:code     → Get by code
  POST   /api/programs           → Create
  PUT    /api/programs/:id       → Update
  DELETE /api/programs/:id       → Delete

News:
  GET    /api/news               → Public list (published)
  GET    /api/news/slug/:slug    → Public detail by slug
  GET    /api/news/admin/all     → Admin list (includes drafts)
  GET    /api/news/:id           → Admin get by ID
  POST   /api/news               → Create
  PATCH  /api/news/:id           → Update
  DELETE /api/news/:id           → Delete

Upload:
  POST   /api/upload/chiang-rai  → Upload image (chiang-rai)
  POST   /api/upload/staff       → Upload image (staff)
  POST   /api/upload/news        → Upload image (faculty news)
  POST   /api/upload/news/attachment → Upload attachment (faculty news)
  DELETE /api/upload/chiang-rai  → Delete image
  DELETE /api/upload/news        → Delete image/attachment (faculty news)
```

## ✅ งานที่เสร็จแล้ว: Faculty (Completed)
- [x] หน้าแรกพร้อม hero, stats, news preview
- [x] ข่าวสารคณะ: public listing + detail page พร้อม metadata พื้นฐาน
- [x] เกี่ยวกับคณะ: ผู้บริหาร, บุคลากร, โครงสร้าง, แผนยุทธศาสตร์
- [x] หลักสูตรทั้งหมด (social-sci, home-eco, sub-programs)
- [x] วิชาการ: credit-bank, short-courses, overview
- [x] รับสมัคร, วิจัย, ระบบสารสนเทศ
- [x] Admin: Login/Auth, Dashboard, Staff CRUD, Departments, Positions, Users, News
- [x] Faculty News admin: create/edit/delete พร้อมหมวด `สมัครงาน`, รูปหลายภาพ, เอกสารแนบ, และ cleanup ไฟล์ตอนลบ/แทนที่
- [x] Navigation (Main navbar with dropdowns)

## 🔄 งานที่กำลังดำเนินการ: Faculty (In Progress)
- [ ] Research database search/filter
- [ ] E-service integrations (external links?)
- [ ] Staff detail pages - verify data population

## 📋 งานที่รอดำเนินการ: Faculty (Pending)
- [ ] SEO metadata for all public routes
- [ ] Responsive audit (mobile/tablet)
- [ ] Production deployment prep
- [ ] Content population (real data)

---

# 📗 ส่วนที่ 2: ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)

## 📁 เส้นทางฝั่ง Public (Chiang Rai Public Routes)
```
/chiang-rai-studies                           → หน้าแรก (Hero light blue-white, 5 identities, news teaser, stats)
/chiang-rai-studies/about/history             → ความเป็นมา
/chiang-rai-studies/about/objectives          → วัตถุประสงค์
/chiang-rai-studies/about/goals-mission       → เป้าหมาย/พันธกิจ
/chiang-rai-studies/about/structure           → โครงสร้างองค์กร
/chiang-rai-studies/archive                   → คลังข้อมูล 5 อัตลักษณ์ (list + filter)
/chiang-rai-studies/archive/[id]              → รายละเอียด artifact
/chiang-rai-studies/articles                  → บทความวิชาการ (list)
/chiang-rai-studies/articles/[slug]           → บทความ (detail)
/chiang-rai-studies/activities                → กิจกรรม/ข่าวสาร (list + pagination) ✅ UPDATED
/chiang-rai-studies/activities/[slug]         → กิจกรรม (detail - full editorial) ✅ UPDATED
/chiang-rai-studies/learning-sites            → แหล่งเรียนรู้ (list + tag filter) ✅ UPDATED
/chiang-rai-studies/learning-sites/[slug]     → แหล่งเรียนรู้ (detail - full editorial) ✅ UPDATED
/chiang-rai-studies/staff                     → ทำเนียบบุคลากร
/chiang-rai-studies/contact                   → ติดต่อเรา
```

## 📁 เส้นทางฝั่ง Admin (Chiang Rai Admin Routes)
```
/chiang-rai-studies/admin                     → Dashboard (stats + quick actions)
/chiang-rai-studies/admin/login               → Login (Google + Dev bypass)
/chiang-rai-studies/admin/callback            → Auth callback
/chiang-rai-studies/admin/artifacts           → จัดการคลังข้อมูล (CRUD)
/chiang-rai-studies/admin/artifacts/create    → สร้าง artifact
/chiang-rai-studies/admin/artifacts/edit/[id] → แก้ไข artifact
/chiang-rai-studies/admin/articles            → จัดการบทความ (CRUD)
/chiang-rai-studies/admin/articles/create     → สร้างบทความ
/chiang-rai-studies/admin/articles/edit/[id]  → แก้ไขบทความ
/chiang-rai-studies/admin/activities          → จัดการกิจกรรม (CRUD)
/chiang-rai-studies/admin/activities/create   → สร้างกิจกรรม
/chiang-rai-studies/admin/activities/edit/[id]→ แก้ไขกิจกรรม
/chiang-rai-studies/admin/learning-sites      → จัดการแหล่งเรียนรู้ (CRUD)
/chiang-rai-studies/admin/learning-sites/create    → สร้างแหล่งเรียนรู้
/chiang-rai-studies/admin/learning-sites/edit/[id] → แก้ไขแหล่งเรียนรู้
/chiang-rai-studies/admin/staff               → จัดการบุคลากร (import + delete)
/chiang-rai-studies/admin/settings            → ตั้งค่าหน้าแรก (hero image, title, subtitle)
```

## 🔧 จุดเชื่อมต่อ Backend (Chiang Rai Backend API)
```
Core:
  GET    /api/chiang-rai/identities           → 5 อัตลักษณ์
  GET    /api/chiang-rai/stats                → สถิติภาพรวม
  GET    /api/chiang-rai/search?q=            → ค้นหาข้ามตาราง
  GET    /api/chiang-rai/tags                 → รวม tags ทั้งหมด

Artifacts (คลังข้อมูล):
  GET    /api/chiang-rai/artifacts            → List (filter by category, search, pagination)
  GET    /api/chiang-rai/artifacts/:id        → Get by ID
  POST   /api/chiang-rai/artifacts            → Create
  PUT    /api/chiang-rai/artifacts/:id        → Update
  DELETE /api/chiang-rai/artifacts/:id        → Delete

Articles (บทความ):
  GET    /api/chiang-rai/articles             → List
  GET    /api/chiang-rai/articles/by-id/:id   → Get by ID
  GET    /api/chiang-rai/articles/:slug       → Get by slug
  POST   /api/chiang-rai/articles             → Create
  PUT    /api/chiang-rai/articles/:id         → Update
  DELETE /api/chiang-rai/articles/:id         → Delete

Activities (กิจกรรม):
  GET    /api/chiang-rai/activities           → List (filter by type, pagination)
  GET    /api/chiang-rai/activities/by-id/:id → Get by ID
  GET    /api/chiang-rai/activities/:slug     → Get by slug
  POST   /api/chiang-rai/activities           → Create
  PUT    /api/chiang-rai/activities/:id       → Update
  DELETE /api/chiang-rai/activities/:id       → Delete

Learning Sites (แหล่งเรียนรู้):
  GET    /api/chiang-rai/learning-sites       → List (search, pagination)
  GET    /api/chiang-rai/learning-sites/by-id/:id → Get by ID
  GET    /api/chiang-rai/learning-sites/:slug     → Get by slug
  POST   /api/chiang-rai/learning-sites       → Create
  PUT    /api/chiang-rai/learning-sites/:id   → Update
  DELETE /api/chiang-rai/learning-sites/:id   → Delete
  GET    /api/chiang-rai/learning-site-categories → Categories

Staff (บุคลากร):
  GET    /api/chiang-rai/staff                → List all
  GET    /api/chiang-rai/staff/:group         → By group (ADVISOR/EXECUTIVE/COMMITTEE)
  POST   /api/chiang-rai/staff                → Create
  PUT    /api/chiang-rai/staff/:id            → Update
  DELETE /api/chiang-rai/staff/:id            → Delete
  POST   /api/chiang-rai/staff/import         → Import from faculty
  GET    /api/chiang-rai/admin/faculty-staff   → Faculty staff list (for import)

Config:
  GET    /api/chiang-rai/config               → Get homepage config
  PUT    /api/chiang-rai/config               → Update homepage config
```

## 📊 ตารางฐานข้อมูล (Chiang Rai Database Tables)
```
chiang_rai_artifacts        → 5 อัตลักษณ์ archive items
chiang_rai_articles         → บทความวิชาการ
chiang_rai_activities       → กิจกรรม/ข่าวสาร (NEWS, EVENT, ANNOUNCEMENT)
chiang_rai_learning_sites   → แหล่งเรียนรู้ (blog-style)
chiang_rai_staff            → บุคลากรศูนย์ฯ
chiang_rai_config           → ตั้งค่าหน้าแรก
```

## ✅ งานที่เสร็จแล้ว: CR Studies (Completed)
- [x] Homepage: Hero (light blue-white gradient), 5 identities grid, featured section, news teaser, stats CTA
- [x] About pages: history, objectives, goals-mission, structure
- [x] Archive: list + filter by 5 categories + detail page
- [x] Articles: list + detail (slug-based)
- [x] Activities: list (pagination) + detail (full editorial layout with real data) ← Mar 19
- [x] Learning Sites: list (tag filter) + detail (full editorial layout) ← Mar 19
- [x] Staff: list by group, import from faculty
- [x] Contact page
- [x] Admin Dashboard: stats cards, quick actions
- [x] Admin CRUD: Artifacts, Articles, Activities, Learning Sites, Staff, Settings
- [x] Image upload/delete on server (thumbnails, media, content images)
- [x] Activities image cleanup on edit/delete aligned with learning-sites
- [x] Tags as clickable links with filter on list pages ← Mar 19
- [x] Fix content image URLs (relative paths, no absolute backend URLs)
- [x] Breadcrumb navigation on detail pages
- [x] SEO metadata (generateMetadata) on detail pages
- [x] SEO consistency pass for Chiang Rai homepage, list pages, and static public pages
- [x] Canonical metadata added for Chiang Rai detail pages
- [x] JSON-LD structured data on detail pages
- [x] Chiang Rai OG image fallback route (`/chiang-rai-studies/opengraph-image`)
- [x] Sitemap includes Chiang Rai public static routes and dynamic detail routes (activities, articles, learning-sites, archive)
- [x] Robots.txt points to environment-aware sitemap and host
- [x] Reading time calculation
- [x] YouTube/video embed support in media galleries
- [x] Dev login + Google OAuth

## 🔄 งานที่กำลังดำเนินการ: CR Studies (In Progress)
- [ ] Content population (real data for all sections)
- [ ] Articles detail page - verify editorial layout consistency
- [ ] Responsive polish for homepage and list pages

## 📋 งานที่รอดำเนินการ: CR Studies (Pending)
- [ ] Responsive audit (mobile/tablet)
- [ ] Structured data validation for non-detail public pages
- [ ] Social card validation on deployed domain
- [ ] Full-text search optimization (server-side)
- [ ] Production deployment prep

---

# 🔄 เวิร์กโฟลว์การพัฒนา (Development Workflow)

## 🧪 Local Development
```bash
git clone https://github.com/go2december/soc-crru-2026.git
cd soc-crru-2026
docker compose up -d              # Start all 4 services
docker compose up --build -d      # Rebuild after code changes
docker compose logs frontend -f   # Watch frontend logs
docker compose logs backend -f    # Watch backend logs
```

## 🌐 Access URLs
```
Frontend:         http://localhost:4000
Backend API:      http://localhost:4001
pgAdmin:          http://localhost:5050 (admin@soc.crru.ac.th / admin)
CR Admin Login:   http://localhost:4000/chiang-rai-studies/admin/login
Faculty Admin:    http://localhost:4000/admin/login
```

## 🗃️ Database Migrations
```bash
cd backend
npx drizzle-kit generate    # Generate migration SQL
npx drizzle-kit migrate     # Apply migration
```

## 🔐 Environment Variables
```
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:4001   # Client-side API calls
INTERNAL_API_URL=http://soc_backend:4001   # SSR server-side fetch (Docker network)
NEXT_PUBLIC_SITE_URL=https://soc.crru.ac.th # Canonical URL, metadataBase, sitemap, robots

# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 🖼️ Image URL Convention
- **Database stores:** Relative paths only (e.g., `/uploads/chiang-rai/image.webp`)
- **Backend serves:** Static files from `/uploads/` directory
- **Frontend SSR:** Uses `INTERNAL_API_URL` + relative path
- **Frontend client:** Uses `NEXT_PUBLIC_API_URL` + relative path or proxy via Next.js rewrites
- **Image components:** Always use `unoptimized` prop for uploaded images

---

# 🚀 งานลำดับถัดไป (Next Steps)

## 📝 Changelog

  ### April 3, 2026 (Afternoon) - Research Module Updates
  
  - **Scope**
    - Updated `/research` module with enhanced admin interface and public pages
    - Implemented cover image upload/replace/delete with backend cleanup
    - Added SDG descriptions popup (SDG 1-17) in both admin and public
    - Integrated staff member selection from existing staff data
    - Removed organization/position fields from member flow
    - Added Google Maps coordinate helper for project locations
    - Linked member names to staff detail pages in public view
  
  - **Updated/New Files**
    - `frontend/app/admin/(dashboard)/research/ResearchForm.tsx` - Enhanced form with upload, SDG popup, staff selection
    - `frontend/components/ResearchSdgBadges.tsx` - New public SDG component with popup
    - `frontend/app/research/database/[slug]/page.tsx` - Updated detail with member links and SDG popup
    - `frontend/lib/research.ts` - Added SDG descriptions and staff formatting helpers
    - `backend/src/upload/upload.service.ts` - Added research image save/delete
    - `backend/src/upload/upload.controller.ts` - Added research upload endpoints
    - `backend/src/research/research.service.ts` - Integrated cleanup and member changes
    - `backend/src/research/dto/create-research-project.dto.ts` - Removed unused fields
    - `backend/src/research/research.module.ts` - Added UploadModule import
    - `.windsurf/workflows/research.md` - Created research workflow documentation
  
  - **Impact**
    - Admin can now upload cover images instead of entering URLs
    - SDG descriptions visible via popup click in both admin and public
    - Staff members can be selected from existing faculty data
    - External members stored as plain text names only
    - Cover images auto-cleanup on replace/delete
    - Public detail pages link to staff profiles

  ### April 3, 2026

 - **Scope**
   - aligned active project governance from legacy Antigravity references to Windsurf-native rules, skills, task workflows, and plans
   - normalized the docs-governance skill and project review workflow to maintain only `.windsurf` workflow references
   - clarified README and workflow standardization guidance for Windsurf task routing and local skill usage

 - **Updated/New Files**
   - `.windsurfrules`
   - `README.md`
   - `docs/PLAN-workflow-standardization.md`
   - `.windsurf/skills/soc-crru-docs-governance/SKILL.md`
   - `.windsurf/skills/soc-crru-docs-governance/source-of-truth.md`
   - `.windsurf/skills/soc-crru-docs-governance/update-rules.md`
   - `.windsurf/workflows/project-status-review.md`
   - `docs/WORKFLOW-project-status.md`

 - **Impact**
   - active project instructions now describe Windsurf as the authoritative task and workflow environment
   - local skill, rule, workflow, and plan references are consistent across the current source-of-truth artifacts
   - future documentation sync work is less likely to reintroduce legacy workflow paths into active guidance

   ### March 23, 2026

- **Scope**
  - standardized Windsurf project rules and executable workflow structure
  - consolidated executable workflows into `.windsurf/workflows/`
  - aligned documentation and workflow references across `docs/` and `.windsurf/workflows/`
  - fully migrated Chiang Rai Studies Admin Dashboard to use `shadcn/ui` components
  - established `.windsurfrules` as the primary Windsurf project rule file
  - aligned `README.md` and plan/workflow references with the Windsurf structure

- **Updated/New Files**
  - `.windsurfrules` (Primary Windsurf rules)
  - `README.md`
  - `docs/WORKFLOW-project-status.md`
  - `docs/WORKFLOW-faculty-admin.md`
  - `docs/WORKFLOW-chiang-rai-admin.md`
  - `docs/PLAN-soc-crru-baseline.md`
  - `docs/PLAN-chiang-rai-studies.md`
  - `docs/PLAN-workflow-standardization.md`
  - `.windsurf/workflows/` (Consolidated executable workflows)

  - **Impact**
  - human-readable docs now follow a clearer naming pattern
  - cross-references between plans, workflow docs, and executable workflows are aligned
  - project status history is easier to maintain going forward

 ### March 24, 2026

 - **Scope**
   - reviewed project status artifacts against the current Windsurf structure
   - synced local skill-map references into team-facing docs
   - corrected outdated workflow references from `.agent/workflows/` to `.windsurf/workflows/`
   - normalized status labels in the consolidated project snapshot

 - **Updated/New Files**
   - `README.md`
   - `docs/WORKFLOW-project-status.md`
   - `docs/WORKFLOW-faculty-admin.md`
   - `docs/WORKFLOW-chiang-rai-admin.md`

 - **Impact**
   - team-facing documentation now points to the Windsurf-native workflow and skill structure
   - status snapshot uses the current taxonomy more consistently
   - human-readable workflow docs no longer reference the legacy `.agent` path

### February 13, 2026

- **Phase 5.5 Completion: Articles CRUD**
  - Added complete Articles CRUD to Chiang Rai Studies admin
  - Backend: `getArticleById`, `createArticle`, `updateArticle`, `deleteArticle` 
  - Frontend: admin list, create, edit pages with auto-slug and tags
  - Dashboard: Articles count integrated
  - Fixed `/api/` prefix on all admin client-side fetch calls
  - Fixed missing `Plus` import in artifacts create page

### High Priority
1. Content population - ใส่ข้อมูลจริงทุก section
2. Articles detail page - ตรวจสอบ layout consistency

### Medium Priority
3. SEO audit - OG tags, sitemap.xml, robots.txt
4. Responsive audit - Mobile/Tablet ทุกหน้า
5. Faculty content population + Faculty news production validation

### Low Priority
6. Full-text search optimization
7. Performance testing & optimization
8. Production deployment plan
9. Monitoring & analytics setup

---

 **Last Updated:** April 3, 2026
 **Next Review:** April 10, 2026
