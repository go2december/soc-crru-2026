import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "social-dev",
    title: "สาขาวิชานวัตกรรมการพัฒนาสังคม",
    degree: "ศิลปศาสตรบัณฑิต (นวัตกรรมการพัฒนาสังคม) - B.A. (Social Development Innovation)",
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop",
    description: "เน้นการแลกเปลี่ยนเรียนรู้ภาคปฏิบัติเพื่อเปลี่ยนความรู้ให้เป็นพลังในการพัฒนาสังคม มุ่งสร้างบัณฑิตที่เป็น 'นวัตกรสังคม' ที่สามารถขับเคลื่อนการเปลี่ยนแปลงผ่านการลงมือทำจริง",
    highlights: [
        {
            title: "นักปฏิบัติการสังคมมืออาชีพ",
            description: "ฝึกฝนทักษะการทำงานภาคสนาม (Field Work) และการจัดทำโครงการพัฒนาตั้งแต่ชั้นปีแรก"
        },
        {
            title: "เครือข่ายความร่วมมือแน่นปึ้ก",
            description: "มี MOU กับองค์กรปกครองส่วนท้องถิ่นและ NGO ชั้นนำ เพื่อรองรับการฝึกงานและการทำงานจริง"
        },
        {
            title: "Social Enterprise Startup",
            description: "ส่งเสริมความเป็นผู้ประกอบการเพื่อสังคม สามารถสร้างรายได้กลับคืนสู่ชุมชน"
        },
        {
            title: "ทันสมัยด้วยเทคโนโลยี",
            description: "ประยุกต์ใช้เครื่องมือดิจิทัลและ Big Data เพื่อการวิเคราะห์และวางแผนพัฒนาสังคม"
        }
    ],
    careers: [
        "นักพัฒนาสังคม / นักพัฒนาชุมชน (Community Developer)",
        "นักวิเคราะห์นโยบายและแผน",
        "เจ้าหน้าที่ CSR ในองค์กรเอกชน",
        "เจ้าหน้าที่องค์กรปกครองส่วนท้องถิ่น (อบต./เทศบาล)",
        "เจ้าหน้าที่โครงการใน NGO / องค์กรระหว่างประเทศ",
        "ผู้ประกอบการวิสาหกิจเพื่อสังคม (Social Entrepreneur)",
        "นักสังคมสงเคราะห์"
    ],
    structure: {
        totalCredits: 130,
        general: 30,
        major: 94,
        freeElective: 6
    },
    downloadLink: "#" // ใส่ลิงก์จริงภายหลัง
};

export default function SocialDevPage() {
    return <ProgramTemplate data={programData} />;
}
