import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "home-eco-applied",
    title: "วิชาเอกคหกรรมศาสตร์ประยุกต์",
    degree: "ศิลปศาสตรบัณฑิต (คหกรรมศาสตร์) - วิชาเอกคหกรรมศาสตร์ประยุกต์",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=2070&auto=format&fit=crop",
    level: "ปริญญาตรี (Bachelor's Degree)",
    description: "เน้นการพัฒนาทักษะงานฝีมือเชิงสร้างสรรค์ ผสมผสานภูมิปัญญาล้านนากับการออกแบบสมัยใหม่ ครอบคลุมงานผ้า งานดอกไม้ งานประดิษฐ์ และการแกะสลัก เพื่อสร้างสรรค์ผลิตภัณฑ์ที่มีเอกลักษณ์และมูลค่าสูง รองรับอุตสาหกรรมไมซ์ (MICE) และงานไลฟ์สไตล์",
    highlights: [
        {
            title: "Creative Crafts",
            description: "เชี่ยวชาญงานฝีมือประณีตศิลป์ งานใบตอง ดอกไม้สดและแห้ง"
        },
        {
            title: "Fashion & Textile",
            description: "ออกแบบและตัดเย็บเสื้อผ้า แฟชั่นสิ่งทอร่วมสมัย"
        },
        {
            title: "Fruit Carving",
            description: "ศิลปะการแกะสลักผักและผลไม้ขั้นสูงเพื่อการตกแต่ง"
        },
        {
            title: "Lifestyle Business",
            description: "ต่อยอดทักษะสู่ธุรกิจไลฟ์สไตล์และของที่ระลึก"
        }
    ],
    careers: [
        "นักออกแบบงานฝีมือ / สินค้าไลฟ์สไตล์",
        "ช่างจัดดอกไม้มืออาชีพ (Florist)",
        "ดีไซเนอร์เสื้อผ้า / ช่างตัดเย็บ",
        "ผู้เชี่ยวชาญด้านงานแกะสลัก",
        "ครูสอนวิชาคหกรรมศาสตร์ / งานฝีมือ"
    ],
    structure: {
        totalCredits: 132,
        general: 30,
        major: 96,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function AppliedHomeEcoPage() {
    return <ProgramTemplate data={programData} />;
}
