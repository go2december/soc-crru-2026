import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('Checking and creating academic_service_configs table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS academic_service_configs (
        id INTEGER PRIMARY KEY DEFAULT 1,
        contact_email VARCHAR(255) DEFAULT 'social@crru.ac.th',
        contact_phone VARCHAR(255) DEFAULT '053-776-000 ต่อ 1211',
        office_hours VARCHAR(255) DEFAULT 'วันจันทร์ - ศุกร์ (08:30 - 16:30 น.)',
        office_location VARCHAR(255) DEFAULT 'อาคารเรียนรวมคณะสังคมศาสตร์ (อาคาร 4) ชั้น 1',
        response_time VARCHAR(255) DEFAULT '3-5 วันทำการ',
        pdf_form_url TEXT,
        docx_form_url TEXT,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Ensure default row exists
    const res = await pool.query('SELECT * FROM academic_service_configs WHERE id = 1');
    if (res.rows.length === 0) {
      console.log('Seeding default row for academic_service_configs...');
      await pool.query(`
        INSERT INTO academic_service_configs (
          id,
          contact_email,
          contact_phone,
          office_hours,
          office_location,
          response_time,
          pdf_form_url,
          docx_form_url
        ) VALUES (
          1,
          'social@crru.ac.th',
          '053-776-000 ต่อ 1211',
          'วันจันทร์ - ศุกร์ (08:30 - 16:30 น.)',
          'อาคารเรียนรวมคณะสังคมศาสตร์ (อาคาร 4) ชั้น 1',
          '3-5 วันทำการ',
          '/documents/academic-service-request-form.pdf',
          '/documents/academic-service-request-form.docx'
        );
      `);
      console.log('✅ Default academic_service_configs row seeded successfully.');
    } else {
      console.log('Row id=1 already exists in academic_service_configs.');
    }

    console.log('✅ academic_service_configs migration completed.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

main();
