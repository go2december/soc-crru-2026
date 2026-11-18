import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { MouItem } from '@/lib/mous';
import { getApiBaseUrl } from '@/lib/api-config';
import MouClient from './MouClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'เครือข่ายความร่วมมือและ MOU | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ภาคีเครือข่ายความร่วมมือทางวิชาการและการพัฒนาสังคม (MOU & Partnerships) ระหว่างคณะสังคมศาสตร์ มรภ.เชียงราย กับหน่วยงานภาครัฐ ประชาสังคม องค์กรชุมชน และสถาบันการศึกษาทั้งในและต่างประเทศ',
  alternates: {
    canonical: '/research/mou',
  },
  openGraph: {
    title: 'เครือข่ายความร่วมมือและ MOU | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'รวมบันทึกข้อตกลงความร่วมมือ (MOU) และภาคีเครือข่ายขับเคลื่อนการพัฒนาท้องถิ่น คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: '/research/mou',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

const API_URL = getApiBaseUrl();

async function getMous(): Promise<MouItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/mous`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch mous:', error);
    return [];
  }
}

export default async function MouPage() {
  const mous = await getMous();

  // Structured Data Schema for Webometrics & Google Research Directory
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'เครือข่ายความร่วมมือและ MOU คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'รวมบันทึกข้อตกลงความร่วมมือทางวิชาการ การวิจัย และการบริการวิชาการเพื่อพัฒนาท้องถิ่น',
    url: 'https://soc.crru.ac.th/research/mou',
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    about: mous.slice(0, 15).map((m) => ({
      '@type': 'Organization',
      name: m.partnerName,
      description: m.title,
      url: m.websiteUrl || undefined,
    })),
  };

  return (
    <div className="bg-stone-50/50 min-h-screen font-sans text-slate-800">
      <JsonLd data={jsonLdSchema} />
      <MouClient initialItems={mous} />
    </div>
  );
}
