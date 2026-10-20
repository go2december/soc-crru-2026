---
title: "Plan: Redesign /about/strategy Module"
type: "task-plan"
status: "completed"
tags: ["plan", "about-strategy", "redesign", "tailwind-v4", "prompt-font", "lucide-react"]
aliases: ["Strategy Page Redesign Plan"]
---

# 📋 Plan: Redesign `/about/strategy` (แผนยุทธศาสตร์ 5 ปี คณะสังคมศาสตร์)

> [!important] วัตถุประสงค์โครงการ
> ยกเครื่องหน้า [**`/about/strategy`**](file:///e:/web2026/soc-crru-web/frontend/app/about/strategy/page.tsx) และหน้ารายละเอียดยุทธศาสตร์ [**`/about/strategy/[id]`**](file:///e:/web2026/soc-crru-web/frontend/app/about/strategy/[id]/page.tsx) สู่มาตรฐาน **Editorial Lanna Modernist** โดยยึดข้อมูลเดิม 100% (Zero Data Loss) พร้อมฟอนต์ **`Prompt`**, Lucide Icons คุณภาพสูง แทนที่ Emoji และรูปภาพสต็อกเดิม

---

## 🔍 ข้อมูลเดิมในระบบ (Existing Content Audit)

1. **ชื่อแผน:** แผนยุทธศาสตร์ 5 ปี (พ.ศ. 2565 - 2569) ฉบับทบทวน พ.ศ. 2566
2. **วิสัยทัศน์ (Vision):** “บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน” (พร้อมคำแปลภาษาอังกฤษ)
3. **พันธกิจ (Mission):** 5 ประการเดิม
4. **4 ประเด็นยุทธศาสตร์ (Strategic Issues):**
   - **ยุทธศาสตร์ที่ 1:** การยกระดับคุณภาพการศึกษา (Elevating Education Quality)
   - **ยุทธศาสตร์ที่ 2:** การพัฒนางานวิจัย นวัตกรรม และงานสร้างสรรค์ (Research, Innovation, and Creative Works)
   - **ยุทธศาสตร์ที่ 3:** การพัฒนาท้องถิ่น (Local Development)
   - **ยุทธศาสตร์ที่ 4:** การพัฒนาระบบ กลไก และการบริหารจัดการ (System, Mechanism, and Management Development)
5. **เป้าหมายความสำเร็จ (Goals):** 6 ประการ
6. **รายละเอียดรายยุทธศาสตร์ใน `[id]`:** เป้าประสงค์ (Goals), กลยุทธ์/แนวทาง (Tactics), โครงการสำคัญ/Flagship Projects

---

## 🎨 ทิศทางการออกแบบใหม่ (Design Architecture)

1. **Hero Section สไตล์ Editorial Lanna:**
   - ใช้โทน Deep Lanna Slate (`#0B132B`) ขอบล่าง Saffron Flame (`#C2410C`)
   - ลบภาพสต็อก Unsplash และแทนที่ด้วยลวดลายเรขาคณิตจาง ๆ (Subtle Geometric Canvas)
   - แสดง Breadcrumb คมชัด และแท็ก `STRATEGIC PLAN 2565 - 2569`
2. **Vision & Mission Highlight:**
   - กล่องวิสัยทัศน์ดีไซน์พรีเมียมด้วยฟอนต์ `Prompt` พร้อมไอคอน Lucide `Compass`
   - พันธกิจ 5 ประการแบบ 2 คอลัมน์ สะอาดตา
3. **4 Strategic Issues Cards:**
   - การ์ด 4 มิติ ใช้ Lucide Icons (`GraduationCap`, `Lightbulb`, `Compass`, `Cog`) แทน Emoji (`📚`, `💡`, `🏡`, `⚙️`)
   - ป้ายกำกับและโทนสีเฉพาะด้านตามธีมมหาวิทยาลัย
   - เอฟเฟกต์ Hover ยกตัวการ์ดและปุ่มคลิกไปดูรายละเอียดเชิงลึก (`/about/strategy/[id]`)
4. **Goals 6-Pillar Grid:**
   - แสดงเป้าหมายความสำเร็จ 6 ข้อในกรอบ Mist Canvas พร้อม Checkmark ไอคอน Lucide `CheckCircle2`
5. **หน้าย่อย `[id]` Redesign:**
   - ปรับแต่งหน้า `frontend/app/about/strategy/[id]/page.tsx` ให้ใช้ธีมเดียวกัน ลบ Emoji เปลี่ยนเป็นไอคอน Lucide `Target`, `Rocket`, `Sparkles`

---

## 📋 แผนงานปฏิบัติการ (Task Breakdown)

- [x] **Task 1:** ปรับปรุง `frontend/app/about/strategy/page.tsx` ให้ใช้ฟอนต์ `Prompt`, สีมาตรฐาน, ไอคอน Lucide
- [x] **Task 2:** ปรับปรุง `frontend/app/about/strategy/[id]/page.tsx` ให้สอดคล้องกับดีไซน์ซิสเต็มใหม่
- [x] **Task 3:** ตรวจสอบ Responsive, การลิงก์ และทดสอบผ่าน Dev Server (`HTTP 200 OK`)
- [x] **Task 4:** ซิงค์ Knowledge Graph ด้วย `graphify extract . --code-only`

---

## 🔗 เอกสารเชื่อมโยง
- [[00_Dashboard|สารบัญหลัก]]
- [[02_Architecture/design|สถาปัตยกรรมดีไซน์และฟอนต์ Prompt]]
- [[01_Active_Tasks/plan-redesign-about-module|แผนงานหลักหมวด About]]
