export const MOU_PARTNER_TYPES = [
  { value: 'GOVERNMENT', label: 'ภาครัฐและองค์กรปกครองส่วนท้องถิ่น', badgeColor: 'bg-sky-50 text-sky-800 border-sky-200' },
  { value: 'COMMUNITY', label: 'ภาคประชาสังคมและชุมชน', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { value: 'ACADEMIC', label: 'สถาบันการศึกษาและนานาชาติ', badgeColor: 'bg-stone-100 text-stone-800 border-stone-300' },
  { value: 'PRIVATE', label: 'ภาคเอกชนและวิสาหกิจชุมชน', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
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
