---
title: "Plan: Redesign MOU & Partnerships Page (/research/mou)"
task: "redesign-research-mou"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-11-17"
completed: "2026-11-17"
---

# 🤝 แผนงานปรับปรุงและออกแบบหน้าเครือข่ายความร่วมมือและ MOU (/research/mou)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Archival Accord & Diplomatic Rigor (Editorial Lanna Modernist, Hairline 0-2px, Midnight Slate `#0B132B`, Terracotta `#C2410C`, Saffron Gold, ไม่มี Purple/Indigo Clichés)  
**เป้าหมายการใช้งาน (Dual Mode Directory):** คลังบันทึกข้อตกลงความร่วมมือทางวิชาการและพัฒนาท้องถิ่น (ทั้งแบบ Visual Grid และ Academic Ledger Table) + Quick View Modal ดูสาระสำคัญและดาวน์โหลดเอกสาร + กล่องสถิติสอดคล้องกับตัวชี้วัดประกันคุณภาพและการจัดอันดับ Webometrics

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *Civic Diplomatic Rigor & Strategic Academic Alliances*
- **Visual Subtraction:** ลบเงาหนาและขอบมนแบบ SaaS ทั่วไป ใช้โครงสร้าง Hairline คมชัด 1px ในโทน Slate & Parchment Stone
- **Topological Layout:** Hero Header พร้อม Quick Stats 4 มิติ (MOU ทั้งหมด, ภาครัฐและ อปท., ภาคประชาสังคมและชุมชน, สถาบันการศึกษาและนานาชาติ) + Flagship Alliance Highlight + Dual Mode Directory (Grid / Ledger)

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงประเภทภาคีเครือข่าย, สถานะมีผลบังคับใช้ (Active)
  - `Button`: สลับหมวดหมู่, ล้างตัวกรอง, สลับโหมด Grid/Ledger, ดาวน์โหลดเอกสาร
  - `Dialog`: Quick View Modal สำหรับอ่านสาระสำคัญ (Scope of Cooperation), ระยะเวลา, ผู้ลงนาม, ลิงก์หน่วยงาน และดาวน์โหลดเอกสารฉบับเต็ม
  - `Input`: ช่องค้นหาชื่อบันทึกข้อตกลงหรือหน่วยงานแบบ Real-time

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion, useReducedMotion } from "motion/react"`):
  - Staggered Entrance Animations เมื่อโหลดหน้าจอ
  - Spring hover & focus micro-interactions
  - รองรับ `prefers-reduced-motion` ตามมาตรฐานการเข้าถึง WCAG AA

---

## 🏛️ โครงสร้างสถาปัตยกรรมโมดูล /research/mou

```
frontend/app/research/mou/
├── page.tsx                           # Server Component (SSR/ISR revalidate=60, JsonLd Schema, SEO)
├── MouClient.tsx                      # Client Shell ประสานงาน State, Search, Filter & Quick View
├── components/
│   ├── MouHero.tsx                    # Editorial Hero Header + Quick Stats Ribbon 4 มิติ
│   ├── MouFlagship.tsx                # โครงการความร่วมมือเด่นเชิงยุทธศาสตร์ (Flagship Strategic Accord)
│   ├── MouFilterBar.tsx               # แถบค้นหา, แท็บหมวดหมู่ภาคี, ตัวกรองสถานะ, ปุ่มสลับ Grid/Ledger
│   ├── MouGrid.tsx                    # การ์ดภาคีเครือข่าย และมุมมอง Ledger Table คมชัดระดับสิ่งพิมพ์
│   ├── MouQuickView.tsx               # Dialog แสดงรายละเอียดข้อตกลง ขอบเขตความร่วมมือ และเอกสาร
│   └── MouPartnershipCTA.tsx          # แบนเนอร์เชิญชวนเสนอความร่วมมือทางวิชาการ (Academic Partnership Inquiry)
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** ตรวจสอบและอัปเดตโทนสี Badge ใน `frontend/lib/mous.ts` (ตัด Purple Ban ออก เปลี่ยนประเภท ACADEMIC เป็น Slate/Teal/Lanna Indigo ที่ถูกต้องตามข้อกำหนด)
- [x] **Step 2:** สร้าง `MouHero.tsx` พร้อม Breadcrumb, Typography และ Quick Stats Ribbon
- [x] **Step 3:** สร้าง `MouFlagship.tsx` แสดงผลบันทึกข้อตกลงเชิงยุทธศาสตร์เด่น
- [x] **Step 4:** สร้าง `MouFilterBar.tsx` รองรับการค้นหา, กรองประเภทภาคี และสลับโหมด Grid/Ledger
- [x] **Step 5:** สร้าง `MouQuickView.tsx` ด้วย shadcn Dialog
- [x] **Step 6:** สร้าง `MouGrid.tsx` รองรับทั้ง Grid View และ Ledger Table View พร้อม Spring Animation
- [x] **Step 7:** สร้าง `MouPartnershipCTA.tsx` ช่องทางติดต่อประสานความร่วมมือใหม่
- [x] **Step 8:** ปรับปรุง `MouClient.tsx` และ `page.tsx`
- [x] **Step 9:** ทดสอบ TypeScript compilation และ ESLint
