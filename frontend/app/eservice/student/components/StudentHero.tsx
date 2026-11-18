'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  GraduationCap,
  HeartHandshake,
  BookOpen,
  FileText,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface StudentHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalServices: number;
  academicCount: number;
  welfareCount: number;
  totalDocs: number;
}

export default function StudentHero({
  searchQuery,
  onSearchChange,
  totalServices,
  academicCount,
  welfareCount,
  totalDocs,
}: StudentHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const statItems = [
    {
      label: 'ระบบบริการดิจิทัล',
      value: totalServices,
      suffix: ' ระบบ',
      icon: GraduationCap,
      desc: 'ศูนย์รวมระบบสารสนเทศกลาง มรภ.เชียงราย',
    },
    {
      label: 'การเรียน & ทะเบียน (REG)',
      value: academicCount,
      suffix: ' ระบบ',
      icon: BookOpen,
      desc: 'ลงทะเบียน ผลการเรียน และห้องเรียนออนไลน์',
    },
    {
      label: 'สวัสดิการ & กยศ.',
      value: welfareCount,
      suffix: ' บริการ',
      icon: HeartHandshake,
      desc: 'ทุนการศึกษา กิจกรรม และหอพักนักศึกษา',
    },
    {
      label: 'แบบฟอร์มคำร้องคณะ',
      value: totalDocs,
      suffix: ' ฉบับ',
      icon: FileText,
      desc: 'คลังคำร้องทางการและเอกสารฝึกงาน',
    },
  ];

  return (
    <section className="relative text-white pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0B132B] via-[#0E1726] to-[#0B132B]">
      {/* Subtle Hairline Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'บริการสำหรับนักศึกษา' },
            ]}
          />
        </div>

        <div className="max-w-4xl">
          {/* Eyebrow Label */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <Badge
              variant="outline"
              className="px-3 py-1 rounded-sm border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-medium tracking-wide uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              CRRU Student Digital Service Portal
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              | ศูนย์รวมบริการดิจิทัลและคลังคำร้องทางการ
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white mb-5"
          >
            บริการสำหรับนักศึกษา <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              เข้าถึงทุกระบบการเรียนรู้และคำร้องทางการในที่เดียว
            </span>
          </motion.h1>

          {/* Lead Paragraph */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-3xl mb-8"
          >
            ศูนย์รวมช่องทางเข้าสู่ระบบสารสนเทศกลาง มหาวิทยาลัยราชภัฏเชียงราย
            (ระบบทะเบียน REG, ระบบข้อมูลนักศึกษา ORASIS, ห้องเรียนดิจิทัล LMS, เครือข่ายอินเทอร์เน็ต WiFi)
            และคลังแบบฟอร์มคำร้องทางการของคณะสังคมศาสตร์
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl relative"
          >
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ค้นหาระบบบริการ เช่น ลงทะเบียน, LMS, เกรด, กยศ., แบบฟอร์มคำร้อง..."
                className="w-full pl-12 pr-10 py-3.5 h-12 bg-slate-900/80 text-white rounded-sm border border-slate-700/80 focus-visible:ring-primary focus-visible:border-primary text-sm sm:text-base placeholder:text-slate-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-sm"
                  title="ล้างการค้นหา"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-amber-300/90 mt-2 font-mono">
                กำลังกรองคำค้นหา: &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </motion.div>
        </div>

        {/* Stats Ribbon */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-slate-800/90 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {statItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-sm bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm relative group hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-amber-400/90 mb-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                  <span className="text-xs sm:text-sm font-normal text-slate-400 ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-light line-clamp-1">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
