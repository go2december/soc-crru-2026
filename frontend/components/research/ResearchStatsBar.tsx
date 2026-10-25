'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Globe2, Users, FileCheck2 } from 'lucide-react';
import type { ResearchStatsResponse } from '@/lib/research';

interface ResearchStatsBarProps {
  stats: ResearchStatsResponse | null;
}

export default function ResearchStatsBar({ stats }: ResearchStatsBarProps) {
  const totalProjects = stats?.total && stats.total > 0 ? `${stats.total}+` : '100+';
  const socialProjects = stats?.socialServiceCount && stats.socialServiceCount > 0 ? `${stats.socialServiceCount}+` : '50+';
  const outputsCount = stats?.outputCount && stats.outputCount > 0 ? `${stats.outputCount}+` : '40+';
  const sdgsCount = '17';

  const statItems = [
    {
      number: totalProjects,
      label: 'โครงการวิจัยและวิทยานิพนธ์',
      subtext: 'ครอบคลุมงานพัฒนาท้องถิ่น',
      icon: BookOpen,
      color: 'text-amber-400',
    },
    {
      number: outputsCount,
      label: 'ผลงานตีพิมพ์และบทความวิชาการ',
      subtext: 'ระดับชาติและนานาชาติ TCI / Scopus',
      icon: FileCheck2,
      color: 'text-emerald-400',
    },
    {
      number: socialProjects,
      label: 'ชุมชนและองค์กรรับบริการวิชาการ',
      subtext: 'ขับเคลื่อนคุณภาพชีวิตฐานราก',
      icon: Users,
      color: 'text-sky-400',
    },
    {
      number: sdgsCount,
      label: 'เป้าหมาย SDGs ที่บูรณาการ',
      subtext: 'เพื่อการพัฒนาที่ยั่งยืน 100%',
      icon: Globe2,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 pt-8 border-t border-slate-800/80">
      {statItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + idx * 0.06 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs hover:border-white/10 hover:bg-white/[0.08] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <IconComponent className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                {item.number}
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-200 mt-0.5 line-clamp-1">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 hidden sm:block">
                {item.subtext}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
