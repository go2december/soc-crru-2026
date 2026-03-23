import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export const metadata: Metadata = {
    title: 'แหล่งเรียนรู้ทางวัฒนธรรม | ศูนย์เชียงรายศึกษา',
    description: 'รวมแหล่งเรียนรู้ทางวัฒนธรรมในเชียงราย พิพิธภัณฑ์ วัด โบราณสถาน ชุมชนท่องเที่ยว ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternates: {
        canonical: '/chiang-rai-studies/learning-sites',
    },
    openGraph: { title: 'แหล่งเรียนรู้ทางวัฒนธรรม | ศูนย์เชียงรายศึกษา', url: '/chiang-rai-studies/learning-sites' },
    twitter: {
        card: 'summary_large_image',
        title: 'แหล่งเรียนรู้ทางวัฒนธรรม | ศูนย์เชียงรายศึกษา',
        description: 'รวมแหล่งเรียนรู้ทางวัฒนธรรมในเชียงราย พิพิธภัณฑ์ วัด โบราณสถาน ชุมชนท่องเที่ยว ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    },
};

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface LearningSite {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content?: string;
    thumbnailUrl: string | null;
    author: string | null;
    publishedAt: string | null;
    tags: string[];
}

async function getLearningSites(): Promise<LearningSite[]> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/learning-sites`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const sites = data.data || [];
        return sites;
    } catch (error) {
        console.error('Error fetching learning sites:', error);
        return [];
    }
}

export default async function LearningSitesPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
    const { tag: activeTag } = await searchParams;
    const allSites = await getLearningSites();
    const learningSites = activeTag
        ? allSites.filter(s => s.tags?.some(t => t.toLowerCase() === activeTag.toLowerCase()))
        : allSites;

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header */}
            <div className="bg-[#2e1065] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-4 border border-orange-500/30 shadow-lg">
                        Cultural Learning Sites
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md">แหล่งเรียนรู้ทางวัฒนธรรม</h1>
                    <p className="text-purple-200/70 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        บทความและข้อมูลเกี่ยวกับแหล่งเรียนรู้ทางวัฒนธรรมในเชียงราย
                        <br className="hidden md:block" />
                        พิพิธภัณฑ์ วัด โบราณสถาน และชุมชนท่องเที่ยว
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Active tag filter */}
                {activeTag && (
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="text-sm text-stone-500">กรองตามคำสำคัญ:</span>
                        <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-purple-200">
                            #{activeTag}
                            <Link href="/chiang-rai-studies/learning-sites" className="ml-1 p-0.5 rounded-full hover:bg-purple-200 transition">
                                <X size={14} />
                            </Link>
                        </span>
                        <span className="text-xs text-stone-400">({learningSites.length} รายการ)</span>
                    </div>
                )}

                {learningSites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {learningSites.map((site, index) => (
                            <div
                                key={site.id}
                                className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col md:flex-row gap-6 group animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Thumbnail */}
                                <div className="w-full md:w-48 h-48 bg-purple-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                    {site.thumbnailUrl ? (
                                        <Image
                                            src={site.thumbnailUrl!.startsWith('/') ? `${PUBLIC_URL}${site.thumbnailUrl}` : site.thumbnailUrl!}
                                            alt={site.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 200px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-purple-300">
                                            <BookOpen size={40} />
                                        </div>
                                    )}
                                    {site.tags && site.tags.length > 0 && (
                                        <div className="absolute top-3 left-3">
                                            <Link href={`/chiang-rai-studies/learning-sites?tag=${encodeURIComponent(site.tags[0])}`}
                                                className="bg-white/90 backdrop-blur-sm text-purple-800 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide border border-purple-100 shadow-sm hover:bg-white transition">
                                                {site.tags[0]}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-3 text-xs text-stone-400 font-normal">
                                        {site.publishedAt && (
                                            <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md">
                                                <Calendar size={12} className="text-orange-500" />
                                                {format(new Date(site.publishedAt), 'd MMM yyyy', { locale: th })}
                                            </div>
                                        )}
                                        {site.author && (
                                            <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md">
                                                <BookOpen size={12} className="text-purple-500" />
                                                {site.author}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-[#2e1065] mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                                        {site.title}
                                    </h3>

                                    <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                                        {site.description || 'ไม่มีคำอธิบาย'}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/chiang-rai-studies/learning-sites/${site.slug}`}
                                            className="inline-flex items-center gap-2 text-[#2e1065] font-bold text-sm bg-purple-50 px-5 py-2.5 rounded-full hover:bg-[#2e1065] hover:text-white transition-all duration-300"
                                        >
                                            อ่านบทความ <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-purple-100 max-w-4xl mx-auto px-10">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <BookOpen className="text-purple-200" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">ยังไม่มีบทความ</h3>
                        <p className="text-purple-400 font-light text-lg mb-8 max-w-md mx-auto italic">
                            "ติดตามบทความและสาระน่ารู้จากศูนย์เชียงรายศึกษาได้ที่นี่ เร็วๆ นี้"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
