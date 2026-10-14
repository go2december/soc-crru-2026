---
title: Plan - Staff Resume Requests Admin Portal & Management System
status: planned
created_at: 2026-10-14
tags:
  - staff
  - resume
  - admin
  - pdpa
  - email
  - plan
---

# แผนพัฒนาระบบจัดการคำขอเอกสารประวัติวิทยากรสำหรับผู้ดูแลระบบ (Admin Portal)

> [!NOTE] วัตถุประสงค์ (Objectives)
> ต่อยอดระบบขอประวัติวิทยากรและเรซูเม่อาจารย์ ([`RequestResumeModal.tsx`](file:///e:/web2026/soc-crru-web/frontend/app/about/staff/[id]/RequestResumeModal.tsx)) และ Backend API ที่สร้างไว้ ให้มีหน้าจอจัดการสำหรับผู้ดูแลระบบและเจ้าหน้าที่ธุรการคณะฯ ในส่วนหลังบ้าน (`/admin/staff/resume-requests`) เพื่อตรวจสอบ อนุมัติ และจัดส่งไฟล์ PDF ได้อย่างสะดวกรวดเร็วตามเกณฑ์ PDPA ภายใน 7 วันทำการ

---

## 1. ขอบเขตงานระยะถัดไป (Next Phase Scope)

```mermaid
flowchart LR
    A["ผู้ขอยื่นฟอร์มหน้าเว็บ"] --> B["Backend ส่งเมลตอบรับ 7 วัน"]
    B --> C["เก็บคำขอใน Database (PENDING)"]
    C --> D["Admin Portal (/admin/staff/requests)"]
    D --> E{"เจ้าหน้าที่พิจารณา"}
    E -->|อนุมัติ| F["Generate PDF & ส่งเมลพร้อมแนบไฟล์อัตโนมัติ"]
    E -->|ปฏิเสธ| G["แจ้งเหตุผลปฏิเสธทางอีเมล"]
```

### 1.1 หน้าจอผู้ดูแลระบบ (Admin Portal UI: `/admin/staff/requests`)
- [ ] **ตารางรายการคำขอ (Data Table):**
  - แสดงชื่อผู้ขอ, สังกัด/หน่วยงาน, อาจารย์ที่ถูกขอประวัติ, วัตถุประสงค์, วันที่ยื่นคำขอ
  - ป้ายสถานะสี (Status Badges): `PENDING` (รอตรวจสอบ - สีเหลือง), `SENT` (จัดส่งแล้ว - สีเขียว), `REJECTED` (ปฏิเสธ - สีแดง)
  - แถบเตือนนับถอยหลัง 7 วัน (7-Day SLA Countdown Timer): เช่น *"เหลือเวลา 4 วัน"*
- [ ] **ปุ่มพรีวิวเอกสาร (Preview PDF):**
  - เปิดดูเอกสาร PDF Resume ที่สร้างจากระบบก่อนส่งจริงได้ทันที
- [ ] **ระบบการอนุมัติและจัดส่ง (Approve & Send Action):**
  - กดปุ่ม **"อนุมัติและจัดส่งทันที"** → เรียก Endpoint `POST /api/staff/resume-requests/:id/approve`
  - ระบบจะสร้าง PDF แนบไปกับอีเมล `social@crru.ac.th` ถึงผู้ขอโดยอัตโนมัติ
- [ ] **ระบบปฏิเสธคำขอ (Reject Action):**
  - แสดงกล่อง Modal ให้ระบุเหตุผล (เช่น วัตถุประสงค์ไม่ชัดเจน หรือไม่ตรงตามเกณฑ์ของคณะฯ)

### 1.2 การแจ้งเตือนและระบบควบคุมระยะเวลา (SLA & Notifications)
- [ ] **ระบบแจ้งเตือนเมื่อใกล้ครบกำหนด 7 วัน:**
  - สร้าง Script แจ้งเตือนไปยัง `social@crru.ac.th` เมื่อมีคำขอค้างเกิน 5 วันทำการ
- [ ] **ประวัติการเข้าถึงข้อมูลตาม PDPA (Audit Trail):**
  - บันทึกชื่อเจ้าหน้าที่ผู้อนุมัติ (`approvedBy`) และเวลาที่จัดส่งเอกสาร (`sentAt`)

---

## 2. ข้อมูลทางเทคนิคและ Endpoint ที่พร้อมเชื่อมต่อ (Ready APIs)

| Method | Endpoint | สิทธิ์เข้าถึง | คำอธิบาย |
|---|---|---|---|
| `GET` | `/api/staff/resume-requests` | `ADMIN`, `EDITOR` | ดึงรายการคำขอทั้งหมดพร้อม Pagination และ Status Filter |
| `POST` | `/api/staff/resume-requests/:id/approve` | `ADMIN`, `EDITOR` | อนุมัติคำขอ สร้าง PDF และส่งอีเมลแนบไฟล์ทันที |
| `POST` | `/api/staff/resume-requests/:id/reject` | `ADMIN`, `EDITOR` | ปฏิเสธคำขอพร้อมบันทึกเหตุผล |
| `GET` | `/api/staff/:id/resume-preview` | `ADMIN`, `EDITOR` | พรีวิวดาวน์โหลดไฟล์ PDF Resume ล่าสุด |

---

## 3. เอกสารและระบบที่เกี่ยวข้อง (References)
- [[docs/01_Active_Tasks/plan-staff-directory-enhancement.md|แผนงานทำเนียบบุคลากรและ PDPA Protection]]
- [`backend/apps/staff-service/src/staff.controller.ts`](file:///e:/web2026/soc-crru-web/backend/apps/staff-service/src/staff.controller.ts)
- [`backend/apps/staff-service/src/mail.service.ts`](file:///e:/web2026/soc-crru-web/backend/apps/staff-service/src/mail.service.ts)
- [`backend/apps/staff-service/src/pdf-resume.service.ts`](file:///e:/web2026/soc-crru-web/backend/apps/staff-service/src/pdf-resume.service.ts)
