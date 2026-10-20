import Link from "next/link";
import React from "react";
import {
  Crown,
  Building2,
  Users,
  GraduationCap,
  FolderTree,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  FileText,
  Landmark,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "โครงสร้างการบริหาร | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
  description:
    "แผนผังโครงสร้างการบริหารงาน สายการบังคับบัญชา สำนักงานคณบดี และสาขาวิชา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
};

export default function StructurePage() {
  const deputyDeans = [
    {
      title: "รองคณบดีฝ่ายวิชาการและวิจัย",
      sub: "Academic & Research Affairs",
      desc: "กำกับดูแลงานหลักสูตร การจัดการเรียนการสอน งานวิจัย และประกันคุณภาพการศึกษา",
      accent: "border-t-4 border-amber-500",
      tag: "Academic",
    },
    {
      title: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์",
      sub: "Administrative & Strategic Affairs",
      desc: "กำกับดูแลงานบริหารทั่วไป งานนโยบายและแผน งบประมาณ การเงินและพัสดุ",
      accent: "border-t-4 border-[#C2410C]",
      tag: "Strategy",
    },
    {
      title: "รองคณบดีฝ่ายพัฒนานักศึกษาและทำนุบำรุงศิลปวัฒนธรรม",
      sub: "Student Affairs & Cultural Arts",
      desc: "กำกับดูแลกิจกรรมพัฒนานักศึกษา ทุนการศึกษา วินัยนักศึกษา และงานศิลปวัฒนธรรม",
      accent: "border-t-4 border-[#581C87]",
      tag: "Student Affairs",
    },
  ];

  const deanOfficeUnits = [
    {
      name: "งานบริหารทั่วไป",
      en: "General Administration",
      desc: "งานสารบรรณ ธุรการ บุคลากร ประชาสัมพันธ์ และอาคารสถานที่",
    },
    {
      name: "งานนโยบายและแผน",
      en: "Policy & Planning",
      desc: "จัดทำแผนยุทธศาสตร์ แผนปฏิบัติการประจำปี และติดตามผลสัมฤทธิ์",
    },
    {
      name: "งานการเงินและพัสดุ",
      en: "Finance & Procurement",
      desc: "บริหารงบประมาณ จัดซื้อจัดจ้าง บัญชี และพัสดุครุภัณฑ์",
    },
    {
      name: "งานบริการการศึกษา",
      en: "Educational Services",
      desc: "ทะเบียนและประเมินผล จัดตารางสอน สหกิจศึกษา และงานบัณฑิตศึกษา",
    },
  ];

  const academicPrograms = [
    {
      name: "สาขาวิชาสังคมศาสตร์",
      en: "Social Sciences",
      code: "soc-sci",
    },
    {
      name: "สาขาวิชานวัตกรรมการพัฒนาสังคม",
      en: "Social Development Innovation",
      code: "sdi",
    },
    {
      name: "สาขาวิชาจิตวิทยาสังคม",
      en: "Social Psychology",
      code: "psy",
    },
    {
      name: "สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ",
      en: "Geography & Geoinformatics",
      code: "geo",
    },
    {
      name: "สาขาวิชาคหกรรมศาสตร์",
      en: "Home Economics",
      code: "he",
    },
    {
      name: "หลักสูตรระดับบัณฑิตศึกษา (ป.โท / ป.เอก)",
      en: "Graduate Studies (Master's & Doctoral)",
      code: "grad",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-24">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative bg-[#0B132B] text-white overflow-hidden pt-12 pb-18 sm:pt-16 sm:pb-24 border-b-4 border-[#C2410C]">
        {/* Subtle Geometric Canvas Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] select-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <ChevronRight className="size-3 text-slate-600" />
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  เกี่ยวกับคณะ
                </Link>
              </li>
              <li>
                <ChevronRight className="size-3 text-slate-600" />
              </li>
              <li className="text-amber-400 font-semibold" aria-current="page">
                โครงสร้างการบริหาร
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="size-3.5" />
              <span>FACULTY ORGANIZATION CHART</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              โครงสร้างการบริหาร <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F97316] to-[#C2410C]">
                คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-2xl">
              แผนผังสายการบังคับบัญชา โครงสร้างการบริหารจัดการภายในสำนักงานคณบดี
              และกลุ่มสาขาวิชาเพื่อการขับเคลื่อนองค์กรอย่างมีธรรมาภิบาล
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. STICKY SUB-NAVIGATION BAR ================= */}
      <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-6 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="px-3 py-1.5 rounded-lg text-[#C2410C] bg-orange-50/80 font-bold">
                โครงสร้างการบริหาร
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="hidden sm:inline">หน้าอื่นในหมวด:</span>
              <Link href="/about" className="hover:text-[#C2410C] hover:underline">
                ภาพรวมคณะ
              </Link>
              <span>•</span>
              <Link
                href="/about/strategy"
                className="hover:text-[#C2410C] hover:underline"
              >
                แผนยุทธศาสตร์
              </Link>
              <span>•</span>
              <Link
                href="/about/executive"
                className="hover:text-[#C2410C] hover:underline"
              >
                ผู้บริหาร
              </Link>
              <span>•</span>
              <Link
                href="/about/staff"
                className="hover:text-[#C2410C] hover:underline"
              >
                บุคลากร
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. ORGANIZATION CHART TREE ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
            <FolderTree className="size-3.5" />
            <span>Organization Chart</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
            แผนผังสายการบริหารจัดการ
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base mt-1">
            การจัดวางโครงสร้างและสายการบังคับบัญชาภายในคณะสังคมศาสตร์
          </p>
        </div>

        {/* Tree Container */}
        <div className="flex flex-col items-center">
          {/* Advisory Body: คณะกรรมการประจำคณะ */}
          <div className="w-full max-w-md p-4 rounded-xl bg-slate-100 border border-slate-300/80 text-center mb-6 shadow-2xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              คณะกรรมการที่ปรึกษาและกำกับนโยบาย
            </div>
            <div className="text-sm sm:text-base font-bold text-[#0B132B] flex items-center justify-center gap-2">
              <ShieldCheck className="size-4 text-[#C2410C]" />
              <span>คณะกรรมการประจำคณะสังคมศาสตร์</span>
            </div>
          </div>

          {/* Connector Down */}
          <div className="w-0.5 h-6 bg-slate-300" />

          {/* LEVEL 1: คณบดีคณะสังคมศาสตร์ (DEAN) */}
          <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#0B132B] text-white text-center shadow-lg border-2 border-amber-400/60 relative group hover:scale-[1.02] transition-transform">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Crown className="size-3.5" />
              <span>DEAN OF SOCIAL SCIENCES</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
              คณบดีคณะสังคมศาสตร์
            </h3>
            <p className="text-xs text-slate-300 font-body">
              ผู้บริหารสูงสุด กำกับทิศทางนโยบายและการขับเคลื่อนคณะ
            </p>
            <div className="mt-4 pt-3 border-t border-white/10">
              <Link
                href="/about/executive"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>ดูทำเนียบผู้บริหาร</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Connector Down to Deputies */}
          <div className="w-0.5 h-10 bg-slate-300" />

          {/* LEVEL 2: รองคณบดี 3 ฝ่าย (DEPUTY DEANS) */}
          <div className="w-full max-w-5xl mb-12 relative">
            {/* Desktop Connector Horizontal Line */}
            <div className="hidden lg:block absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-slate-300" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0 lg:pt-6">
              {deputyDeans.map((pos, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative text-center ${pos.accent}`}
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {pos.tag}
                  </span>
                  <h4 className="text-base font-bold text-[#0B132B] mb-1">
                    {pos.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mb-2">
                    {pos.sub}
                  </p>
                  <p className="font-body text-xs text-slate-600 leading-relaxed">
                    {pos.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Connector Down to Divisions */}
          <div className="w-0.5 h-8 bg-slate-300 mb-2" />

          {/* LEVEL 3: 2 MAIN WINGS (สำนักงานคณบดี & สาขาวิชา) */}
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
            {/* Wing 1: สำนักงานคณบดี */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center flex-shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B132B]">
                    สำนักงานคณบดี
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    Dean&apos;s Office • ฝ่ายสนับสนุนการบริหารจัดการ
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {deanOfficeUnits.map((unit, uIdx) => (
                  <div
                    key={uIdx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#0B132B]">
                        {unit.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {unit.en}
                      </span>
                    </div>
                    <p className="font-body text-xs text-slate-600 leading-relaxed">
                      {unit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wing 2: หลักสูตรและสาขาวิชา */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-purple-50 text-[#581C87] flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B132B]">
                    กลุ่มหลักสูตรและสาขาวิชา
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    Academic Departments & Programs
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {academicPrograms.map((prog, pIdx) => (
                  <Link
                    href="/programs"
                    key={pIdx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#C2410C]/40 hover:bg-orange-50/30 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors">
                        {prog.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {prog.en}
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-[#C2410C] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* LEVEL 4: หน่วยงานเฉพาะทาง (ศูนย์เชียงรายศึกษา) */}
          <div className="w-full max-w-5xl p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-white border border-amber-200 text-[#C2410C] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Landmark className="size-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Special Academic Center
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#0B132B]">
                  โครงการจัดตั้งศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)
                </h4>
                <p className="font-body text-xs text-slate-600 mt-0.5">
                  ศูนย์กลางรวบรวมองค์ความรู้ งานวิจัย และสืบสานอัตลักษณ์ล้านนาและกลุ่มชาติพันธุ์
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C2410C] text-white text-xs font-semibold transition-colors flex-shrink-0"
            >
              <span>ติดต่อศูนย์</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/about/executive"
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C2410C] hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    Leadership Directory
                  </div>
                  <div className="text-sm font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors">
                    ทำเนียบคณะผู้บริหาร &rarr;
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/about/staff"
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C2410C] hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    Faculty & Staff
                  </div>
                  <div className="text-sm font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors">
                    ค้นหาคณาจารย์และบุคลากร &rarr;
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
