'use client';

import React from 'react';
import Image from 'next/image';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MouItem, getPartnerTypeConfig } from '@/lib/mous';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MouQuickViewProps {
  item: MouItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MouQuickView({
  item,
  open,
  onOpenChange,
}: MouQuickViewProps) {
  if (!item) return null;

  const partnerConfig = getPartnerTypeConfig(item.partnerType);

  const formattedPeriod = item.startDate
    ? `${new Date(item.startDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}${
        item.endDate
          ? ` ถึง ${new Date(item.endDate).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`
          : ' (มีผลผูกพันต่อเนื่อง)'
      }`
    : 'บันทึกข้อตกลงต่อเนื่อง';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-sm border-stone-200">
        {/* Header Presentation Strip */}
        <div className="p-6 bg-stone-900 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-16 h-16 rounded-sm bg-white p-2 shrink-0 flex items-center justify-center border border-white/10 shadow-xs">
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
                <Building2 className="w-8 h-8 text-stone-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                  {partnerConfig.label}
                </span>

                {item.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> มีผลบังคับใช้
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium text-stone-400 bg-stone-800 border border-stone-700">
                    <Clock className="w-3 h-3" /> สิ้นสุดระยะเวลา
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                PARTNER ORGANIZATION
              </span>
              <h3 className="text-lg font-bold font-heading text-white leading-snug">
                {item.partnerName}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <DialogHeader className="text-left space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              MOU IDENTIFIER: #{item.id.slice(0, 8)}
            </span>
            <DialogTitle className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-snug">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>ระยะเวลา: {formattedPeriod}</span>
            </DialogDescription>
          </DialogHeader>

          {/* Scope of Agreement */}
          <div className="p-4 rounded-sm bg-stone-50 border border-stone-200/80">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              สาระสำคัญและขอบเขตความร่วมมือ (Scope & Objectives)
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
              {item.scope ||
                'ร่วมกันส่งเสริม พัฒนา และดำเนินกิจกรรมทางวิชาการ การวิจัย การถ่ายทอดองค์ความรู้ และการพัฒนาเชิงพื้นที่เพื่อประโยชน์สูงสุดแก่ชุมชนและท้องถิ่น'}
            </p>
          </div>

          {/* Links & Documents Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
            {item.websiteUrl ? (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-primary font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>เยี่ยมชมเว็บไซต์หน่วยงานภาคี</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : (
              <span className="text-slate-400 text-[11px]">- ไม่มีลิงก์ภายนอก -</span>
            )}

            {item.documentUrl && (
              <a
                href={item.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดเอกสารบันทึกข้อตกลงฉบับเต็ม</span>
              </a>
            )}
          </div>

          {/* Dialog Footer Action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-sm border-stone-300 text-xs"
            >
              ปิดหน้าต่าง
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
