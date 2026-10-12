import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { AcademicServiceItem } from '@/lib/academic-services';
import { getApiBaseUrl } from '@/lib/api-config';
import AcademicServicesClient from './AcademicServicesClient';

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

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800 pb-20">
      {/* 1. HERO HEADER (Scholar Deep Authority Theme) */}
      <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและนวัตกรรม', href: '/research' },
              { label: 'บริการวิชาการแก่สังคม' },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse" />
              Social Engagement & Academic Services
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-4">
              บริการวิชาการแก่สังคม
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              &ldquo;พันธกิจสัมพันธ์เพื่อสังคม&rdquo; นำองค์ความรู้ทางสังคมศาสตร์สู่ชุมชนท้องถิ่น
              ร่วมสร้างสรรค์การพัฒนาที่ยั่งยืน ยกระดับคุณภาพชีวิต และเสริมสร้างความเข้มแข็งแก่ชุมชนภาคเหนือ
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10">
        <AcademicServicesClient initialProjects={projects} />
      </main>
    </div>
  );
}
