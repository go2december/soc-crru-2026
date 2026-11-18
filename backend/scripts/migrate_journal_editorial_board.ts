import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const OFFICIAL_THAIJO_EDITORIAL_MEMBERS = [
  // 1. บรรณาธิการ (Editors)
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.จามรี พระสุนิล',
    role_title: 'บรรณาธิการ',
    role_group: 'EDITOR_IN_CHIEF',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: 'อาจารย์ประจำคณะสังคมศาสตร์',
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    email: 'journal.soc@crru.ac.th',
    display_order: 1,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ธนพัทธ์ จันท์พิพัฒน์พงศ์',
    role_title: 'บรรณาธิการ',
    role_group: 'ASSOCIATE_EDITOR',
    academic_title: 'ผู้ช่วยศาสตราจารย์',
    position: 'อาจารย์ประจำคณะสังคมศาสตร์',
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    email: null,
    display_order: 2,
    is_active: true,
  },

  // 2. กองบรรณาธิการ (Editorial Board - 14 ท่านจากระบบ ThaiJO)
  {
    name: 'ศาสตราจารย์เกียรติคุณ ดร.มนัส สุวรรณ',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ศาสตราจารย์เกียรติคุณ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยราชภัฏเชียงใหม่',
    email: 'manatsuwan@gmail.com',
    display_order: 3,
    is_active: true,
  },
  {
    name: 'ศาสตราจารย์เกียรติคุณ ดร.อนุรักษ์ ปัญญานุวัฒน์',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ศาสตราจารย์เกียรติคุณ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยเชียงใหม่',
    email: 'anurak.p@cmu.ac.th',
    display_order: 4,
    is_active: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.มนตรี พิริยะกุล',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'รองศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยรามคำแหง',
    email: 'mpiriyakul@yahoo.com',
    display_order: 5,
    is_active: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.บุญฑวรรณ วิงวอน',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'รองศาสตราจารย์ ดร.',
    position: null,
    institution: 'วิทยาลัยอินเตอร์เทคลําปาง',
    email: 'boonthawan2009@gmail.com',
    display_order: 6,
    is_active: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.รังสรรค์ โฉมยา',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'รองศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยมหาสารคาม',
    email: 'rungson.c@msu.ac.th',
    display_order: 7,
    is_active: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.อัจศรา ประเสริฐสิน',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'รองศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยนอร์ทกรุงเทพ',
    email: 'ubib_p@hotmail.com',
    display_order: 8,
    is_active: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.ขวัญหญิง ศรีประเสริฐภาพ',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'รองศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'khwanying@g.swu.ac.th',
    display_order: 9,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.สุดารัตน์ ตันติวิวัทน์',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'juntuntivivat@gmail.com',
    display_order: 10,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.พิมพาภรณ์ บุญประเสริฐ',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'pimpaporn@g.swu.ac.th',
    display_order: 11,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.วีระวัฒน์ อุ่นเสน่หา',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยราชภัฏวไลยอลงกรณ์',
    email: 'weerawat@vru.ac.th',
    display_order: 12,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.พิชิต ลำใย',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยเกษตรศาสตร์',
    email: 'fforpcl@ku.ac.th',
    display_order: 13,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.สุวิมล สายสวัสดิ์ พิชญไพบูลย์',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: null,
    institution: 'มหาวิทยาลัยเทคโนโลยีราชมงคล',
    email: 'Noonoi0509@gmail.com',
    display_order: 14,
    is_active: true,
  },
  {
    name: 'อาจารย์ ดร.กนกวรรณ เอี่ยมชัย',
    role_title: 'กองบรรณาธิการ',
    role_group: 'EDITORIAL_BOARD',
    academic_title: 'อาจารย์ ดร.',
    position: null,
    institution: 'วิทยาลัยพยาบาลบรมราชชนนี พะเยา',
    email: 'K_aiemchai@hotmail.com',
    display_order: 15,
    is_active: true,
  },
  {
    name: 'นางศรีสมร พิริยะสุรวงศ์',
    role_title: 'ผู้จัดการวารสาร / กองบรรณาธิการ',
    role_group: 'JOURNAL_MANAGER',
    academic_title: 'นาง',
    position: 'ฝ่ายวิจัยและบริการวิชาการ',
    institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
    email: 'srisamorn8184@gmail.com',
    display_order: 16,
    is_active: true,
  },

  // 3. ที่ปรึกษา (Advisors - 3 ท่านจากระบบ ThaiJO)
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.เลหล้า ตรีเอกานุกูล',
    role_title: 'ที่ปรึกษา',
    role_group: 'ADVISOR',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: 'คณะสังคมศาสตร์',
    institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
    email: null,
    display_order: 17,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.นาวิน พรมใจสา',
    role_title: 'ที่ปรึกษา',
    role_group: 'ADVISOR',
    academic_title: 'ผู้ช่วยศาสตราจารย์ ดร.',
    position: 'คณะสังคมศาสตร์',
    institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
    email: null,
    display_order: 18,
    is_active: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ภัทรีพันธุ์ พันธุ',
    role_title: 'ที่ปรึกษา',
    role_group: 'ADVISOR',
    academic_title: 'ผู้ช่วยศาสตราจารย์',
    position: 'คณะสังคมศาสตร์',
    institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
    email: null,
    display_order: 19,
    is_active: true,
  },
];

async function runJournalMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Journal Editorial Board migration...');

    // 1. Create Enum
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "journal_editorial_role_group" AS ENUM (
          'ADVISOR',
          'EDITOR_IN_CHIEF',
          'ASSOCIATE_EDITOR',
          'JOURNAL_MANAGER',
          'EDITORIAL_BOARD'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Create Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "journal_editorial_board" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "role_title" varchar(255) NOT NULL,
        "role_group" "journal_editorial_role_group" DEFAULT 'EDITORIAL_BOARD' NOT NULL,
        "academic_title" varchar(100),
        "position" varchar(255),
        "institution" varchar(255) NOT NULL,
        "expertise" text,
        "email" varchar(255),
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "journal_editorial_role_group_idx" ON "journal_editorial_board"("role_group");
      CREATE INDEX IF NOT EXISTS "journal_editorial_is_active_idx" ON "journal_editorial_board"("is_active");
      CREATE INDEX IF NOT EXISTS "journal_editorial_display_order_idx" ON "journal_editorial_board"("display_order");
    `);

    // 3. Clear and Seed 19 Official ThaiJO Members
    await client.query(`DELETE FROM "journal_editorial_board"`);

    for (const member of OFFICIAL_THAIJO_EDITORIAL_MEMBERS) {
      await client.query(
        `
        INSERT INTO "journal_editorial_board" 
        ("name", "role_title", "role_group", "academic_title", "position", "institution", "email", "display_order", "is_active")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [
          member.name,
          member.role_title,
          member.role_group,
          member.academic_title,
          member.position,
          member.institution,
          member.email,
          member.display_order,
          member.is_active,
        ],
      );
    }
    console.log(`✅ Successfully seeded ${OFFICIAL_THAIJO_EDITORIAL_MEMBERS.length} official members from ThaiJO!`);

    // 4. Register in system_modules and role_permissions if available
    try {
      await client.query(`
        INSERT INTO "system_modules" ("key", "name_th", "description", "category", "route_path", "is_workflow_required", "is_core")
        VALUES ('journal', 'วารสารและกองบรรณาธิการ', 'จัดการข้อมูลวารสารวิชาการและรายนามกองบรรณาธิการ', 'Research', '/admin/journal', false, true)
        ON CONFLICT ("key") DO UPDATE SET "name_th" = EXCLUDED."name_th";
      `);
      console.log('✅ system_modules registered!');
    } catch (e: any) {
      console.log('Note on system_modules:', e.message);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runJournalMigration()
  .then(() => {
    console.log('🎉 Journal Editorial Board Migration completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error during migration:', err);
    process.exit(1);
  });
