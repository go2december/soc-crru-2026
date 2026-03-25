# Chiang Rai Studies Admin Workflow
**Updated:** March 24, 2026

## ภาพรวมกระบวนการทำงาน

ระบบ Admin ของศูนย์เชียงรายศึกษาใช้งานภายใต้ `/chiang-rai-studies/admin` พร้อมระบบ Authentication แยกจาก Admin หลักของคณะ

## Document Role

- ไฟล์นี้เป็น **human-readable workflow** สำหรับอธิบายภาพรวมการทำงานของระบบ admin
- workflow สำหรับใช้งานเชิงปฏิบัติการใน IDE/agent ถูกแยกไว้ที่ `.windsurf/workflows/chiang-rai-admin.md`
- หากมีการเปลี่ยนขั้นตอนการทำงานจริง ควรอัปเดตทั้งไฟล์นี้และ executable workflow ให้สอดคล้องกัน

---

## ระบบ Authentication

### 1. Login Flow
```
/chiang-rai-studies/admin/login
  ↓ (Google/Dev Login)
/api/auth/google หรือ /api/auth/dev/login
  ↓ (Redirect with token)
/chiang-rai-studies/admin/callback?token=xxx
  ↓ (Store token, Redirect)
/chiang-rai-studies/admin
```

### 2. API Endpoints (Authentication)
- **`GET /api/auth/google`** - เริ่ม Google OAuth
- **`GET /api/auth/dev/login`** - Developer Bypass (สำหรับ dev)
- **`GET /api/auth/profile`** - ดึงข้อมูล user (ต้องมี token)
- **`GET /api/auth/google/callback`** - Google OAuth callback

### 3. Token Management
- เก็บใน `localStorage` ชื่อ `admin_token`
- Layout ตรวจสอบ token ทุกครั้ง
- ถ้าไม่มี token → redirect ไป login

---

## โครงสร้างหน้า Admin

```
/chiang-rai-studies/admin/
├── layout.tsx                # Layout หลัก (Sidebar + Header + Auth)
├── page.tsx                  # Dashboard (ภาพรวม + Stats)
├── login/page.tsx            # Login page (Google + Dev)
├── callback/page.tsx         # Auth callback (เก็บ token)
├── articles/
│   ├── page.tsx              # รายการบทความ (ค้นหา, ลบ)
│   ├── create/page.tsx       # สร้างบทความใหม่
│   └── edit/[id]/page.tsx    # แก้ไขบทความ
├── artifacts/
│   ├── page.tsx              # รายการ artifacts
│   ├── create/page.tsx       # สร้าง artifact
│   └── edit/[id]/page.tsx    # แก้ไข artifact
├── activities/
│   ├── page.tsx              # รายการกิจกรรม/ข่าวสาร
│   ├── create/page.tsx       # สร้างกิจกรรม
│   └── edit/[id]/page.tsx    # แก้ไขกิจกรรม
├── learning-sites/
│   ├── page.tsx              # รายการแหล่งเรียนรู้
│   ├── create/page.tsx       # สร้างแหล่งเรียนรู้
│   └── edit/[id]/page.tsx    # แก้ไขแหล่งเรียนรู้ (+ image deletion)
├── staff/page.tsx            # จัดการบุคลากร (Import + Delete)
└── settings/page.tsx         # ตั้งค่าหน้าแรก (Hero BG, Title, Subtitle)

---

## Dashboard Features

### Stats Cards
- **Artifacts** - จำนวนข้อมูลในคลังดิจิทัล
- **Staff** - จำนวนบุคลากร
- **Articles** - จำนวนบทความวิชาการ
- **Learning Sites** - จำนวนแหล่งเรียนรู้
- **System** - สถานะ Database

### Quick Actions
- เพิ่มข้อมูลอัตลักษณ์
- เพิ่มบุคลากรใหม่
- เผยแพร่บทความ
- สร้างแหล่งเรียนรู้

---

## CRUD Operations

### 1. Articles Management
- **List**: `/admin/articles` - ค้นหา, ลบ, ดูหน้าเว็บ, แก้ไข
- **Create**: `/admin/articles/create` - auto-slug, tags, publish status
- **Edit**: `/admin/articles/edit/[id]` - แก้ไขข้อมูล
- **Delete**: ยืนยันก่อนลบ

### 2. Artifacts Management
- **List**: `/admin/artifacts` - ค้นหา, ลบ, แก้ไข
- **Create**: `/admin/artifacts/create` - 5 categories, media URLs
- **Edit**: `/admin/artifacts/edit/[id]` - แก้ไขข้อมูล
- **Delete**: ยืนยันก่อนลบ

### 3. Activities Management
- **List**: `/admin/activities` - ค้นหา, ลบ, แก้ไข
- **Create**: `/admin/activities/create` - type (NEWS/EVENT/ANNOUNCEMENT), location, eventDate
- **Edit**: `/admin/activities/edit/[id]` - แก้ไขข้อมูล
- **Delete**: ยืนยันก่อนลบ

### 4. Learning Sites Management 
- **List**: `/admin/learning-sites` - ค้นหา, ลบ (พร้อมลบรูปจาก server)
- **Create**: `/admin/learning-sites/create` - ReactQuill editor, thumbnail, media gallery, tags
- **Edit**: `/admin/learning-sites/edit/[id]` - แก้ไข (ลบรูปเก่าเมื่อเปลี่ยน thumbnail/media)
- **Delete**: ยืนยันก่อนลบ → ลบ thumbnail, media, content images ออกจาก server ด้วย

### 5. Staff Management
- **List**: `/admin/staff` - แสดงตาม role
- **Import**: นำเข้าจาก Faculty Staff พร้อมเลือก role
- **Delete**: ลบบุคลากร

### 6. Settings (Homepage Config)
- **Page**: `/admin/settings`
- **Fields**: Hero background image URL, Hero title, Hero subtitle
- **API**: `PUT /api/chiang-rai/config`

---

## Image Management Workflow

### Upload Flow
```
1. User เลือกรูป → Frontend ส่ง POST /api/upload/chiang-rai
2. Backend → Sharp resize + convert to WebP
3. Backend → Save to /uploads/chiang-rai/ directory
4. Backend → Return relative path: /uploads/chiang-rai/filename.webp
5. Frontend → เก็บ relative path ลง form state
6. Submit form → เก็บ relative path ลง database
```

### Delete Flow (Learning Sites) 
```
Edit page:
- เปลี่ยน thumbnail → ลบรูปเก่าจาก server ก่อน upload ใหม่
- ลบ media item → ลบรูปจาก server ทันที
- Submit → เปรียบเทียบ content images เก่า/ใหม่ → ลบรูปที่ถูกลบออก

Delete (list page):
- Fetch full data ก่อน
- ลบ thumbnail + mediaUrls + content images ทั้งหมดจาก server
- แล้วค่อย DELETE record จาก database
```

### Image URL Convention
- **Database**: เก็บ relative path เท่านั้น เช่น `/uploads/chiang-rai/image.webp`
- **Admin (client-side)**: ใช้ `NEXT_PUBLIC_API_URL` + relative path
- **Public (SSR)**: ใช้ `INTERNAL_API_URL` + relative path (Docker network)
- **Image component**: ใช้ `unoptimized` prop เสมอ สำหรับ uploaded images

---

## UI/UX Theme

### Colors
- **Primary**: Lotus Purple (#2e1065, #702963)
- **Accent**: Puang Said Orange (#F97316)
- **Background**: Light Purple (#FAF5FF)
- **Homepage Hero**: Light Blue-White gradient (sky-50, white, blue-50)

### Components
- **Framework**: `shadcn/ui` (Card, Button, Input, Dialog, Textarea, etc.)
- Sidebar พับได้ (toggle)
- Breadcrumb navigation
- Loading states
- Confirm dialogs (via shadcn/ui Dialog)
- Toast notifications (alert)
- ReactQuill rich text editor (with image upload handler)

---

## Known Issues & Fixes (Resolved)

### 1. API URL Prefix 
- **Problem**: Backend ใช้ `setGlobalPrefix('api')` แต่ frontend บางส่วนไม่มี `/api/`
- **Fixed**: เพิ่ม `/api/` ให้ทุก fetch calls

### 2. Login Loop 
- **Problem**: Layout ทำงานบน login page ด้วย → infinite redirect
- **Fixed**: Skip auth check และ render children directly บน login page

### 3. Image URLs in Public Pages 
- **Problem**: SSR pages แปลง URL เป็น `http://backend:3000/uploads/...` ซึ่ง browser เข้าไม่ได้
- **Fixed**: ใช้ relative `/uploads/` paths + `PUBLIC_URL` prefix + `unoptimized` prop

### 4. Image Cleanup on Delete/Edit 
- **Problem**: ลบ/แก้ไขข้อมูลแล้วรูปยังค้างบน server
- **Fixed**: เพิ่ม `deleteImageFromServer()` + `extractImageUrls()` ใน edit/list pages (รองรับทั้ง Learning Sites และ Activities)

---

## API Endpoints (Complete)

### Base URL
```typescript
// Admin pages (client-side)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
// Public pages (SSR server-side)
const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';
```

### All Endpoints
```typescript
// Articles
GET    /api/chiang-rai/articles
GET    /api/chiang-rai/articles/by-id/:id
GET    /api/chiang-rai/articles/:slug
POST   /api/chiang-rai/articles
PUT    /api/chiang-rai/articles/:id
DELETE /api/chiang-rai/articles/:id

// Artifacts
GET    /api/chiang-rai/artifacts
GET    /api/chiang-rai/artifacts/:id
POST   /api/chiang-rai/artifacts
PUT    /api/chiang-rai/artifacts/:id
DELETE /api/chiang-rai/artifacts/:id

// Activities
GET    /api/chiang-rai/activities
GET    /api/chiang-rai/activities/by-id/:id
GET    /api/chiang-rai/activities/:slug
POST   /api/chiang-rai/activities
PUT    /api/chiang-rai/activities/:id
DELETE /api/chiang-rai/activities/:id

// Learning Sites
GET    /api/chiang-rai/learning-sites
GET    /api/chiang-rai/learning-sites/by-id/:id
GET    /api/chiang-rai/learning-sites/:slug
POST   /api/chiang-rai/learning-sites
PUT    /api/chiang-rai/learning-sites/:id
DELETE /api/chiang-rai/learning-sites/:id
GET    /api/chiang-rai/learning-site-categories

// Staff
GET    /api/chiang-rai/staff
GET    /api/chiang-rai/staff/:group
POST   /api/chiang-rai/staff
PUT    /api/chiang-rai/staff/:id
DELETE /api/chiang-rai/staff/:id
POST   /api/chiang-rai/staff/import
GET    /api/chiang-rai/admin/faculty-staff

// Config
GET    /api/chiang-rai/config
PUT    /api/chiang-rai/config

// Core
GET    /api/chiang-rai/identities
GET    /api/chiang-rai/stats
GET    /api/chiang-rai/search?q=
GET    /api/chiang-rai/tags

// Upload
POST   /api/upload/chiang-rai
DELETE /api/upload/chiang-rai

// Auth
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/dev/login
GET    /api/auth/profile
```

---

## Next Steps

1. **Content Population** - ข้อมูลจริงทุก section
2. **Articles Detail** - ตรวจสอบ layout consistency
3. **Responsive Audit** - Mobile/Tablet check
4. **Structured Data & Social Validation** - ตรวจ non-detail pages และ social cards บน production domain
5. **Production Deploy** - Build verification

---

## Related Workflow Files

- `docs/WORKFLOW-project-status.md` → consolidated project status snapshot
- `docs/PLAN-chiang-rai-studies.md` → Chiang Rai Studies implementation plan
- `docs/PLAN-workflow-standardization.md` → documentation governance rules
- `.windsurf/workflows/chiang-rai-admin.md` → executable admin workflow
- `.windsurf/workflows/content-population.md` → executable workflow for content completion
- `.windsurf/workflows/release-checklist.md` → executable workflow for QA, SEO, responsive, and release readiness
