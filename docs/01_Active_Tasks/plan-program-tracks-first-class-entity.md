---
title: System Architecture Plan - Decoupled Academic Program Tracks & Concentrations
status: planning
created_at: 2026-10-20
tags:
  - architecture
  - database-design
  - backend
  - frontend
  - programs
  - concentrations
  - study-modes
---

# แผนสถาปัตยกรรมใหม่: ยกระดับ แขนงวิชา / วิชาเอก เป็น First-Class Entity แยกอิสระและเชื่อมโยงกับสาขาหลัก

> [!IMPORTANT] แนวคิดและวิสัยทัศน์ทางสถาปัตยกรรม (Core Architecture Vision)
> การแยก **"แขนงวิชา / กลุ่มวิชาเอก" (Program Tracks / Concentrations)** ออกมาเป็น Entity อิสระ (Relational Entity) ที่เชื่อมโยง (Foreign Key) กับ **"สาขาวิชาหลัก" (Parent Program)** เป็นแนวทางที่ **ถูกต้องและทรงพลังกว่าการเก็บแบบ JSONB ฝังในตารางเดิมอย่างมหาศาล**:
> 1. **สื่อและคอนเทนต์แยกอิสระ 100%**: แต่ละแขนงมี Banner, YouTube Video Embed, Facebook Page, คลังภาพกิจกรรม (Gallery), และไฟล์เล่มหลักสูตร มคอ.2 เป็นของตนเอง
> 2. **รองรับรูปแบบการศึกษาที่หลากหลาย (Study Modes)**: รองรับทั้ง **หลักสูตร 4 ปี ปกติ** และ **หลักสูตรเทียบโอน (ต่อเนื่อง 2 ปีหลัง)** รวมถึงระดับบัณฑิตศึกษา (ป.โท / ป.เอก)
> 3. **การจัดการในระบบ Admin มีมิติและยืดหยุ่นสูง**: แยกฟอร์มจัดการแขนงวิชา มี Uploader สำหรับวิดีโอและไฟล์ของแขนงนั้นโดยเฉพาะ ไม่ทำให้ฟอร์มสาขาหลักยาวและซับซ้อนเกินไป

---

## 1. เปรียบเทียบสถาปัตยกรรม (Architecture Comparison)

```mermaid
flowchart TD
    subgraph Old["สถาปัตยกรรมเดิม (Embedded JSONB)"]
        P1["ตาราง programs (สาขาหลัก)"]
        P1 -.->|jsonb column| C1["concentrations [{title, desc}]"]
        note1["ข้อจำกัด: สื่อ/วิดีโอปะปนกับสาขาหลัก, รองรับเทียบโอนยาก, จัดการใน admin ซับซ้อน"]
    end

    subgraph New["สถาปัตยกรรมใหม่ที่เสนอ (Decoupled Relational Model)"]
        Programs["ตาราง programs (สาขาวิชาหลัก 7 สาขา)"]
        Tracks["ตาราง program_tracks (แขนงวิชา / วิชาเอก)"]
        
        Programs ===>|1 : N (One-to-Many)| Tracks
        
        Tracks --> TMedia["สื่ออิสระ: Banner, YouTube, Gallery, PDF มคอ."]
        Tracks --> TModes["รูปแบบ: 4 ปีปกติ / เทียบโอน 2 ปีหลัง / โท-เอก"]
        Tracks --> TContent["ปรัชญา, จุดเด่น, เส้นทางอาชีพ, โครงสร้างหน่วยกิต"]
    end
```

---

## 2. โครงสร้างฐานข้อมูลใหม่ (Proposed Relational Schema)

### ตารางใหม่: `program_tracks`
```sql
CREATE TABLE program_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL, -- e.g. 'culinary-and-service', 'applied-home-economics'
    name_th VARCHAR(255) NOT NULL, -- e.g. 'วิชาเอกการประกอบอาหารและบริการ'
    name_en VARCHAR(255),          -- e.g. 'Culinary and Service Major'
    track_type VARCHAR(50) DEFAULT 'MAJOR', -- 'CONCENTRATION' (แขนง), 'MAJOR' (วิชาเอก), 'MINOR' (วิชาโท)
    degree_title_th VARCHAR(255),
    degree_title_en VARCHAR(255),
    
    -- รูปแบบการศึกษา (Study Modes / Program Plans)
    study_plan_type VARCHAR(50) DEFAULT 'REGULAR_4YR', 
    -- 'REGULAR_4YR' (4 ปีปกติ), 'TRANSFER_2YR' (เทียบโอน 2 ปีหลัง), 'GRADUATE' (บัณฑิตศึกษา)
    
    description TEXT,
    structure JSONB,           -- { general, major, freeElective, totalCredits }
    careers TEXT[],            -- รายการอาชีพเฉพาะทาง
    highlights JSONB,          -- จุดเด่นเฉพาะแขนง
    
    -- สื่อและช่องทางโซเชียลมีเดียเฉพาะแขนง (Independent Media & Multi-Channel Social)
    banner_url VARCHAR(500),
    curriculum_url VARCHAR(500),
    youtube_video_url VARCHAR(500),
    facebook_video_url VARCHAR(500),
    social_links JSONB,        -- { facebook, tiktok, instagram, youtube, line }
    gallery_images TEXT[],
    attachments JSONB,
    
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT uq_program_track_code UNIQUE (program_id, code)
);
```

---

## 3. การแสดงผลและการเชื่อมโยงในหน้าเว็บ (Frontend UX & Public Flow)

### 3.1 หน้าสาขาวิชาหลัก (`/programs/[code]`)
- แสดงภาพรวมของสาขา
- มีแถบ **"แขนงวิชาและรูปแบบการศึกษาที่เปิดสอน"** พร้อมป้ายระบุประเภท:
  - `[4 ปี ปกติ]` หรือ `[เทียบโอน 2 ปีหลัง]`
  - พรีวิวภาพ Banner และวิดีโอแนะนำสั้นๆ
  - ปุ่มคลิกดูรายละเอียดฉบับเต็มของแขนงนั้น

### 3.2 หน้าแขนงวิชาเฉพาะ (`/programs/[code]/[track]` หรือ `/tracks/[slug]`)
- แสดงผลด้วย **Full Scholar Academic Template**:
  - Banner และวิดีโอ YouTube ของแขนงนั้นโดยเฉพาะ
  - ระบุชัดเจนว่าเป็น แผน 4 ปี หรือ แผนเทียบโอน 2 ปีหลัง
  - โครงสร้างหน่วยกิตเฉพาะแขนง
  - แกลเลอรีภาพผลงาน/กิจกรรมของแขนง (เช่น ภาพการทำอาหาร, ผลงานศิลปวัฒนธรรม)
  - Breadcrumb ชี้กลับไปยังสาขาหลัก และมีแถบสลับไปดูแขนงอื่นๆ ในสาขาเดียวกันได้อย่างสะดวก

---

## 3. สื่อโซเชียลมีเดียหลายช่องทาง (Multi-Channel Social Links)

รองรับการระบุลิงก์โซเชียลมีเดียเฉพาะของแต่ละสาขาหลัก และแต่ละแขนงวิชา:
- `facebook`: Facebook Fanpage / Group
- `tiktok`: TikTok Channel (ดึงดูดกลุ่มนักเรียนมัธยมปลาย TCAS)
- `instagram`: Instagram Profile (ภาพกิจกรรม/ผลงานนักศึกษา)
- `youtube`: YouTube Channel / Playlist
- `line`: Line Official Account หรือ OpenChat ประจำสาขา/แขนง

---

## 4. ระบบการกระจายสิทธิ์ (Role-Based Access Control: RBAC)

การอนุญาตให้ **บุคลากรประจำสาขาวิชา** สามารถแก้ไขข้อมูลสาขาและแขนงวิชาของตนเองได้:
1. **ผู้ดูแลระบบ (ADMIN / SUPERADMIN)**: มีสิทธิ์ดูและแก้ไขทุกสาขาวิชา และทุกแขนงวิชาในระบบ
2. **บุคลากรประจำสาขาวิชา (STAFF / EDITOR)**:
   - ตรวจสอบผ่าน `user.departmentId === program.departmentId` หรือ เป็นอาจารย์ที่มีรายชื่อใน `program_instructors` ของหลักสูตรนั้น
   - สามารถแก้ไขเฉพาะข้อมูลสาขา แขนงวิชา สื่อโซเชียล ภาพแกลเลอรี และวิดีโอของสาขาที่ตนเองสังกัดเท่านั้น
   - ป้องกันไม่ให้แก้ไขข้อมูลของสาขาวิชาอื่น

---

## 5. แผนการดำเนินงาน 4 เฟส (4-Phase Implementation Plan)

- [ ] **Phase 1: Database Migration & Schema Design**
  - สร้างตาราง `program_tracks` ใน `backend/libs/database/src/schema.ts`
  - ทำ Data Migration โอนข้อมูล 4 แขนงวิชาเดิมที่มีอยู่ไปยังตารางใหม่ พร้อมเชื่อม Foreign Key ไปยัง `programs`
- [ ] **Phase 2: Backend API, Social Links & Departmental RBAC**
  - เพิ่มฟิลด์ `social_links` ใน `programs` และ `program_tracks` (facebook, tiktok, instagram, youtube, line)
  - พัฒนา Endpoints:
    - `GET /api/programs/:id/tracks` (ดึงแขนงทั้งหมดของสาขา)
    - `GET /api/tracks/:code` หรือ `GET /api/programs/:code/tracks/:trackCode`
    - CRUD API สำหรับ Admin: `POST/PATCH/DELETE /api/tracks`
  - เพิ่ม Guard ตรวจสอบสิทธิ์ (Department & Program Ownership Guard):
    - Admin/SuperAdmin: แก้ไขได้ทุกสาขา
    - Staff/Editor: แก้ไขได้เฉพาะสาขาวิชาและแขนงวิชาที่ตนเองสังกัด (`user.departmentId === program.departmentId` หรือ เป็นอาจารย์ประจำหลักสูตร)
- [ ] **Phase 3: Admin Management UI (Tracks, Socials & Permissions)**
  - เพิ่มส่วนกรอก Social Media Links (Facebook, TikTok, Instagram, YouTube, Line) ในหน้าแก้ไข
  - จัดการสิทธิ์การแสดงผลในหน้า Admin ตามผู้ใช้งานที่ล็อกอิน (แสดงเฉพาะสาขาที่สังกัด หรือแจ้งเตือน Read-Only หากไม่มีสิทธิ์)
  - แยกแท็บหรือหน้าจัดการแขนงวิชา พร้อมตัวเลือกรูปแบบการศึกษา (4 ปีปกติ / เทียบโอน 2 ปีหลัง)
  - รองรับการอัปโหลด YouTube, Gallery และไฟล์ PDF แยกเฉพาะของแขนง
- [ ] **Phase 4: Frontend Redesign & Polish**
  - ปรับหน้า `/programs/[code]` ให้ดึงข้อมูลแขนงจากตารางใหม่
  - ปรับหน้า `/programs/[code]/[track]` ให้ดึงสื่อ YouTube และ Gallery เฉพาะแขนงมาแสดงผลอย่างเต็มรูปแบบ
