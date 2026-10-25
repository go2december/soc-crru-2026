import { Building2, PhoneCall, HelpCircle, GraduationCap, ExternalLink, MapPin, Mail } from 'lucide-react';

export default function AdmissionContactDesk() {
    return (
        <section className="bg-gradient-to-br from-white via-slate-50 to-amber-50/20 rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-[#0B132B] text-white">
                    <Building2 className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] font-heading">
                        ศูนย์ประสานงานและการรับสมัครนักศึกษา
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                        คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                {/* 1. Contact Info */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-[#C2410C]">
                        <PhoneCall className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            สอบถามรายละเอียด
                        </h3>
                        <p className="text-slate-700 text-xs font-semibold">
                            โทร. 053-776-000 ต่อ สำนักงานคณบดี
                        </p>
                        <p className="text-slate-500 text-xs">
                            วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น. (เว้นวันหยุดราชการ)
                        </p>
                        <div className="pt-1">
                            <a
                                href="https://www.facebook.com/soc.crru"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#C2410C] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                                <span>Facebook: คณะสังคมศาสตร์ CRRU</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. Location */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-[#C2410C]">
                        <MapPin className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            ที่ตั้งสำนักงาน
                        </h3>
                        <p className="text-slate-700 text-xs font-medium leading-relaxed">
                            ชั้น 1 อาคารคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                        </p>
                        <p className="text-slate-500 text-xs">
                            เลขที่ 80 หมู่ 9 ถ.พหลโยธิน ต.บ้านดู่ อ.เมือง จ.เชียงราย 57100
                        </p>
                    </div>
                </div>

                {/* 3. Central System Portal */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-[#C2410C]">
                        <GraduationCap className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            ระบบรับสมัครส่วนกลาง มรภ.ชร.
                        </h3>
                        <p className="text-slate-500 text-xs">
                            สำนักส่งเสริมวิชาการและงานทะเบียน (สวท.)
                        </p>
                        <div className="pt-1">
                            <a
                                href="https://admission.crru.ac.th/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B132B] hover:bg-[#1f2d52] text-white text-xs font-bold transition-colors shadow-2xs"
                            >
                                <span>admission.crru.ac.th</span>
                                <ExternalLink className="w-3 h-3 text-[#F59E0B]" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
