'use client';

import React from 'react';
import Link from 'next/link';
import {
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

interface ProcurementLedgerTableProps {
  records: ProcurementRecord[];
}

export default function ProcurementLedgerTable({
  records,
}: ProcurementLedgerTableProps) {
  if (records.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[280px]">ชื่อโครงการ / รายการจัดซื้อ</th>
              <th className="py-3 px-4 min-w-[120px]">หมวดหมู่ & วิธีจัดซื้อ</th>
              <th className="py-3 px-4 min-w-[140px] text-right">วงเงินงบประมาณ</th>
              <th className="py-3 px-4 min-w-[180px]">คู่สัญญา / ผู้ชนะ</th>
              <th className="py-3 px-4 min-w-[130px] text-center">สถานะ</th>
              <th className="py-3 px-4 text-right w-24">เอกสาร / รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-slate-700">
            {records.map((item, idx) => {
              const statusInfo = getProcurementStatusInfo(item.status);
              const docs = item.documents || [];

              return (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Title & Date */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-xs bg-slate-900 text-white font-bold">
                          ปีงบ {item.fiscalYear}
                        </span>
                        {item.approvedAt && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatThaiDate(item.approvedAt)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/eservice/procurement/${item.id}`}
                        className="font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </td>

                  {/* Category & Type */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-stone-100 text-[10px] font-semibold text-slate-700">
                        {getProcurementCategoryLabel(item.category)}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {getProcurementTypeLabel(item.procurementType)}
                      </p>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 text-right">
                    <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      {formatThaiBaht(item.budget)}
                    </p>
                    {item.contractAmount && (
                      <p className="text-[10px] font-mono text-emerald-700">
                        สัญญา: {formatThaiBaht(item.contractAmount)}
                      </p>
                    )}
                  </td>

                  {/* Vendor */}
                  <td className="py-3.5 px-4">
                    {item.vendorName ? (
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1 font-medium">{item.vendorName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">- ยังไม่ประกาศผล -</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-sm text-[10px] font-semibold border ${statusInfo.colorClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Action / Attachment */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {docs.length > 0 && (
                        <div className="flex items-center gap-1">
                          {docs.slice(0, 2).map((doc) => {
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
                                title={doc.title}
                                className="p-1 rounded-sm text-primary hover:text-[#9A3412] hover:bg-orange-50 transition-colors"
                              >
                                {isExternal ? (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                ) : (
                                  <Download className="w-3.5 h-3.5" />
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}

                      <Link
                        href={`/eservice/procurement/${item.id}`}
                        title="ดูรายละเอียดโครงการเต็ม"
                        className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-stone-100 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
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
