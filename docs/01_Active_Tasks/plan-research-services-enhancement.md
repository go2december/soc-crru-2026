---
title: Plan - Research Services Enhancement & Security Hardening
status: completed
created_at: 2026-10-12
completed_at: 2026-10-12
tags:
  - research
  - services
  - frontend
  - backend
  - security
  - plan
---

# แผนยกระดับและเสริมความปลอดภัย: ระบบบริการวิชาการ (/research/services)

> [!NOTE] วัตถุประสงค์ (Objectives)
> ปรับปรุงหน้ารวมบริการวิชาการ ([`/research/services`](file:///e:/web2026/soc-crru-web/frontend/app/research/services/page.tsx)) และหน้ารายละเอียด ([`/research/services/[id]`](file:///e:/web2026/soc-crru-web/frontend/app/research/services/[id]/page.tsx)) ให้ถูกต้อง ครบถ้วนตามฐานข้อมูล เชื่อมโยง SDGs คณะทำงาน พร้อมเสริมระบบความปลอดภัยรอบด้าน (Security Hardening)

---

## 1. การปรับปรุงส่วนติดต่อผู้ใช้ (Frontend Architecture)

### 1.1 หน้ารวมบริการวิชาการ (`/research/services/page.tsx`)
- **Hero & Authority Header:** ดีไซน์สไตล์ Scholar Deep (`#0A2540`) ผสานลวดลายเรขาคณิตและ Breadcrumb ที่ถูกต้อง
- **Interactive Service Categories (Top Cards):** ปรับการ์ดบริการหลัก 3 หมวด ให้สามารถคลิกเพื่อกรองหมวดหมู่โครงการได้ทันที (`SOCIAL_SERVICE`, `CONSULTING`, `SOCIAL_LAB`)
- **Search & Dynamic Filter Bar:**
  - ค้นหาด้วยคำค้น (Title, Description, Area)
  - กรองตามประเภทบริการ (`serviceType`)
  - กรองตามสถานะการดำเนินงาน (`status`: ONGOING, COMPLETED, RECRUITING)
  - กรองตามเป้าหมายความยั่งยืน (`sdgIds`)
- **Enhanced Project Cards:** แสดงภาพหน้าปก, ป้ายสถานะ, พื้นที่เป้าหมาย, SDGs Badges, และปีงบประมาณ
- **Service Request Hub (Hybrid Dual-Action):**
  - **Action A:** ปุ่มดาวน์โหลดแบบฟอร์มคำขอทางการ (`.docx` / `.pdf`)
  - **Action B:** ช่องทางติดต่อด่วนสายตรงฝ่ายบริการวิชาการและวิจัย (Fast-Track Contact)

### 1.2 หน้ารายละเอียดโครงการ (`/research/services/[id]/page.tsx`)
- **Metadata & SEO:** เพิ่ม `generateMetadata` รองรับ OpenGraph และ Schema.org `ResearchProject` JSON-LD ที่ตรงตาม Schema จริง
- **Project Detail Grid:** แสดงพื้นที่ดำเนินงาน (`area`), ประเภทบริการ, แหล่งทุน และงบประมาณ
- **Responsible Faculty/Staff (`members`):** แสดงรายชื่ออาจารย์และบุคลากรผู้รับผิดชอบโครงการพร้อมบทบาท (หัวหน้าโครงการ / ผู้ร่วมงาน)
- **SDGs Badges:** แสดงผลด้วยคอมโพเนนต์ `ResearchSdgBadges`
- **Document & Gallery Section:** ปุ่มดาวน์โหลดเอกสารรายงานสรุป (`documentUrl`) และ Image Gallery

### 1.3 ปรับปรุง Type Definition (`frontend/lib/academic-services.ts`)
- เพิ่มฟิลด์ใน `AcademicServiceItem`: `galleryImages`, `budget`, `fundingSource`, `sdgIds`, `documentUrl`, `members`
- กำหนดโครงสร้าง `ACADEMIC_SERVICE_TYPES` แบบ Data-driven รองรับการเพิ่มหมวดใหม่ในอนาคต

---

## 2. การเสริมระดับความปลอดภัยของระบบ (Security Hardening)

> [!IMPORTANT] มาตรการความปลอดภัย 5 ด้าน (5 Pillars of Security)

1. **XSS & Content Sanitization:**
   - ป้องกัน Stored XSS ในข้อความรายละเอียด (`description`) โดยตรวจสอบการ render ปลอดภัย
   - จำกัดลิงก์ภายนอก (`ExternalLink`) ให้มี `rel="noopener noreferrer"` และตรวจสอบโปรโตคอล (`https://` เท่านั้น)
2. **Anti-Scraping & Privacy Protection (PDPA):**
   - ปกป้องข้อมูลบุคลากรในโครงการ โดยส่งเฉพาะข้อมูลสาธารณะ (คำนำหน้า, ชื่อ-สกุล, บทบาท) ไม่เปิดเผยเบอร์ส่วนตัวหรือข้อมูลประจำตัว
   - ซ่อน/ป้องกันการกวาดข้อมูลอีเมลและเบอร์โทรศัพท์ (Bot Email/Phone Obfuscation) ในกล่อง Fast-Track Contact
3. **Safe File Handling & Download Boundary:**
   - ป้องกัน Path Traversal ในการดาวน์โหลดเอกสารโครงการ (`documentUrl`) และแบบฟอร์มขอรับบริการ
   - ตรวจสอบ Content-Disposition และ White-list ชนิดไฟล์ (`.pdf`, `.docx`, `.png`, `.jpg`, `.webp`)
4. **Backend API Validation & Parameter Tampering Protection:**
   - ป้องกัน SQL Injection โดย Drizzle ORM Parameterized Query ในทุกเงื่อนไขการค้นหา
   - Data Sanitization สำหรับ Query Parameters ที่ส่งเข้ามาในระบบ
5. **RBAC & Admin Privilege Enforce:**
   - ยืนยันว่า API จัดการข้อมูล (Create, Update, Delete) ผ่าน `JwtAuthGuard` และ `RolesGuard` เฉพาะสิทธิ์ `ADMIN` และ `EDITOR` อย่างเคร่งครัด

---

## 3. ลำดับขั้นตอนการดำเนินการ (Execution Phases)

- [x] **Phase 1: Foundation & Types:** อัปเดต `AcademicServiceItem` interface และ Helper ฟังก์ชันใน `frontend/lib/academic-services.ts`
- [x] **Phase 2: Client Interactive Component:** สร้าง `AcademicServicesClient.tsx` รองรับ Search, Category Filter Pills, Status & SDG Filters
- [x] **Phase 3: Service Request Hub Component:** สร้าง `AcademicServiceRequestHub.tsx` สไตล์ Hybrid พร้อมระบบความปลอดภัยและการดาวน์โหลดเอกสาร
- [x] **Phase 4: Page Re-architecture:** อัปเดต `frontend/app/research/services/page.tsx` เชื่อมต่อ SEO Metadata และ Client Component
- [x] **Phase 5: Detail Page Enhancement:** ปรับปรุง `frontend/app/research/services/[id]/page.tsx` ให้แสดง Members, SDGs, Budget, Document Download และแก้ JSON-LD Schema
- [x] **Phase 6: Security & Build Verification:** รัน Typecheck, ตรวจสอบ Lint, ทดสอบ Link และ Build Production สำเร็จ 100% (HTTP 200 / Next.js Build Exit 0)

