import { Mail, Phone, MapPin, Facebook, Clock, ArrowRight, ExternalLink, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ติดต่อเรา | ศูนย์เชียงรายศึกษา',
    description: 'ติดต่อสอบถามข้อมูล เยี่ยมชม หรือประสานงานความร่วมมือกับศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    openGraph: {
        title: 'ติดต่อเรา | ศูนย์เชียงรายศึกษา',
        description: 'ติดต่อสอบถามข้อมูล เยี่ยมชม หรือประสานงานความร่วมมือกับศูนย์เชียงรายศึกษา',
        url: '/chiang-rai-studies/contact',
        siteName: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
        locale: 'th_TH',
        type: 'website',
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20 font-kanit text-[#2e1065]">
            {/* Header - Compact & Elegant */}
            <div className="bg-[#2e1065] text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent z-10"></div>

                <div className="container mx-auto px-4 text-center relative z-20">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-orange-200 text-[10px] font-bold tracking-widest uppercase mb-4 border border-white/10 backdrop-blur-md">
                        Contact Us
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        ติดต่อ<span className="text-orange-400">ศูนย์เชียงรายศึกษา</span>
                    </h1>
                    <p className="text-purple-200/80 max-w-lg mx-auto text-base font-light">
                        คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย<br />
                        แหล่งเรียนรู้ภูมิปัญญาล้านนาและชาติพันธุ์
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-30 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column: Contact Info (Compact) */}
                    <div className="md:col-span-5 space-y-6">

                        {/* Main Contact Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-50 hover:border-orange-100 transition-all group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">ที่ตั้งสำนักงาน</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed font-light">
                                        คณะสังคมศาสตร์ (อาคาร 4)<br />
                                        มหาวิทยาลัยราชภัฏเชียงราย<br />
                                        80 หมู่ 9 ถ.พหลโยธิน ต.บ้านดู่<br />
                                        อ.เมือง จ.เชียงราย 57100
                                    </p>
                                </div>
                            </div>

                            <a href="https://maps.app.goo.gl/dP5ZgoSctvLc8KdG6" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl border border-purple-100 flex items-center justify-center gap-2 text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors uppercase tracking-wide">
                                Open in Google Maps <ExternalLink size={14} />
                            </a>
                        </div>

                        {/* Quick Contacts Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <a href="tel:053776000" className="bg-white p-5 rounded-3xl shadow-sm border border-purple-50 hover:shadow-md hover:border-orange-200 transition-all group">
                                <Phone size={20} className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Telephone</p>
                                <p className="font-bold text-base text-[#2e1065]">053-776-000</p>
                                <p className="text-[10px] text-stone-400">ต่อ 1234</p>
                            </a>

                            <a href="mailto:social@crru.ac.th" className="bg-white p-5 rounded-3xl shadow-sm border border-purple-50 hover:shadow-md hover:border-blue-200 transition-all group">
                                <Mail size={20} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Email</p>
                                <p className="font-bold text-base text-[#2e1065] truncate">cr.studies@crru.ac.th</p>
                                <p className="text-[10px] text-stone-400">24hr Response</p>
                            </a>
                        </div>

                        {/* Social & Website */}
                        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 overflow-hidden divide-y divide-purple-50">
                            <a href="https://www.facebook.com/social.crru" target="_blank" className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Facebook size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-blue-700">Social Science CRRU</span>
                                </div>
                                <ArrowRight size={16} className="text-stone-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </a>
                            <a href="https://social.crru.ac.th" target="_blank" className="flex items-center justify-between p-4 hover:bg-orange-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                        <GraduationCap size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-orange-700">เว็บไซต์คณะสังคมศาสตร์</span>
                                </div>
                                <ArrowRight size={16} className="text-stone-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </a>
                        </div>

                        {/* Office Hours - Compact */}
                        <div className="bg-[#2e1065] p-6 rounded-3xl text-white relative overflow-hidden">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-orange-400" size={20} />
                                    <div>
                                        <h3 className="text-sm font-bold">เวลาทำการ</h3>
                                        <p className="text-[10px] text-purple-200">จันทร์ - ศุกร์</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-white">08:30 - 16:30</p>
                                    <p className="text-[10px] text-purple-300 opacity-70">ปิดวันหยุดราชการ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Full Height Map */}
                    <div className="md:col-span-7 h-full min-h-[400px]">
                        <div className="bg-white p-1.5 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100 h-full relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1872.0!2d99.8490139!3d19.9807707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d701d4c7e675d5%3A0x7de07db9ed543a61!2z4LiE4LiT4Liw4Liq4Lix4LiH4LiE4Lih4Lio4Liy4Liq4LiV4Lij4LmMIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4o-C4suC4iuC4oOC4seC4j-C5gOC4iuC4teC4ouC4h-C4o-C4suC4og!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth"
                                className="w-full h-full rounded-[1.7rem] filter grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
                                loading="lazy"
                                allowFullScreen
                            ></iframe>

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-xs font-bold text-[#2e1065] flex items-center gap-2 group-hover:translate-y-1 transition-transform">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                อาคาร 4 คณะสังคมศาสตร์
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
