import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Newspaper, Paperclip } from 'lucide-react';
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  FACULTY_NEWS_CATEGORY_STYLES,
  extractFacultyNewsExcerpt,
  fetchFacultyNewsList,
  formatFacultyNewsDate,
  getFacultyNewsServerAssetUrl,
} from '@/lib/faculty-news';

export const metadata: Metadata = {
  title: 'ข่าวสารคณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย',
  description: 'ติดตามข่าวประชาสัมพันธ์ กิจกรรม ประกาศ และสมัครงานของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  alternates: {
    canonical: '/news',
  },
};

export default async function FacultyNewsPage() {
  const newsList = await fetchFacultyNewsList();
  const featured = newsList[0] || null;
  const restItems = featured ? newsList.slice(1) : [];

  return (
    <div className="bg-base-100">
      <section className="bg-gradient-to-br from-scholar-deep via-slate-900 to-scholar-accent text-white">
        <div className="container mx-auto px-4 py-14 sm:py-16 lg:py-24">
          <div className="max-w-3xl space-y-5">
            <div className="badge badge-outline h-auto border-white/30 bg-white/10 px-4 py-3 text-center text-white">Faculty Newsroom</div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">ข่าวสาร กิจกรรม ประกาศ และสมัครงาน</h1>
            <p className="text-sm text-white/80 sm:text-base md:text-lg">
              ศูนย์รวมข่าวสารล่าสุดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมไฟล์เอกสารดาวน์โหลดและภาพประกอบครบถ้วน
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        {featured ? (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <Link href={`/news/${featured.slug}`} className="card overflow-hidden border border-base-300 bg-base-100 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <figure className="relative aspect-[16/9] bg-base-200">
                {featured.thumbnailUrl ? (
                  <Image
                    src={getFacultyNewsServerAssetUrl(featured.thumbnailUrl) || featured.thumbnailUrl}
                    alt={featured.title}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/40">
                    <Newspaper className="h-12 w-12" />
                  </div>
                )}
              </figure>
              <div className="card-body gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className={`rounded-full px-3 py-1 font-medium ${FACULTY_NEWS_CATEGORY_STYLES[featured.category]}`}>
                    {FACULTY_NEWS_CATEGORY_LABELS[featured.category]}
                  </span>
                  <span className="inline-flex items-center gap-2 text-base-content/70">
                    <CalendarDays className="h-4 w-4" />
                    {formatFacultyNewsDate(featured.publishedAt)}
                  </span>
                  {!!featured.attachments?.length && (
                    <span className="inline-flex items-center gap-2 text-base-content/70">
                      <Paperclip className="h-4 w-4" />
                      {featured.attachments.length} ไฟล์แนบ
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-base-content sm:text-3xl">{featured.title}</h2>
                <p className="line-clamp-3 text-sm text-base-content/75 sm:text-base">{extractFacultyNewsExcerpt(featured.content, 240)}</p>
                <div className="card-actions justify-start sm:justify-end">
                  <span className="btn btn-primary btn-sm gap-2 sm:btn-md">
                    อ่านต่อ <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <div className="space-y-4 rounded-3xl border border-base-300 bg-base-200/40 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-base-content">อัปเดตล่าสุด</h2>
                <span className="text-sm text-base-content/60">{newsList.length} รายการ</span>
              </div>
              <div className="space-y-3">
                {restItems.length > 0 ? (
                  restItems.slice(0, 4).map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="block rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:border-scholar-accent/40 hover:shadow-md">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded-full px-2.5 py-1 font-medium ${FACULTY_NEWS_CATEGORY_STYLES[item.category]}`}>
                          {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                        </span>
                        <span className="text-base-content/60">{formatFacultyNewsDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="line-clamp-2 font-semibold text-base-content">{item.title}</h3>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 py-10 text-center text-base-content/60">
                    ยังไม่มีรายการข่าวอื่นเพิ่มเติม
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/30 py-20 text-center">
            <h2 className="text-2xl font-bold text-base-content">ยังไม่มีข่าวที่เผยแพร่</h2>
            <p className="mt-2 text-base-content/70">เมื่อมีข่าวสารใหม่ ระบบจะแสดงที่หน้านี้โดยอัตโนมัติ</p>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-16 lg:pb-24">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-base-content">ข่าวทั้งหมด</h2>
          <span className="text-sm text-base-content/60">เผยแพร่ล่าสุดก่อน</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {newsList.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="card border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <figure className="relative aspect-[4/3] bg-base-200">
                {item.thumbnailUrl ? (
                  <Image
                    src={getFacultyNewsServerAssetUrl(item.thumbnailUrl) || item.thumbnailUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/40">
                    <Newspaper className="h-10 w-10" />
                  </div>
                )}
              </figure>
              <div className="card-body gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-medium ${FACULTY_NEWS_CATEGORY_STYLES[item.category]}`}>
                    {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="text-base-content/60">{formatFacultyNewsDate(item.publishedAt)}</span>
                </div>
                <h3 className="line-clamp-2 text-base font-bold text-base-content sm:text-lg">{item.title}</h3>
                <p className="line-clamp-3 text-sm text-base-content/70">{extractFacultyNewsExcerpt(item.content)}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-sm text-base-content/60">
                  <span>{item.mediaUrls?.length || 0} รูป</span>
                  <span>{item.attachments?.length || 0} ไฟล์แนบ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
