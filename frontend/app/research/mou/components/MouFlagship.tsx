'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  FileText,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { MouItem, getPartnerTypeConfig } from '@/lib/mous';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MouFlagshipProps {
  flagship: MouItem | null;
  onOpenQuickView: (item: MouItem) => void;
}

export default function MouFlagship({ flagship, onOpenQuickView }: MouFlagshipProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!flagship) return null;

  const partnerConfig = getPartnerTypeConfig(flagship.partnerType);

  const formattedPeriod = flagship.startDate
    ? `${new Date(flagship.startDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
      })}${
        flagship.endDate
          ? ` - ${new Date(flagship.endDate).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
            })}`
          : ' (ต่อเนื่อง)'
      }`
    : 'บันทึกข้อตกลงต่อเนื่อง';

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5"
          >
            <Sparkles className="w-3 h-3 mr-1" /> Strategic Flagship Accord
          </Badge>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ความร่วมมือเชิงยุทธศาสตร์เด่น
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          ACCORD REF: #{flagship.id.slice(0, 8)}
        </span>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs hover:border-primary/40 transition-colors"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Asymmetric Brand & Identity Area: 4.5 cols */}
          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-stone-50/80 border-b lg:border-b-0 lg:border-r border-stone-200/80">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border ${partnerConfig.badgeColor}`}
                >
                  {partnerConfig.label}
                </span>

                {flagship.isActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>มีผลบังคับใช้</span>
                  </span>
                )}
              </div>

              {/* Logo Presentation */}
              <div className="w-24 h-24 rounded-sm bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-3 mb-6">
                {flagship.partnerLogoUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={flagship.partnerLogoUrl}
                      alt={flagship.partnerName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Building2 className="w-10 h-10 text-stone-400 stroke-[1.5]" />
                )}
              </div>

              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                ORGANIZATIONAL ALLIANCE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight leading-snug">
                {flagship.partnerName}
              </h3>
            </div>

            {/* Timeframe Info */}
            <div className="mt-8 pt-4 border-t border-stone-200/70 text-xs text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>ระยะเวลาความร่วมมือ: {formattedPeriod}</span>
            </div>
          </div>

          {/* Asymmetric Content & Scope Area: 7 cols */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-2">
                ชื่อข้อตกลงความร่วมมือ
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight leading-snug mb-4">
                {flagship.title}
              </h2>

              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                ขอบเขตและสาระสำคัญของความร่วมมือ (Scope of Collaboration)
              </span>
              <p className="text-sm text-slate-600 leading-relaxed font-light mb-6 line-clamp-5 whitespace-pre-line">
                {flagship.scope ||
                  'บันทึกข้อตกลงเพื่อประสานความร่วมมือทางวิชาการ การวิจัย การถ่ายทอดองค์ความรู้ และการร่วมขับเคลื่อนการพัฒนาศักยภาพชุมชนท้องถิ่นอย่างยั่งยืน'}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {flagship.websiteUrl && (
                  <a
                    href={flagship.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary transition-colors font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>เว็บไซต์ทางการ</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {flagship.documentUrl && (
                  <a
                    href={flagship.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>เอกสารข้อตกลง (PDF)</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onOpenQuickView(flagship)}
                  variant="outline"
                  size="sm"
                  className="rounded-sm border-stone-300 text-xs font-medium gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>พรีวิวข้อมูลสาระสำคัญ</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
