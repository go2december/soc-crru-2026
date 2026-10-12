export interface AcademicServiceMemberItem {
  id: string;
  staffId: string;
  role: string; // LEADER, CO_LEADER, MEMBER, RESEARCHER
  prefix?: string | null;
  firstNameTh?: string | null;
  lastNameTh?: string | null;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
}

export interface AcademicServiceItem {
  id: string;
  title: string;
  description: string | null;
  serviceType: string;
  area: string | null;
  status: string | null;
  coverImageUrl: string | null;
  galleryImages?: string[] | null;
  budget?: string | number | null;
  fundingSource?: string | null;
  sdgIds?: number[] | null;
  documentUrl?: string | null;
  members?: AcademicServiceMemberItem[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceTypeConfig {
  value: string;
  label: string;
  description: string;
  iconName: 'HeartHandshake' | 'Lightbulb' | 'FlaskConical' | 'FolderGit2' | 'Sparkles';
  badgeColor: string;
  accentBg: string;
  textColor: string;
}

export const ACADEMIC_SERVICE_TYPES: ServiceTypeConfig[] = [
  {
    value: 'SOCIAL_SERVICE',
    label: 'บริการเพื่อสังคม',
    description: 'โครงการพัฒนาศักยภาพชุมชนและท้องถิ่น ผ่านกระบวนการมีส่วนร่วมและการถ่ายทอดองค์ความรู้',
    iconName: 'HeartHandshake',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentBg: 'bg-blue-50 text-blue-600',
    textColor: 'text-blue-700',
  },
  {
    value: 'CONSULTING',
    label: 'ที่ปรึกษาวิจัยและนวัตกรรม',
    description: 'ให้บริการคำปรึกษาด้านระเบียบวิธีวิจัย การวิเคราะห์ข้อมูลทางสถิติ และการพัฒนาเครื่องมือวิจัย',
    iconName: 'Lightbulb',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentBg: 'bg-amber-50 text-amber-700',
    textColor: 'text-amber-700',
  },
  {
    value: 'SOCIAL_LAB',
    label: 'บริการห้องปฏิบัติการ (Social Lab)',
    description: 'บริการห้องปฏิบัติการทางสังคมศาสตร์ ห้องประชุมเชิงปฏิบัติการ และอุปกรณ์โสตทัศนูปกรณ์',
    iconName: 'FlaskConical',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentBg: 'bg-emerald-50 text-emerald-700',
    textColor: 'text-emerald-700',
  },
  {
    value: 'OTHER',
    label: 'อื่นๆ',
    description: 'โครงการและกิจกรรมบริการวิชาการด้านอื่นๆ ของคณะสังคมศาสตร์',
    iconName: 'FolderGit2',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    accentBg: 'bg-slate-50 text-slate-700',
    textColor: 'text-slate-700',
  },
];

export const ACADEMIC_SERVICE_STATUSES = [
  {
    value: 'ONGOING',
    label: 'กำลังดำเนินการ',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500 animate-pulse',
  },
  {
    value: 'COMPLETED',
    label: 'ดำเนินการเสร็จสิ้น',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
  },
  {
    value: 'RECRUITING',
    label: 'กำลังเปิดรับสมัคร/เข้าร่วม',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-500 animate-pulse',
  },
];

export const getServiceTypeLabel = (val: string) =>
  ACADEMIC_SERVICE_TYPES.find((t) => t.value === val)?.label || val;

export const getServiceTypeConfig = (val: string): ServiceTypeConfig => {
  const found = ACADEMIC_SERVICE_TYPES.find((t) => t.value === val);
  if (found) return found;
  return {
    value: val,
    label: val || 'บริการวิชาการ',
    description: 'งานบริการวิชาการ คณะสังคมศาสตร์',
    iconName: 'Sparkles',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    accentBg: 'bg-slate-50 text-slate-700',
    textColor: 'text-slate-700',
  };
};

export const getStatusConfig = (val: string) => {
  return (
    ACADEMIC_SERVICE_STATUSES.find((s) => s.value === val) || {
      value: val,
      label: val || 'กำลังดำเนินการ',
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
    }
  );
};

export const getStatusLabel = (val: string) => getStatusConfig(val).label;

export const getRoleLabel = (role: string) => {
  switch (role) {
    case 'LEADER':
      return 'หัวหน้าโครงการ';
    case 'CO_LEADER':
      return 'รองหัวหน้าโครงการ';
    case 'RESEARCHER':
      return 'นักวิจัย/วิทยากร';
    case 'MEMBER':
    default:
      return 'ผู้ร่วมโครงการ';
  }
};

export interface AcademicServiceConfig {
  id?: number;
  contactEmail: string;
  contactPhone: string;
  officeHours: string;
  officeLocation: string;
  responseTime: string;
  pdfFormUrl: string;
  docxFormUrl: string;
  updatedAt?: string;
}

export const DEFAULT_ACADEMIC_SERVICE_CONFIG: AcademicServiceConfig = {
  contactEmail: 'socialsciences@crru.ac.th',
  contactPhone: '0-5377-6000 ต่อ 1600',
  officeHours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)',
  officeLocation: 'สำนักงานคณบดี อาคาร 1 ชั้น 2 คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  responseTime: 'เจ้าหน้าที่จะติดต่อกลับภายใน 1-2 วันทำการ',
  pdfFormUrl: '/forms/academic-service-request.pdf',
  docxFormUrl: '/forms/academic-service-request.docx',
};

