"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Users,
  Compass,
  HeartHandshake,
  BookOpen,
  Coffee,
  ArrowRight,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Program, getAssetUrl } from "@/lib/api";

export interface ProgramItem {
  id: string;
  degree: string;
  degreeType: "saffron" | "slate" | "lotus";
  title: string;
  engTitle: string;
  description: string;
  duration: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: typeof Users;
}

const fallbackImageByCode: Record<string, string> = {
  "social-dev": "/images/programs/social-dev.jpg",
  gis: "/images/programs/gis.jpg",
  "social-psych": "/images/programs/social-psych.jpg",
  "social-sci": "/images/programs/social-sci.jpg",
  "home-eco": "/images/programs/home-eco.jpg",
  "regional-dev": "/images/programs/regional-dev.jpg",
  "regional-dev-ma": "/images/programs/regional-dev.jpg",
  "regional-dev-phd": "/images/programs/regional-dev.jpg",
};

const iconByCode: Record<string, typeof Users> = {
  "social-dev": Users,
  gis: Compass,
  "social-psych": HeartHandshake,
  "social-sci": BookOpen,
  "home-eco": Coffee,
  "regional-dev": GraduationCap,
  "regional-dev-ma": GraduationCap,
  "regional-dev-phd": GraduationCap,
};

const defaultPrograms: ProgramItem[] = [
  {
    id: "social-dev",
    degree: "ศศ.บ. 4 ปี",
    degreeType: "saffron",
    title: "นวัตกรรมการพัฒนาสังคม",
    engTitle: "Social Innovation & Community Development",
    description:
      "สร้างผู้นำการเปลี่ยนแปลง การจัดการโครงการพัฒนา และการวิจัยนโยบายชุมชนท้องถิ่นสู่ระดับสากล",
    duration: "4 ปี · 126 หน่วยกิต",
    href: "/programs/social-dev",
    image: "/images/programs/social-dev.jpg",
    imageAlt: "นักศึกษาและนักวิจัยร่วมออกแบบนวัตกรรมพัฒนาชุมชนท้องถิ่น",
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
    duration: "4 ปี · 130 หน่วยกิต",
    href: "/programs/gis",
    image: "/images/programs/gis.jpg",
    imageAlt: "การวิเคราะห์ข้อมูลภูมิสารสนเทศ แผนที่ดิจิทัล และเทคโนโลยีโดรนสำรวจ",
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
    duration: "4 ปี · 128 หน่วยกิต",
    href: "/programs/social-psych",
    image: "/images/programs/social-psych.jpg",
    imageAlt: "ห้องปฏิบัติการจิตวิทยาสังคมและการให้คำปรึกษาเพื่อสุขภาวะ",
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
    duration: "4 ปี · 124 หน่วยกิต",
    href: "/programs/social-sci",
    image: "/images/programs/social-sci.jpg",
    imageAlt: "ห้องสัมมนานโยบายสาธารณะและสังคมศาสตร์ลุ่มน้ำโขง",
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
    duration: "4 ปี · 125 หน่วยกิต",
    href: "/programs/home-eco",
    image: "/images/programs/home-eco.jpg",
    imageAlt: "นวัตกรรมอาหารล้านนาและศิลปะการจัดเลี้ยงเชิงสร้างสรรค์",
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
    duration: "2 - 3 ปี",
    href: "/programs/regional-dev-ma",
    image: "/images/programs/regional-dev.jpg",
    imageAlt: "ห้องวิจัยยุทธศาสตร์การพัฒนาภูมิภาคและอนุภูมิภาคลุ่มน้ำโขง",
    icon: GraduationCap,
  },
];

function mapApiProgramToItem(p: Program, idx: number): ProgramItem {
  const isGrad =
    p.degreeLevel === "MASTER" || p.degreeLevel === "DOCTORAL" || p.degreeLevel === "PHD";

  let degreeLabel = "ศศ.บ. 4 ปี";
  if (p.degreeLevel === "MASTER") {
    degreeLabel = "ศศ.ม.";
  } else if (p.degreeLevel === "DOCTORAL" || p.degreeLevel === "PHD") {
    degreeLabel = "ปร.ด.";
  } else if (p.degreeTitleTh?.includes("วิทยาศาสตรบัณฑิต") || p.code === "gis") {
    degreeLabel = "วท.บ. 4 ปี";
  }

  const durationBase = isGrad ? "2 - 3 ปี" : "4 ปี";
  const duration = p.structure?.totalCredits
    ? `${durationBase} · ${p.structure.totalCredits} หน่วยกิต`
    : durationBase;

  const resolvedImage = p.bannerUrl
    ? getAssetUrl(p.bannerUrl)
    : fallbackImageByCode[p.code] || "/images/programs/social-dev.jpg";

  return {
    id: p.code || p.id,
    degree: degreeLabel,
    degreeType: isGrad ? "lotus" : idx % 2 === 0 ? "saffron" : "slate",
    title: p.nameTh,
    engTitle: p.degreeTitleEn || p.code,
    description: p.description || "",
    duration,
    href: `/programs/${p.code}`,
    image: resolvedImage,
    imageAlt: `ภาพประกอบหลักสูตร ${p.nameTh}`,
    icon: iconByCode[p.code] || GraduationCap,
  };
}

const tabs = [
  { id: "all" as const, label: "ทั้งหมด" },
  { id: "ug" as const, label: "ปริญญาตรี" },
  { id: "grad" as const, label: "บัณฑิตศึกษา" },
];

const degreeOrder: Record<string, number> = {
  BACHELOR: 1,
  MASTER: 2,
  DOCTORAL: 3,
  PHD: 3,
};

export default function CurriculumDeck({
  apiPrograms,
}: {
  apiPrograms?: (Program & { isActive?: boolean })[];
}) {
  const [activeTab, setActiveTab] = useState<"all" | "ug" | "grad">("all");
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const items = useMemo(() => {
    if (!apiPrograms || apiPrograms.length === 0) return defaultPrograms;
    const activeOnly = apiPrograms
      .filter((p) => p.isActive !== false)
      .sort(
        (a, b) =>
          (degreeOrder[a.degreeLevel] ?? 99) - (degreeOrder[b.degreeLevel] ?? 99)
      );
    if (activeOnly.length === 0) return defaultPrograms;
    return activeOnly.map(mapApiProgramToItem);
  }, [apiPrograms]);

  const ugCount = items.filter((p) => p.degreeType !== "lotus").length;
  const gradCount = items.filter((p) => p.degreeType === "lotus").length;

  const filteredPrograms = useMemo(() => {
    if (activeTab === "ug") return items.filter((p) => p.degreeType !== "lotus");
    if (activeTab === "grad") return items.filter((p) => p.degreeType === "lotus");
    return items;
  }, [items, activeTab]);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 2) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setScrollProgress(1);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
    setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    const raf = requestAnimationFrame(updateScrollState);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, filteredPrograms.length, updateScrollState]);

  useEffect(() => {
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 380);
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.isDown) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > 6) {
      if (!drag.hasMoved) {
        drag.hasMoved = true;
        setIsDragging(true);
      }
      el.scrollLeft = drag.scrollLeft - delta;
    }
  };

  const endMouseDrag = () => {
    if (!dragStateRef.current.isDown) return;
    dragStateRef.current.isDown = false;
    setIsDragging(false);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragStateRef.current.hasMoved = false;
    }
  };

  const getTabCount = (id: "all" | "ug" | "grad") => {
    if (id === "ug") return ugCount;
    if (id === "grad") return gradCount;
    return items.length;
  };

  return (
    <section
      id="programs-showcase"
      aria-labelledby="programs-heading"
      className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C2410C] tracking-wide mb-2">
              <span className="w-5 h-[2px] bg-[#C2410C]" aria-hidden="true" />
              <span>หลักสูตรที่เปิดสอน · คณะสังคมศาสตร์</span>
            </div>
            <h2
              id="programs-heading"
              className="text-2xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight leading-tight"
            >
              หลักสูตรระดับปริญญาตรี โท และเอก
            </h2>
            <p className="font-body text-slate-600 mt-2 text-sm sm:text-base">
              เลือกเส้นทางการเรียนที่ใช่ ทั้งสายสังคม เทคโนโลยี และนวัตกรรม
            </p>
          </div>

          {/* Filter Tabs + Arrow Controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
            <div
              role="tablist"
              aria-label="กรองหลักสูตรตามระดับการศึกษา"
              className="inline-flex items-center gap-1 p-1 rounded-sm bg-white border border-slate-200 text-xs font-semibold"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3.5 py-2 rounded-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-1 ${
                      isActive ? "text-white" : "text-slate-600 hover:text-[#0B132B]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="curriculum-tab-pill"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 34 }
                        }
                        className="absolute inset-0 bg-[#0B132B] rounded-sm"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">
                      {tab.label} ({getTabCount(tab.id)})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Filmstrip Buttons */}
            <div className="inline-flex items-center gap-1.5">
              <motion.button
                type="button"
                aria-label="เลื่อนดูหลักสูตรก่อนหน้า"
                disabled={!canScrollLeft}
                onClick={() => scrollByCard("prev")}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                className="w-9 h-9 rounded-sm border border-slate-200 bg-white text-[#0B132B] flex items-center justify-center transition-colors hover:border-[#C2410C] hover:text-[#C2410C] disabled:opacity-35 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </motion.button>
              <motion.button
                type="button"
                aria-label="เลื่อนดูหลักสูตรถัดไป"
                disabled={!canScrollRight}
                onClick={() => scrollByCard("next")}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                className="w-9 h-9 rounded-sm border border-slate-200 bg-white text-[#0B132B] flex items-center justify-center transition-colors hover:border-[#C2410C] hover:text-[#C2410C] disabled:opacity-35 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Single-Row Editorial Filmstrip */}
        {filteredPrograms.length === 0 ? (
          <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            ยังไม่มีข้อมูลหลักสูตรในหมวดหมู่นี้
          </div>
        ) : (
          <>
            <div
              ref={trackRef}
              onScroll={updateScrollState}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endMouseDrag}
              onPointerCancel={endMouseDrag}
              onPointerLeave={endMouseDrag}
              onClickCapture={handleClickCapture}
              className={`flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isDragging
                  ? "cursor-grabbing select-none snap-none scroll-auto"
                  : "cursor-grab snap-x snap-mandatory scroll-smooth"
              }`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredPrograms.map((prog, idx) => {
                  const Icon = prog.icon;
                  const isGrad = prog.degreeType === "lotus";
                  const isDynamicAsset =
                    prog.image.startsWith("/uploads/") || prog.image.startsWith("http");

                  const accentBar =
                    prog.degreeType === "saffron"
                      ? "bg-[#C2410C]"
                      : isGrad
                        ? "bg-[#581C87]"
                        : "bg-[#0B132B]";

                  return (
                    <motion.div
                      key={prog.id}
                      layout={!shouldReduceMotion}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.3,
                              delay: Math.min(idx * 0.04, 0.2),
                              ease: [0.22, 1, 0.36, 1],
                            }
                      }
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                      className="snap-start shrink-0 w-[82vw] sm:w-[330px] lg:w-[360px]"
                    >
                      <Link
                        href={prog.href}
                        draggable={false}
                        className={`group relative h-full overflow-hidden rounded-sm border transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 ${
                          isGrad
                            ? "bg-[#0B132B] border-[#0B132B] text-white hover:border-[#581C87] hover:shadow-xl"
                            : "bg-white border-slate-200 text-[#0B132B] hover:border-[#C2410C] hover:shadow-lg"
                        }`}
                      >
                        <div>
                          {/* Top Accent Hairline */}
                          <div className={`h-1 w-full ${accentBar}`} />

                          {/* 16:10 Program Image Frame */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                            <Image
                              src={prog.image}
                              alt={prog.imageAlt}
                              fill
                              draggable={false}
                              unoptimized={isDynamicAsset}
                              sizes="(max-width: 640px) 82vw, 360px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/70 via-[#0B132B]/10 to-transparent pointer-events-none"
                              aria-hidden="true"
                            />

                            {/* Index & Icon */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#0B132B]/85 text-white font-mono text-[11px] font-bold tracking-wider">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <div
                                className={`w-8 h-8 rounded-sm flex items-center justify-center border transition-colors ${
                                  isGrad
                                    ? "bg-[#581C87]/90 border-white/20 text-white"
                                    : "bg-white/95 border-slate-200/80 text-[#0B132B] group-hover:text-[#C2410C]"
                                }`}
                              >
                                <Icon className="size-4" strokeWidth={1.8} />
                              </div>
                            </div>

                            {/* Degree Badge on Image Bottom-Left */}
                            <div className="absolute bottom-3 left-3">
                              <Badge
                                variant={prog.degreeType}
                                className={
                                  isGrad
                                    ? "rounded-sm bg-[#581C87] text-white border-[#581C87]"
                                    : "rounded-sm bg-white/95 text-[#0B132B] border-white/60"
                                }
                              >
                                {prog.degree}
                              </Badge>
                            </div>
                          </div>

                          {/* Concise Editorial Body */}
                          <div className="p-5 min-w-0">
                            <h3
                              className={`text-lg font-bold leading-snug mb-1 line-clamp-1 transition-colors ${
                                isGrad
                                  ? "text-white group-hover:text-amber-300"
                                  : "text-[#0B132B] group-hover:text-[#C2410C]"
                              }`}
                            >
                              {prog.title}
                            </h3>
                            <div className="text-xs font-medium text-slate-400 mb-2.5 line-clamp-1">
                              {prog.engTitle}
                            </div>
                            <p
                              className={`font-body text-sm leading-relaxed line-clamp-2 ${
                                isGrad ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              {prog.description}
                            </p>
                          </div>
                        </div>

                        {/* Compact Card Footer + Hover Saffron Sweep */}
                        <div className="relative px-5 pb-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold">
                          <span
                            className={`font-mono text-[11px] ${
                              isGrad ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {prog.duration}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform ${
                              isGrad ? "text-amber-300" : "text-[#C2410C]"
                            }`}
                          >
                            <span>ดูรายละเอียด</span>
                            <ChevronRight className="size-3.5" strokeWidth={2.2} />
                          </span>

                          {/* Animated Bottom Sweep */}
                          <span
                            className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                              isGrad ? "bg-amber-400" : "bg-[#C2410C]"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Filmstrip Progress Bar & All Programs CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:max-w-xs flex items-center gap-3">
                <div className="flex-1 h-1 bg-slate-200 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#C2410C] transition-all duration-200 ease-out"
                    style={{ width: `${Math.max(18, Math.round(scrollProgress * 100))}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">
                  {filteredPrograms.length} หลักสูตร
                </span>
              </div>

              <Link
                href="/programs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#0B132B] hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 shrink-0"
              >
                <GraduationCap className="size-4 text-[#C2410C]" strokeWidth={1.75} />
                <span>ดูหลักสูตรและเกณฑ์รับสมัครทั้งหมด</span>
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
