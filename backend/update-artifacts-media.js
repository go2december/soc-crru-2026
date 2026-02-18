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

    // Get all artifacts
    const { rows } = await client.query('SELECT id, title FROM chiang_rai_artifacts ORDER BY created_at DESC');
    console.log(`Found ${rows.length} artifacts`);

    // Media data for each artifact (matched by index)
    const mediaData = [
        {
            // กาแฟดอยช้าง
            mediaUrls: [
                'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
                'https://www.youtube.com/watch?v=EXAMPLE_COFFEE'
            ],
            mediaType: 'IMAGE'
        },
        {
            // ผ้าทอไทลื้อ
            mediaUrls: [
                'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
                'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=800&q=80',
                'https://images.unsplash.com/photo-1596568362498-1e1e0f3f3f3f?w=800&q=80'
            ],
            mediaType: 'IMAGE'
        },
        {
            // สะล้อ ซอ ซึง
            mediaUrls: [
                'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
                'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
                'https://www.youtube.com/watch?v=EXAMPLE_MUSIC'
            ],
            mediaType: 'IMAGE'
        },
        {
            // ฟ้อนเล็บ
            mediaUrls: [
                'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
                'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
                'https://www.youtube.com/watch?v=EXAMPLE_DANCE'
            ],
            mediaType: 'IMAGE'
        },
        {
            // ประเพณีสงกรานต์ล้านนา
            mediaUrls: [
                'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
                'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800&q=80',
                'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
                'https://www.youtube.com/watch?v=EXAMPLE_SONGKRAN'
            ],
            mediaType: 'IMAGE'
        },
        {
            // ชาติพันธุ์อาข่า
            mediaUrls: [
                'https://images.unsplash.com/photo-1528164344885-47b1492d2e49?w=800&q=80',
                'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
                'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800&q=80'
            ],
            mediaType: 'IMAGE'
        },
        {
            // เวียงกาหลง
            mediaUrls: [
                'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
                'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80'
            ],
            mediaType: 'IMAGE'
        },
        {
            // พระธาตุดอยตุง
            mediaUrls: [
                'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
                'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80'
            ],
            mediaType: 'IMAGE'
        },
        {
            // พ่อขุนเม็งราย
            mediaUrls: [
                'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80',
                'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80'
            ],
            mediaType: 'IMAGE'
        },
        {
            // เวียงเชียงแสน
            mediaUrls: [
                'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
                'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80',
                'https://www.youtube.com/watch?v=EXAMPLE_CHIANGSAEN'
            ],
            mediaType: 'IMAGE'
        }
    ];

    for (let i = 0; i < rows.length && i < mediaData.length; i++) {
        const artifact = rows[i];
        const media = mediaData[i];

        // PostgreSQL array literal
        const urlsArray = `{${media.mediaUrls.map(u => `"${u}"`).join(',')}}`;

        await client.query(
            'UPDATE chiang_rai_artifacts SET media_urls = $1, media_type = $2 WHERE id = $3',
            [media.mediaUrls, media.mediaType, artifact.id]
        );
        console.log(`Updated: ${artifact.title.substring(0, 40)}... (${media.mediaUrls.length} media)`);
    }

    console.log('Done!');
    await client.end();
}

main().catch(console.error);
