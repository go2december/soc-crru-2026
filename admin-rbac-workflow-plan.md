# แผนแม่บท: การกำหนดสิทธิ์การใช้งาน Admin Dashboard (RBAC + Department Scope + Approval Workflow)

> **โมเดล:** Role-Based Access Control (RBAC) + Department-Scoped Multi-Tenancy + Draft/Review Approval Workflow  
> **เป้าหมาย:** จัดการระดับสิทธิ์ในระบบสำนักวิชาสังคมศาสตร์ มรภ.เชียงราย (SOC-CRRU) ให้รัดกุม ปลอดภัย และมีขั้นตอนการตรวจสอบเนื้อหาก่อนเผยแพร่

---

## 1. บริบทและสถาปัตยกรรมระดับสิทธิ์ (Role Hierarchy & Scope)

### 1.1 ลำดับขั้นบทบาทผู้ใช้งาน (Hierarchical Roles)

| Role | ระดับ (Level) | คำอธิบายและหน้าที่รับผิดชอบ | ขอบเขตข้อมูล (Scope) |
| :--- | :---: | :--- | :--- |
| **`ADMIN`** (Super Admin) | **Level 3** | ผู้ดูแลระบบสูงสุดของสำนักวิชา: จัดการ User, กำหนดบทบาท, สังกัด/ตำแหน่ง, ตั้งค่าระบบ, และมีสิทธิ์ Approve/Publish ทุกโมดูล | ทุกสาขา/ทุกหน่วยงาน (Global) |
| **`EDITOR`** (Content Editor / ประจำสาขา) | **Level 2** | ผู้จัดการเนื้อหา/คณาจารย์ผู้ดูแลข้อมูล: สร้าง/แก้ไข/ลบ ข้อมูลหลักสูตร วิจัย บริการวิชาการ, ร่างข่าวสารและพัสดุ | เฉพาะสังกัดตนเอง (`department_id`) ยกเว้นข่าวทั่วไปที่ขึ้นกับสิทธิ์ |
| **`STAFF`** (อาจารย์ / เจ้าหน้าที่) | **Level 1** | สมาชิกทั่วไปในสำนักวิชา: เข้าสู่ระบบเพื่อจัดการประวัติโปรไฟล์ส่วนตัว ผลงาน ผลงานวิจัยที่ตนเป็นสมาชิก | ข้อมูลของตนเอง (`userId / staffProfileId`) |
| **`GUEST`** (ผู้เข้าชม / รออนุมัติ) | **Level 0** | บัญชี @crru.ac.th ที่ล็อกอินใหม่แต่ยังไม่ได้รับการเปิดใช้งานหรือกำหนดบทบาท | ไม่มีสิทธิ์เขียน/แก้ไขใดๆ (Read-only / Blocked) |

---

## 2. เมทริกซ์สิทธิ์การเข้าถึงรายโมดูล (Access Control Matrix)

| โมดูล (Module / Resource) | `ADMIN` | `EDITOR` | `STAFF` | หมายเหตุ / เงื่อนไขเพิ่มเติม |
| :--- | :---: | :---: | :---: | :--- |
| **Dashboard ภาพรวม** | ดูได้ทั้งหมด | ดูได้ทั้งหมด | ดูสถิติของตนเอง | Level 1+ เข้าถึงได้ |
| **จัดการผู้ใช้ (`/users`)** | ✅ เต็มรูปแบบ | ❌ ไม่มีสิทธิ์ | ❌ ไม่มีสิทธิ์ | เฉพาะ Admin เท่านั้น |
| **จัดการสังกัด/ตำแหน่ง (`/departments`, `/positions`)** | ✅ จัดการได้ | ❌ ดูอย่างเดียว | ❌ ไม่มีสิทธิ์ | Admin เป็นผู้กำหนดโครงสร้างสำนักวิชา |
| **ข้อมูลบุคลากร (`/staff`)** | ✅ ทุกคน | ⚠️ เฉพาะในสาขาตนเอง | ⚠️ แก้ไขได้เฉพาะโปรไฟล์ตนเอง | Editor จัดการบุคลากรในสาขาของตน |
| **หลักสูตร (`/programs`)** | ✅ ทุกหลักสูตร | ⚠️ **เฉพาะหลักสูตรในสังกัด** | ❌ ดูอย่างเดียว | เชื่อมโยงผ่าน `department_id` |
| **คอร์สระยะสั้น/Credit Bank (`/short-courses`)** | ✅ ทุกคอร์ส | ⚠️ **เฉพาะคอร์สในสังกัด** | ❌ ดูอย่างเดียว | สัมพันธ์กับสาขาที่รับผิดชอบ |
| **งานวิจัย (`/research`)** | ✅ ทุกโครงการ | ⚠️ **เฉพาะโครงการในสังกัด** | ⚠️ เพิ่ม/แก้ไขโครงการที่ตนเป็นสมาชิก | Staff ร่วมเป็นผู้วิจัยได้ |
| **บริการวิชาการ (`/academic-services`)** | ✅ ทุกโครงการ | ⚠️ **เฉพาะโครงการในสังกัด** | ⚠️ เพิ่ม/แก้ไขโครงการที่ตนร่วม | Staff ร่วมเป็นสมาชิกได้ |
| **ข่าวสาร (`/news`)** | ✅ อนุมัติ/เผยแพร่ | 📝 **สร้าง/แก้ไข (ส่งตรวจ)** | ❌ ไม่มีสิทธิ์ | **Workflow: Draft → Review → Published** |
| **จัดซื้อจัดจ้าง (`/procurement`)** | ✅ อนุมัติ/เผยแพร่ | 📝 **สร้าง/แก้ไข (ส่งตรวจ)** | ❌ ไม่มีสิทธิ์ | **Workflow: Draft → Review → Published** |

---

## 3. Workflow การร่างและอนุมัติเนื้อหา (Draft & Approval Workflow)

ใช้สำหรับโมดูล **ข่าวสาร (`news`)** และ **จัดซื้อจัดจ้าง (`procurement_records`)**:

```
[ EDITOR / ผู้ร่าง ]
      │
      ├─► บันทึกฉบับร่าง (DRAFT)
      │
      └─► ยื่นขอตรวจสอบ (SUBMITTED / PENDING_REVIEW)
               │
               ▼
       [ ADMIN / ผู้ตรวจสอบ ]
         ┌─────┴───────────────┐
         ▼                     ▼
     [ REJECTED ]        [ APPROVED / PUBLISHED ]
   (ส่งกลับพร้อมเหตุผล)   (แสดงผลหน้าเว็บไซต์สาธารณะ)
```

### สถานะเนื้อหา (Publication Status Enum):
1. `DRAFT`: กำลังร่าง บันทึกไว้ยังไม่ส่งตรวจ (เห็นเฉพาะผู้สร้างและ Admin)
2. `PENDING_REVIEW`: ส่งขออนุมัติเผยแพร่ (ขึ้นแจ้งเตือน/Badge ใน Dashboard ของ Admin)
3. `APPROVED`: อนุมัติแล้ว (เตรียม Publish หรือตั้งเวลาเผยแพร่)
4. `PUBLISHED`: เผยแพร่สู่หน้าเว็บสาธารณะเรียบร้อย
5. `REJECTED`: ตีกลับแก้ไข (มีข้อความบันทึก `rejectReason`)

---

## 4. แผนการปรับปรุงฐานข้อมูล (Database Schema Plan)

### 4.1 ตารางผู้ใช้และสังกัด
- เพิ่ม `department_id` ในตาราง `users` (หรือเชื่อมโยง 1:1 กับ `staff_profiles.department_id`) เพื่อใช้ระบุ Department Scope ของผู้ใช้งาน

### 4.2 ตารางหลักสูตร / งานวิจัย / บริการวิชาการ
- เพิ่มหรือตรวจสอบ Foreign Key `department_id` ในตาราง `programs`, `short_courses` เพื่อใช้ในการกรอง Scope

### 4.3 โมดูลข่าวสารและพัสดุ (Workflow State)
- ในตาราง `news` และ `procurement_records`:
  - เพิ่ม `publication_status` enum: `['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED']`
  - เพิ่ม `reviewer_id` (uuid อ้างอิง `users.id`)
  - เพิ่ม `reviewed_at` (timestamp)
  - เพิ่ม `reject_reason` (text)

---

## 5. แผนการพัฒนาระบบ Backend (NestJS Monorepo)

1. **`DepartmentScopeGuard` & Interceptor:**
   - ตรวจสอบ `req.user.roles`:
     - หากเป็น `ADMIN` → Bypass Scope Filter (เข้าถึงได้ทั้งหมด)
     - หากเป็น `EDITOR` → Query อัตโนมัติ `where(eq(table.departmentId, req.user.departmentId))` และตรวจสอบสิทธิ์การ Write ว่าตรงกับสังกัดหรือไม่
2. **`WorkflowGuard` & State Machine:**
   - Endpoint เปลี่ยนสถานะเป็น `PUBLISHED` หรือ `APPROVED` จะต้องมี `Roles('ADMIN')` เท่านั้น
   - Editor มีสิทธิ์เปลี่ยนสถานะได้เฉพาะ `DRAFT` ↔ `PENDING_REVIEW`
3. **Audit Log & Notification:**
   - บันทึกประวัติการปรับสถานะว่าใครเป็นผู้อนุมัติหรือส่งตรวจ

---

## 6. แผนการพัฒนาระบบ Frontend (Next.js Admin Dashboard)

1. **Sidebar Navigation & Menu Filtering ([`layout.tsx`](file:///e:/web2026/soc-crru-web/frontend/app/admin/(dashboard)/layout.tsx)):**
   - ซ่อน/แสดงเมนูตาม Role Level
   - เพิ่ม Badge ตัวเลขแสดงรายการที่รออนุมัติ (**Pending Review**) สำหรับ Admin
2. **DataTable / List Filtering ตาม Department Scope:**
   - Dropdown สังกัดจะถูกล็อคตามสังกัดของผู้ใช้ (กรณี Editor) และเลือกอิสระได้กรณี Admin
3. **Action Bar & Status Badge:**
   - แสดงสถานะ Draft / รอตรวจสอบ / เผยแพร่แล้ว ด้วยสีสันที่ชัดเจน
   - ปุ่ม Action: "ส่งขออนุมัติ" (สำหรับ Editor), "อนุมัติเผยแพร่" / "ส่งกลับแก้ไข" (สำหรับ Admin)
4. **หน้าจัดการสิทธิ์ผู้ใช้งาน ([`/admin/users`](file:///e:/web2026/soc-crru-web/frontend/app/admin/(dashboard)/users/page.tsx)):**
   - เพิ่มฟิลด์เลือกกำหนดสังกัดสาขาวิชา (Department) ควบคู่กับ Role ให้กับผู้ใช้แต่ละคน

---

## 7. แผนดำเนินงานทีละขั้น (Implementation Roadmap)

- [x] **Phase 1: Database Migration (Drizzle)**
  - เพิ่ม Enum และคอลัมน์ `department_id`, `publication_status`, `reviewer_id`, `reject_reason`
  - รัน Database migration ด้วย script `migrate_rbac_workflow.ts` ผ่านสำเร็จ 100%
- [x] **Phase 2: Backend Guards & Scoped Services**
  - เพิ่ม `departmentId` ใน JWT Payload & Token Generation
  - เพิ่ม Endpoint `/api/auth/users/:id/department` สำหรับ Admin กำหนดสังกัด
  - ปรับปรุง `NewsService` & `NewsController`: เพิ่มสิทธิ์ Approve, Reject (พร้อมเหตุผล), Submit Review
  - ปรับปรุง `ProcurementService` & `ProcurementController`: เพิ่มสิทธิ์ Approve, Reject, Submit Review พร้อม Scoped Guard
  - Backend Build: ✅ ผ่านสำเร็จไม่มี Error
- [x] **Phase 3: Frontend Workflow UI & Scoped Views**
  - ปรับปรุงหน้า [`/admin/users`](file:///e:/web2026/soc-crru-web/frontend/app/admin/(dashboard)/users/page.tsx) แสดงคอลัมน์สังกัด และเปิดให้ Admin เลือก Department Scope ให้แต่ละคนได้
  - ปรับปรุงหน้า [`/admin/news`](file:///e:/web2026/soc-crru-web/frontend/app/admin/(dashboard)/news/page.tsx) มีแท็บสถานะ Workflow + ปุ่ม *"ส่งตรวจ"* สำหรับ Editor / ปุ่ม *"อนุมัติเผยแพร่ / ตีกลับแก้ไข"* สำหรับ Admin
  - ปรับปรุงหน้า [`/admin/procurement`](file:///e:/web2026/soc-crru-web/frontend/app/admin/(dashboard)/procurement/page.tsx) มีแท็บสถานะ Workflow + แสดง Badge สถานะ + ปุ่มควบคุมการอนุมัติ
  - Frontend Build: ✅ ผ่านสำเร็จ 77/77 หน้าไม่มี Error
- [x] **Phase 4: Department Scoping Enforcement & Pending Badges**
  - แสดง Pending Review Badge Counter บนแถบ Sidebar เมนู "ข่าวสาร" และ "จัดซื้อจัดจ้าง" เฉพาะ Admin
  - ป้องกันและตรวจสอบสิทธิ์ตามสังกัดสาขาวิชา (`departmentId`) ในโมดูล **หลักสูตร (Programs)** ทั้ง Backend API Guard + Frontend List Filter
  - เพิ่มการตรวจสอบสิทธิ์ตามสังกัดสาขาวิชาในโมดูล **งานวิจัย (Research)** และ **บริการวิชาการ (Academic Services)**
  - Full Stack Build: ✅ Backend Rspack + Frontend Next.js Turbopack ผ่าน 100%
- [x] **Phase 5: RBAC & Permission Control Dashboard (/admin/users)**
  - ยกระดับหน้า `/admin/users` สู่ **ศูนย์ควบคุมและแดชบอร์ดจัดการสิทธิ์ (RBAC & Permission Dashboard)**
  - แสดง KPI Cards 5 มิติ (รวมผู้ใช้, ผู้ดูแลระบบ, บรรณาธิการประจำสาขา, บุคลากร, ผู้เยี่ยมชม)
  - เพิ่มตัวกรองแบบ Dual Filters: กรองตาม Role และกรองตามสังกัด/สาขาวิชา (Department Scope)
  - เพิ่มแท็บ **เมทริกซ์สิทธิ์รายโมดูล (Access Control Matrix)** ให้ผู้บริหาร/แอดมินดูภาพรวมสิทธิ์ได้ในหน้าเดียว
  - อัปเดต Sidebar icon & label สู่ "จัดการสิทธิ์และผู้ใช้"
  - Frontend Build: ✅ Turbopack 77/77 static pages pass 100%

---

## ✅ PHASE 1-5 ALL COMPLETE
- Database Migration: ✅ Pass (Enum, Columns, Existing data synced)
- Backend API Gateway Build: ✅ Pass (Rspack compile success)
- Frontend Next.js Build: ✅ Pass (Turbopack 77/77 static pages compiled successfully)
- Date: 2026-10-12
