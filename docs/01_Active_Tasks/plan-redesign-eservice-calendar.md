---
title: "Plan: Redesign Academic & Event Calendar (/eservice/calendar)"
task: "redesign-eservice-calendar"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-11-17"
completed: "2026-11-17"
---

# 📅 แผนงานปรับปรุงและออกแบบหน้าปฏิทินวิชาการและกิจกรรม (/eservice/calendar)

**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (`oil-ui` Visual Subtraction + `shadcn/ui` Primitives + `motion` Micro-interactions)  
**อัตลักษณ์และสไตล์:** Editorial Lanna Modernist & Archival Precision (Midnight Slate `#0B132B`, Terracotta Flame `#C2410C`, Saffron Gold, Hairline Borders 1px คมชัด, ขจัดคลาส DaisyUI เก่า `card`, `bg-base-100`, `btn-primary` และสีม่วง Purple Clichés)  
**โครงสร้างหลัก (Dual Mode Interactive Calendar):**
1. **Academic Calendar Hero & Timeline Ribbon:** แถบสถิติกำหนดการ 4 มิติ (กิจกรรมเดือนนี้, วันสอบ/วัดผล, อบรม/สัมมนา, กำหนดการทะเบียน)
2. **Official CRRU Academic Schedule Banner:** แบนเนอร์ปฏิทินการศึกษาฉบับทางการ สำนักส่งเสริมวิชาการและงานทะเบียน (REG)
3. **Interactive Control Bar:** ตัวเลือกเดือน/ปี พ.ศ., ปุ่มวันนี้, ค้นหากำหนดการเรียลไทม์, รีเฟรชข้อมูล ICS สด, และสลับโหมด Grid / Agenda
4. **Dual Mode Presentation:**
   - **Monthly Grid View:** ตารางช่องปฏิทินรายเดือน รองรับการคลิกดูรายละเอียดรายวันและการแสดงผลชิปสีตามประเภทกิจกรรม
   - **Agenda Timeline View:** รายการกำหนดการเรียงลำดับตามวัน พร้อมแถบริบบิ้นวันที่แบบ Editorial ชัดเจน
5. **Event Details Dialog:** โมดอลพรีวิวสาระสำคัญของกิจกรรม, สถานที่, เวลา, และปุ่มบันทึกลง Google Calendar

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad

### 1. `oil-ui` (Design North Star & Visual Subtraction)
- **Design North Star:** *Institutional Temporal Clarity & Academic Agenda Rigor*
- **Visual Subtraction:** ขจัดคลาส DaisyUI แบบเก่า (`card`, `bg-base-100`, `btn`, `badge-outline`) เปลี่ยนเป็น Hairline Cards 1px บนพื้นกระดาษ Stone/Parchment คมชัดระดับสิ่งพิมพ์
- **Topological Layout:** Hero Header พร้อม Quick Stats Ribbon 4 มิติ + Official Banner + Control Bar + Dual View (Grid / Agenda) + Event Dialog

### 2. `shadcn/ui` (Component Primitives)
- เรียกใช้ Primitive มาตรฐานจาก `@/components/ui/*`:
  - `Badge`: แสดงประเภทกิจกรรม (การสอบ, การประชุม, อบรม/โครงการ, วันสำคัญ)
  - `Button`: สลับเดือน, วันนี้, สลับโหมด Grid/Agenda, รีเฟรช, ดาวน์โหลด PDF
  - `Dialog`: Quick View Modal สำหรับดูกำหนดการโดยละเอียด
  - `Input`: ค้นหากิจกรรมแบบ Real-time

### 3. `motion` (Micro-interactions & Physics)
- ใช้ `motion/react` (`import { motion, useReducedMotion } from "motion/react"`):
  - Staggered Entrance Animations
  - Spring hover & focus feedback
  - รองรับ `prefers-reduced-motion` ตามมาตรฐานการเข้าถึง WCAG AA

---

## 🏛️ โครงสร้างสถาปัตยกรรมโมดูล /eservice/calendar

```
frontend/app/eservice/calendar/
├── page.tsx                           # Server Component (ISR revalidate=1800, iCal fetch, JsonLd Schema, SEO)
├── CalendarClient.tsx                 # Client Shell ประสานงาน State, Month Navigation, Dual Mode & Dialog
├── components/
│   ├── CalendarHero.tsx               # Editorial Hero Header + Quick Stats Ribbon
│   ├── CalendarOfficialBanner.tsx     # แบนเนอร์ปฏิทินการศึกษาฉบับทางการ REG CRRU (PDF Download)
│   ├── CalendarControlBar.tsx         # แถบควบคุมเดือน, สลับ Grid/Agenda, ช่องค้นหา, ปุ่มซิงค์สด
│   ├── CalendarMonthGrid.tsx          # ตารางปฏิทินรายเดือนแบบ Interactive Grid พร้อมชิปสีกิจกรรม
│   ├── CalendarAgendaList.tsx         # มุมมองกำหนดการเรียงตามวัน (Agenda View)
│   └── CalendarEventDialog.tsx        # Dialog แสดงรายละเอียดกิจกรรม สถานที่ เวลา และปุ่มเพิ่มลง GCal
```

---

## 📋 Implementation Checklist

- [x] **Step 1:** สร้าง `CalendarHero.tsx` พร้อม Breadcrumb, Typography และ Quick Stats Ribbon
- [x] **Step 2:** สร้าง `CalendarOfficialBanner.tsx` สำหรับดาวน์โหลดปฏิทินการศึกษาทางการ มรภ.เชียงราย
- [x] **Step 3:** สร้าง `CalendarControlBar.tsx` แถบควบคุมเดือน/ปี พ.ศ., ค้นหา, สลับมุมมอง และรีเฟรช
- [x] **Step 4:** สร้าง `CalendarMonthGrid.tsx` และ `CalendarAgendaList.tsx`
- [x] **Step 5:** สร้าง `CalendarEventDialog.tsx` ด้วย shadcn Dialog
- [x] **Step 6:** รวมและปรับปรุง `CalendarClient.tsx` และ `page.tsx`
- [x] **Step 7:** ทดสอบ Type-check (`tsc --noEmit`), Linting (`eslint`) และ Responsive design
