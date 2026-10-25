---
title: "Plan: Redesign Admissions Page (Editorial Lanna Modernist & Next.js ISR)"
task: "redesign-admissions-page"
category: "frontend"
status: "completed"
priority: "high"
created: "2026-10-26"
completed: "2026-10-26"
---

# 🎓 แผนงานปรับปรุงและออกแบบหน้าเว็บรับสมัครนักศึกษา (/admissions)
**สถาปัตยกรรมดีไซน์:** Editorial Lanna Modernist (Anti-SaaS Cliché, Purple Ban, WCAG 2.1 AA)  
**สถาปัตยกรรมเทคนิค:** Next.js Server Component (ISR 600s) + Interactive Client Islands

---

## 🎨 DESIGN COMMITMENT: Editorial Lanna Modernist
- **Topological Choice:** เลิกใช้ Hero Split ซ้ายขวาแบบเดิม และลบ Ambient Blur Blobs ออกทั้งหมด หันมาใช้ **Editorial Typographic Command** ผสานกับ **TCAS Interactive Stepper Roadmap** ในการนำสายตา
- **Risk Factor:** จัดวางเลย์เอาต์การนำทางแบบ 3 มิติเชิงเนื้อหา (Roadmap > Table/Mobile Cards > Financial Aid & Credit Bank) พร้อมบัตรหลักสูตรระยะสั้น/ธนาคารหน่วยกิตสำหรับคนทำงาน
- **Readability Conflict:** เพิ่มพื้นที่ White-space และใช้โครงสร้างตาราง/การ์ดแบบ Hairline Divider เพื่อให้อ่านง่ายที่สุดบนสมาร์ตโฟน (Mobile First)
- **Cliché Liquidation:** ปฏิเสธ Bento Grid สำเร็จรูป, ปฏิเสธ Glassmorphism ฟุ้งกระจาย, ปฏิเสธ Gradient สีม่วงนีออน (ใช้เฉพาะสีอัตลักษณ์ คณะสังคมศาสตร์: Slate `#0B132B`, Terracotta Saffron `#C2410C`, Gold `#F59E0B`, และ White/Mist Canvas `#F8FAFC`)

---

## 🏗️ Technical Architecture & Modules

### 1. Server-Side Rendering & SEO
- แปลง `frontend/app/admissions/page.tsx` จาก Client Component ให้เป็น **Async Server Component**
- กำหนด `export const revalidate = 600` (ISR 10 นาที) เพื่อความรวดเร็วระดับ Edge และคะแนน LCP สูงสุด
- สร้าง Rich Schema.org `EducationalOrganization` + `OfferCatalog` JSON-LD สำหรับปฏิทินรับสมัคร
- รองรับ Dynamic Metadata (Title, Description, OpenGraph, Canonical URL)

### 2. Component Structure
- `frontend/app/admissions/page.tsx` (Server Component - Data Fetching & Layout)
- `frontend/components/admissions/AdmissionsHero.tsx` (Editorial Typographic Hero + Quick Jump)
- `frontend/components/admissions/TcasTimeline.tsx` (Client Island - Interactive Roadmap TCAS 1-4)
- `frontend/components/admissions/SchedulesSection.tsx` (Hybrid Table on Desktop / Card-list on Mobile)
- `frontend/components/admissions/AdmissionPathways.tsx` (ปริญญาตรี, บัณฑิตศึกษา, และ Lifelong / Credit Bank)
- `frontend/components/admissions/BrochureAndMedia.tsx` (Video + Brochure Lightbox + Document Downloads)
- `frontend/components/admissions/FinancialAidAndFAQ.tsx` (กยศ. กรอ. ทุนการศึกษา และคำถามที่พบบ่อย)
- `frontend/components/admissions/AdmissionContactDesk.tsx` (ศูนย์ประสานงานรับสมัคร คณะสังคมศาสตร์)

---

## 📋 Implementation Checklist

- [x] **Step 1:** สร้าง Helper Data Fetcher ฝั่ง Server สำหรับดึง Admissions Config, Schedules, และ Documents (`frontend/lib/admissions.ts`)
- [x] **Step 2:** ออกแบบ Component ย่อยตามหลัก Editorial Lanna Modernist และ WCAG 2.1 AA
- [x] **Step 3:** พัฒนาระบบแสดงผลแบบ Responsive สำหรับตารางรับสมัคร (Desktop Table / Mobile Rich Cards)
- [x] **Step 4:** ติดตั้ง Interactive TCAS Stepper เพื่อแสดงสถานะรอบรับสมัครปัจจุบันแบบ Real-time
- [x] **Step 5:** รวมทุก Component เข้าใน `frontend/app/admissions/page.tsx` พร้อม Metadata ครบถ้วน
- [x] **Step 6:** ตรวจสอบความถูกต้อง, Run Build / Lint และอัปเดต Knowledge Graph
