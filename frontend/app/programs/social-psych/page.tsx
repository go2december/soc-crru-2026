import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "social-psych",
    title: "สาขาวิชาจิตวิทยาสังคม",
    degree: "วิทยาศาสตรบัณฑิต (จิตวิทยาสังคม) - B.Sc. (Social Psychology)",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    description: "ศึกษาพฤติกรรมและจิตใจมนุษย์ด้วยวิธีการทางวิทยาศาสตร์ ครอบคลุมทั้งจิตวิทยาอุตสาหกรรม การให้คำปรึกษา และจิตวิทยาชุมชน มุ่งเน้นการประยุกต์ทฤษฎีเพื่อเข้าใจและแก้ไขปัญหาในระดับบุคคลและสังคม หลักสูตรนี้ออกแบบมาเพื่อสร้างนักจิตวิทยาที่เข้าใจความซับซ้อนของโลกยุคใหม่ สามารถใช้ข้อมูลขับเคลื่อนการตัดสินใจ (Data-Driven Psychology) และมีทักษะ Soft Skills ที่เป็นที่ต้องการของตลาดแรงงาน",
    highlights: [
        {
            title: "เข้าใจคน เข้าใจโลก",
            description: "เรียนรู้พฤติกรรมมนุษย์ พลวัตกลุ่ม และจิตวทยาท้ามกลางความหลากหลายวัฒนธรรม"
        },
        {
            title: "ทักษะการให้คำปรึกษา",
            description: "ฝึกปฏิบัติการให้คำปรึกษาเบื้องต้น (Counseling) และการรับฟังอย่างลึกซึ้ง"
        },
        {
            title: "HR & Organization Development",
            description: "ประยุกต์จิตวิทยาในการคัดเลือก พัฒนา และสร้างแรงจูงใจให้บุคลากร"
        },
        {
            title: "Data-Driven Insight",
            description: "ใช้สถิติและการวิจัยทางจิตวิทยาเพื่อวิเคราะห์เทรนด์และพฤติกรรมผู้บริโภค"
        }
    ],
    careers: [
        "นักจิตวิทยาองค์กร / เจ้าหน้าที่บริหารงานบุคคล (HR)",
        "นักวิชาการศึกษา / แนะแนว",
        "นักจิตวิทยาพัฒนาการ / เด็กและวัยรุ่น",
        "นักการตลาด / วิจัยพฤติกรรมผู้บริโภค",
        "ผู้ให้คำปรึกษาทางสังคมสงเคราะห์",
        "Life Coach / วิทยากรกระบวนการ"
    ],
    structure: {
        totalCredits: 126,
        general: 30,
        major: 90,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function SocialPsychPage() {
    return <ProgramTemplate data={programData} />;
}
