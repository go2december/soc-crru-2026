import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
    Calendar,
    ArrowLeft,
    MapPin,
    Tag,
    Clock,
    ChevronRight,
    Images,
    ExternalLink,
    Play,
    User2,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const dynamic = 'force-dynamic';

async function getActivity(slug: string) {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/activities/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error fetching activity:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const activity = await getActivity(slug);

    if (!activity) {
        return { title: 'ไม่พบกิจกรรม | ศูนย์เชียงรายศึกษา' };
    }

    const title = `${activity.title} | กิจกรรมศูนย์เชียงรายศึกษา`;
    const description = activity.description || activity.content?.replace(/<[^>]*>?/gm, '').slice(0, 160) || '';
    const ogImage = activity.thumbnailUrl || null;

    return {
        title,
        description,
        alternates: {
            canonical: `/chiang-rai-studies/activities/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/chiang-rai-studies/activities/${slug}`,
            siteName: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
            locale: 'th_TH',
            type: 'article',
            publishedTime: activity.publishedAt,
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

function formatEventDate(startDate: string | null, endDate: string | null): string | null {
    if (!startDate) return null;
    const start = new Date(startDate);
    if (endDate) {
        const end = new Date(endDate);
        if (start.toDateString() === end.toDateString()) {
            return `${format(start, 'd MMMM yyyy', { locale: th })} เวลา ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')} น.`;
        }
        return `${format(start, 'd MMMM yyyy', { locale: th })} - ${format(end, 'd MMMM yyyy', { locale: th })}`;
    }
    return format(start, 'd MMMM yyyy', { locale: th });
}

export default async function ActivityDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const activity = await getActivity(params.slug);

    if (!activity) notFound();

    const toPublicUrl = (url: string) => url.startsWith('/') ? `${PUBLIC_URL}${url}` : url;
    const processedThumbnail = activity.thumbnailUrl ? toPublicUrl(activity.thumbnailUrl) : null;
    const processedContent = fixContentImageUrls(activity.content || '');
    const readTime = calcReadTime(activity.content || '');
    const eventDateStr = formatEventDate(activity.eventDate, activity.eventEndDate);

    const allMediaUrls = (activity.mediaUrls || []).map((u: string) => toPublicUrl(u));
    const photos = allMediaUrls.filter((u: string) => !u.includes('youtube') && !u.includes('youtu.be') && !u.includes('vimeo') && !u.startsWith('http'));
    const videos = allMediaUrls.filter((u: string) => u.includes('youtube') || u.includes('youtu.be') || u.includes('vimeo'));
    const extLinks = allMediaUrls.filter((u: string) => u.startsWith('http') && !u.includes('youtube') && !u.includes('youtu.be') && !u.includes('vimeo'));
    const hasMedia = photos.length > 0 || videos.length > 0 || extLinks.length > 0;

    const typeLabel: Record<string, string> = { NEWS: 'ข่าวสาร', EVENT: 'กิจกรรม', ANNOUNCEMENT: 'ประกาศ' };

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': activity.type === 'EVENT' ? 'Event' : 'Article',
        name: activity.title,
        description: activity.description || '',
        image: processedThumbnail || undefined,
        ...(activity.type === 'EVENT' ? {
            startDate: activity.eventDate || activity.publishedAt,
            endDate: activity.eventEndDate || undefined,
            location: activity.location ? {
                '@type': 'Place',
                name: activity.location,
                address: { '@type': 'PostalAddress', addressLocality: 'Chiang Rai', addressCountry: 'TH' }
            } : undefined,
        } : {
            datePublished: activity.publishedAt,
            author: activity.author ? { '@type': 'Person', name: activity.author } : undefined,
        }),
        publisher: {
            '@type': 'Organization',
            name: 'ศูนย์เชียงรายศึกษา มหาวิทยาลัยราชภัฏเชียงราย',
            url: 'https://soc.crru.ac.th/chiang-rai-studies'
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F4FF] font-kanit">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* ─── HERO ─── */}
            <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
                {processedThumbnail ? (
                    <Image src={processedThumbnail} alt={activity.title} fill unoptimized className="object-cover" priority />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#1a0040]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120028] via-[#2e1065]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#120028]/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="container mx-auto px-4 pb-10 max-w-5xl">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-purple-300/70 text-xs mb-5 flex-wrap">
                            <Link href="/chiang-rai-studies" className="hover:text-white transition-colors">ศูนย์เชียงรายศึกษา</Link>
                            <ChevronRight size={12} className="flex-shrink-0" />
                            <Link href="/chiang-rai-studies/activities" className="hover:text-white transition-colors">กิจกรรมและข่าวสาร</Link>
                            <ChevronRight size={12} className="flex-shrink-0" />
                            <span className="text-white/80 truncate max-w-[200px] md:max-w-xs">{activity.title}</span>
                        </nav>

                        {/* Type badge */}
                        <span className="inline-block bg-orange-500/20 backdrop-blur-sm text-orange-300 border border-orange-400/40 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4">
                            {typeLabel[activity.type] || activity.type}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl md:text-[2.75rem] font-black text-white leading-tight mb-5 drop-shadow-xl max-w-4xl">
                            {activity.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-5 text-purple-200/80 text-sm">
                            {activity.author && (
                                <span className="flex items-center gap-1.5">
                                    <User2 size={14} className="text-orange-400" />
                                    <span>{activity.author}</span>
                                </span>
                            )}
                            {activity.publishedAt && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-orange-400" />
                                    <span>{format(new Date(activity.publishedAt), 'd MMMM yyyy', { locale: th })}</span>
                                </span>
                            )}
                            {eventDateStr && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-orange-400" />
                                    <span>{eventDateStr}</span>
                                </span>
                            )}
                            {activity.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-orange-400" />
                                    <span>{activity.location}</span>
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

                {/* Description */}
                {activity.description && (
                    <div className="relative pl-5 border-l-[3px] border-orange-400 py-1 mb-10">
                        <p className="text-stone-600 text-lg leading-relaxed italic">{activity.description}</p>
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
                            dangerouslySetInnerHTML={{ __html: processedContent || '<p class="text-stone-400 italic">ไม่มีเนื้อหาเพิ่มเติม</p>' }}
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

                        {photos.length > 0 && (
                            <div className={`grid gap-3 ${
                                photos.length === 1 ? 'grid-cols-1' :
                                photos.length === 2 ? 'grid-cols-2' :
                                photos.length === 3 ? 'grid-cols-3' :
                                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            }`}>
                                {photos.map((url: string, i: number) => (
                                    <div key={i} className={`relative overflow-hidden rounded-2xl shadow group bg-stone-100 ${
                                        photos.length === 1 ? 'aspect-video' : 'aspect-[4/3]'
                                    }`}>
                                        <Image src={url} alt={`ภาพประกอบ ${i + 1}`} fill unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {videos.length > 0 && (
                            <div className="space-y-4">
                                {videos.map((url: string, i: number) => {
                                    const ytId = getYouTubeId(url);
                                    return ytId ? (
                                        <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-stone-900">
                                            <iframe src={`https://www.youtube.com/embed/${ytId}?rel=0`} className="absolute inset-0 w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen title={`วิดีโอ ${i + 1}`} />
                                        </div>
                                    ) : (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl hover:border-red-300 transition group">
                                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <Play size={16} className="text-red-600 ml-0.5" />
                                            </span>
                                            <p className="text-sm text-red-700 truncate group-hover:underline">{url}</p>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {extLinks.length > 0 && (
                            <div className="space-y-2">
                                {extLinks.map((url: string, i: number) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 transition group">
                                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                            <ExternalLink size={15} className="text-blue-600" />
                                        </span>
                                        <p className="text-sm text-blue-700 truncate group-hover:underline">{url}</p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-6 mb-10 border-t border-stone-100">
                        <Tag size={15} className="text-stone-400 flex-shrink-0" />
                        {activity.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-100">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Back to list */}
                <div className="flex justify-center pb-8">
                    <Link href="/chiang-rai-studies/activities"
                        className="inline-flex items-center gap-2 bg-[#2e1065] text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        กลับไปหน้ากิจกรรมและข่าวสาร
                    </Link>
                </div>
            </div>
        </div>
    );
}
