export interface AcademicServiceItem {
  id: string;
  title: string;
  description: string | null;
  serviceType: string;
  area: string | null;
  status: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ACADEMIC_SERVICE_TYPES = [
  { value: 'SOCIAL_SERVICE', label: 'บริการเพื่อสังคม' },
  { value: 'CONSULTING', label: 'ที่ปรึกษาวิจัยและนวัตกรรม' },
  { value: 'SOCIAL_LAB', label: 'บริการห้องปฏิบัติการ (Social Lab)' },
  { value: 'OTHER', label: 'อื่นๆ' }
];

export const ACADEMIC_SERVICE_STATUSES = [
  { value: 'ONGOING', label: 'กำลังดำเนินการ' },
  { value: 'COMPLETED', label: 'ดำเนินการเสร็จสิ้น' },
  { value: 'RECRUITING', label: 'กำลังเปิดรับสมัคร' },
];

export const getServiceTypeLabel = (val: string) => ACADEMIC_SERVICE_TYPES.find(t => t.value === val)?.label || val;
export const getStatusLabel = (val: string) => ACADEMIC_SERVICE_STATUSES.find(s => s.value === val)?.label || val;
