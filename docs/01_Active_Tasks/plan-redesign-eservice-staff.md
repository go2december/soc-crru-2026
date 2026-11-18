---
title: "Plan: Redesign Staff E-Services Portal (/eservice/staff)"
task: "redesign-eservice-staff"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-11-17"
completed: "2026-11-17"
---

# 👔 แผนงานปรับปรุงและออกแบบหน้าศูนย์บริการดิจิทัลสำหรับบุคลากร (/eservice/staff)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Editorial Lanna Modernist & Archival Rigor (Midnight Slate `#0B132B`, Terracotta Flame `#C2410C`, Saffron Gold, Hairline Borders 1px คมชัด, ปราศจากสีนีออน/บลูร์ AI คลีเช่)  
**ข้อมูลการติดต่อที่ถูกต้อง:**
- สำนักงานคณบดี/งานสารบรรณ คณะสังคมศาสตร์: `053-702870 ต่อ 1211, 1214`
- อีเมลทางการ: `social@crru.ac.th`
- กองบริหารงานบุคคล มรภ.เชียงราย: `053-776000 ต่อ 1100, 1105`

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *Diplomatic Operational Rigor & Faculty Governance*
- **Visual Subtraction:** ลบเงาหนาและขอบมนแบบ 2024 ออก เปลี่ยนเป็น Hairline Card 1px บนพื้นกระดาษ Stone/Parchment คมชัดระดับสิ่งพิมพ์วิชาการ
- **Topological Layout:** Hero Header พร้อม Quick Stats Ribbon 4 มิติ (ระบบบริการบุคลากรทั้งหมด, งานบุคคล/สารบรรณ, การสอน/เกรด, แบบฟอร์มราชการ) + Instant Category Tabs + Central Staff Systems Grid + Faculty Forms Preview + Administrative Support Helpdesk

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงหมวดหมู่งาน, ป้ายกำกับทางการ (e.g., "สารบรรณองค์กร", "ประเมินผล TOR", "สลิปเงินเดือน")
  - `Button`: สลับหมวดหมู่, ล้างตัวกรอง, ดาวน์โหลดเอกสารคำร้อง
  - `Input`: ช่องค้นหาระบบบริการและแบบฟอร์มราชการแบบ Real-time

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion, useReducedMotion } from "motion/react"`):
  - Staggered Entrance Animations เมื่อเลื่อนหน้าจอ
  - Spring hover & focus feedback
  - รองรับ `prefers-reduced-motion` ตามมาตรฐานการเข้าถึง WCAG AA

---

## 🏛️ โครงสร้างสถาปัตยกรรมโมดูล /eservice/staff

```
frontend/app/eservice/staff/
├── page.tsx                           # Page Wrapper (Metadata, Server/Client boundary)
├── StaffClient.tsx                    # Client Shell ประสานงาน State, Live Search, Filter & Counts
├── components/
│   ├── StaffHero.tsx                  # Editorial Hero Header + Search Bar + Quick Stats Ribbon
│   ├── StaffCategoryTabs.tsx          # แถบแท็บหมวดหมู่แบบ Instant Filter พร้อมตัวนับ
│   ├── StaffServicesGrid.tsx          # กริดระบบสารสนเทศกลางสำหรับบุคลากร (CRRU Staff Hub)
│   ├── StaffFormsPreview.tsx          # คลังแบบฟอร์มคำร้องราชการที่ใช้บ่อย 6 รายการ + ลิงก์สู่ /forms
│   └── StaffHelpdeskSection.tsx       # แนะนำการเข้าสู่ระบบ e-Office/REG, กองบริหารงานบุคคล และสารบรรณคณะ
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** สร้าง `StaffHero.tsx` พร้อม Breadcrumb, Live Search และ Quick Stats Ribbon
- [x] **Step 2:** สร้าง `StaffCategoryTabs.tsx` สำหรับกรองหมวดหมู่บริการบุคลากรแบบเรียลไทม์
- [x] **Step 3:** สร้าง `StaffServicesGrid.tsx` พร้อมระบบการ์ด Editorial Lanna Modernist และ Motion
- [x] **Step 4:** สร้าง `StaffFormsPreview.tsx` แสดงผลแบบฟอร์มคำร้องราชการที่จำเป็นและปุ่มดาวน์โหลด
- [x] **Step 5:** สร้าง `StaffHelpdeskSection.tsx` ข้อมูลการล็อกอินและเบอร์ติดต่อสารบรรณคณะที่ถูกต้อง (`053-702870 ต่อ 1211, 1214`)
- [x] **Step 6:** รวมและปรับแต่ง `StaffClient.tsx` และ `page.tsx`
- [x] **Step 7:** ทดสอบ Type-check (`tsc --noEmit`), Linting (`eslint`) และ Responsive design
