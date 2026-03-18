import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, BookOpen, ImageIcon, Film, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

interface LearningSite {
    id: string;
    title: string;
    slug: string;
    category: string;
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
        const res = await fetch(`${API_URL}/api/chiang-rai/learning-sites/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching learning site:', error);
        return null;
    }
}

const categoryLabels: Record<string, string> = {
    CULTURAL_SITE: 'แหล่งเรียนรู้ทางวัฒนธรรม',
    MUSEUM: 'พิพิธภัณฑ์',
    TEMPLE: 'วัด',
    HISTORICAL_SITE: 'โบราณสถาน',
    COMMUNITY: 'ชุมชน',
    WISDOM_CENTER: 'ศูนย์ภูมิปัญญา',
    ART_SPACE: 'พื้นที่ศิลปะ',
};

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

export default async function LearningSiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const site = await getLearningSite(slug);

    if (!site) {
        notFound();
    }

    // Process media URLs for display
    const processedMediaUrls = site.mediaUrls?.map(url =>
        url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${url}` : url
    ) || [];

    const processedThumbnail = site.thumbnailUrl?.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_API_URL || ''}${site.thumbnailUrl}`
        : site.thumbnailUrl;

    return (
        <div className="min-h-screen bg-[#FAF5FF] font-kanit pb-20">
            {/* Header */}
            <div className="bg-[#2e1065] text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Link
                        href="/chiang-rai-studies/learning-sites"
                        className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={18} /> กลับไปหน้ารายการ
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-orange-500/30">
                            {categoryLabels[site.category] || site.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{site.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-purple-200/80 text-sm">
                        {site.author && (
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} />
                                <span>{site.author}</span>
                            </div>
                        )}
                        {site.publishedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{format(new Date(site.publishedAt), 'd MMMM yyyy', { locale: th })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Thumbnail */}
                {processedThumbnail && (
                    <div className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-100">
                        <Image
                            src={processedThumbnail}
                            alt={site.title}
                            width={1200}
                            height={630}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                )}

                {/* Description */}
                {site.description && (
                    <div className="mb-12 p-8 bg-white rounded-[2rem] shadow-lg border border-purple-100">
                        <h2 className="text-2xl font-bold text-[#2e1065] mb-4">บทคัดย่อ</h2>
                        <p className="text-stone-600 text-lg leading-relaxed">{site.description}</p>
                    </div>
                )}

                {/* Content */}
                <div className="mb-12 bg-white rounded-[2rem] shadow-lg border border-purple-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-[#2e1065] prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: site.content }}
                        />
                    </div>
                </div>

                {/* Media Gallery */}
                {processedMediaUrls.length > 0 && (
                    <div className="mb-12 bg-white rounded-[2rem] shadow-lg border border-purple-100 p-8">
                        <h2 className="text-2xl font-bold text-[#2e1065] mb-6 flex items-center gap-2">
                            <ImageIcon size={24} className="text-orange-500" />
                            สื่อประกอบ
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {processedMediaUrls.map((url, index) => {
                                const isVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo');
                                const isLink = url.startsWith('http') && !isVideo;
                                return (
                                    <div key={index} className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-50 aspect-square">
                                        {isVideo ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                                                <Film size={32} className="text-red-500 mb-2" />
                                                <span className="text-xs text-red-600 font-medium">Video</span>
                                            </div>
                                        ) : isLink ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                                                <Link2 size={32} className="text-blue-500 mb-2" />
                                                <span className="text-xs text-blue-600 font-medium">Link</span>
                                            </div>
                                        ) : (
                                            <Image src={url} alt={`Media ${index + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {site.tags && site.tags.length > 0 && (
                    <div className="mb-12 bg-white rounded-[2rem] shadow-lg border border-purple-100 p-8">
                        <h2 className="text-2xl font-bold text-[#2e1065] mb-6">คำสำคัญ</h2>
                        <div className="flex flex-wrap gap-2">
                            {site.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100 hover:bg-purple-100 transition"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to List */}
                <div className="flex justify-center">
                    <Link
                        href="/chiang-rai-studies/learning-sites"
                        className="inline-flex items-center gap-2 bg-[#2e1065] text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        <ArrowLeft size={18} /> กลับไปหน้ารายการแหล่งเรียนรู้
                    </Link>
                </div>
            </div>
        </div>
    );
}
