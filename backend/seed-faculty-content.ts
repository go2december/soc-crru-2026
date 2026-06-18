import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './libs/database/src/schema';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
    console.log('🌱 Seeding Faculty Real Content (News, Staff, Research)...');

    // =============================================
    // 1. News (ข่าวสารคณะ)
    // =============================================
    const newsData = [
        {
            title: 'คณะสังคมศาสตร์ มรภ.เชียงราย จัดสัมมนาวิชาการระดับชาติ "นวัตกรรมสังคมเพื่อการพัฒนาที่ยั่งยืน 2026"',
            slug: 'social-innovation-seminar-2026',
            category: 'EVENT' as const,
            content: `<h2>นวัตกรรมสังคมเพื่อการพัฒนาที่ยั่งยืน 2026</h2>
<p>เมื่อวันที่ 15 เมษายน 2569 คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ได้จัดโครงการสัมมนาวิชาการระดับชาติในหัวข้อ "นวัตกรรมสังคมเพื่อการพัฒนาที่ยั่งยืน" เพื่อเป็นเวทีแลกเปลี่ยนเรียนรู้และนำเสนอผลงานวิจัยของนักวิชาการและนักศึกษา</p>
<p>ภายในงานมีการบรรยายพิเศษโดยผู้เชี่ยวชาญด้านการพัฒนาสังคม และการนำเสนอผลงานวิจัยในรูปแบบปากเปล่าและโปสเตอร์ ครอบคลุมประเด็นด้านจิตวิทยาสังคม ภูมิสารสนเทศ และการจัดการวัฒนธรรม</p>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1540575861501-7ad05823c951?q=80&w=2070&auto=format&fit=crop',
            isPublished: true,
            publishedAt: new Date('2026-04-15'),
        },
        {
            title: 'เปิดรับสมัครนักศึกษาใหม่ รอบโควตาภาคเหนือ ประจำปีการศึกษา 2569',
            slug: 'admission-quota-2026',
            category: 'ANNOUNCE' as const,
            content: `<h2>Admission 2026 - รอบโควตาภาคเหนือ</h2>
<p>คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เปิดรับสมัครบุคคลเข้าศึกษาต่อในระดับปริญญาตรี ประจำปีการศึกษา 2569 รอบโควตาภาคเหนือ ใน 5 สาขาวิชาหลัก:</p>
<ul>
<li>สาขาวิชาสังคมศาสตร์</li>
<li>สาขาวิชานวัตกรรมการพัฒนาสังคม</li>
<li>สาขาวิชาคหกรรมศาสตร์</li>
<li>สาขาวิชาจิตวิทยาสังคม</li>
<li>สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ</li>
</ul>
<p>สมัครได้ตั้งแต่วันนี้ - 30 พฤษภาคม 2569 ทางเว็บไซต์ <a href="https://admission.crru.ac.th">admission.crru.ac.th</a></p>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
            isPublished: true,
            publishedAt: new Date('2026-04-20'),
        },
        {
            title: 'นักศึกษาภูมิศาสตร์และภูมิสารสนเทศ คว้ารางวัลชนะเลิศการประกวดนวัตกรรมแผนที่ดิจิทัลระดับประเทศ',
            slug: 'gis-students-win-national-award',
            category: 'NEWS' as const,
            content: `<h2>รางวัลชนะเลิศนวัตกรรมแผนที่ดิจิทัล</h2>
<p>ขอแสดงความยินดีกับทีมนักศึกษาจากสาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ คณะสังคมศาสตร์ ที่ได้รับรางวัลชนะเลิศในการประกวด "Thailand Digital Map Innovation 2026" ด้วยผลงานระบบวิเคราะห์พื้นที่เสี่ยงภัยพิบัติแบบเรียลไทม์</p>
<p>ผลงานดังกล่าวได้รับการชื่นชมในด้านการนำเทคโนโลยี GIS และ AI มาประยุกต์ใช้เพื่อการแจ้งเตือนภัยล่วงหน้าได้อย่างแม่นยำ</p>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop',
            isPublished: true,
            publishedAt: new Date('2026-04-22'),
        },
        {
            title: 'สาขาวิชาคหกรรมศาสตร์ จัด Workshop "อาหารล้านนาฟิวชั่น" เพื่อยกระดับเศรษฐกิจชุมชน',
            slug: 'home-eco-lanna-fusion-workshop',
            category: 'EVENT' as const,
            content: `<h2>Workshop อาหารล้านนาฟิวชั่น</h2>
<p>สาขาวิชาคหกรรมศาสตร์จัดกิจกรรมอบรมเชิงปฏิบัติการให้แก่ผู้ประกอบการร้านอาหารและคนในชุมชนเชียงราย ในการสร้างสรรค์เมนูอาหารล้านนาฟิวชั่นที่ยังคงรสชาติดั้งเดิมแต่มีความทันสมัยและตอบโจทย์นักท่องเที่ยว</p>
<p>กิจกรรมนี้เป็นส่วนหนึ่งของโครงการบริการวิชาการเพื่อยกระดับรายได้ให้แก่ชุมชนอย่างยั่งยืน</p>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop',
            isPublished: true,
            publishedAt: new Date('2026-04-18'),
        },
        {
            title: 'ประกาศรับสมัครบุคลากร ตำแหน่งอาจารย์ สาขาวิชาจิตวิทยาสังคม 1 อัตรา',
            slug: 'job-vacancy-psychology-lecturer',
            category: 'JOB' as const,
            content: `<h2>รับสมัครอาจารย์ สาขาวิชาจิตวิทยาสังคม</h2>
<p>คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย มีความประสงค์รับสมัครบุคคลเพื่อสอบคัดเลือกเป็นพนักงานมหาวิทยาลัย ตำแหน่งอาจารย์ สังกัดสาขาวิชาจิตวิทยาสังคม จำนวน 1 อัตรา</p>
<p><strong>คุณสมบัติ:</strong> สำเร็จการศึกษาระดับปริญญาเอก ทางด้านจิตวิทยาสังคม หรือสาขาที่เกี่ยวข้อง</p>
<p>เปิดรับสมัครตั้งแต่วันนี้ - 15 พฤษภาคม 2569</p>`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2048&auto=format&fit=crop',
            isPublished: true,
            publishedAt: new Date('2026-04-10'),
        }
    ];

    // =============================================
    // 2. Staff Profiles (บุคลากรเพิ่มเติม)
    // =============================================
    const staffProfilesData = [
        {
            firstNameTh: 'อัญชลี',
            lastNameTh: 'วงศ์วิจิตร',
            prefixTh: 'ดร.',
            firstNameEn: 'Anchalee',
            lastNameEn: 'Wongvijit',
            prefixEn: 'Asst.Prof.Dr.',
            departmentId: 10, // GIS
            staffType: 'ACADEMIC' as const,
            academicPositionId: 3,
            education: [{ level: 'DOCTORAL' as const, detail: 'Ph.D. in Geoinformatics, Chulalongkorn University' }],
            expertise: ['GIS', 'Remote Sensing', 'Disaster Management'],
            contactEmail: 'anchalee@crru.ac.th',
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
            sortOrder: 2
        },
        {
            firstNameTh: 'ธีรพล',
            lastNameTh: 'สวัสดิผล',
            prefixTh: 'ดร.',
            firstNameEn: 'Teerapol',
            lastNameEn: 'Sawaddipol',
            prefixEn: 'Dr.',
            departmentId: 9, // Psych
            staffType: 'ACADEMIC' as const,
            academicPositionId: 4,
            education: [{ level: 'DOCTORAL' as const, detail: 'ปร.ด. (จิตวิทยาประยุกต์) มหาวิทยาลัยเกษตรศาสตร์' }],
            expertise: ['Social Psychology', 'Organizational Behavior'],
            contactEmail: 'teerapol@crru.ac.th',
            imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
            sortOrder: 3
        },
        {
            firstNameTh: 'ศิริพร',
            lastNameTh: 'แก้วมณี',
            prefixTh: '',
            firstNameEn: 'Siriporn',
            lastNameEn: 'Kaewmanee',
            prefixEn: 'Ajarn',
            departmentId: 8, // Home Eco
            staffType: 'ACADEMIC' as const,
            academicPositionId: 4,
            education: [{ level: 'MASTER' as const, detail: 'วท.ม. (คหกรรมศาสตร์) มหาวิทยาลัยเกษตรศาสตร์' }],
            expertise: ['Food Science', 'Lanna Cuisine'],
            contactEmail: 'siriporn@crru.ac.th',
            imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
            sortOrder: 4
        }
    ];

    // =============================================
    // 3. Research Projects (โครงการวิจัย)
    // =============================================
    const researchProjectsData = [
        {
            slug: 'gis-flood-warning-mae-sai',
            titleTh: 'การพัฒนาระบบเตือนภัยน้ำท่วมล่วงหน้าด้วยเทคโนโลยีภูมิสารสนเทศ บริเวณลุ่มน้ำแม่สาย จังหวัดเชียงราย',
            titleEn: 'Development of Early Flood Warning System using Geoinformatics in Mae Sai River Basin, Chiang Rai',
            abstractTh: 'โครงการนี้มุ่งเน้นการสร้างแบบจำลองคาดการณ์น้ำท่วมโดยใช้ข้อมูลดาวเทียมและสถานีวัดน้ำแบบเรียลไทม์ เพื่อส่งข้อมูลเตือนภัยให้แก่คนในชุมชนผ่านแอปพลิเคชันมือถือ',
            year: 2568,
            budget: '450000.00',
            fundingSource: 'งบประมาณแผ่นดิน (วช.)',
            status: 'ONGOING' as const,
            isSocialService: true,
            isPublished: true,
            sdgIds: [11, 13]
        },
        {
            slug: 'lanna-rice-nutrition-dev',
            titleTh: 'การวิเคราะห์คุณค่าทางโภชนาการและการพัฒนาผลิตภัณฑ์อาหารสุขภาพจากข้าวพื้นเมืองเชียงราย',
            titleEn: 'Nutritional Analysis and Health Food Product Development from Local Rice Varieties of Chiang Rai',
            abstractTh: 'ศึกษาวิจัยข้าวสายพันธุ์ท้องถิ่นในเชียงรายเพื่อหาคุณสมบัติทางเคมีและคุณค่าทางอาหาร พร้อมทั้งแปรรูปเป็นผลิตภัณฑ์พร้อมทานเพื่อสร้างมูลค่าเพิ่มให้เกษตรกร',
            year: 2567,
            budget: '320000.00',
            fundingSource: 'ทุนวิจัยคณะสังคมศาสตร์',
            status: 'COMPLETED' as const,
            isCommercial: true,
            isPublished: true,
            sdgIds: [2, 9]
        },
        {
            slug: 'social-impact-tourism-hilltribe',
            titleTh: 'ผลกระทบทางสังคมจากการท่องเที่ยวเชิงชาติพันธุ์ต่อวิถีชีวิตกลุ่มชาติพันธุ์บนดอยแม่สลอง',
            titleEn: 'Social Impacts of Ethnic Tourism on the Livelihoods of Ethnic Groups in Doi Mae Salong',
            abstractTh: 'งานวิจัยเชิงมานุษยวิทยาเพื่อศึกษาการเปลี่ยนแปลงทางสังคมและวัฒนธรรมของชาวอาข่าและลาหู่จากการขยายตัวของการท่องเที่ยวในพื้นที่สูง',
            year: 2568,
            budget: '180000.00',
            fundingSource: 'กองทุนส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สวพ.)',
            status: 'ONGOING' as const,
            isSocialService: true,
            isPublished: true,
            sdgIds: [8, 10]
        }
    ];

    try {
        // News
        console.log('\n📢 Seeding News...');
        for (const item of newsData) {
            const existing = await db.select().from(schema.news).where(eq(schema.news.slug, item.slug));
            if (existing.length === 0) {
                await db.insert(schema.news).values(item);
                console.log(`  ✅ Created News: ${item.title}`);
            } else {
                await db.update(schema.news).set(item).where(eq(schema.news.slug, item.slug));
                console.log(`  🔄 Updated News: ${item.title}`);
            }
        }

        // Staff
        console.log('\n👥 Seeding Staff...');
        for (const item of staffProfilesData) {
            const existing = await db.select().from(schema.staffProfiles).where(eq(schema.staffProfiles.firstNameTh, item.firstNameTh));
            if (existing.length === 0) {
                await db.insert(schema.staffProfiles).values(item);
                console.log(`  ✅ Created Staff: ${item.prefixTh}${item.firstNameTh}`);
            } else {
                await db.update(schema.staffProfiles).set(item).where(eq(schema.staffProfiles.firstNameTh, item.firstNameTh));
                console.log(`  🔄 Updated Staff: ${item.prefixTh}${item.firstNameTh}`);
            }
        }

        // Research
        console.log('\n🧪 Seeding Research Projects...');
        for (const item of researchProjectsData) {
            const { sdgIds, ...project } = item;
            const existing = await db.select().from(schema.researchProjects).where(eq(schema.researchProjects.slug, project.slug));
            
            let projectId;
            if (existing.length === 0) {
                const inserted = await db.insert(schema.researchProjects).values(project).returning({ id: schema.researchProjects.id });
                projectId = inserted[0].id;
                console.log(`  ✅ ${project.titleTh}`);
                
                // Add SDGs
                for (const sdgId of sdgIds) {
                    await db.insert(schema.projectSdgs).values({ projectId, sdgId });
                }

                // Add Mock Members (Randomly pick some staff)
                const allStaff = await db.select().from(schema.staffProfiles).limit(3);
                if (allStaff.length > 0) {
                    await db.insert(schema.projectMembers).values({
                        projectId,
                        staffProfileId: allStaff[0].id,
                        role: 'HEAD' as const,
                        sortOrder: 1
                    });
                }
            }
        }

        console.log('\n🏁 Faculty content seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await pool.end();
    }
}

main();
