import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "regional-dev-ma",
    title: "สาขาวิชายุทธศาสตร์การพัฒนาภูมิภาค (ปริญญาโท)",
    degree: "ศิลปศาสตรมหาบัณฑิต (ยุทธศาสตร์การพัฒนาภูมิภาค) - M.A. (Regional Development Strategies)",
    level: "ปริญญาโท (Master's Degree)",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    description: "หลักสูตรมหาบัณฑิตที่เข้มข้นด้วยการวิเคราะห์เชิงยุทธศาสตร์และการวางแผนพัฒนา มุ่งสร้างนักบริหารและนักวิชาการที่มีวิสัยทัศน์กว้างไกล สามารถบูรณาการองค์ความรู้สหวิทยาการเพื่อขับเคลื่อนการพัฒนาท้องถิ่นและภูมิภาคให้เข้มแข็ง ภายใต้บริบทการเปลี่ยนแปลงของโลกในศตวรรษที่ 21 เน้นการเรียนรู้แบบ Project-based Learning ที่ตอบโจทย์พื้นที่จริง",
    highlights: [
        {
            title: "นักยุทธศาสตร์ (Strategist)",
            description: "วิเคราะห์นโยบายและวางแผนยุทธศาสตร์การพัฒนาได้อย่างมืออาชีพ"
        },
        {
            title: "นวัตกรสังคม (Social Innovator)",
            description: "สร้างสรรค์นวัตกรรมเพื่อแก้ไขโจทย์ท้าทายในระดับภูมิภาค"
        },
        {
            title: "เครือข่ายระดับชาติ",
            description: "เชื่อมโยงกับองค์กรภาครัฐและเอกชนเพื่อการขับเคลื่อนนโยบายจริง"
        },
        {
            title: "Research Based",
            description: "เน้นการวิจัยปฏิบัติการเพื่อสร้างองค์ความรู้ใหม่"
        }
    ],
    careers: [
        "นักวิเคราะห์นโยบายและแผน",
        "ที่ปรึกษาด้านการพัฒนาองค์กร",
        "ผู้บริหารในองค์กรภาครัฐและเอกชน",
        "นักวิจัย / นักวิชาการอิสระ",
        "ผู้นำทางสังคม / การเมืองท้องถิ่น"
    ],
    structure: {
        totalCredits: 36,
        general: 0,
        major: 36,
        freeElective: 0
    },
    downloadLink: "#"
};

export default function RegionalDevMAPage() {
    return <ProgramTemplate data={programData} />;
}
