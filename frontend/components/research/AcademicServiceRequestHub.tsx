'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_ACADEMIC_SERVICE_CONFIG, AcademicServiceConfig } from '@/lib/academic-services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface AcademicServiceRequestHubProps {
  className?: string;
  initialConfig?: AcademicServiceConfig;
}

export default function AcademicServiceRequestHub({
  className = '',
  initialConfig,
}: AcademicServiceRequestHubProps) {
  const [config, setConfig] = useState<AcademicServiceConfig>(
    initialConfig || DEFAULT_ACADEMIC_SERVICE_CONFIG
  );
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    if (!initialConfig) {
      fetch(`${API_URL}/api/academic-services/config`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setConfig((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {
          // Graceful fallback to DEFAULT_ACADEMIC_SERVICE_CONFIG
        });
    }
  }, [initialConfig]);

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const dialablePhone = `tel:${config.contactPhone.replace(/[^0-9]/g, '')}`;


  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-scholar-deep via-slate-900 to-scholar-deep text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Academic Service Portal
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight mb-2">
            ศูนย์ประสานงานและขอรับบริการวิชาการ
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
            คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ยินดีให้บริการทางวิชาการ ถ่ายทอดองค์ความรู้
            และร่วมมือกับองค์กรปกครองส่วนท้องถิ่น (อปท.) ชุมชน โรงเรียน และหน่วยงานทุกภาคส่วน
          </p>
        </div>
      </div>

      {/* 3-Step Clear Flow */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          ขั้นตอนการขอรับบริการวิชาการ (3 ขั้นตอนง่ายๆ)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-scholar-deep text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">ดาวน์โหลดแบบฟอร์ม</p>
              <p className="text-xs text-slate-500 leading-normal">
                กรอกรายละเอียดความต้องการ หรือทำหนังสือขอความอนุเคราะห์
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-scholar-deep text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">ส่งเอกสารขอรับบริการ</p>
              <p className="text-xs text-slate-500 leading-normal">
                ส่งทางอีเมลทางการ หรือยื่นหนังสือที่สำนักงานคณบดี คณะสังคมศาสตร์
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-scholar-accent text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">คณะตอบรับและดำเนินการ</p>
              <p className="text-xs text-slate-500 leading-normal">
                ประสานงานอาจารย์ผู้เชี่ยวชาญ และแจ้งตอบกลับภายใน 3-5 วันทำการ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dual-Action Cards Grid */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Action 1: Official Documents Download */}
        <div className="lg:col-span-6 bg-slate-50/70 rounded-xl p-6 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">เอกสารและแบบฟอร์มคำขอ</h3>
                <span className="text-xs text-slate-500 font-medium">Official Request Templates</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              สำหรับหน่วยงาน อปท. หรือองค์กรที่ต้องการทำบันทึกข้อความ หรือหนังสือขอความอนุเคราะห์วิทยากร
              สามารถดาวน์โหลดแบบฟอร์มทางการของคณะได้โดยตรง
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-scholar-accent/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      แบบฟอร์มขอรับบริการวิชาการ (PDF)
                    </p>
                    <p className="text-[11px] text-slate-400">ขนาดไฟล์เอกสารทางการ • ปลอดภัย มีการตรวจสอบสิทธิ์</p>
                  </div>
                </div>
                <a
                  href={config.pdfFormUrl || '/forms/academic-service-request.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-scholar-deep hover:text-white text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  ดาวน์โหลด
                </a>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-scholar-accent/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      แบบฟอร์มขอรับบริการวิชาการ (DOCX)
                    </p>
                    <p className="text-[11px] text-slate-400">สำหรับแก้ไขและพิมพ์ในคอมพิวเตอร์ • Microsoft Word</p>
                  </div>
                </div>
                <a
                  href={config.docxFormUrl || '/forms/academic-service-request.docx'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-scholar-deep hover:text-white text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  ดาวน์โหลด
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ไฟล์เอกสารได้รับการรับรองและตรวจสอบความปลอดภัย ปราศจากมัลแวร์</span>
          </div>
        </div>

        {/* Action 2: Fast-Track Contact Line (Bot-Protected) */}
        <div className="lg:col-span-6 bg-slate-50/70 rounded-xl p-6 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">ช่องทางประสานงานด่วน</h3>
                <span className="text-xs text-slate-500 font-medium">Fast-Track Direct Consultation</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              หากต้องการปรึกษารายละเอียดโครงการล่วงหน้า หรือสอบถามความพร้อมของอาจารย์ผู้เชี่ยวชาญ
              สามารถติดต่อฝ่ายวิจัยและบริการวิชาการได้โดยตรง {config.responseTime ? `(${config.responseTime})` : ''}
            </p>

            <div className="space-y-3 mb-6">
              {/* Phone Line */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      เบอร์โทรศัพท์สายตรง
                    </span>
                    <a
                      href={dialablePhone}
                      className="text-sm font-bold text-scholar-deep hover:text-scholar-accent transition-colors font-mono"
                    >
                      {config.contactPhone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(config.contactPhone, 'phone')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors shrink-0"
                  title="คัดลอกเบอร์โทร"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>

              {/* Email Line */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      อีเมลทางการฝ่ายบริการวิชาการ
                    </span>
                    <a
                      href={`mailto:${config.contactEmail}`}
                      className="text-sm font-bold text-scholar-deep hover:text-scholar-accent transition-colors font-mono"
                    >
                      {config.contactEmail}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(config.contactEmail, 'email')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors shrink-0"
                  title="คัดลอกอีเมล"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{config.officeHours}</span>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-scholar-accent hover:underline shrink-0"
            >
              ดูที่ตั้งและแผนที่ <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
