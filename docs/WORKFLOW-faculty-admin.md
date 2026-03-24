# Faculty Admin Workflow
**Updated:** March 24, 2026

## ภาพรวมกระบวนการทำงาน

ระบบ Admin ของคณะใช้งานภายใต้ `/admin` สำหรับจัดการข้อมูลหลักของเว็บไซต์คณะ เช่น บุคลากร ภาควิชา ตำแหน่ง ผู้ใช้ และข่าวสาร โดยใช้ระบบ Authentication ชุดเดียวกับ backend หลักของโปรเจกต์

## บทบาทของเอกสาร (Document Role)

- ไฟล์นี้เป็น **human-readable workflow** สำหรับอธิบายภาพรวมการทำงานของระบบ Faculty admin
- workflow สำหรับใช้งานเชิงปฏิบัติการใน IDE/agent ถูกแยกไว้ที่ `.windsurf/workflows/faculty-admin.md`
- หากมีการเปลี่ยนขั้นตอนการทำงานจริง ควรอัปเดตทั้งไฟล์นี้และ executable workflow ให้สอดคล้องกัน

---

## ระบบ Authentication

### 1. Login Flow
```text
/admin/login
  ↓ (Google/Dev Login)
/api/auth/google หรือ /api/auth/dev/login
  ↓ (Redirect with token)
/admin/callback?token=xxx
  ↓ (Store token, Redirect)
/admin/(dashboard)/dashboard
```

### 2. API Endpoints (Authentication)
- **`GET /api/auth/google`** - เริ่ม Google OAuth
- **`GET /api/auth/dev/login`** - Developer Bypass (สำหรับ dev)
- **`GET /api/auth/profile`** - ดึงข้อมูล user (ต้องมี token)
- **`GET /api/auth/google/callback`** - Google OAuth callback

### 3. Token Management
- เก็บ token ฝั่ง client ตาม implementation ของหน้า admin
- Layout หรือ route guard ต้องตรวจสอบ token ก่อนให้เข้าหน้า dashboard
- ถ้าไม่มี token หรือ token ไม่ถูกต้อง → redirect ไปหน้า login

---

## โครงสร้างหน้า Admin

```text
/admin/
├── login                   # เข้าสู่ระบบ
├── callback                # Auth callback
└── (dashboard)/
    ├── dashboard           # แดชบอร์ด
    ├── staff               # จัดการบุคลากร
    ├── departments         # จัดการภาควิชา
    ├── positions           # จัดการตำแหน่ง
    ├── users               # จัดการผู้ใช้
    └── news                # จัดการข่าวสาร
```

---

## องค์ประกอบหลักของแดชบอร์ด (Dashboard Features)

### Stats / Summary
- จำนวนข้อมูลสำคัญในระบบ
- สถานะข้อมูลพื้นฐานของคณะ
- quick links ไปยังหน้าจัดการหลัก

### Quick Actions
- เพิ่มบุคลากรใหม่
- เพิ่มภาควิชา
- เพิ่มตำแหน่ง
- สร้างข่าวสารใหม่

---

## งานจัดการข้อมูลหลัก (CRUD Operations)

### 1. Staff Management
- **List**: ดูรายการบุคลากรทั้งหมด
- **Create**: เพิ่มบุคลากรใหม่
- **Edit**: แก้ไขข้อมูลบุคลากร
- **Delete**: ลบข้อมูลบุคลากร

### 2. Departments Management
- **List**: ดูรายการภาควิชา
- **Create**: เพิ่มภาควิชา
- **Edit**: แก้ไขภาควิชา
- **Delete**: ลบภาควิชา

### 3. Positions Management
- **List**: ดูรายการตำแหน่ง
- **Create**: เพิ่มตำแหน่ง
- **Edit**: แก้ไขตำแหน่ง
- **Delete**: ลบตำแหน่ง

### 4. Users Management
- **List**: ดูรายการผู้ใช้
- **Create/Edit**: จัดการข้อมูลผู้ใช้ตามสิทธิ์ที่ระบบรองรับ
- **Delete**: ลบหรือปิดการใช้งานตาม implementation

### 5. News Management
- **List**: ดูรายการข่าวสาร
- **Create**: สร้างข่าวใหม่
- **Edit**: แก้ไขข่าว
- **Delete**: ลบข่าว
- **Media**: รองรับรูปภาพหลายภาพสำหรับหน้า detail ข่าว
- **Attachments**: รองรับเอกสารแนบสำหรับดาวน์โหลด เช่น PDF/DOCX
- **Category**: รองรับหมวด `สมัครงาน` เพิ่มเติมจากข่าว/กิจกรรม/ประกาศ
- **Public Flow**: ควรตรวจความสอดคล้องกับหน้า public listing/detail เสมอเมื่อมีการเปลี่ยนแปลง

---

## แนวทางการจัดการรูปภาพ (Image Handling Guidance)

- การอัปโหลดรูปต้องใช้ endpoint ที่ถูกต้องภายใต้ `/api/upload/...`
- ข้อมูลรูปภาพในฐานข้อมูลควรเก็บเป็น relative path ตาม convention ของโปรเจกต์
- หน้าแสดงผลต้อง resolve URL ให้ตรงกับ environment ปัจจุบัน
- หากมีการลบหรือแทนที่รูป ควรตรวจผลกระทบกับหน้า public และ admin preview
- สำหรับ Faculty news ต้องรวมการลบไฟล์แนบที่อยู่ใน `/uploads/news/attachments` เมื่อมีการลบหรือแทนที่รายการ

---

## ประเด็นสำคัญที่ต้องตรวจเสมอ (Known Checks)

### 1. API Prefix
- Frontend ฝั่ง admin ต้องเรียก API ผ่าน path ที่มี `/api/` prefix ให้ถูกต้อง

### 2. Auth Redirect Flow
- ต้องไม่เกิด login loop บนหน้า login/callback/dashboard

### 3. Public/Admin Consistency
- ถ้าแก้ข้อมูลข่าวหรือบุคลากร ต้องตรวจว่าหน้า public ที่เกี่ยวข้องยัง render ได้ถูกต้อง

### 4. Image URL Consistency
- ต้องไม่เก็บ absolute backend-only URL ลงฐานข้อมูล

---

## จุดเชื่อมต่อ API หลัก (Key API Surface)

```text
Auth:
  GET    /api/auth/google
  GET    /api/auth/google/callback
  GET    /api/auth/dev/login
  GET    /api/auth/profile

Staff:
  GET    /api/staff
  GET    /api/staff/:id
  POST   /api/staff
  PUT    /api/staff/:id
  DELETE /api/staff/:id

Departments:
  GET    /api/departments
  POST   /api/departments
  PUT    /api/departments/:id
  DELETE /api/departments/:id

News:
  GET    /api/news
  GET    /api/news/slug/:slug
  GET    /api/news/admin/all
  GET    /api/news/:id
  POST   /api/news
  PATCH  /api/news/:id
  DELETE /api/news/:id

Upload:
  POST   /api/upload/news
  POST   /api/upload/news/attachment
  DELETE /api/upload/news
```

---

## Next Steps

1. **Research Search/Filter** - ทำส่วนค้นหาและกรองข้อมูลวิจัย
2. **SEO Coverage** - ตรวจ metadata สำหรับ public routes ให้ครบ
3. **Responsive Audit** - ตรวจ mobile/tablet ในหน้าสำคัญ
4. **Content Population** - เติมข้อมูลจริงในหน้า public และข่าวสาร
5. **Production Readiness** - เตรียม deploy และ verification flow

---

## ไฟล์ที่เกี่ยวข้อง (Related Workflow Files)

- `docs/WORKFLOW-project-status.md` → consolidated project status snapshot
- `docs/PLAN-soc-crru-baseline.md` → Faculty-side baseline plan
- `docs/PLAN-workflow-standardization.md` → documentation governance rules
- `.windsurf/workflows/faculty-admin.md` → executable Faculty admin workflow
- `.windsurf/workflows/local-deployment.md` → executable workflow for local deployment and release preparation
- `.windsurf/workflows/release-checklist.md` → executable workflow for QA, SEO, responsive, and release readiness
