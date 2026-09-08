---
title: "SOC-CRRU Project Webometrics Audit & Action Tracker"
status: "active"
tags:
  - active-task
  - webometrics
  - audit
  - soc-crru
updated_at: "2026-08-17"
---

# 🔍 SOC-CRRU Webometrics Audit & Action Tracker
> **แบบตรวจสอบและติดตามผลการดำเนินงานจริงของโปรเจกต์ SOC-CRRU**  
> อ้างอิงตาม: `[[04_Webometrics_Guidelines/00_Webometrics_MOC|Webometrics Standard MOC]]`

---

## 🚀 1. สถานะการตรวจสอบโปรเจกต์ SOC-CRRU

### ⚙️ ส่วนที่ 1: มาตรฐานโครงสร้างและเทคนิค (Technical & SEO)
- [x] **โดเมนและ URL:** โครงสร้าง URL Clean & Semantic (`/news`, `/academic-services`, `/faculty`)
- [x] **ความปลอดภัย:** รองรับ HTTPS พร้อมใช้งาน
- [x] **Sitemap:** จัดทำ Dynamic `sitemap.xml` สำหรับ Next.js App Router (ดึง ข่าว, อาจารย์, วิจัย, บริการวิชาการ, คลังเชียงรายศึกษา)
- [x] **Robots.txt:** ตั้งค่า `robots.txt` ให้ Search Crawler เข้าถึงได้อย่างถูกต้องพร้อมชี้ Sitemap
- [x] **SEO Meta:** ทุกหน้ามี Title, Description และ Open Graph tags ผ่าน Next.js Metadata API
- [x] **Mobile Optimization:** พัฒนาแบบ Mobile-First Responsive ด้วย Tailwind CSS
- [x] **Structured Data:** ฝัง JSON-LD (`EducationalOrganization`, `NewsArticle`, `ResearchProject`, `Person` พร้อม `sameAs`)

### 📝 ส่วนที่ 2: เนื้อหาและวิชาการ (Content & Research Highlights)
- [x] **ข่าวประชาสัมพันธ์:** ระบบข่าวสารพร้อมระบบหมวดหมู่และภาพประกอบ
- [x] **บริการวิชาการ:** มีระบบจัดการโครงการบริการวิชาการ พร้อมแสดงพื้นที่และผลลัพธ์
- [x] **หน้านักวิจัย/อาจารย์:** แสดงประวัติ ความเชี่ยวชาญ และลิงก์ Google Scholar / ORCID / Scopus
- [x] **Research Highlight & Citation:** หน้าบทความวิจัยเด่นพร้อมเครื่องมืออ้างอิง (APA, IEEE, Vancouver, BibTeX, .RIS) และ DOI
- [x] **คลังปัญญา & Highwire Press:** ติดตั้ง Metadata Tags (`citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`, `citation_journal_title`, `citation_doi`) สำหรับ Google Scholar Indexing

### 📊 ส่วนที่ 3: ตัวชี้วัด Webometrics (Core Indicators)
- [x] **Visibility (50%):** หน้าโครงการบริการวิชาการพร้อมแชร์ภายนอกและรับ Backlink
- [x] **Openness (10%):** รายชื่อคณาจารย์เชื่อม Google Scholar Profile, ORCID, Scopus Author ID และเปิดเผยข้อมูลวิจัย
- [x] **Excellence (40%):** จัดแสดงผลงานวิจัยระดับ Scopus / TCI พร้อม Highwire Press Citation Tags

---

## 🎯 2. รายการงานที่ต้องดำเนินการถัดไป (Action Items)

1. [x] ติดตั้ง Next.js `sitemap.ts` และ `robots.ts` ให้สร้าง Sitemap อัตโนมัติ (เสร็จสมบูรณ์ 2026-08-18)
2. [x] เพิ่ม Component JSON-LD Structured Data ในหน้าเว็บหลัก ข่าว อาจารย์ และโครงการ (เสร็จสมบูรณ์ 2026-08-18)
3. [x] เพิ่มฟิลด์ Google Scholar, ORCID และ Scopus ID ในหน้าข้อมูลอาจารย์/บุคลากร (เสร็จสมบูรณ์ 2026-08-17)
4. [x] ติดตั้ง Google Scholar Citation Meta Tags และปุ่มคัดลอกการอ้างอิงผลงานวิจัย (เสร็จสมบูรณ์ 2026-08-18)
5. [ ] ขัดเกลาหน้ารายละเอียดบทความและแหล่งเรียนรู้ศูนย์เชียงรายศึกษา (Chiang Rai Studies Polish)

---
> [!note] 
> เมื่อตรวจสอบและพัฒนาระบบตามมาตรฐานครบถ้วนแล้ว ให้บันทึกผลและย้ายไฟล์นี้ไปที่ `[[99_Archive/]]` ตามกฎของ Obsidian PKM
