---
title: Plan - Staff Profile Data Minimization (Latest 3 Projects/Services & Locked Full Bio)
status: planned
created_at: 2026-10-19
tags:
  - staff
  - pdpa
  - research
  - academic-services
  - resume
  - ui-ux
---

# แผนงาน: ปรับปรุงการแสดงผลข้อมูลบุคลากร (จำกัดผลงานวิจัยและบริการวิชาการล่าสุดไม่เกิน 3 เรื่อง พร้อมระบบขอข้อมูลฉบับเต็ม)

> [!IMPORTANT]
> **สรุปความต้องการของผู้ใช้ (User Requirements):**
> 1. หน้าเว็บโปรไฟล์บุคลากร (`/about/staff/[id]`) แสดงข้อมูลโปรไฟล์เกือบทั้งหมด (รูปภาพ, ชื่อ-สกุล, ตำแหน่ง, สังกัด, อีเมล, ประวัติการศึกษา, ความเชี่ยวชาญ, รหัสนักวิจัย)
> 2. **จำกัดรายการผลงาน:**
>    - **โครงการวิจัย (Research Projects):** แสดงเฉพาะผลงานล่าสุด **ไม่เกิน 3 เรื่อง** (หากมีมากกว่านั้น ให้แสดงปุ่ม / ป้ายขอเอกสารประวัติฉบับเต็ม)
>    - **บริการวิชาการ (Academic Services):** แสดงเฉพาะผลงานล่าสุด **ไม่เกิน 3 เรื่อง** (เชื่อมโยงจากฐานข้อมูลบริการวิชาการ)
> 3. **การขอข้อมูลประวัติฉบับเต็ม (Official Speaker Bio & CV):** หากผู้ใช้ต้องการดูโครงการวิจัยทั้งหมด หรือประวัติฉบับสมบูรณ์ ให้กดปุ่ม **"ขอประวัติวิทยากร (Resume)"** เพื่อให้ระบบออกเอกสาร PDF พร้อมข้อมูลทั้งหมด ส่งตรงเข้าสู่อีเมลของผู้ขอหลังได้รับการอนุมัติ
> 4. **สถาปัตยกรรม:** จัดการที่ระดับ Frontend UI (และเสริม API ให้ดึงบริการวิชาการของอาจารย์ท่านนั้นได้) เพื่อความสะดวกในการบำรุงรักษา

---

## 1. การเปลี่ยนแปลงในระบบ (System Changes Breakdown)

### 1.1 Backend Enhancement (`staff-service`)
- ใน [`staff.service.ts`](file:///e:/web2026/soc-crru-web/backend/apps/staff-service/src/staff.service.ts) ฟังก์ชัน `findOne(id)`:
  - ปัจจุบัน query เฉพาะ `researchProjects`
  - **เพิ่ม:** Query เชื่อมโยงกับตาราง `academicServiceMembers` และ `academicServices` เพื่อส่งรายการ `academicServices` ที่อาจารย์ท่านนั้นมีส่วนร่วมกลับไปด้วย
- ใน [`pdf-resume.service.ts`](file:///e:/web2026/soc-crru-web/backend/apps/staff-service/src/pdf-resume.service.ts):
  - ตรวจสอบว่าในเอกสาร PDF ทางการ แสดงโครงการวิจัยทั้งหมด (Full List) และบริการวิชาการทั้งหมด (Full List) อย่างสมบูรณ์ เพื่อให้ผู้ที่ได้รับเอกสารประวัติวิทยากรได้ข้อมูลครบถ้วน 100%

### 1.2 Frontend Enhancement (`frontend`)
- ใน [`frontend/lib/staff.ts`](file:///e:/web2026/soc-crru-web/frontend/lib/staff.ts):
  - เพิ่ม Interface `LinkedAcademicService` ใน `Staff` data model
- ใน [`frontend/app/about/staff/[id]/page.tsx`](file:///e:/web2026/soc-crru-web/frontend/app/about/staff/[id]/page.tsx):
  - **โครงการวิจัย:** ตัดการแสดงผลด้วย `.slice(0, 3)`
    - หากมีผลงานวิจัยทั้งหมดมากกว่า 3 เรื่อง: แสดงกล่องข้อความแจ้งเตือนสีสุภาพด้านท้าย เช่น:
      > *"แสดงผลงานวิจัยล่าสุด 3 เรื่องจากทั้งหมด {total} เรื่อง หากต้องการเอกสารประวัติวิจัยและผลงานวิชาการฉบับสมบูรณ์ สามารถกดปุ่ม [ขอประวัติวิทยากร (Resume)]"*
  - **บริการวิชาการ:** เพิ่มส่วนการแสดงผล **"งานบริการวิชาการและพัฒนาสังคม (Academic Services)"**
    - ตัดการแสดงผลด้วย `.slice(0, 3)`
    - มีป้ายระบุบทบาท (เช่น หัวหน้าโครงการ/ผู้ร่วมงาน), พื้นที่ดำเนินงาน, และสถานะ
    - หากมีมากกว่า 3 เรื่อง: แสดงป้ายแจ้งให้ขอรับเอกสารฉบับเต็มเช่นเดียวกัน
  - **กล่อง Call-to-Action (CTA):**
    - ปรับแต่งปุ่มและแบนเนอร์ขอประวัติวิทยากรให้มีความเชื่อมโยง เด่นชัด และใช้งานง่าย

---

## 2. แผนการดำเนินงานเป็นขั้นตอน (Step-by-Step Implementation Tasks)

### Task 1: อัปเดต Backend API ให้รองรับ Academic Services
- [ ] อัปเดต `staff.service.ts` ดึงข้อมูล `academicServices` ที่เชื่อมโยงกับ `staffProfileId` ผ่าน `academicServiceMembers`
- [ ] ตรวจสอบ `pdf-resume.service.ts` ให้รวมรายการบริการวิชาการลงใน PDF Resume

### Task 2: อัปเดต TypeScript Interfaces หน้าบ้าน
- [ ] เพิ่ม `LinkedAcademicService` ใน `frontend/lib/staff.ts`

### Task 3: ปรับแต่งหน้าโปรไฟล์อาจารย์ (`/about/staff/[id]/page.tsx`)
- [ ] จำกัดโครงการวิจัยแสดงไม่เกิน 3 เรื่อง พร้อม Badge จำนวนที่เหลือ
- [ ] เพิ่มส่วนแสดงผลบริการวิชาการล่าสุดไม่เกิน 3 เรื่อง
- [ ] ใส่การ์ดหรือแบนเนอร์ *"เอกสารประวัติฉบับสมบูรณ์"* ที่เชื่อมต่อไปยังปุ่มเปิด `RequestResumeModal`

### Task 4: การตรวจสอบและการทดสอบระบบ (Verification)
- [ ] ทดสอบ Build Backend (`npm run build` ใน backend)
- [ ] ทดสอบ Build Frontend (`npm run build` ใน frontend)
- [ ] ทดสอบการแสดงผลหน้าบ้าน: ตรวจสอบความถูกต้องของการจำกัด 3 เรื่อง และปุ่มขอประวัติ
- [ ] Commit & Push ขึ้น GitHub
