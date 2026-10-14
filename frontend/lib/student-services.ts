import { apiFetch } from './api-config';

export type StudentServiceCategory = 
  | 'ALL'
  | 'ACADEMIC' 
  | 'WELFARE' 
  | 'LIBRARY' 
  | 'DIGITAL_IT' 
  | 'FACULTY';

export interface StudentServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'ACADEMIC' | 'WELFARE' | 'LIBRARY' | 'DIGITAL_IT' | 'FACULTY';
  url: string;
  icon: string;
  badge?: string;
  isExternal: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface StudentDocumentItem {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'EXTERNAL_FORM' | string;
  fileSize?: string;
  displayOrder: number;
  isPublished: boolean;
}

export const STUDENT_CATEGORIES: { id: StudentServiceCategory; label: string; icon: string; countBadge?: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด (All Services)', icon: 'LayoutGrid' },
  { id: 'ACADEMIC', label: 'การเรียน & ทะเบียน (Academic)', icon: 'GraduationCap' },
  { id: 'WELFARE', label: 'สวัสดิการ & กิจกรรม (Welfare)', icon: 'HeartHandshake' },
  { id: 'LIBRARY', label: 'ห้องสมุด & แหล่งค้นคว้า (Library)', icon: 'BookOpen' },
  { id: 'DIGITAL_IT', label: 'ดิจิทัล & เครือข่าย (IT & Network)', icon: 'Wifi' },
  { id: 'FACULTY', label: 'บริการคณะสังคมศาสตร์ (Faculty)', icon: 'Building2' },
];

export const FALLBACK_STUDENT_SERVICES: StudentServiceItem[] = [
  {
    id: '1',
    title: 'ระบบทะเบียนและประมวลผล (REG CRRU)',
    description: 'ลงทะเบียนเรียน ตรวจสอบผลการเรียน ตารางเรียน ตารางสอบ และใบแจ้งชำระเงินค่าธรรมเนียมการศึกษา',
    category: 'ACADEMIC',
    url: 'https://reg.crru.ac.th',
    icon: 'GraduationCap',
    badge: 'ทางการ / REG',
    isExternal: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: '2',
    title: 'ระบบบริการข้อมูลนักศึกษา (ORASIS-SIS)',
    description: 'ระบบสารสนเทศข้อมูลนักศึกษา ตรวจสอบประวัติ สถานะภาพนักศึกษา และบริการวิชาการ',
    category: 'ACADEMIC',
    url: 'https://orasis.crru.ac.th/orasis_crru/sis2/login',
    icon: 'UserCheck',
    badge: 'ORASIS Login',
    isExternal: true,
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: '3',
    title: 'CRRU Elearning (LMS)',
    description: 'ระบบจัดการเรียนการสอนออนไลน์ เข้าชั้นเรียนดิจิทัล ส่งงาน การบ้าน และเอกสารการเรียน',
    category: 'ACADEMIC',
    url: 'https://elearning.crru.ac.th/',
    icon: 'MonitorPlay',
    badge: 'Moodle LMS',
    isExternal: true,
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: '4',
    title: 'คลังหน่วยกิตและการเรียนรู้ตลอดชีวิต (CRRU Lifelong)',
    description: 'หลักสูตรระยะสั้น คลังหน่วยกิต (Credit Bank) และการสะสมผลลัพธ์การเรียนรู้เทียบโอนรายวิชา',
    category: 'ACADEMIC',
    url: 'https://lifelong.crru.ac.th/',
    icon: 'Coins',
    badge: 'Credit Bank',
    isExternal: true,
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: '5',
    title: 'ปฏิทินการศึกษา (Academic Calendar)',
    description: 'กำหนดการสำคัญประจำภาคเรียน วันเปิด-ปิดภาคเรียน วันลงทะเบียน และกำหนดการสอบ',
    category: 'ACADEMIC',
    url: '/eservice/calendar',
    icon: 'Calendar',
    badge: 'กำหนดการวิชาการ',
    isExternal: false,
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: '6',
    title: 'ระบบกิจกรรมนักศึกษา (DIGIT.CRRU)',
    description: 'บันทึกและตรวจสอบชั่วโมงกิจกรรมบังคับ/กิจกรรมเสริมหลักสูตร เงื่อนไขก่อนสำเร็จการศึกษา',
    category: 'WELFARE',
    url: 'https://digit.crru.ac.th/',
    icon: 'Award',
    badge: 'ชั่วโมงกิจกรรม',
    isExternal: true,
    displayOrder: 6,
    isPublished: true,
  },
  {
    id: '7',
    title: 'ระบบกู้ยืมเงินเพื่อการศึกษา (กยศ. / กรอ. CRRU)',
    description: 'ติดตามกำหนดการส่งเอกสาร สัญญากู้ยืม และระบบบริหารการให้กู้ยืม (DSL)',
    category: 'WELFARE',
    url: 'https://studentloan.crru.ac.th/',
    icon: 'Wallet',
    badge: 'กองทุน กยศ.',
    isExternal: true,
    displayOrder: 7,
    isPublished: true,
  },
  {
    id: '8',
    title: 'กองพัฒนานักศึกษา & ทุนการศึกษา',
    description: 'งานทุนการศึกษา ข้อมูลสวัสดิการพยาบาล ประกันอุบัติเหตุ และการขอผ่อนผันการเกณฑ์ทหาร',
    category: 'WELFARE',
    url: 'https://dsr.crru.ac.th/',
    icon: 'HeartHandshake',
    badge: 'ทุน / สวัสดิการ',
    isExternal: true,
    displayOrder: 8,
    isPublished: true,
  },
  {
    id: '9',
    title: 'ระบบจองหอพักนักศึกษา (ภิรมย์ราชภัฏ)',
    description: 'ระบบจองห้องพัก ตรวจสอบห้องว่าง และชำระเงินค่าหอพักนักศึกษา มรภ.เชียงราย',
    category: 'WELFARE',
    url: 'https://property.crru.ac.th/',
    icon: 'Home',
    badge: 'หอพักใน มรภ.',
    isExternal: true,
    displayOrder: 9,
    isPublished: true,
  },
  {
    id: '10',
    title: 'สำนักวิทยบริการฯ (หอสมุดกลาง CRRU Library)',
    description: 'สืบค้นหนังสือและตำราเรียนออนไลน์ (OPAC), ยืม-คืน และบริการห้องสมุดดิจิทัล',
    category: 'LIBRARY',
    url: 'https://library.crru.ac.th/',
    icon: 'BookOpen',
    badge: 'OPAC หอสมุด',
    isExternal: true,
    displayOrder: 10,
    isPublished: true,
  },
  {
    id: '11',
    title: 'ระบบจองห้องค้นคว้า (CRRU Smart Room Booking)',
    description: 'จองห้องศึกษาค้นคว้าเดี่ยว/กลุ่ม ห้องมินิเธียเตอร์ ณ อาคารบรรณราชนครินทร์',
    category: 'LIBRARY',
    url: 'https://aritc.crru.ac.th/',
    icon: 'DoorOpen',
    badge: 'จองห้องค้นคว้า',
    isExternal: true,
    displayOrder: 11,
    isPublished: true,
  },
  {
    id: '12',
    title: 'คลังวิจัยและวิทยานิพนธ์ (CRRU Repository)',
    description: 'สืบค้นวิทยานิพนธ์ รายงานวิจัยฉบับเต็ม และวารสารวิชาการ มรภ.เชียงราย',
    category: 'LIBRARY',
    url: 'https://repository.crru.ac.th/',
    icon: 'FileSearch',
    badge: 'วิทยานิพนธ์ / วิจัย',
    isExternal: true,
    displayOrder: 12,
    isPublished: true,
  },
  {
    id: '13',
    title: 'อีเมลนักศึกษาและคลาวด์การศึกษา (@crru.ac.th)',
    description: 'เข้าใช้งาน Google Workspace for Education และ Microsoft 365 สิทธิ์นักศึกษา',
    category: 'DIGITAL_IT',
    url: 'https://mail.crru.ac.th/',
    icon: 'Mail',
    badge: '@crru.ac.th',
    isExternal: true,
    displayOrder: 13,
    isPublished: true,
  },
  {
    id: '14',
    title: 'เครือข่ายไร้สาย CRRU WiFi & eduroam',
    description: 'ระบบยืนยันตัวตนเครือข่ายไร้สายความเร็วสูงทั่วมหาวิทยาลัย และเครือข่ายโรมมิ่ง eduroam',
    category: 'DIGITAL_IT',
    url: 'https://wifi.crru.ac.th/',
    icon: 'Wifi',
    badge: 'WiFi / eduroam',
    isExternal: true,
    displayOrder: 14,
    isPublished: true,
  },
  {
    id: '15',
    title: 'CRRU VPN เครือข่ายส่วนตัวเสมือน',
    description: 'เชื่อมต่อเครือข่ายอินเทอร์เน็ตมหาวิทยาลัยจากภายนอกเพื่อเข้าถึงฐานข้อมูลวิจัยและวารสาร',
    category: 'DIGITAL_IT',
    url: 'https://vpn.crru.ac.th/',
    icon: 'ShieldCheck',
    badge: 'Secure VPN',
    isExternal: true,
    displayOrder: 15,
    isPublished: true,
  },
];

export const FALLBACK_STUDENT_DOCS: StudentDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'คำร้องทั่วไป คณะสังคมศาสตร์ (แบบฟอร์ม คส.01)',
    category: 'คำร้องทั่วไป',
    fileUrl: '/forms/general-request-form.pdf',
    fileType: 'PDF',
    fileSize: '280 KB',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'doc-2',
    title: 'คำร้องขอฝึกประสบการณ์วิชาชีพ / สหกิจศึกษา (คส.สหกิจ 01)',
    category: 'การฝึกงานและสหกิจศึกษา',
    fileUrl: '/forms/coop-internship-application.pdf',
    fileType: 'PDF',
    fileSize: '420 KB',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'doc-3',
    title: 'แบบขอหนังสือส่งตัวและขอความอนุเคราะห์ฝึกประสบการณ์วิชาชีพ',
    category: 'การฝึกงานและสหกิจศึกษา',
    fileUrl: '/forms/internship-request-letter.docx',
    fileType: 'DOCX',
    fileSize: '115 KB',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'doc-4',
    title: 'แบบประเมินผลการฝึกประสบการณ์วิชาชีพ (สำหรับสถานประกอบการ)',
    category: 'การฝึกงานและสหกิจศึกษา',
    fileUrl: '/forms/internship-evaluation-form.pdf',
    fileType: 'PDF',
    fileSize: '310 KB',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'doc-5',
    title: 'คำร้องขอเพิ่ม-ถอนรายวิชาล่าช้าเป็นกรณีพิเศษ (คส.วิชาการ 02)',
    category: 'คำร้องทางวิชาการ',
    fileUrl: '/forms/late-course-add-drop.pdf',
    fileType: 'PDF',
    fileSize: '210 KB',
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'doc-6',
    title: 'แบบคำร้องขอเทียบโอนผลการเรียนและสะสมหน่วยกิต (Credit Bank)',
    category: 'คำร้องทางวิชาการ',
    fileUrl: '/forms/credit-transfer-application.pdf',
    fileType: 'PDF',
    fileSize: '340 KB',
    displayOrder: 6,
    isPublished: true,
  },
  {
    id: 'doc-7',
    title: 'คำร้องขอลาพักการเรียน / ขอคืนสภาพการเป็นนักศึกษา',
    category: 'คำร้องทางวิชาการ',
    fileUrl: '/forms/leave-of-absence-request.pdf',
    fileType: 'PDF',
    fileSize: '225 KB',
    displayOrder: 7,
    isPublished: true,
  },
  {
    id: 'doc-8',
    title: 'คำร้องขอลงทะเบียนเรียนเกิน/ต่ำกว่าเกณฑ์ที่กำหนด',
    category: 'คำร้องทางวิชาการ',
    fileUrl: '/forms/over-credit-registration.pdf',
    fileType: 'PDF',
    fileSize: '195 KB',
    displayOrder: 8,
    isPublished: true,
  },
  {
    id: 'doc-9',
    title: 'แบบเสนอหัวข้อและโครงร่างสารนิพนธ์/ภาคนิพนธ์ (คส.วิจัย 01)',
    category: 'วิจัยและสารนิพนธ์',
    fileUrl: '/forms/thesis-proposal-form.docx',
    fileType: 'DOCX',
    fileSize: '145 KB',
    displayOrder: 9,
    isPublished: true,
  },
  {
    id: 'doc-10',
    title: 'แบบยินยอมการเผยแพร่ผลงานวิชาการ/สารนิพนธ์นักศึกษา',
    category: 'วิจัยและสารนิพนธ์',
    fileUrl: '/forms/student-research-consent.pdf',
    fileType: 'PDF',
    fileSize: '190 KB',
    displayOrder: 10,
    isPublished: true,
  },
  {
    id: 'doc-11',
    title: 'คำร้องขอหนังสือรับรองความประพฤติ (งานพัฒนานักศึกษา)',
    category: 'ทุนและสวัสดิการ',
    fileUrl: '/forms/conduct-certificate-request.pdf',
    fileType: 'PDF',
    fileSize: '175 KB',
    displayOrder: 11,
    isPublished: true,
  },
  {
    id: 'doc-12',
    title: 'แบบคำร้องขอผ่อนผันการตรวจเลือกเข้ารับราชการทหารกองประจำการ',
    category: 'ทุนและสวัสดิการ',
    fileUrl: '/forms/military-deferment-request.pdf',
    fileType: 'PDF',
    fileSize: '390 KB',
    displayOrder: 12,
    isPublished: true,
  },
  {
    id: 'doc-13',
    title: 'แบบขออนุมัติจัดโครงการ/กิจกรรมนักศึกษา คณะสังคมศาสตร์',
    category: 'คำร้องทั่วไป',
    fileUrl: '/forms/student-project-approval.docx',
    fileType: 'DOCX',
    fileSize: '130 KB',
    displayOrder: 13,
    isPublished: true,
  },
];

export async function fetchStudentServices(category?: string): Promise<StudentServiceItem[]> {
  try {
    const query = category && category !== 'ALL' ? `?category=${category}` : '';
    const res = await apiFetch(`/student-services${query}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return FALLBACK_STUDENT_SERVICES;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_STUDENT_SERVICES;
  } catch (err) {
    console.warn('Using fallback student services due to fetch error:', err);
    return FALLBACK_STUDENT_SERVICES;
  }
}

export async function fetchStudentDocuments(category?: string): Promise<StudentDocumentItem[]> {
  try {
    const query = category && category !== 'ALL' ? `?category=${category}` : '';
    const res = await apiFetch(`/student-services/documents${query}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return FALLBACK_STUDENT_DOCS;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_STUDENT_DOCS;
  } catch (err) {
    console.warn('Using fallback student documents due to fetch error:', err);
    return FALLBACK_STUDENT_DOCS;
  }
}
