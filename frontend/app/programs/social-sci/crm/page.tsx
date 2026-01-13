import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';

const programData: ProgramData = {
    id: "social-sci-crm",
    title: "แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม",
    degree: "ศิลปศาสตรบัณฑิต (สังคมศาสตร์) - แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=2070&auto=format&fit=crop",
    level: "ปริญญาตรี (Bachelor's Degree)",
    description: "เน้นการจัดการมรดกและทุนทางวัฒนธรรมด้วยมุมมองสร้างสรรค์และการบูรณาการเทคโนโลยี พัฒนาผู้เรียนให้เป็น 'นักจัดการวัฒนธรรม' ที่สามารถสร้างมูลค่าเพิ่มให้กับท้องถิ่น ผ่านการท่องเที่ยวเชิงวัฒนธรรม การบริหารจัดการพิพิธภัณฑ์ และการอนุรักษ์ภูมิปัญญาให้ยั่งยืน",
    highlights: [
        {
            title: "Cultural Manager",
            description: "เป็นนักบริหารจัดการวัฒนธรรมที่เชื่อมโยงอดีตสู่ปัจจุบันและอนาคต"
        },
        {
            title: "Creative Tourism",
            description: "ออกแบบเส้นทางและกิจกรรมท่องเที่ยวเชิงวัฒนธรรมอย่างสร้างสรรค์"
        },
        {
            title: "Heritage Conservation",
            description: "เรียนรู้หลักการอนุรักษ์โบราณสถานและวัตถุทางวัฒนธรรมตามมาตรฐานสากล"
        },
        {
            title: "Digital Heritage",
            description: "ใช้เทคโนโลยี AR/VR และสื่อดิจิทัลในการนำเสนอเรื่องราวทางวัฒนธรรม"
        }
    ],
    careers: [
        "ภัณฑารักษ์ / เจ้าหน้าที่พิพิธภัณฑ์",
        "มัคคุเทศก์เชี่ยวชาญศิลปวัฒนธรรม",
        "นักจัดการงานอีเวนต์วัฒนธรรม",
        "เจ้าหน้าที่กระทรวงวัฒนธรรม / ท้องถิ่น",
        "ผู้ประกอบการท่องเที่ยวเชิงสร้างสรรค์"
    ],
    structure: {
        totalCredits: 128,
        general: 30,
        major: 92,
        freeElective: 6
    },
    downloadLink: "#"
};

export default function CRMPage() {
    return <ProgramTemplate data={programData} />;
}
