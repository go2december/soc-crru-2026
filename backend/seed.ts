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
    console.log('🌱 Seeding data...');

    // Programs Data
    const programsData = [
        {
            code: 'social-sci',
            nameTh: 'สาขาวิชาสังคมศาสตร์',
            degreeTitleTh: 'ศิลปศาสตรบัณฑิต (สังคมศาสตร์)',
            degreeTitleEn: 'Bachelor of Arts (Social Sciences)',
            degreeLevel: 'BACHELOR' as const,
            description: 'มุ่งเน้นการสร้างบัณฑิตที่มีความรู้ความเข้าใจในปรากฏการณ์ทางสังคมที่ซับซ้อน โดยแบ่งการศึกษาออกเป็น 2 แขนงวิชา เพื่อให้ผู้เรียนได้เชี่ยวชาญในด้านที่ตนเองสนใจ',
            bannerUrl: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2070&auto=format&fit=crop',
            structure: { totalCredits: 130, general: 30, major: 94, freeElective: 6 },
            careers: ['นักวิจัยทางสังคม', 'เจ้าหน้าที่วิเคราะห์นโยบายและแผน', 'นักพัฒนาสังคม', 'ข้าราชการ/พนักงานรัฐวิสาหกิจ'],
            highlights: [
                { title: 'บูรณาการศาสตร์', description: 'ผสมผสานความรู้ทางรัฐศาสตร์ สังคมวิทยา และมานุษยวิทยา' },
                { title: 'ลงพื้นที่จริง', description: 'เน้นการเรียนรู้ผ่านการลงพื้นที่ชุมชนเพื่อเข้าใจปัญหาสังคม' }
            ],
            concentrations: [
                { title: 'แขนงวิชาสังคมวิทยาและมานุษยวิทยา (Sociology and Anthropology)', description: 'เน้นการปั้นบัณฑิตให้เป็นผู้นำการเปลี่ยนแปลงสังคม (Change Agents) ที่เข้าใจชุมชนอย่างลึกซึ้งผ่านทักษะการวิจัยภาคสนามและนวัตกรรมดิจิทัล' },
                { title: 'แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม (Cultural Resource Management)', description: 'เน้นการจัดการมรดกและทุนวัฒนธรรมด้วยมุมมองสร้างสรรค์และการบูรณาการเทคโนโลยีเพื่อสร้างอาชีพ' }
            ]
        },
        {
            code: 'social-dev',
            nameTh: 'สาขาวิชานวัตกรรมการพัฒนาสังคม',
            degreeTitleTh: 'ศิลปศาสตรบัณฑิต (นวัตกรรมการพัฒนาสังคม)',
            degreeTitleEn: 'Bachelor of Arts (Social Development Innovation)',
            degreeLevel: 'BACHELOR' as const,
            description: 'สร้างนักพัฒนารุ่นใหม่ที่มีทักษะในการสร้างสรรค์นวัตกรรมทางสังคมเพื่อการพัฒนาที่ยั่งยืน',
            bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
            structure: { totalCredits: 128, general: 30, major: 92, freeElective: 6 },
            careers: ['นักนวัตกรรมสังคม', 'ผู้ประกอบการเพื่อสังคม (SE)', 'CSR องค์กรเอกชน', 'นักพัฒนาชุมชน'],
            highlights: [
                { title: 'Social Lab', description: 'ห้องปฏิบัติการทางสังคมเพื่อทดลองแก้ปัญหาจริง' },
                { title: 'Project-Based', description: 'เรียนรู้ผ่านการทำโครงงานนวัตกรรม' }
            ],
            concentrations: []
        },
        {
            code: 'home-eco',
            nameTh: 'สาขาวิชาคหกรรมศาสตร์',
            degreeTitleTh: 'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)',
            degreeTitleEn: 'Bachelor of Science (Home Economics)',
            degreeLevel: 'BACHELOR' as const,
            description: 'พัฒนาทักษะวิชาชีพคหกรรมศาสตร์สู่ความเป็นเลิศ โดยแบ่งเป็น 2 วิชาเอกที่เน้นศักยภาพเฉพาะด้าน ทั้งด้านอาหารและการบริการระดับมาตรฐานสากล และด้านคหกรรมศาสตร์ประยุกต์',
            bannerUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80',
            structure: { totalCredits: 132, general: 30, major: 96, freeElective: 6 },
            careers: ['นักโภชนาการ', 'เชฟ/ผู้ประกอบการร้านอาหาร', 'นักออกแบบแฟชั่น/งานฝีมือ', 'ครูคหกรรม'],
            highlights: [],
            concentrations: [
                { title: 'วิชาเอกการประกอบอาหารและบริการ (Culinary and Service)', description: 'เน้นทักษะด้านอาหารไทยและนานาชาติ การบริการ และการจัดเลี้ยง โดยผู้จบหลักสูตรจะสอบมาตรฐานอาหารไทยระดับหนึ่ง' },
                { title: 'วิชาเอกคหกรรมศาสตร์ประยุกต์ (Applied Home Economics)', description: 'เน้นงานคหกรรมศาสตร์รอบด้าน เช่น การจัดดอกไม้ ออกแบบแฟชั่น ตัดเย็บ และการแกะสลักผักผลไม้' }
            ]
        },
        {
            code: 'social-psych',
            nameTh: 'สาขาวิชาจิตวิทยาสังคม',
            degreeTitleTh: 'วิทยาศาสตรบัณฑิต (จิตวิทยาสังคม)',
            degreeTitleEn: 'Bachelor of Science (Social Psychology)',
            degreeLevel: 'BACHELOR' as const,
            description: 'ศึกษาพฤติกรรมและจิตใจมนุษย์ด้วยวิธีการทางวิทยาศาสตร์ ครอบคลุมทั้งจิตวิทยาอุตสาหกรรม การให้คำปรึกษา และจิตวิทยาชุมชน มุ่งเน้นการประยุกต์ทฤษฎีเพื่อเข้าใจและแก้ไขปัญหาในระดับบุคคลและสังคม',
            bannerUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
            structure: { totalCredits: 126, general: 30, major: 90, freeElective: 6 },
            careers: ['นักจิตวิทยาองค์กร / HR', 'นักวิชาการศึกษา / แนะแนว', 'นักจิตวิทยาพัฒนาการ', 'นักการตลาด / วิจัยพฤติกรรมผู้บริโภค', 'Life Coach'],
            highlights: [
                { title: 'เข้าใจคน เข้าใจโลก', description: 'เรียนรู้พฤติกรรมมนุษย์ พลวัตกลุ่ม และจิตวิทยาท่ามกลางความหลากหลายวัฒนธรรม' },
                { title: 'ทักษะการให้คำปรึกษา', description: 'ฝึกปฏิบัติการให้คำปรึกษาเบื้องต้น (Counseling) และการรับฟังอย่างลึกซึ้ง' },
                { title: 'HR & Organization Development', description: 'ประยุกต์จิตวิทยาในการคัดเลือก พัฒนา และสร้างแรงจูงใจให้บุคลากร' },
                { title: 'Data-Driven Insight', description: 'ใช้สถิติและการวิจัยทางจิตวิทยาเพื่อวิเคราะห์เทรนด์และพฤติกรรมผู้บริโภค' }
            ],
            concentrations: []
        },
        {
            code: 'gis',
            nameTh: 'สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ',
            degreeTitleTh: 'วิทยาศาสตรบัณฑิต (ภูมิศาสตร์และภูมิสารสนเทศ)',
            degreeTitleEn: 'Bachelor of Science (Geography and Geoinformatics)',
            degreeLevel: 'BACHELOR' as const,
            description: 'บูรณาการทฤษฎีภูมิศาสตร์กับเทคโนโลยีสมัยใหม่ เช่น GIS, Remote Sensing และเทคโนโลยีอากาศยานไร้คนขับ (UAV) เพื่อวิเคราะห์และแก้ไขปัญหาเชิงพื้นที่อย่างเป็นระบบ',
            bannerUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1931&auto=format&fit=crop',
            structure: { totalCredits: 135, general: 30, major: 99, freeElective: 6 },
            careers: ['นักภูมิสารสนเทศ (GIS Specialist)', 'นักสำรวจ / นักแผนที่ (Surveyor)', 'นักวิเคราะห์ข้อมูลดาวเทียม', 'เจ้าหน้าที่วางผังเมือง', 'นักพัฒนาซอฟต์แวร์แผนที่'],
            highlights: [
                { title: 'High-Tech Tools', description: 'เรียนรู้การใช้งานโดรนสำรวจ (UAV), เลเซอร์สแกน (LiDAR) และซอฟต์แวร์ลิขสิทธิ์ ArcGIS Pro' },
                { title: 'Smart City & Planning', description: 'ประยุกต์เทคโนโลยีเพื่อการวางผังเมืองอัจฉริยะและการจัดการจราจร' },
                { title: 'Disaster Management', description: 'วิเคราะห์พื้นที่เสี่ยงภัยพิบัติ น้ำท่วม ดินถล่ม เพื่อการเตือนภัยล่วงหน้า' },
                { title: 'Professional Certification', description: 'เตรียมความพร้อมสู่การสอบใบคุณวุฒิวิชาชีพนักภูมิสารสนเทศ' }
            ],
            concentrations: []
        },
        {
            code: 'regional-dev-ma',
            nameTh: 'สาขาวิชายุทธศาสตร์การพัฒนาภูมิภาค',
            degreeTitleTh: 'ศิลปศาสตรมหาบัณฑิต (ยุทธศาสตร์การพัฒนาภูมิภาค)',
            degreeTitleEn: 'Master of Arts (Regional Development Strategy)',
            degreeLevel: 'MASTER' as const,
            description: 'มุ่งเน้นการสร้างองค์ความรู้และนวัตกรรมเพื่อการพัฒนาภูมิภาคอย่างยั่งยืน',
            bannerUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
            structure: { totalCredits: 36, general: 0, major: 36, freeElective: 0 },
            careers: ['นักวิชาการ', 'นักวางแผนกลยุทธ์', 'ผู้บริหารท้องถิ่น'],
            highlights: [],
            concentrations: []
        },
        {
            code: 'regional-dev-phd',
            nameTh: 'สาขาวิชายุทธศาสตร์การพัฒนาภูมิภาค',
            degreeTitleTh: 'ปรัชญาดุษฎีบัณฑิต (ยุทธศาสตร์การพัฒนาภูมิภาค)',
            degreeTitleEn: 'Doctor of Philosophy (Regional Development Strategy)',
            degreeLevel: 'PHD' as const,
            description: 'สร้างนักวิจัยและนักวิชาการระดับสูงที่มีความเชี่ยวชาญด้านการพัฒนาภูมิภาค',
            bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
            structure: { totalCredits: 48, general: 0, major: 48, freeElective: 0 },
            careers: ['อาจารย์มหาวิทยาลัย', 'นักวิจัยระดับสูง', 'ที่ปรึกษาองค์กร'],
            highlights: [],
            concentrations: []
        },
    ];

    try {
        for (const program of programsData) {
            // Check if exists
            const existingProgram = await db
                .select()
                .from(schema.programs)
                .where(eq(schema.programs.code, program.code));

            if (existingProgram.length === 0) {
                await db.insert(schema.programs).values(program);
                console.log(`✅ Created program: ${program.code}`);
            } else {
                await db.update(schema.programs).set(program).where(eq(schema.programs.code, program.code));
                console.log(`🔄 Updated program: ${program.code}`);
            }
        }

        // Departments Data
        console.log('🌱 Seeding departments...');
        const departmentsData = [
            { nameTh: 'ผู้บริหาร', nameEn: 'Executives', isAcademicUnit: false },
            { nameTh: 'สำนักงานคณะ', nameEn: 'Faculty Office', isAcademicUnit: false },
            { nameTh: 'สาขาวิชาสังคมศาสตร์', nameEn: 'Department of Social Sciences', isAcademicUnit: true },
            { nameTh: 'สาขาวิชานวัตกรรมการพัฒนาสังคม', nameEn: 'Department of Social Development Innovation', isAcademicUnit: true },
            { nameTh: 'สาขาวิชาคหกรรมศาสตร์', nameEn: 'Department of Home Economics', isAcademicUnit: true },
            { nameTh: 'สาขาวิชาจิตวิทยาสังคม', nameEn: 'Department of Social Psychology', isAcademicUnit: true },
            { nameTh: 'สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ', nameEn: 'Department of Geography and Geoinformatics', isAcademicUnit: true },
            { nameTh: 'สาขาวิชายุทธศาสตร์การพัฒนาภูมิภาค', nameEn: 'Department of Regional Development Strategy', isAcademicUnit: true },
        ];

        for (const dept of departmentsData) {
            const existingDept = await db
                .select()
                .from(schema.departments)
                .where(eq(schema.departments.nameTh, dept.nameTh));
            if (existingDept.length === 0) {
                await db.insert(schema.departments).values(dept);
                console.log(`✅ Created department: ${dept.nameTh}`);
            }
        }

        // Sample Staff Data
        console.log('🌱 Seeding staff profiles...');
        const deptSocSciResult = await db
            .select()
            .from(schema.departments)
            .where(eq(schema.departments.nameTh, 'สาขาวิชาสังคมศาสตร์'));
        const deptSocSci = deptSocSciResult[0];

        const deptExecResult = await db
            .select()
            .from(schema.departments)
            .where(eq(schema.departments.nameTh, 'ผู้บริหาร'));
        const deptExec = deptExecResult[0];

        if (deptExec) {
            // Sample Executive Staff
            const execStaff = {
                departmentId: deptExec.id,
                prefixTh: 'ดร.',
                firstNameTh: 'สมชาย',
                lastNameTh: 'ใจดี',
                prefixEn: 'Dr.',
                firstNameEn: 'Somchai',
                lastNameEn: 'Jaidee',
                staffType: 'ACADEMIC' as const,
                academicPosition: 'ASSISTANT_PROF' as const,
                adminPosition: 'คณบดีคณะสังคมศาสตร์',
                education: [
                    { level: 'BACHELOR' as const, detail: 'ศศ.บ. (สังคมศึกษา) มหาวิทยาลัยเชียงใหม่' },
                    { level: 'MASTER' as const, detail: 'ศศ.ม. (สังคมวิทยา) มหาวิทยาลัยเชียงใหม่' },
                    { level: 'DOCTORAL' as const, detail: 'ปร.ด. (สังคมศาสตร์) มหาวิทยาลัยเชียงใหม่' }
                ],
                contactEmail: 'somchai@crru.ac.th',
                sortOrder: 1,
            };

            const existingExec = await db
                .select()
                .from(schema.staffProfiles)
                .where(eq(schema.staffProfiles.firstNameTh, execStaff.firstNameTh));

            if (existingExec.length === 0) {
                await db.insert(schema.staffProfiles).values(execStaff);
                console.log(`✅ Created staff: ${execStaff.prefixTh}${execStaff.firstNameTh}`);
            }
        }

        if (deptSocSci) {
            // Sample Academic Staff
            const academicStaff = {
                departmentId: deptSocSci.id,
                prefixTh: '',
                firstNameTh: 'ใจรัก',
                lastNameTh: 'พัฒนา',
                staffType: 'ACADEMIC' as const,
                academicPosition: 'LECTURER' as const,
                education: [
                    { level: 'BACHELOR' as const, detail: 'ศศ.บ. (สังคมวิทยา) มหาวิทยาลัยธรรมศาสตร์' },
                    { level: 'MASTER' as const, detail: 'ศศ.ม. (สังคมวิทยา) มหาวิทยาลัยธรรมศาสตร์' }
                ],
                contactEmail: 'jairak@crru.ac.th',
                sortOrder: 10,
            };

            const existingAcad = await db
                .select()
                .from(schema.staffProfiles)
                .where(eq(schema.staffProfiles.firstNameTh, academicStaff.firstNameTh));

            if (existingAcad.length === 0) {
                await db.insert(schema.staffProfiles).values(academicStaff);
                console.log(`✅ Created staff: ${academicStaff.firstNameTh}`);
            }
        }

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await pool.end();
        console.log('🏁 Seeding completed.');
    }
}

main();
