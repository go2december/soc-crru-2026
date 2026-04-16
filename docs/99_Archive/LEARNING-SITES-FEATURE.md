# แหล่งเรียนรู้ทางวัฒนธรรม (Cultural Learning Resources) Feature

## Overview
เพิ่มระบบจัดการ "แหล่งเรียนรู้ทางวัฒนธรรม" ใหม่ให้กับศูนย์เชียงรายศึกษา โดยใช้โครงสร้างเดียวกันกับ Articles/Artifacts

## 📊 Database Schema

### New Table: `chiang_rai_learning_sites`

**Enum: `cr_learning_site_type`**
- MUSEUM - พิพิธภัณฑ์
- CULTURAL_CENTER - ศูนย์วัฒนธรรม
- COMMUNITY - ชุมชนท่องเที่ยว
- TEMPLE - วัด
- HISTORICAL_SITE - โบราณสถาน
- LOCAL_WISDOM - ศูนย์ภูมิปัญญา
- ART_SPACE - พื้นที่ศิลปะ
- OTHER - อื่นๆ

**Fields:**
- `id` (UUID, Primary Key)
- `title` (VARCHAR 500) - ชื่อสถานที่
- `slug` (VARCHAR 255, Unique) - URL slug
- `type` (Enum) - ประเภทแหล่งเรียนรู้
- `description` (TEXT) - คำอธิบายสั้น
- `content` (TEXT) - เนื้อหาเต็ม (HTML/Rich Text)

**Location:**
- `address` (TEXT)
- `subdistrict` (VARCHAR 255) - ตำบล
- `district` (VARCHAR 255) - อำเภอ
- `province` (VARCHAR 255, Default: เชียงราย)
- `postalCode` (VARCHAR 10)
- `latitude` (VARCHAR 50)
- `longitude` (VARCHAR 50)

**Contact:**
- `phone` (VARCHAR 50)
- `email` (VARCHAR 255)
- `website` (VARCHAR 500)
- `facebook` (VARCHAR 500)
- `lineOfficial` (VARCHAR 255)

**Media:**
- `thumbnailUrl` (VARCHAR 500)
- `imageUrls` (TEXT Array) - Gallery
- `videoUrls` (TEXT Array)

**Operating:**
- `openingHours` (TEXT) - เวลาเปิด-ปิด
- `closedDays` (TEXT Array) - วันปิด
- `admissionFee` (VARCHAR 255) - ค่าเข้าชม
- `isFree` (BOOLEAN, Default: false)

**Facilities:**
- `facilities` (TEXT Array) - สิ่งอำนวยความสะดวก

**Publishing:**
- `tags` (TEXT Array)
- `isPublished` (BOOLEAN, Default: true)
- `isFeatured` (BOOLEAN, Default: false)
- `publishedAt` (TIMESTAMP)
- `author` (VARCHAR 255)
- `sortOrder` (INTEGER, Default: 0)

**Timestamps:**
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**
- `cr_learning_sites_title_idx`
- `cr_learning_sites_type_idx`
- `cr_learning_sites_district_idx`
- `cr_learning_sites_published_at_idx`
- `cr_learning_sites_featured_idx`

---

## 🔌 API Endpoints

### Base URL: `/api/chiang-rai/learning-sites`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/learning-sites` | รายการแหล่งเรียนรู้ทั้งหมด (พร้อม filter & pagination) |
| GET | `/learning-sites/by-id/:id` | ดูข้อมูลตาม ID |
| GET | `/learning-sites/:slug` | ดูข้อมูลตาม Slug |
| POST | `/learning-sites` | สร้างแหล่งเรียนรู้ใหม่ |
| PUT | `/learning-sites/:id` | แก้ไขข้อมูล |
| DELETE | `/learning-sites/:id` | ลบข้อมูล |
| GET | `/learning-site-types` | ดูรายการประเภทแหล่งเรียนรู้ |

### Query Parameters (GET /learning-sites)
- `type` - กรองตามประเภท (MUSEUM, TEMPLE, etc.)
- `district` - กรองตามอำเภอ
- `q` - ค้นหาจาก title, description, content
- `page` - หน้าที่ (default: 1)
- `limit` - จำนวนต่อหน้า (default: 12)

---

## 🎨 Frontend Pages

### Public Pages

1. **Listing Page**
   - Path: `/chiang-rai-studies/learning-sites`
   - Features:
     - Grid layout (3 columns)
     - Filter by type (horizontal scroll bar)
     - Card with thumbnail, type badge, location, hours, admission
     - Featured badge

2. **Detail Page**
   - Path: `/chiang-rai-studies/learning-sites/[slug]`
   - Features:
     - Hero header with type badge
     - Image gallery (main + thumbnails)
     - Description & content (Rich Text)
     - Facilities list
     - Tags
     - Info sidebar (admission, hours, location, contact)
     - Google Maps embed (if lat/long provided)
     - Social sharing buttons

### Admin Pages

1. **Dashboard/List**
   - Path: `/chiang-rai-studies/admin/learning-sites`
   - Features:
     - Table view with search
     - Filter by type, district
     - Actions: View, Edit, Delete
     - Stats badges (Published, Featured)

2. **Create Page**
   - Path: `/chiang-rai-studies/admin/learning-sites/create`
   - Features:
     - 9 sections form:
       1. Basic Info (title, slug, type, description)
       2. Location (address, district, lat/long)
       3. Contact Info (phone, email, website, social)
       4. Operating Hours & Admission
       5. Thumbnail Upload
       6. Rich Text Content Editor (Quill)
       7. Facilities (checkboxes)
       8. Tags
       9. Publishing Options (Published, Featured, Author)

3. **Edit Page**
   - Path: `/chiang-rai-studies/admin/learning-sites/edit/[id]`
   - Features: Same as Create, but loads existing data

---

## 📝 Files Created/Modified

### Backend
- ✅ `backend/src/drizzle/schema.ts` - Added `chiangRaiLearningSites` table & enum
- ✅ `backend/src/chiang-rai/chiang-rai.service.ts` - Added CRUD methods
- ✅ `backend/src/chiang-rai/chiang-rai.controller.ts` - Added endpoints
- ✅ `backend/drizzle/migrations/0002_*.sql` - Migration file

### Frontend
- ✅ `frontend/app/chiang-rai-studies/learning-sites/page.tsx` - Public listing
- ✅ `frontend/app/chiang-rai-studies/learning-sites/[slug]/page.tsx` - Detail page
- ✅ `frontend/app/chiang-rai-studies/admin/learning-sites/page.tsx` - Admin list
- ✅ `frontend/app/chiang-rai-studies/admin/learning-sites/create/page.tsx` - Create form
- ✅ `frontend/app/chiang-rai-studies/admin/learning-sites/edit/[id]/page.tsx` - Edit form
- ✅ `frontend/app/chiang-rai-studies/admin/page.tsx` - Updated dashboard with stats

---

## 🚀 How to Use

### 1. Run Migration
```bash
cd backend
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 2. Start Development
```bash
# From project root
docker compose up -d
```

### 3. Access
- **Public Listing**: http://localhost:4000/chiang-rai-studies/learning-sites
- **Admin Dashboard**: http://localhost:4000/chiang-rai-studies/admin/learning-sites

---

## 🎯 Sample Data

The service includes lazy seeding with 3 sample learning sites:
1. **หอฝิ่น อุทยานสามเหลี่ยมทองคำ** (MUSEUM) - Chiang Saen
2. **วัดร่องขุ่น** (TEMPLE) - Mueang Chiang Rai
3. **ศูนย์วัฒนธรรมชาวเขา** (CULTURAL_CENTER) - Mueang Chiang Rai

These will be automatically created when the first API call is made.

---

## 🎨 Design System

### Colors (Chiang Rai Studies Theme)
- **Primary**: `#2e1065` (Deep Purple)
- **Secondary**: `#702963` (Byzantium/Purple)
- **Accent**: `#f97316` (Orange)
- **Background**: `#FAF5FF` (Light Purple)

### Type Badge Colors
- MUSEUM: Blue
- CULTURAL_CENTER: Purple
- COMMUNITY: Green
- TEMPLE: Orange
- HISTORICAL_SITE: Amber
- LOCAL_WISDOM: Teal
- ART_SPACE: Pink
- OTHER: Gray

---

## ✅ Features Checklist

- [x] Database schema with proper types & indexes
- [x] Lazy seeding with real Chiang Rai data
- [x] Full CRUD API endpoints
- [x] Search & filter (by type, district, keyword)
- [x] Pagination support
- [x] Public listing page with filters
- [x] Detail page with gallery & map
- [x] Admin dashboard integration
- [x] Admin CRUD forms
- [x] Rich text editor (Quill)
- [x] Image upload support
- [x] Facilities checkboxes
- [x] Tag management
- [x] SEO metadata (OpenGraph, Twitter Cards)
- [x] JSON-LD structured data
- [x] Responsive design (mobile-first)
- [x] Featured/Recommended badge
- [x] Publishing status (Published/Draft)

---

## 🔮 Future Enhancements

- [ ] Full-text search with PostgreSQL tsvector
- [ ] Advanced filtering (by facilities, admission type)
- [ ] User reviews & ratings
- [ ] Booking/reservation system
- [ ] Interactive map view
- [ ] Import/Export CSV
- [ ] Bulk operations
- [ ] Media library manager
- [ ] Multi-language support (EN/TH)
- [ ] Analytics dashboard

---

## 📞 Support

For questions or issues, contact: **ศูนย์เชียงรายศึกษา**
