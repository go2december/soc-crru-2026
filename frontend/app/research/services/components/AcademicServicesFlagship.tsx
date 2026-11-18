'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, MapPin, Users, ArrowRight, Award, Eye } from 'lucide-react';
import { AcademicServiceItem, getServiceTypeConfig, getStatusConfig } from '@/lib/academic-services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AcademicServicesFlagshipProps {
  flagshipProject: AcademicServiceItem | null;
  onOpenQuickView: (project: AcademicServiceItem) => void;
}

export default function AcademicServicesFlagship({
  flagshipProject,
  onOpenQuickView,
}: AcademicServicesFlagshipProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!flagshipProject) {
    return null;
  }

  const typeConfig = getServiceTypeConfig(flagshipProject.serviceType);
  const statusConfig = getStatusConfig(flagshipProject.status || 'ONGOING');
  const leader =
    (flagshipProject.members || []).find((m) => m.role === 'LEADER') ||
    (flagshipProject.members || [])[0];

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5"
          >
            <Sparkles className="w-3 h-3 mr-1" /> Flagship Initiative
          </Badge>
          <span className="text-xs text-slate-500 hidden sm:inline">
            โครงการยุทธศาสตร์พัฒนาเชิงพื้นที่เด่น
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          REF: #{flagshipProject.id.slice(0, 8)}
        </span>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-sm hover:border-primary/40 transition-colors"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Asymmetric Imagery: 7 Cols */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[360px] lg:min-h-full bg-stone-100 overflow-hidden">
            {flagshipProject.coverImageUrl ? (
              <Image
                src={flagshipProject.coverImageUrl}
                alt={flagshipProject.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-stone-100 text-stone-400">
                <Award className="w-16 h-16 stroke-[1.2] mb-2 text-stone-300" />
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Living Heritage Showcase
                </span>
              </div>
            )}

            {/* Gradient Scrim for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden pointer-events-none" />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-sm border border-white/10">
                {typeConfig.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-semibold backdrop-blur-md border ${statusConfig.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>
            </div>

            {/* Location overlay on mobile */}
            {flagshipProject.area && (
              <div className="absolute bottom-4 left-4 z-10 lg:hidden text-white flex items-center gap-1.5 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="drop-shadow-sm">{flagshipProject.area}</span>
              </div>
            )}
          </div>

          {/* Asymmetric Content: 5 Cols */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between bg-stone-50/50">
            <div>
              {/* Desktop Location Badge */}
              {flagshipProject.area && (
                <div className="hidden lg:flex items-center gap-1.5 text-xs text-primary font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>พื้นที่: {flagshipProject.area}</span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight leading-snug mb-3">
                {flagshipProject.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-light mb-6 line-clamp-4">
                {flagshipProject.description ||
                  'โครงการบริการวิชาการที่ผสานพลังความร่วมมือระหว่างมหาวิทยาลัยและชุมชนท้องถิ่น เพื่อสร้างองค์ความรู้ที่จับต้องได้และนำไปใช้ประโยชน์อย่างเป็นรูปธรรม'}
              </p>

              {/* SDG Tags */}
              {flagshipProject.sdgIds && flagshipProject.sdgIds.length > 0 && (
                <div className="mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {flagshipProject.sdgIds.map((sdg) => (
                      <span
                        key={sdg}
                        className="px-2 py-0.5 rounded-sm text-[11px] font-bold bg-white text-slate-700 border border-slate-200"
                      >
                        SDG {sdg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Leader Attribution & Actions */}
            <div className="pt-5 border-t border-slate-200/80">
              {leader && (
                <div className="flex items-center gap-2 mb-4 text-xs text-slate-600">
                  <div className="w-7 h-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                      หัวหน้าโครงการ
                    </span>
                    <span className="font-medium text-slate-800">
                      {leader.prefix || ''}
                      {leader.firstNameTh || ''} {leader.lastNameTh || ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={() => onOpenQuickView(flagshipProject)}
                  variant="outline"
                  size="sm"
                  className="rounded-sm border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-medium gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>พรีวิวข้อมูลด่วน</span>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs font-medium gap-1.5 ml-auto"
                >
                  <Link href={`/research/services/${flagshipProject.id}`}>
                    <span>รายละเอียดโครงการ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
