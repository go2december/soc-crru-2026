import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "social-sci",
    title: "สาขาวิชาสังคมศาสตร์",
    degree: "ศิลปศาสตรบัณฑิต (สังคมศาสตร์) - B.A. (Social Sciences)",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2070&auto=format&fit=crop",
    description: "มุ่งเน้นการสร้างบัณฑิตที่มีความรู้ความเข้าใจในปรากฏการณ์ทางสังคมที่ซับซ้อน โดยแบ่งการศึกษาออกเป็น 2 แขนงวิชา เพื่อให้ผู้เรียนได้เชี่ยวชาญในด้านที่ตนเองสนใจ ทั้งในด้านสังคมวิทยาและมานุษยวิทยา และการจัดการทรัพยากรทางวัฒนธรรม",
    concentrations: [
        {
            title: "แขนงวิชาสังคมวิทยาและมานุษยวิทยา (Sociology and Anthropology Program)",
            description: "เน้นการปั้นบัณฑิตให้เป็นผู้นำการเปลี่ยนแปลงสังคม (Change Agents) ที่เข้าใจชุมชนอย่างลึกซึ้งผ่านทักษะการวิจัยภาคสนามและนวัตกรรมดิจิทัล"
        },
        {
            title: "แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม (Cultural Resource Management Program)",
            description: "เน้นการจัดการมรดกและทุนวัฒนธรรมด้วยมุมมองสร้างสรรค์และการบูรณาการเทคโนโลยีเพื่อสร้างอาชีพ"
        }
    ],
    highlights: [
        {
            title: "Change Agents",
            description: "สร้างผู้นำการเปลี่ยนแปลงที่เข้าใจบริบทสังคมอย่างลึกซึ้ง"
        },
        {
            title: "Cultural Innovator",
            description: "สร้างมูลค่าเพิ่มให้กับทุนทางวัฒนธรรมด้วยความคิดสร้างสรรค์"
        },
        {
            title: "Digital Research",
            description: "ประยุกต์ใช้เทคโนโลยีดิจิทัลในการวิจัยและจัดการข้อมูลชุมชน"
        },
        {
            title: "Fieldwork",
            description: "เน้นการเรียนรู้ผ่านการลงพื้นที่จริงและปฏิบัติการภาคสนาม"
        }
    ],
    careers: [
        "นักวิจัย / ผู้ช่วยนักวิจัยทางสังคม",
        "นักวิชาการด้านสังคมศาสตร์",
        "เจ้าหน้าที่องค์กรพัฒนาเอกชน (NGOs) ด้านสิทธิมนุษยชน/สิ่งแวดล้อม",
        "ข้าราชการฝ่ายปกครอง / ปลัดอำเภอ",
        "นักสื่อสารมวลชน / คอลัมนิสต์",
        "อาจารย์สถาบันการศึกษา"
    ],
    structure: {
        totalCredits: 128,
        general: 30,
        major: 92,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function SocialSciPage() {
    return <ProgramTemplate data={programData} />;
}
