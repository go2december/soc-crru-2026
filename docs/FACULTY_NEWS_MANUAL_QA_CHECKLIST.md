# Faculty News Manual QA Checklist
**Updated:** March 24, 2026

## 📋 ภาพรวม
เอกสารนี้คือ checklist สำหรับทดสอบ manually ว่า Faculty news module ทั้ง backend, admin, และ public ทำงานถูกต้องตาม requirement โดยเฉพาะ:
- หมวดหมู่ `สมัครงาน` (JOB)
- รูปภาพหลายภาพ
- เอกสารแนบดาวน์โหลด
- การลบไฟล์อัตโนมัติ

---

## 🔧 Prerequisites

### 1. Database Migration
- [ ] รัน `backend/drizzle/migrations/0003_faculty_news_assets.sql` หรือ `backend/migration.sql` บน environment ที่จะทดสอบ
- [ ] ตรวจว่า `news_category` enum มี `JOB` แล้ว
- [ ] ตรวจว่า `news` table มี `media_urls`, `attachments`, `published_at` nullable

### 2. Upload Directories
- [ ] ตรวจว่า `./uploads/news` และ `./uploads/news/attachments` มีอยู่และสามารถเขียนได้
- [ ] ตรวจ permission ให้ backend สามารถเขียนไฟล์ได้

---

## 📝 Admin QA Checklist

### 1. Create News Flow
- [ ] Login เข้า admin ด้วยบัญชี ADMIN/EDITOR
- [ ] ไปที่ `/admin/(dashboard)/news/create`
- [ ] กรอกข้อมูล:
  - [ ] Title: "ทดสอบข่าวสมัครงาน"
  - [ ] Category: เลือก "สมัครงาน"
  - [ ] Content: ใส่ rich text พร้อมรูปใน content
  - [ ] Thumbnail: อัปโหลดรูปปก
  - [ ] Media URLs: อัปโหลดรูปเพิ่มเติม 2-3 รูป
  - [ ] Attachments: อัปโหลด PDF 1-2 ไฟล์
  - [ ] Is Published: เลือก "เผยแพร่"
- [ ] กด "บันทึก"
- [ ] ตรวจว่า redirect ไปหน้า list และข่าวปรากฏในรายการ
- [ ] ตรวจว่าไฟล์ทั้งหมดอยู่ใน `./uploads/news` และ `./uploads/news/attachments`

### 2. Edit News Flow
- [ ] คลิก "แก้ไข" ข่าวที่เพิ่งสร้าง
- [ ] แก้ไข:
  - [ ] Title: เปลี่ยนชื่อเล็กน้อย
  - [ ] ลบรูปเพิ่มเติม 1 รูป (กด X)
  - [ ] ลบไฟล์แนบ 1 ไฟล์ (กด X)
  - [ ] เพิ่มรูปเพิ่มเติมใหม่ 1 รูป
  - [ ] เพิ่มไฟล์แนบใหม่ 1 ไฟล์
- [ ] กด "บันทึก"
- [ ] ตรวจว่าข้อมูลอัปเดตถูกต้อง
- [ ] **Critical:** ตรวจว่าไฟล์ที่ลบจาก UI หายไปจาก `./uploads/news` และ `./uploads/news/attachments`

### 3. Delete News Flow
- [ ] สร้างข่าวทดสอบใหม่ (มีรูปและไฟล์แนบ)
- [ ] คลิก "ลบ" และยืนยัน
- [ ] **Critical:** ตรวจว่าข่าวหายไปจาก list
- [ ] **Critical:** ตรวจว่าไฟล์ทั้งหมดของข่าวนั้นถูกลบจาก `./uploads/news` และ `./uploads/news/attachments`

### 4. Draft/Publish Toggle
- [ ] สร้างข่าวใหม่ แต่เลือก "ไม่เผยแพร่"
- [ ] ตรวจว่าข่าวไม่ปรากฏใน public pages
- [ ] แก้ไขข่าวนั้น ติ๊ก "เผยแพร่" และบันทึก
- [ ] ตรวจว่าข่าวปรากฏใน public pages แล้ว

---

## 🌐 Public QA Checklist

### 1. News Listing Page (`/news`)
- [ ] เข้า `/news`
- [ ] ตรวจว่า hero section แสดงข้อมูลถูกต้อง
- [ ] ตรวจว่า featured news แสดงรูปปก, category, วันที่, จำนวนไฟล์แนบ
- [ ] ตรวจว่า sidebar "อัปเดตล่าสุด" แสดงรายการถูกต้อง
- [ ] ตรวจว่า section "ข่าวทั้งหมด" แสดง grid layout ถูกต้อง
- [ ] คลิกข่าวไปหน้า detail ได้
- [ ] ตรวจ responsive บน mobile/tablet:
  - [ ] Font sizes ปรับตาม viewport
  - [ ] Grid layouts ยุบเป็น column เดียวบน mobile
  - [ ] Buttons/links พอดีกับ touch

### 2. News Detail Page (`/news/[slug]`)
- [ ] เข้า detail page ของข่าวทดสอบ
- [ ] ตรวจว่า hero image แสดงถูกต้อง
- [ ] ตรวจว่า breadcrumbs "กลับไปหน้าข่าวสาร" ทำงาน
- [ ] ตรวจว่า metadata (category, date, attachments count) ถูกต้อง
- [ ] ตรวจว่า title แสดงถูกต้อง
- [ ] ตรวจว่า content แสดง rich text ถูกต้อง
- [ ] ตรวจว่า gallery section แสดงรูปเพิ่มเติมทั้งหมด
- [ ] ตรวจว่า sidebar "ข้อมูลข่าว" แสดงข้อมูลถูกต้อง
- [ ] ตรวจว่า sidebar "เอกสารดาวน์โหลด" แสดงไฟล์ทั้งหมด
- [ ] **Critical:** คลิก download link และตรวจว่าไฟล์ดาวน์โหลดได้
- [ ] ตรวจ responsive บน mobile/tablet:
  - [ ] Hero section ไม่ถูก crop
  - [ ] Content typography อ่านง่าย
  - [ ] Gallery grid ปรับตาม viewport
  - [ ] Sidebar ยุบลงใต้ content บน mobile
  - [ ] Download buttons พอดีกับ touch

### 3. Category Display
- [ ] ตรวจว่า category "สมัครงาน" แสดงด้วยสี/style ที่ถูกต้อง
- [ ] ตรวจว่า category labels แสดงภาษาไทยถูกต้อง

### 4. SEO & Metadata
- [ ] ตรวจ page title ใน browser tab
- [ ] ตรวจ meta description
- [ ] ตรวจ canonical URL
- [ ] ตรวจ Open Graph tags (สำหรับ social sharing)

---

## 🏠 Homepage Integration QA

### NewsSection Component
- [ ] เข้าหน้าแรก `/`
- [ ] ตรวจว่า "ข่าวสารคณะ" section แสดงข่าวจริง
- [ ] ตรวจว่าข่าวมี thumbnail, category, date, excerpt
- [ ] คลิก "อ่านทั้งหมด" ไป `/news` ได้
- [ ] คลิกข่าวแต่ละรายการไป detail page ได้

---

## 🔍 Edge Cases & Error Handling

### 1. Empty States
- [ ] ลบข่าวทั้งหมดแล้วตรวจ `/news` ว่าแสดง "ยังไม่มีข่าวที่เผยแพร่"
- [ ] ตรวจ detail page ของ slug ที่ไม่มีอยู่ว่าแสดง 404

### 2. Media Handling
- [ ] สร้างข่าวโดยไม่ใส่ thumbnail และตรวจว่าแสดง placeholder
- [ ] สร้างข่าวโดยไม่ใส่รูปเพิ่มเติมและไฟล์แนบ
- [ ] อัปโหลดไฟล์ขนาดใหญ่ (>5MB) และตรวจ error handling

### 3. Permission Tests
- [ ] ลองเข้า admin pages โดยไม่ login ต้อง redirect ไป login
- [ ] ลองเข้า admin pages ด้วยบัญชีที่ไม่ใช่ ADMIN/EDITOR ต้อง block

---

## ✅ Acceptance Criteria

ข่าวสาร Faculty ผ่าน QA ก็ต่อเมื่อ:

- [x] **Backend:** Category `JOB`, multiple images, attachments, cleanup ทำงาน
- [x] **Admin:** Create/edit/delete พร้อม media management ทำงาน
- [x] **Public:** Listing/detail พร้อม gallery/download ทำงาน
- [x] **Responsive:** Mobile/tablet แสดงผลดี
- [x] **SEO:** Metadata พื้นฐานครบถ้วน
- [x] **Cleanup:** ลบข่าว = ลบไฟล์ทั้งหมด
- [x] **Integration:** Homepage ดึงข่าวจริงแสดง

---

## 📝 Notes & Known Issues

- หากพบปัญหา upload ตรวจ `./uploads` permissions
- หากพบปัญหา image display ตรวจ `getFacultyNewsServerAssetUrl` helper
- หากพบปัญหา SEO metadata ตรวจ `generateMetadata` function
- หากพบปัญหา responsive ตรวจ Tailwind classes และ DaisyUI theme

---

**QA ผ่าน:** ________________________  
**วันที่:** ________________________  
**ผู้ทดสอบ:** ________________________
