export const MOU_PARTNER_TYPES = [
  { value: 'GOVERNMENT', label: 'ภาครัฐและองค์กรปกครองส่วนท้องถิ่น', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'COMMUNITY', label: 'ภาคประชาสังคมและชุมชน', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'ACADEMIC', label: 'สถาบันการศึกษาและนานาชาติ', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'PRIVATE', label: 'ภาคเอกชนและวิสาหกิจชุมชน', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
] as const;

export type MouPartnerType = (typeof MOU_PARTNER_TYPES)[number]['value'];

export interface MouItem {
  id: string;
  title: string;
  partnerName: string;
  partnerType: MouPartnerType;
  partnerLogoUrl?: string | null;
  scope?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  documentUrl?: string | null;
  websiteUrl?: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function getPartnerTypeConfig(type: string) {
  const found = MOU_PARTNER_TYPES.find((t) => t.value === type);
  return (
    found || {
      value: type,
      label: type,
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    }
  );
}
