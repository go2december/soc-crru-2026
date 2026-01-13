import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "home-eco-culinary",
    title: "วิชาเอกการประกอบอาหารและบริการ",
    degree: "ศิลปศาสตรบัณฑิต (คหกรรมศาสตร์) - วิชาเอกการประกอบอาหารและบริการ",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop",
    level: "ปริญญาตรี (Bachelor's Degree)",
    description: "มุ่งเน้นความเป็นเลิศด้านอาหารและการบริการระดับมืออาชีพ ทั้งอาหารไทย อาหารนานาชาติ และเบเกอรี่ ควบคู่กับศิลปะการจัดตกแต่งและการบริการอาหารและเครื่องดื่ม ผู้เรียนจะได้รับการฝึกฝนทักษะปฏิบัติอย่างเข้มข้น เตรียมพร้อมสู่การเป็นเชฟมืออาชีพและผู้ประกอบการธุรกิจอาหารชั้นนำ",
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
