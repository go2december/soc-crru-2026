---
title: Plan - Student E-Services & Faculty Forms Enhancement
status: completed
created_at: 2026-10-14
completed_at: 2026-10-14
tags:
  - eservice
  - student
  - frontend
  - backend
  - database
  - plan
---

# แผนงานพัฒนาระบบบริการนักศึกษาและเอกสารคำร้อง (Student E-Services Hub)

> [!NOTE] วัตถุประสงค์ (Objectives)
> ปรับปรุงหน้าบริการนักศึกษา ([`/eservice/student`](file:///e:/web2026/soc-crru-web/frontend/app/eservice/student/page.tsx)) ให้เป็นศูนย์รวมบริการดิจิทัลที่ใช้งานได้จริง ครอบคลุมระบบส่วนกลางของมหาวิทยาลัยราชภัฏเชียงราย (Central CRRU) และคลังเอกสาร/แบบฟอร์มสำคัญของคณะสังคมศาสตร์ พร้อมระบบจัดการหลังบ้าน (PostgreSQL + Drizzle ORM + Admin Dashboard)

---

## 1. การออกแบบโครงสร้างฐานข้อมูล (Drizzle ORM Schema)

จัดเก็บใน `backend/libs/database/src/schema.ts` เพื่อรองรับการปรับแต่งลิงก์และเอกสารแบบไดนามิก:

### 1.1 ตาราง `student_services` (บริการสารสนเทศนักศึกษา)
- `id`: UUID (Primary Key)
- `title`: `varchar(255)` — ชื่อระบบบริการ (เช่น "ระบบทะเบียนและประมวลผล (REG CRRU)")
- `description`: `text` — คำอธิบายและฟังก์ชันการใช้งาน
- `category`: `student_service_category_enum` — หมวดหมู่:
  - `ACADEMIC`: ด้านการเรียน ทะเบียน และหลักสูตร
  - `WELFARE`: ด้านสวัสดิการ กยศ. กิจกรรม และหอพัก
  - `LIBRARY`: ด้านห้องสมุดและแหล่งเรียนรู้
  - `DIGITAL_IT`: ด้านบัญชีดิจิทัล อีเมล และ WiFi
  - `FACULTY`: บริการเฉพาะคณะสังคมศาสตร์
- `url`: `varchar(500)` — ลิงก์เข้าใช้งานระบบจริง (e.g. `https://reg.crru.ac.th`)
- `iconKey`: `varchar(50)` — ไอคอนประจำระบบ (e.g. `academic-cap`, `book-open`, `wifi`)
- `badgeText`: `varchar(50)` — ป้ายกำกับ (e.g. "ทางการ", "สำคัญ", "เข้าระบบด้วย @crru.ac.th")
- `isExternal`: `boolean` (default: true)
- `displayOrder`: `integer` (default: 0) — ลำดับการแสดงผล
- `isPublished`: `boolean` (default: true)
- `createdAt`, `updatedAt`: `timestamp`

### 1.2 ตาราง `student_documents` (แบบฟอร์มและเอกสารคำร้องคณะ)
- `id`: UUID (Primary Key)
- `title`: `varchar(255)` — ชื่อแบบฟอร์ม (เช่น "คำร้องขอเทียบโอนรายวิชา", "แบบฟอร์มขอฝึกงาน/สหกิจศึกษา")
- `category`: `varchar(100)` — กลุ่มคำร้อง (คำร้องทั่วไป, ฝึกงาน/สหกิจ, สำเร็จการศึกษา)
- `fileUrl`: `varchar(500)` — ลิงก์ไฟล์ PDF หรือ Word สำหรับดาวน์โหลด
- `fileType`: `varchar(20)` — `PDF` | `DOCX` | `EXTERNAL_FORM`
- `fileSize`: `integer` (bytes)
- `displayOrder`: `integer` (default: 0)
- `isPublished`: `boolean` (default: true)
- `createdAt`, `updatedAt`: `timestamp`

---

## 2. การออกแบบ Backend Architecture & API

ต่อขยายจาก `programs-service` หรือสร้างโมดูล `student-service` ภายใต้ Modular Monolith:

- **Public Endpoints (Frontend):**
  - `GET /api/v1/student-services`: ดึงรายการบริการทั้งหมดที่ `isPublished = true` เรียงตาม `displayOrder`
  - `GET /api/v1/student-documents`: ดึงรายการแบบฟอร์มเอกสารคำร้องของคณะที่เผยแพร่
- **Admin Endpoints (Guarded with JWT & Role Permissions):**
  - `POST /api/v1/admin/student-services`: เพิ่มลิงก์บริการใหม่
  - `PATCH /api/v1/admin/student-services/:id`: แก้ไขข้อมูล/เปิด-ปิดการแสดงผล
  - `DELETE /api/v1/admin/student-services/:id`: ลบลิงก์บริการ
  - `POST /api/v1/admin/student-documents`: อัปโหลด/เพิ่มแบบฟอร์มใหม่
  - `PATCH /api/v1/admin/student-documents/:id`: แก้ไขแบบฟอร์ม

---

## 3. การออกแบบส่วนติดต่อผู้ใช้ (Frontend Architecture)

ปรับปรุงหน้า [`/eservice/student/page.tsx`](file:///e:/web2026/soc-crru-web/frontend/app/eservice/student/page.tsx) ตาม **ตัวเลือก A**:

### 3.1 Hero & Quick Search Section
- **Scholar Deep Theme (`#0A2540` + Gold Accent):** สอดคล้องกับอัตลักษณ์เว็บคณะสังคมศาสตร์
- **Live Search Input:** ค้นหาบริการหรือแบบฟอร์มได้ทันทีแบบ Real-time
- **Category Filter Tabs:**
  - 🌟 ทั้งหมด (All)
  - 🎓 ทะเบียน & การเรียน (Academic)
  - 🤝 กิจกรรม & ทุน/กยศ. (Welfare & Activity)
  - 📚 ห้องสมุด & วิจัย (Library & Search)
  - 💻 ดิจิทัล & เครือข่าย (IT & Network)
  - 📄 เอกสาร & แบบฟอร์มคณะ (Forms & Faculty)

### 3.2 Service Grid Cards
- การ์ดสไตล์โมเดิร์น พร้อมระบุลิงก์ภายนอกชัดเจน (`target="_blank"` + `rel="noopener noreferrer"`)
- แสดง Badge กำกับช่องทางการล็อกอิน (เช่น "ใช้รหัสนักศึกษา", "ใช้เมล @crru.ac.th")
- Fallback ปลอดภัย: หาก Backend ออฟไลน์ ให้แสดงข้อมูล Seeded Default อัตโนมัติ

### 3.3 Faculty Forms & Internship Download Hub
- แท็บหรือเซกชันสำหรับดาวน์โหลดแบบฟอร์มคำร้องคณะสังคมศาสตร์โดยเฉพาะ
- แสดงไอคอนประเภทไฟล์ (`PDF` / `DOCX`), ขนาดไฟล์, และปุ่มดาวน์โหลดรวดเร็ว

---

## 4. แผนการจัดเตรียมข้อมูลเริ่มต้น (Initial Seeded Data)

### 4.1 บริการส่วนกลางมหาวิทยาลัยราชภัฏเชียงราย (Central CRRU)
1. **REG CRRU:** ลงทะเบียนเรียน ชำระเงิน ตรวจสอบเกรด (`https://reg.crru.ac.th`)
2. **ORASIS-SIS:** ระบบบริการข้อมูลนักศึกษา (`https://orasis.crru.ac.th/orasis_crru/sis2/login`)
3. **CRRU LMS:** ระบบการเรียนการสอนออนไลน์ (`https://lms.crru.ac.th`)
4. **DIGIT.CRRU:** ระบบกิจกรรมนักศึกษาและตรวจสอบชั่วโมงจิตอาสา
5. **กยศ. / กรอ. CRRU:** ติดตามสัญญากู้ยืมและระบบ DSL
6. **CRRU Library & OPAC:** สำนักวิทยบริการฯ สืบค้นหนังสือ ยืม-คืน
7. **CRRU Smart Room Booking:** จองห้องค้นคว้าและห้องเรียนรวม
8. **CRRU Student Mail:** Google Workspace & Microsoft 365 (`https://mail.crru.ac.th`)
9. **CRRU WiFi & VPN:** ระบบอินเทอร์เน็ตวิทยาเขตและเครือข่ายปลอดภัย
10. **หอพักนักศึกษา (ภิรมย์ราชภัฏ):** ระบบจองและตรวจสอบห้องพัก

### 4.2 เอกสารและแบบฟอร์มคณะสังคมศาสตร์
1. แบบฟอร์มคำร้องทั่วไป (คณะสังคมศาสตร์)
2. แบบฟอร์มคำร้องขอฝึกประสบการณ์วิชาชีพ / สหกิจศึกษา
3. แบบฟอร์มขอหนังสือส่งตัวและขอความอนุเคราะห์ฝึกงาน
4. แบบฟอร์มขอเพิ่ม-ถอนรายวิชาล่าช้า
5. แบบฟอร์มขอเทียบโอนผลการเรียน / คลังหน่วยกิต (Credit Bank)

---

## 5. ขั้นตอนการดำเนินงาน (Task Breakdown)

- [ ] **Phase 1: Database Migration**
  - เพิ่ม Table `student_services` และ `student_documents` ใน `schema.ts`
  - ทำ Migration / Push schema
- [ ] **Phase 2: Backend API & Service**
  - สร้าง Controller, Service, DTOs สำหรับ `student-services`
  - สร้าง Seed Data เริ่มต้นบรรจุบริการ CRRU และแบบฟอร์ม
- [ ] **Phase 3: Admin Management UI**
  - สร้างหน้า Dashboard สำหรับจัดการลิงก์บริการและอัปโหลดเอกสาร
- [ ] **Phase 4: Frontend Redesign (`/eservice/student`)**
  - ปรับโฉมหน้าใหม่ สไตล์ Option A พร้อม Search & Tabs Filter
  - เชื่อมต่อ API ดึงข้อมูลจริง และรองรับ Fallback Mode
- [ ] **Phase 5: Verification & Audit**
  - รันการตรวจสอบความถูกต้องของลิงก์ ความปลอดภัย (XSS, `noopener`, file download) และ Responsive Mobile Check
