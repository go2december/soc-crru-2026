import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Images,
  Newspaper,
  Paperclip,
} from 'lucide-react';
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  FACULTY_NEWS_CATEGORY_STYLES,
  fetchFacultyNewsBySlug,
  formatFacultyNewsDate,
  getFacultyNewsServerAssetUrl,
} from '@/lib/faculty-news';

function fixContentImageUrls(html: string): string {
  if (!html) return html;
  return html.replace(/src="https?:\/\/[^\"]*\/uploads\//g, 'src="/uploads/');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = await fetchFacultyNewsBySlug(slug);

  if (!newsItem) {
    return {
      title: 'ไม่พบข่าวสาร | คณะสังคมศาสตร์ มรภ.เชียงราย',
    };
  }

  const title = `${newsItem.title} | ข่าวสารคณะสังคมศาสตร์`;
  const description = newsItem.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const ogImage = newsItem.thumbnailUrl || newsItem.mediaUrls?.[0] || null;

  return {
    title,
    description,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/news/${slug}`,
      type: 'article',
      locale: 'th_TH',
      images: ogImage ? [{ url: ogImage }] : [],
      publishedTime: newsItem.publishedAt || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function FacultyNewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const newsItem = await fetchFacultyNewsBySlug(params.slug);

  if (!newsItem) {
    notFound();
  }

  const heroImage = getFacultyNewsServerAssetUrl(newsItem.thumbnailUrl) || newsItem.thumbnailUrl;
  const galleryImages = (newsItem.mediaUrls || []).map((url) => getFacultyNewsServerAssetUrl(url) || url);
  const fixedContent = fixContentImageUrls(newsItem.content || '');

  return (
    <div className="bg-base-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-scholar-deep via-slate-900 to-scholar-accent text-white">
        <div className="absolute inset-0 bg-black/25" />
        <div className="container relative z-10 mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl space-y-5">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> กลับไปหน้าข่าวสาร
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className={`rounded-full px-3 py-1 font-medium ${FACULTY_NEWS_CATEGORY_STYLES[newsItem.category]}`}>
                {FACULTY_NEWS_CATEGORY_LABELS[newsItem.category]}
              </span>
              <span className="inline-flex items-center gap-2 text-white/75">
                <CalendarDays className="h-4 w-4" />
                {formatFacultyNewsDate(newsItem.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2 text-white/75">
                <Paperclip className="h-4 w-4" />
                {newsItem.attachments?.length || 0} ไฟล์แนบ
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{newsItem.title}</h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-8 px-4 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <div className="relative aspect-[16/9] bg-base-200">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={newsItem.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base-content/40">
                  <Newspaper className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          <article className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <div className="prose prose-base sm:prose-lg max-w-none p-5 sm:p-6 md:p-8" dangerouslySetInnerHTML={{ __html: fixedContent }} />
          </article>

          {galleryImages.length > 0 && (
            <section className="space-y-4 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-base-content sm:text-2xl">
                <Images className="h-5 w-5 text-scholar-accent" /> รูปภาพเพิ่มเติม
              </h2>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-base-200">
                    <Image
                      src={imageUrl}
                      alt={`ภาพประกอบ ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-base-content">ข้อมูลข่าว</h2>
            <div className="mt-4 space-y-3 text-sm text-base-content/75">
              <div>
                <p className="font-medium text-base-content">หมวดหมู่</p>
                <p>{FACULTY_NEWS_CATEGORY_LABELS[newsItem.category]}</p>
              </div>
              <div>
                <p className="font-medium text-base-content">วันที่เผยแพร่</p>
                <p>{formatFacultyNewsDate(newsItem.publishedAt)}</p>
              </div>
              <div>
                <p className="font-medium text-base-content">รูปภาพเพิ่มเติม</p>
                <p>{galleryImages.length} รูป</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-base-content">เอกสารดาวน์โหลด</h2>
            {newsItem.attachments && newsItem.attachments.length > 0 ? (
              <div className="mt-4 space-y-3">
                {newsItem.attachments.map((attachment) => {
                  const href = getFacultyNewsServerAssetUrl(attachment.fileUrl) || attachment.fileUrl;
                  return (
                    <a
                      key={attachment.fileUrl}
                      href={href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-2xl border border-base-300 px-4 py-3 transition hover:border-scholar-accent/40 hover:bg-base-200/50"
                    >
                      <div className="mt-0.5 rounded-full bg-scholar-accent/10 p-2 text-scholar-accent">
                        <Download className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-base-content">{attachment.originalName}</p>
                        <p className="text-xs text-base-content/60">
                          {attachment.mimeType || 'ไฟล์แนบ'}
                          {typeof attachment.size === 'number' ? ` • ${(attachment.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-base-content/60">ข่าวรายการนี้ไม่มีเอกสารแนบ</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
