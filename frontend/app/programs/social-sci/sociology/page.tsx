import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "social-sci-sociology",
    title: "แขนงวิชาสังคมวิทยาและมานุษยวิทยา",
    degree: "ศิลปศาสตรบัณฑิต (สังคมศาสตร์) - แขนงวิชาสังคมวิทยาและมานุษยวิทยา",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2070&auto=format&fit=crop",
    level: "ปริญญาตรี (Bachelor's Degree)",
    description: "มุ่งเน้นการสร้างผู้นำความเปลี่ยนแปลงทางสังคม (Social Change Agents) ที่มีความรู้ความเข้าใจในโครงสร้างสังคมและวัฒนธรรมอย่างลึกซึ้ง ผู้เรียนจะได้ฝึกฝนทักษะการวิจัยทางสังคมระดับเข้มข้น การวิเคราะห์ข้อมูลเชิงคุณภาพและปริมาณ และการทำงานภาคสนามร่วมกับชุมชน เพื่อนำไปสู่การเสนอแนะนโยบายและการแก้ไขปัญหาสังคมอย่างยั่งยืนในยุคดิจิทัล",
    highlights: [
        {
            title: "Change Agents",
            description: "สร้างผู้นำที่กล้าคิด กล้าทำ เพื่อเปลี่ยนแปลงสังคมไปในทิศทางที่ดีขึ้น"
        },
        {
            title: "Fieldwork Expert",
            description: "เชี่ยวชาญการวิจัยภาคสนาม การเก็บข้อมูลเชิงลึก และการทำงานร่วมกับชุมชน"
        },
        {
            title: "Digital Sociology",
            description: "ประยุกต์ใช้เครื่องมือดิจิทัลในการวิเคราะห์ข้อมูลทางสังคม (Social Data Analysis)"
        },
        {
            title: "Social Policy",
            description: "มีความสามารถในการวิเคราะห์และนำเสนอนโยบายสาธารณะ"
        }
    ],
    careers: [
        "นักวิจัยทางสังคม / นักมานุษยวิทยา",
        "เจ้าหน้าที่วิเคราะห์นโยบายและแผน",
        "นักพัฒนาสังคม (NGOs & Government)",
        "นักสื่อสารองค์กร / CSR",
        "นักวิชาการอิสระ / Content Creator ด้านสังคม"
    ],
    structure: {
        totalCredits: 128,
        general: 30,
        major: 92,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function SociologyPage() {
    return <ProgramTemplate data={programData} />;
}
