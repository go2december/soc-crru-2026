import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('Checking and creating site_settings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        announcement_text VARCHAR(500) DEFAULT 'เปิดรับสมัครนักศึกษาใหม่ TCAS 2569 รอบ Portfolio',
        announcement_link VARCHAR(500) DEFAULT '/admissions',
        is_announcement_active BOOLEAN DEFAULT TRUE NOT NULL,
        hero_headline_th VARCHAR(500),
        hero_subtext_th TEXT,

        manual_programs_count INTEGER,
        employability_rate VARCHAR(50) DEFAULT '94.8%',
        manual_partnerships_count INTEGER,
        lecturers_rate VARCHAR(50) DEFAULT '100%',

        communities_count VARCHAR(50) DEFAULT '150+',
        manual_innovations_count INTEGER,
        manual_mous_count INTEGER,
        employer_satisfaction_rate VARCHAR(50) DEFAULT '98%',

        history_founded_year VARCHAR(50) DEFAULT '2546',
        history_content_th TEXT,
        philosophy_th TEXT,
        vision_th TEXT,
        identity_th TEXT,
        uniqueness_th TEXT,
        core_values JSONB,
        missions JSONB,

        structure_deputies JSONB,
        structure_office_units JSONB,
        structure_sections JSONB,
        strategic_plans JSONB,

        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS structure_sections JSONB;
    `);

    // Default Seed Data from existing hardcoded values
    const defaultMissions = [
      {
        id: 1,
        title: "ผลิตบัณฑิตที่เป็นนวัตกรมืออาชีพ",
        desc: "มีทักษะเด่น มีความรู้ มีคุณธรรม และตอบสนองต่อการพัฒนาท้องถิ่นอย่างยั่งยืน",
        icon: "Users",
      },
      {
        id: 2,
        title: "ผลิตผลงานวิจัยและงานสร้างสรรค์",
        desc: "เพื่อการนำไปใช้ประโยชน์ในชุมชน ท้องถิ่น ประเทศ และภูมิภาคอาเซียน",
        icon: "FlaskConical",
      },
      {
        id: 3,
        title: "ให้บริการวิชาการแก่สังคม",
        desc: "เพื่อยกระดับคุณภาพชีวิตของประชาชนในท้องถิ่น และประเทศ",
        icon: "HeartHandshake",
      },
      {
        id: 4,
        title: "สืบสานและส่งเสริมศิลปวัฒนธรรม",
        desc: "ทำนุบำรุงและอนุรักษ์ศิลปวัฒนธรรมอันดีงามของท้องถิ่นล้านนาและของชาติ",
        icon: "Landmark",
      },
      {
        id: 5,
        title: "พัฒนาองค์กรแห่งการเรียนรู้ที่มีธรรมาภิบาล",
        desc: "พัฒนาคณะให้เป็นองค์กรแห่งการเรียนรู้ที่มีคุณภาพ มีประสิทธิภาพ และยึดหลักธรรมาภิบาล",
        icon: "ShieldCheck",
      },
    ];

    const defaultCoreValues = [
      {
        title: "นวัตกรรมเพื่อสังคม (Social Innovation)",
        desc: "มุ่งมั่นคิดค้นและประยุกต์ใช้องค์ความรู้เพื่อแก้ปัญหาและยกระดับสังคมอย่างยั่งยืน",
        icon: "Lightbulb",
      },
      {
        title: "ความร่วมมือและการมีส่วนร่วม (Collaboration)",
        desc: "ผสานพลังกับชุมชน เครือข่าย และภาคีทุกภาคส่วนเพื่อขับเคลื่อนการพัฒนาท้องถิ่น",
        icon: "Users",
      },
      {
        title: "ความซื่อสัตย์และธรรมาภิบาล (Integrity & Governance)",
        desc: "ยึดมั่นในความโปร่งใส ความรับผิดชอบ และหลักจริยธรรมในทุกมิติการดำเนินงาน",
        icon: "ShieldCheck",
      },
    ];

    const defaultDeputies = [
      {
        title: "รองคณบดีฝ่ายวิชาการและวิจัย",
        sub: "Academic & Research Affairs",
        desc: "กำกับดูแลงานหลักสูตร การจัดการเรียนการสอน งานวิจัย และประกันคุณภาพการศึกษา",
        accent: "border-t-4 border-amber-500",
        tag: "Academic",
      },
      {
        title: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์",
        sub: "Administrative & Strategic Affairs",
        desc: "กำกับดูแลงานบริหารทั่วไป งานนโยบายและแผน งบประมาณ การเงินและพัสดุ",
        accent: "border-t-4 border-[#C2410C]",
        tag: "Strategy",
      },
      {
        title: "รองคณบดีฝ่ายพัฒนานักศึกษาและทำนุบำรุงศิลปวัฒนธรรม",
        sub: "Student Affairs & Cultural Arts",
        desc: "กำกับดูแลกิจกรรมพัฒนานักศึกษา ทุนการศึกษา วินัยนักศึกษา และงานศิลปวัฒนธรรม",
        accent: "border-t-4 border-[#581C87]",
        tag: "Student Affairs",
      },
    ];

    const defaultOfficeUnits = [
      {
        name: "งานบริหารทั่วไป",
        en: "General Administration",
        desc: "งานสารบรรณ ธุรการ บุคลากร ประชาสัมพันธ์ และอาคารสถานที่",
      },
      {
        name: "งานนโยบายและแผน",
        en: "Policy & Planning",
        desc: "จัดทำแผนยุทธศาสตร์ แผนปฏิบัติการประจำปี และติดตามผลสัมฤทธิ์",
      },
      {
        name: "งานการเงินและพัสดุ",
        en: "Finance & Procurement",
        desc: "บริหารงบประมาณ จัดซื้อจัดจ้าง บัญชี และพัสดุครุภัณฑ์",
      },
      {
        name: "งานบริการการศึกษา",
        en: "Educational Services",
        desc: "ทะเบียนและประเมินผล จัดตารางสอน สหกิจศึกษา และงานบัณฑิตศึกษา",
      },
    ];

    const defaultStrategicPlans = [
      {
        id: "1",
        number: "01",
        badge: "ยุทธศาสตร์ที่ 1",
        name: "การยกระดับคุณภาพการศึกษา",
        desc: "Elevating Education Quality",
        icon: "GraduationCap",
        summary:
          "มุ่งผลิตบัณฑิตนวัตกรมืออาชีพ ทักษะสูง ตอบโจทย์การพัฒนาพื้นที่ พร้อมหลักสูตรปริญญาและคลังหน่วยกิต (Credit Bank)",
        color: "from-amber-500 to-[#C2410C]",
        borderHover: "hover:border-[#C2410C]",
        accentBg: "bg-amber-50 text-[#C2410C]",
        objectives: [
          "พัฒนาและปรับปรุงหลักสูตรให้ทันสมัยตอบสนองความต้องการของผู้เรียนและตลาดแรงงาน",
          "จัดการเรียนรู้เชิงรุก (Active Learning) และเสริมสร้างทักษะแห่งศตวรรษที่ 21",
        ],
        kpis: [
          "ร้อยละของบัณฑิตที่มีงานทำหรือประกอบอาชีพอิสระภายใน 1 ปี ไม่น้อยกว่า 90%",
          "หลักสูตรผ่านการประเมินคุณภาพการศึกษาตามเกณฑ์ AUN-QA 100%",
        ],
      },
      {
        id: "2",
        number: "02",
        badge: "ยุทธศาสตร์ที่ 2",
        name: "การพัฒนางานวิจัย นวัตกรรม และงานสร้างสรรค์",
        desc: "Research, Innovation, and Creative Works",
        icon: "Lightbulb",
        summary:
          "ส่งเสริมงานวิจัยเชิงสร้างสรรค์เพื่อแก้ปัญหาชุมชนอย่างมีส่วนร่วม และยกระดับขีดความสามารถนักวิจัยสู่สากล (Talent Mobility)",
        color: "from-[#C2410C] to-[#9A3412]",
        borderHover: "hover:border-[#C2410C]",
        accentBg: "bg-orange-50 text-[#C2410C]",
        objectives: [
          "สร้างและบูรณาการงานวิจัยกับชุมชนและภาคีเครือข่าย",
          "ผลักดันการเผยแพร่ผลงานวิจัยในระดับชาติและนานาชาติ",
        ],
        kpis: [
          "จำนวนผลงานวิจัยที่นำไปใช้ประโยชน์ในชุมชนและสังคมเพิ่มขึ้นไม่น้อยกว่า 15% ต่อปี",
          "จำนวนบทความวิจัยที่ได้รับการตีพิมพ์ในฐานข้อมูล Scopus/TCI กลุ่ม 1",
        ],
      },
      {
        id: "3",
        number: "03",
        badge: "ยุทธศาสตร์ที่ 3",
        name: "การพัฒนาท้องถิ่น",
        desc: "Local Development",
        icon: "Landmark",
        summary:
          "ส่งเสริมการเรียนรู้ตลอดชีวิต (Lifelong Learning) สร้างความร่วมมือจตุรภาคี และหนุนผู้ประกอบการท้องถิ่น (Local Startups)",
        color: "from-[#581C87] to-[#3B0764]",
        borderHover: "hover:border-[#581C87]",
        accentBg: "bg-purple-50 text-[#581C87]",
        objectives: [
          "ส่งเสริมการให้บริการวิชาการเพื่อยกระดับคุณภาพชีวิตของชุมชน",
          "ทำนุบำรุงและอนุรักษ์ศิลปวัฒนธรรมและภูมิปัญญาล้านนา",
        ],
        kpis: [
          "ชุมชนและองค์กรท้องถิ่นได้รับการถ่ายทอดเทคโนโลยีหรือองค์ความรู้ไม่น้อยกว่า 20 ชุมชนต่อปี",
          "ความพึงพอใจของชุมชนต่อโครงการพัฒนาท้องถิ่นไม่น้อยกว่า 90%",
        ],
      },
      {
        id: "4",
        number: "04",
        badge: "ยุทธศาสตร์ที่ 4",
        name: "การพัฒนาระบบ กลไก และการบริหารจัดการ",
        desc: "System, Mechanism, and Management Development",
        icon: "Cog",
        summary:
          "ปฏิรูประบบการบริหารจัดการตามหลักธรรมาภิบาล ยกระดับสู่มาตรฐานสากล (AUN-QA) และสร้างองค์กรแห่งความสุข (Happy Organization)",
        color: "from-slate-700 to-[#0B132B]",
        borderHover: "hover:border-[#0B132B]",
        accentBg: "bg-slate-100 text-[#0B132B]",
        objectives: [
          "พัฒนาระบบการบริหารงานบุคคล การเงิน และพัสดุให้มีประสิทธิภาพและโปร่งใส",
          "นำเทคโนโลยีดิจิทัลมาใช้ในการบริหารและบริการการศึกษา (Digital Transformation)",
        ],
        kpis: [
          "ผลการประเมินคุณธรรมและความโปร่งใส (ITA) อยู่ในระดับผ่านดีเยี่ยม",
          "ความพึงพอใจของบุคลากรต่อบรรยากาศและสภาพแวดล้อมการทำงานไม่น้อยกว่า 85%",
        ],
      },
    ];

    const historyContent = `คณะสังคมศาสตร์ ได้ก่อตั้งมาตั้งแต่ปี พ.ศ. 2546 โดยเป็นหน่วยงานที่อยู่ภายใต้โครงสร้างภายในของมหาวิทยาลัย มีหน้าที่และการบริหารจัดการศึกษาเทียบเท่ากับหน่วยงานที่อยู่ในโครงสร้างตามกฎหมายของมหาวิทยาลัย

ซึ่งปัจจุบันคณะสังคมศาสตร์ ได้พัฒนาให้มีการเรียนการสอนหลักสูตรต่าง ๆ ทั้งระดับปริญญาตรีและบัณฑิตศึกษา เพื่อตอบสนองต่อการเปลี่ยนแปลงทางเศรษฐกิจ สังคม และสิ่งแวดล้อม ตลอดจนการสร้างบัณฑิตนักปฏิบัติเพื่อรับใช้ชุมชนท้องถิ่นอย่างแท้จริง`;

    const philosophy = "องค์กรแห่งการบูรณาการองค์ความรู้เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน";
    const vision = "บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน";
    const identity = "บัณฑิตนักปฏิบัติ มีจิตสาธารณะ และตอบสนองต่อการพัฒนาท้องถิ่น";
    const uniqueness = "คณะแห่งการบูรณาการองค์ความรู้เพื่อการพัฒนาท้องถิ่นล้านนาสู่อนุภูมิภาคลุ่มน้ำโขง";

    const check = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    if (check.rows.length === 0) {
      console.log('Seeding initial row for site_settings...');
      await pool.query(
        `
        INSERT INTO site_settings (
          id,
          announcement_text,
          announcement_link,
          is_announcement_active,
          hero_headline_th,
          hero_subtext_th,
          employability_rate,
          lecturers_rate,
          communities_count,
          employer_satisfaction_rate,
          history_founded_year,
          history_content_th,
          philosophy_th,
          vision_th,
          identity_th,
          uniqueness_th,
          core_values,
          missions,
          structure_deputies,
          structure_office_units,
          strategic_plans
        ) VALUES (
          1,
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
      `,
        [
          'เปิดรับสมัครนักศึกษาใหม่ TCAS 2569 รอบ Portfolio',
          '/admissions',
          true,
          'ศาสตร์แห่งมนุษย์และสังคม เพื่อการพัฒนาล้านนาสู่สากล',
          'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย มุ่งสร้างบัณฑิตนักปฏิบัติที่มีจิตสำนึกชุมชน เข้าใจพลวัตสังคมโลก และขับเคลื่อนการพัฒนาอย่างยั่งยืน',
          '94.8%',
          '100%',
          '150+',
          '98%',
          '2546',
          historyContent,
          philosophy,
          vision,
          identity,
          uniqueness,
          JSON.stringify(defaultCoreValues),
          JSON.stringify(defaultMissions),
          JSON.stringify(defaultDeputies),
          JSON.stringify(defaultOfficeUnits),
          JSON.stringify(defaultStrategicPlans),
        ]
      );
      console.log('✅ Default site_settings seeded successfully.');
    } else {
      console.log('site_settings row id=1 already exists.');
    }

    const defaultStructureSections = [
      {
        id: "executives",
        title: "คณะผู้บริหารและรองคณบดี",
        titleEn: "Executive Board & Deputy Deans",
        description: "กำกับดูแลและบริหารงานตามพันธกิจของคณะสังคมศาสตร์",
        displayLayout: "cards",
        items: [
          {
            id: "deputy-1",
            title: "รองคณบดีฝ่ายวิชาการและวิจัย",
            subtitle: "Academic & Research Affairs",
            description: "กำกับดูแลงานหลักสูตร การจัดการเรียนการสอน งานวิจัย และประกันคุณภาพการศึกษา",
            tag: "Academic",
            accent: "border-t-4 border-amber-500",
          },
          {
            id: "deputy-2",
            title: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์",
            subtitle: "Administrative & Strategic Affairs",
            description: "กำกับดูแลงานบริหารทั่วไป งานนโยบายและแผน งบประมาณ การเงินและพัสดุ",
            tag: "Strategy",
            accent: "border-t-4 border-[#C2410C]",
          },
          {
            id: "deputy-3",
            title: "รองคณบดีฝ่ายพัฒนานักศึกษาและทำนุบำรุงศิลปวัฒนธรรม",
            subtitle: "Student Affairs & Cultural Arts",
            description: "กำกับดูแลกิจกรรมพัฒนานักศึกษา ทุนการศึกษา วินัยนักศึกษา และงานศิลปวัฒนธรรม",
            tag: "Student Affairs",
            accent: "border-t-4 border-[#581C87]",
          },
        ],
      },
      {
        id: "dean-office",
        title: "สำนักงานคณบดี",
        titleEn: "Dean's Office Units",
        description: "หน่วยงานสนับสนุนและขับเคลื่อนภารกิจการบริหารจัดการของคณะ",
        displayLayout: "cards",
        items: [
          {
            id: "unit-1",
            title: "งานบริหารทั่วไป",
            subtitle: "General Administration",
            description: "งานสารบรรณ ธุรการ บุคลากร ประชาสัมพันธ์ และอาคารสถานที่",
            tag: "Administration",
            accent: "border-t-4 border-slate-600",
          },
          {
            id: "unit-2",
            title: "งานนโยบายและแผน",
            subtitle: "Policy & Planning",
            description: "จัดทำแผนยุทธศาสตร์ แผนปฏิบัติการประจำปี และติดตามผลสัมฤทธิ์",
            tag: "Planning",
            accent: "border-t-4 border-slate-600",
          },
          {
            id: "unit-3",
            title: "งานการเงินและพัสดุ",
            subtitle: "Finance & Procurement",
            description: "บริหารงบประมาณ จัดซื้อจัดจ้าง บัญชี และพัสดุครุภัณฑ์",
            tag: "Finance",
            accent: "border-t-4 border-slate-600",
          },
          {
            id: "unit-4",
            title: "งานบริการการศึกษา",
            subtitle: "Educational Services",
            description: "ทะเบียนและประเมินผล จัดตารางสอน สหกิจศึกษา และงานบัณฑิตศึกษา",
            tag: "Education",
            accent: "border-t-4 border-slate-600",
          },
        ],
      },
    ];

    await pool.query(
      `UPDATE site_settings SET structure_sections = $1 WHERE id = 1 AND structure_sections IS NULL`,
      [JSON.stringify(defaultStructureSections)]
    );
    console.log('✅ structure_sections verified/updated.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

main();
