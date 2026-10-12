import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import AcademicServiceRequestHub from '@/components/research/AcademicServiceRequestHub';

export const metadata: Metadata = {
  title: 'ศูนย์ประสานงานและขอรับบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ขั้นตอนการขอรับบริการวิชาการ ขอความอนุเคราะห์วิทยากร ดาวน์โหลดแบบฟอร์มคำขอ และช่องทางประสานงานด่วน คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/research/services/request',
  },
  openGraph: {
    title: 'ศูนย์ประสานงานและขอรับบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ขั้นตอนการขอรับบริการวิชาการ ขอความอนุเคราะห์วิทยากร ดาวน์โหลดแบบฟอร์มคำขอ และช่องทางประสานงานด่วน คณะสังคมศาสตร์',
    url: '/research/services/request',
    type: 'website',
    locale: 'th_TH',
  },
};

export default function AcademicServiceRequestPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800 pb-24">
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและนวัตกรรม', href: '/research' },
              { label: 'บริการวิชาการ', href: '/research/services' },
              { label: 'ขอรับบริการวิชาการ' },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Academic Service & Engagement Portal
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-4">
              ขอรับบริการวิชาการและวิทยากร
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              ศูนย์ประสานงานสำหรับองค์กรปกครองส่วนท้องถิ่น (อปท.) โรงเรียน ชุมชน และหน่วยงานทุกภาคส่วน
              ในการขอรับการถ่ายทอดองค์ความรู้ ขอความอนุเคราะห์วิทยากร หรือปรึกษาโครงการพัฒนาท้องถิ่น
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN REQUEST PORTAL CONTENT */}
      <main className="container mx-auto px-4 max-w-5xl -mt-6 relative z-10 space-y-8">
        {/* Full Secure Dual-Action Hub */}
        <AcademicServiceRequestHub />

        {/* Back Link */}
        <div className="pt-4 text-center">
          <Link
            href="/research/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-scholar-accent hover:border-scholar-accent text-sm font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้ารวมโครงการบริการวิชาการ
          </Link>
        </div>
      </main>
    </div>
  );
}
