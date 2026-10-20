import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  extractFacultyNewsExcerpt,
  fetchFacultyNewsList,
  formatFacultyNewsDate,
  getFacultyNewsServerAssetUrl,
} from "@/lib/faculty-news";

export default async function NewsSection() {
  const { data: items } = await fetchFacultyNewsList(undefined, 1, 4);
  const featuredNews = items[0] || null;
  const newsList = featuredNews ? items.slice(1) : [];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] tracking-wider uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
              News & Announcements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
              ข่าวสารและกิจกรรม
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#C2410C] transition-colors"
          >
            <span>ดูข่าวทั้งหมด</span>
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        {featuredNews ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured News Card */}
            <Link
              href={`/news/${featuredNews.slug}`}
              className="lg:col-span-2 group cursor-pointer block"
            >
              <div className="relative h-[280px] sm:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 mb-5 bg-slate-100">
                {featuredNews.thumbnailUrl ? (
                  <Image
                    src={
                      getFacultyNewsServerAssetUrl(featuredNews.thumbnailUrl) ||
                      featuredNews.thumbnailUrl
                    }
                    alt={featuredNews.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                    <Newspaper className="size-12" strokeWidth={1.5} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="saffron" className="bg-white/95 backdrop-blur-md shadow-xs">
                    {FACULTY_NEWS_CATEGORY_LABELS[featuredNews.category]}
                  </Badge>
                </div>
              </div>
              <div className="pr-4">
                <div className="flex items-center text-xs text-slate-500 mb-2 gap-2">
                  <Calendar className="size-3.5 text-slate-400" strokeWidth={1.75} />
                  <span>{formatFacultyNewsDate(featuredNews.publishedAt)}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B132B] mb-2.5 group-hover:text-[#C2410C] transition-colors leading-snug">
                  {featuredNews.title}
                </h3>
                <p className="font-body text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {extractFacultyNewsExcerpt(featuredNews.content, 180)}
                </p>
              </div>
            </Link>

            {/* Side News List */}
            <div className="flex flex-col gap-5">
              {newsList.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="flex gap-4 group cursor-pointer border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="relative w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    {news.thumbnailUrl ? (
                      <Image
                        src={
                          getFacultyNewsServerAssetUrl(news.thumbnailUrl) ||
                          news.thumbnailUrl
                        }
                        alt={news.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        <Newspaper className="size-6" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#C2410C] uppercase tracking-wide">
                        {FACULTY_NEWS_CATEGORY_LABELS[news.category]}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        {formatFacultyNewsDate(news.publishedAt)}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0B132B] text-sm leading-snug group-hover:text-[#C2410C] transition-colors line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                </Link>
              ))}

              <Link
                href="/news"
                className="md:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#0B132B] hover:bg-slate-50 transition-colors mt-2"
              >
                <span>ดูข่าวทั้งหมด</span>
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
            ยังไม่มีข่าวสารที่เผยแพร่ในขณะนี้
          </div>
        )}
      </div>
    </section>
  );
}
