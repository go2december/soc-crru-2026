---
title: Plan - Staff Directory (/about/staff) Performance, SEO & UX Enhancement
status: completed
created_at: 2026-10-14
completed_at: 2026-10-14
tags:
  - staff
  - about
  - frontend
  - webometrics
  - seo
  - ui-ux
  - plan
---

# แผนยกระดับทำเนียบบุคลากร (/about/staff)

> [!NOTE] วัตถุประสงค์ (Objectives)
> ปรับปรุงระบบทำเนียบบุคลากรคณะสังคมศาสตร์ ([`/about/staff`](file:///e:/web2026/soc-crru-web/frontend/app/about/staff/page.tsx)) และหน้ารายละเอียดอาจารย์ ([`/about/staff/[id]`](file:///e:/web2026/soc-crru-web/frontend/app/about/staff/[id]/page.tsx)) ให้รองรับเกณฑ์ Webometrics / SEO ระดับสูงสุดด้วย Server Component Hydration, แก้ไข Duplicate JSON-LD, ผสาน `getAssetUrl` และยกระดับ UI/UX ด้วย Skeleton Loading, Badge Counts และแบนเนอร์เชื่อมโยงทำเนียบผู้บริหาร

---

## 1. การปรับปรุงสถาปัตยกรรมและการดึงข้อมูล (Architecture & Webometrics Hydration)

### 1.1 ปรับ `app/about/staff/page.tsx` เป็น Server Component
- **ปัญหาเดิม:** ใช้ `'use client'` และ `useEffect` ดึงข้อมูลผ่านเบราว์เซอร์ ทำให้ Googlebot / Webometrics crawler ได้รับเพียง Loading Spinner ใน Initial HTML
- **แนวทางแก้ไข:**
  - แปลง `app/about/staff/page.tsx` เป็น Server Component ทำหน้าที่ Fetch ข้อมูลจาก `${API_URL}/api/staff` ด้วย `{ next: { revalidate: 60 } }`
  - แยก UI State & Filters ไปยัง `components/StaffDirectoryClient.tsx`
  - ส่ง `initialStaff` เข้าสู่ Client Component ทำให้ได้ Initial HTML ครบ 100% ตั้งแต่ Server-side rendering (FCP / LCP รวดเร็วขึ้นมาก)

### 1.2 แก้ปัญหา Duplicate JSON-LD ในหน้า `[id]`
- **ปัญหาเดิม:** ทั้ง `[id]/layout.tsx` และ `[id]/page.tsx` มีการฉีด Schema.org `Person` ซ้ำซ้อนกัน 2 ครั้ง
- **แนวทางแก้ไข:** คงการฉีด `Person` Schema ไว้ที่ `[id]/layout.tsx` (Server-side) และถอด `<JsonLd data={personSchema} />` ออกจาก `[id]/page.tsx`

### 1.3 รวมศูนย์ Asset URL Resolver
- เปลี่ยนจากการเขียน `getImageUrl` ซ้ำซ้อนในแต่ละไฟล์ มาใช้ `getAssetUrl` จาก `@/lib/api-config` อย่างเป็นมาตรฐาน

---

## 2. การยกระดับ UI / UX และความสะดวกของผู้ใช้ (UI/UX Polish)

### 2.1 Mobile Viewport Ergonomics
- ปรับเปลี่ยนตำแหน่ง Sticky Bar ของตัวกรองเป็น `relative md:sticky md:top-20` เพื่อไม่ให้บดบังพื้นที่แนวตั้งบนหน้าจอมือถือ

### 2.2 Active Filter & Results Summary Bar
- แสดงผลสรุปจำนวนที่ค้นพบทันที: `แสดง X จากทั้งหมด Y ท่าน`
- เพิ่มปุ่ม `ล้างตัวกรองทั้งหมด (X)` เมื่อมีการค้นหาหรือเลือกสาขา/ความเชี่ยวชาญ

### 2.3 ป้ายนับจำนวน (Badge Counters)
- แสดงจำนวนบุคลากรจริงในแต่ละหมวด:
  - แท็บสาขาวิชา: "สาขาวิชา (38)"
  - แท็บสายสนับสนุน: "สายสนับสนุน (14)"
  - ปุ่มฟิลเตอร์สาขา: แสดงจำนวนอาจารย์ในแต่ละสาขาวิชา

### 2.4 Skeleton Card Loader
- แทนที่ไอคอนสปินเนอร์เดี่ยวๆ ด้วย Skeleton Grid การ์ดบุคลากรอัตราส่วน 3:4 พร้อม Shimmer effect ป้องกัน Cumulative Layout Shift (CLS)

### 2.5 Profile Actions & Direct Navigation (ในหน้า [id])
- ปรับปุ่มย้อนกลับเป็น `<Link href="/about/staff">` เพื่อรองรับกรณีผู้ใช้เปิดตรงจากภายนอก/Search Engine
- เพิ่มปุ่ม **Copy Email** (คลิกเดียวคัดลอกอีเมล พร้อมสถานะแจ้งเตือน)
- เพิ่มปุ่ม **Share Profile Link** ทั้งใน Header Bar และ Contact Box พร้อมฟังก์ชันคัดลอก URL ทันที

---

## 3. แผนการตรวจสอบและทดสอบ (Verification)
1. ตรวจสอบ Next.js Build (`npm run build` ใน `frontend`)
2. ตรวจสอบ Initial HTML Output ว่ามีรายชื่อบุคลากรและลิงก์สำหรับ Webometrics Crawlers
3. ตรวจสอบว่าไม่มี Duplicate JSON-LD ใน `[id]`

---

## 4. ระบบความคุ้มครองข้อมูลส่วนบุคคล (PDPA) & ระบบขอประวัติวิทยากรทางการ (Resume & Speaker Bio)
- **มาตรการ PDPA (แนวทาง B):**
  - **ปิดการแชร์ลิงก์โปรไฟล์:** นำปุ่ม Share Profile ออกทั้งใน Header และ Sidebar ของหน้า `[id]` เพื่อป้องกันการนำข้อมูลส่วนบุคคลไปเผยแพร่ต่อโดยมิได้รับอนุญาต
  - **การป้องกันการพิมพ์และบันทึกหน้าเว็บ:** ดักจับ `Ctrl+P` / `Cmd+P` และใช้ `@media print` ซ่อนข้อมูลส่วนบุคคลทั้งหมด แสดงเฉพาะ Watermark & PDPA Notice
  - **ข้อความกำหนดระยะเวลา:** ระบุชัดเจนในแบบฟอร์มคำขอและอีเมลตอบรับว่า **"ทำการส่งเอกสารให้ ไม่เกิน 7 วันหลังจากได้รับการร้องขอเอกสาร"**
- **สถาปัตยกรรม Backend:**
  - **ฐานข้อมูล (`staff_resume_requests`):** บันทึกคำขอพร้อมสถานะ (`PENDING`, `APPROVED`, `SENT`, `REJECTED`) รหัสอ้างอิง และข้อมูลผู้ขอ
  - **CRRU Google Workspace / Gmail SMTP:** บริการ `StaffMailService` เชื่อมต่อผ่าน `smtp.gmail.com` เพื่อส่งอีเมลตอบรับและแนบไฟล์ พร้อมระบบ Mock Fallback ที่ปลอดภัย
  - **ระบบสร้าง PDF อัตโนมัติ (`PdfResumeService`):** ใช้ `pdfkit` พร้อมฟอนต์ภาษาไทย (Tahoma) สร้างเอกสาร Curriculum Vitae & Speaker Bio ทางการพร้อมตราสัญลักษณ์และลายน้ำ PDPA
  - **Endpoints:**
    - `POST /api/staff/resume-requests` (ยื่นคำร้องขอเอกสาร พร้อมส่งอีเมลตอบรับอัตโนมัติ)
    - `GET /api/staff/resume-requests` (Admin ดูรายการคำขอ)
    - `POST /api/staff/resume-requests/:id/approve` (Admin อนุมัติและยิงส่งอีเมลพร้อมแนบ PDF)
    - `POST /api/staff/resume-requests/:id/reject` (Admin ปฏิเสธคำร้อง)
    - `GET /api/staff/:id/resume-preview` (Admin พรีวิวไฟล์ PDF)

