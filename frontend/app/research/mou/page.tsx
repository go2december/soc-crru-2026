import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { MouItem } from '@/lib/mous';
import { getApiBaseUrl } from '@/lib/api-config';
import MouClient from './MouClient';

export const metadata: Metadata = {
  title: 'เครือข่ายความร่วมมือและ MOU | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ภาคีเครือข่ายความร่วมมือทางวิชาการและการพัฒนาสังคม (MOU & Partnerships) ระหว่างคณะสังคมศาสตร์ มรภ.เชียงราย กับหน่วยงานภาครัฐ ประชาสังคม องค์กรชุมชน และสถาบันการศึกษาทั้งในและต่างประเทศ',
  alternates: {
    canonical: '/research/mou',
  },
  openGraph: {
    title: 'เครือข่ายความร่วมมือและ MOU | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description:
      'รวมบันทึกข้อตกลงความร่วมมือ (MOU) และภาคีเครือข่ายขับเคลื่อนการพัฒนาท้องถิ่น',
    url: '/research/mou',
    type: 'website',
    locale: 'th_TH',
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

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800 pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและบริการวิชาการ', href: '/research' },
              { label: 'เครือข่ายความร่วมมือและ MOU' },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse" />
              Partnerships & Cooperation
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-4">
              เครือข่ายความร่วมมือและ MOU
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              ประสานพลังความร่วมมือระหว่างคณะสังคมศาสตร์กับหน่วยงานภาครัฐ ภาคประชาสังคม
              สถาบันการศึกษา และภาคเอกชน ทั้งในระดับท้องถิ่นและสากล เพื่อบูรณาการการศึกษา วิจัย
              และการบริการวิชาการเพื่อพัฒนาชุมชนอย่างยั่งยืน
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CLIENT CONTENT */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10">
        <MouClient initialItems={mous} />
      </main>
    </div>
  );
}
