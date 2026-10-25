'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Database, Lightbulb, Handshake, BookCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResearchPillar {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge: string;
  theme: {
    border: string;
    badgeVariant: 'subtle' | 'saffron' | 'outline' | 'slate';
    badgeColor: string;
    iconBg: string;
    iconColor: string;
    hoverText: string;
  };
  features: string[];
}

const PILLARS: ResearchPillar[] = [
  {
    title: 'ฐานข้อมูลงานวิจัยและวิทยานิพนธ์',
    subtitle: 'Research Database & Thesis Repository',
    description: 'ศูนย์สืบค้นผลงานวิจัย บทความวิชาการ และวิทยานิพนธ์ของคณาจารย์และนักศึกษา พร้อมจำแนกตามเป้าหมายการพัฒนาที่ยั่งยืน (SDGs)',
    icon: Database,
    href: '/research/database',
    badge: 'คลังข้อมูลดิจิทัล',
    theme: {
      border: 'hover:border-blue-500/40',
      badgeVariant: 'subtle',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverText: 'group-hover:text-blue-700',
    },
    features: ['สืบค้นตามปีและหัวข้อวิจัย', 'จำแนกตามเป้าหมาย 17 SDGs', 'ดาวน์โหลดเอกสารฉบับเต็ม / บทสรุป'],
  },
  {
    title: 'วารสารสังคมศาสตร์วิชาการ',
    subtitle: 'Journal of Social Academic (ThaiJO)',
    description: 'วารสารวิชาการระดับชาติด้านสังคมศาสตร์ มนุษยศาสตร์ และการพัฒนาท้องถิ่น ดัชนี TCI เผยแพร่และส่งบทความผ่านระบบ ThaiJO',
    icon: BookCheck,
    href: '/research/journal',
    badge: 'ระบบ ThaiJO / TCI',
    theme: {
      border: 'hover:border-emerald-500/40',
      badgeVariant: 'subtle',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverText: 'group-hover:text-emerald-700',
    },
    features: ['รับตีพิมพ์บทความวิชาการ/วิจัย', 'เกณฑ์มาตรฐาน Peer Review', 'เข้าสู่ระบบส่งบทความ ThaiJO'],
  },
  {
    title: 'ศูนย์บริการวิชาการเพื่อสังคม',
    subtitle: 'Academic Services & Community Impact',
    description: 'โครงการขับเคลื่อนองค์ความรู้สู่ชุมชนท้องถิ่น การพัฒนาเศรษฐกิจฐานราก ห้องปฏิบัติการทางสังคม และงานบริการวิชาการแบบมีส่วนร่วม',
    icon: Lightbulb,
    href: '/research/services',
    badge: 'พันธกิจเพื่อสังคม',
    theme: {
      border: 'hover:border-amber-500/40',
      badgeVariant: 'saffron',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      hoverText: 'group-hover:text-amber-700',
    },
    features: ['ถ่ายทอดเทคโนโลยีและองค์ความรู้', 'ยกระดับผลิตภัณฑ์ชุมชนท้องถิ่น', 'ยื่นคำขอรับบริการวิชาการออนไลน์'],
  },
  {
    title: 'เครือข่ายความร่วมมือและ MOU',
    subtitle: 'Partnerships & Cooperation Network',
    description: 'บันทึกข้อตกลงความร่วมมือทางวิชาการและการพัฒนาสังคม ร่วมกับหน่วยงานภาครัฐ ภาคประชาสังคม สถาบันการศึกษา และเอกชน',
    icon: Handshake,
    href: '/research/mou',
    badge: 'ภาคีความร่วมมือ',
    theme: {
      border: 'hover:border-teal-500/40',
      badgeVariant: 'subtle',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      hoverText: 'group-hover:text-teal-700',
    },
    features: ['เครือข่ายระดับชาติและนานาชาติ', 'ความร่วมมือด้านงานวิจัยและฝึกอบรม', 'แลกเปลี่ยนทางวิชาการและวัฒนธรรม'],
  },
];

export default function ResearchPillarsGrid() {
  return (
    <section className="mt-16 sm:mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="subtle" className="text-xs uppercase tracking-wider mb-3">
          Institutional Research Ecosystem
        </Badge>
        <h2 className="text-2xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">
          4 เสาหลักพันธกิจวิจัยและบริการวิชาการ
        </h2>
        <p className="text-sm md:text-base text-slate-600 mt-2 font-light leading-relaxed">
          โครงสร้างการดำเนินงานทางวิชาการที่เชื่อมโยงการสร้างองค์ความรู้ใหม่ การเผยแพร่ระดับสากล 
          การนำไปใช้ประโยชน์ในชุมชน และการผสานเครือข่ายความร่วมมือ
        </p>
      </div>

      {/* Pillars Grid with Staggered Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {PILLARS.map((pillar, idx) => {
          const IconComponent = pillar.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex"
            >
              <Link
                href={pillar.href}
                className={`group flex-1 flex flex-col justify-between bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow ${pillar.theme.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-13 h-13 rounded-xl flex items-center justify-center ${pillar.theme.iconBg} transition-transform group-hover:scale-105 duration-300`}>
                      <IconComponent className={`w-6 h-6 ${pillar.theme.iconColor}`} />
                    </div>
                    <Badge variant={pillar.theme.badgeVariant} className={`text-xs px-3 py-0.5 ${pillar.theme.badgeColor}`}>
                      {pillar.badge}
                    </Badge>
                  </div>

                  <h3 className={`text-xl font-bold text-slate-900 ${pillar.theme.hoverText} transition-colors mb-1 font-heading`}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {pillar.subtitle}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                    {pillar.description}
                  </p>

                  {/* Micro Features list */}
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-100">
                    {pillar.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-scholar-accent transition-colors" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-700 group-hover:text-scholar-accent transition-colors">
                  <span>เข้าสู่ระบบและรายละเอียด</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
