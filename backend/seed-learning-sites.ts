import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './src/drizzle/schema';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
    console.log('🌱 Seeding Chiang Rai Learning Sites...');

    const sitesData = [
        {
            title: 'วัดร่องขุ่น (White Temple)',
            slug: 'wat-rong-khun',
            description: 'วัดพุทธศิลป์ร่วมสมัยที่มีชื่อเสียงระดับโลก ออกแบบและสร้างโดย อาจารย์เฉลิมชัย โฆษิตพิพัฒน์',
            content: `<h2>วัดร่องขุ่น (White Temple)</h2>
<p>วัดร่องขุ่น ออกแบบและก่อสร้างโดย อาจารย์เฉลิมชัย โฆษิตพิพัฒน์ ศิลปินแห่งชาติ สาขาทัศนศิลป์ (จิตรกรรม) เมื่อปี พ.ศ. 2540 จุดเด่นของวัดคือ พระอุโบสถที่ตกแต่งด้วยสีขาวบริสุทธิ์ ประดับด้วยกระจกแวววาว สื่อถึงพระบริสุทธิคุณของพระพุทธเจ้า</p>
<h3>จุดน่าสนใจ</h3>
<ul>
  <li>พระอุโบสถสีขาว ประดับกระจก</li>
  <li>สะพานวัฏสงสาร สื่อถึงการข้ามพ้นกิเลส</li>
  <li>หอศิลป์ รวบรวมผลงานของอาจารย์เฉลิมชัย</li>
</ul>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1627814406692-749e49b80bbf?auto=format&fit=crop&q=80',
            mediaType: 'IMAGE' as const,
            mediaUrls: [
                'https://images.unsplash.com/photo-1627814406692-749e49b80bbf?auto=format&fit=crop&q=80',
            ],
            tags: ['ศิลปะ', 'วัด', 'ศาสนา', 'เฉลิมชัย โฆษิตพิพัฒน์'],
            author: 'ศูนย์เชียงรายศึกษา',
        },
        {
            title: 'พิพิธภัณฑ์บ้านดำ (Baan Dam Museum)',
            slug: 'baan-dam-museum',
            description: 'กลุ่มบ้านศิลปะสไตล์ล้านนาประยุกต์ทาด้วยสีดำ แหล่งรวบรวมของสะสมและผลงานศิลปะของ อาจารย์ถวัลย์ ดัชนี',
            content: `<h2>พิพิธภัณฑ์บ้านดำ (Baan Dam Museum)</h2>
<p>พื้นที่ศิลปะและพิพิธภัณฑ์ที่รวบรวมผลงานของ อาจารย์ถวัลย์ ดัชนี ศิลปินแห่งชาติ สาขาทัศนศิลป์ (จิตรกรรม) ภายในประกอบด้วยบ้านไม้ทรงล้านนาประยุกต์ทาสีดำกว่า 40 หลัง แต่ละหลังจัดแสดงผลงานศิลปะ ไม้แกะสลัก เขาควาย และหนังสัตว์ต่างๆ</p>
<h3>จุดน่าสนใจ</h3>
<ul>
  <li>สถาปัตยกรรมล้านนาประยุกต์ </li>
  <li>คอลเลกชันเขาสัตว์และกระดูกสัตว์</li>
  <li>ภาพวาดและผลงานประติมากรรมอันเป็นเอกลักษณ์</li>
</ul>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1549488344-93e5077227e7?auto=format&fit=crop&q=80',
            mediaType: 'IMAGE' as const,
            mediaUrls: [],
            tags: ['ศิลปะ', 'พิพิธภัณฑ์', 'สถาปัตยกรรมล้านนา', 'ถวัลย์ ดัชนี'],
            author: 'ศูนย์เชียงรายศึกษา',
        },
        {
            title: 'ไร่เชิญตะวัน (ศูนย์วิปัสสนาสากลไร่เชิญตะวัน)',
            slug: 'rai-cherntawan',
            description: 'ศูนย์เรียนรู้ทางธรรมและสถานที่ปฏิบัติธรรม ก่อตั้งโดย ท่านว.วชิรเมธี',
            content: `<h2>ศูนย์วิปัสสนาสากลไร่เชิญตะวัน</h2>
<p>ศูนย์เรียนรู้ทางพระพุทธศาสนาและวิปัสสนากรรมฐาน ก่อตั้งโดย พระเมธีวชิโรดม (ท่านว.วชิรเมธี) มีพื้นที่ร่มรื่น เต็มไปด้วยปริศนาธรรมและศิลปะที่สอดแทรกหลักธรรมคำสอน</p>
<h3>จุดน่าสนใจ</h3>
<ul>
  <li>ลานปริศนาธรรม</li>
  <li>สวนธรรมะและพื้นที่เงียบสงบสำหรับการวิปัสสนา</li>
  <li>ห้องสมุดธรรมะ</li>
</ul>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80',
            mediaType: 'IMAGE' as const,
            mediaUrls: [],
            tags: ['ศาสนา', 'ปฏิบัติธรรม', 'ว.วชิรเมธี'],
            author: 'ศูนย์เชียงรายศึกษา',
        },
        {
             title: 'หอฝิ่น อุทยานสามเหลี่ยมทองคำ',
             slug: 'hall-of-opium',
             description: 'นิทรรศการระดับโลกที่จัดแสดงประวัติศาสตร์ของฝิ่นในดินแดนสามเหลี่ยมทองคำ',
             content: `<h2>หอฝิ่น อุทยานสามเหลี่ยมทองคำ (Hall of Opium)</h2>
<p>ศูนย์นิทรรศการที่บอกเล่าประวัติศาสตร์อันยาวนานของฝิ่นในพื้นที่สามเหลี่ยมทองคำ ตั้งแต่จุดเริ่มต้นของการค้าฝิ่น ผลกระทบของยาเสพติด ไปจนถึงความพยายามในการฟื้นฟูชุมชนและปราบปรามยาเสพติด สร้างขึ้นโดยมูลนิธิแม่ฟ้าหลวง</p>
<h3>ไฮไลท์สำคัญ</h3>
<ul>
   <li>อุโมงค์ภาพลวงตาและทางเข้าที่ลึกลับ</li>
   <li>ประวัติศาสตร์สงครามฝิ่นและการแพร่กระจายของยาเสพติดทั่วโลก</li>
   <li>ห้องจัดแสดงนิทรรศการวิถีชีวิตชาวเขาเผ่าต่างๆ</li>
</ul>`,
             thumbnailUrl: 'https://images.unsplash.com/photo-1582269438701-443fc3652db8?auto=format&fit=crop&q=80',
             mediaType: 'IMAGE' as const,
             mediaUrls: [],
             tags: ['ประวัติศาสตร์', 'พิพิธภัณฑ์', 'สามเหลี่ยมทองคำ'],
             author: 'ศูนย์เชียงรายศึกษา',
        },
        {
             title: 'อุทยานศิลปะวัฒนธรรมแม่ฟ้าหลวง',
             slug: 'mae-fah-luang-art-culture-park',
             description: 'ศูนย์รวมศิลปวัตถุและมรดกทางวัฒนธรรมของล้านนาที่ใหญ่ที่สุดในภูมิภาค',
             content: `<h2>อุทยานศิลปะวัฒนธรรมแม่ฟ้าหลวง (ไร่แม่ฟ้าหลวง)</h2>
<p>แหล่งรวบรวมและอนุรักษ์สถาปัตยกรรมและศิลปะล้านนา ภายในร่มรื่นด้วยต้นไม้ใหญ่ ไฮไลท์สำคัญคือ "หอคำ" ซึ่งสร้างขึ้นจากไม้สักทองเพื่อเป็นที่ประดิษฐานพระพุทธรูปสำคัญของเชียงราย</p>
<h3>สิ่งที่ไม่ควรพลาด</h3>
<ul>
    <li>หอคำ (สถาปัตยกรรมไม้สักทอง)</li>
    <li>หอแก้ว (สถานที่จัดแสดงนิทรรศการหมุนเวียน)</li>
    <li>ลานสักและสวนพฤกษศาสตร์</li>
</ul>`,
             thumbnailUrl: 'https://images.unsplash.com/photo-1634638780367-be3efffb5be8?auto=format&fit=crop&q=80',
             mediaType: 'IMAGE' as const,
             mediaUrls: [],
             tags: ['วัฒนธรรม', 'ล้านนา', 'สถาปัตยกรรม', 'ศิลปะ'],
             author: 'ศูนย์เชียงรายศึกษา',
        }
    ];

    try {
        for (const site of sitesData) {
            // Check if exists
            const existing = await db
                .select()
                .from(schema.chiangRaiLearningSites)
                .where(eq(schema.chiangRaiLearningSites.slug, site.slug));

            if (existing.length === 0) {
                await db.insert(schema.chiangRaiLearningSites).values(site);
                console.log(`✅ Created learning site: ${site.title}`);
            } else {
                await db.update(schema.chiangRaiLearningSites).set(site).where(eq(schema.chiangRaiLearningSites.slug, site.slug));
                console.log(`🔄 Updated learning site: ${site.title}`);
            }
        }
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await pool.end();
        console.log('🏁 Seeding learning sites completed.');
    }
}

main();
