'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RESEARCH_SDG_DESCRIPTIONS, SDG_COLORS } from '@/lib/research';

// Selected key SDGs with highest focus in Social Sciences
const PRIORITY_SDGS = [1, 3, 4, 5, 8, 10, 11, 16, 17];

export default function ResearchSdgMatrix() {
  return (
    <section className="mt-16 sm:mt-20 bg-slate-900 text-white rounded-2xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="relative z-10 max-w-3xl mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Sustainable Development Goals Alignment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
          เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
        </h2>
        <p className="text-slate-300 text-sm md:text-base mt-2 font-light leading-relaxed">
          คณะสังคมศาสตร์บูรณาการเป้าหมายการพัฒนาที่ยั่งยืนขององค์การสหประชาชาติ (UN SDGs)
          เข้ากับทุกโครงการวิจัยและบริการวิชาการ เพื่อสร้างผลกระทบเชิงบวกที่วัดผลได้จริงแก่ชุมชนท้องถิ่น
        </p>
      </motion.div>

      {/* Grid of SDGs with Motion Springs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {PRIORITY_SDGS.map((sdgId, idx) => {
          const sdg = RESEARCH_SDG_DESCRIPTIONS[sdgId];
          const color = SDG_COLORS[sdgId] || { hex: '#D97706', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };

          return (
            <motion.div
              key={sdgId}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: idx * 0.04 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="flex"
            >
              <Link
                href={`/research/database?sdg=${sdgId}`}
                className="group flex-1 p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: color.hex }}
                    >
                      SDG {sdgId}
                    </span>
                    <span className="text-slate-400 group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                    {sdg?.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">
                    {sdg?.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>สืบค้นงานวิจัย SDG {sdgId}</span>
                  <span className="text-amber-400 font-medium group-hover:underline">ดูโครงการ</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>ทุกโครงการวิจัยผ่านการประเมินและจัดหมวดหมู่เป้าหมาย SDGs ร่วมกับศูนย์วิจัยสากล</span>
        </div>
        <Link
          href="/research/database"
          className="text-white hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors"
        >
          ดูงานวิจัยจำแนกตาม SDGs ทั้งหมด 17 เป้าหมาย &rarr;
        </Link>
      </div>
    </section>
  );
}
