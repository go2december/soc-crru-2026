'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Coins,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  AcademicServiceItem,
  getServiceTypeConfig,
  getStatusConfig,
  getRoleLabel,
} from '@/lib/academic-services';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AcademicServicesQuickViewProps {
  project: AcademicServiceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AcademicServicesQuickView({
  project,
  open,
  onOpenChange,
}: AcademicServicesQuickViewProps) {
  if (!project) return null;

  const typeConfig = getServiceTypeConfig(project.serviceType);
  const statusConfig = getStatusConfig(project.status || 'ONGOING');
  const members = project.members || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-sm border-stone-200">
        {/* Header Visual Scrim */}
        <div className="relative h-44 sm:h-52 bg-stone-900 overflow-hidden">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-900 to-stone-900 text-stone-600">
              <Sparkles className="w-12 h-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Badges on Top */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-950/90 text-white border border-white/10">
              {typeConfig.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-semibold backdrop-blur-md border ${statusConfig.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
              {statusConfig.label}
            </span>
          </div>

          {/* Area on Bottom Left */}
          {project.area && (
            <div className="absolute bottom-3 left-4 text-white flex items-center gap-1.5 text-xs font-medium z-10">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{project.area}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <DialogHeader className="text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              PROJECT ID: #{project.id.slice(0, 8)}
            </span>
            <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-slate-900 leading-snug">
              {project.title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {project.description || 'ไม่มีคำอธิบายสรุปสำหรับโครงการนี้'}
            </DialogDescription>
          </DialogHeader>

          {/* SDG Alignment */}
          {project.sdgIds && project.sdgIds.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.sdgIds.map((sdg) => (
                  <span
                    key={sdg}
                    className="px-2 py-0.5 rounded-sm text-[11px] font-bold bg-stone-100 text-slate-700 border border-stone-200"
                  >
                    SDG {sdg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {members.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                คณะผู้ดำเนินโครงการ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded-sm bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">
                      {m.prefix || ''}
                      {m.firstNameTh || ''} {m.lastNameTh || ''}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {getRoleLabel(m.role)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget & Documents */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-slate-600">
            {project.fundingSource && (
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>แหล่งทุน: {project.fundingSource}</span>
              </div>
            )}

            {project.documentUrl && (
              <a
                href={project.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดรายงาน/เอกสาร</span>
              </a>
            )}
          </div>

          {/* Dialog Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-sm border-stone-300 text-xs"
            >
              ปิดหน้าต่าง
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs gap-1.5"
            >
              <Link href={`/research/services/${project.id}`}>
                <span>ไปยังหน้ารายละเอียดเต็ม</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
