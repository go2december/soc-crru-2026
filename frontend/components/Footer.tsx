import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-scholar-deep text-white/80 font-sans pt-16 pb-8 border-t-4 border-scholar-accent">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand & Address */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <img
                                    src="/images/soc-logo.png"
                                    alt="Faculty of Social Sciences Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white leading-none">Faculty of Social Sciences</span>
                                <span className="text-[10px] text-scholar-gold uppercase tracking-widest mt-1">Chiang Rai Rajabhat University</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                            คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย <br />
                            มุ่งเน้นการสร้างนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน
                        </p>
                        <div className="pt-4 space-y-2 text-sm">
                            <p className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-scholar-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่ <br /> อำเภอเมือง จังหวัดเชียงราย 57100</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>053-776-000 ต่อ 1500</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:social@crru.ac.th" className="hover:text-white transition-colors">social@crru.ac.th</a>
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Programs */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-scholar-accent pl-3">หลักสูตร (Programs)</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/programs/social-dev" className="hover:text-scholar-gold transition-colors">สาขาวิชาการพัฒนาสังคม</Link></li>
                            <li><Link href="/programs/social-sci" className="hover:text-scholar-gold transition-colors">สาขาวิชาสังคมศาสตร์</Link></li>
                            <li><Link href="/programs/home-eco" className="hover:text-scholar-gold transition-colors">สาขาวิชาคหกรรมศาสตร์ประยุกต์</Link></li>
                            <li><Link href="/programs/social-psych" className="hover:text-scholar-gold transition-colors">สาขาวิชาจิตวิทยาสังคม</Link></li>
                            <li><Link href="/programs/gis" className="hover:text-scholar-gold transition-colors">สาขาวิชาภูมิสารสนเทศ</Link></li>
                            <li className="pt-2 border-t border-white/10 mt-2">
                                <Link href="/programs/master-phd" className="text-scholar-gold hover:text-white transition-colors">บัณฑิตศึกษา (ป.โท-เอก)</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-scholar-accent pl-3">ลิงก์ด่วน (Quick Links)</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/admissions" className="hover:text-white transition-colors">รับสมัครนักศึกษาใหม่</Link></li>
                            <li><Link href="/academics/credit-bank" className="hover:text-white transition-colors">ระบบคลังหน่วยกิต (Credit Bank)</Link></li>
                            <li><Link href="/academics/short-courses" className="hover:text-white transition-colors">คอร์สฝึกอบรมระยะสั้น</Link></li>
                            <li><Link href="/research/database" className="hover:text-white transition-colors">ฐานข้อมูลงานวิจัย</Link></li>
                            <li><Link href="/eservice/student" className="hover:text-white transition-colors">บริการนักศึกษา (Student Service)</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-scholar-accent pl-3">ติดตามเรา (Connect)</h3>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110">
                                {/* Facebook Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all transform hover:scale-110">
                                {/* YouTube Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00C300] hover:text-white transition-all transform hover:scale-110">
                                {/* Line Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 4.88.5 10.3c0 2.87 1.48 5.48 3.91 7.23-.19.85-.75 2.1-1.6 2.58 1.4.15 4.79-1.2 5.46-1.7 1.2.34 2.47.52 3.73.52 6.27 0 11.5-4.38 11.5-9.8S18.27.5 12 .5z" /></svg>
                            </a>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <p className="text-xs mb-2">รับข่าวสารกิจกรรมและหลักสูตรใหม่ๆ</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="อีเมลของคุณ" className="input input-sm bg-white/10 border-none w-full text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-scholar-accent" />
                                <button className="btn btn-sm btn-primary bg-scholar-accent border-none text-white hover:bg-red-600">สมัคร</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>© 2026 Faculty of Social Sciences, Chiang Rai Rajabhat University. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
