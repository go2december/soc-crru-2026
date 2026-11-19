---
title: "Plan: OpenAlex Integration for Staff Webometrics"
type: "plan"
status: "completed"
tags:
  - webometrics
  - openalex
  - staff
  - seo
updated_at: "2026-11-19"
---

# Plan: OpenAlex Integration (`soc-crru-web`)

> [!info] **Objective**
> เชื่อมต่อ OpenAlex API เพื่อดึงผลงานตีพิมพ์วิชาการของอาจารย์ (จับคู่ด้วย ORCID / OpenAlex Author ID) มาเก็บ Cache ใน PostgreSQL, แสดงบนหน้าโปรไฟล์อาจารย์พร้อม `ScholarlyArticle` JSON-LD และเพิ่มปุ่ม Sync ในหน้า Admin

## 1. Database (`backend/libs/database/src/schema.ts`)
- เพิ่ม `openalexAuthorId` และ `openalexSyncedAt` ใน `staff_profiles`
- สร้างตาราง `staff_publications` (FK `staffProfileId`, unique `(staffProfileId, openalexWorkId)`)

## 2. Backend (`backend/apps/staff-service/`)
- สร้าง `OpenAlexService` สำหรับค้นหา Author ID จาก ORCID และดึง Works จาก OpenAlex Polite Pool (`mailto:`)
- เพิ่ม Endpoint `POST /staff/sync-openalex-all` และ `POST /staff/:id/sync-openalex` (Admin/Editor only)
- อัปเดต `StaffService.findOne` ให้คืนรายการ `publications` และ `CreateStaffDto` รองรับ `openalexAuthorId`
- เพิ่ม Unit Test สำหรับ `OpenAlexService`

## 3. Frontend Public & SEO (`frontend/app/about/staff/[id]/`)
- อัปเดต `Staff` interface ใน `frontend/lib/staff.ts`
- อัปเดต `layout.tsx` เพิ่ม OpenAlex URL ใน `Person.sameAs` และฝัง `ScholarlyArticle` JSON-LD
- อัปเดต `page.tsx` แสดงรายการผลงานตีพิมพ์ (ปี, วารสาร, ยอด Citation, Open Access badge, ลิงก์ DOI)

## 4. Frontend Admin (`frontend/app/admin/(dashboard)/staff/`)
- เพิ่มช่อง `OpenAlex Author ID` ใน `StaffForm.tsx`
- เพิ่มปุ่ม `Sync OpenAlex ทั้งหมด` และปุ่ม Sync รายบุคคลใน `staff/page.tsx`

## 5. Verification
- Run `npx drizzle-kit push` (หรือตรวจสอบ migration), `npm run build` และ `npm test` ใน `backend/`
- Run `npm run lint` / `npx tsc --noEmit` ใน `frontend/`
