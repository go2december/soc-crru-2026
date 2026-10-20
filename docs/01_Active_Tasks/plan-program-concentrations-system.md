---
title: Implementation Plan - Academic Program Concentrations Dynamic Sub-pages & Admin Management
status: completed
created_at: 2026-10-20
tags:
  - frontend
  - backend
  - admin
  - programs
  - concentrations
  - scholar-theme
---

# แผนพัฒนาระบบแขนงวิชา/วิชาเอกแบบไดนามิก (Dynamic Program Concentrations & Sub-pages)

> [!NOTE] สรุปความต้องการและสถาปัตยกรรม (Architecture & Objectives)
> 1. **Public Sub-pages**: สร้าง Dynamic Route `/programs/[code]/[track]` ที่ใช้ `ProgramTemplate` แสดงผลเต็มรูปแบบเหมือนสาขาหลัก พร้อม Breadcrumbs เชื่อมโยง
> 2. **Data Model & Database**: ขยายโครงสร้าง `concentrations` (JSONB) ในตาราง `programs` ให้รองรับข้อมูลครบวงจร (code, title, titleEn, degreeTitle, description, highlights, careers, structure, bannerUrl)
> 3. **Future-Proof Admin Panel**: เพิ่มระบบจัดการแขนงวิชา/วิชาเอกในหน้าแก้ไขหลักสูตรของ Admin (`/admin/programs/[id]`) เพื่อให้เจ้าหน้าที่สามารถ เพิ่ม/ลบ/แก้ไข แขนงวิชาของทุกสาขาได้อย่างอิสระในอนาคต

---

## 1. การออกแบบสถาปัตยกรรม (Architecture Design)

### 1.1 Data Schema (`ProgramConcentration`)
```typescript
export interface ProgramConcentration {
  code: string;           // URL slug: "sociology-anthropology", "cultural-resource-management", etc.
  title: string;          // ชื่อไทย: "แขนงวิชาสังคมวิทยาและมานุษยวิทยา"
  titleEn?: string;       // ชื่ออังกฤษ: "Sociology and Anthropology"
  degreeTitle?: string;   // วุฒิการศึกษา: "ศิลปศาสตรบัณฑิต (สังคมศาสตร์)"
  description: string;    // คำอธิบายภาพรวม/ปรัชญา
  bannerUrl?: string;     // ภาพ Banner ประจำแขนง
  highlights?: {
    title: string;
    description: string;
  }[];
  careers?: string[];     // อาชีพเฉพาะของแขนง
  structure?: {
    totalCredits: number;
    general: number;
    major: number;
    freeElective: number;
  };
  curriculumUrl?: string;
}
```

### 1.2 Routing Structure
- `/programs/[code]` (สาขาหลัก เช่น `/programs/social-sci`)
  - มี Section แขนงวิชา พร้อมปุ่ม *"ดูรายละเอียดแขนงนี้ฉบับเต็ม"* → นำไปยัง Sub-page
- `/programs/[code]/[track]` (หน้าแขนงย่อย เช่น `/programs/social-sci/sociology-anthropology`)
  - แสดงผลด้วย `ProgramTemplate` เต็มรูปแบบ
  - Breadcrumb: `หน้าแรก > หลักสูตร > สาขาวิชาสังคมศาสตร์ > แขนงวิชาสังคมวิทยาและมานุษยวิทยา`
  - มีปุ่มกลับไปยังสาขาวิชาหลัก

---

## 2. ขั้นตอนการดำเนินงาน (Execution Steps)

- [x] **Step 1: อัปเกรด Schema & ข้อมูลตั้งต้นใน Database**
  - ปรับปรุง Type ใน `backend/libs/database/src/schema.ts` และ `frontend/lib/api.ts`
  - อัปเดตข้อมูล 4 แขนงวิชา/วิชาเอกใน `soc_db` (สำหรับ `social-sci` และ `home-eco`) ให้มีข้อมูลครบถ้วน (code, highlights, careers, structure)
- [x] **Step 2: สร้างหน้า Sub-page Route**
  - สร้าง `frontend/app/programs/[code]/[track]/page.tsx`
  - ดึงข้อมูล Program จาก API และค้นหา Concentration ตาม `track`
  - ส่ง Props ไปเรนเดอร์ใน `ProgramTemplate`
- [x] **Step 3: ปรับปรุงการเชื่อมโยงในหน้าสาขาหลักและ Template**
  - ใน `frontend/components/ProgramTemplate.tsx` เพิ่มปุ่มลิงก์ตรงไปยัง Sub-page แต่ละแขนง
  - อัปเดต Hero Quick Links และการ์ดใน `/programs` ให้ชี้ไปยัง Sub-page ได้
- [x] **Step 4: เพิ่มระบบจัดการใน Admin Dashboard**
  - ใน `frontend/app/admin/(dashboard)/programs/[id]/page.tsx` เพิ่ม UI Card สำหรับจัดการ `concentrations` (เพิ่ม, แก้ไข, ลบ)
- [x] **Step 5: ทดสอบ Build และความถูกต้อง**
  - ตรวจสอบ TypeScript & Next.js Build (`npm run build`)
  - อัปเดต Graphify AST
