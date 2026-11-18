---
title: "Plan: Redesign /research/journal Module (Editorial Lanna Modernist)"
type: "task-plan"
status: "completed"
created: "2026-10-26"
completed: "2026-10-26"
tags: ["frontend", "redesign", "research-journal", "editorial-lanna", "shadcn", "motion", "wcag"]
---

# 📋 Plan: Redesign /research/journal Module

> [!important] Architecture & Design Goal
> Redesign `/research/journal` (วารสารสังคมศาสตร์วิชาการ - Journal of Social Academic) ตามข้อตกลงผ่าน Socratic Gate:
> 1. **สไตล์ Editorial Academic Hub:** มุ่งเน้นความน่าเชื่อถือทางวิชาการระดับสากลและความร่วมสมัยของอัตลักษณ์ล้านนา (Editorial Lanna Modernist)
> 2. **Current Issue Showcase:** การ์ดเล่มวารสารฉบับปัจจุบัน (Volume/Issue, Month/Year, ปกเล่มจำลอง, บทความเด่นประจำฉบับพร้อมชื่อผู้วิจัยและลิงก์อ่าน/ดาวน์โหลด)
> 3. **Interactive Tabs & Clear Navigation:** แยกสัดส่วนเนื้อหาให้ชัดเจน ไม่รกรุงรัง (Visual Subtraction) ได้แก่:
>    - **ภาพรวมและขอบเขต (Aims & Scope)**
>    - **ฉบับปัจจุบันและคลังบทความ (Current Issue & Articles)**
>    - **กระบวนการและคำแนะนำสำหรับผู้แต่ง (Submission Guidelines & Peer Review)**
>    - **กองบรรณาธิการและผู้ทรงคุณวุฒิ (Editorial Board)**
>    - **จริยธรรมและการอ้างอิง (Ethics & Indexing)**

---

## 🎨 Design System & Triad Alignment

1. **`oil-ui` (Design Thinking & Visual Subtraction):**
   - **Design North Star:** วารสารวิชาการระดับชาติที่เปิดกว้าง น่าเชื่อถือ และเข้าถึงง่ายสำหรับนักวิจัย
   - **Visual Subtraction:** ลดการสกรอลล์ยาวแบบเดิมด้วย Interactive Tabs และ Metric Pill Badges
   - **Strict Bans:** ปฏิบัติตาม Purple Ban (ไม่ใช้พื้นหลังสีม่วงฟุ้ง) และ Template Ban (ไม่ใช้ Bento Grid ซ้ำซาก)
2. **`shadcn/ui` (Component Primitives):**
   - ใช้งาน `@/components/ui/tabs` สำหรับสลับหมวดหมู่
   - ใช้งาน `@/components/ui/badge` และ `@/components/ui/button`
   - ใช้งาน `@/components/ui/card` สำหรับการ์ดบทความและข้อมูลเล่ม
3. **`motion` (Micro-interactions):**
   - Staggered entrance สำหรับ Hero elements และ Tab transitions
   - รองรับ `prefers-reduced-motion`

---

## 🏗️ Architecture & File Breakdown

- `frontend/app/research/journal/page.tsx`: Server Component เก็บ Metadata, JSON-LD Schema (`Periodical`), OpenGraph และส่ง Props/Static Data
- `frontend/app/research/journal/JournalClient.tsx`: Client Component บรรจุ Interactive Tabs, Current Issue Showcase, Editorial Board Grid, Submission Stepper และ Copy Citation Action

---

## 📋 Task Breakdown

- [x] **Phase 1: Structure & Data Definition**
  - กำหนดข้อมูลฉบับล่าสุด (Current Issue mock data พร้อม metadata สมบูรณ์)
  - กำหนดรายนามกองบรรณาธิการ (Editorial Board แบ่งตามตำแหน่ง: บรรณาธิการ, ผู้ช่วยบรรณาธิการ, กองบรรณาธิการผู้ทรงคุณวุฒิ)
  - กำหนดขั้นตอน Peer Review 4 ขั้นตอนและเอกสารดาวน์โหลด Template
- [x] **Phase 2: Client Component Implementation (`JournalClient.tsx`)**
  - สร้าง Hero Section สไตล์ Editorial Lanna Modernist พร้อม Journal Metrics Bar
  - สร้าง Current Issue Spotlight พร้อม Table of Contents บทความเด่น
  - สร้าง Tabbed Content Navigation (Scope, Author Guide, Peer Review, Editorial Board, Ethics)
  - ปรับแต่ง Accordion/Card สำหรับคำแนะนำผู้แต่ง และปุ่ม CTA สู่ ThaiJO
- [x] **Phase 3: Server Component Updates (`page.tsx`)**
  - ผสาน Rich Schema.org (JSON-LD Periodical & Academic Journal)
  - เชื่อมโยง Breadcrumb และ Canonical URLs
- [x] **Phase 4: Quality & Verification**
  - ดึงข้อมูลทางการจริง 100% จากหน้าเว็บ ThaiJO (`so04.tci-thaijo.org/index.php/social_crru/about/editorialTeam`) ได้รายนาม 19 ท่าน พร้อมอีเมลทางการ
  - พัฒนาระบบ Full CRUD สำหรับกองบรรณาธิการใน NestJS Backend (`JournalModule`, `JournalController`, `JournalService`, DTOs)
  - พัฒนาระบบ Dashboard จัดการกองบรรณาธิการใน Frontend Admin (`/admin/journal`) พร้อม Modal Create/Edit, Delete Confirmation, ตัวกรองค้นหา และปุ่มซิงค์ ThaiJO
  - เชื่อมโยง Public Frontend (`/research/journal`) ให้ดึงข้อมูลแบบ Dynamic Real-time จาก API และมี Fallback เป็นข้อมูลทางการจริง
  - ปรับปรุงการ์ดฉบับล่าสุดเป็น Direct Gateway Link ไปยัง ThaiJO โดยตรง (ตัด Mock article list ออก)
  - ทดสอบการทำงานของทั้ง Frontend และ Backend ผ่านการ Compile และ Lint 100% (0 errors, 0 warnings)
