import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("SELECT id, slug FROM research_projects WHERE slug = 'gis-flood-warning-mae-sai'");
    const floodId = res.rows[0]?.id;

    if (floodId) {
      await pool.query("DELETE FROM research_outputs WHERE project_id = $1", [floodId]);
      await pool.query(
        `INSERT INTO research_outputs (
          project_id, output_type, title, journal_name, publication_date, 
          volume, issue, pages, citation, doi_url, tier
        ) VALUES (
          $1, 'JOURNAL_ARTICLE', 
          'Geoinformatics-Based Early Flood Warning System in Northern Thailand',
          'Journal of Social and Environmental Sciences', 
          '2026-03-15', '14', '2', '105-122', 
          'Wongvijit, A., & Sawaddipol, T. (2026). Geoinformatics-Based Early Flood Warning System in Northern Thailand. Journal of Social and Environmental Sciences, 14(2), 105-122.', 
          'https://doi.org/10.1016/j.socenv.2026.03.014', 
          'TCI กลุ่มที่ 1'
        )`,
        [floodId]
      );
      console.log('✅ Seeded sample research output for gis-flood-warning-mae-sai');
    }

    const riceRes = await pool.query("SELECT id, slug FROM research_projects WHERE slug = 'lanna-rice-nutrition-dev'");
    const riceId = riceRes.rows[0]?.id;
    if (riceId) {
      await pool.query("DELETE FROM research_outputs WHERE project_id = $1", [riceId]);
      await pool.query(
        `INSERT INTO research_outputs (
          project_id, output_type, title, journal_name, publication_date, 
          volume, issue, pages, citation, doi_url, tier
        ) VALUES (
          $1, 'JOURNAL_ARTICLE', 
          'Nutritional Assessment and Anthocyanin Stability in Lanna Indigenous Pigmented Rice',
          'Asian Journal of Food Science and Nutrition', 
          '2026-02-10', '8', '1', '45-58', 
          'Kaewmanee, S. (2026). Nutritional Assessment and Anthocyanin Stability in Lanna Indigenous Pigmented Rice. Asian Journal of Food Science and Nutrition, 8(1), 45-58.', 
          'https://doi.org/10.1016/j.ajfsn.2026.02.008', 
          'Scopus Q2 / TCI กลุ่มที่ 1'
        )`,
        [riceId]
      );
      console.log('✅ Seeded sample research output for lanna-rice-nutrition-dev');
    }
  } catch (err) {
    console.error('Error seeding outputs:', err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
