---
title: "Plan: Redesign /about Overview Page with Modern Stack"
type: "task-plan"
status: "completed"
tags: ["plan", "about-page", "redesign", "tailwind-v4", "shadcn", "prompt-font"]
aliases: ["About Page Redesign Plan"]
---

# 📋 Plan: Redesign `/about` (ภาพรวมคณะสังคมศาสตร์)

> [!important] เป้าหมายโครงการ
> ยกเครื่องหน้า [**`/about`**](file:///e:/web2026/soc-crru-web/frontend/app/about/page.tsx) สู่มาตรฐาน **Editorial Lanna Modernist** โดยยึดข้อมูลประวัติความเป็นมา ปรัชญา วิสัยทัศน์ เอกลักษณ์ อัตลักษณ์ ค่านิยม และพันธกิจ 5 ด้านเดิมครบถ้วน 100% เปลี่ยนผ่านสู่ Pure Tailwind CSS v4, shadcn/ui, Motion, Lucide React และฟอนต์มาตรฐาน **`Prompt`**

---

## 🔍 Phase 1: การวิเคราะห์เนื้อหาเดิม (Existing Content Audit)

ยึดข้อมูลที่มีอยู่เดิมโดยไม่มีการสูญหาย (Zero Data Loss):
1. **ประวัติความเป็นมา:** ก่อตั้งปี 2546 ภายใต้โครงสร้างมหาวิทยาลัย พัฒนาสู่ 7 หลักสูตร (ตรี-โท-เอก)
2. **ปรัชญา (Philosophy):** "องค์กรแห่งการบูรณาการองค์ความรู้เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
3. **วิสัยทัศน์ (Vision):** "บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
4. **เสาหลักอัตลักษณ์ (Identity Pillars):**
   - เอกลักษณ์ (Uniqueness): องค์กรแห่งการเรียนรู้สู่การพัฒนาชุมชน ท้องถิ่น สังคม ประเทศ และนานาชาติ
   - อัตลักษณ์ (Identity): มีคุณธรรม ความรู้ ความคิดสร้างสรรค์ ทักษะทางสังคม เป็นที่ยอมรับในศตวรรษที่ 21
   - ค่านิยม (Core Values): บูรณาการศาสตร์ที่หลากหลายสู่การพัฒนาท้องถิ่น
5. **พันธกิจ 5 ด้าน (Missions):** 1. ผลิตบัณฑิตนวัตกร | 2. วิจัยและงานสร้างสรรค์ | 3. บริการวิชาการ | 4. ทำนุบำรุงศิลปวัฒนธรรม | 5. องค์กรธรรมาภิบาล

---

## 🎨 Phase 2: แนวทางการออกแบบใหม่ (Design Architecture)

1. **Editorial Hero Section:**
   - พาดหัวตัวอักษรใหญ่ระดับสถาบันด้วยฟอนต์ `Prompt`
   - แถบ Breadcrumb คมชัด และตัวเลขสรุปปีการก่อตั้ง (พ.ศ. 2546 - ปัจจุบัน 23 ปีแห่งการพัฒนา)
2. **Interactive Sub-Navigation Anchor Bar:**
   - แถบนำทางด่วนภายในหน้า (ประวัติความเป็นมา • วิสัยทัศน์ • อัตลักษณ์ • พันธกิจ) พร้อมลิงก์ไปหน้าย่อย (`/structure`, `/strategy`, `/executive`, `/staff`)
3. **Heritage Story Timeline (ประวัติความเป็นมา):**
   - ออกแบบเป็น Timeline Storytelling ร่วมสมัย มีมิติความลึก (Depth) แทนกล่องข้อความทึบเดิม
4. **Vision & Philosophy Dual Showcase (ปรัชญาและวิสัยทัศน์):**
   - การ์ดคู่โทน Midnight Slate (`#0B132B`) และ Saffron Flame (`#C2410C`) พร้อมไอคอน Lucide คมชัด (`Compass`, `Eye`) แทนที่ Emoji
5. **Identity & Core Values Grid (3 คอลัมน์):**
   - การ์ดขาวคลีน พื้นหลัง Mist Canvas (`#F8FAFC`) พร้อม Hairline Border (`#E2E8F0`) และไอคอน `Sparkles`, `GraduationCap`, `HeartHandshake`
6. **Mission 5-Pillar List (พันธกิจ 5 ด้าน):**
   - ลิสต์แสดงผลแบบ Interactive Hover ด้วย Motion พร้อมตัวเลขลำดับสไตล์ Editorial และไอคอนกำกับแต่ละด้าน

---

## 📋 Phase 3: แผนงานแบ่งเป็นขั้นตอน (Task Breakdown)

- [x] **Task 1:** สร้าง Sub-Navigation & Breadcrumb component สำหรับกลุ่มหน้า `/about`
- [x] **Task 2:** ออกแบบและประกอบส่วน Hero & History Timeline ใน `frontend/app/about/page.tsx`
- [x] **Task 3:** ออกแบบส่วน Vision, Philosophy, และ Identity Pillars ด้วย shadcn Cards + Lucide React
- [x] **Task 4:** ออกแบบส่วน Mission 5 ด้านพร้อม Motion Hover Interaction
- [x] **Task 5:** ตรวจสอบความสมบูรณ์ (`npm run build`), ทดสอบ Responsive และรองรับ `prefers-reduced-motion`

---

## 🔗 เอกสารเชื่อมโยง
- [[00_Dashboard|สารบัญหลัก (MOC)]]
- [[02_Architecture/design|สถาปัตยกรรมดีไซน์และฟอนต์ Prompt]]
- [[01_Active_Tasks/plan-redesign-css-uxui-modern-stack|แผนย้าย CSS & UX/UI สู่ Modern Stack]]
