import Link from "next/link";
import { ArrowRight, CalendarCheck, PlayCircle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-config";

interface AdmissionConfigData {
  youtubeVideoUrl?: string | null;
  admissionTitle?: string | null;
  admissionSubtitle?: string | null;
}

interface AdmissionScheduleItem {
  id: number | string;
  roundName: string;
  periodText?: string;
  status: string;
}

function getYoutubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function AdmissionsBanner() {
  const baseUrl = getApiBaseUrl();

  let config: AdmissionConfigData | null = null;
  let schedules: AdmissionScheduleItem[] = [];

  try {
    const [cfgRes, schRes] = await Promise.all([
      fetch(`${baseUrl}/api/admissions/config`, { next: { revalidate: 120 } }),
      fetch(`${baseUrl}/api/admissions/schedules`, { next: { revalidate: 120 } }),
    ]);
    if (cfgRes.ok) config = await cfgRes.json();
    if (schRes.ok) {
      const data = await schRes.json();
      if (Array.isArray(data)) {
        schedules = data.filter((s) => s.status !== "CLOSED").slice(0, 3);
      }
    }
  } catch {
    // Graceful fallback
  }

  const embedUrl = getYoutubeEmbedUrl(config?.youtubeVideoUrl);

  return (
    <section className="py-16 bg-[#0B132B] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Admissions Info */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-300 tracking-wide">
              <CalendarCheck className="size-3.5" />
              <span>การรับสมัครนักศึกษาใหม่</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              {config?.admissionTitle || "เปิดรับสมัครนักศึกษาใหม่ คณะสังคมศาสตร์"}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {config?.admissionSubtitle ||
                "ก้าวสู่เส้นทางนักพัฒนาสังคม นักรัฐศาสตร์ และนักวิชาการมืออาชีพ พร้อมทุนการศึกษาและโอกาสฝึกปฏิบัติงานจริงในพื้นที่ภาคเหนือ"}
            </p>

            {schedules.length > 0 && (
              <div className="space-y-2 pt-1">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-sm bg-white/5 border border-white/10 text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-white">{sch.roundName}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {sch.periodText && (
                        <span className="text-slate-300 hidden sm:inline">
                          {sch.periodText}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                        {sch.status === "OPEN" ? "เปิดรับสมัคร" : sch.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#C2410C] hover:bg-[#C2410C]/90 text-white font-semibold text-sm transition-colors"
              >
                <span>ดูรายละเอียดการรับสมัครทั้งหมด</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right: Video Showcase */}
          <div className="lg:col-span-6">
            <div className="aspect-video w-full rounded-sm overflow-hidden border border-white/15 bg-slate-900 shadow-lg">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="แนะนำคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Link
                  href="/admissions"
                  className="relative block w-full h-full group overflow-hidden"
                >
                  <img
                    src="/images/admission-brochure.png"
                    alt="รับสมัครนักศึกษาใหม่ คณะสังคมศาสตร์ มร.ชร."
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="font-bold text-base text-white">
                        คู่มือและช่องทางการรับสมัครนักศึกษา
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        คลิกเพื่อดูรายละเอียดรอบรับสมัครและเกณฑ์คัดเลือก
                      </p>
                    </div>
                    <PlayCircle className="size-9 text-[#C2410C] shrink-0" strokeWidth={1.75} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
