---
title: "Plan: Redesign /about/executive Module"
type: "task-plan"
status: "completed"
tags: ["plan", "about-executive", "redesign", "tailwind-v4", "prompt-font", "server-component", "editorial-lanna"]
aliases: ["Executive Page Redesign Plan"]
---

# 📋 Plan: Redesign `/about/executive` (ทำเนียบคณะผู้บริหาร คณะสังคมศาสตร์)

> [!important] วัตถุประสงค์โครงการ
> ยกเครื่องหน้า [**`/about/executive`**](file:///e:/web2026/soc-crru-web/frontend/app/about/executive/page.tsx) (**ทำเนียบคณะผู้บริหาร**) สู่มาตรฐาน **Editorial Lanna Modernist** ยกระดับภาพลักษณ์สู่สากลด้วยโทนสี Scholar Navy & Warm Amber จัดสายการบังคับบัญชาและทำเนียบผู้บริหารแบบ Hierarchy Podium & Tiered Cards พร้อมแปลงเป็น Next.js Server Component (SSR/ISR) เพื่อ Performance สูงสุด โหลดทันที ไม่มี Layout Shift (CLS) และรองรับ SEO/Webometrics สมบูรณ์แบบ

---

## 🔍 การวิเคราะห์และปัญหาของหน้าเดิม (Existing Audit)

1. **Client-side Fetching (`'use client'`):** โค้ดเดิมดึงข้อมูลผ่าน `fetch('/api/staff')` ใน `useEffect` ส่งผลให้ผู้ใช้ต้องรอ Skeleton หมุนทุกครั้ง และ Web Crawlers อาจไม่ได้ HTML แบบเต็มทันที
2. **Hero Header ซ้ำซ้อนและขาดความสอดคล้อง:** ไม่ได้ใช้ Hero และ Sticky Sub-Navigation Bar มาตรฐานเดียวกับ `/about/structure` และ `/about/strategy`
3. **การจัดลำดับชั้นการบริหาร (Visual Hierarchy):**
   - คณบดี (Dean Spotlight): ใช้ดีไซน์เดิม ยังไม่สะท้อนความสง่างามระดับ Head of Organization
   - รองคณบดี, ผู้ช่วยคณบดี, ประธานสาขา: เรียงเป็นการ์ดขนาดเดียวกันหมด ขาดความรู้สึกของการเป็น "ทีมผู้นำองค์กร" (Podium / Tiered Hierarchy)
4. **Image Handling & Asset Pipeline:** ใช้ฟังก์ชัน parse URL เอง แทนที่จะใช้ `getAssetUrl` จาก `@/lib/api-config`

---

## 🎨 ทิศทางการออกแบบใหม่ (Design Architecture)

1. **Hero Section สไตล์ Editorial Lanna:**
   - ใช้โทน Deep Lanna Slate (`#0B132B`) พร้อมขอบล่าง Saffron Flame / Warm Amber
   - Background Dot Canvas Pattern สอดคล้องกับหน้าหมวด About ทั้งหมด
   - Breadcrumbs นำทาง: `หน้าแรก` > `เกี่ยวกับคณะ` > `คณะผู้บริหาร`
2. **Sticky Sub-Navigation Bar:**
   - แถบเมนูนำทางด่วน: `ภาพรวมคณะ`, `แผนยุทธศาสตร์`, `โครงสร้างบริหาร`, `คณะผู้บริหาร` (Active), `บุคลากร`
3. **Dean Executive Spotlight (ระดับ Apex):**
   - กรอบรูปภาพผู้บริหารทรงคุณวุฒิความละเอียดสูง (3:4 ratio) พร้อมเข็มกลัดเกียรติยศ "DEAN / คณบดี"
   - กล่องข้อความสารวิสัยทัศน์ (Vision Statement & Welcome Message) สไตล์ Editorial คมชัด
   - ข้อมูลการติดต่อตรง (Email, ลิงก์ประวัติและผลงานวิชาการ)
4. **Hierarchical Leadership Showcase (Tiered Podium):**
   - **Tier 1: คณะผู้บริหารระดับสูง (Senior Leadership / รองคณบดี):** การ์ดขนาดกว้างระดับพรีเมียม แสดงฝ่ายรับผิดชอบชัดเจน พร้อม Badge แสดงพันธกิจ
   - **Tier 2: ผู้ช่วยคณบดี (Assistant Deans):** การ์ดบริหารฝ่ายสนับสนุนและงานเฉพาะทาง
   - **Tier 3: ประธานหลักสูตรและสาขาวิชา (Academic Program Chairs):** การ์ดแยกตามกลุ่มสาขา พร้อมแท็กสาขาวิชาที่กำกับดูแล
5. **Technical Architecture:**
   - แปลงเป็น **Next.js Server Component** พร้อม `export const revalidate = 60`
   - ใช้ `getApiBaseUrl()` และ `getAssetUrl()` สำหรับรูปภาพและข้อมูล
   - เพิ่ม `JsonLd` ItemList Schema.org เพื่อความสมบูรณ์ของ SEO

---

## 📋 แผนงานปฏิบัติการ (Task Breakdown)

- [x] **Task 1:** ปรับปรุง `frontend/app/about/executive/page.tsx` เป็น Server Component ด้วยดีไซน์ Editorial Lanna Modernist, ฟอนต์ Prompt, ลำดับชั้น Podium Hierarchy และ Asset URL resolver มาตรฐาน
- [x] **Task 2:** อัปเดต `layout.tsx` ของ `/about/executive` ให้มี OpenGraph และ Metadata ที่คมชัด
- [x] **Task 3:** ตรวจสอบความถูกต้องของการคอมไพล์ (`tsc` 0 errors)
- [x] **Task 4:** ซิงค์ Knowledge Graph ด้วย `graphify extract . --code-only`

---

## 🔗 เอกสารเชื่อมโยง
- [[00_Dashboard|สารบัญหลัก]]
- [[01_Active_Tasks/plan-redesign-about-module|แผนงานหลักหมวด About]]
- [[01_Active_Tasks/plan-redesign-about-structure-module|โครงสร้างการบริหาร]]
