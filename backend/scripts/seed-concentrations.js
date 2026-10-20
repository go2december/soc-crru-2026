const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://soc_admin:Soc0903297444@localhost:5432/soc_db' });

async function updateData() {
  await client.connect();

  const socialSciConcentrations = [
    {
      code: 'sociology-anthropology',
      title: 'แขนงวิชาสังคมวิทยาและมานุษยวิทยา (Sociology and Anthropology)',
      titleEn: 'Sociology and Anthropology',
      degreeTitle: 'ศิลปศาสตรบัณฑิต (สังคมศาสตร์)',
      description: 'เน้นการปั้นบัณฑิตให้เป็นผู้นำการเปลี่ยนแปลงสังคม (Change Agents) ที่เข้าใจชุมชนอย่างลึกซึ้งผ่านทักษะการวิจัยภาคสนามและนวัตกรรมดิจิทัล เพื่อการพัฒนาสังคมและยกระดับคุณภาพชีวิตอย่างยั่งยืน',
      bannerUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
      highlights: [
        { title: 'การวิจัยภาคสนามเชิงลึก', description: 'ฝึกปฏิบัติการวิจัยและเก็บข้อมูลในพื้นที่จริงกับชุมชนและกลุ่มชาติพันธุ์ในอนุภูมิภาคลุ่มน้ำโขง' },
        { title: 'Digital Social Innovation', description: 'ประยุกต์ใช้เทคโนโลยีดิจิทัลและการวิเคราะห์ข้อมูลทางสังคมเพื่อออกแบบนโยบายและแก้ปัญหาสังคมร่วมสมัย' },
        { title: 'เครือข่ายความร่วมมือระดับสากล', description: 'แลกเปลี่ยนทางวิชาการและศึกษาดูงานกับสถาบันวิจัยและองค์กรพัฒนาเอกชนชั้นนำ' }
      ],
      careers: [
        'นักวิจัยทางสังคมและมานุษยวิทยา',
        'นักพัฒนาสังคมและชุมชน (ภาครัฐ / NGOs)',
        'เจ้าหน้าที่วิเคราะห์นโยบายและแผน',
        'ผู้ประสานงานโครงการระหว่างประเทศ',
        'ที่ปรึกษาด้านการประเมินผลกระทบทางสังคม (SIA)'
      ],
      structure: { general: 30, major: 94, freeElective: 6, totalCredits: 130 }
    },
    {
      code: 'cultural-resource-management',
      title: 'แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม (Cultural Resource Management)',
      titleEn: 'Cultural Resource Management',
      degreeTitle: 'ศิลปศาสตรบัณฑิต (สังคมศาสตร์)',
      description: 'เน้นการจัดการมรดกและทุนวัฒนธรรมด้วยมุมมองสร้างสรรค์และการบูรณาการเทคโนโลยีเพื่อสร้างอาชีพ การท่องเที่ยวเชิงวัฒนธรรมอย่างยั่งยืน และการต่อยอดเศรษฐกิจสร้างสรรค์ (Creative Economy)',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop',
      highlights: [
        { title: 'การบริหารจัดการมรดกทางวัฒนธรรม', description: 'เรียนรู้การอนุรักษ์ ฟื้นฟู และยกระดับคุณค่าทางวัฒนธรรมท้องถิ่นสู่ระดับสากล' },
        { title: 'เศรษฐกิจสร้างสรรค์และการท่องเที่ยว', description: 'พัฒนาผลิตภัณฑ์ทางวัฒนธรรมและการจัดการการท่องเที่ยวเชิงสร้างสรรค์อย่างยั่งยืน' },
        { title: 'Digital Cultural Heritage', description: 'การจัดเก็บและนำเสนอข้อมูลมรดกทางวัฒนธรรมด้วยเทคโนโลยีสารสนเทศและสื่อดิจิทัล' }
      ],
      careers: [
        'นักจัดการวัฒนธรรมและพิพิธภัณฑ์',
        'นักวิชาการวัฒนธรรม / เจ้าหน้าที่กระทรวงวัฒนธรรม',
        'ผู้ประกอบการธุรกิจสร้างสรรค์และสินค้าวัฒนธรรม',
        'นักวางแผนการท่องเที่ยวเชิงวัฒนธรรม',
        'ภัณฑารักษ์และผู้ประสานงานหอศิลป์/แหล่งเรียนรู้'
      ],
      structure: { general: 30, major: 94, freeElective: 6, totalCredits: 130 }
    }
  ];

  const homeEcoConcentrations = [
    {
      code: 'culinary-and-service',
      title: 'วิชาเอกการประกอบอาหารและบริการ (Culinary and Service)',
      titleEn: 'Culinary and Service',
      degreeTitle: 'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)',
      description: 'เน้นทักษะด้านอาหารไทยและนานาชาติ มาตรฐานสุขาภิบาลอาหาร การบริการ และการจัดเลี้ยงแบบมืออาชีพ โดยผู้จบหลักสูตรจะสอบมาตรฐานคุณวุฒิวิชาชีพอาหารไทยระดับสากล พร้อมก้าวสู่ธุรกิจอาหารและโรงแรมระดับพรีเมียม',
      bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop',
      highlights: [
        { title: 'มาตรฐานฝีมือแรงงานอาหารไทยระดับสากล', description: 'ฝึกปฏิบัติในครัวมาตรฐานโรงแรม พร้อมสอบเทียบมาตรฐานวิชาชีพอาหารไทย' },
        { title: 'ศิลปะการบริการและการจัดเลี้ยงครบวงจร', description: 'เชี่ยวชาญการบริหารจัดการภัตตาคาร การจัดเลี้ยงนอกสถานที่ และงานบริการระดับมืออาชีพ' },
        { title: 'ศาสตร์อาหารเชิงสร้างสรรค์และโภชนาการ', description: 'ออกแบบเมนูสุขภาพ อาหารเฉพาะกลุ่ม และการคำนวณต้นทุนการผลิตเชิงธุรกิจ' }
      ],
      careers: [
        'เชฟและผู้เชี่ยวชาญด้านอาหาร (Chef & Culinary Specialist)',
        'ผู้ประกอบการธุรกิจอาหารและเครื่องดื่ม (F&B Entrepreneur)',
        'ผู้จัดการฝ่ายบริการอาหารและเครื่องดื่มในโรงแรม',
        'นักพัฒนาตำรับอาหารและที่ปรึกษาด้านเมนู (Food Stylist & Consultant)',
        'ผู้ตรวจประเมินมาตรฐานสุขาภิบาลอาหาร'
      ],
      structure: { general: 30, major: 96, freeElective: 6, totalCredits: 132 }
    },
    {
      code: 'applied-home-economics',
      title: 'วิชาเอกคหกรรมศาสตร์ประยุกต์ (Applied Home Economics)',
      titleEn: 'Applied Home Economics',
      degreeTitle: 'วิทยาศาสตรบัณฑิต (คหกรรมศาสตร์)',
      description: 'เน้นงานคหกรรมศาสตร์รอบด้าน ทั้งการออกแบบแฟชั่นและสิ่งทอ การจัดดอกไม้และการตกแต่งสถานที่ งานประดิษฐ์สร้างสรรค์ และการแกะสลักผักผลไม้ชั้นสูง เพื่อยกระดับสู่ผลิตภัณฑ์เชิงพาณิชย์และธุรกิจไลฟ์สไตล์ร่วมสมัย',
      bannerUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2070&auto=format&fit=crop',
      highlights: [
        { title: 'หัตถศิลป์สร้างสรรค์และงานประดิษฐ์ร่วมสมัย', description: 'ผสมผสานภูมิปัญญาล้านนากับเทคนิคสมัยใหม่เพื่อสร้างสรรค์งานตกแต่งระดับพรีเมียม' },
        { title: 'การออกแบบสิ่งทอ แฟชั่น และการตัดเย็บ', description: 'เชี่ยวชาญการแพตเทิร์น การออกแบบแฟชั่นสิ่งทอ และการตัดเย็บประณีต' },
        { title: 'ศิลปะการจัดดอกไม้และการตกแต่งสถานที่', description: 'ออกแบบงานตกแต่งสำหรับงานพิธีการ อีเวนต์ และโรงแรมชั้นนำ' }
      ],
      careers: [
        'นักออกแบบและผู้ประกอบการสินค้าไลฟ์สไตล์/งานฝีมือ',
        'นักออกแบบแฟชั่นและสิ่งทอ (Fashion & Textile Designer)',
        'นักจัดดอกไม้และผู้เชี่ยวชาญการตกแต่งสถานที่ (Floral & Event Stylist)',
        'ครู/อาจารย์ผู้สอนวิชาการงานอาชีพและคหกรรมศาสตร์',
        'ที่ปรึกษาด้านการพัฒนาผลิตภัณฑ์ชุมชนและโอทอป (OTOP)'
      ],
      structure: { general: 30, major: 96, freeElective: 6, totalCredits: 132 }
    }
  ];

  await client.query('UPDATE programs SET concentrations = $1 WHERE code = $2', [JSON.stringify(socialSciConcentrations), 'social-sci']);
  await client.query('UPDATE programs SET concentrations = $1 WHERE code = $2', [JSON.stringify(homeEcoConcentrations), 'home-eco']);

  console.log('Concentrations updated successfully in database!');
  await client.end();
}

updateData().catch(e => {
  console.error(e);
  process.exit(1);
});
