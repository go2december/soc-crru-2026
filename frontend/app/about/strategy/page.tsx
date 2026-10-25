import Link from "next/link";
import React from "react";
import {
  GraduationCap,
  Lightbulb,
  Landmark,
  Cog,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { LucideIcon } from "@/components/LucideIcon";

export const revalidate = 60;

export const metadata = {
  title:
    "แผนยุทธศาสตร์ 5 ปี (พ.ศ. 2565 - 2569) | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
  description:
    "4 ประเด็นยุทธศาสตร์หลัก แผนยุทธศาสตร์ 5 ปี (พ.ศ. 2565 - 2569) ฉบับทบทวน พ.ศ. 2566 คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
};

export default async function StrategicPlanPage() {
  const settings = await getSiteSettings();
  const strategies = settings.strategicPlans?.length
    ? settings.strategicPlans
    : DEFAULT_SITE_SETTINGS.strategicPlans;

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
                แผนยุทธศาสตร์
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="size-3.5" />
              <span>STRATEGIC ISSUES • พ.ศ. 2565 - 2569</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              แผนยุทธศาสตร์ 5 ปี <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F97316] to-[#C2410C]">
                {strategies.length} ประเด็นยุทธศาสตร์หลัก
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-2xl">
              กรอบการดำเนินงานตามแผนยุทธศาสตร์ 5 ปี เพื่อขับเคลื่อนคณะสังคมศาสตร์สู่ความเป็นเลิศทางวิชาการและนวัตกรรมเพื่อท้องถิ่น
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. SUB-NAVIGATION BAR ================= */}
      <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-6 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="px-3 py-1.5 rounded-lg text-[#C2410C] bg-orange-50/80 font-bold">
                {strategies.length} ประเด็นยุทธศาสตร์
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="hidden sm:inline">หน้าอื่นในหมวด:</span>
              <Link href="/about" className="hover:text-[#C2410C] hover:underline">
                ภาพรวมคณะ
              </Link>
              <span>•</span>
              <Link
                href="/about/structure"
                className="hover:text-[#C2410C] hover:underline"
              >
                โครงสร้างบริหาร
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

      {/* ================= 3. 4 STRATEGIC ISSUES SECTION ONLY ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <section id="strategic-issues">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategies.map((strat) => {
              return (
                <Link
                  href={`/about/strategy/${strat.id}`}
                  key={strat.id}
                  className={`group relative flex flex-col justify-between p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${strat.borderHover || 'hover:border-[#C2410C]'}`}
                >
                  <div>
                    {/* Top Accent & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`size-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${strat.accentBg || 'bg-orange-50 text-[#C2410C]'}`}
                      >
                        <LucideIcon name={strat.icon} className="size-7" strokeWidth={1.75} />
                      </div>
                      <span className="text-3xl font-black text-slate-200 font-mono group-hover:text-[#C2410C]/40 transition-colors">
                        {strat.number || strat.id}
                      </span>
                    </div>

                    <div className="inline-block text-xs font-bold text-[#C2410C] uppercase tracking-wider mb-2">
                      {strat.badge}
                    </div>

                    <h2 className="text-lg font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors leading-snug mb-2">
                      {strat.name}
                    </h2>

                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      {strat.desc}
                    </p>

                    <p className="font-body text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {strat.summary}
                    </p>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors">
                    <span>ดูรายละเอียด & โครงการ</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
