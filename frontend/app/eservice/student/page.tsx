import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import {
  FALLBACK_STUDENT_SERVICES,
  FALLBACK_STUDENT_DOCS,
  fetchStudentServices,
  fetchStudentDocuments,
} from '@/lib/student-services';
import StudentClient from './StudentClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'บริการสำหรับนักศึกษา | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ศูนย์รวมระบบบริการดิจิทัลสำหรับนักศึกษา มรภ.เชียงราย (REG, ORASIS, LMS, WiFi) และคลังแบบฟอร์มคำร้องทางการของคณะสังคมศาสตร์',
  alternates: {
    canonical: '/eservice/student',
  },
  openGraph: {
    title: 'บริการสำหรับนักศึกษา | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description:
      'ศูนย์รวมลิงก์ระบบสารสนเทศนักศึกษา มรภ.เชียงราย และคลังแบบฟอร์มคำร้องคณะสังคมศาสตร์',
    url: '/eservice/student',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

export default async function StudentServicesPage() {
  let services = FALLBACK_STUDENT_SERVICES;
  let documents = FALLBACK_STUDENT_DOCS;

  try {
    const [servicesData, docsData] = await Promise.all([
      fetchStudentServices(),
      fetchStudentDocuments(),
    ]);
    if (servicesData && servicesData.length > 0) {
      services = servicesData;
    }
    if (docsData && docsData.length > 0) {
      documents = docsData;
    }
  } catch (err) {
    console.warn('StudentServicesPage SSR fetch fallback used', err);
  }

  // Schema.org Structured Data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'บริการสำหรับนักศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ศูนย์รวมระบบบริการดิจิทัลสำหรับนักศึกษาและคลังแบบฟอร์มคำร้องทางการ คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: 'https://soc.crru.ac.th/eservice/student',
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
      <StudentClient
        initialServices={services}
        initialDocuments={documents}
      />
    </div>
  );
}
