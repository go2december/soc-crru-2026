# แผนงานการพัฒนา: ระบบปฏิทินกิจกรรมสำนักวิชา (/eservice/calendar)

> **โมเดลการทำงาน:** Next.js Server-side Google Calendar iCal Synchronization + Dual-View Interactive Client  
> **แหล่งข้อมูล:** Google Calendar (`c_classroome6d5584c@group.calendar.google.com`)  
> **เป้าหมาย:** แสดงปฏิทินแบบเต็มเดือน (Full Month Grid) และมุมมองรายการ (Agenda List) ที่สวยงาม รวดเร็ว และดึงข้อมูลสดตรงตามข้อมูลดิบของ Google Calendar

---

## 1. ผลการสำรวจทางเทคนิค (Technical Survey & Validation)

- **การเข้าถึงข้อมูล (Data Source):** ตรวจสอบแล้วพบว่า Google Calendar iCal Feed (`.ics`) เปิดสาธารณะ (Public HTTP 200 OK) อยู่แล้วที่:
  `https://calendar.google.com/calendar/ical/c_classroome6d5584c%40group.calendar.google.com/public/basic.ics`
- **ปฏิทินชื่อ:** `SOCIAL-MEETING` มีกิจกรรมจริงในระบบ เช่น "สอบกลางภาค", "สอบปลายภาค"
- **การจัดการความเบาของระบบ (Zero Bloat / Ponytail Rule):**
  - ไม่ต้องติดตั้งไลบรารีปฏิทินขนาดใหญ่ (เช่น FullCalendar / React-Big-Calendar)
  - ใช้ `date-fns` (v4.1.0) ที่มีอยู่ใน `frontend/package.json` จัดการวันที่ สัปดาห์ และเดือน
  - เขียนตัว Parse RFC 5545 (`.ics`) แบบ Lightweight TypeScript ไร้ Dependency เพิ่มเติม
  - ทำ Caching ผ่าน Next.js Route Cache (`revalidate: 1800` วินาที / 30 นาที) ป้องกัน Rate Limit และโหลดเร็วระดับ Instant

---

## 2. โครงสร้างไฟล์และหน้าที่รับผิดชอบ (File Architecture)

```
frontend/
├── lib/
│   └── calendar/
│       └── ical-parser.ts         # Utility ฟังก์ชัน Parse ข้อมูลดิบ .ics เป็น TypeScript Interface (EventItem)
├── app/
│   ├── api/
│   │   └── calendar/
│   │       └── route.ts           # API Route ดึง .ics จาก Google พร้อม Server Cache (ISR 30 นาที)
│   └── eservice/
│       └── calendar/
│           ├── page.tsx           # Server Component โหลดข้อมูลเบื้องต้น + SEO Metadata + Header
│           └── CalendarClient.tsx # Client Component ควบคุม State, สลับ Grid/List View, Modal รายละเอียด
```

---

## 3. รายละเอียดการออกแบบ UI/UX (UI/UX Specifications)

### 3.1 มุมมองปฏิทินเต็มเดือน (Full Month Grid View)
- แสดงหัวตาราง 7 วัน (อา. - ส.)
- แสดงวันที่ของเดือนปัจจุบันชัดเจน และมีวันที่ของเดือนก่อนหน้า/ถัดไป (Faded) เพื่อให้ตารางครบ 35-42 ช่อง
- ไฮไลต์ "วันนี้" (Today Indicator)
- วันที่มีกิจกรรมจะแสดงแถบป้ายกิจกรรม (Event Pill) พร้อมสีและชื่อกิจกรรมดิบจาก Google Calendar
- หากวันใดมีกิจกรรมมากกว่า 3 รายการ จะมีปุ่ม "+X อื่นๆ" เพื่อคลิกเปิดดูทั้งหมด

### 3.2 มุมมองรายการ (Agenda / List View)
- เหมาะสำหรับหน้าจอมือถือ (Responsive Mobile First)
- จัดกลุ่มกิจกรรมเรียงตามเดือนและวัน
- แสดงเวลาเริ่มต้น-สิ้นสุดชัดเจน (หรือป้าย "ทั้งวัน / All Day")
- แสดงสถานที่ (Location) และคำอธิบาย (Description) หากมีระบุใน Google Calendar

### 3.3 แผงควบคุมและการโต้ตอบ (Control Bar & Interaction)
- ปุ่มสลับมุมมอง: `[ เดือน (Grid) | รายการ (Agenda) ]`
- ปุ่มเปลี่ยนเดือน: ย้อนหลัง (`<`), ถัดไป (`>`), และปุ่ม "วันนี้ (Today)"
- ป้ายแสดงเดือนและปี พ.ศ./ค.ศ. เช่น "ตุลาคม 2569 / October 2026"
- ปุ่ม Quick Action:
  - "เปิดใน Google Calendar" (Direct Web Link)
  - "ดาวน์โหลดปฏิทินการศึกษา PDF (CRRU)"

### 3.4 โมดอลรายละเอียดกิจกรรม (Event Detail Modal)
- เมื่อคลิกกิจกรรมใดๆ ใน Grid หรือ List จะเปิด Modal แสดง:
  - ชื่อกิจกรรม (Summary)
  - วันและเวลา (Start - End Time)
  - สถานที่ (Location)
  - รายละเอียดเพิ่มเติม (Description)
  - ปุ่ม "เพิ่มลงใน Google Calendar ของฉัน" (Generate Add to Google Calendar URL)

---

## 4. แผนการดำเนินงานเป็นขั้นตอน (Task Breakdown)

| Phase | งานย่อย | ไฟล์ที่เกี่ยวข้อง | ตัวชี้วัดความสำเร็จ |
| :---: | :--- | :--- | :--- |
| **Phase 1** | สร้างโมดูลแปลงไฟล์ `.ics` (RFC 5545 Parser) | `frontend/lib/calendar/ical-parser.ts` | สามารถแปลง Raw ICS จาก Google เป็น JSON Array ได้สมบูรณ์ รองรับ All-Day และ Timezone |
| **Phase 2** | สร้าง API Route สำหรับดึงและแคชข้อมูล | `frontend/app/api/calendar/route.ts` | Endpoint `/api/calendar` คืนค่า JSON พร้อม Cache Header `revalidate: 1800` |
| **Phase 3** | สร้าง Interactive Calendar Component | `frontend/app/eservice/calendar/CalendarClient.tsx` | สลับมุมมอง Month Grid และ Agenda List ได้อย่างลื่นไหล, คลิกเปิด Modal แสดงรายละเอียดได้ |
| **Phase 4** | ปรับปรุงหน้าเพจหลักและการเชื่อมต่อ | `frontend/app/eservice/calendar/page.tsx` | หน้า `/eservice/calendar` แสดงผลบูรณาการสมบูรณ์ สวยงามตามธีม Tailwind/DaisyUI ของคณะ |
| **Phase 5** | ทดสอบความถูกต้องและ Responsive | E2E / Browser Verification | ทดสอบการทำงานบน Desktop และ Mobile รองรับกิจกรรมข้ามวันและกิจกรรมไม่มีเวลา |

---

## 5. แผนการดูแลรักษาและความปลอดภัย (Maintenance & Resilience)

1. **Fallback กรณี Google Server ขัดข้อง:**
   - หาก Fetch จาก Google ล้มเหลว API Route จะส่ง Error Response พร้อม Cache Stale หรือ Empty State ที่สุภาพ ไม่ทำให้หน้าเว็บ Crash
2. **Timezone Accuracy:**
   - จัดการ Timezone `Asia/Bangkok` (+07:00) ให้แม่นยำ ไม่เลื่อนวันในกรณี All-day events
3. **No Secret Leaks:**
   - ใช้ Public Feed URL โดยไม่ต้องใช้ API Key จึงไม่มีความเสี่ยงต่อการหลุดของ Credential ใดๆ
