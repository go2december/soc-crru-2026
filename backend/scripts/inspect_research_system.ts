import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const tables = [
      'research_projects',
      'project_members',
      'project_sdgs',
      'project_locations',
      'research_outputs',
      'research_attachments',
      'academic_services',
    ];

    console.log('--- 📊 Research Database Table Statistics ---');
    for (const table of tables) {
      const res = await pool.query(`SELECT count(*) FROM ${table}`);
      console.log(`${table}: ${res.rows[0].count} records`);
    }

    console.log('\n--- 📂 Sample Projects Overview ---');
    const projects = await pool.query(`
      SELECT id, slug, title_th, year, status, is_social_service, is_commercial, is_published 
      FROM research_projects 
      ORDER BY year DESC
    `);
    console.log(projects.rows);

    console.log('\n--- 👥 Linked Faculty Members in Research ---');
    const members = await pool.query(`
      SELECT pm.id, rp.slug as project_slug, pm.role, sp.first_name_th, sp.last_name_th, pm.external_name
      FROM project_members pm
      JOIN research_projects rp ON pm.project_id = rp.id
      LEFT JOIN staff_profiles sp ON pm.staff_profile_id = sp.id
    `);
    console.log(members.rows);

    console.log('\n--- 📄 Sample Research Outputs (Publications) ---');
    const outputs = await pool.query(`
      SELECT ro.id, rp.slug, ro.title, ro.journal_name, ro.doi_url, ro.tier 
      FROM research_outputs ro
      JOIN research_projects rp ON ro.project_id = rp.id
    `);
    console.log(outputs.rows);

  } catch (err) {
    console.error('Inspection error:', err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
