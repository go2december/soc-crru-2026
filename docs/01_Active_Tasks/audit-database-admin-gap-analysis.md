---
title: "Audit: Database & Admin Dashboard Content Gap Analysis"
type: "audit"
date: "2026-10-20"
status: "active"
tags: ["audit", "database", "admin-dashboard", "gap-analysis"]
---

# 🔍 รายงานการสำรวจช่องว่างระหว่างฐานข้อมูล, หน้าเว็บสาธารณะ และ Admin Dashboard

เอกสารนี้รวบรวมรายการข้อมูลที่ยังไม่สอดคล้องกันระหว่าง **ฐานข้อมูล (Database)**, **หน้าแรก/เกี่ยวกับ (Home & About)** และ **ระบบจัดการหลังบ้าน (Admin Dashboard)** เพื่อใช้เป็น Roadmap ในการพัฒนาต่อ

---

## 📌 1. ข้อมูลหน้าบ้านที่เป็น Hardcoded (ไม่มีระบบจัดการใน Admin)

> [!WARNING]
> ปัจจุบันข้อมูลส่วนนี้ถูกฝังตาย (Hardcoded) ในไฟล์โค้ดของ Next.js แอดมินทั่วไปไม่สามารถปรับปรุงเนื้อหาหรือตัวเลขสถิติผ่าน Admin Dashboard ได้

### 🏠 หน้าแรก (`/`)
- **Hero Announcement Badge**: ข้อความเปิดรับสมัครใน [[frontend/components/Hero.tsx|Hero.tsx]] ฝังตายเป็น *"เปิดรับสมัครนักศึกษาใหม่ TCAS 2569 รอบ Portfolio"* (ไม่ได้ดึงจากตาราง `admission_config` หรือ `admission_schedules`)
- **Hero Metrics Bar**: ตัวเลขสถิติ 4 ตัวใน Hero (*7 หลักสูตร, 94.8% ได้งานทำ, 40+ ความร่วมมือ, 100% ผู้ทรงคุณวุฒิ*)
- **Stats Dashboard**: สถิตินวัตกรรมและชุมชนใน [[frontend/components/StatsDashboard.tsx|StatsDashboard.tsx]] (*150+ ชุมชน, 85 นวัตกรรม, 42 MOU, 98% นายจ้างพึงพอใจ*) แม้จะมีตาราง `mous` และ `research_projects` อยู่ในระบบ แต่ไม่ได้ query แบบ Dynamic

### 📖 หมวดเกี่ยวกับสำนักวิชา (`/about`)
- **ข้อมูลประวัติและความเป็นมา**: ก่อตั้งปี 2546 และ 23+ ปี ใน [[frontend/app/about/page.tsx|about/page.tsx]]
- **ปรัชญา, วิสัยทัศน์, พันธกิจ 5 ด้าน และอัตลักษณ์-เอกลักษณ์**: เป็นข้อความ static ในโค้ด
- **โครงสร้างการบริหาร ([[frontend/app/about/structure/page.tsx|structure/page.tsx]])**: แผนผังผู้บริหาร, งาน 4 ฝ่ายของสำนักงานคณบดี, และสายการบังคับบัญชา
- **แผนยุทธศาสตร์ 5 ปี ([[frontend/app/about/strategy/page.tsx|strategy/page.tsx]])**: ประเด็นยุทธศาสตร์ที่ 1-4, วัตถุประสงค์ และ KPIs

> [!NOTE]
> ส่วนของ `/about` ที่เชื่อมต่อกับ DB และจัดการผ่าน Admin Dashboard ได้อย่างสมบูรณ์แล้ว คือ **ผู้บริหาร (Executive)** และ **บุคลากร (Staff)** ผ่านตาราง `staff_profiles`

---

## 🗄️ 2. ตารางในฐานข้อมูลที่ยังไม่มีระบบจัดการใน Admin Dashboard

> [!IMPORTANT]
> มีตารางที่ออกแบบ Schema ไว้แล้วใน `schema.ts` แต่ยังไม่มีหน้า UI ให้แอดมินเข้าไปจัดการข้อมูล

1. **กลุ่มตาราง "ศูนย์ล้านนาและเชียงรายศึกษา" (`chiang_rai_*` รวม 7 ตาราง):**
   - ตาราง: `chiang_rai_identities`, `chiang_rai_artifacts`, `chiang_rai_articles`, `chiang_rai_learning_sites`, `chiang_rai_staff`, `chiang_rai_activities`, `chiang_rai_config`
   - สถานะ: มี backend microservice และมีหน้าบ้าน `/chiang-rai-studies` แต่ **ยังไม่มีหน้าจัดการใน Admin Dashboard (`/admin/chiang-rai`)**
2. **ตาราง `banners` (ป้ายประชาสัมพันธ์):**
   - สถานะ: มีใน Schema (`imageUrl`, `linkUrl`, `order`) แต่ไม่มี Service/API, ไม่มีหน้า Admin และหน้าแรกเปลี่ยนเป็นสไตล์ Editorial Hero จึงไม่ได้ดึงข้อมูลมาแสดงผล
3. **ตาราง `audit_logs` & `role_permissions`:**
   - สถานะ: บันทึกข้อมูลใน DB แต่ยังไม่มีหน้า Admin UI สำหรับตรวจสอบบันทึกย้อนหลัง (Audit Log Viewer) และหน้า Matrix กำหนดสิทธิ์แบบ Dynamic

---

## 🎯 3. แนวทางปรับปรุงในระยะถัดไป (Next Actions)

- [ ] **Phase 1 (Site Settings):** สร้างตาราง `site_settings` หรือ `faculty_profile` และหน้า `/admin/site-settings` เพื่อจัดการข้อความ ปรัชญา/วิสัยทัศน์, ป้ายประกาศ Hero, และสถิติความสำเร็จ
- [ ] **Phase 2 (Chiang Rai Admin):** เพิ่มโมดูล `/admin/chiang-rai` ให้เจ้าหน้าที่ศูนย์เชียงรายศึกษาสามารถจัดการบทความ วัตถุทางวัฒนธรรม และกิจกรรมได้ผ่านหน้าเว็บ
- [ ] **Phase 3 (Clean up / Schema Audit):** พิจารณา Clean up ตาราง `banners` หากไม่ต้องการใช้สไลด์ภาพในหน้าแรกตามหลัก YAGNI (Ponytail)
