'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Building,
  Clock,
} from 'lucide-react';
import {
  ProcurementRecord,
  getProcurementTypeLabel,
  getProcurementCategoryLabel,
  getProcurementStatusInfo,
  formatThaiBaht,
  formatThaiDate,
  getProcurementFileUrl,
} from '@/lib/procurement';

interface ProcurementCardsGridProps {
  records: ProcurementRecord[];
}

export default function ProcurementCardsGrid({
  records,
}: ProcurementCardsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (records.length === 0) return null;

  return (
    <div className="space-y-4">
      {records.map((item, index) => {
        const statusInfo = getProcurementStatusInfo(item.status);
        const docs = item.documents || [];

        return (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: (index % 5) * 0.05 }}
            className="bg-white rounded-sm border border-stone-200/90 hover:border-primary/50 p-5 md:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Left Info Column */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono bg-slate-900 text-white uppercase tracking-wider">
                    ปีงบประมาณ {item.fiscalYear}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-stone-100 text-slate-700 border border-stone-200">
                    {getProcurementCategoryLabel(item.category)}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-orange-50 text-primary border border-orange-200">
                    {getProcurementTypeLabel(item.procurementType)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${statusInfo.colorClass}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <Link
                  href={`/eservice/procurement/${item.id}`}
                  className="block text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-primary transition-colors leading-snug"
                >
                  {item.title}
                </Link>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  {item.vendorName && (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        คู่สัญญา/ผู้ชนะ:{' '}
                        <strong className="text-slate-800 font-medium">
                          {item.vendorName}
                        </strong>
                      </span>
                    </div>
                  )}
                  {item.approvedAt && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>ประกาศเมื่อ: {formatThaiDate(item.approvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Budget Column */}
              <div className="bg-stone-50/80 rounded-sm p-4 border border-stone-200/80 text-left lg:text-right min-w-[210px] shrink-0">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                  วงเงินงบประมาณ
                </span>
                <p className="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  {formatThaiBaht(item.budget)}{' '}
                  <span className="text-xs font-normal text-slate-500">บาท</span>
                </p>
                {item.contractAmount && (
                  <p className="text-xs text-emerald-700 font-mono mt-0.5 font-medium">
                    สัญญาจริง: {formatThaiBaht(item.contractAmount)} บาท
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Attachments & Navigation Strip */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500 flex items-center gap-1 text-[11px] mr-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  เอกสารแนบ ({docs.length}):
                </span>

                {docs.length === 0 ? (
                  <span className="text-slate-400 text-[11px] italic">- ไม่มีไฟล์แนบ -</span>
                ) : (
                  docs.map((doc) => {
                    const targetUrl = doc.fileUrl
                      ? getProcurementFileUrl(doc.fileUrl)
                      : doc.externalUrl || '#';
                    const isExternal = !doc.fileUrl && !!doc.externalUrl;

                    return (
                      <a
                        key={doc.id}
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-200 rounded-sm text-[11px] font-medium transition-colors"
                        title={doc.title}
                      >
                        <FileText className="w-3 h-3 text-primary shrink-0" />
                        <span className="max-w-[160px] truncate">{doc.title}</span>
                        {isExternal ? (
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                        ) : (
                          <Download className="w-2.5 h-2.5 opacity-60 shrink-0" />
                        )}
                      </a>
                    );
                  })
                )}
              </div>

              <Link
                href={`/eservice/procurement/${item.id}`}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:text-[#9A3412] group-hover:translate-x-0.5 transition-transform shrink-0"
              >
                <span>ดูรายละเอียดโครงการ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
