import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Building,
  Coins,
  ClipboardList,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  fetchProcurementById,
  getProcurementTypeLabel,
  getProcurementCategoryLabel,
  getProcurementStatusInfo,
  getProcurementDocTypeLabel,
  formatThaiBaht,
  formatThaiDate,
  getProcurementFileUrl,
} from '@/lib/procurement';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolvedParams = await props.params;
  const record = await fetchProcurementById(resolvedParams.id);
  if (!record) {
    return {
      title: 'ไม่พบข้อมูลจัดซื้อจัดจ้าง | คณะสังคมศาสตร์ มรภ.เชียงราย',
    };
  }

  return {
    title: `${record.title} | จัดซื้อจัดจ้าง คณะสังคมศาสตร์ มรภ.เชียงราย`,
    description: `ประกาศจัดซื้อจัดจ้าง ปีงบประมาณ ${record.fiscalYear} วงเงินงบประมาณ ${formatThaiBaht(record.budget)} บาท`,
  };
}

export default async function ProcurementDetailPage(props: Props) {
  const resolvedParams = await props.params;
  const record = await fetchProcurementById(resolvedParams.id);

  if (!record) {
    notFound();
  }

  const statusInfo = getProcurementStatusInfo(record.status);
  const docs = record.documents || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Breadcrumb & Header */}
      <section className="bg-gradient-to-r from-scholar-deep via-[#16234B] to-scholar-deep text-white py-10 px-4 border-b-4 border-scholar-accent">
        <div className="max-w-5xl mx-auto space-y-4">
          <nav className="flex items-center gap-2 text-xs text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              หน้าแรก
            </Link>
            <span>/</span>
            <Link href="/eservice" className="hover:text-white transition-colors">
              ระบบสารสนเทศ
            </Link>
            <span>/</span>
            <Link href="/eservice/procurement" className="hover:text-white transition-colors">
              จัดซื้อจัดจ้าง
            </Link>
            <span>/</span>
            <span className="text-white/90 truncate max-w-[200px] sm:max-w-md">
              {record.title}
            </span>
          </nav>

          <Link
            href="/eservice/procurement"
            className="inline-flex items-center gap-1.5 text-xs text-scholar-gold hover:text-white transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            กลับไปหน้ารายการจัดซื้อจัดจ้าง
          </Link>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20">
              ปีงบประมาณ {record.fiscalYear}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-scholar-gold border border-white/10">
              {getProcurementCategoryLabel(record.category)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
              {getProcurementTypeLabel(record.procurementType)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 shadow-sm`}
            >
              {statusInfo.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white leading-tight">
            {record.title}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Budget Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold border-b border-slate-100 pb-3">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>ข้อมูลวงเงินงบประมาณ</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">วงเงินงบประมาณที่ได้รับจัดสรร</span>
                <span className="font-bold text-slate-900 text-base">
                  {formatThaiBaht(record.budget)} บาท
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">ราคากลาง / วงเงินตามสัญญา</span>
                <span className="font-bold text-emerald-700 text-base">
                  {record.contractAmount ? `${formatThaiBaht(record.contractAmount)} บาท` : 'ยังไม่มีข้อมูล'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">วิธีการจัดหา</span>
                <span className="font-medium text-slate-800">
                  {getProcurementTypeLabel(record.procurementType)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Vendor & Timeline Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-blue-500" />
              <span>คู่สัญญาและกำหนดเวลา</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">ผู้ชนะการเสนอราคา / คู่สัญญา</span>
                <span className="font-bold text-slate-900 text-right">
                  {record.vendorName || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">วันที่อนุมัติ / ประกาศ</span>
                <span className="font-medium text-slate-800">
                  {formatThaiDate(record.approvedAt)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">วันที่สิ้นสุดสัญญา / ตรวจรับ</span>
                <span className="font-medium text-slate-800">
                  {formatThaiDate(record.completedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  เอกสารหลักฐานประกอบการจัดซื้อจัดจ้าง (PDF)
                </h2>
                <p className="text-xs text-slate-500">
                  เอกสารยืนยันความโปร่งใส ขอบเขตงาน (TOR) ประกาศจัดซื้อจัดจ้าง และผลการคัดเลือก
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {docs.length} ไฟล์
            </span>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-sm">ยังไม่มีเอกสารแนบในรายการนี้</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {docs.map((doc, idx) => {
                const targetUrl = doc.fileUrl ? getProcurementFileUrl(doc.fileUrl) : doc.externalUrl || '#';
                const isExternal = !doc.fileUrl && !!doc.externalUrl;

                return (
                  <div
                    key={doc.id || idx}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {getProcurementDocTypeLabel(doc.documentType)}
                          </span>
                          {doc.fileSize && (
                            <span className="text-[10px] text-slate-400">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm md:text-base group-hover:text-scholar-accent transition-colors">
                          {doc.title}
                        </p>
                        {doc.originalName && (
                          <p className="text-xs text-slate-400">
                            ไฟล์: {doc.originalName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm bg-scholar-deep hover:bg-slate-900 text-white gap-1.5 shadow-sm"
                      >
                        {isExternal ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>เปิดลิงก์เอกสาร</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>ดาวน์โหลด PDF</span>
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-700">หมายเหตุความโปร่งใส:</p>
          <p>
            ข้อมูลและเอกสารในหน้านี้เผยแพร่ตามพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 และเกณฑ์การประเมินคุณธรรมและความโปร่งใส (ITA)
          </p>
        </div>
      </div>
    </main>
  );
}
