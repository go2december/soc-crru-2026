---
title: "Plan: Redesign Research Database Page (Editorial Academic & Research Archive)"
task: "redesign-research-database"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-10-26"
completed: "2026-10-26"
---

# 📚 แผนงานปรับปรุงและออกแบบหน้าระบบสืบค้นงานวิจัย (/research/database)
**สถาปัตยกรรมดีไซน์:** Editorial Academic & Research Archive (JSTOR/Scholar Inspired, Hairline Dividers, Purple Ban)  
**สถาปัตยกรรมเทคนิค:** Next.js Client Island + Real-time Backend Sync (Stats HUD, 17 SDGs Filter, URL Query Sync)

---

## 🎨 DESIGN COMMITMENT: Editorial Academic & Research Archive
- **Topological Refinement:** ยกระดับจากหน้าค้นหาแบบเดิม สู่หน้าสืบค้นงานวิจัยระดับสถาบันที่คมชัด ภูมิฐาน และใช้งานสะดวกรวดเร็ว
- **Accurate Global Stats HUD:** ดึงสถิติจริงจาก Backend API (`/api/research/stats`) มาแสดงผลแทนการนับเฉพาะโครงการในหน้าปัจจุบัน
- **Responsive 17 SDGs Visual Explorer:** ปรับแถบเลือก SDG ทั้ง 17 เป้าหมาย ให้รองรับการเลื่อนดูได้อย่างลื่นไหลทั้งบนสมาร์ตโฟนและเดสก์ท็อป โดยไม่เกิดปัญหาตัวหนังสือล้นหรือกรอบบีบอัด
- **Dual Presentation Views:**
  - **Editorial Card Grid:** การ์ดผลงานวิจัยพร้อมภาพปก/Scholar Fallback, แถบสถานะ, และ SDG Tags
  - **Scholarly Index List:** รายการดัชนีผลงานแบบ Hairline Row คล้ายสารบัญวารสารวิชาการสากล พร้อมเครื่องมืออ้างอิง (Cite Modal)

---

## 📋 Implementation Checklist

- [x] **Step 1:** เพิ่มการเชื่อมต่อ API สถิติภาพรวม `/api/research/stats` เข้าสู่ `ResearchDatabaseClient.tsx`
- [x] **Step 2:** ปรับโฉม Hero Header และ Stats HUD 4 ช่องให้แสดงข้อมูลภาพรวมของคณะอย่างแม่นยำ
- [x] **Step 3:** ออกแบบใหม่สำหรับ 17 SDGs Filter ให้ Responsive และมีแถบ Horizontal Scrollbar สบายตา
- [x] **Step 4:** ปรับปรุง Filter & Search Bar พร้อมการเลือกประเภทวิจัย (ทั้งหมด / รับใช้สังคม / พาณิชย์) และ View Mode Switcher
- [x] **Step 5:** ปรับปรุง Grid View และ List View ตามเกณฑ์ Editorial Lanna Modernist และปลอดสีม่วง (Purple Ban)
- [x] **Step 6:** ทดสอบ TypeScript และความถูกต้องเรียบร้อย
