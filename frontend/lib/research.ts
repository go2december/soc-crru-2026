export type ResearchProjectStatus = 'ONGOING' | 'COMPLETED' | 'PUBLISHED' | 'CANCELLED';
export type ResearchMemberRole = 'HEAD' | 'CO_RESEARCHER' | 'ADVISOR' | 'ASSISTANT' | 'EXTERNAL_EXPERT';

export interface ResearchStaffOption {
  id: string;
  prefixTh?: string | null;
  firstNameTh: string;
  lastNameTh: string;
  department?: string | null;
}

export interface ResearchProjectMember {
  id?: string;
  staffProfileId?: string;
  externalName?: string;
  role: ResearchMemberRole;
  sortOrder?: number;
  displayName?: string;
}

export interface ResearchProjectLocation {
  id?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  lat?: number;
  lng?: number;
}

export interface ResearchProjectOutput {
  id?: string;
  outputType?: string;
  title: string;
  journalName?: string;
  publicationDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  citation?: string;
  doiUrl?: string;
  tciUrl?: string;
  externalUrl?: string;
  tier?: string;
}

export interface ResearchProjectAttachment {
  id?: string;
  fileName: string;
  fileType?: string;
  fileUrl: string;
  downloadCount?: number;
  createdAt?: string;
}

export interface ResearchProjectAdminItem {
  id: string;
  slug: string;
  titleTh: string;
  year: number;
  fundingSource?: string | null;
  status: ResearchProjectStatus;
  isSocialService: boolean;
  isCommercial: boolean;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
  memberDisplay: string[];
  sdgIds: number[];
  attachmentCount: number;
  outputCount: number;
}

export interface ResearchProjectDetail {
  id: string;
  slug: string;
  titleTh: string;
  titleEn?: string | null;
  abstractTh?: string | null;
  abstractEn?: string | null;
  year: number;
  budget?: string | null;
  fundingSource?: string | null;
  status: ResearchProjectStatus;
  isSocialService: boolean;
  isCommercial: boolean;
  coverImageUrl?: string | null;
  keywords?: string[] | null;
  isPublished: boolean;
  publishedAt?: string | null;
  members: ResearchProjectMember[];
  locations: ResearchProjectLocation[];
  sdgIds: number[];
  outputs: ResearchProjectOutput[];
  attachments: ResearchProjectAttachment[];
}

export interface ResearchListResponse {
  data: ResearchProjectAdminItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const RESEARCH_STATUS_LABELS: Record<ResearchProjectStatus, string> = {
  ONGOING: 'กำลังดำเนินการ',
  COMPLETED: 'เสร็จสิ้น',
  PUBLISHED: 'เผยแพร่แล้ว',
  CANCELLED: 'ยกเลิก',
};

export const RESEARCH_MEMBER_ROLE_LABELS: Record<ResearchMemberRole, string> = {
  HEAD: 'หัวหน้าโครงการ',
  CO_RESEARCHER: 'ผู้ร่วมวิจัย',
  ADVISOR: 'ที่ปรึกษา',
  ASSISTANT: 'ผู้ช่วยวิจัย',
  EXTERNAL_EXPERT: 'ผู้เชี่ยวชาญภายนอก',
};

export const RESEARCH_SDG_DESCRIPTIONS: Record<number, { title: string; description: string }> = {
  1: { title: 'ขจัดความยากจน', description: 'ยุติความยากจนทุกรูปแบบในทุกพื้นที่ และลดความเปราะบางของกลุ่มเป้าหมาย.' },
  2: { title: 'ขจัดความหิวโหย', description: 'สร้างความมั่นคงทางอาหาร ส่งเสริมโภชนาการที่ดี และสนับสนุนเกษตรกรรมที่ยั่งยืน.' },
  3: { title: 'สุขภาพและความเป็นอยู่ที่ดี', description: 'รับประกันการมีสุขภาพที่ดีและส่งเสริมความเป็นอยู่ที่ดีของคนทุกช่วงวัย.' },
  4: { title: 'การศึกษาที่มีคุณภาพ', description: 'สร้างหลักประกันการศึกษาที่มีคุณภาพอย่างทั่วถึง เท่าเทียม และส่งเสริมการเรียนรู้ตลอดชีวิต.' },
  5: { title: 'ความเท่าเทียมทางเพศ', description: 'บรรลุความเสมอภาคระหว่างเพศและเสริมพลังให้สตรีและเด็กหญิงทุกคน.' },
  6: { title: 'น้ำสะอาดและการสุขาภิบาล', description: 'จัดการน้ำและสุขาภิบาลอย่างยั่งยืนและให้ทุกคนเข้าถึงได้.' },
  7: { title: 'พลังงานสะอาดที่ทุกคนเข้าถึงได้', description: 'สร้างหลักประกันการเข้าถึงพลังงานที่ทันสมัย ยั่งยืน เชื่อถือได้ และมีราคาที่เหมาะสม.' },
  8: { title: 'งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ', description: 'ส่งเสริมการเติบโตทางเศรษฐกิจที่ยั่งยืน การจ้างงานเต็มที่ และงานที่มีคุณค่าสำหรับทุกคน.' },
  9: { title: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน', description: 'พัฒนาโครงสร้างพื้นฐานที่ยืดหยุ่น ส่งเสริมอุตสาหกรรมที่ครอบคลุม และสนับสนุนนวัตกรรม.' },
  10: { title: 'ลดความเหลื่อมล้ำ', description: 'ลดความไม่เสมอภาคภายในประเทศและระหว่างประเทศ.' },
  11: { title: 'เมืองและชุมชนที่ยั่งยืน', description: 'ทำให้เมืองและถิ่นฐานมนุษย์มีความครอบคลุม ปลอดภัย ยืดหยุ่น และยั่งยืน.' },
  12: { title: 'การผลิตและการบริโภคที่ยั่งยืน', description: 'ส่งเสริมแบบแผนการผลิตและการบริโภคที่ยั่งยืนและใช้ทรัพยากรอย่างมีประสิทธิภาพ.' },
  13: { title: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ', description: 'ดำเนินการอย่างเร่งด่วนเพื่อต่อสู้กับการเปลี่ยนแปลงสภาพภูมิอากาศและผลกระทบที่เกิดขึ้น.' },
  14: { title: 'ทรัพยากรทางทะเล', description: 'อนุรักษ์และใช้ประโยชน์จากมหาสมุทร ทะเล และทรัพยากรทางทะเลอย่างยั่งยืน.' },
  15: { title: 'ระบบนิเวศบนบก', description: 'ปกป้อง ฟื้นฟู และใช้ประโยชน์จากระบบนิเวศบนบกอย่างยั่งยืน และยุติการสูญเสียความหลากหลายทางชีวภาพ.' },
  16: { title: 'สันติภาพ ความยุติธรรม และสถาบันที่เข้มแข็ง', description: 'ส่งเสริมสังคมที่สงบสุข เข้าถึงความยุติธรรม และสร้างสถาบันที่มีประสิทธิภาพ โปร่งใส และครอบคลุม.' },
  17: { title: 'หุ้นส่วนเพื่อการพัฒนาที่ยั่งยืน', description: 'เสริมความแข็งแกร่งของกลไกการดำเนินงานและฟื้นฟูความเป็นหุ้นส่วนระดับโลกเพื่อการพัฒนาที่ยั่งยืน.' },
};

export const RESEARCH_STATUS_STYLES: Record<ResearchProjectStatus, string> = {
  ONGOING: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PUBLISHED: 'bg-violet-50 text-violet-700 border-violet-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function getResearchStatusOptions(): ResearchProjectStatus[] {
  return ['ONGOING', 'COMPLETED', 'PUBLISHED', 'CANCELLED'];
}

export function getResearchMemberRoleOptions(): ResearchMemberRole[] {
  return ['HEAD', 'CO_RESEARCHER', 'ADVISOR', 'ASSISTANT', 'EXTERNAL_EXPERT'];
}

export function formatResearchStaffName(staff?: ResearchStaffOption | null): string {
  if (!staff) return '';
  return [staff.prefixTh, staff.firstNameTh, staff.lastNameTh].filter(Boolean).join(' ').trim();
}

export function getResearchPublicAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}${url}`;
  }
  return url;
}

export function getResearchServerAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/')) {
    const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    return `${baseUrl}${url}`;
  }
  return url;
}

export async function fetchResearchBySlug(slug: string): Promise<ResearchProjectDetail | null> {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  try {
    const res = await fetch(`${apiUrl}/api/research/projects/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    return (await res.json()) as ResearchProjectDetail;
  } catch (error) {
    console.error('Error fetching research project by slug:', error);
    return null;
  }
}

export async function fetchResearchList(params?: {
  q?: string;
  year?: string | number;
  status?: string;
  sdg?: string | number;
  page?: string | number;
  limit?: string | number;
}): Promise<ResearchListResponse> {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  try {
    const searchParams = new URLSearchParams();

    if (params?.q) searchParams.set('q', String(params.q));
    if (params?.year) searchParams.set('year', String(params.year));
    if (params?.status) searchParams.set('status', String(params.status));
    if (params?.sdg) searchParams.set('sdg', String(params.sdg));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const res = await fetch(`${apiUrl}/api/research/projects${queryString ? `?${queryString}` : ''}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }

    return (await res.json()) as ResearchListResponse;
  } catch (error) {
    console.error('Error fetching research list:', error);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}
