# Project Baseline: SOC-CRRU Web Application
**Updated:** March 24, 2026

## ภาพรวมโครงการ (Project Overview)
เว็บไซต์คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย — แพลตฟอร์มสำหรับนักศึกษา บุคลากร และประชาชนทั่วไป

## โครงสร้างแผนและเวิร์กโฟลว์ (Planning & Workflow Structure)
- **Canonical status snapshot**: `docs/WORKFLOW-project-status.md`
- **Project baseline plan**: `docs/PLAN-soc-crru-baseline.md`
- **Domain plan (Chiang Rai Studies)**: `docs/PLAN-chiang-rai-studies.md`
- **Workflow governance**: `docs/PLAN-workflow-standardization.md`
- **Human-readable admin workflow**: `docs/WORKFLOW-chiang-rai-admin.md`
- **Executable workflows**: `.windsurf/workflows/*.md`

## อัตลักษณ์โครงการ (Project Identity)
- **Name**: SOC-CRRU Web Application
- **Purpose**: Academic platform for students/staff (Siam Innovator & Lifelong Learning)
- **Status**: In Development
  - **Faculty Frontend**: ~70% (Public pages done, some features incomplete)
  - **Chiang Rai Studies**: ~90% (CRUD complete, UI refined)
  - **Backend API**: ~85% (71+ endpoints operational)

## เทคโนโลยีหลัก (Technology Stack)
### Frontend
- **Framework**: Next.js 16.1.1 (App Router, Server Components)
- **Library**: React 19.2.3
- **Styling**: Tailwind CSS v4.0 + DaisyUI v5.5.14
- **Language**: TypeScript v5
- **Dependencies**: Lucide React, date-fns, ReactQuill, Radix UI, shadcn/ui

### Backend
- **Framework**: NestJS (Node.js v25)
- **ORM**: Drizzle ORM
- **API**: REST (71+ endpoints)
- **File Processing**: Sharp (image resize/WebP), Multer (upload)
- **Auth**: JWT + Google OAuth

### Database
- **Engine**: PostgreSQL 18 (Alpine)
- **ORM**: Drizzle ORM (type-safe, migrations)
- **Management**: pgAdmin 4 (Web Interface)
- **Tables**: 10+ (users, staff, departments, programs, news, chiang_rai_*)

### Infrastructure (DevOps)
- **Tools**: Docker Compose
- **Network**: `soc-network` (bridge)
- **Services**:
  1. `soc_postgres`: Postgres 18 [Port: 5432]
  2. `soc_pgadmin`: Admin Tool [Port: 5050]
  3. `soc_backend`: NestJS API [Port: 4001 → internal 3000]
  4. `soc_frontend`: Next.js [Port: 4000 → internal 3000]
- **Volumes**: `./database/pgdata`, `./backend/uploads` (persistent)

## เส้นทางหน้าเว็บคณะ (Faculty Website Routes)
```
Public (26 pages):
├── /                          → หน้าแรกคณะ
├── /about/*                   → เกี่ยวกับคณะ (7 pages)
├── /programs/*                → หลักสูตร (8 pages)
├── /academics/*               → วิชาการ (3 pages)
├── /admissions                → รับสมัคร
├── /research/*                → วิจัย (3 pages)
└── /eservice/*                → ระบบสารสนเทศ (3 pages)

Admin (9 pages):
├── /admin/login               → เข้าสู่ระบบ
├── /admin/callback            → Auth callback
├── /admin/(dashboard)/*       → Dashboard, Staff, Departments, Positions, Users, News
```

## โมดูลฝั่ง Backend (Backend Modules)
```
auth.module       → JWT + Google OAuth (6 endpoints)
staff.module      → บุคลากร (10 endpoints)
departments.module → ภาควิชา (4 endpoints)
programs.module   → หลักสูตร (5 endpoints)
news.module       → ข่าวสาร (5 endpoints)
upload.module     → Image upload/delete (3 endpoints)
chiang-rai.module → ศูนย์เชียงรายศึกษา (37 endpoints)
```

## งานที่เสร็จแล้ว (Completed)
- [x] Full faculty public website (26 pages)
- [x] Admin dashboard with CRUD for staff, departments, positions, users, news
- [x] Faculty news public listing/detail + homepage news integration
- [x] Faculty news admin edit flow with multi-image uploads, downloadable attachments, `JOB` category, and cleanup on delete/replace
- [x] Chiang Rai Studies module (complete - see PLAN-chiang-rai-studies.md)
  - [x] Phase 5.5 Articles CRUD completed (2026-02-13)
  - [x] All admin CRUD operations (Artifacts, Articles, Activities, Learning Sites, Staff, Settings)
  - [x] Full public pages with detail-page SEO metadata and core public route coverage
- [x] Docker Compose infrastructure
- [x] Auth system (JWT + Google OAuth + Dev bypass)
- [x] Image upload/processing pipeline
- [x] Documentation and workflow standardization (2026-03-23)
- [x] Team-facing skill map references aligned across `.windsurfrules`, `README.md`, and `docs/WORKFLOW-project-status.md` (2026-03-24)

## งานที่กำลังดำเนินการ (In Progress)
- [ ] Research database search/filter
- [ ] Staff detail pages - verify data population

## งานที่รอดำเนินการ (Pending)
- [ ] SEO metadata for all faculty routes
- [ ] Responsive audit (mobile/tablet)
- [ ] Content population (real data)
- [ ] Production deployment prep
- [ ] Monitoring & analytics

## เวิร์กโฟลว์การพัฒนา (Development Workflow)
```bash
git clone https://github.com/go2december/soc-crru-2026.git
cd soc-crru-2026
docker compose up -d              # Start
docker compose up --build -d      # Rebuild after changes
docker compose logs frontend -f   # Watch logs
```

### Access URLs
- Frontend: http://localhost:4000
- Backend API: http://localhost:4001
- pgAdmin: http://localhost:5050 (admin@soc.crru.ac.th / admin)
- CR Admin: http://localhost:4000/chiang-rai-studies/admin/login
- Faculty Admin: http://localhost:4000/admin/login

## ข้อจำกัดสำคัญ (Known Constraints)
- **Node Version**: Requires Node 25+ (bleeding edge)
- **Frameworks**: Latest versions (Next 16, Postgres 18) — fewer community docs
- **Ports**: 4000/4001 custom mapping must be respected
- **Images**: Must store relative paths only in DB, frontend resolves to full URL at render time

## ไฟล์ที่เกี่ยวข้อง (Related Workflow Files)
- `docs/WORKFLOW-project-status.md` → consolidated project status snapshot
- `docs/PLAN-workflow-standardization.md` → workflow governance and maintenance rules
- `.windsurf/workflows/faculty-admin.md` → executable workflow for Faculty admin work
- `.windsurf/workflows/local-deployment.md` → executable workflow for local deployment and release readiness
