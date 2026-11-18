'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  MapPin,
  Users,
  ArrowRight,
  Eye,
  FileSearch,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  AcademicServiceItem,
  getServiceTypeConfig,
  getStatusConfig,
} from '@/lib/academic-services';
import { Button } from '@/components/ui/button';

interface AcademicServicesGridProps {
  projects: AcademicServiceItem[];
  viewMode: 'grid' | 'ledger';
  onOpenQuickView: (project: AcademicServiceItem) => void;
  onResetFilters: () => void;
}

export default function AcademicServicesGrid({
  projects,
  viewMode,
  onOpenQuickView,
  onResetFilters,
}: AcademicServicesGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Empty State
  if (projects.length === 0) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
          <FileSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1.5 font-heading">
          ไม่พบโครงการบริการวิชาการที่ตรงกับเงื่อนไข
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          โปรดลองเปลี่ยนคำค้นหา หรือล้างตัวกรองสถานะและเป้าหมาย SDG เพื่อดูโครงการทั้งหมด
        </p>
        <Button
          onClick={onResetFilters}
          size="sm"
          className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ล้างตัวกรองและแสดงทั้งหมด</span>
        </Button>
      </div>
    );
  }

  // 1. LEDGER VIEW (Table / Editorial Archive Format)
  if (viewMode === 'ledger') {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[280px]">ชื่อโครงการบริการวิชาการ</th>
                <th className="py-3 px-4 min-w-[150px]">หมวดหมู่</th>
                <th className="py-3 px-4 min-w-[150px]">พื้นที่ดำเนินงาน</th>
                <th className="py-3 px-4 min-w-[130px]">สถานะ</th>
                <th className="py-3 px-4 min-w-[150px]">ผู้รับผิดชอบ</th>
                <th className="py-3 px-4 text-right w-24">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-700">
              {projects.map((project, idx) => {
                const typeConfig = getServiceTypeConfig(project.serviceType);
                const statusConfig = getStatusConfig(project.status || 'ONGOING');
                const leader =
                  (project.members || []).find((m) => m.role === 'LEADER') ||
                  (project.members || [])[0];

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-stone-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/research/services/${project.id}`}
                        className="font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      {project.sdgIds && project.sdgIds.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {project.sdgIds.slice(0, 3).map((sdg) => (
                            <span
                              key={sdg}
                              className="text-[9px] px-1.5 py-0.2 bg-stone-100 text-slate-500 rounded-xs font-bold"
                            >
                              SDG {sdg}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-stone-100 text-[10px] font-semibold text-slate-700">
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{project.area || 'ไม่ระบุพื้นที่'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${statusConfig.badgeClass}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${statusConfig.dotClass}`} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {leader ? (
                        <span className="truncate block">
                          {leader.prefix || ''}
                          {leader.firstNameTh || ''} {leader.lastNameTh || ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenQuickView(project)}
                          title="พรีวิวด่วน"
                          className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-stone-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/research/services/${project.id}`}
                          title="ดูหน้าเต็ม"
                          className="p-1 rounded-sm text-primary hover:text-[#9A3412] hover:bg-orange-50 transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. GRID CARDS VIEW (Editorial Cards)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        const typeConfig = getServiceTypeConfig(project.serviceType);
        const statusConfig = getStatusConfig(project.status || 'ONGOING');
        const leader =
          (project.members || []).find((m) => m.role === 'LEADER') ||
          (project.members || [])[0];

        return (
          <motion.article
            key={project.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="group bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image Container */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                {project.coverImageUrl ? (
                  <Image
                    src={project.coverImageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                    <Sparkles className="w-10 h-10 stroke-[1.2]" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-bold shadow-xs backdrop-blur-md border ${statusConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Category Chip */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-sm border border-white/10">
                    {typeConfig.label}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <Link
                  href={`/research/services/${project.id}`}
                  className="block group-hover:text-primary transition-colors"
                >
                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 mb-2 font-heading">
                    {project.title}
                  </h3>
                </Link>

                {/* Location Meta */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1">{project.area || 'พื้นที่จังหวัดเชียงราย'}</span>
                </div>

                {/* Description Excerpt */}
                {project.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-light">
                    {project.description}
                  </p>
                )}

                {/* SDG Badges */}
                {project.sdgIds && project.sdgIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.sdgIds.slice(0, 4).map((sdg) => (
                      <span
                        key={sdg}
                        className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-stone-100 text-slate-600 border border-stone-200"
                      >
                        SDG {sdg}
                      </span>
                    ))}
                    {project.sdgIds.length > 4 && (
                      <span className="px-1 py-0.5 rounded-xs text-[10px] font-semibold bg-stone-100 text-slate-400">
                        +{project.sdgIds.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs">
              {leader ? (
                <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[55%]">
                  <Users className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate text-[11px]">
                    {leader.prefix || ''}
                    {leader.firstNameTh || ''} {leader.lastNameTh || ''}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px]">คณะสังคมศาสตร์</span>
              )}

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenQuickView(project)}
                  className="text-slate-500 hover:text-slate-800 p-1 text-[11px] font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">พรีวิว</span>
                </button>

                <Link
                  href={`/research/services/${project.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-[#9A3412] group-hover:translate-x-0.5 transition-transform"
                >
                  <span>รายละเอียด</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
