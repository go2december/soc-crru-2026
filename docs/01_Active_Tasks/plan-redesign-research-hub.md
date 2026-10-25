---
title: "Plan: Redesign Research Hub Landing Page (Editorial Academic Modernist)"
task: "redesign-research-hub"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-10-26"
completed: "2026-10-26"
---

# 🔬 แผนงานปรับปรุงและออกแบบหน้าศูนย์วิจัยและบริการวิชาการ (/research)
**สถาปัตยกรรมดีไซน์:** Mandatory Web Design Triad (oil-ui Visual Subtraction + shadcn/ui Primitives + motion Micro-interactions)  
**สถาปัตยกรรมเทคนิค:** Next.js Server Component (ISR) + Interactive Client Islands (Hero Search, Staggered Motion Grids)

---

## 🎨 DESIGN COMMITMENT: Mandatory Web Design Triad
1. **`oil-ui` (Design North Star & Visual Subtraction):** 
   - กำหนดทิศทาง: *Academic Hub of Regional Excellence & Community Empowerment*
   - ลดทอนความรกรุงรัง ตัดเงาหนาและขอบซ้อนทับออก เน้น Hairline Borders คมชัดระดับสิ่งพิมพ์
2. **`shadcn/ui` (Component Primitives):**
   - เรียกใช้ `@/components/ui/badge`, `@/components/ui/button`, และ `@/components/ui/card` เป็นโครงสร้างพื้นฐาน
3. **`motion` (Micro-interactions & Physics):**
   - ใส่ Staggered Reveal Animation เมื่อเลื่อนหน้าจอถึงแต่ละ Section
   - เพิ่ม Hover/Tap Physics สัมผัสนุ่มนวล และรองรับ `prefers-reduced-motion`

---

## 📋 Implementation Checklist

- [x] **Step 1:** เพิ่มฟังก์ชัน `fetchResearchStats` ใน `frontend/lib/research.ts`
- [x] **Step 2:** สร้าง Component `ResearchHeroSearch.tsx` (Client Island สำหรับค้นหาและกรอง SDG)
- [x] **Step 3:** สร้าง Component `ResearchFeaturedGrid.tsx` เพื่อนำเสนอผลงานวิจัยล่าสุดที่ดึงจาก API
- [x] **Step 4:** ปรับแต่งและสร้าง `ResearchPillarsGrid.tsx`, `ResearchStatsBar.tsx`, และ `ResearchSdgMatrix.tsx`
- [x] **Step 5:** อัปเกรดทุก Component ด้วย `shadcn/ui` และ `motion` ตาม Mandatory Web Design Triad
- [x] **Step 6:** ทดสอบ TypeScript และความถูกต้องของระบบ
