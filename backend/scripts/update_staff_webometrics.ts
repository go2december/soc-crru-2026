import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🚀 Updating exemplary researcher profiles with Webometrics credentials...');

    // 1. ดร.อัญชลี วงศ์วิจิตร (GIS & Geoinformatics)
    await pool.query(`
      UPDATE staff_profiles
      SET 
        google_scholar_url = 'https://scholar.google.com/citations?user=anchalee_crru',
        orcid_id = '0000-0002-1825-0097',
        scopus_author_id = '57204918200',
        first_name_en = COALESCE(NULLIF(first_name_en, ''), 'Anchalee'),
        last_name_en = COALESCE(NULLIF(last_name_en, ''), 'Wongvijit'),
        prefix_en = COALESCE(NULLIF(prefix_en, ''), 'Asst.Prof.Dr.'),
        contact_email = COALESCE(contact_email, 'anchalee.won@crru.ac.th')
      WHERE first_name_th = 'อัญชลี' AND last_name_th = 'วงศ์วิจิตร';
    `);

    // 2. ดร.ธีรพล สวัสดิผล (Social Psychology)
    await pool.query(`
      UPDATE staff_profiles
      SET 
        google_scholar_url = 'https://scholar.google.com/citations?user=teerapol_crru',
        orcid_id = '0000-0003-4567-8910',
        scopus_author_id = '57218392100',
        first_name_en = COALESCE(NULLIF(first_name_en, ''), 'Teerapol'),
        last_name_en = COALESCE(NULLIF(last_name_en, ''), 'Sawaddipol'),
        prefix_en = COALESCE(NULLIF(prefix_en, ''), 'Dr.'),
        contact_email = COALESCE(contact_email, 'teerapol.saw@crru.ac.th')
      WHERE first_name_th = 'ธีรพล' AND last_name_th = 'สวัสดิผล';
    `);

    // 3. ดร.ณรงค์ เจนใจ (Social Innovation & Hilltribe Tourism)
    await pool.query(`
      UPDATE staff_profiles
      SET 
        google_scholar_url = 'https://scholar.google.com/citations?user=narong_crru',
        orcid_id = '0000-0001-9234-5678',
        first_name_en = COALESCE(NULLIF(first_name_en, ''), 'Narong'),
        last_name_en = COALESCE(NULLIF(last_name_en, ''), 'Jenjai'),
        prefix_en = COALESCE(NULLIF(prefix_en, ''), 'Asst.Prof.Dr.'),
        contact_email = COALESCE(contact_email, 'narong.jen@crru.ac.th')
      WHERE first_name_th = 'ณรงค์' AND last_name_th = 'เจนใจ';
    `);

    // 4. อาจารย์ศิริพร แก้วมณี (Home Economics & Lanna Food)
    await pool.query(`
      UPDATE staff_profiles
      SET 
        google_scholar_url = 'https://scholar.google.com/citations?user=siriporn_crru',
        orcid_id = '0000-0002-8765-4321',
        first_name_en = COALESCE(NULLIF(first_name_en, ''), 'Siriporn'),
        last_name_en = COALESCE(NULLIF(last_name_en, ''), 'Kaewmanee'),
        prefix_en = COALESCE(NULLIF(prefix_en, ''), 'Lecturer'),
        contact_email = COALESCE(contact_email, 'siriporn.kae@crru.ac.th')
      WHERE first_name_th = 'ศิริพร' AND last_name_th = 'แก้วมณี';
    `);

    console.log('✅ Researcher profiles updated.');

    // 5. Link projects to staff members in project_members
    console.log('🔗 Linking projects to researchers in project_members...');

    const getStaffId = async (firstTh: string) => {
      const res = await pool.query('SELECT id FROM staff_profiles WHERE first_name_th = $1', [firstTh]);
      return res.rows[0]?.id;
    };

    const getProjectId = async (slug: string) => {
      const res = await pool.query('SELECT id FROM research_projects WHERE slug = $1', [slug]);
      return res.rows[0]?.id;
    };

    const anchaleeId = await getStaffId('อัญชลี');
    const teerapolId = await getStaffId('ธีรพล');
    const narongId = await getStaffId('ณรงค์');
    const siripornId = await getStaffId('ศิริพร');

    const floodProjId = await getProjectId('gis-flood-warning-mae-sai');
    const foodProjId = await getProjectId('lanna-rice-nutrition-dev');
    const tourismProjId = await getProjectId('social-impact-tourism-hilltribe');

    // Remove old project members for these projects to cleanly rebuild
    if (floodProjId) await pool.query('DELETE FROM project_members WHERE project_id = $1', [floodProjId]);
    if (foodProjId) await pool.query('DELETE FROM project_members WHERE project_id = $1', [foodProjId]);
    if (tourismProjId) await pool.query('DELETE FROM project_members WHERE project_id = $1', [tourismProjId]);

    // Insert memberships
    if (floodProjId && anchaleeId) {
      await pool.query(`
        INSERT INTO project_members (project_id, staff_profile_id, role, sort_order)
        VALUES ($1, $2, 'HEAD', 1)
      `, [floodProjId, anchaleeId]);
    }

    if (floodProjId && teerapolId) {
      await pool.query(`
        INSERT INTO project_members (project_id, staff_profile_id, role, sort_order)
        VALUES ($1, $2, 'CO_RESEARCHER', 2)
      `, [floodProjId, teerapolId]);
    }

    if (foodProjId && siripornId) {
      await pool.query(`
        INSERT INTO project_members (project_id, staff_profile_id, role, sort_order)
        VALUES ($1, $2, 'HEAD', 1)
      `, [foodProjId, siripornId]);
    }

    if (tourismProjId && narongId) {
      await pool.query(`
        INSERT INTO project_members (project_id, staff_profile_id, role, sort_order)
        VALUES ($1, $2, 'HEAD', 1)
      `, [tourismProjId, narongId]);
    }

    if (tourismProjId && teerapolId) {
      await pool.query(`
        INSERT INTO project_members (project_id, staff_profile_id, role, sort_order)
        VALUES ($1, $2, 'CO_RESEARCHER', 2)
      `, [tourismProjId, teerapolId]);
    }

    console.log('✅ Project memberships linked successfully!');

  } catch (err) {
    console.error('Error updating staff webometrics:', err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
