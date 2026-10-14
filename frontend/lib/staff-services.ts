import { apiFetch } from './api-config';

export type StaffServiceCategory =
  | 'ALL'
  | 'HR_FINANCE'
  | 'ACADEMIC_TEACHING'
  | 'RESEARCH_QA'
  | 'FACILITY_REPAIR'
  | 'DIGITAL_IT';

export interface StaffServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'HR_FINANCE' | 'ACADEMIC_TEACHING' | 'RESEARCH_QA' | 'FACILITY_REPAIR' | 'DIGITAL_IT';
  url: string;
  icon: string;
  badge?: string;
  isExternal: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface StaffDocumentItem {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'EXTERNAL_FORM' | string;
  fileSize?: string;
  displayOrder: number;
  isPublished: boolean;
}

export const STAFF_CATEGORIES: { id: StaffServiceCategory; label: string; icon: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด (All Systems)', icon: 'LayoutGrid' },
  { id: 'HR_FINANCE', label: 'บุคคล & สารบรรณ & เงินเดือน (HR & Finance)', icon: 'FileText' },
  { id: 'ACADEMIC_TEACHING', label: 'การสอน & ส่งเกรด (Teaching & Grading)', icon: 'GraduationCap' },
  { id: 'RESEARCH_QA', label: 'วิจัย & ประกันคุณภาพ (Research & QA)', icon: 'FlaskConical' },
  { id: 'FACILITY_REPAIR', label: 'ยานพาหนะ & ห้อง & แจ้งซ่อม (Facility & Repair)', icon: 'Wrench' },
  { id: 'DIGITAL_IT', label: 'ไอที & คลาวด์องค์กร (IT & Enterprise)', icon: 'Wifi' },
];

export const FALLBACK_STAFF_SERVICES: StaffServiceItem[] = [
  {
    id: 'staff-1',
    title: 'ระบบสารบรรณอิเล็กทรอนิกส์ (CRRU E-OFFICE V.3)',
    description: 'รับ-ส่ง หนังสือราชการ ตรวจสอบหนังสือเข้า เกษียนหนังสือ และลงนามคำสั่งอิเล็กทรอนิกส์',
    category: 'HR_FINANCE',
    url: 'https://e-office.crru.ac.th/',
    icon: 'FileText',
    badge: 'สารบรรณองค์กร',
    isExternal: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'staff-2',
    title: 'ระบบบริหารงานบุคคล (CRRU HRMIS)',
    description: 'ข้อมูลประวัติบุคลากร บันทึกและประเมินผลการปฏิบัติราชการ (TOR / ก.พ.ร.) รายรอบปีงบประมาณ',
    category: 'HR_FINANCE',
    url: 'https://hrmis.crru.ac.th/',
    icon: 'UserCheck',
    badge: 'HR / ประเมินผล TOR',
    isExternal: true,
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'staff-3',
    title: 'ระบบโปรแกรมเงินเดือนและสลิปออนไลน์ (CRRU Payroll)',
    description: 'ตรวจสอบสลิปเงินเดือนรายเดือน ตรวจสอบรายการหักภาษี และพิมพ์หนังสือรับรองภาษี ภ.ง.ด.91',
    category: 'HR_FINANCE',
    url: 'https://payroll.crru.ac.th/',
    icon: 'Wallet',
    badge: 'สลิปเงินเดือน',
    isExternal: true,
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'staff-4',
    title: 'กองบริหารงานบุคคล (Personnel CRRU)',
    description: 'ศูนย์ข้อมูลสวัสดิการบุคลากร กองทุนสำรองเลี้ยงชีพ ประกันสุขภาพ และการขอตำแหน่งทางวิชาการ',
    category: 'HR_FINANCE',
    url: 'https://personnel.crru.ac.th/',
    icon: 'Building2',
    badge: 'สวัสดิการบุคลากร',
    isExternal: true,
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'staff-5',
    title: 'ระบบบริการอาจารย์ผู้สอนและบันทึกเกรด (REG Teacher)',
    description: 'บันทึกตารางสอน ตรวจสอบรายชื่อนักศึกษาแต่ละกลุ่มเรียน และบันทึก/ส่งผลการเรียนออนไลน์',
    category: 'ACADEMIC_TEACHING',
    url: 'https://reg.crru.ac.th/',
    icon: 'GraduationCap',
    badge: 'ส่งเกรด / ตารางสอน',
    isExternal: true,
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'staff-6',
    title: 'ระบบเช็คชื่อเข้าชั้นเรียนออนไลน์ (Class CRRU)',
    description: 'ระบบบันทึกเวลาและการเข้าเรียนของนักศึกษา เช็คชื่อรายคาบ และสรุปสถิติเวลาเรียน',
    category: 'ACADEMIC_TEACHING',
    url: 'https://class.crru.ac.th/',
    icon: 'CheckCircle2',
    badge: 'เช็คชื่อเข้าเรียน',
    isExternal: true,
    displayOrder: 6,
    isPublished: true,
  },
  {
    id: 'staff-7',
    title: 'ระบบจัดการเรียนการสอนออนไลน์ (CRRU Elearning / LMS)',
    description: 'สร้างรายวิชาออนไลน์ อัปโหลดเอกสารประกอบการสอน สื่อมัลติมีเดีย และมอบหมายงาน',
    category: 'ACADEMIC_TEACHING',
    url: 'https://elearning.crru.ac.th/',
    icon: 'MonitorPlay',
    badge: 'Moodle LMS',
    isExternal: true,
    displayOrder: 7,
    isPublished: true,
  },
  {
    id: 'staff-8',
    title: 'ระบบอาจารย์ที่ปรึกษา (Advisor Portal)',
    description: 'ติดตามผลการเรียน ความประพฤติ และอนุมัติคำร้องของนักศึกษาในความดูแลของอาจารย์ที่ปรึกษา',
    category: 'ACADEMIC_TEACHING',
    url: 'https://orasis.crru.ac.th/orasis_crru/sis2/login',
    icon: 'Users',
    badge: 'อาจารย์ที่ปรึกษา',
    isExternal: true,
    displayOrder: 8,
    isPublished: true,
  },
  {
    id: 'staff-9',
    title: 'คลังวิจัยและวิทยานิพนธ์ (CRRU Repository)',
    description: 'สืบค้นและเผยแพร่ผลงานวิจัย บทความวิชาการ รายงานการวิจัยฉบับสมบูรณ์ของคณาจารย์',
    category: 'RESEARCH_QA',
    url: 'https://repository.crru.ac.th/',
    icon: 'BookOpen',
    badge: 'คลังผลงานวิจัย',
    isExternal: true,
    displayOrder: 9,
    isPublished: true,
  },
  {
    id: 'staff-10',
    title: 'ระบบประกันคุณภาพการศึกษา (CRRU IQA Online)',
    description: 'ระบบสารสนเทศเพื่อการประกันคุณภาพการศึกษาภายในระดับหลักสูตร คณะ และสถาบัน (CHE QA)',
    category: 'RESEARCH_QA',
    url: 'https://iqa.crru.ac.th/',
    icon: 'ShieldCheck',
    badge: 'IQA / SAR Online',
    isExternal: true,
    displayOrder: 10,
    isPublished: true,
  },
  {
    id: 'staff-11',
    title: 'ระบบคลังหน่วยกิตและการเทียบโอน (Credit Bank Admin)',
    description: 'ระบบจัดการรายวิชาคลังหน่วยกิต บันทึกประเมินทักษะและการเทียบโอนผลการเรียนรู้ตลอดชีวิต',
    category: 'RESEARCH_QA',
    url: 'https://lifelong.crru.ac.th/',
    icon: 'Coins',
    badge: 'Credit Bank',
    isExternal: true,
    displayOrder: 11,
    isPublished: true,
  },
  {
    id: 'staff-12',
    title: 'ระบบขอใช้ยานพาหนะมหาวิทยาลัย (Vehicle Booking)',
    description: 'จองรถตู้ รถบัส หรือยานพาหนะของมหาวิทยาลัยเพื่อการเดินทางไปปฏิบัติงานราชการภายนอก',
    category: 'FACILITY_REPAIR',
    url: 'https://car.crru.ac.th/',
    icon: 'Car',
    badge: 'ขอใช้รถราชการ',
    isExternal: true,
    displayOrder: 12,
    isPublished: true,
  },
  {
    id: 'staff-13',
    title: 'ระบบจองห้องประชุมส่วนกลาง (Meeting Room Booking)',
    description: 'ระบบจองห้องประชุม ห้องอบรมสัมมนา และห้องประชุมเสมือนจริงของมหาวิทยาลัย',
    category: 'FACILITY_REPAIR',
    url: 'https://aritc.crru.ac.th/',
    icon: 'DoorOpen',
    badge: 'จองห้องประชุม',
    isExternal: true,
    displayOrder: 13,
    isPublished: true,
  },
  {
    id: 'staff-14',
    title: 'ระบบแจ้งซ่อมและบริการสาธารณูปโภค (e-Service / Maintenance)',
    description: 'แจ้งซ่อมอุปกรณ์สำนักงาน คอมพิวเตอร์ ระบบเครือข่าย แอร์ ไฟฟ้า และประปาอาคารคณะ',
    category: 'FACILITY_REPAIR',
    url: 'https://repair.crru.ac.th/',
    icon: 'Wrench',
    badge: 'แจ้งซ่อมออนไลน์',
    isExternal: true,
    displayOrder: 14,
    isPublished: true,
  },
  {
    id: 'staff-15',
    title: 'อีเมลองค์กรและคลาวด์บุคลากร (@crru.ac.th)',
    description: 'เข้าสู่ระบบ Google Workspace for Education และ Microsoft 365 สิทธิ์บุคลากรทางการศึกษา',
    category: 'DIGITAL_IT',
    url: 'https://mail.crru.ac.th/',
    icon: 'Mail',
    badge: '@crru.ac.th',
    isExternal: true,
    displayOrder: 15,
    isPublished: true,
  },
  {
    id: 'staff-16',
    title: 'เครือข่ายความปลอดภัยและ CRRU VPN บุคลากร',
    description: 'เชื่อมต่อเครือข่ายอินเทอร์เน็ตความเร็วสูง และเข้าถึงระบบฐานข้อมูลภายในจากนอกมหาวิทยาลัย',
    category: 'DIGITAL_IT',
    url: 'https://vpn.crru.ac.th/',
    icon: 'Wifi',
    badge: 'Enterprise VPN',
    isExternal: true,
    displayOrder: 16,
    isPublished: true,
  },
];

export const FALLBACK_STAFF_DOCS: StaffDocumentItem[] = [
  {
    id: 'sdoc-1',
    title: 'แบบขออนุมัติเดินทางไปปฏิบัติงานราชการ / อบรม / สัมมนา',
    category: 'การไปราชการ',
    fileUrl: '/forms/staff/official-travel-request.docx',
    fileType: 'DOCX',
    fileSize: '145 KB',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'sdoc-2',
    title: 'ใบเบิกเงินค่าใช้จ่ายในการเดินทางไปราชการ (แบบ บก.01)',
    category: 'การเงินและพัสดุ',
    fileUrl: '/forms/staff/travel-expense-reimbursement.pdf',
    fileType: 'PDF',
    fileSize: '290 KB',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'sdoc-3',
    title: 'แบบฟอร์มขออนุมัติโครงการบริการวิชาการ / วิจัย คณะสังคมศาสตร์',
    category: 'วิจัยและวิชาการ',
    fileUrl: '/forms/staff/project-approval-proposal.docx',
    fileType: 'DOCX',
    fileSize: '160 KB',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'sdoc-4',
    title: 'แบบฟอร์มใบลา (ลาพักผ่อน, ลากิจ, ลาป่วย, ลาคลอดบุตร)',
    category: 'สิทธิประโยชน์และใบลา',
    fileUrl: '/forms/staff/leave-request-form.pdf',
    fileType: 'PDF',
    fileSize: '215 KB',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'sdoc-5',
    title: 'แบบฟอร์มขอเบิกพัสดุและวัสดุอุปกรณ์สำนักงาน คณะสังคมศาสตร์',
    category: 'การเงินและพัสดุ',
    fileUrl: '/forms/staff/supply-requisition-form.pdf',
    fileType: 'PDF',
    fileSize: '185 KB',
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'sdoc-6',
    title: 'แบบขออนุมัติใช้ห้องประชุมและห้องปฏิบัติการ คณะสังคมศาสตร์',
    category: 'คำร้องทั่วไป',
    fileUrl: '/forms/staff/meeting-room-request.docx',
    fileType: 'DOCX',
    fileSize: '125 KB',
    displayOrder: 6,
    isPublished: true,
  },
  {
    id: 'sdoc-7',
    title: 'แบบเสนอขอรับการสนับสนุนค่าตีพิมพ์เผยแพร่ผลงานวิชาการ/วิจัย',
    category: 'วิจัยและวิชาการ',
    fileUrl: '/forms/staff/research-publication-grant.docx',
    fileType: 'DOCX',
    fileSize: '150 KB',
    displayOrder: 7,
    isPublished: true,
  },
  {
    id: 'sdoc-8',
    title: 'แบบฟอร์มรายงานผลการดำเนินโครงการและสรุปการใช้จ่ายงบประมาณ',
    category: 'การเงินและพัสดุ',
    fileUrl: '/forms/staff/project-summary-report.docx',
    fileType: 'DOCX',
    fileSize: '170 KB',
    displayOrder: 8,
    isPublished: true,
  },
  {
    id: 'sdoc-9',
    title: 'แบบฟอร์มข้อตกลงและแบบประเมินผลการปฏิบัติราชการ (ภาระงานบุคลากร)',
    category: 'สิทธิประโยชน์และใบลา',
    fileUrl: '/forms/staff/performance-agreement-tor.pdf',
    fileType: 'PDF',
    fileSize: '320 KB',
    displayOrder: 9,
    isPublished: true,
  },
  {
    id: 'sdoc-10',
    title: 'แบบคำขอมีบัตรประจำตัวเจ้าหน้าที่ของรัฐ / บัตรบุคลากร',
    category: 'คำร้องทั่วไป',
    fileUrl: '/forms/staff/staff-id-card-application.pdf',
    fileType: 'PDF',
    fileSize: '195 KB',
    displayOrder: 10,
    isPublished: true,
  },
  {
    id: 'sdoc-11',
    title: 'แบบฟอร์มขอความอนุเคราะห์จัดทำสื่อประชาสัมพันธ์และโสตทัศนูปกรณ์',
    category: 'คำร้องทั่วไป',
    fileUrl: '/forms/staff/media-production-request.docx',
    fileType: 'DOCX',
    fileSize: '110 KB',
    displayOrder: 11,
    isPublished: true,
  },
];

export async function fetchStaffServices(category?: string): Promise<StaffServiceItem[]> {
  try {
    const query = category && category !== 'ALL' ? `?category=${category}` : '';
    const res = await apiFetch(`/staff-services${query}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return FALLBACK_STAFF_SERVICES;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_STAFF_SERVICES;
  } catch (err) {
    console.warn('Using fallback staff services due to fetch error:', err);
    return FALLBACK_STAFF_SERVICES;
  }
}

export async function fetchStaffDocuments(category?: string): Promise<StaffDocumentItem[]> {
  try {
    const query = category && category !== 'ALL' ? `?category=${category}` : '';
    const res = await apiFetch(`/staff-services/documents${query}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return FALLBACK_STAFF_DOCS;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_STAFF_DOCS;
  } catch (err) {
    console.warn('Using fallback staff documents due to fetch error:', err);
    return FALLBACK_STAFF_DOCS;
  }
}
