import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runStudentServicesMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Student E-Services & Faculty Documents migration...');

    // 1. Create Enum if not exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "student_service_category" AS ENUM ('ACADEMIC', 'WELFARE', 'LIBRARY', 'DIGITAL_IT', 'FACULTY');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "student_services" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(255) NOT NULL,
        "description" text,
        "category" "student_service_category" DEFAULT 'ACADEMIC' NOT NULL,
        "url" varchar(500) NOT NULL,
        "icon" varchar(50) DEFAULT 'globe' NOT NULL,
        "badge" varchar(100),
        "is_external" boolean DEFAULT true NOT NULL,
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_published" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "student_services_category_idx" ON "student_services"("category");
      CREATE INDEX IF NOT EXISTS "student_services_is_published_idx" ON "student_services"("is_published");
      CREATE INDEX IF NOT EXISTS "student_services_display_order_idx" ON "student_services"("display_order");

      CREATE TABLE IF NOT EXISTS "student_documents" (
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

      CREATE INDEX IF NOT EXISTS "student_docs_category_idx" ON "student_documents"("category");
      CREATE INDEX IF NOT EXISTS "student_docs_is_published_idx" ON "student_documents"("is_published");
      CREATE INDEX IF NOT EXISTS "student_docs_display_order_idx" ON "student_documents"("display_order");
    `);

    console.log('✅ Tables created successfully. Checking existing records...');

    const { rows: existingServices } = await client.query('SELECT count(*) FROM "student_services"');
    if (parseInt(existingServices[0].count, 10) === 0) {
      console.log('🌱 Seeding initial Student E-Services (Central CRRU)...');
      
      const seedServices = [
        {
          title: 'ระบบทะเบียนและประมวลผล (REG CRRU)',
          description: 'ลงทะเบียนเรียน ตรวจสอบผลการเรียน ตารางเรียน ตารางสอบ และใบแจ้งชำระเงิน',
          category: 'ACADEMIC',
          url: 'https://reg.crru.ac.th',
          icon: 'academic-cap',
          badge: 'ทางการ / REG',
          is_external: true,
          display_order: 1,
        },
        {
          title: 'ระบบบริการข้อมูลนักศึกษา (ORASIS-SIS)',
          description: 'ระบบสารสนเทศข้อมูลนักศึกษา ตรวจสอบประวัติ สถานะภาพนักศึกษา และข้อมูลวิชาการ',
          category: 'ACADEMIC',
          url: 'https://orasis.crru.ac.th/orasis_crru/sis2/login',
          icon: 'identification',
          badge: 'ORASIS Login',
          is_external: true,
          display_order: 2,
        },
        {
          title: 'CRRU Elearning (LMS)',
          description: 'ระบบจัดการเรียนการสอนออนไลน์ เข้าชั้นเรียน ส่งการบ้าน และรับเอกสารประกอบการสอน',
          category: 'ACADEMIC',
          url: 'https://elearning.crru.ac.th/',
          icon: 'laptop',
          badge: 'Moodle LMS',
          is_external: true,
          display_order: 3,
        },
        {
          title: 'ระบบคลังหน่วยกิต (CRRU Lifelong Learning)',
          description: 'หลักสูตรระยะสั้น คลังหน่วยกิต (Credit Bank) และการสะสมผลการเรียนรู้ตลอดชีวิต',
          category: 'ACADEMIC',
          url: 'https://lifelong.crru.ac.th/',
          icon: 'sparkles',
          badge: 'Credit Bank',
          is_external: true,
          display_order: 4,
        },
        {
          title: 'ปฏิทินการศึกษา (Academic Calendar)',
          description: 'กำหนดการสำคัญประจำภาคเรียน วันเปิด-ปิดภาคเรียน วันลงทะเบียน และวันสอบ',
          category: 'ACADEMIC',
          url: '/eservice/calendar',
          icon: 'calendar',
          badge: 'กำหนดการ',
          is_external: false,
          display_order: 5,
        },
        {
          title: 'ระบบกิจกรรมนักศึกษา (DIGIT.CRRU)',
          description: 'บันทึกและตรวจสอบชั่วโมงกิจกรรมบังคับ/กิจกรรมเสริมหลักสูตร เงื่อนไขก่อนสำเร็จการศึกษา',
          category: 'WELFARE',
          url: 'https://digit.crru.ac.th/',
          icon: 'star',
          badge: 'ชั่วโมงกิจกรรม',
          is_external: true,
          display_order: 6,
        },
        {
          title: 'ระบบกู้ยืมเงินเพื่อการศึกษา (กยศ. / กรอ. CRRU)',
          description: 'ติดตามกำหนดการส่งเอกสาร สัญญากู้ยืม และระบบบริหารการให้กู้ยืม (DSL)',
          category: 'WELFARE',
          url: 'https://studentloan.crru.ac.th/',
          icon: 'currency-dollar',
          badge: 'กองทุน กยศ.',
          is_external: true,
          display_order: 7,
        },
        {
          title: 'กองพัฒนานักศึกษา & ทุนการศึกษา',
          description: 'งานทุนการศึกษา ข้อมูลสวัสดิการพยาบาล และการขอผ่อนผันการเกณฑ์ทหาร',
          category: 'WELFARE',
          url: 'https://dsr.crru.ac.th/',
          icon: 'heart',
          badge: 'ทุน / สวัสดิการ',
          is_external: true,
          display_order: 8,
        },
        {
          title: 'ระบบจองหอพักนักศึกษา (ภิรมย์ราชภัฏ)',
          description: 'ระบบจองห้องพัก ตรวจสอบห้องว่าง และชำระเงินค่าหอพักนักศึกษา มรภ.เชียงราย',
          category: 'WELFARE',
          url: 'https://property.crru.ac.th/',
          icon: 'home',
          badge: 'หอพักใน มรภ.',
          is_external: true,
          display_order: 9,
        },
        {
          title: 'สำนักวิทยบริการฯ (หอสมุดกลาง CRRU Library)',
          description: 'สืบค้นหนังสือและตำราเรียนออนไลน์ (OPAC), ยืม-คืน และบริการห้องสมุดดิจิทัล',
          category: 'LIBRARY',
          url: 'https://library.crru.ac.th/',
          icon: 'book-open',
          badge: 'OPAC หอสมุด',
          is_external: true,
          display_order: 10,
        },
        {
          title: 'ระบบจองห้องค้นคว้า (CRRU Smart Room Booking)',
          description: 'จองห้องศึกษาค้นคว้าเดี่ยว/กลุ่ม ห้องมินิเธียเตอร์ ณ อาคารบรรณราชนครินทร์',
          category: 'LIBRARY',
          url: 'https://aritc.crru.ac.th/',
          icon: 'ticket',
          badge: 'จองห้องค้นคว้า',
          is_external: true,
          display_order: 11,
        },
        {
          title: 'คลังวิจัยและวิทยานิพนธ์ (CRRU Repository)',
          description: 'สืบค้นวิทยานิพนธ์ รายงานวิจัยฉบับเต็ม และวารสารวิชาการ มรภ.เชียงราย',
          category: 'LIBRARY',
          url: 'https://repository.crru.ac.th/',
          icon: 'document-magnifying-glass',
          badge: 'วิทยานิพนธ์ / วิจัย',
          is_external: true,
          display_order: 12,
        },
        {
          title: 'อีเมลนักศึกษาและคลาวด์การศึกษา (@crru.ac.th)',
          description: 'เข้าใช้งาน Google Workspace for Education และ Microsoft 365 สิทธิ์นักศึกษา',
          category: 'DIGITAL_IT',
          url: 'https://mail.crru.ac.th/',
          icon: 'envelope',
          badge: '@crru.ac.th',
          is_external: true,
          display_order: 13,
        },
        {
          title: 'เครือข่ายไร้สาย CRRU WiFi & eduroam',
          description: 'ระบบยืนยันตัวตนเครือข่ายไร้สายความเร็วสูงทั่วมหาวิทยาลัย และเครือข่ายโรมมิ่ง eduroam',
          category: 'DIGITAL_IT',
          url: 'https://wifi.crru.ac.th/',
          icon: 'wifi',
          badge: 'WiFi / eduroam',
          is_external: true,
          display_order: 14,
        },
        {
          title: 'CRRU VPN เครือข่ายส่วนตัวเสมือน',
          description: 'เชื่อมต่อเครือข่ายอินเทอร์เน็ตมหาวิทยาลัยจากภายนอกเพื่อเข้าถึงฐานข้อมูลวิจัยและวารสาร',
          category: 'DIGITAL_IT',
          url: 'https://vpn.crru.ac.th/',
          icon: 'shield-check',
          badge: 'Secure VPN',
          is_external: true,
          display_order: 15,
        },
      ];

      for (const s of seedServices) {
        await client.query(
          `INSERT INTO "student_services" 
            ("title", "description", "category", "url", "icon", "badge", "is_external", "display_order", "is_published")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
          [s.title, s.description, s.category, s.url, s.icon, s.badge, s.is_external, s.display_order]
        );
      }
      console.log(`✅ Seeded ${seedServices.length} student services.`);
    }

    const { rows: existingDocs } = await client.query('SELECT count(*) FROM "student_documents"');
    if (parseInt(existingDocs[0].count, 10) === 0) {
      console.log('🌱 Seeding initial Student Documents (Faculty of Social Sciences)...');

      const seedDocs = [
        {
          title: 'คำร้องทั่วไป คณะสังคมศาสตร์ (แบบฟอร์ม คส.01)',
          category: 'คำร้องทั่วไป',
          file_url: '/forms/general-request-form.pdf',
          file_type: 'PDF',
          file_size: '280 KB',
          display_order: 1,
        },
        {
          title: 'คำร้องขอฝึกประสบการณ์วิชาชีพ / สหกิจศึกษา (คส.สหกิจ 01)',
          category: 'การฝึกงานและสหกิจศึกษา',
          file_url: '/forms/coop-internship-application.pdf',
          file_type: 'PDF',
          file_size: '420 KB',
          display_order: 2,
        },
        {
          title: 'แบบขอหนังสือส่งตัวและขอความอนุเคราะห์ฝึกประสบการณ์วิชาชีพ',
          category: 'การฝึกงานและสหกิจศึกษา',
          file_url: '/forms/internship-request-letter.docx',
          file_type: 'DOCX',
          file_size: '115 KB',
          display_order: 3,
        },
        {
          title: 'คำร้องขอเพิ่ม-ถอนรายวิชาล่าช้าเป็นกรณีพิเศษ (คส.วิชาการ 02)',
          category: 'คำร้องทางวิชาการ',
          file_url: '/forms/late-course-add-drop.pdf',
          file_type: 'PDF',
          file_size: '210 KB',
          display_order: 4,
        },
        {
          title: 'แบบคำร้องขอเทียบโอนผลการเรียนและสะสมหน่วยกิต (Credit Bank)',
          category: 'คำร้องทางวิชาการ',
          file_url: '/forms/credit-transfer-application.pdf',
          file_type: 'PDF',
          file_size: '340 KB',
          display_order: 5,
        },
        {
          title: 'แบบยินยอมการเผยแพร่ผลงานวิชาการ/สารนิพนธ์นักศึกษา',
          category: 'วิจัยและสารนิพนธ์',
          file_url: '/forms/student-research-consent.pdf',
          file_type: 'PDF',
          file_size: '190 KB',
          display_order: 6,
        },
      ];

      for (const d of seedDocs) {
        await client.query(
          `INSERT INTO "student_documents"
            ("title", "category", "file_url", "file_type", "file_size", "display_order", "is_published")
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [d.title, d.category, d.file_url, d.file_type, d.file_size, d.display_order]
        );
      }
      console.log(`✅ Seeded ${seedDocs.length} faculty documents.`);
    }

    console.log('🎉 Migration & Seeding finished successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runStudentServicesMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
