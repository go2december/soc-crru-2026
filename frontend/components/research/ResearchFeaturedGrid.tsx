'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Users, Calendar, Sparkles, ArrowUpRight } from 'lucide-react';
import type { ResearchProjectAdminItem } from '@/lib/research';
import { getResearchPublicAssetUrl, SDG_COLORS } from '@/lib/research';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResearchFeaturedGridProps {
  projects: ResearchProjectAdminItem[];
}

export default function ResearchFeaturedGrid({ projects }: ResearchFeaturedGridProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Badge variant="saffron" className="gap-1.5 text-xs mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Latest Publications & Projects</span>
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            ผลงานวิจัยและนวัตกรรมเด่นล่าสุด
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1 max-w-2xl font-light">
            ผลงานทางวิชาการและการขับเคลื่อนองค์ความรู้เพื่อการพัฒนาสังคมโดยคณาจารย์และนักวิจัยคณะสังคมศาสตร์
          </p>
        </div>

        <Button variant="ghost" size="sm" asChild className="text-scholar-accent hover:text-orange-700 hover:bg-orange-50 font-semibold gap-1">
          <Link href="/research/database">
            <span>ดูงานวิจัยทั้งหมดในคลังข้อมูล</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Grid of Projects with Motion Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, idx) => {
          const members = project.memberDisplay && project.memberDisplay.length > 0
            ? project.memberDisplay.join(', ')
            : 'คณะผู้วิจัย คณะสังคมศาสตร์';

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              className="flex"
            >
              <Link
                href={`/research/database/${project.slug}`}
                className="group flex-1 relative flex flex-col justify-between bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-shadow"
              >
                <div>
                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="subtle" className="gap-1 text-xs">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>พ.ศ. {project.year}</span>
                      </Badge>
                      {project.isSocialService && (
                        <Badge variant="subtle" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                          บริการวิชาการเพื่อสังคม
                        </Badge>
                      )}
                    </div>

                    <span className="text-xs text-slate-400 group-hover:text-scholar-accent transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-scholar-accent transition-colors font-heading leading-snug line-clamp-2 mb-2">
                    {project.titleTh}
                  </h3>

                  {/* Researcher Name */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 line-clamp-1">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{members}</span>
                  </div>

                  {/* SDG Badges */}
                  {project.sdgIds && project.sdgIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.sdgIds.slice(0, 4).map((sdgId) => {
                        const color = SDG_COLORS[sdgId] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
                        return (
                          <span
                            key={sdgId}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border}`}
                          >
                            SDG {sdgId}
                          </span>
                        );
                      })}
                      {project.sdgIds.length > 4 && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          +{project.sdgIds.length - 4} SDGs
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-600">
                    {project.fundingSource ? `ทุนสนับสนุน: ${project.fundingSource}` : 'คณะสังคมศาสตร์ มรภ.เชียงราย'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-scholar-accent group-hover:underline">
                    อ่านรายละเอียด
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
