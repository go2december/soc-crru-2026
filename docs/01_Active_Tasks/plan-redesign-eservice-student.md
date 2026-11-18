---
title: "Plan: Redesign Student E-Services Portal (/eservice/student)"
task: "redesign-eservice-student"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-11-17"
completed: "2026-11-17"
---

# 🎓 แผนงานปรับปรุงและออกแบบหน้าศูนย์บริการดิจิทัลสำหรับนักศึกษา (/eservice/student)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Editorial Lanna Modernist & Archival Precision (Midnight Slate `#0B132B`, Terracotta `#C2410C`, Saffron Gold, Sharp 0-2px borders, ขจัดเงาหนาและบลูร์ AI คลีเช่)  
**โครงสร้างหลัก (Dual-Pillar Architecture):**
1. **CRRU Central E-Services:** ศูนย์รวมระบบสารสนเทศส่วนกลางของมหาวิทยาลัย (REG, ORASIS, LMS, WiFi, ทุนการศึกษา/กยศ., ห้องสมุด)
2. **Faculty Academic Forms & Petitions:** คลังแบบฟอร์มคำร้องและเอกสารการศึกษาของคณะสังคมศาสตร์
3. **Student Helpdesk & Authentication Guide:** คำแนะนำการเข้าใช้งานบัญชีนักศึกษา และช่องทางช่วยเหลือด่วน

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *High-Efficiency Academic Workflow & Institutional Prestige*
- **Visual Subtraction:** ลบขอบมนหนาเตอะ (Safe boredom 8-16px) และเอฟเฟกต์สีรุ้ง/นีออน ปรับใช้ Hairline Borders 1px คมชัด ผสานสเกลตัวพิมพ์ Prompt ที่มี Contrast สูง
- **Topological Layout:** Hero Header พร้อม Quick Stats Ribbon 4 มิติ (ระบบบริการทั้งหมด, ด้านการเรียน/ทะเบียน, สวัสดิการ/กยศ., แบบฟอร์มคำร้อง) + Instant Filter Bar + Central Hub Grid + Faculty Forms Grid + Helpdesk Info

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงประเภทหมวดหมู่บริการ, ป้ายกำกับ (e.g., "ทางการ", "สำคัญ", "REG")
  - `Button`: สลับหมวดหมู่, ล้างตัวกรอง, ดาวน์โหลดเอกสารคำร้อง
  - `Input`: ช่องค้นหาบริการและแบบฟอร์มแบบ Real-time

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion, useReducedMotion } from "motion/react"`):
  - Staggered Entrance Animations เมื่อเลื่อนดูส่วนต่างๆ
  - Spring hover & active feedback สัมผัสนุ่มนวลทางกายภาพ
  - รองรับ `prefers-reduced-motion` ตามมาตรฐานการเข้าถึง WCAG AA

---

## 🏛️ โครงสร้างสถาปัตยกรรมโมดูล /eservice/student

```
frontend/app/eservice/student/
├── page.tsx                           # Page Wrapper (Metadata, Server/Client boundary)
├── StudentClient.tsx                  # Client Shell ประสานงาน State, Live Search, Filter & Counts
├── components/
│   ├── StudentHero.tsx                # Editorial Hero Section + Search Input + Quick Stats Ribbon
│   ├── StudentCategoryTabs.tsx        # แถบแท็บหมวดหมู่แบบ Instant Filter พร้อมตัวนับ
│   ├── StudentServicesGrid.tsx        # กริดการ์ดระบบบริการส่วนกลาง มรภ.เชียงราย (CRRU Digital Hub)
│   ├── StudentFormsPreview.tsx        # คลังแบบฟอร์มคำร้องที่ใช้บ่อย 6 อันดับแรก + ลิงก์สู่ /forms
│   └── StudentHelpdeskSection.tsx     # แนะนำการเข้าสู่ระบบ, ลืมรหัสผ่าน (ARITC) และติดต่อกิจการนักศึกษา
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** สร้าง `StudentHero.tsx` พร้อม Breadcrumb, Live Search และ Quick Stats Ribbon
- [x] **Step 2:** สร้าง `StudentCategoryTabs.tsx` สำหรับกรองหมวดหมู่บริการแบบเรียลไทม์
- [x] **Step 3:** สร้าง `StudentServicesGrid.tsx` พร้อมระบบการ์ด Editorial Lanna Modernist และ Motion
- [x] **Step 4:** สร้าง `StudentFormsPreview.tsx` แสดงผลแบบฟอร์มคำร้องที่จำเป็นและปุ่มดาวน์โหลด
- [x] **Step 5:** สร้าง `StudentHelpdeskSection.tsx` ข้อมูลการล็อกอินและจุดช่วยเหลือที่ถูกต้อง
- [x] **Step 6:** รวมและปรับแต่ง `StudentClient.tsx` และ `page.tsx`
- [x] **Step 7:** ทดสอบ Type-check (`tsc --noEmit`), Linting (`eslint`) และ Responsive design
