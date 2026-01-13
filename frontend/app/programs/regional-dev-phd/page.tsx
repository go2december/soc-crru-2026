import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "regional-dev-phd",
    title: "สาขาวิชายุทธศาสตร์การพัฒนาภูมิภาค (ปริญญาเอก)",
    degree: "ปรัชญาดุษฎีบัณฑิต (ยุทธศาสตร์การพัฒนาภูมิภาค) - Ph.D. (Regional Development Strategies)",
    level: "ปริญญาเอก (Doctoral Degree)",
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop",
    description: "หลักสูตรดุษฎีบัณฑิตที่มุ่งเน้นการสร้างสรรค์องค์ความรู้ใหม่ผ่านการวิจัยขั้นสูง (Advanced Research) เพื่อตอบโจทย์ความท้าทายในการพัฒนาภูมิภาคระดับสากล เตรียมความพร้อมสู่การเป็นผู้นำทางความคิด นักวิชาการระดับเชี่ยวชาญ และนักกำหนดนโยบายที่สามารถชี้นำทิศทางการพัฒนาประเทศได้อย่างยั่งยืน",
    highlights: [
        {
            title: "Advanced Strategic Research",
            description: "วิจัยขั้นสูงเพื่อสร้างองค์ความรู้ใหม่ระดับสากล"
        },
        {
            title: "Global Vision",
            description: "วิเคราะห์แนวโน้มโลกเพื่อกำหนดทิศทางการพัฒนาท้องถิ่น"
        },
        {
            title: "Academic Leadership",
            description: "พัฒนาศักยภาพสู่การเป็นผู้นำทางวิชาการและสังคม"
        },
        {
            title: "Policy Maker",
            description: "มีบทบาทในการกำหนดนโยบายสาธารณะระดับประเทศ"
        }
    ],
    careers: [
        "อาจารย์มหาวิทยาลัย",
        "นักวิจัยระดับเชี่ยวชาญ",
        "ผู้บริหารระดับสูงในองค์กร",
        "ที่ปรึกษาด้านยุทธศาสตร์ระดับประเทศ",
        "นักเขียน / นักคิด / นักทฤษฎี"
    ],
    structure: {
        totalCredits: 48,
        general: 0,
        major: 48,
        freeElective: 0
    },
    downloadLink: "#"
};

export default function RegionalDevPhDPage() {
    return <ProgramTemplate data={programData} />;
}
