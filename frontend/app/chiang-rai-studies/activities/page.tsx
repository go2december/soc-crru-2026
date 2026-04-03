import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    Calendar,
    ArrowRight,
    Search,
    BookOpen
} from 'lucide-react';
import MinimalPagination from '@/components/MinimalPagination';

export const metadata: Metadata = {
    title: 'กิจกรรมและข่าวสาร | ศูนย์เชียงรายศึกษา',
    description: 'ติดตามความเคลื่อนไหว กิจกรรม สัมมนา อบรม และข่าวสารจากศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternates: {
        canonical: '/chiang-rai-studies/activities',
    },
    openGraph: { title: 'กิจกรรมและข่าวสาร | ศูนย์เชียงรายศึกษา', url: '/chiang-rai-studies/activities' },
    twitter: {
        card: 'summary_large_image',
        title: 'กิจกรรมและข่าวสาร | ศูนย์เชียงรายศึกษา',
        description: 'ติดตามความเคลื่อนไหว กิจกรรม สัมมนา อบรม และข่าวสารจากศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    },
};

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const dynamic = 'force-dynamic';

async function getActivities(page = 1, limit = 9) {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:4001';
        const res = await fetch(`${baseUrl}/api/chiang-rai/activities?page=${page}&limit=${limit}`, {
            cache: 'no-store'
        });

        if (!res.ok) return { data: [], meta: { page: 1, totalPages: 1 } };

        const json = await res.json();
        return {
            data: json.data || [],
            meta: json.meta || { page: 1, totalPages: 1 },
        };
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return { data: [], meta: { page: 1, totalPages: 1 } };
    }
}

export default async function ActivitiesPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const { data: activities, meta } = await getActivities(page);

    return (
        <div className="min-h-screen bg-[#FAF5FF] font-kanit">
            {/* Header */}
            <section className="bg-[#2e1065] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/2e1065/FFF?text=Activities')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">กิจกรรมและข่าวสาร</h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto font-light">
                        ติดตามความเคลื่อนไหว และกิจกรรมต่างๆ ของศูนย์เชียงรายศึกษา
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 container mx-auto px-4">
                {activities && activities.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {activities.map((item: any) => (
                                <Link href={`/chiang-rai-studies/activities/${item.slug}`} key={item.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-purple-50 hover:border-purple-100">
                                    <div className="h-56 bg-stone-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                        <Image
                                            src={item.thumbnailUrl ? (item.thumbnailUrl.startsWith('/') ? `${PUBLIC_URL}${item.thumbnailUrl}` : item.thumbnailUrl) : `https://placehold.co/600x400/purple/white?text=No+Image`}
                                            alt={item.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-purple-900 uppercase tracking-wide z-20 shadow-sm">
                                            {item.type}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-3">
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(item.publishedAt).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2e1065] mb-3 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-stone-500 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                                            {item.description || item.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </p>
                                        <div className="mt-auto pt-6 border-t border-dashed border-stone-100 text-xs font-bold text-purple-400 group-hover:text-purple-700 uppercase tracking-widest flex items-center gap-2">
                                            Read Full Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <MinimalPagination 
                            currentPage={page}
                            totalPages={meta.totalPages}
                            basePath="/chiang-rai-studies/activities"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-600 mb-2">ไม่พบข้อมูลกิจกรรม</h3>
                        <p className="text-stone-400">ยังไม่มีกิจกรรมหรือข่าวสารในขณะนี้</p>
                    </div>
                )}
            </section>
        </div>
    );
}
