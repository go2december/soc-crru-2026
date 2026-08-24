import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Building,
  CheckCircle2,
  Clock,
  Coins,
} from 'lucide-react';
import {
  fetchProcurementList,
  PROCUREMENT_TYPES,
  PROCUREMENT_CATEGORIES,
  PROCUREMENT_STATUSES,
  getProcurementTypeLabel,
  getProcurementCategoryLabel,
  getProcurementStatusInfo,
  formatThaiBaht,
  formatThaiDate,
  getProcurementFileUrl,
} from '@/lib/procurement';
import MinimalPagination from '@/components/MinimalPagination';

export const metadata: Metadata = {
  title: 'ประกาศจัดซื้อจัดจ้างและพัสดุ | คณะสังคมศาสตร์ มรภ.เชียงราย',
  description:
    'ศูนย์ข้อมูลการจัดซื้อจัดจ้าง แผนการจัดหาพัสดุ ประกาศผู้ชนะการเสนอราคา และความโปร่งใส คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/eservice/procurement',
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProcurementPublicPage(props: Props) {
  const resolvedParams = await props.searchParams;
  const currentYear = resolvedParams.year ? parseInt(resolvedParams.year as string, 10) : undefined;
  const currentType = (resolvedParams.type as string) || undefined;
  const currentCategory = (resolvedParams.category as string) || undefined;
  const currentStatus = (resolvedParams.status as string) || undefined;
  const currentSearch = (resolvedParams.q as string) || undefined;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;

  const { data: records, meta } = await fetchProcurementList({
    fiscalYear: currentYear,
    procurementType: currentType,
    category: currentCategory,
    status: currentStatus,
    search: currentSearch,
    page: currentPage,
    limit: 15,
  });

  const totalBudget = records.reduce((acc, curr) => acc + (parseFloat(curr.budget as string) || 0), 0);
  const completedCount = records.filter((r) => r.status === 'COMPLETED').length;

  const currentBE = new Date().getFullYear() + 543;
  const fiscalYears = [currentBE, currentBE - 1, currentBE - 2, currentBE - 3];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-scholar-deep via-[#16234B] to-scholar-deep text-white py-14 px-4 text-center border-b-4 border-scholar-accent shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-scholar-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <ClipboardList className="w-4 h-4" />
            <span>Transparency & Procurement Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-3">
            ประกาศจัดซื้อจัดจ้างและพัสดุ
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย — ตรวจสอบความโปร่งใส ขอบเขตงาน (TOR) ประกาศจัดซื้อจัดจ้าง และผลการคัดเลือก
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">รายการทั้งหมด</p>
              <p className="text-2xl font-bold text-slate-800">{meta.total} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">งบประมาณรวม (หน้าที่แสดง)</p>
              <p className="text-2xl font-bold text-emerald-700">{formatThaiBaht(totalBudget)} <span className="text-xs font-normal text-slate-400">บาท</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">สถานะแล้วเสร็จ</p>
              <p className="text-2xl font-bold text-slate-800">{completedCount} <span className="text-xs font-normal text-slate-400">โครงการ</span></p>
            </div>
          </div>
        </div>

        {/* Filter & Search Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <form method="GET" className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={currentSearch || ''}
                  placeholder="ค้นหาชื่อโครงการ, รายการจัดซื้อ, หรือชื่อผู้เสนอราคา..."
                  className="input input-bordered w-full pl-10 bg-slate-50 focus:bg-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="btn bg-scholar-deep hover:bg-slate-900 text-white font-medium px-6 gap-2"
              >
                <Search className="w-4 h-4" />
                ค้นหา
              </button>

              {(currentSearch || currentYear || currentType || currentCategory || currentStatus) && (
                <Link
                  href="/eservice/procurement"
                  className="btn btn-ghost border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  ล้างตัวกรอง
                </Link>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              {/* Year Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">ปีงบประมาณ</label>
                <select
                  name="year"
                  defaultValue={currentYear || ''}
                  className="select select-bordered select-sm w-full bg-slate-50 text-xs"
                >
                  <option value="">ทุกปีงบประมาณ</option>
                  {fiscalYears.map((y) => (
                    <option key={y} value={y}>
                      ปีงบประมาณ {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">วิธีการจัดซื้อจัดจ้าง</label>
                <select
                  name="type"
                  defaultValue={currentType || ''}
                  className="select select-bordered select-sm w-full bg-slate-50 text-xs"
                >
                  <option value="">ทุกวิธีจัดซื้อ</option>
                  {PROCUREMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">หมวดหมู่งาน</label>
                <select
                  name="category"
                  defaultValue={currentCategory || ''}
                  className="select select-bordered select-sm w-full bg-slate-50 text-xs"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {PROCUREMENT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">สถานะโครงการ</label>
                <select
                  name="status"
                  defaultValue={currentStatus || ''}
                  className="select select-bordered select-sm w-full bg-slate-50 text-xs"
                >
                  <option value="">ทุกสถานะ</option>
                  {PROCUREMENT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results List */}
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">ไม่พบรายการจัดซื้อจัดจ้างตามเงื่อนไข</h3>
            <p className="text-sm text-slate-500 mb-4">ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองใหม่อีกครั้ง</p>
            <Link href="/eservice/procurement" className="btn btn-sm btn-outline border-slate-300">
              ดูรายการทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((item) => {
              const statusInfo = getProcurementStatusInfo(item.status);
              const docs = item.documents || [];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-scholar-accent/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-scholar-deep text-white">
                          ปีงบ {item.fiscalYear}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {getProcurementCategoryLabel(item.category)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {getProcurementTypeLabel(item.procurementType)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <Link
                        href={`/eservice/procurement/${item.id}`}
                        className="block text-lg md:text-xl font-bold text-slate-800 hover:text-scholar-accent transition-colors leading-snug"
                      >
                        {item.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                        {item.vendorName && (
                          <div className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>คู่สัญญา/ผู้ชนะ: <strong className="text-slate-700">{item.vendorName}</strong></span>
                          </div>
                        )}
                        {item.approvedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>วันที่ประกาศ: {formatThaiDate(item.approvedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Budget Display */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-right min-w-[200px] shrink-0">
                      <p className="text-xs text-slate-500 font-medium">วงเงินงบประมาณ</p>
                      <p className="text-xl font-extrabold text-slate-900">{formatThaiBaht(item.budget)} <span className="text-xs font-normal text-slate-500">บาท</span></p>
                      {item.contractAmount && (
                        <p className="text-xs text-emerald-700 mt-0.5">
                          สัญญาจริง: <strong className="font-bold">{formatThaiBaht(item.contractAmount)}</strong> บาท
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom: PDF Documents Attachment Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                        <FileText className="w-3.5 h-3.5" />
                        เอกสารแนบ ({docs.length}):
                      </span>

                      {docs.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">ไม่มีไฟล์แนบ</span>
                      ) : (
                        docs.map((doc) => {
                          const targetUrl = doc.fileUrl ? getProcurementFileUrl(doc.fileUrl) : doc.externalUrl || '#';
                          const isExternal = !doc.fileUrl && !!doc.externalUrl;

                          return (
                            <a
                              key={doc.id}
                              href={targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium transition-colors"
                              title={doc.title}
                            >
                              <FileText className="w-3 h-3 shrink-0" />
                              <span className="max-w-[180px] truncate">{doc.title}</span>
                              {isExternal ? (
                                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                              ) : (
                                <Download className="w-3 h-3 shrink-0 opacity-70" />
                              )}
                            </a>
                          );
                        })
                      )}
                    </div>

                    <Link
                      href={`/eservice/procurement/${item.id}`}
                      className="inline-flex items-center justify-end gap-1 text-xs font-bold text-scholar-accent hover:text-red-700 group transition-colors shrink-0"
                    >
                      <span>ดูรายละเอียดและดาวน์โหลด</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="pt-6">
                <MinimalPagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  basePath="/eservice/procurement"
                  searchParams={{
                    ...(currentYear ? { year: currentYear.toString() } : {}),
                    ...(currentType ? { type: currentType } : {}),
                    ...(currentCategory ? { category: currentCategory } : {}),
                    ...(currentStatus ? { status: currentStatus } : {}),
                    ...(currentSearch ? { q: currentSearch } : {}),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
