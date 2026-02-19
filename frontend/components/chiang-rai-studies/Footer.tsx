
import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone, ExternalLink, Globe } from 'lucide-react';

export default function ChiangRaiFooter() {
    return (
        <footer className="bg-[#2e1065] text-purple-200 pt-16 pb-8 border-t border-purple-900 font-kanit relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">CR</div>
                            <span className="text-xl font-bold text-white">ศูนย์เชียงรายศึกษา</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-purple-300 font-light">
                            แหล่งรวบรวมองค์ความรู้ด้านประวัติศาสตร์ โบราณคดี ศิลปวัฒนธรรม และภูมิปัญญาท้องถิ่นของจังหวัดเชียงรายและล้านนา เพื่อการอนุรักษ์และต่อยอดสู่อนาคต
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-orange-400 mt-1 flex-shrink-0" />
                                <span>ชั้น 1 อาคารคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย<br />เลขที่ 80 หมู่ 9 ถ.พหลโยธิน ต.บ้านดู่ อ.เมือง จ.เชียงราย 57100</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-orange-400 flex-shrink-0" />
                                <span>053-776-000 ต่อ 1234</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-orange-400 flex-shrink-0" />
                                <span>cr.studies@crru.ac.th</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-orange-500 pl-3">เมนูลัด</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/chiang-rai-studies/archive" className="hover:text-orange-300 transition flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> คลังข้อมูล 5 อัตลักษณ์</Link></li>
                            <li><Link href="/chiang-rai-studies/articles" className="hover:text-orange-300 transition flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> บทความวิชาการ</Link></li>
                            <li><Link href="/chiang-rai-studies/staff" className="hover:text-orange-300 transition flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> บุคลากรศูนย์ฯ</Link></li>
                            <li><Link href="/chiang-rai-studies/contact" className="hover:text-orange-300 transition flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> ติดต่อเรา</Link></li>
                            <li><Link href="/chiang-rai-studies/admin" className="hover:text-orange-300 transition flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> สำหรับเจ้าหน้าที่ (Admin)</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Network */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-orange-500 pl-3">หน่วยงานที่เกี่ยวข้อง</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="https://social.crru.ac.th" target="_blank" className="flex items-center gap-2 hover:text-orange-300 transition">
                                    <ExternalLink size={14} /> คณะสังคมศาสตร์
                                </a>
                            </li>
                            <li>
                                <a href="https://www.crru.ac.th" target="_blank" className="flex items-center gap-2 hover:text-orange-300 transition">
                                    <ExternalLink size={14} /> มหาวิทยาลัยราชภัฏเชียงราย
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:text-orange-300 transition">
                                    <ExternalLink size={14} /> สำนักศิลปะและวัฒนธรรม
                                </a>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <h4 className="text-sm font-bold text-purple-300 mb-4">ติดตามเรา</h4>
                            <div className="flex gap-4">
                                <a href="#" className="bg-purple-900/50 p-2 rounded-full hover:bg-blue-600 hover:text-white transition group border border-purple-800"><Facebook size={20} className="group-hover:scale-110 transition" /></a>
                                <a href="#" className="bg-purple-900/50 p-2 rounded-full hover:bg-sky-500 hover:text-white transition group border border-purple-800"><Globe size={20} className="group-hover:scale-110 transition" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-purple-900/50 pt-8 text-center text-xs text-purple-400 flex flex-col md:flex-row justify-between items-center gap-4 font-light">
                    <p>© 2026 Chiang Rai Studies Center. All rights reserved.</p>
                    <p>Designed by Social Sciences Faculty, CRRU.</p>
                </div>
            </div>
        </footer>
    );
}
