
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Landmark, MapPin, Feather, Search, Scroll, Palette } from 'lucide-react';

export default function ChiangRaiHome() {
    const identities = [
        { id: 'HISTORY', title: 'ประวัติศาสตร์', icon: Landmark, desc: 'เรื่องราวความเป็นมาในอดีต', color: 'bg-purple-100 text-purple-700' },
        { id: 'ARCHAEOLOGY', title: 'โบราณคดี', icon: Scroll, desc: 'หลักฐานทางโบราณคดี', color: 'bg-slate-200 text-slate-700' },
        { id: 'CULTURE', title: 'ประเพณี/ชาติพันธุ์', icon: Users, desc: 'วิถีชีวิตและกลุ่มชาติพันธุ์', color: 'bg-orange-100 text-orange-700' },
        { id: 'ARTS', title: 'ศิลปะการแสดง', icon: Palette, desc: 'ดนตรีและการแสดงพื้นบ้าน', color: 'bg-fuchsia-100 text-fuchsia-700' },
        { id: 'WISDOM', title: 'ภูมิปัญญาท้องถิ่น', icon: Feather, desc: 'องค์ความรู้ฉบับชาวบ้าน', color: 'bg-emerald-100 text-emerald-700' },
    ];

    return (
        <div className="bg-[#FAF5FF] font-kanit">
            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-[#2e1065]">
                {/* Background Pattern - Subtle Lanna texture or nodes */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:32px_32px]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2e1065] via-transparent to-[#2e1065] opacity-90"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center mt-[-50px]">
                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xl animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]"></span>
                        Faculty of Social Sciences, Chiang Rai Rajabhat University
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-orange-400 drop-shadow-sm">ศูนย์เชียงรายศึกษา</span>
                        <span className="block text-purple-200/60 text-2xl md:text-3xl mt-4 font-light tracking-[0.2em]">
                            CHIANG RAI STUDIES CENTER
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-purple-100/70 mb-12 leading-relaxed font-light">
                        รวบรวมองค์ความรู้ อัตลักษณ์ ประวัติศาสตร์ และภูมิปัญญาแห่งล้านนา <br className="hidden md:block" />
                        ภายใต้สีม่วงบัวสายอันสง่างาม เพื่อการสืบสานและต่อยอดสู่สากล
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/chiang-rai-studies/archive"
                            className="group relative px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] flex items-center gap-3 overflow-hidden transform hover:-translate-y-1"
                        >
                            <Search size={20} className="relative z-10" />
                            <span className="relative z-10">สืบค้นคลังดิจิทัล</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </Link>

                        <Link href="/chiang-rai-studies/about"
                            className="px-10 py-4 bg-purple-900/50 border border-purple-400/30 text-purple-100 hover:border-orange-400 hover:text-orange-400 font-medium rounded-full transition-all backdrop-blur-sm flex items-center gap-3 transform hover:-translate-y-1"
                        >
                            รู้จักศูนย์ฯ <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Decorative Bottom Wave/Mist */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#FAF5FF] to-transparent pointer-events-none"></div>
            </section>

            {/* 5 Identities Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2e1065] mb-4">5 อัตลักษณ์เชียงราย</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-800 to-orange-500 mx-auto rounded-full mb-8"></div>
                        <p className="text-purple-900/60 max-w-2xl mx-auto text-lg font-light">
                            จำแนกองค์ความรู้เชียงรายผ่าน 5 มิติสำคัญ เพื่อทนุบำรุงศิลปวัฒนธรรมอย่างเป็นระบบ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {identities.map((item, idx) => (
                            <Link
                                key={item.id}
                                href={`/chiang-rai-studies/archive?category=${item.id}`}
                                className="group relative p-10 rounded-3xl bg-white border border-purple-100 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col items-center text-center overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                            >
                                <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition duration-500 shadow-lg group-hover:shadow-orange-200`}>
                                    <item.icon size={36} />
                                </div>
                                <h3 className="font-bold text-xl text-[#2e1065] mb-3 group-hover:text-orange-600 transition">{item.title}</h3>
                                <p className="text-sm text-purple-900/40 mb-8 font-light leading-relaxed">{item.desc}</p>

                                <span className="mt-auto inline-flex items-center text-xs font-bold text-purple-400 uppercase tracking-[0.2em] group-hover:text-orange-600 transition gap-1">
                                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>

                                {/* Subtle Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic & Articles Preview */}
            <section className="py-24 bg-white/50 backdrop-blur-md border-y border-purple-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl animate-fade-in-up">
                            <span className="text-orange-600 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Knowledge Hub</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2e1065] mb-4 text-shadow-sm">บทความและงานวิจัยล่าสุด</h2>
                            <p className="text-purple-900/50 font-light text-lg italic">"รวบรวมภูมิปัญญาแห่งปัญญาชนเชียงราย"</p>
                        </div>
                        <Link href="/chiang-rai-studies/articles" className="px-8 py-4 rounded-full border border-purple-200 text-purple-800 hover:bg-[#2e1065] hover:text-white hover:border-[#2e1065] transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-sm">
                            สืบค้นบทความทั้งหมด <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Article 1 */}
                        <article className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="aspect-[16/10] rounded-3xl bg-purple-50 mb-8 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                <div className="absolute top-5 left-5 bg-[#702963] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border border-purple-400/30 shadow-md">
                                    History
                                </div>
                                <img src="https://placehold.co/800x500/702963/white?text=History+of+Lanna" alt="Article" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-purple-400 mb-4 font-bold uppercase tracking-wider">
                                <span className="text-orange-600">Article</span>
                                <span className="w-1 h-1 bg-purple-200 rounded-full"></span>
                                <span>Feb 09, 2026</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#2e1065] mb-4 leading-snug group-hover:text-orange-600 transition duration-300">
                                เวียงหนองหล่ม: ร่องรอยอารยธรรมที่จมดิ่งใต้กาลเวลา
                            </h3>
                            <p className="text-purple-900/50 text-base leading-relaxed mb-6 line-clamp-2 font-light">
                                การตีความใหม่ของนักวิชาการศูนย์เชียงรายศึกษาเกี่ยวกับพงศาวดารโยนกและหลักฐานทางภูมิศาสตร์...
                            </p>
                            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all">
                                อ่านต่อ <ArrowRight size={16} />
                            </div>
                        </article>

                        {/* Article 2 */}
                        <article className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <div className="aspect-[16/10] rounded-3xl bg-purple-50 mb-8 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                <div className="absolute top-5 left-5 bg-[#702963] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border border-purple-400/30 shadow-md">
                                    Research
                                </div>
                                <img src="https://placehold.co/800x500/702963/white?text=Inscriptions" alt="Article" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-purple-400 mb-4 font-bold uppercase tracking-wider">
                                <span className="text-orange-600">Research</span>
                                <span className="w-1 h-1 bg-purple-200 rounded-full"></span>
                                <span>Feb 05, 2026</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#2e1065] mb-4 leading-snug group-hover:text-orange-600 transition duration-300">
                                อักษรธรรรมล้านนา: จากใบลานสู่โลกดิจิทัลคลังข้อมูล
                            </h3>
                            <p className="text-purple-900/50 text-base leading-relaxed mb-6 line-clamp-2 font-light">
                                วิวัฒนาการและการอนุรักษ์ตัวอักษรโบราณด้วยเทคโนโลยีฐานข้อมูลสมัยใหม่ของศูนย์ฯ...
                            </p>
                            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all">
                                อ่านต่อ <ArrowRight size={16} />
                            </div>
                        </article>

                        {/* Article 3 */}
                        <article className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="aspect-[16/10] rounded-3xl bg-purple-50 mb-8 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                <div className="absolute top-5 left-5 bg-[#702963] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border border-purple-400/30 shadow-md">
                                    Culture
                                </div>
                                <img src="https://placehold.co/800x500/702963/white?text=Traditional+Dance" alt="Article" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-purple-400 mb-4 font-bold uppercase tracking-wider">
                                <span className="text-orange-600">Review</span>
                                <span className="w-1 h-1 bg-purple-200 rounded-full"></span>
                                <span>Jan 28, 2026</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#2e1065] mb-4 leading-snug group-hover:text-orange-600 transition duration-300">
                                ฟ้อนเมืองล้านนา: สุนทรียศาสตร์ที่สะท้อนจากจิตวิญญาณ
                            </h3>
                            <p className="text-purple-900/50 text-base leading-relaxed mb-6 line-clamp-2 font-light">
                                เจาะลึกท่าฟ้อนและการแต่งกายที่เป็นอัตลักษณ์เฉพาะของเชียงรายผ่านมุมมองนักมานุษยวิทยา...
                            </p>
                            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all">
                                อ่านต่อ <ArrowRight size={16} />
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}
