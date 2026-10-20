---
title: "Plan: Redesign /about/structure Module"
type: "task-plan"
status: "completed"
tags: ["plan", "about-structure", "redesign", "tailwind-v4", "prompt-font", "lucide-react"]
aliases: ["Structure Page Redesign Plan"]
---

# 📋 Plan: Redesign `/about/structure` (โครงสร้างการบริหาร คณะสังคมศาสตร์)

> [!important] วัตถุประสงค์โครงการ
> ปรับปรุงหน้า [**`/about/structure`**](file:///e:/web2026/soc-crru-web/frontend/app/about/structure/page.tsx) (**โครงสร้างการบริหาร**) สู่มาตรฐาน **Editorial Lanna Modernist** โดยใช้ฟอนต์ **`Prompt`**, Pure Tailwind CSS v4, Lucide React และผังองค์กรแบบ Responsive Tree ที่แสดงผลได้สมบูรณ์ทั้งบนมือถือและจอคอมพิวเตอร์

---

## 🔍 ข้อมูลเดิมในระบบ (Existing Content Audit)

1. **ระดับที่ 1 (Apex):** คณบดีคณะสังคมศาสตร์ (Dean)
2. **ระดับที่ 2 (Executive):** รองคณบดี 3 ฝ่าย
   - รองคณบดีฝ่ายวิชาการและวิจัย (Academic & Research)
   - รองคณบดีฝ่ายบริหารและยุทธศาสตร์ (Admin & Strategy)
   - รองคณบดีฝ่ายกิจการนักศึกษาและทำนุบำรุงศิลปวัฒนธรรม (Student Affairs)
3. **ระดับที่ 3 (Departments & Offices):**
   - **สำนักงานคณบดี (Dean's Office):** งานบริหารทั่วไป, งานนโยบายและแผน, งานการเงินและพัสดุ, งานบริการการศึกษา
   - **หลักสูตรและสาขาวิชา (Academic Programs):** สาขาวิชาสังคมศาสตร์, นวัตกรรมการพัฒนาสังคม, จิตวิทยาสังคม, ภูมิศาสตร์และภูมิสารสนเทศ, คหกรรมศาสตร์, และหลักสูตรระดับบัณฑิตศึกษา
4. **ส่วนงานสนับสนุนพิเศษ:** ศูนย์เชียงรายศึกษา และคณะกรรมการประจำคณะ

---

## 🎨 ทิศทางการออกแบบใหม่ (Design Architecture)

1. **Hero Section สไตล์ Editorial Lanna:**
   - ใช้โทน Deep Lanna Slate (`#0B132B`) พร้อมขอบล่าง Saffron Flame (`#C2410C`)
   - ลวดลาย Geometric Dot Canvas สะอาดตา ลบภาพสต็อก Unsplash เดิม
   - Breadcrumbs นำทาง: `หน้าแรก` > `เกี่ยวกับคณะ` > `โครงสร้างการบริหาร`
2. **Sticky Sub-Navigation Bar:**
   - เชื่อมต่อไปยัง `ภาพรวมคณะ`, `แผนยุทธศาสตร์`, `โครงสร้างบริหาร` (Active), `ผู้บริหาร`, `บุคลากร`
3. **Responsive Organization Chart Tree:**
   - ออกแบบการเชื่อมโยงสายการบังคับบัญชาแบบโมเดิร์น ไม่แตกบนหน้าจอมือถือ
   - โหนดคณบดีและรองคณบดีใช้การ์ดกระจก/มิติความลึก (Depth) มีไอคอนกำกับ
   - กล่องสำนักงานคณบดี และหลักสูตรแยกเป็น 2 ปีกหลักชัดเจน พร้อมลิงก์ไปยังหลักสูตร
4. **Quick Shortcuts:**
   - ลิงก์เชื่อมโยงไปยัง [ทำเนียบผู้บริหาร](/about/executive) และ [ค้นหาบุคลากร](/about/staff)

---

## 📋 แผนงานปฏิบัติการ (Task Breakdown)

- [x] **Task 1:** ปรับปรุง `frontend/app/about/structure/page.tsx` ด้วยฟอนต์ `Prompt`, สีมาตรฐาน, ไอคอน Lucide และผัง Responsive Tree
- [x] **Task 2:** ตรวจสอบความถูกต้องของเส้นทางและการเรนเดอร์ (`HTTP 200 OK`)
- [x] **Task 3:** ซิงค์ Knowledge Graph ด้วย `graphify extract . --code-only`

---

## 🔗 เอกสารเชื่อมโยง
- [[00_Dashboard|สารบัญหลัก]]
- [[02_Architecture/design|สถาปัตยกรรมดีไซน์และฟอนต์ Prompt]]
- [[01_Active_Tasks/plan-redesign-about-module|แผนงานหลักหมวด About]]
