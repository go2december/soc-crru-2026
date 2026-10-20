---
title: "Plan: Redesign CSS & UX/UI with Tailwind v4, shadcn/ui, Motion, GSAP, and Lucide React"
type: "task-plan"
status: "completed"
tags: ["redesign", "ux-ui", "tailwind-v4", "shadcn", "motion", "gsap", "lucide-react"]
aliases: ["CSS & UX/UI Redesign Plan"]
---

# 🚀 Plan: Redesign CSS & UX/UI (Modern Stack)

> [!important] เป้าหมายโครงการ
> ปรับระบบ CSS และ UX/UI สู่ **Editorial Lanna Modernist** โดยปลด DaisyUI แบบ Clean Cut ย้ายสู่ Pure Tailwind CSS v4, shadcn/ui, Motion, GSAP ScrollTrigger และ Lucide React สำหรับหน้าแรก (Landing Page) และ Base Components ทั้งระบบ

---

## 📋 แผนการดำเนินงาน (Task Checklist)

### 📦 Phase 1: Core Foundation & Dependency Transition
- [x] 1.1 ถอนการติดตั้ง `daisyui` ออกจาก `frontend/package.json`
- [x] 1.2 ติดตั้ง `motion` (Motion for React), `gsap`, และ `@gsap/react`
- [x] 1.3 ปรับแต่ง `frontend/app/globals.css` โดยล้าง DaisyUI config และเพิ่ม `@theme inline` Tokens ตาม [[02_Architecture/design|Design Guide]]

### 🧩 Phase 2: shadcn/ui Base Components & Lucide React
- [x] 2.1 ปรับปรุง/สร้าง Base UI: `button.tsx`, `badge.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`
- [x] 2.2 วางโครงสร้าง Styling คมชัดด้วย `clsx` + `tailwind-merge` + `cva`
- [x] 2.3 กำหนดมาตรฐาน Lucide React Stroke `1.5 - 1.75`

### 🧭 Phase 3: Global Shell Navigation & Layout
- [x] 3.1 รีแฟกเตอร์ `Navbar.tsx` ลบคลาส DaisyUI เปลี่ยนมาใช้ shadcn Button + Mobile Sheet + Motion
- [x] 3.2 รีแฟกเตอร์ `Footer.tsx` ปรับสู่ Typography และ Spacing สไตล์ Editorial Lanna

### 🌟 Phase 4: Homepage Showcase (Hero & Curriculum Explorer)
- [x] 4.1 สร้าง `Hero.tsx` โฉมใหม่: Staggered Typographic Reveal + Layered Depth
- [x] 4.2 สร้าง `CurriculumDeck.tsx` (GSAP ScrollTrigger Pinned Deck & Motion Hover Cards)
- [x] 4.3 เชื่อมต่อหน้า `frontend/app/page.tsx` เข้ากับ Showcase ใหม่
- [x] 4.4 รองรับ `prefers-reduced-motion` เพื่อ Accessibility (WCAG 2.1 AA)

### 🧪 Phase 5: Verification & Quality Audit
- [x] 5.1 ตรวจสอบ TypeScript & Build (`npm run build` ใน `frontend`) สำเร็จ 83/83 routes
- [x] 5.2 ทดสอบการทำงานของ ScrollTrigger และความเข้ากันได้กับ React 19 เรียบร้อย

---

## 🔗 เอกสารเชื่อมโยง
- [[00_Dashboard|สารบัญหลัก (MOC)]]
- [[02_Architecture/design|สถาปัตยกรรมชุดสีและดีไซน์ (Design System)]]
