'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, Handshake, Globe, Building2, Users2, Landmark } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MouHeroProps {
  totalMous: number;
  govCount: number;
  communityCount: number;
  academicCount: number;
  privateCount: number;
}

export default function MouHero({
  totalMous,
  govCount,
  communityCount,
  academicCount,
  privateCount,
}: MouHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToDirectory = () => {
    const el = document.getElementById('mou-directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statItems = [
    {
      label: 'บันทึกข้อตกลงทั้งหมด',
      value: totalMous,
      suffix: ' ฉบับ',
      icon: Handshake,
      desc: 'เครือข่ายความร่วมมือที่มีผลบังคับใช้',
    },
    {
      label: 'ภาครัฐและองค์กรปกครองท้องถิ่น',
      value: govCount,
      suffix: ' หน่วยงาน',
      icon: Landmark,
      desc: 'ขับเคลื่อนนโยบายและการพัฒนาเชิงพื้นที่',
    },
    {
      label: 'ประชาสังคมและชุมชน',
      value: communityCount,
      suffix: ' ภาคี',
      icon: Users2,
      desc: 'ยกระดับคุณภาพชีวิตและภูมิปัญญาท้องถิ่น',
    },
    {
      label: 'สถาบันการศึกษา & นานาชาติ',
      value: academicCount + privateCount,
      suffix: ' แห่ง',
      icon: Globe,
      desc: 'บูรณาการการวิจัย วิชาการ และเอกชน',
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
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและบริการวิชาการ', href: '/research' },
              { label: 'เครือข่ายความร่วมมือและ MOU' },
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
              <Handshake className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Strategic Alliances & Memorandums of Understanding
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              | เครือข่ายความร่วมมือเพื่อการพัฒนาที่ยั่งยืน
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white mb-5"
          >
            เครือข่ายความร่วมมือและ MOU <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              ประสานพลังวิชาการ ขับเคลื่อนสังคมสู่ความยั่งยืน
            </span>
          </motion.h1>

          {/* Lead Paragraph */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-3xl mb-8"
          >
            คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ร่วมมือกับองค์กรภาครัฐ องค์กรปกครองส่วนท้องถิ่น
            ภาคประชาสังคม สถาบันการศึกษาทั้งในและต่างประเทศ รวมถึงภาคเอกชน
            เพื่อส่งเสริมการวิจัยร่วม การบริการวิชาการ การพัฒนาศักยภาพชุมชน และการแลกเปลี่ยนเรียนรู้ในระดับสากล
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
              <span>สืบค้นภาคีและข้อตกลงความร่วมมือ</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-100 hover:text-white rounded-sm px-5 py-2.5 h-auto transition-all"
            >
              <a href="#partnership-inquiry" className="inline-flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>ประสานความร่วมมือใหม่</span>
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats Ribbon */}
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
