import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Paperclip,
} from 'lucide-react';
import NewsGalleryClient from './NewsGalleryClient';
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
  const attachments = newsItem.attachments || [];

  const hasAttachments = attachments.length > 0;

  return (
    <div className="bg-base-100 min-h-screen pb-16 lg:pb-24">
      {/* Immersive Magazine Hero Section */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] min-h-[400px] max-h-[700px] flex items-end">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={newsItem.title}
            fill
            unoptimized
            className="object-cover pointer-events-none"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-scholar-deep via-slate-900 to-scholar-accent" />
        )}
        
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl space-y-6">
            <Link href={`/news${newsItem.category ? `?category=${newsItem.category}` : ''}`} className="group inline-flex items-center gap-2 font-medium text-white/80 transition-colors hover:text-white">
              <span className="flex items-center justify-center p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <ArrowLeft className="h-4 w-4" />
              </span> กลับไปหน้าข่าวสาร
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className={`rounded-full px-4 py-1.5 shadow-sm text-xs sm:text-sm whitespace-nowrap bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30`}>
                {FACULTY_NEWS_CATEGORY_LABELS[newsItem.category]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <CalendarDays className="h-4 w-4" />
                {formatFacultyNewsDate(newsItem.publishedAt)}
              </span>
              {hasAttachments && (
                <span className="inline-flex items-center gap-1.5 text-white/80">
                  <Paperclip className="h-4 w-4" />
                  {attachments.length} ไฟล์
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-md">{newsItem.title}</h1>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {/* We use grid if there are attachments for the sidebar, otherwise center it perfectly */}
      <div className={`container mx-auto px-4 py-12 lg:py-16 ${hasAttachments ? 'grid gap-12 lg:grid-cols-[1fr_minmax(0,340px)]' : 'max-w-4xl'}`}>
        
        <div className="space-y-12">
          {/* Article text */}
          <article className="prose prose-base sm:prose-lg max-w-none prose-headings:font-bold prose-headings:text-base-content prose-p:text-base-content/80 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-3xl prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: fixedContent }} />

          {/* Gallery Section */}
          <NewsGalleryClient galleryImages={galleryImages} />
        </div>

        {/* Sidebar (Only shows if there are attachments) */}
        {hasAttachments && (
          <aside className="space-y-8 lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden text-base-content">
              {/* Header card */}
              <div className="bg-base-200/50 p-5 border-b border-base-300">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" /> เอกสารที่เกี่ยวข้อง
                </h2>
                <p className="text-xs text-base-content/60 mt-1">สามารถคลิกเพื่อดาวน์โหลดแผ่นพับ แจ้งกำหนดการ หรือแบบฟอร์มไฟล์แนบ</p>
              </div>
              
              <div className="p-4 space-y-3">
                {attachments.map((attachment) => {
                  const href = getFacultyNewsServerAssetUrl(attachment.fileUrl) || attachment.fileUrl;
                  return (
                    <a
                      key={attachment.fileUrl}
                      href={href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-4 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-base-200 p-2 text-base-content/70 transition-colors group-hover:bg-primary group-hover:text-primary-content">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-medium text-base-content group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {attachment.originalName}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-base-content/50">
                            <span className="uppercase tracking-wider px-2 py-0.5 bg-base-200 rounded-md">
                              {attachment.mimeType?.split('/')[1] || 'FILE'}
                            </span>
                            {typeof attachment.size === 'number' && (
                              <span>{(attachment.size / 1024 / 1024).toFixed(2)} MB</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
