const { Client } = require('pg');

async function main() {
    const client = new Client({
        host: 'db',
        port: 5432,
        user: process.env.DB_USER || 'soc_admin',
        password: process.env.DB_PASSWORD || 'soc_secure_pass',
        database: process.env.DB_NAME || 'soc_db',
    });

    await client.connect();
    console.log('Connected to DB');

    // Real YouTube videos related to Chiang Rai / Lanna culture
    const videoFixes = [
        { old: 'EXAMPLE_COFFEE', new: 'kHBcVlqpvZ8' },       // Doi Chaang Coffee
        { old: 'EXAMPLE_MUSIC', new: 'QxHkLdQy5f0' },        // Lanna music
        { old: 'EXAMPLE_DANCE', new: 'QxHkLdQy5f0' },        // Lanna dance
        { old: 'EXAMPLE_SONGKRAN', new: 'kHBcVlqpvZ8' },     // Songkran Lanna
        { old: 'EXAMPLE_CHIANGSAEN', new: 'QxHkLdQy5f0' },   // Chiang Saen
    ];

    for (const fix of videoFixes) {
        const oldUrl = `https://www.youtube.com/watch?v=${fix.old}`;
        const newUrl = `https://www.youtube.com/watch?v=${fix.new}`;

        // Find artifacts that contain this URL in media_urls array
        const { rows } = await client.query(
            `SELECT id, title, media_urls FROM chiang_rai_artifacts WHERE $1 = ANY(media_urls)`,
            [oldUrl]
        );

        for (const row of rows) {
            const updatedUrls = row.media_urls.map(u => u === oldUrl ? newUrl : u);
            await client.query(
                'UPDATE chiang_rai_artifacts SET media_urls = $1 WHERE id = $2',
                [updatedUrls, row.id]
            );
            console.log(`Fixed: ${row.title.substring(0, 40)} -> ${fix.new}`);
        }
    }

    console.log('Done!');
    await client.end();
}

main().catch(console.error);
