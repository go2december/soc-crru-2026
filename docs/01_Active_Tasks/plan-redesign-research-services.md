---
title: "Plan: Redesign Academic Services Page (/research/services)"
task: "redesign-research-services"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-10-26"
completed: "2026-10-26"
---

# 🌾 แผนงานปรับปรุงและออกแบบหน้าบริการวิชาการแก่สังคม (/research/services)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Editorial Lanna Modernist & Archival Rigor (คมชัดระดับสิ่งพิมพ์วิชาการ, โทนกระดาษสโตน, Hairline 0-2px, Terracotta/Scholar Gold, ไม่มี Purple/Indigo AI Clichés)  
**เป้าหมายการใช้งาน (Dual Focus):** คลังโครงการบริการวิชาการเพื่อชุมชนภาคเหนือ + ช่องทางยื่นคำขอรับบริการวิชาการ (Request CTA) แบบไร้รอยต่อ

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *Civic Engagement & Living Knowledge for Northern Communities*
- **Visual Subtraction:** ขจัดขอบกรอบซ้อนทับ (No nested border traps), ขจัดพื้นหลังไล่ระดับสีพร่ำเพรื่อ (No mesh/aurora clichés), และจัดลำดับสายตาด้วย Typographic Contrast และพื้นที่ว่าง (Rhythm & White space)
- **Topological Layout:** Asymmetric Editorial Layout — แบ่งสัดส่วนชัดเจนระหว่าง Flagship Initiatives (โครงการขับเคลื่อนยุทธศาสตร์เด่น) กับ Interactive Search & Filter Directory

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงสถานะการดำเนินงาน, หมวดหมู่บริการ, และ SDG Target Tags
  - `Button`: ปุ่มสลับมุมมอง, ดาวน์โหลด, และ CTA ยื่นคำขอ
  - `Dialog`: Quick View Modal / Details Drawer สำหรับพรีวิวโครงการโดยไม่ต้องโหลดหน้าใหม่ทั้งหมด
  - `Input`: ช่องค้นหาโครงการแบบเรียลไทม์

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion } from "motion/react"`):
  - Staggered Entrance Animations: แต่ละ Section และการ์ดโครงการจะค่อยๆ เผยขึ้นมาตามลำดับจังหวะ
  - Micro-interactions: ปรับการตอบสนองเมื่อ Hover และ Active ให้มีความรู้สึกทางกายภาพ (Physical feedback)
  - รองรับการปิดเอฟเฟกต์การเคลื่อนไหวตามคำสั่งของระบบปฏิบัติการ (`prefers-reduced-motion`)

---

## 🏛️ โครงสร้างสถาปัตยกรรมหน้ารูปแบบใหม่

```
frontend/app/research/services/
├── page.tsx                           # Server Component (SSR/ISR, SEO, Structured Breadcrumb & Metadata)
├── AcademicServicesClient.tsx          # Client Shell ประสานงาน State & Layout ทั้งหมด
├── components/
│   ├── AcademicServicesHero.tsx       # Editorial Hero Section + Quick Stats Bar (โครงการ, ชุมชน, SDGs)
│   ├── AcademicServicesFlagship.tsx   # Asymmetric Feature Highlights (โครงการเด่นพันธกิจสัมพันธ์)
│   ├── AcademicServicesFilterBar.tsx  # แถบค้นหา, แท็บประเภทบริการ, ตัวกรอง SDG และสถานะ
│   ├── AcademicServicesGrid.tsx       # กริดการ์ดโครงการแบบ Editorial พร้อม Quick View Dialog
│   ├── AcademicServicesQuickView.tsx  # Dialog พรีวิวรายละเอียดโครงการ, สมาชิกทีม และเอกสาร
│   └── AcademicServicesRequestCTA.tsx # แบนเนอร์เชิญชวนยื่นขอรับบริการวิชาการสำหรับองค์กรภายนอก
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** ตรวจสอบและเตรียมโครงสร้างไฟล์และ Component ย่อยใน `frontend/app/research/services/components/`
- [x] **Step 2:** พัฒนา `AcademicServicesHero.tsx` พร้อมกล่องสรุปสถิติบิ๊กนัมเบอร์ (Total Projects, Communities Served, Active SDGs)
- [x] **Step 3:** พัฒนา `AcademicServicesFlagship.tsx` แสดงผลโครงการเด่นแบบ Asymmetric Editorial Card
- [x] **Step 4:** พัฒนา `AcademicServicesFilterBar.tsx` และ `AcademicServicesQuickView.tsx` ด้วย shadcn Dialog
- [x] **Step 5:** พัฒนา `AcademicServicesGrid.tsx` และ `AcademicServicesRequestCTA.tsx` พร้อม `motion/react`
- [x] **Step 6:** รวมและปรับแต่ง `AcademicServicesClient.tsx` และ `page.tsx`
- [x] **Step 7:** ทดสอบ Type-check (`tsc --noEmit`), Linting (`next lint`), และ Responsive design
