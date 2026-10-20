import { notFound } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Lightbulb,
  Landmark,
  Cog,
  Target,
  Rocket,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";

// Data from the Strategic Plan (Verbatim Preserved)
const strategies = [
  {
    id: "1",
    number: "01",
    title: "ยุทธศาสตร์ที่ 1",
    name: "การยกระดับคุณภาพการศึกษา",
    subtitle: "Elevating Education Quality",
    icon: GraduationCap,
    accentBg: "bg-amber-50 text-[#C2410C]",
    gradient: "from-amber-500 via-[#F97316] to-[#C2410C]",
    goals: [
      "มุ่งเน้นการผลิตบัณฑิตที่เป็นนวัตกรมืออาชีพ มีทักษะสูง และตอบสนองต่อการพัฒนาท้องถิ่นอย่างยั่งยืน",
    ],
    tactics: [
      "ผลิตกำลังคนเพื่อสร้างบัณฑิตที่มีทักษะสูง ตอบโจทย์การพัฒนาพื้นที่โดยเน้นการมีส่วนร่วมของท้องถิ่น (โครงการ Flagship)",
      "ส่งเสริมและพัฒนาคุณภาพนักศึกษาให้เป็นนวัตกรสังคมที่พร้อมรองรับการเปลี่ยนแปลงในอนาคต (โครงการ Flagship)",
      "พัฒนาบุคลากรและส่งเสริมความก้าวหน้าในอาชีพ",
      "จัดหาและเพิ่มประสิทธิภาพทรัพยากรสนับสนุนการเรียนรู้ให้ทันสมัย",
    ],
    projects: [
      "การพัฒนาหลักสูตรเชิงพื้นที่ (Degree) และหลักสูตรคลังหน่วยกิต (Credit Bank)",
      "การจัดการเรียนการสอนรูปแบบสหกิจศึกษาและการศึกษาเชิงบูรณาการกับการทำงาน (CWIE)",
      "โครงการ SMART Faculty of Social Sciences",
    ],
  },
  {
    id: "2",
    number: "02",
    title: "ยุทธศาสตร์ที่ 2",
    name: "การพัฒนางานวิจัย นวัตกรรม และงานสร้างสรรค์",
    subtitle: "Research, Innovation, and Creative Works",
    icon: Lightbulb,
    accentBg: "bg-orange-50 text-[#C2410C]",
    gradient: "from-[#F97316] via-[#C2410C] to-[#9A3412]",
    goals: [
      "มุ่งผลิตผลงานวิจัยเพื่อนำไปใช้ประโยชน์ในชุมชน ท้องถิ่น และระดับภูมิภาคอาเซียน",
    ],
    tactics: [
      "ส่งเสริมและสนับสนุนงานวิจัยและนวัตกรรมเชิงสร้างสรรค์ เพื่อพัฒนาท้องถิ่นอย่างมีส่วนร่วม (โครงการ Flagship)",
    ],
    projects: [
      "พัฒนาระบบบริหารจัดการงานวิจัยและนวัตกรรมที่มุ่งแก้ปัญหาและตอบสนองความต้องการของชุมชน",
      "การพัฒนาและส่งเสริมคุณภาพงานวิจัยเพื่อถ่ายทอดความรู้และเทคโนโลยีสู่ชุมชน",
      "ส่งเสริมศักยภาพนักวิจัยเพื่อเพิ่มขีดความสามารถในการแข่งขัน (Talent Mobility)",
    ],
  },
  {
    id: "3",
    number: "03",
    title: "ยุทธศาสตร์ที่ 3",
    name: "การพัฒนาท้องถิ่น",
    subtitle: "Local Development",
    icon: Landmark,
    accentBg: "bg-purple-50 text-[#581C87]",
    gradient: "from-[#7C3AED] via-[#581C87] to-[#3B0764]",
    goals: [
      "มุ่งเป็นผู้นำในการพัฒนาชุมชนและสังคมให้เข้มแข็ง รวมถึงการอนุรักษ์สืบสานศิลปวัฒนธรรม",
    ],
    tactics: [
      "ส่งเสริมการเรียนรู้ตลอดชีวิต (Lifelong Learning) โดยเน้นทักษะในศตวรรษที่ 21 บนพื้นฐานภูมิปัญญาท้องถิ่น",
      "สร้างแพลตฟอร์มความร่วมมือในรูปแบบจตุรภาคี (คณะ ภาครัฐ ภาคเอกชน และชุมชน) (โครงการ Flagship)",
      "ยกระดับคุณภาพชีวิตของประชาชนในท้องถิ่น",
      "ส่งเสริมและสืบสานศิลปวัฒนธรรมและเอกลักษณ์ของชาติพันธุ์",
    ],
    projects: [
      "การพัฒนา Up-skill / Re-skill / Non-degree",
      "การสร้างผู้ประกอบการท้องถิ่น (Local Startups) ผ่านการถ่ายทอดเทคโนโลยี",
      "การสร้างเครือข่ายความร่วมมือกับหน่วยงานภายนอก",
    ],
  },
  {
    id: "4",
    number: "04",
    title: "ยุทธศาสตร์ที่ 4",
    name: "การพัฒนาระบบ กลไก และการบริหารจัดการ",
    subtitle: "System, Mechanism, and Management Development",
    icon: Cog,
    accentBg: "bg-slate-100 text-[#0B132B]",
    gradient: "from-slate-700 via-slate-800 to-[#0B132B]",
    goals: [
      "มุ่งพัฒนาคณะให้เป็นองค์กรแห่งการเรียนรู้ที่มีคุณภาพ มีธรรมาภิบาล และมีประสิทธิภาพระดับชาติ",
    ],
    tactics: [
      "ปฏิรูประบบบริหารจัดการที่เอื้อต่อการเป็นคณะเพื่อการพัฒนาท้องถิ่นที่มีธรรมาภิบาล (Flagship)",
      "สร้างองค์กรให้เป็นองค์กรแห่งความสุข (Happy Organization)",
      "แสวงหารายได้เพื่อความมั่นคงของหน่วยงาน",
    ],
    projects: [
      "ปรับปรุงการบริหารจัดการมุ่งสู่การพัฒนาชุมชนเชิงพื้นที่ (Area-Based and Community)",
      "ปรับระบบการประกันคุณภาพการศึกษาเข้าสู่มาตรฐานสากล (AUN-QA)",
      "โครงการ Happy Faculty of Social Sciences",
    ],
  },
];

export function generateStaticParams() {
  return strategies.map((strategy) => ({
    id: strategy.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = strategies.find((s) => s.id === id);

  if (!strategy) {
    return {
      title: "ไม่พบยุทธศาสตร์ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    };
  }

  return {
    title: `${strategy.title}: ${strategy.name} | แผนยุทธศาสตร์ คณะสังคมศาสตร์ มร.ชร.`,
    description: `เป้าประสงค์ กลยุทธ์ และโครงการสำคัญ Flagship ของ ${strategy.title} (${strategy.name}) แผนยุทธศาสตร์ 5 ปี คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`,
  };
}

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = strategies.find((s) => s.id === id);

  if (!strategy) {
    notFound();
  }

  const Icon = strategy.icon;
  const currentIndex = strategies.findIndex((s) => s.id === id);
  const prevStrategy = currentIndex > 0 ? strategies[currentIndex - 1] : null;
  const nextStrategy =
    currentIndex < strategies.length - 1 ? strategies[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
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

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <li>
                <Link
                  href="/about/strategy"
                  className="hover:text-white transition-colors"
                >
                  แผนยุทธศาสตร์
                </Link>
              </li>
              <li>
                <ChevronRight className="size-3 text-slate-600" />
              </li>
              <li className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
                {strategy.title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="size-16 sm:size-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-400 flex-shrink-0">
              <Icon className="size-8 sm:size-10" strokeWidth={1.75} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>{strategy.title}</span>
                <span>•</span>
                <span>STRATEGIC ISSUE {strategy.number}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {strategy.name}
              </h1>
              <p className="font-body text-slate-300 text-sm sm:text-base mt-2">
                {strategy.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. CONTENT SECTIONS ================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-10 sm:space-y-12">
        {/* Back Link */}
        <Link
          href="/about/strategy"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#C2410C] transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>ย้อนกลับไปหน้าแผนยุทธศาสตร์ภาพรวม</span>
        </Link>

        {/* 1. Goals (เป้าประสงค์) */}
        <section className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center flex-shrink-0">
              <Target className="size-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B]">
                เป้าประสงค์ (Goals)
              </h2>
              <p className="font-body text-xs text-slate-500 mt-0.5">
                เป้าหมายหลักที่ต้องการให้เกิดขึ้นตามประเด็นยุทธศาสตร์
              </p>
            </div>
          </div>

          <ul className="space-y-4">
            {strategy.goals.map((goal, idx) => (
              <li
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3.5"
              >
                <div className="size-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <span className="font-body text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {goal}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Tactics (กลยุทธ์ / แนวทางการพัฒนา) */}
        <section className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Rocket className="size-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B]">
                กลยุทธ์และแนวทางการพัฒนา (Tactics)
              </h2>
              <p className="font-body text-xs text-slate-500 mt-0.5">
                มาตรการและกลไกขับเคลื่อนการปฏิบัติงานสู่ความสำเร็จ
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {strategy.tactics.map((tactic, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="size-7 rounded-lg bg-[#0B132B] text-white flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="font-body text-sm sm:text-base text-slate-700 leading-relaxed">
                  {tactic}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Flagship Projects (โครงการสำคัญ) */}
        {strategy.projects && strategy.projects.length > 0 && (
          <section className="p-8 sm:p-10 rounded-2xl bg-[#0B132B] text-white relative overflow-hidden shadow-lg">
            {/* Background Accent Blur */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C2410C]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-white/10 text-amber-400 border border-white/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  โครงการสำคัญ (Ref / Flagship Projects)
                </h2>
                <p className="font-body text-xs text-slate-300 mt-0.5">
                  โครงการเรือธงที่เป็นรูปธรรมเพื่อขับเคลื่อนยุทธศาสตร์
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/10 transition-colors"
                >
                  <FolderGit2 className="size-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm sm:text-base text-slate-100 leading-relaxed">
                    {project}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= 3. STRATEGY NAVIGATION SWITCHER ================= */}
        <section className="pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevStrategy ? (
              <Link
                href={`/about/strategy/${prevStrategy.id}`}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C2410C] hover:shadow-xs transition-all flex items-center gap-4 group"
              >
                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#C2410C] group-hover:text-white transition-colors">
                  <ArrowLeft className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    ยุทธศาสตร์ก่อนหน้า
                  </div>
                  <div className="text-sm font-bold text-[#0B132B] truncate group-hover:text-[#C2410C] transition-colors">
                    {prevStrategy.title}: {prevStrategy.name}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextStrategy ? (
              <Link
                href={`/about/strategy/${nextStrategy.id}`}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C2410C] hover:shadow-xs transition-all flex items-center justify-between text-right gap-4 group sm:col-start-2"
              >
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    ยุทธศาสตร์ถัดไป
                  </div>
                  <div className="text-sm font-bold text-[#0B132B] truncate group-hover:text-[#C2410C] transition-colors">
                    {nextStrategy.title}: {nextStrategy.name}
                  </div>
                </div>
                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#C2410C] group-hover:text-white transition-colors flex-shrink-0">
                  <ArrowRight className="size-5" />
                </div>
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
