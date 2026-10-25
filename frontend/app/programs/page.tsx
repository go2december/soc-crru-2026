import { fetchPrograms } from '@/lib/api';
import Breadcrumb from '@/components/Breadcrumb';
import ProgramsExplorerClient from '@/components/ProgramsExplorerClient';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  PhoneCall, 
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{
    level?: string;
  }>;
}

export const metadata = {
  title: 'หลักสูตรการศึกษา | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description: 'ข้อมูลหลักสูตรระดับปริญญาตรี ปริญญาโท และปริญญาเอก คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ครอบคลุมทั้งภูมิศาสตร์ นวัตกรรมการพัฒนาสังคม จิตวิทยาสังคม คหกรรมศาสตร์ และยุทธศาสตร์การพัฒนาภูมิภาค',
};

export default async function ProgramsPage(props: Props) {
  const searchParams = await props.searchParams;
  const levelFilter = searchParams.level;

  // Fetch all active programs from database
  const allPrograms = await fetchPrograms();

  const bachelorCount = allPrograms.filter(p => p.degreeLevel === 'BACHELOR').length;
  const masterCount = allPrograms.filter(p => p.degreeLevel === 'MASTER').length;
  const doctoralCount = allPrograms.filter(p => p.degreeLevel === 'DOCTORAL' || p.degreeLevel === 'PHD').length;

  return (
    <div className="bg-slate-50/50 font-sans text-scholar-text min-h-screen">
      {/* =========================================================================
          1. HERO HEADER: Accurate & Factual Institutional Header with Scholar Aesthetic
          ========================================================================= */}
      <header className="relative py-14 sm:py-16 bg-scholar-deep overflow-hidden border-b-4 border-scholar-gold shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge 
            variant="outline" 
            className="bg-white/10 text-amber-300 border-amber-400/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-3.5 backdrop-blur-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1.5" />
            ACADEMIC PROGRAMS • คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3.5 font-heading tracking-tight">
            หลักสูตรการศึกษา
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-light mb-6">
            ข้อมูลหลักสูตรระดับปริญญาตรี และระดับบัณฑิตศึกษา (ปริญญาโท-ปริญญาเอก) 
            ที่เปิดสอนตามมาตรฐานคุณวุฒิระดับอุดมศึกษา มุ่งผลิตบัณฑิตเพื่อการพัฒนาท้องถิ่นและสากล
          </p>

          {/* Factual Program Breakdown Bar using shadcn Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-lg text-xs text-slate-200 shadow-inner">
            <span className="flex items-center gap-1.5 font-medium">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>หลักสูตรทั้งหมด <strong>{allPrograms.length}</strong> หลักสูตร</span>
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>ปริญญาตรี <strong>{bachelorCount}</strong> สาขาวิชา</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>ปริญญาโท <strong>{masterCount}</strong> สาขาวิชา</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>ปริญญาเอก <strong>{doctoralCount}</strong> สาขาวิชา</span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ADMISSION LINK STRIP: Direct links to official CRRU portals
          ========================================================================= */}
      <section className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 p-3 sm:p-3.5 rounded-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center text-scholar-accent shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-scholar-deep block">
                  การรับสมัครนักศึกษาใหม่
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500">
                  ตรวจสอบกำหนดการ คุณสมบัติ และยื่นสมัครผ่านระบบรับสมัครของมหาวิทยาลัยราชภัฏเชียงราย
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                asChild
                size="sm"
                className="bg-scholar-accent hover:bg-[#A3350A] text-white text-xs font-semibold shadow-2xs flex-1 sm:flex-initial"
              >
                <a
                  href="https://admission.crru.ac.th/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <span>รับสมัคร ปริญญาตรี</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-slate-300 text-scholar-deep hover:bg-slate-100 text-xs font-semibold flex-1 sm:flex-initial"
              >
                <a
                  href="https://orasis.crru.ac.th/gds_crru/index.php/main/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <span>รับสมัคร ป.โท-เอก</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
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
      <section className="py-12 bg-white border-t border-slate-200 mt-16 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-scholar-deep mb-1.5">
            ต้องการข้อมูลหลักสูตรเพิ่มเติม
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
            ติดต่อกลุ่มงานบริหารวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย<br />
            โทรศัพท์: 0-5377-6000 ต่อ คณะสังคมศาสตร์ หรือส่งข้อความผ่านแบบฟอร์มติดต่อ
          </p>
          <Button
            asChild
            variant="outline"
            className="border-scholar-deep text-scholar-deep hover:bg-scholar-deep hover:text-white font-semibold text-xs px-6 shadow-2xs"
          >
            <Link href="/contact" className="inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>ข้อมูลติดต่อและแผนที่คณะ</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
