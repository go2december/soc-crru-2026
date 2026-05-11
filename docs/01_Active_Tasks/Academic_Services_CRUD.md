# Academic Services System Design & Task Plan

> [!info] Status: Planning
> ระบบบริหารจัดการ "บริการวิชาการ" สำหรับคณะสังคมศาสตร์

## 🎯 1. System Design (การออกแบบระบบ)

### 1.1 Database Schema (Drizzle ORM)
สร้าง Table ใหม่ชื่อ `academic_services` เพื่อใช้เก็บโครงการหรือบริการวิชาการ
```typescript
// backend/src/database/schema/academic_services.ts
export const academicServices = pgTable('academic_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  serviceType: varchar('service_type', { length: 50 }).notNull(), // e.g., SOCIAL_SERVICE, CONSULTING
  area: varchar('area', { length: 255 }), // e.g., "ต.แม่ข้าวต้ม อ.เมือง จ.เชียงราย"
  status: varchar('status', { length: 50 }), // e.g., ONGOING, COMPLETED, RECRUITING
  coverImageUrl: text('cover_image_url'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});
```

### 1.2 API Endpoints (NestJS)
```text
GET    /api/academic-services          -> โหลดรายการโครงการ (Public)
GET    /api/academic-services/:id      -> โหลดรายละเอียด (Public)
GET    /api/academic-services/admin    -> โหลดรายการโครงการ (Admin)
POST   /api/academic-services          -> สร้างโครงการ (Admin)
PUT    /api/academic-services/:id      -> อัปเดต (Admin)
DELETE /api/academic-services/:id      -> ลบโครงการ (Admin)
```

### 1.3 Frontend Updates
- **Public Page (`/research/services/page.tsx`):**
  - Fetch ข้อมูลโครงการจาก API แทนการ Hardcode (รูปภาพ, ชื่อ, สถานะ)
  - หมวดหมู่ "Social Lab" ปรับให้เป็น External Link เปิดไปเว็บนอก
- **Admin Page (`/admin/academic-services/page.tsx`):**
  - สร้างหน้า Dashboard ตารางจัดการข้อมูล พร้อมปุ่ม เพิ่ม/แก้ไข/ลบ
  - ใช้ Component `UploadImage` ที่มีอยู่แล้วสำหรับอัปโหลดรูป Cover

---

## 📋 2. Implementation Plan (แผนการทำงาน)

### Phase 1: Backend & Database (API)
- [x] สร้าง Schema `academic_services.ts` และรัน Migration
- [x] สร้าง Module, Controller, Service ของ `academic-services`
- [x] ทดสอบ API CRUD ด้วย Swagger / Postman

### Phase 2: Admin Dashboard (Frontend)
- [x] สร้างหน้า `/admin/academic-services` เป็นตารางแสดงข้อมูล (DataTable)
- [x] สร้างหน้าฟอร์ม `/admin/academic-services/create` และ `[id]/edit`
- [x] เชื่อมต่อระบบ Upload รูปภาพ

### Phase 3: Public Page & Social Lab Link
- [x] แก้ไข `/research/services/page.tsx` ให้ดึงข้อมูล API 
- [x] ปรับแก้การ์ด `บริการห้องปฏิบัติการทางสังคมศาสตร์ (Social Lab)` ให้คลิกแล้วลิงก์ออกไปเว็บนอก
- [x] ทดสอบการรัน Build เพื่อความสมบูรณ์
