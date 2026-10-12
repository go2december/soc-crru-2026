---
title: Redesign Plan - Academic Editorial Credit Bank System
status: completed
created_at: 2026-10-05
tags:
  - frontend
  - ui-ux
  - redesign
  - credit-bank
  - academics
---

# แผนการปรับปรุงหน้าตา (Redesign): ระบบคลังหน่วยกิต (Credit Bank)

> [!NOTE] แนวคิดการออกแบบ
> ปรับโฉมหน้า `/academics/credit-bank` สู่สไตล์ **Academic Editorial & Authority** ตาม Scholar Theme (Deep Blue & Gold) คมชัดระดับมืออาชีพ (Sharp & Professional) ไร้ความโค้งมนเทมเพลต และเสริมด้วยตารางเปรียบเทียบระบบปกติ VS คลังหน่วยกิต (Comparison Matrix) อย่างเป็นทางการ

---

## 1. โครงสร้างองค์ประกอบใหม่ (Layout Breakdown)

### 1.1 Hero & Credibility Header
- โทนสีกรมท่าลึก (`#0A2540` / `scholar-deep`) ตัดเส้นสายทอง (`scholar-gold`)
- ตราสัญลักษณ์ความร่วมมือระหว่าง คณะสังคมศาสตร์ x สถาบันการเรียนรู้ตลอดชีวิต มรภ.เชียงราย (CRRU Lifelong)
- 4 Quick Metrics Bar (สะสมไม่จำกัดเวลา, เทียบโอน RPL, ได้ทั้ง Degree & Non-degree, รับรองโดยสภาฯ)

### 1.2 4-Stage Pathway (Roadmap สู่ปริญญาบัตร)
- ขั้นตอนการสะสมหน่วยกิตแบบชัดเจน (1. สมัครบัญชี -> 2. อบรมคอร์สระยะสั้น -> 3. วัดผล/RPL -> 4. ขอรับปริญญา)
- การ์ดแบบ Sharp Geometry (`rounded-sm`, ขอบคมชัด)

### 1.3 Featured Faculty Courses (หลักสูตรของคณะสังคมศาสตร์)
- ดึงข้อมูลจริงจาก Backend API
- การ์ดวิชาแสดงภาพปก, รหัสหลักสูตร, วิทยากร, จำนวนชั่วโมง, หน่วยกิตสะสม, และปุ่มลิงก์ตรงไปยัง CRRU Lifelong

### 1.4 Comparison Matrix (ตารางเปรียบเทียบระบบปกติ VS คลังหน่วยกิต)
- ตารางทางการ เปรียบเทียบ 6 มิติ (คุณสมบัติ, เวลาเรียน, ค่าธรรมเนียม, การเทียบโอน, อายุหน่วยกิต, วุฒิการศึกษา)

### 1.5 Academic Advisory & Next Steps
- กล่องประสานงานฝ่ายวิชาการคณะสังคมศาสตร์ และลิงก์สู่ระบบกลาง

---

## 2. ขั้นตอนการดำเนินการ (Phases)
- [x] บันทึกและแทนที่โค้ดใน `frontend/app/academics/credit-bank/page.tsx`
- [x] ตรวจสอบการแสดงผลและ Responsive Design ทุกหน้าจอ
- [x] ทดสอบ Build และ Verify ด้วย Turbopack (HTTP 200 OK)
