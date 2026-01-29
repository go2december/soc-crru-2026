---
description: แผนงานพัฒนา Web Application คณะสังคมศาสตร์ CRRU (Education First, Social Innovator & Lifelong Learning)
---

# 🚀 แผนพัฒนาเว็บไซต์คณะสังคมศาสตร์ มรภ.เชียงราย (SOC-CRRU 2026)

Workflow นี้อ้างอิงจาก Sitemap Design วันที่ 9 มกราคม 2569 โดยเน้นผู้เรียนเป็นศูนย์กลาง (Learner-Centric)

## 📌 Phase 1: Foundation & Design System (รากฐานและดีไซน์)
- [x] **Setup Project**: Next.js (Frontend) + NestJS (Backend) + Docker
- [x] **Theme Setup**: Tailwind CSS v4 + DaisyUI + Scholar Palette (Theme "socTheme")
- [x] **Global Layout**:
    - [x] ปรับ **Navbar** ให้ตรงกับ Sitemap ใหม่ (เปลี่ยน "หลักสูตร" เป็น "การจัดการศึกษา (Academics)" และจัดกลุ่มเมนูตามโครงสร้างใหม่)
    - [x] สร้าง **Footer** ที่มีข้อมูลติดต่อและ Social Links ครบถ้วน
    - [x] สร้าง **Breadcrumb** component สำหรับนำทาง
    - [x] **Branding Update**: ปรับเปลี่ยน Logo และชื่อหน่วยงาน (Navbar/Footer) เป็น "Faculty of Social Sciences"

## 🏠 Phase 2: Homepage (หน้าแรก)
- [x] **Hero Banner**: ภาพบรรยากาศ Area-Based + คำโปรย Vision + ปุ่ม Action หลัก
- [x] **Course Finder Section**: ระบบค้นหาหลักสูตร (ปริญญา/ระยะสั้น/ความสนใจ)
- [x] **Lifelong Learning Highlight**: แบนเนอร์ Credit Bank และคอร์ส Upskill/Reskill (รวมอยู่ใน Course Finder/Home)
- [x] **Social Impact Dashboard**: แสดง stats (ชุมชนที่ดูแล, นวัตกรรม)
- [x] **News & Events**: ข่าวประชาสัมพันธ์และกิจกรรมล่าสุด

## 📚 Phase 3: Academics & Learning (การจัดการศึกษา)
- [x] **Academics Landing Page**: ภาพรวมปรัชญาและ Learning Outcomes
- [x] **Programs List Page** (`/programs`):
    - [x] แสดงรายการหลักสูตรทั้งหมดจาก API
    - [x] Filter ตามระดับ: `?level=bachelor`, `?level=master`, `?level=doctoral`
    - [x] รองรับ degreeLevel ทั้ง `PHD` และ `DOCTORAL`
    - [x] Breadcrumb dynamic ตามระดับหลักสูตร
- [x] **Program Pages (Dynamic)**:
    - [x] สร้าง Template สำหรับหน้ารายละเอียดหลักสูตร (จุดเด่น, โครงสร้าง, อาชีพ, อาจารย์)
    - [x] หน้าแยกสาขา: พัฒนาสังคม, สังคมศาสตร์, คหกรรม, จิตวิทยา, GIS
    - [x] Breadcrumb แสดงระดับที่ถูกต้อง (ตรี/โท/เอก) ตาม data.level
- [x] **Lifelong Learning Module**:
    - [x] หน้า **Credit Bank**: ข้อมูลการสะสมหน่วยกิต
    - [x] หน้า **Short Courses**: รายการคอร์สฝึกอบรม พร้อมระบบ Smart Card (ระบุรองรับ Credit Bank)

## 🎓 Phase 4: Admissions & Research (รับสมัคร & วิจัย)
- [x] **Admission Center Page** (Gateway):
    - [x] **Hero Banner & Media**: รวมสื่อประชาสัมพันธ์ (Brochure/Video)
    - [x] **External Links**: เชื่อมต่อระบบรับสมัครมหาลัย (TCAS / Graduate School)
    - [x] **Schedule**: ตารางปฏิทินการรับสมัคร
    - [x] **Short Courses**: เชื่อมโยงหน้าระบบคลังหน่วยกิต
- [x] **Research & Innovation**:
    - [x] ฐานข้อมูลงานวิจัย (Searchable Table/List)
    - [x] **Local Startups Showcase**: แสดงผลงานนวัตกรรมชุมชน
    - [x] **Academic Services**: บริการวิชาการแก่สังคม

## 🏢 Phase 5: Organization & E-Service (องค์กร & บริการ)
- [x] **About Us Pages**:
    - [x] **Overview Page**: History, Vision, Mission, Identity (Refactored)
    - [x] **Strategic Plan Pages**:
        - [x] Main Strategy Page with Cards
        - [x] Dynamic Strategy Details Pages (`/about/strategy/[id]`) with Goals/Tactics
    - [x] **Organizational Structure**: Dedicated page for Org Chart
    - [x] **Staff Directory**: ระบบค้นหาอาจารย์และบุคลากร
- [x] **E-Service Portal**: หน้ารวมลิงก์บริการ (นักศึกษา/บุคลากร)

## ⚙️ Phase 6: Backend & Database (NestJS + Drizzle ORM)
- [x] **Database Schema Design**: ออกแบบตาราง Users, Courses, Staff, Research, News (Migrated to Drizzle)
- [x] **ORM Setup**: ติดตั้งและตั้งค่า Drizzle ORM + Drizzle Kit
- [x] **API Development**:
    - [x] CRUD หลักสูตร (Courses/Programs) - *Full data: highlights, careers, structure, concentrations*
    - [x] CRUD บุคลากร (Staff) - *Completed via Drizzle ORM*
    - [x] CRUD ภาควิชา (Departments)
    - [x] CRUD ข่าวสาร (News)
- [x] **Authentication & Admin Dashboard**:
    - [x] **Google OAuth**: รองรับ Login ด้วย @crru.ac.th (Mock Mode for Dev)
    - [x] **Role-Based Access Control (RBAC)**: ADMIN, EDITOR, STAFF
    - [x] **Admin Panel**:
        - [x] Dashboard Overview stats
        - [x] Staff Management (List/Edit/Link User Account)
        - [x] News Management (List/Create/Delete)
        - [x] User Management (Role assignment)
        - [x] **Layout**: Minimal Design (Hidden Main Navbar/Footer)
- [x] **Integration**: เชื่อมต่อ Frontend กับ API
    - [x] Programs List: `/programs` แสดงรายการทั้งหมด พร้อม filter ตามระดับ
    - [x] Programs Detail: Dynamic route `/programs/[code]` ดึงข้อมูลจาก API
    - [x] ProgramTemplate: Conditional rendering for concentrations (แสดงเฉพาะเมื่อมีข้อมูล)
    - [x] Hub Pages: `social-sci`, `home-eco` ใช้หน้า Static สำหรับเลือกวิชาเอก
    - [x] Staff Directory: เชื่อมต่อ `/about/staff` กับ `/api/staff` (Schema ใหม่ตาม Excel: staffType, academicPosition, adminPosition, education)

## 🧹 Phase 7: Optimization & Launch
- [ ] **SEO Optimization**: ตั้งค่า Meta tags ตามหลักสูตร
- [ ] **Performance Tuning**: ทำ Image optimization และ Caching
- [ ] **Deployment**: ตรวจสอบ Docker Compose สำหรับ Production

---
*Last Updated: 2026-01-29*

