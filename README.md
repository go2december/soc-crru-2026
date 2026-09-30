# SOC-CRRU Web Platform

> เว็บไซต์ทางการและระบบจัดการสารสนเทศ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย (Faculty of Social Sciences, Chiang Rai Rajabhat University) พร้อมระบบศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)

---

## 📖 ศูนย์กลางเอกสารและสถาปัตยกรรม (Documentation Hub)

โปรเจกต์นี้จัดการเอกสาร แผนงาน และสถาปัตยกรรมด้วยระบบ **Obsidian PKM (Map of Content)** โดยมีจุดเริ่มต้นหลักอยู่ที่:

* **[docs/00_Dashboard.md](docs/00_Dashboard.md)**: **สารบัญหลัก (MOC)** รวมลิงก์สู่แผนผังระบบ, สถาปัตยกรรม, กฎการพัฒนา และกรุเอกสารทั้งหมด
* **[docs/01_Active_Tasks/Current_Status.md](docs/01_Active_Tasks/Current_Status.md)**: สถานะความคืบหน้าระบบและงานที่กำลังดำเนินการล่าสุด
* **[docs/04_Webometrics_Guidelines/](docs/04_Webometrics_Guidelines)**: มาตรฐานการจัดอันดับ Webometrics, Technical SEO, Core Web Vitals และโครงสร้างหน้าอาจารย์/นักวิจัย
* **[docs/WINDOWS_DEPLOYMENT.md](docs/WINDOWS_DEPLOYMENT.md)**: แนวทางการติดตั้งและรัน Production บน Windows Server

---

## 🏗️ Tech Stack & Codebase Structure

โปรเจกต์ใช้โครงสร้าง **Full-stack Monorepo / Multi-tier**:

```plaintext
soc-crru-web/
├── frontend/             # Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript
├── backend/              # NestJS Monorepo (Apps & Libs), PostgreSQL 18, Drizzle ORM
├── database/             # PostgreSQL data, backups, and migration scripts
├── docs/                 # Obsidian PKM Documentation Hub & MOC
└── .agent/               # AI Developer Rules, Specialized Agents & Skills
```

### 1. Frontend (`frontend/`)
* **Framework:** Next.js 16 (App Router), React 19
* **Styling:** Tailwind CSS v4, DaisyUI, Radix UI
* **Design Identity:** **Sharp Theme** (`rounded-sm` ขอบมนเฉียบคม เข้ากับอัตลักษณ์มหาวิทยาลัย), ห้ามใช้โทนสีม่วง (Purple Ban)
* **Portals:** เว็บไซต์คณะสังคมศาสตร์ และศูนย์เชียงรายศึกษา (แยก Route ชัดเจน)

### 2. Backend (`backend/`)
* **Framework:** NestJS 12 (Monorepo architecture with `apps/` and `libs/`)
* **Database & ORM:** PostgreSQL 18, Drizzle ORM
* **Authentication:** JWT, Passport, Google OAuth
* **Validation:** Class-validator, Class-transformer, Zod

### 3. Infrastructure (`docker-compose.yml`)
* Dockerized PostgreSQL 18 พร้อมระบบ Backup อัตโนมัติใน `database/backups`

---

## 🚀 เริ่มต้นใช้งานในโหมดพัฒนา (Quick Start)

### 1. รันฐานข้อมูลด้วย Docker
```bash
docker compose up -d postgres
```

### 2. รัน Backend API
```bash
cd backend
npm install
npm run start:dev
```
*API รันที่:* `http://localhost:4000` (หรือตามค่าใน `.env`)

### 3. รัน Frontend Web
```bash
cd frontend
npm install
npm run dev
```
*Web รันที่:* `http://localhost:3000`

---

## 🎨 ข้อกำหนดและมาตรฐานการออกแบบ (Design Standards)
* ข้อกำหนด UI/UX ดูได้ที่ [.agent/agents/frontend-specialist.md](.agent/agents/frontend-specialist.md)
* ข้อกำหนด Admin Dashboard ดูได้ที่ [.agent/skills/soc-crru-admin-dashboard/SKILL.md](.agent/skills/soc-crru-admin-dashboard/SKILL.md)
* สถาปัตยกรรม Backend & Database ดูได้ที่ [.agent/skills/soc-crru-backend-nest-drizzle/SKILL.md](.agent/skills/soc-crru-backend-nest-drizzle/SKILL.md)
