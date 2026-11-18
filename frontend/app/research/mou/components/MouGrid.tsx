'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileSearch,
  FileText,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { MouItem, getPartnerTypeConfig } from '@/lib/mous';
import { Button } from '@/components/ui/button';

interface MouGridProps {
  items: MouItem[];
  viewMode: 'grid' | 'ledger';
  onOpenQuickView: (item: MouItem) => void;
  onResetFilters: () => void;
}

export default function MouGrid({
  items,
  viewMode,
  onOpenQuickView,
  onResetFilters,
}: MouGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Empty State
  if (items.length === 0) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
          <FileSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1.5 font-heading">
          ไม่พบบันทึกข้อตกลงความร่วมมือตามเงื่อนไข
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          โปรดลองเปลี่ยนคำค้นหา หรือเลือกดูประเภทภาคีเครือข่ายอื่น
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

  // 1. LEDGER VIEW (Table Format for Academic Rigor)
  if (viewMode === 'ledger') {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[200px]">หน่วยงานภาคี</th>
                <th className="py-3 px-4 min-w-[260px]">ชื่อบันทึกข้อตกลง (MOU)</th>
                <th className="py-3 px-4 min-w-[140px]">ประเภทภาคี</th>
                <th className="py-3 px-4 min-w-[160px]">ระยะเวลาความร่วมมือ</th>
                <th className="py-3 px-4 min-w-[100px] text-center">สถานะ</th>
                <th className="py-3 px-4 text-right w-24">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-700">
              {items.map((item, idx) => {
                const partnerConfig = getPartnerTypeConfig(item.partnerType);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm bg-stone-100 border border-stone-200 p-1 flex items-center justify-center shrink-0">
                          {item.partnerLogoUrl ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.partnerLogoUrl}
                                alt={item.partnerName}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <Building2 className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                          {item.partnerName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="line-clamp-2 text-slate-800 leading-snug">
                        {item.title}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-stone-100 text-[10px] font-semibold text-slate-700">
                        {partnerConfig.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.startDate ? (
                        <>
                          {new Date(item.startDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                          })}
                          {item.endDate
                            ? ` - ${new Date(item.endDate).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                              })}`
                            : ' (ต่อเนื่อง)'}
                        </>
                      ) : (
                        'ต่อเนื่อง'
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> บังคับใช้
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-sm">
                          <Clock className="w-3 h-3" /> สิ้นสุด
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenQuickView(item)}
                          title="พรีวิวด่วน"
                          className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-stone-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.documentUrl && (
                          <a
                            href={item.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="ดาวน์โหลดเอกสารข้อตกลง"
                            className="p-1 rounded-sm text-primary hover:text-[#9A3412] hover:bg-orange-50 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </a>
                        )}
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

  // 2. GRID CARDS VIEW (Visual Cards)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const partnerConfig = getPartnerTypeConfig(item.partnerType);

        return (
          <motion.article
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="group bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Logo, Category & Active Status */}
              <div className="p-5 pb-4 border-b border-stone-100 bg-stone-50/50 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-sm bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                  {item.partnerLogoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.partnerLogoUrl}
                        alt={item.partnerName}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Building2 className="w-6 h-6 text-stone-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${partnerConfig.badgeColor}`}
                    >
                      {partnerConfig.label}
                    </span>

                    {item.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200/80">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> บังคับใช้
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded-xs">
                        <Clock className="w-2.5 h-2.5" /> สิ้นสุด
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors font-heading">
                    {item.partnerName}
                  </h3>
                </div>
              </div>

              {/* Card Body: Title & Scope */}
              <div className="p-5">
                <h4 className="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-relaxed mb-2.5">
                  {item.title}
                </h4>

                {item.scope && (
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-light mb-4">
                    {item.scope}
                  </p>
                )}

                {/* Period Metadata */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {item.startDate ? (
                      <>
                        {new Date(item.startDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                        })}
                        {item.endDate
                          ? ` - ${new Date(item.endDate).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                            })}`
                          : ' (ต่อเนื่อง)'}
                      </>
                    ) : (
                      'ข้อตกลงต่อเนื่อง'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Action Links & Quick View */}
            <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <Globe className="w-3 h-3" />
                    <span>เว็บไซต์</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[10px]">ไม่มีลิงก์</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenQuickView(item)}
                  className="text-slate-500 hover:text-slate-800 p-1 text-[11px] font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>สาระสำคัญ</span>
                </button>

                {item.documentUrl && (
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-[#9A3412] inline-flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <FileText className="w-3 h-3" />
                    <span>เอกสาร</span>
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
