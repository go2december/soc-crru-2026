"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Megaphone,
  Pause,
  Play,
} from "lucide-react";
import { SiteSettings } from "@/lib/site-settings";
import { BannerItem } from "@/lib/banners";
import { getAssetUrl } from "@/lib/api-config";

interface HeroProps {
  settings: SiteSettings;
  banners: BannerItem[];
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: -1,
    title: "เปิดรับสมัครนักศึกษาใหม่ คณะสังคมศาสตร์",
    subtitle: "หลักสูตรระดับปริญญาตรี ปริญญาโท และปริญญาเอก ประจำปีการศึกษา 2569",
    badgeText: "ประชาสัมพันธ์",
    imageUrl: "/images/admission-brochure.png",
    linkUrl: "/admissions",
    order: 1,
    isActive: true,
  },
  {
    id: -2,
    title: "หลักสูตรที่มุ่งสร้างบัณฑิตนักปฏิบัติ",
    subtitle: "5 สาขาวิชาปริญญาตรี และหลักสูตรบัณฑิตศึกษาด้านการพัฒนาภูมิภาค",
    badgeText: "หลักสูตร",
    imageUrl: "/images/startup-banner.png",
    linkUrl: "/programs",
    order: 2,
    isActive: true,
  },
  {
    id: -3,
    title: "ศูนย์วิจัยและนวัตกรรมเพื่อการพัฒนาท้องถิ่น",
    subtitle: "ขับเคลื่อนองค์ความรู้และงานวิจัยรับใช้สังคมสู่ความยั่งยืนในอนุภูมิภาคลุ่มน้ำโขง",
    badgeText: "วิจัยและนวัตกรรม",
    imageUrl: "/images/research-banner.png",
    linkUrl: "/research",
    order: 3,
    isActive: true,
  },
  {
    id: -4,
    title: "เทคโนโลยีภูมิสารสนเทศและนวัตกรรมสังคม",
    subtitle: "ผสานศาสตร์ทางสังคมเข้ากับเทคโนโลยีดิจิทัลและข้อมูลเชิงพื้นที่สมัยใหม่",
    badgeText: "นวัตกรรม",
    imageUrl: "/images/programs/gis.jpg",
    linkUrl: "/programs",
    order: 4,
    isActive: true,
  },
  {
    id: -5,
    title: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    subtitle: "ศูนย์กลางการเรียนรู้และการพัฒนาสังคมอย่างยั่งยืนในภาคเหนือ",
    badgeText: "แนะนำคณะ",
    imageUrl: "/images/history-banner.png",
    linkUrl: "/about",
    order: 5,
    isActive: true,
  },
];

export default function Hero({ settings, banners }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const safeIndex = currentIndex % slides.length;
  const activeBanner = slides[safeIndex];

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, prefersReducedMotion, nextSlide]);

  return (
    <section className="w-full bg-white border-b border-slate-200">
      {/* Institutional Announcement Strip (full-width bar when active) */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <div className="w-full bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Megaphone className="size-4 text-[#C2410C] shrink-0" strokeWidth={1.75} />
              <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                {settings.announcementText}
              </span>
            </div>
            {settings.announcementLink && (
              <Link
                href={settings.announcementLink}
                className="text-xs font-semibold text-[#C2410C] inline-flex items-center gap-1 hover:underline shrink-0"
              >
                <span>อ่านประกาศ</span>
                <ChevronRight className="size-3.5" strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Full-Bleed PR Slide */}
      <div
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prevSlide();
          if (e.key === "ArrowRight") nextSlide();
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="แบนเนอร์ประชาสัมพันธ์คณะสังคมศาสตร์"
      >
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] bg-[#0B132B] overflow-hidden">
          {activeBanner && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBanner.id}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.3, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.3 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={getAssetUrl(activeBanner.imageUrl)}
                    alt={activeBanner.title || "แบนเนอร์ประชาสัมพันธ์คณะสังคมศาสตร์"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/35 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Top-Right Controls aligned to content container */}
              <div className="absolute inset-x-0 top-5 z-20 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-2">
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsPaused((p) => !p)}
                      className="pointer-events-auto size-8 rounded-sm bg-[#0B132B]/75 backdrop-blur-xs border border-white/15 text-white flex items-center justify-center hover:bg-[#0B132B] transition-colors"
                      aria-label={isPaused ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์ชั่วคราว"}
                    >
                      {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                    </button>
                  )}
                  <div className="pointer-events-auto px-2.5 py-1 rounded-sm bg-[#0B132B]/75 backdrop-blur-xs border border-white/15 text-white font-mono text-xs font-semibold tabular-nums">
                    {String(safeIndex + 1).padStart(2, "0")} /{" "}
                    {String(slides.length).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Bottom Caption & Navigation aligned to content container */}
              <div className="absolute inset-x-0 bottom-0 z-20 py-7 sm:py-10 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                  <div className="space-y-2.5 max-w-2xl min-w-0">
                    {activeBanner.badgeText && (
                      <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#C2410C] text-white text-xs font-semibold">
                        {activeBanner.badgeText}
                      </span>
                    )}
                    {activeBanner.title && (
                      <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight line-clamp-2 drop-shadow-xs">
                        {activeBanner.title}
                      </h1>
                    )}
                    {activeBanner.subtitle && (
                      <p className="text-xs sm:text-base text-slate-200 line-clamp-2 max-w-xl">
                        {activeBanner.subtitle}
                      </p>
                    )}
                    {activeBanner.linkUrl && (
                      <div className="pt-1">
                        <Link
                          href={activeBanner.linkUrl}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#C2410C] hover:bg-[#C2410C]/90 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                        >
                          <span>ดูรายละเอียด</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {slides.length > 1 && (
                    <div className="flex items-center gap-1.5 shrink-0 self-end">
                      <button
                        type="button"
                        onClick={prevSlide}
                        className="size-10 rounded-sm bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center transition-all"
                        aria-label="สไลด์ก่อนหน้า"
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        className="size-10 rounded-sm bg-white/15 hover:bg-[#C2410C] active:scale-95 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center transition-all"
                        aria-label="สไลด์ถัดไป"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Compact Editorial Index Bar (supports any number of slides) */}
        {slides.length > 1 && (
          <div className="w-full bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto divide-x divide-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {slides.map((slide, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative text-left py-2.5 px-3 min-w-[165px] sm:min-w-[130px] flex-1 shrink-0 flex items-center gap-2 transition-colors ${
                      isActive ? "bg-orange-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={prefersReducedMotion ? undefined : "hero-bar-indicator"}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-x-0 top-0 h-0.5 bg-[#C2410C]"
                      />
                    )}
                    <span
                      className={`font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                        isActive ? "text-[#C2410C]" : "text-slate-400"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? "text-[#0B132B]" : "text-slate-600"
                      }`}
                    >
                      {slide.title || "แบนเนอร์ประชาสัมพันธ์"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
