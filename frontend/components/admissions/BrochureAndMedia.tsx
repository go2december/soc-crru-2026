import { PlayCircle, FileText, Download, ChevronRight, FileDown } from 'lucide-react';
import BrochureLightbox from '@/components/BrochureLightbox';
import { AdmissionDocument } from '@/lib/admissions';

interface BrochureAndMediaProps {
    videoUrl?: string | null;
    brochureUrl?: string | null;
    documents: AdmissionDocument[];
    apiUrl?: string;
}

export default function BrochureAndMedia({
    videoUrl,
    brochureUrl,
    documents,
    apiUrl = '',
}: BrochureAndMediaProps) {
    const finalVideoUrl = videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const finalBrochureUrl = brochureUrl || '/images/admission-brochure.png';

    return (
        <section className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">
                    สื่อแนะนำและเอกสารสำคัญ
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] font-heading mt-1">
                    ข้อมูลแนะนำคณะและระเบียบการรับสมัคร
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 1. Video Presentation (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#C2410C]/10 text-[#C2410C]">
                                <PlayCircle className="w-5 h-5" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-[#0B132B] font-heading">
                                    แนะนำคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                                </h3>
                                <p className="text-xs text-slate-500">
                                    บรรยากาศการเรียน กิจกรรม และความพร้อมของคณาจารย์
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                            วิดีทัศน์แนะนำ
                        </span>
                    </div>

                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black ring-1 ring-slate-200 shadow-inner">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={finalVideoUrl}
                            title="วิดีโอแนะนำคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        สัมผัสประสบการณ์การเรียนการสอนด้านสังคมศาสตร์ยุคใหม่ มุ่งเน้นการลงพื้นที่ปฏิบัติงานจริง พัฒนานวัตกรรมชุมชนร่วมกับคณาจารย์ผู้ทรงคุณวุฒิ เพื่อการพัฒนาอนุภูมิภาคลุ่มน้ำโขงอย่างยั่งยืน
                    </p>
                </div>

                {/* 2. Brochure & Downloads (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Brochure Card */}
                    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FileDown className="w-4 h-4 text-[#C2410C]" strokeWidth={1.75} />
                                <h3 className="text-sm font-bold text-[#0B132B] font-heading">
                                    แผ่นพับประชาสัมพันธ์
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                                คลิกที่รูปเพื่อขยาย
                            </span>
                        </div>
                        <BrochureLightbox
                            src={finalBrochureUrl}
                            alt="แผ่นพับประชาสัมพันธ์การรับสมัครนักศึกษา คณะสังคมศาสตร์"
                            apiUrl={apiUrl}
                        />
                    </div>

                    {/* Official Documents Card */}
                    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-[#C2410C]" strokeWidth={1.75} />
                                <h3 className="text-sm font-bold text-[#0B132B] font-heading">
                                    ประกาศและเอกสารดาวน์โหลด
                                </h3>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {documents.length} รายการ
                            </span>
                        </div>

                        {documents.length > 0 ? (
                            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                                {documents.map((doc) => {
                                    const fileHref = doc.fileUrl.startsWith('/') && apiUrl
                                        ? `${apiUrl}${doc.fileUrl}`
                                        : doc.fileUrl;
                                    return (
                                        <li key={doc.id}>
                                            <a
                                                href={fileHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-3.5 py-3 text-slate-700 hover:text-[#C2410C] hover:bg-slate-50 transition-colors group"
                                            >
                                                <FileText className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={1.75} />
                                                <span className="flex-1 text-xs font-medium leading-snug line-clamp-2">
                                                    {doc.title}
                                                </span>
                                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#C2410C] shrink-0 transition-opacity" />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="py-6 px-4 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                                <FileText className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                                ไม่มีประกาศหรือเอกสารดาวน์โหลดเพิ่มเติมในขณะนี้
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
