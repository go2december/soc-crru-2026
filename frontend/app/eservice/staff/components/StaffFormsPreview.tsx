'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Download, ArrowRight, Sparkles } from 'lucide-react';
import { StaffDocumentItem } from '@/lib/staff-services';
import { Button } from '@/components/ui/button';

interface StaffFormsPreviewProps {
  documents: StaffDocumentItem[];
  totalAllDocs: number;
}

export default function StaffFormsPreview({
  documents,
  totalAllDocs,
}: StaffFormsPreviewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mb-14 bg-white border border-stone-200/90 rounded-sm p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-sm bg-orange-50 text-primary border border-orange-200 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 inline mr-1" />
              คณะสังคมศาสตร์
            </span>
            <span className="text-xs text-slate-400 font-mono">
              OFFICIAL ADMINISTRATIVE FORMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
            แบบฟอร์มคำร้องและเอกสารสำหรับบุคลากร
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-light">
            แบบฟอร์มคำร้องราชการที่ใช้บ่อยที่สุด 6 อันดับแรกของคณะสังคมศาสตร์
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            size="sm"
            className="rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5"
          >
            <Link href="/eservice/staff/forms">
              <span>ดูคลังแบบฟอร์มทั้งหมด ({totalAllDocs})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => {
          const isPdf = doc.fileType === 'PDF';
          const isDocx = doc.fileType === 'DOCX';

          return (
            <motion.div
              key={doc.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
              className="flex items-center justify-between p-4 rounded-sm border border-stone-200/80 hover:border-primary/40 hover:bg-stone-50/60 transition-all group"
            >
              <div className="flex items-center gap-3.5 pr-2 min-w-0">
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 text-white font-mono font-bold text-[10px] shadow-xs ${
                    isPdf
                      ? 'bg-rose-600'
                      : isDocx
                      ? 'bg-teal-700'
                      : 'bg-stone-700'
                  }`}
                >
                  {doc.fileType}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-light">
                    <span className="truncate">หมวด: {doc.category}</span>
                    {doc.fileSize && (
                      <>
                        <span className="text-stone-300">•</span>
                        <span className="font-mono">{doc.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={doc.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-slate-700 hover:text-slate-900 border border-stone-200 rounded-sm text-xs font-medium transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">ดาวน์โหลด</span>
              </a>
            </motion.div>
          );
        })}
      </div>

      {documents.length === 0 && (
        <p className="text-center text-xs text-slate-400 py-6">
          ไม่พบแบบฟอร์มที่ค้นหา
        </p>
      )}

      {/* Footer Navigation */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          แสดง <strong>{documents.length}</strong> แบบฟอร์มที่ใช้บ่อย (จากคลังคำร้องบุคลากรทั้งหมด {totalAllDocs} รายการ)
        </span>
        <Link
          href="/eservice/staff/forms"
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-[#9A3412] transition-colors"
        >
          <span>เข้าสู่คลังแบบฟอร์มคำร้องบุคลากรฉบับเต็ม</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
