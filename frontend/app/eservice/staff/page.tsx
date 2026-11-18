import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import {
  FALLBACK_STAFF_SERVICES,
  FALLBACK_STAFF_DOCS,
  fetchStaffServices,
  fetchStaffDocuments,
} from '@/lib/staff-services';
import StaffClient from './StaffClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'บริการสำหรับบุคลากร | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ศูนย์รวมระบบบริการดิจิทัลสำหรับคณาจารย์และบุคลากร (e-Office, HRMIS TOR, เงินเดือน, ทะเบียนอาจารย์) และคลังแบบฟอร์มคำร้องราชการ คณะสังคมศาสตร์ มรภ.เชียงราย',
  alternates: {
    canonical: '/eservice/staff',
  },
  openGraph: {
    title: 'บริการสำหรับบุคลากร | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description:
      'ศูนย์รวมระบบสารสนเทศการปฏิบัติราชการและคลังแบบฟอร์มคำร้องบุคลากร คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: '/eservice/staff',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

export default async function StaffServicePage() {
  let services = FALLBACK_STAFF_SERVICES;
  let documents = FALLBACK_STAFF_DOCS;

  try {
    const [servicesData, docsData] = await Promise.all([
      fetchStaffServices(),
      fetchStaffDocuments(),
    ]);
    if (servicesData && servicesData.length > 0) {
      services = servicesData;
    }
    if (docsData && docsData.length > 0) {
      documents = docsData;
    }
  } catch (err) {
    console.warn('StaffServicePage SSR fetch fallback used', err);
  }

  // Schema.org Structured Data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'บริการสำหรับบุคลากร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ศูนย์รวมระบบสารสนเทศสำหรับการปฏิบัติงานและคลังแบบฟอร์มคำร้องราชการสำหรับคณาจารย์และเจ้าหน้าที่ คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: 'https://soc.crru.ac.th/eservice/staff',
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    hasPart: services.map((s) => ({
      '@type': 'WebSite',
      name: s.title,
      description: s.description,
      url: s.url,
    })),
  };

  return (
    <div className="bg-stone-50/50 min-h-screen font-sans text-slate-800">
      <JsonLd data={jsonLdSchema} />
      <StaffClient
        initialServices={services}
        initialDocuments={documents}
      />
    </div>
  );
}
