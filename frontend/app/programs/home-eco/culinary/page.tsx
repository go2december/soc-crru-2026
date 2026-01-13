import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "home-eco-culinary",
    title: "วิชาเอกการประกอบอาหารและบริการ",
    degree: "ศิลปศาสตรบัณฑิต (คหกรรมศาสตร์) - วิชาเอกการประกอบอาหารและบริการ",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop",
    level: "ปริญญาตรี (Bachelor's Degree)",
    description: "พัฒนาสู่การเป็น 'เชฟมืออาชีพ' และผู้ประกอบการธุรกิจอาหารที่ครบเครื่อง ด้วยหลักสูตรที่เน้นการปฏิบัติจริงทั้งอาหารไทย อาหารตะวันตก และเบเกอรี่ โดยผสมผสานศาสตร์การประกอบอาหารเข้ากับศิลปะและการจัดการธุรกิจสมัยใหม่ เพื่อให้ผู้เรียนมีความพร้อมทั้งทักษะฝีมือและความคิดสร้างสรรค์ในการรังสรรค์เมนูอาหารระดับสากล",
    highlights: [
        {
            title: "Professional Chef",
            description: "ฝึกทักษะการทำอาหารครบวงจร ไทย-ตะวันตก-เบเกอรี่"
        },
        {
            title: "Standard Certified",
            description: "หลักสูตรรองรับการสอบมาตรฐานฝีมือแรงงานสาขาอาหารไทย ระดับ 1"
        },
        {
            title: "Catering Management",
            description: "เรียนรู้การบริหารจัดการธุรกิจจัดเลี้ยง (Catering) แบบครบวงจร"
        },
        {
            title: "Food Stylist",
            description: "เสริมทักษะศิลปะการจัดจานเพื่อเพิ่มมูลค่าให้กับอาหาร"
        }
    ],
    careers: [
        "เชฟ / กุ๊ก (Chef / Cook) ในโรงแรมและภัตตาคาร",
        "Food Stylist / นักออกแบบอาหาร",
        "ผู้จัดการร้านอาหาร / ธุรกิจจัดเลี้ยง",
        "ผู้สอนการประกอบอาหาร",
        "เจ้าของธุรกิจร้านอาหาร / คาเฟ่"
    ],
    structure: {
        totalCredits: 132,
        general: 30,
        major: 96,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function CulinaryPage() {
    return <ProgramTemplate data={programData} />;
}
