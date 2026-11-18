import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Newspaper, Paperclip, Images } from 'lucide-react';
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  FACULTY_NEWS_CATEGORY_STYLES,
  FacultyNewsCategory,
  extractFacultyNewsExcerpt,
  fetchFacultyNewsList,
  formatFacultyNewsDate,
  getFacultyNewsServerAssetUrl,
} from '@/lib/faculty-news';
import MinimalPagination from '@/components/MinimalPagination';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category as string | undefined;

  const baseTitle = 'ข่าวสารคณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย';
  if (category && Object.keys(FACULTY_NEWS_CATEGORY_LABELS).includes(category)) {
    return {
      title: `${FACULTY_NEWS_CATEGORY_LABELS[category as FacultyNewsCategory]} - ${baseTitle}`,
      description: `ติดตาม${FACULTY_NEWS_CATEGORY_LABELS[category as FacultyNewsCategory]}ทั้งหมดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`,
    };
  }

  return {
    title: baseTitle,
    description:
      'ติดตามข่าวประชาสัมพันธ์ กิจกรรม ประกาศ และสมัครงานของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternates: {
      canonical: '/news',
    },
  };
}

export default async function FacultyNewsPage(props: Props) {
  const resolvedParams = await props.searchParams;
  const currentCategory = resolvedParams.category as string | undefined;
  const pageStr = resolvedParams.page as string | undefined;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;

  const { data: newsList, meta } = await fetchFacultyNewsList(currentCategory, currentPage, 12);

  const isFiltered = !!currentCategory;
  const isFirstPageGeneral = !isFiltered && currentPage === 1;

  const featured = isFirstPageGeneral ? newsList[0] || null : null;
  const restItems = isFirstPageGeneral ? (featured ? newsList.slice(1) : []) : [];
  const latestItems = isFirstPageGeneral ? restItems.slice(0, 4) : [];
  const gridItems = isFirstPageGeneral ? restItems.slice(4) : newsList;

  const categories = [
    { value: '', label: 'ทั้งหมด' },
    ...Object.entries(FACULTY_NEWS_CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
  ];

  const activeCategoryLabel =
    isFiltered && Object.keys(FACULTY_NEWS_CATEGORY_LABELS).includes(currentCategory)
      ? FACULTY_NEWS_CATEGORY_LABELS[currentCategory as FacultyNewsCategory]
      : null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* Editorial Newsroom Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-bold text-[#C2410C] tracking-wide">
                ข่าวสารและประชาสัมพันธ์ · คณะสังคมศาสตร์
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
                {activeCategoryLabel || 'ข่าวสาร กิจกรรม ประกาศ และสมัครงาน'}
              </h1>
              <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {activeCategoryLabel
                  ? `รวม${activeCategoryLabel}ทั้งหมดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`
                  : 'ศูนย์รวมข่าวประชาสัมพันธ์ กิจกรรมวิชาการ ประกาศสำคัญ และข่าวรับสมัครบุคลากรของคณะสังคมศาสตร์'}
              </p>
            </div>

            {meta.total > 0 && (
              <div className="shrink-0 px-4 py-2.5 rounded-sm bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600">
                พบทั้งหมด <span className="font-mono font-bold text-[#0B132B]">{meta.total}</span> รายการ
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Category Filter Tabs */}
      <section className="sticky top-0 md:top-[64px] z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const isActive = (currentCategory || '') === cat.value;
              return (
                <Link
                  key={cat.label}
                  href={cat.value ? `/news?category=${cat.value}` : '/news'}
                  className={`px-4 py-2 rounded-sm text-xs sm:text-sm font-semibold transition-colors border shrink-0 ${
                    isActive
                      ? 'bg-[#0B132B] text-white border-[#0B132B]'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-[#C2410C] hover:text-[#C2410C]'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead Editorial Spread (Page 1 Unfiltered) */}
      {isFirstPageGeneral && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Featured Story */}
              <Link
                href={`/news/${featured.slug}`}
                className="lg:col-span-7 group flex flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xs hover:border-[#C2410C] hover:shadow-md transition-all duration-200"
              >
                <figure className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 border-b border-slate-200">
                  {featured.thumbnailUrl ? (
                    <Image
                      src={getFacultyNewsServerAssetUrl(featured.thumbnailUrl) || featured.thumbnailUrl}
                      alt={featured.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                      <Newspaper className="size-14" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute top-3.5 left-3.5">
                    <span
                      className={`inline-block rounded-sm px-2.5 py-1 text-xs font-semibold shadow-2xs ${
                        FACULTY_NEWS_CATEGORY_STYLES[featured.category]
                      }`}
                    >
                      {FACULTY_NEWS_CATEGORY_LABELS[featured.category]}
                    </span>
                  </div>
                </figure>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-slate-400" strokeWidth={1.75} />
                      {formatFacultyNewsDate(featured.publishedAt)}
                    </span>
                    {!!featured.attachments?.length && (
                      <span className="inline-flex items-center gap-1.5">
                        <Paperclip className="size-3.5 text-slate-400" strokeWidth={1.75} />
                        {featured.attachments.length} เอกสารแนบ
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B132B] leading-snug group-hover:text-[#C2410C] transition-colors mb-3">
                    {featured.title}
                  </h2>

                  <p className="font-body text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {extractFacultyNewsExcerpt(featured.content, 240)}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#C2410C]">
                    <span>อ่านข่าวฉบับเต็ม</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Latest Updates Sidebar */}
              <div className="lg:col-span-5 flex flex-col rounded-sm border border-slate-200 bg-white">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                    อัปเดตล่าสุด
                  </h2>
                  <span className="text-xs font-mono text-slate-400">LATEST</span>
                </div>

                <div className="flex-1 divide-y divide-slate-100">
                  {latestItems.length > 0 ? (
                    latestItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group block px-6 py-4 hover:bg-[#F8FAFC] border-l-2 border-l-transparent hover:border-l-[#C2410C] transition-all"
                      >
                        <div className="flex items-center gap-2.5 text-xs mb-1.5">
                          <span
                            className={`rounded-sm px-2 py-0.5 font-semibold ${
                              FACULTY_NEWS_CATEGORY_STYLES[item.category]
                            }`}
                          >
                            {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                          </span>
                          <span className="text-slate-400">
                            {formatFacultyNewsDate(item.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0B132B] leading-snug line-clamp-2 group-hover:text-[#C2410C] transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                    ))
                  ) : (
                    <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-slate-400">
                      <Newspaper className="mb-2 size-8 opacity-50" strokeWidth={1.5} />
                      <span className="text-sm">ไม่มีรายการอัปเดตเพิ่มเติม</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-20 text-center px-4">
              <Newspaper className="mb-4 size-12 text-slate-300" strokeWidth={1.5} />
              <h2 className="text-xl font-bold text-[#0B132B]">ยังไม่มีข่าวที่เผยแพร่</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                เมื่อมีข่าวสารใหม่ ระบบจะนำมาแสดงผลในหน้านี้โดยอัตโนมัติ
              </p>
            </div>
          )}
        </section>
      )}

      {/* Archive / Filtered Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-16 sm:pb-20">
        {!isFiltered && gridItems.length > 0 && (
          <div className="mb-8 pb-3 border-b border-slate-200 flex items-end justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B132B]">
              ข่าวและประกาศที่ผ่านมา
            </h2>
            <span className="text-xs text-slate-500">ทั้งหมด {gridItems.length} รายการในหน้านี้</span>
          </div>
        )}

        {gridItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xs hover:border-[#C2410C] hover:shadow-md transition-all duration-200"
              >
                <figure className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 border-b border-slate-100">
                  {item.thumbnailUrl ? (
                    <Image
                      src={getFacultyNewsServerAssetUrl(item.thumbnailUrl) || item.thumbnailUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                      <Newspaper className="size-10" strokeWidth={1.5} />
                    </div>
                  )}
                </figure>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs mb-2.5">
                    <span
                      className={`rounded-sm px-2 py-0.5 font-semibold ${
                        FACULTY_NEWS_CATEGORY_STYLES[item.category]
                      }`}
                    >
                      {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                    </span>
                    <span className="text-slate-400">
                      {formatFacultyNewsDate(item.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B132B] leading-snug line-clamp-2 group-hover:text-[#C2410C] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="font-body text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {extractFacultyNewsExcerpt(item.content)}
                  </p>

                  <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#C2410C]">
                      <span>อ่านต่อ</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <div className="flex items-center gap-3">
                      {!!item.mediaUrls?.length && (
                        <span className="inline-flex items-center gap-1">
                          <Images className="size-3.5" />
                          {item.mediaUrls.length}
                        </span>
                      )}
                      {!!item.attachments?.length && (
                        <span className="inline-flex items-center gap-1">
                          <Paperclip className="size-3.5" />
                          {item.attachments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          isFiltered && (
            <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-20 text-center px-4">
              <Newspaper className="mb-4 size-12 text-slate-300" strokeWidth={1.5} />
              <h2 className="text-xl font-bold text-[#0B132B]">ยังไม่มีรายการในหมวดหมู่นี้</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                ขณะนี้ยังไม่มี{activeCategoryLabel || 'รายการ'} สามารถเลือกดูข่าวทั้งหมดได้
              </p>
              <Link
                href="/news"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#0B132B] text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                ดูข่าวทั้งหมด
              </Link>
            </div>
          )
        )}

        {meta.totalPages > 1 && (
          <div className="mt-10">
            <MinimalPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              basePath="/news"
              searchParams={{
                ...(currentCategory ? { category: currentCategory } : {}),
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
