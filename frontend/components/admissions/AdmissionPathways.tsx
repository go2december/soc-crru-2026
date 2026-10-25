import Link from 'next/link';
import { GraduationCap, BookOpen, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdmissionPathwaysProps {
    bachelorLink: string;
    graduateLink: string;
}

export default function AdmissionPathways({ bachelorLink, graduateLink }: AdmissionPathwaysProps) {
    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                    <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">
                        เส้นทางการศึกษา
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] font-heading mt-1">
                        เลือกระดับการศึกษาที่ตรงกับเป้าหมายของคุณ
                    </h2>
                </div>
                <Link
                    href="/programs"
                    className="text-xs font-semibold text-slate-600 hover:text-[#C2410C] flex items-center gap-1 transition-colors self-start sm:self-auto"
                >
                    ดูข้อมูล 7 สาขาวิชาทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Bachelor Pathway */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-[#0B132B] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                            <GraduationCap className="w-6 h-6 text-[#F59E0B]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-[#0B132B] font-heading group-hover:text-[#C2410C] transition-colors">
                                    ระดับปริญญาตรี
                                </h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                                    4 ปี / เทียบโอน
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                เปิดรับผู้จบ ม.6, ปวช., กศน. หรือเทียบเท่า เข้าศึกษาใน 7 สาขาวิชาทางสังคมศาสตร์ มุ่งเน้นการลงมือปฏิบัติจริง
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>รับสมัครตรง ไม่ต้องสอบข้อเขียน • ไม่มีสอบสัมภาษณ์</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>มีสิทธิ์ยื่นกู้ยืมกองทุน กยศ. ตามระเบียบ พร้อมทุนคณะ</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>ฝึกงานสหกิจศึกษากับองค์กรชั้นนำและชุมชน</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-6">
                        <a
                            href={bachelorLink || 'https://admission.crru.ac.th/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#1a2647] text-white text-xs font-bold transition-all shadow-xs"
                        >
                            <span>เข้าสู่ระบบรับสมัคร ป.ตรี</span>
                            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                        </a>
                    </div>
                </div>

                {/* 2. Graduate Pathway */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-[#C2410C] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                            <BookOpen className="w-6 h-6 text-white" strokeWidth={1.75} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-[#0B132B] font-heading group-hover:text-[#C2410C] transition-colors">
                                    ระดับบัณฑิตศึกษา
                                </h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200">
                                    ป.โท &amp; ป.เอก
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                ยกระดับทักษะการวิจัย นวัตกรรมนโยบาย และการพัฒนาสังคมเชิงพื้นที่ มีทั้งภาคปกติและภาคพิเศษเสาร์-อาทิตย์
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>หลักสูตรสำหรับคนทำงาน เรียนวันหยุดสุดสัปดาห์</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>อาจารย์ที่ปรึกษาวิทยานิพนธ์ผู้เชี่ยวชาญระดับชาติ</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>เครือข่ายงานวิจัยอนุภูมิภาคลุ่มน้ำโขง</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-6">
                        <a
                            href={graduateLink || 'https://orasis.crru.ac.th/gds_crru/index.php/main/home'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#a3360a] text-white text-xs font-bold transition-all shadow-xs"
                        >
                            <span>เข้าสู่ระบบบัณฑิตวิทยาลัย</span>
                            <ArrowRight className="w-4 h-4 text-white" />
                        </a>
                    </div>
                </div>

                {/* 3. Lifelong Learning & Credit Bank */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center transition-transform group-hover:scale-105">
                            <Layers className="w-6 h-6 text-[#C2410C]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-[#0B132B] font-heading group-hover:text-[#C2410C] transition-colors">
                                    หลักสูตรระยะสั้น &amp; คลังหน่วยกิต
                                </h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                                    Credit Bank
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                เรียนสะสมหน่วยกิตล่วงหน้า Reskill/Upskill สำหรับบุคคลทั่วไปและนักเรียน ม.ปลาย เทียบโอนสู่ปริญญาได้
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>สะสมหน่วยกิตได้ไม่จำกัดระยะเวลา</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>ประกาศนียบัตรรับรองทักษะเฉพาะด้าน</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>เรียนแบบ Modular ตามความสะดวกของผู้เรียน</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-6">
                        <Link
                            href="/academics/credit-bank"
                            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                        >
                            <span>สำรวจระบบธนาคารหน่วยกิต</span>
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
