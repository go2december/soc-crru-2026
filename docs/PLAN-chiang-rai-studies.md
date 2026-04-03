# Chiang Rai Studies Center Web Development Plan
**Updated:** April 3, 2026

ศูนย์เชียงรายศึกษา — แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย

---

## สถาปัตยกรรมระบบ (System Architecture)

- **Database:** PostgreSQL 18, dedicated tables prefixed `chiang_rai_*`
- **Backend:** NestJS module (`chiang-rai.module`) with 37 REST endpoints
- **Frontend:** Next.js App Router under `/chiang-rai-studies` route
- **Design Theme:** "Modern Lanna" — purple/orange/white with light blue-white hero

---

## แผนผังเว็บไซต์และสถาปัตยกรรมข้อมูล (Sitemap & Information Architecture)

| Route | Status | Description |
|-------|--------|-------------|
| `/chiang-rai-studies` | ✅ COMPLETE | หน้าแรก (Hero light blue-white, 5 identities, news, stats) |
| `/about/history` | ✅ COMPLETE | ความเป็นมา |
| `/about/objectives` | ✅ COMPLETE | วัตถุประสงค์ |
| `/about/goals-mission` | ✅ COMPLETE | เป้าหมาย/พันธกิจ |
| `/about/structure` | ✅ COMPLETE | โครงสร้างองค์กร |
| `/archive` | ✅ COMPLETE | คลังข้อมูล 5 อัตลักษณ์ (list + filter) |
| `/archive/[id]` | ✅ COMPLETE | รายละเอียด artifact |
| `/articles` | ✅ COMPLETE | บทความวิชาการ (list) |
| `/articles/[slug]` | ✅ COMPLETE | บทความ (detail) |
| `/activities` | ✅ COMPLETE | กิจกรรม/ข่าวสาร (list + pagination) |
| `/activities/[slug]` | ✅ COMPLETE | กิจกรรม (detail - full editorial) ← Mar 19 |
| `/learning-sites` | ✅ COMPLETE | แหล่งเรียนรู้ (list + tag filter) |
| `/learning-sites/[slug]` | ✅ COMPLETE | แหล่งเรียนรู้ (detail - full editorial) ← Mar 19 |
| `/staff` | ✅ COMPLETE | ทำเนียบบุคลากร |
| `/contact` | ✅ COMPLETE | ติดต่อเรา |
| `/admin` | ✅ COMPLETE | Admin Dashboard + CRUD (17 pages) |

---

## อัตลักษณ์แบรนด์และระบบออกแบบ (Brand Identity & Design System)

### Corporate Identity (CI)
- **Primary:** Chiang Rai Purple `#2e1065` / `#702963` — ม่วงบัวสาย (วันเกิดพ่อขุนเม็งราย)
- **Accent:** Puang Said Orange `#F97316` — ส้มพวงแสด (ดอกไม้ประจำจังหวัด)
- **Base:** Mist White `#F8FAFC` — ช้างเผือกใต้เมฆ
- **Homepage Hero:** Light Blue-White gradient (sky-50 → white → blue-50) ← Updated Mar 19
- **Detail Pages:** Purple hero overlay with breadcrumb, full-width content

### Symbols & Motifs
- Provincial Seal: White Elephant under clouds
- Flora: Kasalong Kham & Puang Said (Orange Trumpet)
- Pattern: Chiang Saen Hong Dam (Black Swan on Purple)

---

## เฟสการพัฒนา (Development Phases)

### Phase 1: Database & Content Modeling ✅ COMPLETE
- [x] PostgreSQL tables: artifacts, articles, activities, learning_sites, staff, config
- [x] Drizzle ORM schema with indexes
- [x] Enums: activity type (NEWS/EVENT/ANNOUNCEMENT), identity categories

### Phase 2: Backend Development ✅ COMPLETE
- [x] 37 API endpoints via `chiang-rai.controller.ts`
- [x] CRUD for all entities
- [x] Search, filter, pagination
- [x] Image upload (Sharp + WebP) and delete endpoints
- [x] Staff import from faculty
- [x] Homepage config management

### Phase 3: Frontend Development ✅ COMPLETE
- [x] Homepage with hero, 5 identities, featured sections, stats
- [x] About pages (history, objectives, goals-mission, structure)
- [x] Archive: list with category filter + detail page
- [x] Articles: list + detail (slug-based)
- [x] Activities: list (pagination) + detail (full editorial with real data)
- [x] Learning Sites: list (tag filter) + detail (full editorial, media gallery)
- [x] Staff page + Contact page
- [x] Admin Dashboard (17 pages): CRUD for all entities + settings
- [x] Refactored complete admin dashboard to use shadcn/ui components (Card, Button, Input, Dialog)
- [x] Image management workflow (upload/delete on edit/delete)
- [x] Activities image cleanup workflow aligned with Learning Sites on edit/delete
- [x] Tags as clickable links with filter
- [x] SEO metadata (generateMetadata) + JSON-LD on detail pages
- [x] Breadcrumb navigation
- [x] Reading time calculation
- [x] YouTube/video embed in media galleries
- [x] Chiang Rai OG image fallback for social sharing
- [x] Chiang Rai sitemap + robots coverage for public routes

### Phase 5.5: Articles CRUD ✅ COMPLETE (February 13, 2026)
- [x] Articles CRUD backend endpoints (`getArticleById`, `createArticle`, `updateArticle`, `deleteArticle`)
- [x] Articles admin pages: list, create, edit with auto-slug and tags
- [x] Dashboard integration with articles count
- [x] API prefix fixes for all admin client-side fetch calls
- [x] Missing import fixes (Plus icon in artifacts create)

### Phase 4: Content & Polish 🔄 IN PROGRESS
- [ ] Content population — ข้อมูลจริงทุก section
- [ ] Articles detail page — verify editorial layout consistency
- [x] SEO consistency review for list/home pages
- [ ] Responsive polish across homepage and list pages

### Phase 5: QA & Deployment 📋 PENDING
- [x] SEO audit (sitemap.xml, robots.txt, OG tags ทุกหน้า) — quick wins completed for Chiang Rai public routes
- [ ] Responsive audit (mobile/tablet ทุกหน้า)
- [ ] Structured data validation for list/static pages
- [ ] Social card validation on production domain
- [ ] Full-text search optimization (server-side)
- [ ] Production deployment prep
- [ ] User acceptance testing
- [ ] Monitoring & analytics setup

---

## 🗃️ ตารางฐานข้อมูล (Database Tables)

```
chiang_rai_artifacts        — id, title, category (5 identities), description, content, mediaUrls, tags
chiang_rai_articles         — id, title, slug, content, tags, author, isPublished, publishedAt
chiang_rai_activities       — id, title, slug, type (NEWS/EVENT/ANNOUNCEMENT), content, location, eventDate, eventEndDate, mediaUrls, tags
chiang_rai_learning_sites   — id, title, slug, content, thumbnailUrl, mediaType, mediaUrls, tags, author
chiang_rai_staff            — id, staffProfileId, role, group (ADVISOR/EXECUTIVE/COMMITTEE)
chiang_rai_config           — id, heroBgUrl, heroTitle, heroSubtitle, digitalArchiveBgUrl
```

---

## 🔌 จุดเชื่อมต่อ API (API Endpoints)

See `WORKFLOW-chiang-rai-admin.md` for complete endpoint list.

Key modules: Artifacts (5), Articles (6), Activities (6), Learning Sites (7), Staff (7), Config (2), Core (4)

---

## 🔗 ไฟล์ที่เกี่ยวข้อง (Related Workflow Files)

- `docs/WORKFLOW-project-status.md` → consolidated project status snapshot
- `docs/WORKFLOW-chiang-rai-admin.md` → human-readable Chiang Rai admin workflow
- `docs/PLAN-workflow-standardization.md` → workflow governance and maintenance rules
- `.windsurf/workflows/chiang-rai-admin.md` → executable Chiang Rai admin workflow
- `.windsurf/workflows/content-population.md` → executable workflow for content completion
- `.windsurf/workflows/local-deployment.md` → executable workflow for local deployment and release preparation
