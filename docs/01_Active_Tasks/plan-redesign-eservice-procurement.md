---
title: "Plan: Redesign Procurement & Transparency Portal (/eservice/procurement)"
task: "redesign-eservice-procurement"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-11-17"
completed: "2026-11-17"
---

# 📋 แผนงานปรับปรุงและออกแบบหน้าประกาศจัดซื้อจัดจ้างและพัสดุ (/eservice/procurement)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Editorial Lanna Modernist & Archival Integrity (Midnight Slate `#0B132B`, Terracotta `#C2410C`, Saffron Gold, Sharp 0-2px borders, ขจัดคลาส DaisyUI เก่า `btn/input-bordered` และสีม่วง Purple Clichés)  
**โครงสร้างหลัก (Dual Mode Presentation):**
1. **Fiscal Hero & Transparency Ribbon:** แถบสถิติงบประมาณ 4 มิติ (รายการทั้งหมด, งบประมาณรวม, จัดซื้อสำเร็จ, วิธีการจัดซื้อยอดนิยม)
2. **Instant Search & Filter Bar:** ค้นหาชื่อโครงการ, ตัวกรองปีงบประมาณ, วิธีการจัดซื้อ, หมวดหมู่งาน, สถานะ พร้อมปุ่มสลับมุมมอง Grid / Ledger Table
3. **Dual View Presentation:** 
   - **Ledger Table View:** ตารางสารบัญราชการคมชัด แสดงลำดับ, ปีงบ, วิธีการ, วงเงิน, คู่สัญญา, สถานะ และเอกสารแนบ
   - **Visual Cards View:** การ์ดรายละเอียดโครงการครบถ้วน พร้อมแท็กหมวดหมู่และลิงก์ดาวน์โหลด
4. **Transparency & Regulatory Guidance:** พระราชบัญญัติการจัดซื้อจัดจ้าง พ.ศ. 2560 และช่องทางสอบถามงานพัสดุคณะสังคมศาสตร์ (`053-702870 ต่อ 1211`, `social@crru.ac.th`)

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *Institutional Fiscal Accountability & Archival Rigor*
- **Visual Subtraction:** ขจัดคลาส DaisyUI แบบเก่า (`btn`, `input-bordered`, `select-bordered`) เปลี่ยนเป็น Hairline Borders 1px คมชัดบนพื้น Stone/Parchment
- **Topological Layout:** Hero Header พร้อม Quick Stats Ribbon 4 มิติ + Instant Filter Bar + Dual View (Ledger Table & Visual Cards) + Procurement Regulatory Notice

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงปีงบประมาณ, หมวดหมู่งาน, วิธีการจัดซื้อ และสถานะโครงการ
  - `Button`: ค้นหา, สลับมุมมอง Grid/Ledger, ดาวน์โหลดเอกสารแนบ
  - `Input`: ช่องค้นหาโครงการจัดซื้อจัดจ้างแบบ Real-time

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion, useReducedMotion } from "motion/react"`):
  - Staggered Entrance Animations
  - Spring hover & focus feedback
  - รองรับ `prefers-reduced-motion` ตามมาตรฐานการเข้าถึง WCAG AA

---

## 🏛️ โครงสร้างสถาปัตยกรรมโมดูล /eservice/procurement

```
frontend/app/eservice/procurement/
├── page.tsx                           # Server Component (SSR data fetching, searchParams handling, Metadata, SEO)
├── ProcurementClient.tsx              # Client Shell ประสานงาน ViewMode (Grid/Ledger), Quick Filter & Stats
├── components/
│   ├── ProcurementHero.tsx            # Editorial Hero Header + Quick Stats Ribbon
│   ├── ProcurementFilterBar.tsx       # แถบค้นหา, ตัวกรองปีงบ, วิธีจัดซื้อ, หมวดหมู่, สถานะ, สลับ Grid/Ledger
│   ├── ProcurementLedgerTable.tsx     # ตารางแสดงข้อมูลจัดซื้อจัดจ้างแบบ Ledger Table คมชัดระดับสิ่งพิมพ์
│   ├── ProcurementCardsGrid.tsx       # กริดการ์ดโครงการจัดซื้อจัดจ้างพร้อมเอกสารแนบ
│   └── ProcurementNoticeSection.tsx   # ข้อความกำกับความโปร่งใส พ.ร.บ. จัดซื้อจัดจ้าง และช่องทางติดต่อพัสดุ
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** ปรับปรุงสถานะสีใน `frontend/lib/procurement.ts` ให้ไม่มี Purple Ban และเป็นไปตามโทนมาตรฐาน
- [x] **Step 2:** สร้าง `ProcurementHero.tsx` พร้อม Breadcrumb, Typography และ Quick Stats Ribbon
- [x] **Step 3:** สร้าง `ProcurementFilterBar.tsx` ช่องค้นหาและตัวกรองตามปีงบประมาณ/หมวดหมู่
- [x] **Step 4:** สร้าง `ProcurementLedgerTable.tsx` โหมดตารางสารบัญตรวจสอบงบประมาณและผลจัดซื้อ
- [x] **Step 5:** สร้าง `ProcurementCardsGrid.tsx` โหมดการ์ดแสดงรายละเอียดและเอกสารแนบ PDF
- [x] **Step 6:** สร้าง `ProcurementNoticeSection.tsx` ข้อกำหนดความโปร่งใสและเบอร์ติดต่อพัสดุคณะ
- [x] **Step 7:** รวมและปรับแต่ง `ProcurementClient.tsx` และ `page.tsx`
- [x] **Step 8:** ทดสอบ Type-check (`tsc --noEmit`), Linting (`eslint`) และ Responsive design
