"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Compass,
  HeartHandshake,
  BookOpen,
  Coffee,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Register ScrollTrigger plugin with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProgramItem {
  id: string;
  degree: string;
  degreeType: "saffron" | "slate" | "lotus";
  title: string;
  engTitle: string;
  description: string;
  tracks: string[];
  duration: string;
  href: string;
  icon: typeof Users;
}

const programs: ProgramItem[] = [
  {
    id: "social-dev",
    degree: "ศศ.บ. 4 ปี",
    degreeType: "saffron",
    title: "นวัตกรรมการพัฒนาสังคม",
    engTitle: "Social Innovation & Community Development",
    description:
      "สร้างผู้นำการเปลี่ยนแปลง การจัดการโครงการพัฒนา และการวิจัยนโยบายชุมชนท้องถิ่นสู่ระดับสากล",
    tracks: ["การจัดการนวัตกรรมสังคม", "การพัฒนาชุมชนเชิงพื้นที่"],
    duration: "4 ปี (126 หน่วยกิต)",
    href: "/programs/social-dev",
    icon: Users,
  },
  {
    id: "gis",
    degree: "วท.บ. 4 ปี",
    degreeType: "slate",
    title: "ภูมิศาสตร์และภูมิสารสนเทศ",
    engTitle: "Geography & Geo-Informatics (GIS)",
    description:
      "การวิเคราะห์ข้อมูลเชิงพื้นที่ รีโมตเซนซิง โดรนสำรวจ และการวางผังเมืองและสิ่งแวดล้อมยุคดิจิทัล",
    tracks: ["เทคโนโลยีภูมิสารสนเทศ", "การจัดการทรัพยากรและผังเมือง"],
    duration: "4 ปี (130 หน่วยกิต)",
    href: "/programs/gis",
    icon: Compass,
  },
  {
    id: "social-psych",
    degree: "ศศ.บ. 4 ปี",
    degreeType: "saffron",
    title: "จิตวิทยาสังคม",
    engTitle: "Social Psychology & Human Wellbeing",
    description:
      "เข้าใจพฤติกรรมมนุษย์ การให้คำปรึกษา การส่งเสริมสุขภาวะทางจิต และการพัฒนาทรัพยากรมนุษย์ในองค์กร",
    tracks: ["จิตวิทยาการให้คำปรึกษา", "จิตวิทยาองค์กรและชุมชน"],
    duration: "4 ปี (128 หน่วยกิต)",
    href: "/programs/social-psych",
    icon: HeartHandshake,
  },
  {
    id: "social-sci",
    degree: "ศศ.บ. 4 ปี",
    degreeType: "slate",
    title: "สังคมศาสตร์และการจัดการ",
    engTitle: "Social Sciences & Public Management",
    description:
      "บูรณาการสังคม วัฒนธรรม เศรษฐกิจชายแดน และการบริหารจัดการนโยบายสาธารณะลุ่มน้ำโขง",
    tracks: ["การจัดการสังคมและวัฒนธรรม", "นโยบายสาธารณะและการพัฒนา"],
    duration: "4 ปี (124 หน่วยกิต)",
    href: "/programs/social-sci",
    icon: BookOpen,
  },
  {
    id: "home-eco",
    degree: "ศศ.บ. 4 ปี",
    degreeType: "saffron",
    title: "คหกรรมศาสตร์ประยุกต์",
    engTitle: "Applied Home Economics & Lanna Gastronomy",
    description:
      "วิทยาศาสตร์อาหาร ศิลปะการจัดเลี้ยง โภชนาการ และการต่อยอดภูมิปัญญาสมุนไพรและอาหารล้านนาเชิงพาณิชย์",
    tracks: ["นวัตกรรมอาหารและโภชนาการ", "การออกแบบธุรกิจบริการและจัดเลี้ยง"],
    duration: "4 ปี (125 หน่วยกิต)",
    href: "/programs/home-eco",
    icon: Coffee,
  },
  {
    id: "regional-dev",
    degree: "ศศ.ม. / ปร.ด.",
    degreeType: "lotus",
    title: "ยุทธศาสตร์การพัฒนาภูมิภาค",
    engTitle: "Regional Development Strategies (M.A. & Ph.D.)",
    description:
      "หลักสูตรระดับบัณฑิตศึกษา สำหรับนักบริหารและนักวิจัย เพื่อกำหนดยุทธศาสตร์การพัฒนาพื้นที่ลุ่มน้ำโขง",
    tracks: ["การวิจัยนโยบายเชิงยุทธศาสตร์", "การพัฒนาความร่วมมือชายแดน"],
    duration: "2 - 3 ปี",
    href: "/programs/regional-dev-ma",
    icon: GraduationCap,
  },
];

export default function CurriculumDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"all" | "ug" | "grad">("all");

  useGSAP(
    () => {
      // Respect accessibility reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion || !sectionRef.current || !scrollTrackRef.current) return;

      // Only enable pinned horizontal scroll on desktop (min-width: 1024px)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = scrollTrackRef.current;
        if (!track) return;

        const totalScrollWidth = track.scrollWidth - track.clientWidth;

        if (totalScrollWidth > 0) {
          gsap.to(track, {
            x: -totalScrollWidth,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: "top 12%",
              end: () => `+=${totalScrollWidth + 400}`,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const filteredPrograms = programs.filter((p) => {
    if (activeTab === "ug") return p.degreeType !== "lotus";
    if (activeTab === "grad") return p.degreeType === "lotus";
    return true;
  });

  return (
    <section
      id="programs-showcase"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-white border-t border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              Academic Programs & Tracks
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
              หลักสูตรที่ตอบโจทย์อนาคต
            </h2>
            <p className="font-body text-slate-600 mt-3 text-base sm:text-lg">
              ผสานทฤษฎีทางสังคมศาสตร์เข้ากับการลงมือปฏิบัติจริงในพื้นที่ภาคเหนือและอนุภูมิภาคลุ่มน้ำโขง
            </p>
          </div>

          {/* Tab Filter (Motion animated indicator) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold self-start md:self-end">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white text-[#0B132B] shadow-xs"
                  : "text-slate-600 hover:text-[#0B132B]"
              }`}
            >
              ทั้งหมด (7)
            </button>
            <button
              onClick={() => setActiveTab("ug")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "ug"
                  ? "bg-white text-[#0B132B] shadow-xs"
                  : "text-slate-600 hover:text-[#0B132B]"
              }`}
            >
              ปริญญาตรี (5)
            </button>
            <button
              onClick={() => setActiveTab("grad")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "grad"
                  ? "bg-white text-[#0B132B] shadow-xs"
                  : "text-slate-600 hover:text-[#0B132B]"
              }`}
            >
              บัณฑิตศึกษา (2)
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Stream / Scroll Deck */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollTrackRef}
          className="flex flex-col lg:flex-row gap-6 lg:w-max pb-4"
        >
          {filteredPrograms.map((prog) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="w-full lg:w-[380px] p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-[#C2410C]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between shrink-0 group"
              >
                <div>
                  {/* Top Meta info */}
                  <div className="flex items-center justify-between mb-5">
                    <Badge variant={prog.degreeType}>{prog.degree}</Badge>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-[#C2410C] group-hover:border-[#C2410C]/30 transition-colors shadow-2xs">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Program Titles */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors mb-1.5 leading-snug">
                    {prog.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-400 mb-4 line-clamp-1">
                    {prog.engTitle}
                  </div>

                  <p className="font-body text-sm text-slate-600 leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  {/* Concentration / Tracks list */}
                  <div className="space-y-1.5 pt-4 border-t border-slate-200/70 mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="size-3" strokeWidth={2} />
                      <span>แขนงวิชาเฉพาะทาง</span>
                    </div>
                    {prog.tracks.map((track, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-slate-700 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]/70" />
                        <span>{track}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="text-slate-500 font-mono">{prog.duration}</span>
                  <Link
                    href={prog.href}
                    className="inline-flex items-center gap-1.5 text-[#C2410C] font-bold group-hover:translate-x-1 transition-transform"
                  >
                    <span>รายละเอียดหลักสูตร</span>
                    <ChevronRight className="size-3.5" strokeWidth={2.2} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Explore All Hub Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-[#0B132B] text-[#0B132B] hover:text-white font-medium text-sm transition-all duration-200"
        >
          <GraduationCap className="size-4" strokeWidth={1.75} />
          <span>ดูรายละเอียดหลักสูตรและเกณฑ์รับสมัครทั้งหมด</span>
          <ArrowRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
