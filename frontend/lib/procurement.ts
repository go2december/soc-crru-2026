export type ProcurementType = 'PRICE_CHECK' | 'SPECIFIC_METHOD' | 'E_BIDDING' | 'E_MARKET';
export type ProcurementCategory = 'GOODS' | 'EQUIPMENT' | 'CONSTRUCTION' | 'SERVICE';
export type ProcurementStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProcurementDocType = 'TOR' | 'ANNOUNCEMENT' | 'RESULT' | 'CONTRACT' | 'RECEIPT' | 'OTHER';

export interface ProcurementDocument {
  id: string;
  procurementId: string;
  documentType: ProcurementDocType;
  title: string;
  fileUrl?: string | null;
  externalUrl?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProcurementRecord {
  id: string;
  fiscalYear: number;
  title: string;
  procurementType: ProcurementType;
  category: ProcurementCategory;
  budget: string | number;
  contractAmount?: string | number | null;
  vendorName?: string | null;
  approvedAt?: string | null;
  completedAt?: string | null;
  status: ProcurementStatus;
  isPublished: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  documents?: ProcurementDocument[];
}

export interface ProcurementListResponse {
  data: ProcurementRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const PROCUREMENT_TYPES: { value: ProcurementType; label: string; shortLabel: string }[] = [
  { value: 'PRICE_CHECK', label: 'ตรวจสอบราคา / สอบราคา', shortLabel: 'สอบราคา' },
  { value: 'SPECIFIC_METHOD', label: 'เฉพาะเจาะจง', shortLabel: 'เฉพาะเจาะจง' },
  { value: 'E_BIDDING', label: 'ประกวดราคาอิเล็กทรอนิกส์ (e-Bidding)', shortLabel: 'e-Bidding' },
  { value: 'E_MARKET', label: 'ตลาดอิเล็กทรอนิกส์ (e-Market)', shortLabel: 'e-Market' },
];

export const PROCUREMENT_CATEGORIES: { value: ProcurementCategory; label: string; icon: string }[] = [
  { value: 'GOODS', label: 'ซื้อ / จัดซื้อพัสดุ', icon: '📦' },
  { value: 'EQUIPMENT', label: 'จัดซื้อครุภัณฑ์', icon: '🖥️' },
  { value: 'CONSTRUCTION', label: 'จ้างก่อสร้าง / ปรับปรุงอาคาร', icon: '🏗️' },
  { value: 'SERVICE', label: 'จ้างบริการ / จ้างเหมา / ที่ปรึกษา', icon: '🛠️' },
];

export const PROCUREMENT_STATUSES: {
  value: ProcurementStatus;
  label: string;
  colorClass: string;
  badgeClass: string;
}[] = [
  {
    value: 'PLANNING',
    label: 'จัดทำแผน / ร่าง TOR',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    badgeClass: 'badge-warning',
  },
  {
    value: 'IN_PROGRESS',
    label: 'อยู่ระหว่างดำเนินการ / ประกาศ',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
    badgeClass: 'badge-info',
  },
  {
    value: 'COMPLETED',
    label: 'สิ้นสุด / ส่งมอบเรียบร้อย',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeClass: 'badge-success',
  },
  {
    value: 'CANCELLED',
    label: 'ยกเลิก',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    badgeClass: 'badge-error',
  },
];

export const PROCUREMENT_DOC_TYPES: { value: ProcurementDocType; label: string; badge: string }[] = [
  { value: 'TOR', label: 'ขอบเขตงาน / ร่าง TOR', badge: 'TOR' },
  { value: 'ANNOUNCEMENT', label: 'ประกาศจัดซื้อจัดจ้าง', badge: 'ประกาศ' },
  { value: 'RESULT', label: 'ประกาศผลผู้ชนะ / ผู้ได้รับการคัดเลือก', badge: 'ผลคัดเลือก' },
  { value: 'CONTRACT', label: 'สัญญา / สาระสำคัญของสัญญา', badge: 'สัญญา' },
  { value: 'RECEIPT', label: 'เอกสารการตรวจรับพัสดุ', badge: 'ตรวจรับ' },
  { value: 'OTHER', label: 'เอกสารอื่นๆ ที่เกี่ยวข้อง', badge: 'เอกสาร' },
];

export const getProcurementTypeLabel = (val: string) =>
  PROCUREMENT_TYPES.find((t) => t.value === val)?.label || val;

export const getProcurementCategoryLabel = (val: string) =>
  PROCUREMENT_CATEGORIES.find((c) => c.value === val)?.label || val;

export const getProcurementStatusInfo = (val: string) =>
  PROCUREMENT_STATUSES.find((s) => s.value === val) || {
    value: val,
    label: val,
    colorClass: 'text-slate-700 bg-slate-50 border-slate-200',
    badgeClass: 'badge-ghost',
  };

export const getProcurementDocTypeLabel = (val: string) =>
  PROCUREMENT_DOC_TYPES.find((d) => d.value === val)?.label || val;

export const formatThaiBaht = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '-';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatThaiDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export function getProcurementFileUrl(url?: string | null): string {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const publicUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${publicUrl}${url}`;
}

export async function fetchProcurementList(params: {
  fiscalYear?: number;
  procurementType?: string;
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ProcurementListResponse> {
  const isServer = typeof window === 'undefined';
  const apiUrl = isServer
    ? process.env.INTERNAL_API_URL || 'http://localhost:4201'
    : process.env.NEXT_PUBLIC_API_URL || '';

  const queryParams = new URLSearchParams();
  if (params.fiscalYear) queryParams.append('fiscalYear', params.fiscalYear.toString());
  if (params.procurementType) queryParams.append('procurementType', params.procurementType);
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  try {
    const res = await fetch(`${apiUrl}/api/procurement${queryString}`, { cache: 'no-store' });
    if (!res.ok) {
      return { data: [], meta: { total: 0, page: 1, limit: params.limit || 10, totalPages: 1 } };
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching procurement list:', error);
    return { data: [], meta: { total: 0, page: 1, limit: params.limit || 10, totalPages: 1 } };
  }
}

export async function fetchProcurementById(id: string): Promise<ProcurementRecord | null> {
  const isServer = typeof window === 'undefined';
  const apiUrl = isServer
    ? process.env.INTERNAL_API_URL || 'http://localhost:4201'
    : process.env.NEXT_PUBLIC_API_URL || '';

  try {
    const res = await fetch(`${apiUrl}/api/procurement/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching procurement by id (${id}):`, error);
    return null;
  }
}

