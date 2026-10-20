const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://soc_admin:Soc0903297444@localhost:5432/soc_db',
});

async function runMigration() {
  await client.connect();
  console.log('Connected to soc_db successfully.');

  try {
    await client.query('BEGIN');

    // 1. Map department_id in programs
    console.log('1. Mapping department_id in programs...');
    await client.query("UPDATE programs SET department_id = 10 WHERE code = 'gis'");
    await client.query("UPDATE programs SET department_id = 8 WHERE code = 'home-eco'");
    await client.query("UPDATE programs SET department_id = 7 WHERE code = 'social-dev'");
    await client.query("UPDATE programs SET department_id = 9 WHERE code = 'social-psych'");
    await client.query("UPDATE programs SET department_id = 6 WHERE code = 'social-sci'");
    await client.query("UPDATE programs SET department_id = 11 WHERE code = 'regional-dev-ma'");
    await client.query("UPDATE programs SET department_id = 11 WHERE code = 'regional-dev-phd'");
    console.log('department_id mapped successfully.');

    // 2. Add social_links column to programs if not exists
    console.log('2. Adding social_links column to programs...');
    await client.query('ALTER TABLE programs ADD COLUMN IF NOT EXISTS social_links JSONB;');

    // 3. Create ENUMs for program_tracks
    console.log('3. Creating ENUMs for program_tracks...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE track_type AS ENUM ('CONCENTRATION', 'MAJOR', 'MINOR');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE study_plan_type AS ENUM ('REGULAR_4YR', 'TRANSFER_2YR', 'GRADUATE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 4. Create program_tracks table
    console.log('4. Creating program_tracks table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS program_tracks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
        code VARCHAR(100) NOT NULL,
        name_th VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        track_type track_type DEFAULT 'MAJOR' NOT NULL,
        study_plan_type study_plan_type DEFAULT 'REGULAR_4YR' NOT NULL,
        degree_title_th VARCHAR(255),
        degree_title_en VARCHAR(255),
        description TEXT,
        structure JSONB,
        careers TEXT[],
        highlights JSONB,
        banner_url VARCHAR(500),
        curriculum_url VARCHAR(500),
        youtube_video_url VARCHAR(500),
        facebook_video_url VARCHAR(500),
        social_links JSONB,
        gallery_images TEXT[],
        attachments JSONB,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_program_track_code UNIQUE (program_id, code)
      );
    `);

    // 5. Migrate tracks from existing programs.concentrations
    console.log('5. Migrating tracks into program_tracks...');
    
    // Get social-sci ID
    const socialSciRes = await client.query("SELECT id FROM programs WHERE code = 'social-sci'");
    if (socialSciRes.rows.length > 0) {
      const socialSciId = socialSciRes.rows[0].id;
      
      // Track 1: sociology-anthropology
      await client.query(`
        INSERT INTO program_tracks (
          program_id, code, name_th, name_en, track_type, study_plan_type,
          degree_title_th, degree_title_en, description, banner_url, structure,
          highlights, careers, social_links, sort_order
        ) VALUES (
          $1, 'sociology-anthropology',
          'แขนงวิชาสังคมวิทยาและมานุษยวิทยา', 'Sociology and Anthropology',
          'CONCENTRATION', 'REGULAR_4YR',
          'ศิลปศาสตรบัณฑิต (สังคมศาสตร์)', 'Bachelor of Arts (Social Sciences)',
          'เน้นการปั้นบัณฑิตให้เป็นผู้นำการเปลี่ยนแปลงสังคม (Change Agents) ที่เข้าใจชุมชนอย่างลึกซึ้งผ่านทักษะการวิจัยภาคสนามและนวัตกรรมดิจิทัล เพื่อการพัฒนาสังคมและยกระดับคุณภาพชีวิตอย่างยั่งยืน',
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
          '{"general": 30, "major": 94, "freeElective": 6, "totalCredits": 130}',
          '[
            {"title": "การวิจัยภาคสนามเชิงลึก", "description": "ฝึกปฏิบัติการวิจัยและเก็บข้อมูลในพื้นที่จริงกับชุมชนและกลุ่มชาติพันธุ์ในอนุภูมิภาคลุ่มน้ำโขง"},
            {"title": "Digital Social Innovation", "description": "ประยุกต์ใช้เทคโนโลยีดิจิทัลและการวิเคราะห์ข้อมูลทางสังคมเพื่อออกแบบนโยบายและแก้ปัญหาสังคมร่วมสมัย"},
            {"title": "เครือข่ายความร่วมมือระดับสากล", "description": "แลกเปลี่ยนทางวิชาการและศึกษาดูงานกับสถาบันวิจัยและองค์กรพัฒนาเอกชนชั้นนำ"}
          ]',
          ARRAY['นักวิจัยทางสังคมและมานุษยวิทยา', 'นักพัฒนาสังคมและชุมชน (ภาครัฐ / NGOs)', 'เจ้าหน้าที่วิเคราะห์นโยบายและแผน', 'ผู้ประสานงานโครงการระหว่างประเทศ'],
          '{"facebook": "https://www.facebook.com/soc.crru", "tiktok": "", "instagram": "", "youtube": "", "line": ""}',
          1
        ) ON CONFLICT (program_id, code) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          banner_url = EXCLUDED.banner_url,
          structure = EXCLUDED.structure,
          highlights = EXCLUDED.highlights,
          careers = EXCLUDED.careers,
          social_links = EXCLUDED.social_links;
      `, [socialSciId]);

      // Track 2: cultural-resource-management
      await client.query(`
        INSERT INTO program_tracks (
          program_id, code, name_th, name_en, track_type, study_plan_type,
          degree_title_th, degree_title_en, description, banner_url, structure,
          highlights, careers, social_links, sort_order
        ) VALUES (
          $1, 'cultural-resource-management',
          'แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม', 'Cultural Resource Management',
          'CONCENTRATION', 'REGULAR_4YR',
          'ศิลปศาสตรบัณฑิต (สังคมศาสตร์)', 'Bachelor of Arts (Social Sciences)',
          'เน้นการจัดการมรดกและทุนวัฒนธรรมด้วยมุมมองสร้างสรรค์และการบูรณาการเทคโนโลยีเพื่อสร้างอาชีพ การท่องเที่ยวเชิงวัฒนธรรมอย่างยั่งยืน และการต่อยอดเศรษฐกิจสร้างสรรค์ (Creative Economy)',
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop',
          '{"general": 30, "major": 94, "freeElective": 6, "totalCredits": 130}',
          '[
            {"title": "การบริหารจัดการมรดกทางวัฒนธรรม", "description": "เรียนรู้การอนุรักษ์ ฟื้นฟู และยกระดับคุณค่าทางวัฒนธรรมท้องถิ่นสู่ระดับสากล"},
            {"title": "เศรษฐกิจสร้างสรรค์และการท่องเที่ยว", "description": "พัฒนาผลิตภัณฑ์ทางวัฒนธรรมและการจัดการการท่องเที่ยวเชิงสร้างสรรค์อย่างยั่งยืน"},
            {"title": "Digital Cultural Heritage", "description": "การจัดเก็บและนำเสนอข้อมูลมรดกทางวัฒนธรรมด้วยเทคโนโลยีสารสนเทศและสื่อดิจิทัล"}
          ]',
          ARRAY['นักจัดการวัฒนธรรมและพิพิธภัณฑ์', 'นักวิชาการวัฒนธรรม / เจ้าหน้าที่กระทรวงวัฒนธรรม', 'ผู้ประกอบการธุรกิจสร้างสรรค์และสินค้าวัฒนธรรม', 'นักวางแผนการท่องเที่ยวเชิงวัฒนธรรม'],
          '{"facebook": "https://www.facebook.com/soc.crru", "tiktok": "", "instagram": "", "youtube": "", "line": ""}',
          2
        ) ON CONFLICT (program_id, code) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          banner_url = EXCLUDED.banner_url,
          structure = EXCLUDED.structure,
          highlights = EXCLUDED.highlights,
          careers = EXCLUDED.careers,
          social_links = EXCLUDED.social_links;
      `, [socialSciId]);
    }

    // Get home-eco ID
    const homeEcoRes = await client.query("SELECT id FROM programs WHERE code = 'home-eco'");
    if (homeEcoRes.rows.length > 0) {
      const homeEcoId = homeEcoRes.rows[0].id;
      
      // Track 1: culinary-and-service (4YR)
      await client.query(`
        INSERT INTO program_tracks (
          program_id, code, name_th, name_en, track_type, study_plan_type,
          degree_title_th, degree_title_en, description, banner_url, structure,
          highlights, careers, social_links, sort_order
        ) VALUES (
          $1, 'culinary-and-service',
          'วิชาเอกการประกอบอาหารและบริการ', 'Culinary and Service',
          'MAJOR', 'REGULAR_4YR',
          'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)', 'Bachelor of Science (Home Economics)',
          'เน้นทักษะด้านอาหารไทยและนานาชาติ มาตรฐานสุขาภิบาลอาหาร การบริการ และการจัดเลี้ยงแบบมืออาชีพ โดยผู้จบหลักสูตรจะสอบมาตรฐานคุณวุฒิวิชาชีพอาหารไทยระดับสากล พร้อมก้าวสู่ธุรกิจอาหารและโรงแรมระดับพรีเมียม',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop',
          '{"general": 30, "major": 96, "freeElective": 6, "totalCredits": 132}',
          '[
            {"title": "มาตรฐานฝีมือแรงงานอาหารไทยระดับสากล", "description": "ฝึกปฏิบัติในครัวมาตรฐานโรงแรม พร้อมสอบเทียบมาตรฐานวิชาชีพอาหารไทย"},
            {"title": "ศิลปะการบริการและการจัดเลี้ยงครบวงจร", "description": "เชี่ยวชาญการบริหารจัดการภัตตาคาร การจัดเลี้ยงนอกสถานที่ และงานบริการระดับมืออาชีพ"},
            {"title": "ศาสตร์อาหารเชิงสร้างสรรค์และโภชนาการ", "description": "ออกแบบเมนูสุขภาพ อาหารเฉพาะกลุ่ม และการคำนวณต้นทุนการผลิตเชิงธุรกิจ"}
          ]',
          ARRAY['เชฟและผู้เชี่ยวชาญด้านอาหาร (Chef & Culinary Specialist)', 'ผู้ประกอบการธุรกิจอาหารและเครื่องดื่ม (F&B Entrepreneur)', 'ผู้จัดการฝ่ายบริการอาหารและเครื่องดื่มในโรงแรม'],
          '{"facebook": "https://www.facebook.com/soc.crru", "tiktok": "", "instagram": "", "youtube": "", "line": ""}',
          1
        ) ON CONFLICT (program_id, code) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          banner_url = EXCLUDED.banner_url,
          structure = EXCLUDED.structure,
          highlights = EXCLUDED.highlights,
          careers = EXCLUDED.careers,
          social_links = EXCLUDED.social_links;
      `, [homeEcoId]);

      // Track 2: applied-home-economics (4YR)
      await client.query(`
        INSERT INTO program_tracks (
          program_id, code, name_th, name_en, track_type, study_plan_type,
          degree_title_th, degree_title_en, description, banner_url, structure,
          highlights, careers, social_links, sort_order
        ) VALUES (
          $1, 'applied-home-economics',
          'วิชาเอกคหกรรมศาสตร์ประยุกต์', 'Applied Home Economics',
          'MAJOR', 'REGULAR_4YR',
          'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)', 'Bachelor of Science (Home Economics)',
          'เน้นงานคหกรรมศาสตร์รอบด้าน ทั้งการออกแบบแฟชั่นและสิ่งทอ การจัดดอกไม้และการตกแต่งสถานที่ งานประดิษฐ์สร้างสรรค์ และการแกะสลักผักผลไม้ชั้นสูง เพื่อยกระดับสู่ผลิตภัณฑ์เชิงพาณิชย์และธุรกิจไลฟ์สไตล์ร่วมสมัย',
          'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2070&auto=format&fit=crop',
          '{"general": 30, "major": 96, "freeElective": 6, "totalCredits": 132}',
          '[
            {"title": "หัตถศิลป์สร้างสรรค์และงานประดิษฐ์ร่วมสมัย", "description": "ผสมผสานภูมิปัญญาล้านนากับเทคนิคสมัยใหม่เพื่อสร้างสรรค์งานตกแต่งระดับพรีเมียม"},
            {"title": "การออกแบบสิ่งทอ แฟชั่น และการตัดเย็บ", "description": "เชี่ยวชาญการแพตเทิร์น การออกแบบแฟชั่นสิ่งทอ และการตัดเย็บประณีต"},
            {"title": "ศิลปะการจัดดอกไม้และการตกแต่งสถานที่", "description": "ออกแบบงานตกแต่งสำหรับงานพิธีการ อีเวนต์ และโรงแรมชั้นนำ"}
          ]',
          ARRAY['นักออกแบบและผู้ประกอบการสินค้าไลฟ์สไตล์/งานฝีมือ', 'นักออกแบบแฟชั่นและสิ่งทอ (Fashion & Textile Designer)', 'นักจัดดอกไม้และผู้เชี่ยวชาญการตกแต่งสถานที่'],
          '{"facebook": "https://www.facebook.com/soc.crru", "tiktok": "", "instagram": "", "youtube": "", "line": ""}',
          2
        ) ON CONFLICT (program_id, code) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          banner_url = EXCLUDED.banner_url,
          structure = EXCLUDED.structure,
          highlights = EXCLUDED.highlights,
          careers = EXCLUDED.careers,
          social_links = EXCLUDED.social_links;
      `, [homeEcoId]);

      // Track 3: culinary-and-service-transfer (TRANSFER_2YR เทียบโอน 2 ปีหลัง)
      await client.query(`
        INSERT INTO program_tracks (
          program_id, code, name_th, name_en, track_type, study_plan_type,
          degree_title_th, degree_title_en, description, banner_url, structure,
          highlights, careers, social_links, sort_order
        ) VALUES (
          $1, 'culinary-and-service-transfer',
          'วิชาเอกการประกอบอาหารและบริการ (เทียบโอน 2 ปี)', 'Culinary and Service (2-Year Continuing Transfer)',
          'MAJOR', 'TRANSFER_2YR',
          'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)', 'Bachelor of Science (Home Economics)',
          'หลักสูตรเทียบโอนผลการเรียนรู้ สำหรับผู้สำเร็จการศึกษาระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) สาขาวิชาอาหารและโภชนาการ หรือสาขาที่เกี่ยวข้อง ศึกษาต่อเพียง 2 ปีเพื่อรับวุฒิปริญญาตรี พร้อมยกระดับทักษะการบริหารภัตตาคารและอาหารไทยสู่สากล',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop',
          '{"general": 12, "major": 54, "freeElective": 6, "totalCredits": 72}',
          '[
            {"title": "เทียบโอนหน่วยกิตจาก ปวส. ได้รวดเร็ว", "description": "เทียบโอนรายวิชาพื้นฐานและทักษะปฏิบัติ เรียนต่อเพียง 2 ปีสำเร็จการศึกษา"},
            {"title": "ต่อยอดสู่ระดับบริหารและผู้ประกอบการ", "description": "เน้นทักษะบริหารจัดการ การตลาด และการเป็นผู้ประกอบการธุรกิจอาหาร"},
            {"title": "จัดเวลาเรียนที่ยืดหยุ่น", "description": "รองรับทั้งผู้เรียนต่อทันทีและผู้ที่ทำงานแล้ว"}
          ]',
          ARRAY['เชฟระดับหัวหน้าครัว (Executive Chef)', 'ผู้จัดการร้านอาหารและบริการจัดเลี้ยง', 'ผู้ประกอบการธุรกิจอาหารและเครื่องดื่ม'],
          '{"facebook": "https://www.facebook.com/soc.crru", "tiktok": "", "instagram": "", "youtube": "", "line": ""}',
          3
        ) ON CONFLICT (program_id, code) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          banner_url = EXCLUDED.banner_url,
          structure = EXCLUDED.structure,
          highlights = EXCLUDED.highlights,
          careers = EXCLUDED.careers,
          social_links = EXCLUDED.social_links;
      `, [homeEcoId]);
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
