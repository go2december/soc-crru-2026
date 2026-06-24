# คู่มือการติดตั้งระบบบน Windows Server 2022 (Native / No Docker)

คู่มือนี้แนะนำขั้นตอนการติดตั้งและรันระบบ Microservices ทั้งหมดและหน้าบ้าน Next.js แบบ Native บน Windows Server 2022 (VPS) โดยตรงเพื่อประสิทธิภาพสูงสุดและไม่ติดข้อจำกัดเรื่อง Virtualization (Nested Virtualization) ของผู้ให้บริการ VPS

---

## 📋 สิ่งที่ต้องจัดเตรียมและติดตั้งใน Windows Server

### 1. ติดตั้ง Node.js
1. ดาวน์โหลด **Node.js v26.x** (หรือเวอร์ชันที่ระบุในไฟล์ `.nvmrc`) (Windows Installer `.msi`) จาก [Node.js Official Site](https://nodejs.org/)
2. ทำการติดตั้งตามปกติ และตรวจสอบเวอร์ชันผ่าน Command Prompt (cmd) หรือ PowerShell:
   ```cmd
   node -v
   npm -v
   ```

### 2. ติดตั้ง PostgreSQL Database
1. ดาวน์โหลด **PostgreSQL v16** หรือ **v17** จาก [PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
2. ติดตั้งโดยตั้งค่ารหัสผ่านสำหรับผู้ใช้ `postgres`
3. เปิดโปรแกรม **pgAdmin** หรือใช้ `psql` เพื่อสร้างฐานข้อมูลและผู้ใช้ตามในสเปกของโปรเจกต์:
   * **Database Name**: `soc_db`
   * **Username**: `soc_admin`
   * **Password**: `Soc0903297444`
   * **Port**: `5432`

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์

### 1. โคลน/ดาวน์โหลดโปรเจกต์
ดาวน์โหลดหรือโคลนโปรเจกต์ไปไว้ที่โฟลเดอร์ปลายทาง เช่น `C:\soc-crru-web`

### 2. ติดตั้งและ Build โค้ดของ Backend
เปิด Command Prompt ไปที่โฟลเดอร์ `backend` เพื่อติดตั้งโมดูลและทำการคอมไพล์โค้ด:
```cmd
cd C:\soc-crru-web\backend
npm install
npm run build
```
*(คำสั่ง `npm run build` จะทำการคอมไพล์ Microservices ทุกตัวและ Gateway ไปเก็บไว้ในโฟลเดอร์ `dist/`)*

### 3. รันฐานข้อมูล Migration (ดึงตารางฐานข้อมูล)
ให้รันคำสั่งดึง DDL เข้าสู่ PostgreSQL:
```cmd
node run_migration.js
```

### 4. ติดตั้งและ Build โค้ดของ Frontend
เปิดอีกหน้าต่างหนึ่งไปยังโฟลเดอร์ `frontend`:
```cmd
cd C:\soc-crru-web\frontend
npm install
npm run build
```

---

## 🛠️ การจัดการการรันโปรเจกต์ด้วย PM2 (ในโหมด Service)

เพื่อไม่ให้หน้าต่าง cmd ปิดตัวลงเมื่อปิดการเชื่อมต่อเซิร์ฟเวอร์ และตั้งค่าให้ระบบทำงานอัตโนมัติเมื่อวินโดวส์รีสตาร์ท เราจะใช้โปรแกรม **PM2** ในการจัดการครับ

### 1. ติดตั้ง PM2 ทั่วโลก (Global)
เปิด cmd ในฐานะ Administrator แล้วติดตั้งคำสั่งดังนี้:
```cmd
npm install -g pm2
npm install -g pm2-windows-service
```

### 2. ลงทะเบียน PM2 เป็น Windows Service
รันคำสั่งด้านล่างนี้ใน cmd เพื่อสร้างและลงทะเบียน PM2 ให้ทำงานเป็น Service ของ Windows:
```cmd
pm2-service-install -n PM2
```
*(กดเลือกตอบคำถามตามความเหมาะสม โดยทั่วไปจะกดใช้ค่าเริ่มต้นทั้งหมด)*

### 3. สั่งรันทุกบริการด้วยไฟล์ตั้งค่าที่เตรียมไว้
ไปที่โฟลเดอร์หลักของโปรเจกต์ (`C:\soc-crru-web`) แล้วรันคำสั่งสตาร์ท:
```cmd
cd C:\soc-crru-web
pm2 start ecosystem.config.js
```
คำสั่งนี้จะทำการดึงข้อมูลการตั้งค่าจาก [ecosystem.config.js](file:///e:/web2026/soc-crru-web/ecosystem.config.js) ขึ้นมารันทั้งหมด 8 แอปพลิเคชัน (Microservices 7 ตัว และ Next.js Frontend 1 ตัว)

### 4. บันทึกและเปิดทำงานเมื่อรีสตาร์ทเครื่อง
เมื่อรันสำเร็จแล้ว ให้บันทึกการทำงานของ PM2 เพื่อให้ Service เรียกทำงานอัตโนมัติเมื่อวินโดวส์บูต:
```cmd
pm2 save
```

---

## 📈 คำสั่งควบคุม PM2 ที่จำเป็น

* **ตรวจสอบสถานะโปรเซสทั้งหมด**:
  ```cmd
  pm2 status
  ```
* **ดู Log การทำงาน (เพื่อใช้ Debug ปัญหา)**:
  ```cmd
  pm2 logs
  ```
* **รีสตาร์ทบริการทั้งหมด**:
  ```cmd
  pm2 restart all
  ```
* **หยุดทำงานทุกตัว**:
  ```cmd
  pm2 stop all
  ```
