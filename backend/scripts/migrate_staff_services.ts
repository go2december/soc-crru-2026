import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runStaffServicesMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Staff E-Services & Staff Documents migration...');

    // 1. Create Enum if not exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "staff_service_category" AS ENUM ('HR_FINANCE', 'ACADEMIC_TEACHING', 'RESEARCH_QA', 'FACILITY_REPAIR', 'DIGITAL_IT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "staff_services" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(255) NOT NULL,
        "description" text,
        "category" "staff_service_category" DEFAULT 'HR_FINANCE' NOT NULL,
        "url" varchar(500) NOT NULL,
        "icon" varchar(50) DEFAULT 'FileText' NOT NULL,
        "badge" varchar(100),
        "is_external" boolean DEFAULT true NOT NULL,
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_published" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "staff_services_category_idx" ON "staff_services"("category");
      CREATE INDEX IF NOT EXISTS "staff_services_is_published_idx" ON "staff_services"("is_published");
      CREATE INDEX IF NOT EXISTS "staff_services_display_order_idx" ON "staff_services"("display_order");

      CREATE TABLE IF NOT EXISTS "staff_documents" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(255) NOT NULL,
        "category" varchar(100) DEFAULT 'คำร้องทั่วไป' NOT NULL,
        "file_url" varchar(500) NOT NULL,
        "file_type" varchar(20) DEFAULT 'PDF' NOT NULL,
        "file_size" varchar(50),
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_published" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "staff_docs_category_idx" ON "staff_documents"("category");
      CREATE INDEX IF NOT EXISTS "staff_docs_is_published_idx" ON "staff_documents"("is_published");
      CREATE INDEX IF NOT EXISTS "staff_docs_display_order_idx" ON "staff_documents"("display_order");
    `);

    console.log('✅ Tables created successfully. Checking existing records...');

    const { rows: existingServices } = await client.query('SELECT count(*) FROM "staff_services"');
    if (parseInt(existingServices[0].count, 10) === 0) {
      console.log('🌱 Seeding initial Staff E-Services (Central CRRU & Faculty Systems)...');

      const seedServices = [
        {
          title: 'ระบบสารบรรณอิเล็กทรอนิกส์ (CRRU E-OFFICE V.3)',
          description: 'รับ-ส่ง หนังสือราชการ ตรวจสอบหนังสือเข้า เกษียนหนังสือ และลงนามคำสั่งอิเล็กทรอนิกส์',
          category: 'HR_FINANCE',
          url: 'https://e-office.crru.ac.th/',
          icon: 'FileText',
          badge: 'สารบรรณองค์กร',
          is_external: true,
          display_order: 1,
        },
        {
          title: 'ระบบบริหารงานบุคคล (CRRU HRMIS)',
          description: 'ข้อมูลประวัติบุคลากร บันทึกและประเมินผลการปฏิบัติราชการ (TOR / ก.พ.ร.) รายรอบปีงบประมาณ',
          category: 'HR_FINANCE',
          url: 'https://hrmis.crru.ac.th/',
          icon: 'UserCheck',
          badge: 'HR / ประเมินผล TOR',
          is_external: true,
          display_order: 2,
        },
        {
          title: 'ระบบโปรแกรมเงินเดือนและสลิปออนไลน์ (CRRU Payroll)',
          description: 'ตรวจสอบสลิปเงินเดือนรายเดือน ตรวจสอบรายการหักภาษี และพิมพ์หนังสือรับรองภาษี ภ.ง.ด.91',
          category: 'HR_FINANCE',
          url: 'https://payroll.crru.ac.th/',
          icon: 'Wallet',
          badge: 'สลิปเงินเดือน',
          is_external: true,
          display_order: 3,
        },
        {
          title: 'ระบบจัดซื้อจัดจ้างและการพัสดุ มรภ.ชร.',
          description: 'ติดตามประกาศจัดซื้อจัดจ้าง แผนการจัดซื้อ ข้อมูลผู้เสนอราคา และระบบพัสดุภาครัฐ (e-GP)',
          category: 'HR_FINANCE',
          url: '/eservice/procurement',
          icon: 'Building2',
          badge: 'ระบบพัสดุ & จัดซื้อ',
          is_external: false,
          display_order: 4,
        },
        {
          title: 'ระบบทะเบียนอาจารย์ผู้สอน (CRRU REG For Teacher)',
          description: 'บันทึกและส่งผลการเรียน (ตัดเกรด) ตรวจสอบรายชื่อนักศึกษาในชั้นเรียน เช็คประวัติการลงทะเบียน',
          category: 'ACADEMIC_TEACHING',
          url: 'https://reg.crru.ac.th/teacher',
          icon: 'GraduationCap',
          badge: 'ส่งผลการเรียน / ตัดเกรด',
          is_external: true,
          display_order: 5,
        },
        {
          title: 'ระบบห้องเรียนดิจิทัล (CLASS CRRU)',
          description: 'ระบบสนับสนุนการจัดการเรียนการสอน บันทึกเวลาเข้าเรียน ประเมินผลพฤติกรรม และสื่อสารกับนักศึกษา',
          category: 'ACADEMIC_TEACHING',
          url: 'https://class.crru.ac.th/',
          icon: 'CheckCircle2',
          badge: 'เช็คชื่อ & จัดการชั้นเรียน',
          is_external: true,
          display_order: 6,
        },
        {
          title: 'ระบบจัดการเรียนรู้ออนไลน์ (CRRU LMS / Elearning)',
          description: 'สร้างคอร์สเรียนออนไลน์ มอบหมายการบ้าน จัดทำแบบทดสอบ (Quiz) และคลังบทเรียนอิเล็กทรอนิกส์',
          category: 'ACADEMIC_TEACHING',
          url: 'https://elearning.crru.ac.th/',
          icon: 'MonitorPlay',
          badge: 'Elearning / Moodle',
          is_external: true,
          display_order: 7,
        },
        {
          title: 'ระบบอาจารย์ที่ปรึกษา (Advisor System)',
          description: 'ดูแลและให้คำปรึกษานักศึกษาในความดูแล อนุมัติแผนการลงทะเบียน และติดตามผลการเรียนนักศึกษา',
          category: 'ACADEMIC_TEACHING',
          url: 'https://reg.crru.ac.th/',
          icon: 'Users',
          badge: 'ระบบอาจารย์ที่ปรึกษา',
          is_external: true,
          display_order: 8,
        },
        {
          title: 'คลังปัญญามหาวิทยาลัยราชภัฏเชียงราย (CRRU Repository)',
          description: 'สืบค้นและจัดเก็บผลงานทางวิชาการ งานวิจัย วิทยานิพนธ์ และบทความวิจัยของคณาจารย์ในมหาวิทยาลัย',
          category: 'RESEARCH_QA',
          url: 'https://repository.crru.ac.th/',
          icon: 'BookOpen',
          badge: 'คลังวิจัยสถาบัน',
          is_external: true,
          display_order: 9,
        },
        {
          title: 'ระบบประเมินคุณภาพการศึกษาภายใน (CRRU CHE QA Online)',
          description: 'ระบบบันทึกรายงานการประเมินตนเอง (SAR) ระดับหลักสูตรและระดับคณะ ตามเกณฑ์ AUN-QA / สป.อว.',
          category: 'RESEARCH_QA',
          url: 'https://qa.crru.ac.th/',
          icon: 'ShieldCheck',
          badge: 'ประกันคุณภาพ QA',
          is_external: true,
          display_order: 10,
        },
        {
          title: 'ระบบบริหารจัดการทุนวิจัยและนวัตกรรม สถาบันวิจัยฯ',
          description: 'เสนอโครงการวิจัยเพื่อขอรับทุนสนับสนุน ยื่นรายงานความก้าวหน้า และส่งรายงานวิจัยฉบับสมบูรณ์',
          category: 'RESEARCH_QA',
          url: 'https://rdi.crru.ac.th/',
          icon: 'Coins',
          badge: 'ทุนวิจัย RDI',
          is_external: true,
          display_order: 11,
        },
        {
          title: 'ระบบจองยานพาหนะส่วนกลาง (CRRU Vehicle Booking)',
          description: 'ยื่นคำขอใช้รถยนต์ส่วนกลางมหาวิทยาลัย สำหรับการเดินทางไปราชการ สัมมนา และนิเทศนักศึกษา',
          category: 'FACILITY_REPAIR',
          url: 'https://vehicle.crru.ac.th/',
          icon: 'Car',
          badge: 'จองรถไปราชการ',
          is_external: true,
          display_order: 12,
        },
        {
          title: 'ระบบจองห้องประชุมและห้องอบรมอัจฉริยะ (CRRU Smart Room)',
          description: 'ตรวจสอบตารางการใช้งานและจองห้องประชุม ห้องสัมมนา คณะสังคมศาสตร์ และอาคารส่วนกลาง',
          category: 'FACILITY_REPAIR',
          url: 'https://booking.crru.ac.th/',
          icon: 'DoorOpen',
          badge: 'จองห้องประชุม',
          is_external: true,
          display_order: 13,
        },
        {
          title: 'ระบบแจ้งซ่อมและบริการอาคารสถานที่ (CRRU E-Service Helpdesk)',
          description: 'แจ้งซ่อมอุปกรณ์สำนักงาน ระบบไฟฟ้า ประปา โสตทัศนูปกรณ์ และเครื่องปรับอากาศ',
          category: 'FACILITY_REPAIR',
          url: 'https://helpdesk.crru.ac.th/',
          icon: 'Wrench',
          badge: 'แจ้งซ่อมบำรุง',
          is_external: true,
          display_order: 14,
        },
        {
          title: 'ระบบอีเมลและคลาวด์องค์กร (CRRU Webmail & Workspace)',
          description: 'Google Workspace for Education (@crru.ac.th) และ Microsoft 365 องค์กรสำหรับบุคลากร',
          category: 'DIGITAL_IT',
          url: 'https://mail.crru.ac.th/',
          icon: 'Mail',
          badge: 'Google & M365 Mail',
          is_external: true,
          display_order: 15,
        },
        {
          title: 'ระบบยืนยันตัวตนเครือข่ายและ VPN ภายนอก (CRRU IT Account)',
          description: 'จัดการรหัสผ่านบัญชีอินเทอร์เน็ต ขอเปิดใช้งาน VPN สถาบัน และเชื่อมต่อเครือข่าย Eduroam',
          category: 'DIGITAL_IT',
          url: 'https://account.crru.ac.th/',
          icon: 'Wifi',
          badge: 'บัญชีเน็ต & VPN',
          is_external: true,
          display_order: 16,
        },
      ];

      for (const item of seedServices) {
        await client.query(
          `INSERT INTO "staff_services" (title, description, category, url, icon, badge, is_external, display_order, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
          [item.title, item.description, item.category, item.url, item.icon, item.badge, item.is_external, item.display_order]
        );
      }
      console.log(`✅ Seeded ${seedServices.length} staff services.`);
    }

    const { rows: existingDocs } = await client.query('SELECT count(*) FROM "staff_documents"');
    if (parseInt(existingDocs[0].count, 10) === 0) {
      console.log('🌱 Seeding initial Staff Documents & Forms...');

      const seedDocs = [
        {
          title: 'แบบขออนุมัติเดินทางไปปฏิบัติงาน/ไปราชการ และขอใช้ยานพาหนะ',
          category: 'การไปราชการ',
          file_url: '/forms/staff/travel-request-form.pdf',
          file_type: 'PDF',
          file_size: '220 KB',
          display_order: 1,
        },
        {
          title: 'แบบฟอร์มรายงานผลการเดินทางไปปฏิบัติงาน/ไปราชการ และขอเบิกค่าใช้จ่าย',
          category: 'การไปราชการ',
          file_url: '/forms/staff/travel-expense-claim-report.docx',
          file_type: 'DOCX',
          file_size: '185 KB',
          display_order: 2,
        },
        {
          title: 'แบบขออนุมัติจัดซื้อจัดจ้าง/จัดหาพัสดุโครงการ คณะสังคมศาสตร์',
          category: 'การเงินและพัสดุ',
          file_url: '/forms/staff/procurement-requisition-form.pdf',
          file_type: 'PDF',
          file_size: '240 KB',
          display_order: 3,
        },
        {
          title: 'ใบขอเบิกเงินสวัสดิการเกี่ยวกับการรักษาพยาบาลและการศึกษาบุตร',
          category: 'สิทธิประโยชน์และใบลา',
          file_url: '/forms/staff/welfare-benefit-claim.pdf',
          file_type: 'PDF',
          file_size: '280 KB',
          display_order: 4,
        },
        {
          title: 'แบบฟอร์มใบลาพักผ่อน / ลากิจ / ลาป่วย บุคลากรสายวิชาการและสายสนับสนุน',
          category: 'สิทธิประโยชน์และใบลา',
          file_url: '/forms/staff/leave-request-form.pdf',
          file_type: 'PDF',
          file_size: '190 KB',
          display_order: 5,
        },
        {
          title: 'แบบคำขอใช้ห้องเรียน ห้องประชุม และอุปกรณ์โสตทัศนูปกรณ์ คณะสังคมศาสตร์',
          category: 'คำร้องทั่วไป',
          file_url: '/forms/staff/room-audiovisual-booking.pdf',
          file_type: 'PDF',
          file_size: '210 KB',
          display_order: 6,
        },
        {
          title: 'แบบเสนอขอรับการสนับสนุนค่าตีพิมพ์เผยแพร่ผลงานวิชาการ/วิจัย',
          category: 'วิจัยและวิชาการ',
          file_url: '/forms/staff/research-publication-grant.docx',
          file_type: 'DOCX',
          file_size: '150 KB',
          display_order: 7,
        },
        {
          title: 'แบบฟอร์มรายงานผลการดำเนินโครงการและสรุปการใช้จ่ายงบประมาณ',
          category: 'การเงินและพัสดุ',
          file_url: '/forms/staff/project-summary-report.docx',
          file_type: 'DOCX',
          file_size: '170 KB',
          display_order: 8,
        },
        {
          title: 'แบบฟอร์มข้อตกลงและแบบประเมินผลการปฏิบัติราชการ (ภาระงานบุคลากร)',
          category: 'สิทธิประโยชน์และใบลา',
          file_url: '/forms/staff/performance-agreement-tor.pdf',
          file_type: 'PDF',
          file_size: '320 KB',
          display_order: 9,
        },
        {
          title: 'แบบคำขอมีบัตรประจำตัวเจ้าหน้าที่ของรัฐ / บัตรบุคลากร',
          category: 'คำร้องทั่วไป',
          file_url: '/forms/staff/staff-id-card-application.pdf',
          file_type: 'PDF',
          file_size: '195 KB',
          display_order: 10,
        },
        {
          title: 'แบบฟอร์มขอความอนุเคราะห์จัดทำสื่อประชาสัมพันธ์และโสตทัศนูปกรณ์',
          category: 'คำร้องทั่วไป',
          file_url: '/forms/staff/media-production-request.docx',
          file_type: 'DOCX',
          file_size: '110 KB',
          display_order: 11,
        },
      ];

      for (const item of seedDocs) {
        await client.query(
          `INSERT INTO "staff_documents" (title, category, file_url, file_type, file_size, display_order, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [item.title, item.category, item.file_url, item.file_type, item.file_size, item.display_order]
        );
      }
      console.log(`✅ Seeded ${seedDocs.length} staff documents.`);
    }

    console.log('🎉 Staff Services migration & seeding finished successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runStaffServicesMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});
