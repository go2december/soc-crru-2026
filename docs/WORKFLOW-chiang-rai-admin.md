# Chiang Rai Studies Admin Workflow

## 📋 ภาพรวมกระบวนการทำงาน

ระบบ Admin ของศูนย์เชียงรายศึกษาใช้งานภายใต้ `/chiang-rai-studies/admin` พร้อมระบบ Authentication แยกจาก Admin หลักของคณะ

---

## 🔐 ระบบ Authentication

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

## 🏗️ โครงสร้างหน้า Admin

```
/chiang-rai-studies/admin/
├── layout.tsx          # Layout หลัก (Sidebar + Header + Auth)
├── page.tsx            # Dashboard (ภาพรวม + Stats)
├── login/
│   └── page.tsx        # Login page (Google + Dev)
├── callback/
│   └── page.tsx        # Auth callback (เก็บ token)
├── articles/
│   ├── page.tsx        # รายการบทความ (ค้นหา, ลบ)
│   ├── create/
│   │   └── page.tsx    # สร้างบทความใหม่
│   └── edit/
│       └── [id]/page.tsx # แก้ไขบทความ
├── artifacts/
│   ├── page.tsx        # รายการ artifacts
│   ├── create/
│   │   └── page.tsx    # สร้าง artifact
│   └── edit/
│       └── [id]/page.tsx # แก้ไข artifact
└── staff/
    └── page.tsx        # จัดการบุคลากร (ลบ + Import)
```

---

## 📊 Dashboard Features

### Stats Cards
- **Artifacts** - จำนวนข้อมูลในคลังดิจิทัล
- **Staff** - จำนวนบุคลากร
- **Articles** - จำนวนบทความวิชาการ
- **System** - สถานะ Database

### Recent Updates
- แสดง 5 รายการล่าสุด (Artifacts, Articles, Staff)
- แยกตาม type พร้อมสีที่แตกต่างกัน

### Quick Actions
- เพิ่มข้อมูลอัตลักษณ์
- เพิ่มบุคลากรใหม่
- เผยแพร่บทความ

---

## 🔧 CRUD Operations

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

### 3. Staff Management
- **List**: `/admin/staff` - แสดงตาม role
- **Import**: นำเข้าจาก Faculty Staff พร้อมเลือก role
- **Delete**: ลบบุคลากร

---

## 🎨 UI/UX Theme

### Colors
- **Primary**: Lotus Purple (#2e1065, #702963)
- **Accent**: Puang Said Orange (#F97316)
- **Background**: Light Purple (#FAF5FF)

### Components
- Sidebar พับได้ (toggle)
- Breadcrumb navigation
- Loading states
- Confirm dialogs
- Toast notifications (alert)

---

## ⚠️ Known Issues & Fixes

### 1. API URL Prefix
- **Problem**: Backend ใช้ `setGlobalPrefix('api')` แต่ frontend บางส่วนไม่มี `/api/`
- **Fixed**: เพิ่ม `/api/` ให้ทุก fetch calls
- **Files affected**: artifacts/*, staff/*, dashboard

### 2. Login Loop
- **Problem**: Layout ทำงานบน login page ด้วย → infinite redirect
- **Fixed**: Skip auth check และ render children directly บน login page

### 3. Missing Dependencies
- **Problem**: `date-fns` ไม่อยู่ใน container
- **Fixed**: npm install + rebuild container

---

## 🔄 API Calls Summary

### Base URL
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
```

### Endpoints
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

// Staff
GET    /api/chiang-rai/staff
DELETE /api/chiang-rai/staff/:id
POST   /api/chiang-rai/staff/import
GET    /api/chiang-rai/admin/faculty-staff

// Auth
GET    /api/auth/profile
```

---

## 📝 Development Notes

1. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` - Backend URL (default: http://localhost:4001)
   - `INTERNAL_API_URL` - SSR fetch URL (ใน public pages)

2. **Authentication**:
   - ใช้ร่วมกับ Admin หลัก (token เดียวกัน)
   - Dev login สำหรับ development ที่ `/api/auth/dev/login`

3. **Responsive**:
   - Mobile-friendly sidebar (collapse)
   - Table responsive บน small screens

---

## 🚀 Next Steps (Phase 5.5 Remaining)

1. **Full-text Search** - Server-side optimization
2. **Content Population** - ข้อมูลตัวอย่าง 5 อัตลักษณ์
3. **SEO Metadata** - Add meta tags ทุก routes
4. **Responsive Audit** - Mobile/Tablet check
5. **Production Deploy** - Build verification
