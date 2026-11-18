import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import {
  fetchProcurementList,
} from '@/lib/procurement';
import ProcurementClient from './ProcurementClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ประกาศจัดซื้อจัดจ้างและพัสดุ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ศูนย์ข้อมูลการจัดซื้อจัดจ้าง แผนการจัดหาพัสดุ ประกาศผู้ชนะการเสนอราคา และความโปร่งใส คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/eservice/procurement',
  },
  openGraph: {
    title: 'ประกาศจัดซื้อจัดจ้างและพัสดุ | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description:
      'ศูนย์ข้อมูลการจัดซื้อจัดจ้าง แผนการจัดหาพัสดุ ประกาศผู้ชนะการเสนอราคา และความโปร่งใส คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    url: '/eservice/procurement',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProcurementPublicPage(props: Props) {
  const resolvedParams = await props.searchParams;
  const currentYear = resolvedParams.year ? parseInt(resolvedParams.year as string, 10) : undefined;
  const currentType = (resolvedParams.type as string) || undefined;
  const currentCategory = (resolvedParams.category as string) || undefined;
  const currentStatus = (resolvedParams.status as string) || undefined;
  const currentSearch = (resolvedParams.q as string) || undefined;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;

  const { data: records, meta } = await fetchProcurementList({
    fiscalYear: currentYear,
    procurementType: currentType,
    category: currentCategory,
    status: currentStatus,
    search: currentSearch,
    page: currentPage,
    limit: 15,
  });

  const totalBudget = records.reduce(
    (acc, curr) => acc + (parseFloat(curr.budget as string) || 0),
    0
  );
  const completedCount = records.filter((r) => r.status === 'COMPLETED').length;

  const currentBE = new Date().getFullYear() + 543;
  const fiscalYears = [currentBE, currentBE - 1, currentBE - 2, currentBE - 3];

  // Schema.org Structured Data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ประกาศจัดซื้อจัดจ้างและพัสดุ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ศูนย์ข้อมูลข่าวสารด้านการจัดซื้อจัดจ้าง แผนการจัดหาพัสดุ ขอบเขตงาน (TOR) และประกาศผลผู้ชนะ คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: 'https://soc.crru.ac.th/eservice/procurement',
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    hasPart: records.map((r) => ({
      '@type': 'Action',
      name: r.title,
      description: `ปีงบประมาณ ${r.fiscalYear} วงเงิน ${r.budget} บาท`,
      url: `https://soc.crru.ac.th/eservice/procurement/${r.id}`,
    })),
  };

  return (
    <div className="bg-stone-50/50 min-h-screen font-sans text-slate-800">
      <JsonLd data={jsonLdSchema} />
      <ProcurementClient
        records={records}
        meta={meta}
        totalBudget={totalBudget}
        completedCount={completedCount}
        fiscalYears={fiscalYears}
        currentYear={currentYear}
        currentType={currentType}
        currentCategory={currentCategory}
        currentStatus={currentStatus}
        currentSearch={currentSearch}
      />
    </div>
  );
}
