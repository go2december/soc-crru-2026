import Link from "next/link";
import {
  Compass,
  Eye,
  Award,
  GraduationCap,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  FlaskConical,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Building2,
  UserCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "เกี่ยวกับคณะ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
  description:
    "ประวัติความเป็นมา ปรัชญา วิสัยทัศน์ เอกลักษณ์ อัตลักษณ์ ค่านิยม และพันธกิจของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
};

export default function AboutPage() {
  const missions = [
    {
      id: 1,
      title: "ผลิตบัณฑิตที่เป็นนวัตกรมืออาชีพ",
      desc: "มีทักษะเด่น มีความรู้ มีคุณธรรม และตอบสนองต่อการพัฒนาท้องถิ่นอย่างยั่งยืน",
      icon: Users,
    },
    {
      id: 2,
      title: "ผลิตผลงานวิจัยและงานสร้างสรรค์",
      desc: "เพื่อการนำไปใช้ประโยชน์ในชุมชน ท้องถิ่น ประเทศ และภูมิภาคอาเซียน",
      icon: FlaskConical,
    },
    {
      id: 3,
      title: "ให้บริการวิชาการแก่สังคม",
      desc: "เพื่อยกระดับคุณภาพชีวิตของประชาชนในท้องถิ่น และประเทศ",
      icon: HeartHandshake,
    },
    {
      id: 4,
      title: "สืบสานและส่งเสริมศิลปวัฒนธรรม",
      desc: "ทำนุบำรุงและอนุรักษ์ศิลปวัฒนธรรมอันดีงามของท้องถิ่นล้านนาและของชาติ",
      icon: Landmark,
    },
    {
      id: 5,
      title: "พัฒนาองค์กรแห่งการเรียนรู้ที่มีธรรมาภิบาล",
      desc: "พัฒนาคณะให้เป็นองค์กรแห่งการเรียนรู้ที่มีคุณภาพ มีประสิทธิภาพ และยึดหลักธรรมาภิบาล",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
      {/* ================= 1. EDITORIAL HERO SECTION ================= */}
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
              <li className="text-amber-400 font-semibold" aria-current="page">
                เกี่ยวกับคณะ
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="size-3.5" />
              <span>FACULTY OF SOCIAL SCIENCES • CRRU</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-5">
              เกี่ยวกับคณะสังคมศาสตร์ <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F97316] to-[#C2410C]">
                มหาวิทยาลัยราชภัฏเชียงราย
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-2xl">
              องค์กรแห่งการบูรณาการองค์ความรู้ เพื่อผลิตบัณฑิตนวัตกรสังคม
              และขับเคลื่อนการพัฒนาท้องถิ่นล้านนาสู่อนุภูมิภาคลุ่มน้ำโขงอย่างยั่งยืน
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. STICKY SUB-NAVIGATION ANCHOR BAR ================= */}
      <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-6 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <div className="flex items-center gap-1 sm:gap-2">
              <a
                href="#history"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
              >
                ประวัติความเป็นมา
              </a>
              <a
                href="#philosophy-vision"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
              >
                ปรัชญา & วิสัยทัศน์
              </a>
              <a
                href="#identity"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
              >
                เสาหลักอัตลักษณ์
              </a>
              <a
                href="#missions"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
              >
                พันธกิจ 5 ด้าน
              </a>
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 text-xs font-semibold text-slate-500">
              <span>หน้าในหมวดนี้:</span>
              <Link
                href="/about/structure"
                className="hover:text-[#C2410C] hover:underline"
              >
                โครงสร้างบริหาร
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16 sm:space-y-24">
        {/* ================= 3. HISTORY SECTION (ประวัติความเป็นมา) ================= */}
        <section id="history" className="scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Header */}
            <div className="lg:col-span-4 lg:sticky lg:top-36">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
                <Calendar className="size-3.5" />
                <span>History of the Faculty</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
                ประวัติความเป็นมา
              </h2>
              <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <div className="text-3xl font-extrabold text-[#C2410C] font-mono">
                  2546
                </div>
                <div className="text-xs text-slate-700 font-medium mt-1">
                  ปีก่อตั้งคณะสังคมศาสตร์ สู่กว่าสองทศวรรษแห่งการพัฒนาท้องถิ่น
                </div>
              </div>
            </div>

            {/* Right Narrative Card */}
            <div className="lg:col-span-8 p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="prose prose-slate max-w-none font-body leading-relaxed text-base sm:text-lg text-slate-700 space-y-4">
                <p>
                  <strong className="text-[#0B132B] font-bold">คณะสังคมศาสตร์</strong>{" "}
                  ได้ก่อตั้งมาตั้งแต่ปี พ.ศ. 2546
                  โดยเป็นหน่วยงานที่อยู่ภายใต้โครงสร้างภายในของมหาวิทยาลัย
                  มีหน้าที่และการบริหารจัดการศึกษาเทียบเท่ากับหน่วยงานที่อยู่ในโครงสร้างตามกฎหมายของมหาวิทยาลัย
                </p>
                <p>
                  ซึ่งปัจจุบันคณะสังคมศาสตร์
                  ได้พัฒนาให้มีการเรียนการสอนหลักสูตรต่าง ๆ
                  ทั้งระดับปริญญาตรีและบัณฑิตศึกษา จำนวน{" "}
                  <strong className="text-[#C2410C] font-bold">7 หลักสูตร</strong>{" "}
                  เพื่อตอบสนองต่อการเปลี่ยนแปลงทางเศรษฐกิจ สังคม และสิ่งแวดล้อม
                  ตลอดจนการสร้างบัณฑิตนักปฏิบัติเพื่อรับใช้ชุมชนท้องถิ่นอย่างแท้จริง
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-[#0B132B]">23+</div>
                  <div className="text-xs text-slate-500 mt-0.5">ปีแห่งการก่อตั้ง</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-[#C2410C]">7</div>
                  <div className="text-xs text-slate-500 mt-0.5">หลักสูตร ตรี-โท-เอก</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-[#581C87]">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">เพื่อการพัฒนาท้องถิ่น</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. PHILOSOPHY & VISION DUAL SHOWCASE ================= */}
        <section id="philosophy-vision" className="scroll-mt-32">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
              <Compass className="size-3.5" />
              <span>Philosophy & Vision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
              ปรัชญาและวิสัยทัศน์
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base mt-1">
              เข็มทิศนำทางการดำเนินงานเพื่อสร้างผลกระทบเชิงบวกต่อสังคม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Philosophy Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0B132B] text-white border border-white/10 shadow-lg relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="size-6" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                ปรัชญา (Philosophy)
              </div>
              <blockquote className="text-xl sm:text-2xl font-bold leading-snug text-white">
                "องค์กรแห่งการบูรณาการองค์ความรู้เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
              </blockquote>
            </div>

            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-md relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#C2410C] mb-6 group-hover:scale-110 transition-transform">
                <Eye className="size-6" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-bold text-[#C2410C] uppercase tracking-widest mb-2">
                วิสัยทัศน์ (Vision)
              </div>
              <blockquote className="text-xl sm:text-2xl font-bold leading-snug text-[#0B132B]">
                "บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
              </blockquote>
            </div>
          </div>
        </section>

        {/* ================= 5. IDENTITY & CORE VALUES (3 COLUMNS) ================= */}
        <section id="identity" className="scroll-mt-32">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
              <Layers className="size-3.5" />
              <span>Identity & Core Values</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
              เสาหลักอัตลักษณ์และค่านิยม
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base mt-1">
              หล่อหลอมเอกลักษณ์ อัตลักษณ์ และวัฒนธรรมของชาวสังคมศาสตร์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Uniqueness */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Award className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">
                เอกลักษณ์ (Uniqueness)
              </h3>
              <p className="font-body text-sm leading-relaxed text-slate-600">
                "องค์กรแห่งการเรียนรู้สู่การพัฒนาชุมชน ท้องถิ่น สังคม ประเทศ และนานาชาติ"
              </p>
            </div>

            {/* 2. Identity */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center mb-5">
                <GraduationCap className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">
                อัตลักษณ์ (Identity)
              </h3>
              <p className="font-body text-sm leading-relaxed text-slate-600">
                "มีคุณธรรม ความรู้ ความคิดสร้างสรรค์ ทักษะทางสังคม เป็นที่ยอมรับในศตวรรษที่ 21"
              </p>
            </div>

            {/* 3. Core Values */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#581C87] flex items-center justify-center mb-5">
                <Users className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">
                ค่านิยม (Core Values)
              </h3>
              <p className="font-body text-sm leading-relaxed text-slate-600">
                "บูรณาการศาสตร์ที่หลากหลายสู่การพัฒนาท้องถิ่น"
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. MISSIONS 5-PILLAR LIST (พันธกิจ) ================= */}
        <section id="missions" className="scroll-mt-32">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
                <ShieldCheck className="size-3.5" />
                <span>Our Missions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
                พันธกิจ 5 ประการ
              </h2>
              <p className="font-body text-slate-600 text-sm sm:text-base mt-1">
                ภารกิจหลักที่คณะสังคมศาสตร์ยึดถือปฏิบัติเพื่อประโยชน์ของชุมชนและประเทศชาติ
              </p>
            </div>

            <div className="space-y-4">
              {missions.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-[#C2410C]/40 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm group-hover:bg-[#C2410C] transition-colors">
                      {m.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#0B132B] mb-1">
                        {m.title}
                      </h3>
                      <p className="font-body text-sm text-slate-600 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="hidden sm:flex w-9 h-9 rounded-lg bg-white border border-slate-200 items-center justify-center text-slate-400 group-hover:text-[#C2410C] transition-colors">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 7. CONNECTED PORTALS / SHORTCUTS ================= */}
        <section className="pt-4 pb-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B132B]">
              ข้อมูลการบริหารและบุคลากร
            </h3>
            <p className="font-body text-slate-600 text-sm mt-1">
              เข้าถึงข้อมูลเชิงลึกเกี่ยวกับโครงสร้างการทำงานและทีมงานคณาจารย์
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/about/structure"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#C2410C]/40 hover:shadow-md transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                <Building2 className="size-5" />
              </div>
              <h4 className="text-base font-bold text-[#0B132B] mb-1 group-hover:text-[#C2410C] transition-colors">
                โครงสร้างการบริหาร
              </h4>
              <p className="font-body text-xs text-slate-500 mb-3">
                แผนผังสายการบังคับบัญชาและการบริหารงานภายในคณะ
              </p>
              <span className="text-xs font-semibold text-[#C2410C] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                ดูโครงสร้าง &rarr;
              </span>
            </Link>

            <Link
              href="/about/executive"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#C2410C]/40 hover:shadow-md transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                <UserCheck className="size-5" />
              </div>
              <h4 className="text-base font-bold text-[#0B132B] mb-1 group-hover:text-[#C2410C] transition-colors">
                คณะผู้บริหาร
              </h4>
              <p className="font-body text-xs text-slate-500 mb-3">
                ทำเนียบคณบดี รองคณบดี และผู้ช่วยคณบดี
              </p>
              <span className="text-xs font-semibold text-[#C2410C] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                ดูรายนาม &rarr;
              </span>
            </Link>

            <Link
              href="/about/staff"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#C2410C]/40 hover:shadow-md transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                <Users className="size-5" />
              </div>
              <h4 className="text-base font-bold text-[#0B132B] mb-1 group-hover:text-[#C2410C] transition-colors">
                ทำเนียบบุคลากร
              </h4>
              <p className="font-body text-xs text-slate-500 mb-3">
                คณาจารย์ประจำสาขาวิชา และเจ้าหน้าที่สายสนับสนุน
              </p>
              <span className="text-xs font-semibold text-[#C2410C] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                ค้นหาบุคลากร &rarr;
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
