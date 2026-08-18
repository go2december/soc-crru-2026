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
- [ ] **Sitemap:** จัดทำ Dynamic `sitemap.xml` สำหรับ Next.js App Router
- [ ] **Robots.txt:** ตั้งค่า `robots.txt` ให้ Search Crawler เข้าถึงได้อย่างถูกต้อง
- [x] **SEO Meta:** ทุกหน้ามี Title, Description และ Open Graph tags ผ่าน Next.js Metadata API
- [x] **Mobile Optimization:** พัฒนาแบบ Mobile-First Responsive ด้วย Tailwind CSS
- [ ] **Structured Data:** ฝัง JSON-LD (`Organization`, `Article`, `Course`, `Person`)

### 📝 ส่วนที่ 2: เนื้อหาและวิชาการ (Content & Research Highlights)
- [x] **ข่าวประชาสัมพันธ์:** ระบบข่าวสารพร้อมระบบหมวดหมู่และภาพประกอบ
- [x] **บริการวิชาการ:** มีระบบจัดการโครงการบริการวิชาการ พร้อมแสดงพื้นที่และผลลัพธ์
- [x] **หน้านักวิจัย/อาจารย์:** แสดงประวัติ ความเชี่ยวชาญ และลิงก์ Google Scholar / ORCID / Scopus
- [ ] **Research Highlight:** หน้าบทความวิจัยเด่นพร้อม Citation Format และ DOI
- [ ] **คลังปัญญา:** เตรียม Metadata Tags (`citation_title`, `citation_author`, `citation_pdf_url`) สำหรับเอกสารเผยแพร่

### 📊 ส่วนที่ 3: ตัวชี้วัด Webometrics (Core Indicators)
- [ ] **Visibility (50%):** หน้าโครงการบริการวิชาการพร้อมแชร์ภายนอกและรับ Backlink
- [x] **Openness (10%):** รายชื่อคณาจารย์เชื่อม Google Scholar Profile, ORCID, Scopus Author ID
- [ ] **Excellence (40%):** จัดแสดงผลงานวิจัยระดับ Scopus และผลงานวิชาการเด่น

---

## 🎯 2. รายการงานที่ต้องดำเนินการถัดไป (Action Items)

1. [ ] ติดตั้ง Next.js `sitemap.ts` และ `robots.ts` ให้สร้าง Sitemap อัตโนมัติ
2. [ ] เพิ่ม Component JSON-LD Structured Data ในหน้าข่าวและโครงการ
3. [x] เพิ่มฟิลด์ Google Scholar, ORCID และ Scopus ID ในหน้าข้อมูลอาจารย์/บุคลากร (เสร็จสมบูรณ์ 2026-08-17)
4. [ ] รันการตรวจสอบ Technical SEO ผ่าน `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py` หรือ `.agent/skills/seo-fundamentals/scripts/seo_checker.py`

---
> [!note] 
> เมื่อตรวจสอบและพัฒนาระบบตามมาตรฐานครบถ้วนแล้ว ให้บันทึกผลและย้ายไฟล์นี้ไปที่ `[[99_Archive/]]` ตามกฎของ Obsidian PKM
