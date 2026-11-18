import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { AcademicServiceItem } from '@/lib/academic-services';
import { getApiBaseUrl } from '@/lib/api-config';
import AcademicServicesClient from './AcademicServicesClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'บริการวิชาการแก่สังคม | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'พันธกิจสัมพันธ์เพื่อสังคม (Social Engagement) ถ่ายทอดองค์ความรู้ ขับเคลื่อนการพัฒนาท้องถิ่น คลินิกวิจัย และห้องปฏิบัติการทางสังคมศาสตร์ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/research/services',
  },
  openGraph: {
    title: 'บริการวิชาการแก่สังคม | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'พันธกิจสัมพันธ์เพื่อสังคม นำองค์ความรู้สู่ชุมชนเพื่อการพัฒนาที่ยั่งยืน คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    url: '/research/services',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

const API_URL = getApiBaseUrl();

async function getServices(): Promise<AcademicServiceItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/academic-services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch academic services:', error);
    return [];
  }
}

export default async function AcademicServicesPage() {
  const projects = await getServices();

  // Structured Data Schema for Webometrics & Google Search
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'บริการวิชาการแก่สังคม คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'พันธกิจสัมพันธ์เพื่อสังคม ถ่ายทอดองค์ความรู้และงานวิจัยสู่ชุมชนท้องถิ่น คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: 'https://soc.crru.ac.th/research/services',
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    hasPart: projects.slice(0, 10).map((p) => ({
      '@type': 'ResearchProject',
      name: p.title,
      description: p.description || '',
      url: `https://soc.crru.ac.th/research/services/${p.id}`,
      areaServed: p.area || 'จังหวัดเชียงราย',
    })),
  };

  return (
    <div className="bg-stone-50/50 min-h-screen font-sans text-slate-800">
      <JsonLd data={jsonLdSchema} />
      <AcademicServicesClient initialProjects={projects} />
    </div>
  );
}
