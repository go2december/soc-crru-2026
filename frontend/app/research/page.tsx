import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import ResearchHeroSearch from '@/components/research/ResearchHeroSearch';
import ResearchStatsBar from '@/components/research/ResearchStatsBar';
import ResearchPillarsGrid from '@/components/research/ResearchPillarsGrid';
import ResearchFeaturedGrid from '@/components/research/ResearchFeaturedGrid';
import ResearchSdgMatrix from '@/components/research/ResearchSdgMatrix';
import ResearchCallToAction from '@/components/research/ResearchCallToAction';
import { fetchResearchStats, fetchResearchList } from '@/lib/research';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'ศูนย์วิจัยและบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ศูนย์รวมงานวิจัย วารสารวิชาการระดับชาติ (ThaiJO) บริการวิชาการเพื่อสังคม และเครือข่ายความร่วมมือ MOU คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/research',
  },
  openGraph: {
    title: 'ศูนย์วิจัยและบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'สืบค้นผลงานวิจัย วารสารสังคมศาสตร์วิชาการ โครงการบริการวิชาการเพื่อชุมชน และเครือข่ายความร่วมมือทางวิชาการ',
    url: '/research',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

export default async function ResearchHubPage() {
  // Fetch real dynamic research statistics and latest publications in parallel
  const [stats, featuredResponse] = await Promise.all([
    fetchResearchStats(),
    fetchResearchList({ limit: 4, status: 'PUBLISHED' }),
  ]);

  const featuredProjects = featuredResponse?.data || [];

  // Structured Data Schema for Webometrics & Google Academic
  const researchSchema = {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: 'ศูนย์วิจัยและบริการวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternateName: 'Research and Academic Services Center, Faculty of Social Sciences, CRRU',
    url: 'https://soc.crru.ac.th/research',
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://www.crru.ac.th',
    },
    description:
      'ศูนย์รวมการวิจัยทางสังคมศาสตร์ พัฒนาท้องถิ่น วารสารวิชาการระดับชาติ และการบริการวิชาการเพื่อยกระดับคุณภาพชีวิตชุมชนภาคเหนือตอนบน',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Chiang Rai and Upper Northern Thailand',
    },
  };

  return (
    <div className="bg-slate-50/60 min-h-screen font-sans text-slate-800">
      <JsonLd data={researchSchema} />

      {/* Hero Section with Editorial Lanna Palette */}
      <section className="relative bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-slate-900 text-white pt-24 pb-20 overflow-hidden border-b border-slate-800">
        {/* Subtle geometric dot pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'ศูนย์วิจัยและบริการวิชาการ' },
            ]}
          />

          <div className="max-w-3xl mt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Research, Innovation & Academic Services</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-6">
              งานวิจัย นวัตกรรม และบริการวิชาการ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
                เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน
              </span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              บูรณาการองค์ความรู้ทางสังคมศาสตร์เพื่อตอบสนองการเปลี่ยนแปลงของสังคม สร้างสรรค์งานวิจัยที่มีผลกระทบสูง 
              เผยแพร่ผลงานสู่เวทีวิชาการสากล และขับเคลื่อนคุณภาพชีวิตชุมชนท้องถิ่นจังหวัดเชียงรายและอนุภูมิภาคลุ่มน้ำโขง
            </p>

            {/* Interactive Hero Search Component */}
            <ResearchHeroSearch />
          </div>

          {/* Dynamic Research Stats Bar */}
          <ResearchStatsBar stats={stats} />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pb-24">
        {/* 4 Pillars of Research Ecosystem */}
        <ResearchPillarsGrid />

        {/* Dynamic Featured Research Section */}
        <ResearchFeaturedGrid projects={featuredProjects} />

        {/* UN SDGs Matrix Showcase */}
        <ResearchSdgMatrix />

        {/* Call-to-Action for Faculty, Partners & Researchers */}
        <ResearchCallToAction />
      </main>
    </div>
  );
}
