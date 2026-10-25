---
title: "Plan: Centralized Site Settings & About/Home CMS Module"
type: "plan"
date: "2026-10-21"
status: "completed"
tags: ["plan", "cms", "site-settings", "admin", "about", "homepage", "completed"]
---

# 📋 แผนพัฒนาระบบจัดการข้อมูลหน้าแรกและข้อมูลคณะ (Centralized Site Settings & About CMS)

> [!NOTE]
> แผนงานนี้ดำเนินการเสร็จสมบูรณ์แล้ว เพื่อเปลี่ยนข้อมูลที่เป็น Hardcoded ในหน้าแรก (`/`) และหน้าเกี่ยวกับคณะ (`/about`, `/about/structure`, `/about/strategy`) ให้สามารถแก้ไขและควบคุมได้ผ่าน **Admin Dashboard (`/admin/site-settings`)** แบบ Tabbed UI พร้อมระบบ **Hybrid Metric Synchronization**

---

## 🎯 1. สถาปัตยกรรมและการออกแบบระบบ (Architecture Design)

### 🗄️ 1.1 โครงสร้างฐานข้อมูล (Database Schema: `site_settings`)
ออกแบบตารางแบบ **Singleton Record (`id: 1`)** ใน `backend/libs/database/src/schema.ts` เพื่อความเร็วในการ query (1 row lookup) และเก็บโครงสร้างซับซ้อนด้วย JSONB:

1. **หมวดหน้าแรก (Hero & Metrics):**
   - `announcementText` (varchar), `announcementLink` (varchar), `isAnnouncementActive` (boolean)
   - `heroHeadlineTh` (varchar), `heroSubtextTh` (text)
   - **Hybrid Counts (Auto vs Override):**
     - `manualProgramsCount` (int, null = auto count จากตาราง `programs`)
     - `employabilityRate` (varchar, e.g. "94.8%")
     - `manualMousCount` (int, null = auto count จากตาราง `mous`)
     - `lecturersRate` (varchar, e.g. "100%")
     - `communitiesCount` (varchar, e.g. "150+")
     - `manualInnovationsCount` (int, null = auto count จากตาราง `research_projects`)
     - `employerSatisfactionRate` (varchar, e.g. "98%")

2. **หมวดข้อมูลคณะและอัตลักษณ์ (About & Core Values):**
   - `historyFoundedYear` (varchar, "2546"), `historyContentTh` (text)
   - `philosophyTh` (text), `visionTh` (text)
   - `identityTh` (text), `uniquenessTh` (text)
   - `coreValues` (jsonb array: `{ title, desc, icon }`)
   - `missions` (jsonb array: `{ id, title, desc, icon }`)

3. **หมวดโครงสร้างและยุทธศาสตร์ (Structure & Strategy):**
   - `structureDeputies` (jsonb array: บทบาทหน้าที่รองคณบดี 3 ฝ่าย)
   - `structureOfficeUnits` (jsonb array: ฝ่ายงาน 4 ฝ่ายสำนักงานคณบดี)
   - `strategicPlans` (jsonb array: 4 ประเด็นยุทธศาสตร์, วัตถุประสงค์, KPIs)

---

## 🏗️ 2. ลำดับขั้นตอนการพัฒนา (Task Breakdown)

### Phase 1: Database & Seed
- [x] เพิ่มตาราง `siteSettings` ใน `backend/libs/database/src/schema.ts`
- [x] สร้าง Seed Script เริ่มต้น ดึงข้อมูล default จากโค้ดปัจจุบัน (2546, ปรัชญา, พันธกิจ, สถิติ) ให้แสดงผลต่อเนื่องโดยเว็บไม่สะดุด

### Phase 2: Backend API & Auto-Count Service
- [x] สร้าง `SiteSettingsModule`, `SiteSettingsController`, และ `SiteSettingsService` ใน `backend/apps/programs-service/src/site-settings/`
- [x] Route `GET /api/site-settings` (Public, พร้อมคำนวณ dynamic metrics จากตาราง `programs`, `mous`, `research_projects` ผสานกับค่า override)
- [x] Route `PATCH /api/site-settings` (Protected by JwtAuthGuard + RolesGuard `ADMIN`, `EDITOR`)

### Phase 3: Admin Dashboard UI (`/admin/site-settings`)
- [x] สร้างหน้า UI ที่ `frontend/app/admin/(dashboard)/site-settings/page.tsx`
- [x] ออกแบบเป็น **Tabbed Interface**:
  - 📑 **แท็บ 1: หน้าแรก & สถิติผลงาน (Hero & Metrics):** จัดการประกาศ, สถิติแบบ Hybrid (มี Switch ให้เลือกระหว่าง "ดึงอัตโนมัติจาก DB" หรือ "ระบุตัวเลขเอง")
  - 📑 **แท็บ 2: เกี่ยวกับคณะ & อัตลักษณ์ (About & Missions):** ประวัติ, ปรัชญา, วิสัยทัศน์, พันธกิจ 5 ด้าน (เพิ่ม/ลบ/จัดเรียงได้ พร้อม Dropdown เลือก Icon)
  - 📑 **แท็บ 3: โครงสร้าง & ยุทธศาสตร์ (Structure & Strategy):** บทบาทรองคณบดี, ฝ่ายงาน, ยุทธศาสตร์และตัวชี้วัด (เพิ่ม/ลบข้อได้ พร้อม Dropdown เลือก Icon)
- [x] เพิ่มเมนูใน Admin Sidebar (`frontend/app/admin/(dashboard)/layout.tsx`)
- [x] สร้าง Route `/api/revalidate` เพื่อรองรับ On-Demand Cache Purging

### Phase 4: Frontend Public Integration
- [x] ปรับปรุง [[frontend/components/Hero.tsx]] และ [[frontend/components/StatsDashboard.tsx]] ให้ดึงข้อมูลจาก `GET /api/site-settings`
- [x] ปรับปรุง [[frontend/app/about/page.tsx]] ให้แสดงผลประวัติ, ปรัชญา, พันธกิจ จาก API
- [x] ปรับปรุง [[frontend/app/about/structure/page.tsx]] และ [[frontend/app/about/strategy/page.tsx]] ให้แสดงผลตามข้อมูลในฐานข้อมูล

---

## 🔍 3. คำถามเชิงกรณีพิเศษ (Edge Cases & Validation Questions)

1. **กรณี Icon ของพันธกิจ/ยุทธศาสตร์:** ข้อมูลพันธกิจและยุทธศาสตร์มีไอคอนแสดงผล (เช่น `FlaskConical`, `Users`, `Landmark`) ในหน้า Admin ต้องการ:
   - A. ให้เลือกจาก Dropdown รายชื่อ Icon ยอดนิยม (Recommended)
   - B. ไม่ต้องเปลี่ยน Icon ให้ใช้ Icon มาตรฐานตามลำดับข้อ
2. **การแคชข้อมูล (Caching & Revalidation):** ข้อมูลหน้าแรกและ About เป็นหน้าสาธารณะที่มีผู้เข้าชมบ่อย:
   - A. ใช้ Next.js On-Demand Revalidation (อัปเดตหน้าบ้านทันทีเมื่อกดบันทึกใน Admin) (Recommended)
   - B. ใช้ Time-based Revalidation (เช่น แคช 60 วินาที)
