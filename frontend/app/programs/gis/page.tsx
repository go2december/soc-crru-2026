import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "gis",
    title: "สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ",
    degree: "วิทยาศาสตรบัณฑิต (ภูมิศาสตร์และภูมิสารสนเทศ) - B.Sc. (Geography and Geoinformatics)",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1931&auto=format&fit=crop",
    description: "บูรณาการทฤษฎีภูมิศาสตร์กับเทคโนโลยีสมัยใหม่ เช่น GIS และ Remote Sensing เพื่อวิเคราะห์และแก้ไขปัญหาเชิงพื้นที่",
    highlights: [
        {
            title: "High-Tech Tools",
            description: "เรียนรู้การใช้งานโดรนสำรวจ (UAV), เลเซอร์สแกน (LiDAR) และซอฟต์แวร์ลิขสิทธิ์ ArcGIS Pro"
        },
        {
            title: "Smart City & Planning",
            description: "ประยุกต์เทคโนโลยีเพื่อการวางผังเมืองอัจฉริยะและการจัดการจราจร"
        },
        {
            title: "Disaster Management",
            description: "วิเคราะห์พื้นที่เสี่ยงภัยพิบัติ น้ำท่วม ดินถล่ม เพื่อการเตือนภัยล่วงหน้า"
        },
        {
            title: "Professional Certification",
            description: "เตรียมความพร้อมสู่การสอบใบคุณวุฒิวิชาชีพนักภูมิสารสนเทศ"
        }
    ],
    careers: [
        "นักภูมิสารสนเทศ (GIS Specialist)",
        "นักสำรวจ / นักแผนที่ (Surveyor)",
        "นักวิเคราะห์ข้อมูลดาวเทียม",
        "เจ้าหน้าที่วางผังเมือง",
        "นักวิชาการสิ่งแวดล้อม",
        "นักพัฒนาซอฟต์แวร์แผนที่ (Map Developer)"
    ],
    structure: {
        totalCredits: 135,
        general: 30,
        major: 99,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function GISPage() {
    return <ProgramTemplate data={programData} />;
}
