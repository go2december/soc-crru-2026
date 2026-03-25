import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Newspaper, Paperclip } from 'lucide-react';
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  FACULTY_NEWS_CATEGORY_STYLES,
  FacultyNewsCategory,
  extractFacultyNewsExcerpt,
  fetchFacultyNewsList,
  formatFacultyNewsDate,
  getFacultyNewsServerAssetUrl,
} from '@/lib/faculty-news';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
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
    description: 'ติดตามข่าวประชาสัมพันธ์ กิจกรรม ประกาศ และสมัครงานของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternates: {
      canonical: '/news',
    },
  };
}

export default async function FacultyNewsPage(props: Props) {
  const resolvedParams = await props.searchParams;
  const currentCategory = resolvedParams.category as string | undefined;
  
  const newsList = await fetchFacultyNewsList(currentCategory);
  
  const isFiltered = !!currentCategory;

  const featured = !isFiltered ? newsList[0] || null : null;
  const restItems = !isFiltered ? (featured ? newsList.slice(1) : []) : [];
  const latestItems = !isFiltered ? restItems.slice(0, 4) : [];
  // If filtered, olderItems holds ALL items in that category. If not, it holds items starting from index 5.
  const gridItems = isFiltered ? newsList : restItems.slice(4);

  const categories = [
    { value: '', label: 'ทั้งหมด' },
    ...Object.entries(FACULTY_NEWS_CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v }))
  ];

  return (
    <div className="bg-base-100 min-h-screen">
      <section className="bg-gradient-to-br from-scholar-deep via-slate-900 to-scholar-accent text-white">
        <div className="container mx-auto px-4 py-14 sm:py-16 lg:py-24">
          <div className="max-w-3xl space-y-5">
            <div className="badge badge-outline h-auto border-white/30 bg-white/10 px-4 py-3 text-center text-white backdrop-blur-sm">Faculty Newsroom</div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {isFiltered ? FACULTY_NEWS_CATEGORY_LABELS[currentCategory as FacultyNewsCategory] : 'ข่าวสาร กิจกรรม ประกาศ และสมัครงาน'}
            </h1>
            <p className="text-sm text-white/80 sm:text-base md:text-lg lg:text-xl">
              {isFiltered 
                ? `รวม${FACULTY_NEWS_CATEGORY_LABELS[currentCategory as FacultyNewsCategory]}ทั้งหมดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`
                : 'ศูนย์รวมข่าวสารล่าสุดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมไฟล์เอกสารดาวน์โหลดและภาพประกอบครบถ้วน'}
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-base-300 bg-base-100 sticky top-0 md:top-[64px] z-20 shadow-sm mix-blend-normal">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-2 p-2">
              {categories.map((cat) => {
                const isActive = (currentCategory || '') === cat.value;
                return (
                  <Link 
                    key={cat.label} 
                    href={cat.value ? `/news?category=${cat.value}` : '/news'}
                    className={`btn btn-sm sm:btn-md rounded-full border-transparent transition-all px-5 ${
                      isActive 
                        ? 'bg-primary text-primary-content hover:bg-primary/90 shadow-md ring-2 ring-primary/20' 
                        : 'bg-base-200 text-base-content/80 hover:bg-base-300 hover:text-base-content'
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {!isFiltered && (
        <section className="container mx-auto px-4 py-10 lg:py-14">
          {featured ? (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] xl:gap-12">
              {/* Featured Article */}
              <Link href={`/news/${featured.slug}`} className="group relative flex flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <figure className="relative w-full shrink-0 overflow-hidden bg-base-200 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/10] xl:aspect-[16/9]">
                  {featured.thumbnailUrl ? (
                    <Image
                      src={getFacultyNewsServerAssetUrl(featured.thumbnailUrl) || featured.thumbnailUrl}
                      alt={featured.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30 transition-transform duration-700 group-hover:scale-105">
                      <Newspaper className="h-16 w-16" />
                    </div>
                  )}
                  {/* Subtle gradient overlay at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </figure>
                
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8 relative z-10 bg-base-100">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={`rounded-full px-3 py-1 font-medium whitespace-nowrap ${FACULTY_NEWS_CATEGORY_STYLES[featured.category]}`}>
                      {FACULTY_NEWS_CATEGORY_LABELS[featured.category]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-base-content/60">
                      <CalendarDays className="h-4 w-4" />
                      {formatFacultyNewsDate(featured.publishedAt)}
                    </span>
                    {!!featured.attachments?.length && (
                      <span className="inline-flex items-center gap-1.5 text-base-content/60">
                        <Paperclip className="h-4 w-4" />
                        {featured.attachments.length} ไฟล์
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold leading-snug text-base-content transition-colors duration-300 group-hover:text-primary sm:text-3xl lg:text-4xl">{featured.title}</h2>
                  <p className="line-clamp-3 text-sm text-base-content/70 sm:text-base lg:text-lg">{extractFacultyNewsExcerpt(featured.content, 260)}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-start sm:justify-end">
                    <span className="btn btn-primary btn-sm gap-2 rounded-full px-6 sm:btn-md shadow-sm transition-all group-hover:shadow-md">
                      อ่านข่าวนี้ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Latest Updates Sidebar */}
              <div className="flex flex-col space-y-6 rounded-3xl border border-base-300 bg-base-200/30 p-6 lg:p-8">
                <div className="flex flex-col gap-1.5 pb-3 border-b border-base-300/60 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-xl font-bold text-base-content md:text-2xl">อัปเดตล่าสุด</h2>
                  <span className="text-sm font-medium text-base-content/50">เรื่องที่น่าสนใจ</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {latestItems.length > 0 ? (
                    latestItems.map((item) => (
                      <Link key={item.id} href={`/news/${item.slug}`} className="group flex flex-col gap-2 rounded-2xl border border-transparent bg-base-100 p-5 shadow-sm ring-1 ring-base-300/50 transition-all duration-300 hover:-translate-y-0.5 hover:ring-scholar-accent/30 hover:shadow-md">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className={`rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap ${FACULTY_NEWS_CATEGORY_STYLES[item.category]}`}>
                            {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                          </span>
                          <span className="text-base-content/50 font-medium">{formatFacultyNewsDate(item.publishedAt)}</span>
                        </div>
                        <h3 className="line-clamp-2 text-sm font-bold leading-relaxed text-base-content transition-colors group-hover:text-primary sm:text-base">{item.title}</h3>
                      </Link>
                    ))
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 text-center text-base-content/40">
                      <Newspaper className="mb-2 h-8 w-8 opacity-50" />
                      <span className="text-sm font-medium">ไม่มีรายการอัปเดตเพิ่มเติม</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-200/30 py-24 text-center">
              <Newspaper className="mb-4 h-16 w-16 text-base-content/20" />
              <h2 className="text-2xl font-bold text-base-content">ยังไม่มีข่าวที่เผยแพร่</h2>
              <p className="mt-2 text-base-content/60 max-w-md">เมื่อมีข่าวสารใหม่ ระบบจะนำมาแสดงผลในหน้านี้โดยอัตโนมัติ ติดตามข่าวอัปเดตได้ที่นี่</p>
            </div>
          )}
        </section>
      )}

      {/* Grid rendering (Either older items or filtered items) */}
      <section className={`container mx-auto px-4 pb-16 lg:pb-24 ${isFiltered ? 'pt-10 lg:pt-14' : ''}`}>
        {!isFiltered && gridItems.length > 0 && (
          <div className="mb-8 flex flex-col gap-2 border-b border-base-300 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold text-base-content md:text-3xl">ข่าวและประกาศอื่นๆ</h2>
            <span className="text-sm font-medium text-base-content/50">รวบรวมเรื่องราวทั้งหมดที่ผ่านมา</span>
          </div>
        )}

        {isFiltered && gridItems.length > 0 && (
          <div className="mb-8 flex flex-col gap-2 pb-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content md:text-3xl">
                {FACULTY_NEWS_CATEGORY_LABELS[currentCategory as FacultyNewsCategory]}
              </h2>
            </div>
            <span className="text-sm font-medium text-base-content/50">พบทั้งหมด {gridItems.length} รายการ</span>
          </div>
        )}

        {gridItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {gridItems.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <figure className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-base-200">
                  {item.thumbnailUrl ? (
                    <Image
                      src={getFacultyNewsServerAssetUrl(item.thumbnailUrl) || item.thumbnailUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30 transition-transform duration-500 group-hover:scale-105">
                      <Newspaper className="h-10 w-10" />
                    </div>
                  )}
                </figure>
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2.5 py-1 font-medium whitespace-nowrap ${FACULTY_NEWS_CATEGORY_STYLES[item.category]}`}>
                      {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                    </span>
                    <span className="text-base-content/50 font-medium">{formatFacultyNewsDate(item.publishedAt)}</span>
                  </div>
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-base-content transition-colors group-hover:text-primary sm:text-lg">{item.title}</h3>
                  <p className="line-clamp-2 text-sm text-base-content/60 leading-relaxed">{extractFacultyNewsExcerpt(item.content)}</p>
                  
                  <div className="mt-auto pt-5 flex items-center justify-between gap-4 text-xs font-medium text-base-content/50">
                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
                      <ArrowRight className="h-3.5 w-3.5 -rotate-45" /> อ่านต่อ
                    </span>
                    <div className="flex gap-3">
                      {!!item.mediaUrls?.length && (
                        <span>{item.mediaUrls.length} รูป</span>
                      )}
                      {!!item.attachments?.length && (
                        <span>{item.attachments.length} ไฟล์</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          isFiltered && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-200/30 py-24 text-center">
              <Newspaper className="mb-4 h-16 w-16 text-base-content/20" />
              <h2 className="text-2xl font-bold text-base-content">ยังไม่มีรายการในหมวดหมู่นี้</h2>
              <p className="mt-2 text-base-content/60 max-w-md">ขณะนี้ยังไม่มี{FACULTY_NEWS_CATEGORY_LABELS[currentCategory as FacultyNewsCategory]} กลับไปอ่านข่าวทั้งหมดได้โดยเลือกที่หมวดหมู่ "ทั้งหมด"</p>
              <Link href="/news" className="btn btn-outline btn-sm mt-6 rounded-full px-6">
                ดูข่าวทั้งหมด
              </Link>
            </div>
          )
        )}
      </section>
    </div>
  );
}

