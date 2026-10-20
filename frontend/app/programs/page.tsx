import { fetchPrograms } from '@/lib/api';
import Breadcrumb from '@/components/Breadcrumb';
import ProgramsExplorerClient from '@/components/ProgramsExplorerClient';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  PhoneCall, 
  ExternalLink
} from 'lucide-react';

interface Props {
  searchParams: Promise<{
    level?: string;
  }>;
}

export default async function ProgramsPage(props: Props) {
  const searchParams = await props.searchParams;
  const levelFilter = searchParams.level;

  // Fetch all active programs from database
  const allPrograms = await fetchPrograms();

  const bachelorCount = allPrograms.filter(p => p.degreeLevel === 'BACHELOR').length;
  const masterCount = allPrograms.filter(p => p.degreeLevel === 'MASTER').length;
  const doctoralCount = allPrograms.filter(p => p.degreeLevel === 'DOCTORAL' || p.degreeLevel === 'PHD').length;

  return (
    <div className="bg-white font-sans text-scholar-text min-h-screen">
      {/* =========================================================================
          1. HERO HEADER: Accurate & Factual Institutional Header
          ========================================================================= */}
      <header className="relative py-14 sm:py-16 bg-scholar-deep overflow-hidden border-b-4 border-scholar-gold">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <span className="inline-block px-3 py-1 bg-white/10 text-scholar-gold text-xs font-semibold uppercase tracking-wider rounded-sm mb-3 border border-scholar-gold/30">
            ACADEMIC PROGRAMS • คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-heading">
            หลักสูตรการศึกษา
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-6">
            ข้อมูลหลักสูตรระดับปริญญาตรี และระดับบัณฑิตศึกษา (ปริญญาโท-ปริญญาเอก) 
            ที่เปิดสอนตามมาตรฐานคุณวุฒิระดับอุดมศึกษา
          </p>

          {/* Factual Program Breakdown Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-sm text-xs text-gray-300">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-scholar-gold" />
              <span>หลักสูตรทั้งหมด <strong>{allPrograms.length}</strong> หลักสูตร</span>
            </span>
            <span className="text-white/30">•</span>
            <span>ปริญญาตรี <strong>{bachelorCount}</strong> สาขาวิชา</span>
            <span className="text-white/30">•</span>
            <span>ปริญญาโท <strong>{masterCount}</strong> สาขาวิชา</span>
            <span className="text-white/30">•</span>
            <span>ปริญญาเอก <strong>{doctoralCount}</strong> สาขาวิชา</span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ADMISSION LINK STRIP: Direct links to official CRRU portals
          ========================================================================= */}
      <section className="bg-scholar-soft border-b border-gray-200">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-200 p-3.5 rounded-sm">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-scholar-accent shrink-0" />
              <div>
                <span className="text-xs font-bold text-scholar-deep block">
                  การรับสมัครนักศึกษาใหม่
                </span>
                <span className="text-[11px] text-gray-500">
                  ตรวจสอบกำหนดการ คุณสมบัติ และยื่นสมัครผ่านระบบรับสมัครของมหาวิทยาลัยราชภัฏเชียงราย
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <a
                href="https://admission.crru.ac.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1 text-center justify-center flex-1 sm:flex-initial"
              >
                <span>รับสมัคร ปริญญาตรี</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://orasis.crru.ac.th/gds_crru/index.php/main/home"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-scholar-deep hover:bg-scholar-deep/90 text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1 text-center justify-center flex-1 sm:flex-initial"
              >
                <span>รับสมัคร ป.โท-เอก</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN CONTENT: Breadcrumb & Programs Explorer
          ========================================================================= */}
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'หลักสูตรทั้งหมด', href: '/programs' }]} />

        <div className="mt-6">
          <ProgramsExplorerClient programs={allPrograms} initialLevel={levelFilter} />
        </div>
      </main>

      {/* =========================================================================
          4. OFFICIAL CONTACT FOOTNOTE: Factual Inquiry Info
          ========================================================================= */}
      <section className="py-10 bg-scholar-soft border-t border-gray-200 mt-12 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <PhoneCall className="w-5 h-5 text-scholar-gold mx-auto mb-2" />
          <h2 className="text-base font-bold text-scholar-deep mb-1">
            ต้องการข้อมูลหลักสูตรเพิ่มเติม
          </h2>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            ติดต่อกลุ่มงานบริหารวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย<br />
            โทรศัพท์: 0-5377-6000 ต่อ คณะสังคมศาสตร์ หรือส่งข้อความผ่านแบบฟอร์มติดต่อ
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-white border border-scholar-deep text-scholar-deep font-semibold text-xs rounded-sm hover:bg-scholar-deep hover:text-white transition-all shadow-sm"
          >
            <span>ข้อมูลติดต่อและแผนที่คณะ</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
