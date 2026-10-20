---
title: Redesign Plan - Academic Programs Hub & Detail Revamp (SOC-CRRU)
status: completed
created_at: 2026-10-19
tags:
  - frontend
  - ui-ux
  - redesign
  - programs
  - admissions
  - scholar-theme
---

# แผนการยกระดับและปรับโฉมระบบหลักสูตรการศึกษา (Academic Programs Redesign)

> [!NOTE] วัตถุประสงค์และแนวคิดการออกแบบ (Design Rationale)
> ยกระดับหน้า `/programs/` และ `/programs/[code]` ให้เป็น **High-Conversion Academic Discovery Portal** ที่มุ่งดึงดูดผู้เรียนและผู้ปกครอง (High Appeal & Clarity) ขับเคลื่อนด้วยข้อมูลจริงจากฐานข้อมูล 100% (Database-Driven) ภายใต้ **Scholar Theme** ขอบคมชัดอย่างมืออาชีพ (`rounded-sm`), สีกรมท่าลึกตัดทอง (`scholar-deep` & `scholar-gold`) ปราศจากสีต้องห้าม (No Purple/Violet) ตามกฎ `soc-crru-public-frontend`

---

## 1. การจับคู่ข้อมูลจริงจากฐานข้อมูล (Database-Driven Mapping)

จากข้อมูลจริง 7 หลักสูตรใน `soc_db` จะจัดกลุ่มความสนใจ (Interest Clusters) และสายอาชีพ (Career Tags) ดังนี้:

| กลุ่มความสนใจของผู้เรียน (Interest Cluster) | รหัสหลักสูตรใน DB | ระดับ | สายอาชีพเด่น (Careers) |
|---|---|---|---|
| **1. เทคโนโลยีภูมิสารสนเทศ & ข้อมูลเชิงพื้นที่** | `gis` | ป.ตรี | นักภูมิสารสนเทศ (GIS Specialist), นักสำรวจ/ทำแผนที่, นักวิเคราะห์ข้อมูลดาวเทียม, วางผังเมือง |
| **2. นวัตกรรมสังคมและการพัฒนาชุมชน** | `social-dev`, `social-sci` | ป.ตรี | นักนวัตกรรมสังคม, ผู้ประกอบการเพื่อสังคม (SE), CSR องค์กร, นักพัฒนาสังคม, นักวิเคราะห์นโยบาย |
| **3. พฤติกรรมมนุษย์และการพัฒนาองค์กร** | `social-psych` | ป.ตรี | นักจิตวิทยาองค์กร / HR, นักวิชาการศึกษา/แนะแนว, นักวิจัยพฤติกรรมผู้บริโภค, Life Coach |
| **4. ศิลปศาสตร์อาหารและคุณภาพชีวิต** | `home-eco` | ป.ตรี | นักโภชนาการ, เชฟ/ผู้ประกอบการร้านอาหาร, นักออกแบบงานฝีมือ, ครูคหกรรม |
| **5. ยุทธศาสตร์และการวิจัยพัฒนาภูมิภาค** | `regional-dev-ma`, `regional-dev-phd` | ป.โท-เอก | อาจารย์มหาวิทยาลัย, นักวิจัยระดับสูง, ที่ปรึกษาองค์กร, นักวางแผนกลยุทธ์, ผู้บริหารท้องถิ่น |

---

## 2. สถาปัตยกรรมและการปรับปรุงองค์ประกอบ (Architecture & Components)

### 2.1 หน้าศูนย์รวมหลักสูตร (`/programs`)
1. **Hero & Value Proposition Section**:
   - ข้อความ Hook ปลุกเร้าความสนใจด้านสังคมศาสตร์ประยุกต์แห่งอนาคต
   - แถบสถิติความเชื่อมั่น (100% กองทุน กยศ./กรอ., เครือข่ายฝึกงานองค์กรชั้นนำ, วุฒิการศึกษาที่ตลาดต้องการ)
   - แถบแจ้งเตือนรอบรับสมัคร (Admission Urgency Banner: TCAS มรภ.เชียงราย)
2. **Interactive Program Explorer (`ProgramsExplorerClient.tsx`)**:
   - **Live Search**: ค้นหาแบบเรียลไทม์ได้ทั้งชื่อสาขา, รหัส, วุฒิ, หรือชื่ออาชีพ
   - **Level Filter Tabs**: ทั้งหมด, ปริญญาตรี, ปริญญาโท, ปริญญาเอก (พร้อมตัวเลขนับจำนวนหลักสูตร)
   - **Interest Cluster Selector**: ปุ่มเลือกดูตาม 5 กลุ่มความสนใจเฉพาะหลักสูตรที่มีในฐานข้อมูล
   - **Career Tags Cloud**: รวมป้ายอาชีพจริงจากฐานข้อมูล สามารถคลิกเพื่อกรองสาขาวิชาที่เกี่ยวข้องได้ทันที
3. **High-Converting Program Cards (Sharp Cards `rounded-sm`)**:
   - รูปภาพ Banner จริงของสาขาจาก DB
   - ป้ายกำกับระดับปริญญา (Deep Blue / Gold / Accent) ปราศจากสีม่วง
   - หน่วยกิตรวม และระยะเวลาศึกษา
   - รายการอาชีพเด่น 3-4 อาชีพ
   - Action Links: ปุ่ม *"ดูรายละเอียดหลักสูตร"* + *"สมัครเรียนรอบล่าสุด"*
4. **Decision-Support Sections**:
   - ขั้นตอนการสมัครเรียน (How to Apply 4 Steps)
   - สิทธิประโยชน์ทุนการศึกษาและการสนับสนุนค่าครองชีพ
   - กล่องให้คำปรึกษาด่วน (Guidance Support & FAQ)

### 2.2 หน้ารายละเอียดหลักสูตร (`/programs/[code]` & `ProgramTemplate.tsx`)
1. **Editorial Hero Header**: ปรับขอบคมชัด ข้อมูลวุฒิการศึกษา และปุ่ม Download หลักสูตร มคอ.2 ควบคู่ปุ่มสมัคร
2. **Quick Spec Matrix**: สรุปโครงสร้างหน่วยกิต (วิชาศึกษาทั่วไป, วิชาเฉพาะ, วิชาเลือกเสรี, รวม)
3. **Career Pathway Showcase**: ขยายส่วนเส้นทางอาชีพให้โดดเด่น เป็นระเบียบ ชัดเจน
4. **Curriculum Highlights & PR Media**: วิดีโอแนะนำสาขา, คณาจารย์ประจำหลักสูตร และแกลเลอรีภาพกิจกรรม

---

## 3. ขั้นตอนการดำเนินงาน (Execution Phases)

- [x] **Phase 1**: สร้าง Client Component `ProgramsExplorerClient.tsx` สำหรับค้นหาและคัดกรองอัจฉริยะ (Search, Filter by Level, Career Tags, Interest Clusters)
- [x] **Phase 2**: ปรับปรุงหน้า `frontend/app/programs/page.tsx` ด้วยโครงสร้าง Hero, Credibility Stats, TCAS Urgency และ Sections ใหม่
- [x] **Phase 3**: ยกระดับ `ProgramTemplate.tsx` ตาม Scholar Theme (Sharp borders `rounded-sm`, ปรับสี, ปรับปรุงส่วนข้อมูลและโครงสร้าง)
- [x] **Phase 4**: ตรวจสอบ Accessibility, การแสดงผล Responsive (Mobile/Tablet/Desktop) และทดสอบ Build `npm run build`
