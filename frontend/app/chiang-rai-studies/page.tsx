import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    BookOpen,
    Landmark,
    ScrollText,
    Users,
    Sparkles,
    Search,
    ChevronRight,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center) | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description: 'แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม: ประวัติศาสตร์, โบราณคดี, ชาติพันธุ์, ศิลปะการแสดง, และภูมิปัญญาท้องถิ่น',
    keywords: ['เชียงรายศึกษา', 'Chiang Rai Studies', 'ล้านนา', 'Lanna', 'ประวัติศาสตร์เชียงราย', 'ชาติพันธุ์เชียงราย', 'ศิลปวัฒนธรรม', 'Social Sciences CRRU'],
    openGraph: {
        title: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
        description: 'แหล่งเรียนรู้อัตลักษณ์เชียงรายและการพัฒนาท้องถิ่นอย่างยั่งยืน',
        url: 'https://soc.crru.ac.th/chiang-rai-studies',
        siteName: 'Faculty of Social Sciences, CRRU',
        images: [
            {
                url: '/images/chiang-rai-cover.jpg', // Placeholder, should be updated with real semantic image
                width: 1200,
                height: 630,
                alt: 'Chiang Rai Studies Center',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
};

async function getLatestActivities() {
    try {
        // Use service name in Docker network if available, fallback to localhost for local dev
        const baseUrl = process.env.INTERNAL_API_URL || 'http://soc_backend:4000';
        const res = await fetch(`${baseUrl}/api/chiang-rai/activities?limit=3`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];

        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return [];
    }
}

async function getStats() {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://soc_backend:4000';
        const res = await fetch(`${baseUrl}/api/chiang-rai/stats`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return null;
    }
}

async function getConfig() {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://soc_backend:4000';
        const res = await fetch(`${baseUrl}/api/chiang-rai/config`, {
            next: { revalidate: 300 } // Config changes less often
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch config:', error);
        return null;
    }
}

export default async function ChiangRaiHomePage() {
    const activities = await getLatestActivities();
    const stats = await getStats();
    const config = await getConfig();

    const heroBg = config?.heroBgUrl || 'https://images.unsplash.com/photo-1598502287823-3b10b769601d?q=80&w=1920&auto=format&fit=crop';

    return (
        <div className="min-h-screen bg-white font-kanit text-slate-800">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#2e1065]">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
                        style={{ backgroundImage: `url('${heroBg}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065] via-[#4c1d95]/90 to-[#3b0764]/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pb-16">
                    <div className="max-w-4xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-orange-300 text-xs font-bold tracking-widest uppercase mb-8 border border-white/10 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            The Wisdom of Lanna
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl tracking-tight">
                            {config?.heroTitle ? (
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-100">
                                    {config.heroTitle}
                                </span>
                            ) : (
                                <>
                                    ศูนย์เชียงราย<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 filter drop-shadow-lg">
                                        ศึกษา
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className="text-xl md:text-2xl text-purple-200 font-light mb-12 max-w-2xl leading-relaxed drop-shadow-md border-l-4 border-orange-500 pl-6">
                            {config?.heroSubtitle || "แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม"}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/chiang-rai-studies/archive">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-orange-600/40 transition-all w-full sm:w-auto transform hover:-translate-y-1">
                                    <Search className="mr-2 h-5 w-5" />
                                    สืบค้นคลังข้อมูล
                                </Button>
                            </Link>
                            <Link href="/chiang-rai-studies/about/history">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full bg-white text-[#2e1065] hover:bg-purple-50 border-transparent font-bold text-lg shadow-lg hover:shadow-purple-500/20 w-full sm:w-auto transform hover:-translate-y-1 transition-all">
                                    รู้จักศูนย์ฯ
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5 Identities Section */}
            <section className="py-24 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-orange-600 tracking-widest uppercase mb-3">Five Dimensions of Chiang Rai</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-[#2e1065]">5 อัตลักษณ์เชียงราย</h3>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-purple-600 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            { id: 'HISTORY', title: 'ประวัติศาสตร์', icon: Landmark, color: 'bg-rose-50 text-rose-600', border: 'hover:border-rose-200' },
                            { id: 'ARCHAEOLOGY', title: 'โบราณคดี', icon: ScrollText, color: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200' },
                            { id: 'CULTURE', title: 'ชาติพันธุ์', icon: Users, color: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200' },
                            { id: 'ARTS', title: 'ศิลปะการแสดง', icon: Sparkles, color: 'bg-violet-50 text-violet-600', border: 'hover:border-violet-200' },
                            { id: 'WISDOM', title: 'ภูมิปัญญาท้องถิ่น', icon: BookOpen, color: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200' },
                        ].map((item, index) => (
                            <Link
                                href={`/chiang-rai-studies/archive?category=${item.id}`}
                                key={index}
                                className={`group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ${item.border} flex flex-col items-center text-center transform hover:-translate-y-1`}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    Explore <ArrowRight size={12} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Sections Grid */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="relative group">
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800&auto=format&fit=crop"
                                    alt="Digital Archive"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-transparent to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                                <div className="absolute bottom-8 left-8 right-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold mb-2">Digital Archive</h3>
                                    <p className="opacity-90 font-light">รวบรวมหลักฐานทางประวัติศาสตร์และวัฒนธรรมในรูปแบบดิจิทัล</p>
                                </div>
                            </div>
                            {/* Decorative Blobs */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        </div>

                        <div className="lg:pl-8">
                            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-4 block">Knowledge Hub</span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#2e1065] mb-6 leading-tight">
                                เชื่อมโยงอดีต<br />สู่ปัจจุบัน
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed font-light">
                                ศูนย์เชียงรายศึกษา มุ่งเน้นการศึกษาวิจัยและให้บริการทางวิชาการ
                                เพื่อสร้างความตระหนักรู้ในคุณค่าของมรดกทางวัฒนธรรม
                                และส่งเสริมให้นำองค์ความรู้ไปใช้ประโยชน์ในการพัฒนาคุณภาพชีวิต
                            </p>

                            <div className="flex flex-col gap-4">
                                <Link href="/chiang-rai-studies/articles" className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">บทความวิชาการ</h4>
                                        <p className="text-xs text-slate-500">Academic Articles & Research</p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
                                </Link>

                                <Link href="/chiang-rai-studies/archive" className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <Landmark size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">วัตถุจัดแสดง</h4>
                                        <p className="text-xs text-slate-500">Artifacts Gallery & Collection</p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Updates / News Teaser */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-purple-600 font-bold tracking-widest uppercase text-xs mb-2 block">Updates</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800">กิจกรรมและข่าวสาร</h2>
                        </div>
                        <Link href="/chiang-rai-studies/activities">
                            <Button variant="ghost" className="hidden sm:flex text-slate-500 hover:text-orange-600 hover:bg-orange-50 px-4 group">
                                ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {activities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {activities.map((item: any) => (
                                <Link href={`/chiang-rai-studies/activities/${item.slug}`} key={item.id} className="group cursor-pointer">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-100 flex flex-col h-full hover:-translate-y-1">
                                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                            <Image
                                                src={item.thumbnailUrl || `https://placehold.co/600x400/purple/white?text=No+Image`}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-purple-700 uppercase tracking-wide z-20 shadow-sm">
                                                {item.type}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-3">
                                                <Calendar size={14} className="text-orange-400" />
                                                <span>
                                                    {new Date(item.publishedAt).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-light">
                                                {item.description || item.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-slate-50 text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read More <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Calendar size={32} />
                            </div>
                            <p className="text-slate-400 font-light">ยังไม่มีกิจกรรมหรือข่าวสารในขณะนี้</p>
                        </div>
                    )}

                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/chiang-rai-studies/activities">
                            <Button variant="outline" className="w-full h-12 rounded-full border-slate-200 text-slate-600">
                                ดูทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats / Footer CTA */}
            <section className="py-20 bg-[#FAF5FF] text-[#2e1065] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-12 drop-shadow-lg tracking-tight">ร่วมเป็นส่วนหนึ่งของการอนุรักษ์</h2>

                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16">
                        <div className="text-center group cursor-default">
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                                {stats ? stats.artifacts : '...'}
                            </div>
                            <div className="text-xs text-purple-500 uppercase tracking-widest font-bold">Artifacts</div>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300 inline-block delay-100">
                                {stats ? stats.articles : '...'}
                            </div>
                            <div className="text-xs text-purple-500 uppercase tracking-widest font-bold">Articles</div>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300 inline-block delay-200">
                                {stats ? stats.identities : '5'}
                            </div>
                            <div className="text-xs text-purple-500 uppercase tracking-widest font-bold">Identities</div>
                        </div>
                    </div>

                    <Link href="/chiang-rai-studies/contact">
                        <div className="inline-flex items-center gap-3 text-white transition-colors cursor-pointer group bg-[#2e1065] px-8 py-3 rounded-full border border-transparent hover:bg-orange-600 shadow-xl hover:shadow-orange-500/30">
                            <span className="font-bold">ติดต่อศูนย์เชียงรายศึกษา</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
