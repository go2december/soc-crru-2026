---
title: Task Plan - Short Courses Credit Bank Integration with CRRU Lifelong
status: completed
created_at: 2026-10-05
tags:
  - backend
  - frontend
  - admin
  - credit-bank
  - academics
---

# แผนงาน: ระบบหลักสูตรระยะสั้นและคลังหน่วยกิต เชื่อมโยง CRRU Lifelong

> [!NOTE] วัตถุประสงค์
> พัฒนาระบบจัดการหลักสูตรระยะสั้น (Short Courses) และคลังหน่วยกิต (Credit Bank) ของคณะสังคมศาสตร์ รองรับการจัดเก็บในฐานข้อมูล, ระบบหลังบ้าน Admin, และแสดงผลในหน้าเว็บหลักพร้อม Deep-link ไปยังระบบกลาง [CRRU Lifelong Learning](https://lifelong.crru.ac.th/)

---

## 1. ขอบเขตงาน (Scope of Work)

### 1.1 ฐานข้อมูล (Database Schema)
- ปรับปรุงตาราง `short_courses` ใน [[schema]] ([[backend/libs/database/src/schema.ts]])
- เพิ่มฟิลด์: `code`, `category`, `description`, `instructorName`, `coverImageUrl`, `lifelongUrl`, `isCreditBank`, `status`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`

### 1.2 ระบบหลังบ้าน (Backend API)
- เพิ่ม `ShortCoursesModule`, `ShortCoursesService`, `ShortCoursesController` ใน `backend/apps/programs-service/src/short-courses/`
- REST Endpoints:
  - `GET /short-courses`: ดึงรายการคอร์สแบบ Public (รองรับ filter `isCreditBank`, `status`)
  - `GET /short-courses/admin/all`: ดึงรายการคอร์สทั้งหมดสำหรับ Admin
  - `GET /short-courses/:id`: ดึงรายละเอียดรายคอร์ส
  - `POST /short-courses`: เพิ่มคอร์สใหม่ (Admin Guard)
  - `PATCH /short-courses/:id`: แก้ไขคอร์ส (Admin Guard)
  - `DELETE /short-courses/:id`: ลบคอร์ส (Admin Guard)
- เพิ่ม endpoint อัปโหลดรูปภาพคอร์ส: `POST /upload/course` ใน `UploadController` และ `UploadService`

### 1.3 หน้าจัดการผู้ดูแลระบบ (Admin Dashboard)
- เพิ่มเมนูในแถบข้าง [[frontend/app/admin/(dashboard)/layout.tsx]] -> "คอร์สระยะสั้น/Credit Bank" (`/admin/short-courses`)
- สร้างหน้า [[frontend/app/admin/(dashboard)/short-courses/page.tsx]]: ตารางแสดงรายการ, สถิติ, ปุ่มเปิด/ปิด Credit Bank, และปุ่มเปิดดูลิงก์ Lifelong
- สร้างคอมโพเนนต์ฟอร์มรองรับอัปโหลดรูปภาพปกเข้า Server, ตั้งค่าชั่วโมงเรียน, หน่วยกิต, และ URL ไปยัง Lifelong

### 1.4 หน้าเว็บสาธารณะ (Public Frontend)
- ปรับปรุง [[frontend/app/academics/credit-bank/page.tsx]]: เพิ่มส่วนแสดงไฮไลต์ "หลักสูตรสะสมหน่วยกิตของคณะ (Featured Credit Bank Courses)" ดึงข้อมูลจริงจาก API พร้อมปุ่มเชื่อมโยง Lifelong
- ปรับปรุง [[frontend/app/academics/short-courses/page.tsx]]: เปลี่ยนจาก Mock data เป็น Dynamic fetch จาก API พร้อมฟิลเตอร์กรองตามหมวดและ Credit Bank
- เพิ่ม Seed ข้อมูลเริ่มต้นหลักสูตร "ตุงและโคมประดิษฐ์" (LL6506004)

---

## 2. ขั้นตอนการดำเนินงาน (Phase Breakdown)

- [x] **Phase 1: Database & Backend**
  - [x] อัปเดต `short_courses` table ใน `schema.ts`
  - [x] รัน Migration อัปเดตโครงสร้าง Database พร้อม Seed เริ่มต้น
  - [x] อัปเดต `UploadService` & `UploadController` รองรับ `uploads/courses` (`POST /upload/course`)
  - [x] สร้าง DTOs (`create-short-course.dto.ts`, `update-short-course.dto.ts`)
  - [x] สร้าง `ShortCoursesService` & `ShortCoursesController`
  - [x] ลงทะเบียนโมดูลใน `ProgramsServiceModule` และคอมไพล์ Backend สำเร็จ 100%
- [x] **Phase 2: Admin Dashboard**
  - [x] เพิ่มเมนู Sidebar ใน `layout.tsx`
  - [x] สร้างหน้าตารางรายการและฟอร์มจัดการ `/admin/short-courses`
  - [x] รองรับ Image Uploader สำหรับบันทึกภาพปกเข้าเครื่อง Server ของคณะ
- [x] **Phase 3: Public Frontend Pages**
  - [x] เพิ่มคอมโพเนนต์คอร์สสะสมหน่วยกิตใน `/academics/credit-bank`
  - [x] เชื่อมต่อ API ใน `/academics/short-courses`
  - [x] ปุ่ม Deep Link เชื่อมต่อไปยัง Lifelong CRRU ทันที
- [x] **Phase 4: Seed Data & Verification**
  - [x] บันทึกข้อมูลคอร์ส "ตุงและโคมประดิษฐ์" เป็นตัวอย่างตั้งต้น
  - [x] คอมไพล์และทดสอบ Build ทั้ง Backend และ Frontend สำเร็จ 100% ไม่มีข้อผิดพลาด


---

## 3. เอกสารและไฟล์ที่เกี่ยวข้อง
- [[backend/libs/database/src/schema.ts]]
- [[backend/apps/programs-service/src/programs-service.module.ts]]
- [[frontend/app/academics/credit-bank/page.tsx]]
- [[frontend/app/academics/short-courses/page.tsx]]
- [[frontend/app/admin/(dashboard)/layout.tsx]]
