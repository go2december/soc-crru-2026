import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User2, Tag, ExternalLink, Play, Clock, ChevronRight, Images } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface LearningSite {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string;
    thumbnailUrl: string | null;
    mediaType: string | null;
    mediaUrls: string[] | null;
    tags: string[] | null;
    author: string | null;
    publishedAt: string | null;
    createdAt: string;
}

async function getLearningSite(slug: string): Promise<LearningSite | null> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/learning-sites/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error fetching learning site:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const site = await getLearningSite(slug);
    if (!site) return { title: 'ไม่พบแหล่งเรียนรู้' };
    const title = `${site.title} | ศูนย์เชียงรายศึกษา`;
    const description = site.description || site.title;
    const ogImage = site.thumbnailUrl || (site.mediaUrls && site.mediaUrls.length > 0 ? site.mediaUrls[0] : null);
    return {
        title,
        description,
        alternates: {
            canonical: `/chiang-rai-studies/learning-sites/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/chiang-rai-studies/learning-sites/${slug}`,
            siteName: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
            locale: 'th_TH',
            type: 'article',
            authors: site.author ? [site.author] : [],
            publishedTime: site.publishedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : [],
        },
    };
}

function fixContentImageUrls(html: string): string {
    if (!html) return html;
    return html.replace(/src="https?:\/\/[^"]*\/uploads\//g, 'src="/uploads/');
}

function calcReadTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
}

export default async function LearningSiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const site = await getLearningSite(slug);

    if (!site) notFound();

    const toPublicUrl = (url: string) => url.startsWith('/') ? `${PUBLIC_URL}${url}` : url;
    const processedThumbnail = site.thumbnailUrl ? toPublicUrl(site.thumbnailUrl) : null;
    const allMediaUrls = (site.mediaUrls || []).map((u: string) => toPublicUrl(u));
    const processedContent = fixContentImageUrls(site.content);
    const readTime = calcReadTime(site.content || '');

    const photos = allMediaUrls.filter(u => !u.includes('youtube') && !u.includes('youtu.be') && !u.includes('vimeo') && !u.startsWith('http'));
    const videos = allMediaUrls.filter(u => u.includes('youtube') || u.includes('youtu.be') || u.includes('vimeo'));
    const extLinks = allMediaUrls.filter(u => u.startsWith('http') && !u.includes('youtube') && !u.includes('youtu.be') && !u.includes('vimeo'));
    const hasMedia = photos.length > 0 || videos.length > 0 || extLinks.length > 0;

    return (
        <div className="min-h-screen bg-[#F8F4FF] font-kanit">

            {/* ─── HERO ─── */}
            <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
                {processedThumbnail ? (
                    <Image src={processedThumbnail} alt={site.title} fill unoptimized className="object-cover" priority />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#1a0040]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120028] via-[#2e1065]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#120028]/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="container mx-auto px-4 pb-10 max-w-6xl">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-purple-300/70 text-xs mb-5 flex-wrap">
                            <Link href="/chiang-rai-studies" className="hover:text-white transition-colors">ศูนย์เชียงรายศึกษา</Link>
                            <ChevronRight size={12} className="flex-shrink-0" />
                            <Link href="/chiang-rai-studies/learning-sites" className="hover:text-white transition-colors">แหล่งเรียนรู้ทางวัฒนธรรม</Link>
                            <ChevronRight size={12} className="flex-shrink-0" />
                            <span className="text-white/80 truncate max-w-[200px] md:max-w-xs">{site.title}</span>
                        </nav>

                        {/* Tags */}
                        {site.tags && site.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {site.tags.slice(0, 3).map(tag => (
                                    <Link key={tag} href={`/chiang-rai-studies/learning-sites?tag=${encodeURIComponent(tag)}`}
                                        className="bg-orange-500/20 backdrop-blur-sm text-orange-300 border border-orange-400/40 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide hover:bg-orange-500/40 transition-colors">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-[2.75rem] font-black text-white leading-tight mb-5 drop-shadow-xl max-w-4xl">
                            {site.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-5 text-purple-200/80 text-sm">
                            {site.author && (
                                <span className="flex items-center gap-1.5">
                                    <User2 size={14} className="text-orange-400" />
                                    <span>{site.author}</span>
                                </span>
                            )}
                            {site.publishedAt && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-orange-400" />
                                    <span>{format(new Date(site.publishedAt), 'd MMMM yyyy', { locale: th })}</span>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-orange-400" />
                                <span>อ่าน {readTime} นาที</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── BODY ─── */}
            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* Description / Abstract */}
                {site.description && (
                    <div className="relative pl-5 border-l-[3px] border-orange-400 py-1 mb-10">
                        <p className="text-stone-600 text-lg leading-relaxed italic">{site.description}</p>
                    </div>
                )}

                {/* Article body */}
                <article className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden mb-10">
                    <div className="p-8 md:p-12">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:font-bold prose-headings:text-[#2e1065]
                                prose-p:text-stone-700 prose-p:leading-[1.9]
                                prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-blockquote:border-l-orange-400 prose-blockquote:text-stone-600 prose-blockquote:not-italic
                                prose-strong:text-[#2e1065]
                                prose-li:text-stone-700 prose-li:leading-relaxed
                                prose-hr:border-purple-100"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                        />
                    </div>
                </article>

                {/* ── MEDIA GALLERY ── */}
                {hasMedia && (
                    <section className="space-y-6 mb-10">
                        <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#2e1065]">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-500">
                                <Images size={18} />
                            </span>
                            สื่อประกอบ
                        </h2>

                        {/* Photo grid */}
                        {photos.length > 0 && (
                            <div className={`grid gap-3 ${
                                photos.length === 1 ? 'grid-cols-1' :
                                photos.length === 2 ? 'grid-cols-2' :
                                photos.length === 3 ? 'grid-cols-3' :
                                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            }`}>
                                {photos.map((url, i) => (
                                    <div key={i} className={`relative overflow-hidden rounded-2xl shadow group bg-stone-100 ${
                                        photos.length === 1 ? 'aspect-video' : 'aspect-[4/3]'
                                    }`}>
                                        <Image src={url} alt={`ภาพประกอบ ${i + 1}`} fill unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Video embeds */}
                        {videos.length > 0 && (
                            <div className="space-y-4">
                                {videos.map((url, i) => {
                                    const ytId = getYouTubeId(url);
                                    return ytId ? (
                                        <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-stone-900">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                                className="absolute inset-0 w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={`วิดีโอ ${i + 1}`}
                                            />
                                        </div>
                                    ) : (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl hover:border-red-300 hover:shadow-sm transition group">
                                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <Play size={16} className="text-red-600 ml-0.5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-xs text-stone-400 mb-0.5">วิดีโอ</p>
                                                <p className="text-sm text-red-700 truncate group-hover:underline">{url}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {/* External links */}
                        {extLinks.length > 0 && (
                            <div className="space-y-2">
                                {extLinks.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-sm transition group">
                                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                            <ExternalLink size={15} className="text-blue-600" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-stone-400 mb-0.5">ลิงก์ภายนอก</p>
                                            <p className="text-sm text-blue-700 truncate group-hover:underline">{url}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Tags */}
                {site.tags && site.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-6 mb-10 border-t border-stone-100">
                        <Tag size={15} className="text-stone-400 flex-shrink-0" />
                        {site.tags.map(tag => (
                            <Link key={tag} href={`/chiang-rai-studies/learning-sites?tag=${encodeURIComponent(tag)}`}
                                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-100 hover:bg-purple-100 transition">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Back to list */}
                <div className="flex justify-center pb-8">
                    <Link href="/chiang-rai-studies/learning-sites"
                        className="inline-flex items-center gap-2 bg-[#2e1065] text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        กลับไปหน้ารายการแหล่งเรียนรู้
                    </Link>
                </div>
            </div>
        </div>
    );
}
