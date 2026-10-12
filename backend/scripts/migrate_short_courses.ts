import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('Checking and creating/updating short_courses table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        instructor_name VARCHAR(255),
        cover_image_url VARCHAR(500),
        duration_hours INTEGER DEFAULT 0 NOT NULL,
        credit_bank_value INTEGER DEFAULT 0 NOT NULL,
        is_online BOOLEAN DEFAULT false NOT NULL,
        price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        lifelong_url VARCHAR(500),
        is_credit_bank BOOLEAN DEFAULT true NOT NULL,
        status VARCHAR(50) DEFAULT 'OPEN' NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Ensure all columns exist in case table already existed
    const alterQueries = [
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS code VARCHAR(50);`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS category VARCHAR(100);`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS description TEXT;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(255);`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 0 NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS credit_bank_value INTEGER DEFAULT 0 NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0 NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS lifelong_url VARCHAR(500);`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS is_credit_bank BOOLEAN DEFAULT true NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'OPEN' NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0 NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW() NOT NULL;`,
      `ALTER TABLE short_courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;`,
    ];

    for (const q of alterQueries) {
      await pool.query(q);
    }

    console.log('✅ short_courses table verified and updated successfully.');

    // Seed initial sample course if table is empty
    const countRes = await pool.query('SELECT COUNT(*) FROM short_courses');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial course: ตุงและโคมประดิษฐ์...');
      await pool.query(`
        INSERT INTO short_courses (
          code,
          title,
          category,
          description,
          instructor_name,
          cover_image_url,
          duration_hours,
          credit_bank_value,
          is_online,
          price,
          lifelong_url,
          is_credit_bank,
          status,
          sort_order,
          is_active
        ) VALUES (
          'LL6506004',
          'ตุงและโคมประดิษฐ์',
          'ศิลปวัฒนธรรมและภูมิปัญญาท้องถิ่น',
          'เรียนรู้แนวคิด ลักษณะ ความสำคัญ ประเภท และการใช้งานตามคติความเชื่อของตุงและโคมล้านนา รวมถึงการฝึกปฏิบัติการประดิษฐ์ตุงและโคมล้านนาในรูปแบบต่างๆ ที่มีเทคนิค วิธีการและขั้นตอนพื้นฐานจากภูมิปัญญาท้องถิ่น',
          'ผู้ช่วยศาสตราจารย์ ดร.ณรงค์ เจนใจ',
          'https://lifelong.crru.ac.th/upload-assets/images/course/GJvgMnqsxNFVkQiSCEyup9zI5TXe8c.webp',
          6,
          1,
          false,
          0,
          'https://lifelong.crru.ac.th/course/detail/%E0%B8%95%E0%B8%B8%E0%B8%87%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%82%E0%B8%84%E0%B8%A1%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B4%E0%B8%A9%E0%B8%90%E0%B9%8C',
          true,
          'OPEN',
          1,
          true
        );
      `);
      console.log('✅ Seeded initial course successfully.');
    } else {
      console.log(`Table already contains ${countRes.rows[0].count} records.`);
    }
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

main();
