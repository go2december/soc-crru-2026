'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, FileText, Sparkles, MapPin, Target, Users, BookOpen } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AcademicServicesHeroProps {
  totalProjects: number;
  totalCommunities: number;
  uniqueSdgsCount: number;
  totalFaculty: number;
}

export default function AcademicServicesHero({
  totalProjects,
  totalCommunities,
  uniqueSdgsCount,
  totalFaculty,
}: AcademicServicesHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToDirectory = () => {
    const el = document.getElementById('academic-services-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statItems = [
    {
      label: 'โครงการบริการวิชาการ',
      value: totalProjects,
      suffix: '+',
      icon: BookOpen,
      desc: 'ขับเคลื่อนทั่วภาคเหนือตอนบน',
    },
    {
      label: 'ชุมชนและพื้นที่เป้าหมาย',
      value: totalCommunities,
      suffix: ' แห่ง',
      icon: MapPin,
      desc: 'ร่วมสร้างความเข้มแข็งท้องถิ่น',
    },
    {
      label: 'เป้าหมาย SDGs ร่วม',
      value: uniqueSdgsCount,
      suffix: ' เป้าหมาย',
      icon: Target,
      desc: 'ตอบสนองการพัฒนาที่ยั่งยืน',
    },
    {
      label: 'คณาจารย์และผู้เชี่ยวชาญ',
      value: totalFaculty,
      suffix: ' ท่าน',
      icon: Users,
      desc: 'พร้อมถ่ายทอดองค์ความรู้',
    },
  ];

  return (
    <section className="relative text-white pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0B132B] via-[#0E1726] to-[#0B132B]">
      {/* Editorial Hairline Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและนวัตกรรม', href: '/research' },
              { label: 'บริการวิชาการแก่สังคม' },
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
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Social Engagement & Living Knowledge
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              | พันธกิจสัมพันธ์มหาวิทยาลัยเพื่อสังคม
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white mb-5"
          >
            บริการวิชาการแก่สังคม <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              ขับเคลื่อนชุมชนด้วยองค์ความรู้ร่วมสมัย
            </span>
          </motion.h1>

          {/* Lead Paragraph */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-3xl mb-8"
          >
            เชื่อมโยงงานวิจัย นวัตกรรมทางสังคม และองค์ความรู้ด้านสังคมศาสตร์
            สู่วิถีชีวิตของชุมชนท้องถิ่นในเชียงรายและอนุภูมิภาคลุ่มน้ำโขง
            เพื่อยกระดับคุณภาพชีวิต สร้างคุณค่าร่วม และตอบโจทย์เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <Button
              onClick={handleScrollToDirectory}
              className="bg-primary hover:bg-[#9A3412] text-white font-medium rounded-sm shadow-sm px-6 py-2.5 h-auto transition-transform active:scale-[0.98] gap-2"
            >
              <span>สำรวจโครงการบริการวิชาการ</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-100 hover:text-white rounded-sm px-5 py-2.5 h-auto transition-all"
            >
              <Link href="/research/services/request" className="inline-flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>ยื่นคำขอรับบริการ / วิทยากร</span>
              </Link>
            </Button>
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
