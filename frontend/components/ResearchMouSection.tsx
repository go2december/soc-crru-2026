import Link from "next/link";
import {
  FlaskConical,
  Handshake,
  ArrowRight,
  BookOpen,
  Building2,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-config";

interface ResearchProjectItem {
  id: number | string;
  slug: string;
  titleTh?: string;
  titleEn?: string;
  year?: number;
  fundingSource?: string;
  status?: string;
}

interface MouItem {
  id: number | string;
  partnerName: string;
  partnerType?: string;
  status?: string;
}

interface AcademicServiceItem {
  id: number | string;
  title: string;
  category?: string;
}

async function fetchJsonSafe<T>(path: string, fallback: T): Promise<T> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export default async function ResearchMouSection() {
  const [researchRes, mousRes, servicesRes] = await Promise.all([
    fetchJsonSafe<{ data?: ResearchProjectItem[] }>("/api/research/projects?limit=3", {}),
    fetchJsonSafe<MouItem[]>("/api/mous", []),
    fetchJsonSafe<AcademicServiceItem[]>("/api/academic-services", []),
  ]);

  const researchItems = Array.isArray(researchRes?.data)
    ? researchRes.data.slice(0, 3)
    : [];
  const mouItems = Array.isArray(mousRes) ? mousRes.slice(0, 4) : [];
  const serviceItems = Array.isArray(servicesRes) ? servicesRes.slice(0, 2) : [];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
              Research, Services &amp; Partnerships
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
              วิจัย บริการวิชาการ และเครือข่าย MOU
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <Link
              href="/research/database"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#C2410C] transition-colors"
            >
              <span>ฐานข้อมูลวิจัย</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/research/services"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#C2410C] transition-colors"
            >
              <span>บริการวิชาการ</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Featured Research & Academic Services */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-sm border border-slate-200 bg-[#F8FAFC]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <FlaskConical className="size-4 text-[#C2410C]" />
                  โครงการวิจัยเผยแพร่ล่าสุด
                </h3>
                <Link
                  href="/research/database"
                  className="text-xs font-semibold text-[#C2410C] hover:underline"
                >
                  ทั้งหมด
                </Link>
              </div>

              {researchItems.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {researchItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/research/database/${item.slug}`}
                      className="block py-3.5 first:pt-0 last:pb-0 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0B132B] group-hover:text-[#C2410C] transition-colors line-clamp-2">
                            {item.titleTh || item.titleEn || "โครงการวิจัย"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {item.year && (
                              <span className="font-mono font-semibold text-slate-700">
                                พ.ศ. {item.year}
                              </span>
                            )}
                            {item.fundingSource && <span>• {item.fundingSource}</span>}
                          </div>
                        </div>
                        <ArrowRight className="size-4 text-slate-400 group-hover:text-[#C2410C] shrink-0 mt-0.5 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-4">
                  สำรวจคลังงานวิจัยและนวัตกรรมสังคมศาสตร์ได้ที่ฐานข้อมูลงานวิจัยของคณะ
                </p>
              )}
            </div>

            {/* Academic Services Strip */}
            <div className="p-5 rounded-sm border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-sm bg-orange-50 border border-orange-100 text-[#C2410C] flex items-center justify-center shrink-0">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B132B]">
                    ศูนย์บริการวิชาการและถ่ายทอดองค์ความรู้
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {serviceItems.length > 0
                      ? serviceItems.map((s) => s.title).join(" • ")
                      : "บริการอบรม วิจัยเชิงพื้นที่ และที่ปรึกษาพัฒนาท้องถิ่น"}
                  </p>
                </div>
              </div>
              <Link
                href="/research/services/request"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold shrink-0 transition-colors"
              >
                <span>ขอรับบริการวิชาการ</span>
                <ArrowRight className="size-3.5 text-[#C2410C]" />
              </Link>
            </div>
          </div>

          {/* Right 5 Cols: MOU & Partnerships */}
          <div className="lg:col-span-5 p-6 rounded-sm border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <Handshake className="size-4 text-[#581C87]" />
                  ความร่วมมือและเครือข่าย MOU
                </h3>
                <Link
                  href="/research/mou"
                  className="text-xs font-semibold text-[#581C87] hover:underline"
                >
                  ดูทั้งหมด
                </Link>
              </div>

              {mouItems.length > 0 ? (
                <div className="space-y-2.5">
                  {mouItems.map((mou) => (
                    <div
                      key={mou.id}
                      className="p-3.5 rounded-sm bg-white border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Building2 className="size-4 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-[#0B132B] truncate">
                          {mou.partnerName}
                        </span>
                      </div>
                      {mou.partnerType && (
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[11px] font-semibold shrink-0">
                          {mou.partnerType}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-4">
                  ความร่วมมือทางวิชาการกับหน่วยงานภาครัฐ เอกชน และองค์กรปกครองส่วนท้องถิ่น
                </p>
              )}
            </div>

            <Link
              href="/research/mou"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#0B132B] transition-colors"
            >
              <span>ดูเครือข่ายความร่วมมือทั้งหมด</span>
              <ArrowRight className="size-3.5 text-[#C2410C]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
