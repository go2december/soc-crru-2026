"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "motion/react";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check for user's reduced-motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", {
        opacity: 0,
        y: -15,
        duration: 0.6,
        delay: 0.1,
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 35,
            duration: 0.85,
            stagger: 0.08,
          },
          "-=0.3"
        )
        .from(
          subtextRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-stat-card",
          {
            opacity: 0,
            y: 25,
            stagger: 0.1,
            duration: 0.7,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#F8FAFC] pt-12 pb-18 sm:pt-16 sm:pb-24 border-b border-slate-200/80"
    >
      {/* Subtle Atmospheric Canvas Backdrop (No AI neon gradient blobs) */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-40">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-slate-200/60 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(#0B132B 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tag Announcement */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">
            เปิดรับสมัครนักศึกษาใหม่ TCAS 2569 รอบ Portfolio
          </span>
          <span className="text-slate-300">|</span>
          <Link
            href="/admissions"
            className="text-xs font-semibold text-[#C2410C] flex items-center gap-1 hover:underline"
          >
            <span>รายละเอียด</span>
            <ChevronRight className="size-3" strokeWidth={2} />
          </Link>
        </div>

        {/* Editorial Typographic Headline */}
        <div className="max-w-4xl">
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B132B] leading-[1.12] mb-6"
          >
            ศาสตร์แห่งมนุษย์และสังคม <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B132B] via-[#C2410C] to-[#C2410C]">
              เพื่อการพัฒนาล้านนาสู่สากล
            </span>
          </h1>

          <p
            ref={subtextRef}
            className="font-body text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10"
          >
            สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
            มุ่งสร้างบัณฑิตนักปฏิบัติที่มีจิตสำนึกชุมชน เข้าใจพลวัตสังคมโลก
            และขับเคลื่อนการพัฒนาอย่างยั่งยืน
          </p>

          {/* Action CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#programs-showcase"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-white font-medium text-base shadow-sm hover:shadow-md transition-all"
              >
                <span>สำรวจหลักสูตรทั้งหมด</span>
                <ArrowRight className="size-4 text-[#C2410C]" strokeWidth={2.2} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0B132B] font-medium text-base shadow-xs transition-colors"
              >
                <Sparkles className="size-4 text-[#C2410C]" strokeWidth={1.75} />
                <span>สมัครเข้าศึกษา 2569</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Real Metrics Highlight Bar */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs"
        >
          <div className="hero-stat-card p-4 border-r border-slate-100 last:border-0">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <GraduationCap className="size-4 text-[#C2410C]" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wider">Programs</span>
            </div>
            <div className="text-3xl font-extrabold text-[#0B132B]">7</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              สาขาวิชา ป.ตรี-โท-เอก
            </div>
          </div>

          <div className="hero-stat-card p-4 border-r border-slate-100 last:border-0">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Award className="size-4 text-[#C2410C]" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wider">Employability</span>
            </div>
            <div className="text-3xl font-extrabold text-[#C2410C]">94.8%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              อัตราการได้งานทำของบัณฑิต
            </div>
          </div>

          <div className="hero-stat-card p-4 border-r border-slate-100 last:border-0">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="size-4 text-[#C2410C]" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wider">Partnership</span>
            </div>
            <div className="text-3xl font-extrabold text-[#0B132B]">40+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              เครือข่ายความร่วมมือชุมชน
            </div>
          </div>

          <div className="hero-stat-card p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Sparkles className="size-4 text-[#581C87]" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#581C87]">Heritage</span>
            </div>
            <div className="text-3xl font-extrabold text-[#581C87]">100%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              อาจารย์ผู้ทรงคุณวุฒิ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
