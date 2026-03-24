import Link from 'next/link';
import Image from 'next/image';
import {
    FACULTY_NEWS_CATEGORY_LABELS,
    extractFacultyNewsExcerpt,
    fetchFacultyNewsList,
    formatFacultyNewsDate,
    getFacultyNewsServerAssetUrl,
} from '@/lib/faculty-news';

export default async function NewsSection() {
    const items = await fetchFacultyNewsList(4);
    const featuredNews = items[0] || null;
    const newsList = featuredNews ? items.slice(1) : [];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-scholar-accent font-bold tracking-wider uppercase text-sm mb-2 block">Update</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-scholar-deep">ข่าวสารและกิจกรรม</h2>
                    </div>
                    <Link href="/news" className="hidden md:flex items-center text-gray-500 hover:text-scholar-accent font-medium transition-colors">
                        ดูข่าวทั้งหมด <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                {featuredNews ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Link href={`/news/${featuredNews.slug}`} className="lg:col-span-2 group cursor-pointer">
                            <div className="relative h-[300px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-100">
                                {featuredNews.thumbnailUrl ? (
                                    <Image
                                        src={getFacultyNewsServerAssetUrl(featuredNews.thumbnailUrl) || featuredNews.thumbnailUrl}
                                        alt={featuredNews.title}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m14 0V9a2 2 0 00-2-2h-2M5 14V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" /></svg>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="badge bg-scholar-accent text-white border-none px-3 py-3 font-medium">
                                        {FACULTY_NEWS_CATEGORY_LABELS[featuredNews.category]}
                                    </span>
                                </div>
                            </div>
                            <div className="pr-4">
                                <div className="flex items-center text-sm text-gray-400 mb-2 gap-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {formatFacultyNewsDate(featuredNews.publishedAt)}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-scholar-deep mb-3 group-hover:text-scholar-accent transition-colors leading-tight">
                                    {featuredNews.title}
                                </h3>
                                <p className="text-gray-500 line-clamp-2">{extractFacultyNewsExcerpt(featuredNews.content, 180)}</p>
                            </div>
                        </Link>

                        <div className="flex flex-col gap-6">
                            {newsList.map((news) => (
                                <Link key={news.id} href={`/news/${news.slug}`} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {news.thumbnailUrl ? (
                                            <Image
                                                src={getFacultyNewsServerAssetUrl(news.thumbnailUrl) || news.thumbnailUrl}
                                                alt={news.title}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m14 0V9a2 2 0 00-2-2h-2M5 14V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-scholar-accent uppercase">{FACULTY_NEWS_CATEGORY_LABELS[news.category]}</span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-400">{formatFacultyNewsDate(news.publishedAt)}</span>
                                        </div>
                                        <h4 className="font-bold text-scholar-deep text-sm leading-snug group-hover:text-scholar-accent transition-colors line-clamp-2">
                                            {news.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}

                            <Link href="/news" className="md:hidden btn btn-outline w-full mt-4 normal-case">
                                ดูข่าวทั้งหมด
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
                        ยังไม่มีข่าวสารที่เผยแพร่ในขณะนี้
                    </div>
                )}
            </div>
        </section>
    );
}
