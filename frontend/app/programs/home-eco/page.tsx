import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "home-eco",
    title: "สาขาวิชาคหกรรมศาสตร์",
    degree: "ศิลปศาสตรบัณฑิต (คหกรรมศาสตร์) - B.A. (Home Economics)",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop",
    description: "พัฒนาทักษะวิชาชีพคหกรรมศาสตร์สู่ความเป็นเลิศ โดยแบ่งเป็น 2 วิชาเอกที่เน้นศักยภาพเฉพาะด้าน ทั้งด้านอาหารและการบริการระดับมาตรฐานสากล และด้านคหกรรมศาสตร์ประยุกต์ที่ครอบคลุมงานฝีมือและการออกแบบ",
    concentrations: [
        {
            title: "วิชาเอกการประกอบอาหารและบริการ (Culinary and Service)",
            description: "เน้นทักษะด้านอาหารไทยและนานาชาติ การบริการ และการจัดเลี้ยง โดยผู้จบหลักสูตรจะสอบมาตรฐานอาหารไทยระดับหนึ่ง"
        },
        {
            title: "วิชาเอกคหกรรมศาสตร์ประยุกต์ (Applied Home Economics)",
            description: "เน้นงานคหกรรมศาสตร์รอบด้าน เช่น การจัดดอกไม้ ออกแบบแฟชั่น ตัดเย็บ และการแกะสลักผักผลไม้"
        }
    ],
    highlights: [
        {
            title: "Culinary Professional",
            description: "ฝึกฝนทักษะการประกอบอาหารทั้งไทยและสากล พร้อมสอบมาตรฐานฝีมือแรงงาน"
        },
        {
            title: "Creative Arts",
            description: "สร้างสรรค์งานศิลปะประดิษฐ์ งานดอกไม้ และแฟชั่นดีไซน์"
        },
        {
            title: "Service Excellence",
            description: "เรียนรู้Service Mind และการจัดการธุรกิจบริการแบบมืออาชีพ"
        },
        {
            title: "Practical Skills",
            description: "เน้นการลงมือปฏิบัติจริงในห้องปฏิบัติการที่ทันสมัย"
        }
    ],
    careers: [
        "เชฟ / นักพัฒนาผลิตภัณฑ์อาหาร (Food Stylist / R&D)",
        "นักโภชนาการ / นักกำหนดอาหาร",
        "ดีไซเนอร์เสื้อผ้าและสิ่งทอ",
        "เจ้าของธุรกิจร้านอาหาร / เบเกอรี่ / Catering",
        "ครูสอนวิชาคหกรรมศาสตร์",
        "ผู้จัดการแผนกแม่บ้านโรงแรม/โรงพยาบาล"
    ],
    structure: {
        totalCredits: 132,
        general: 30,
        major: 96,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function HomeEcoPage() {
    return <ProgramTemplate data={programData} />;
}
