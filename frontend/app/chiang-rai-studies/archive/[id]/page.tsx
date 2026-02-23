
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Share2, Printer, AlertTriangle, ScrollText, Landmark, ArrowRight, ImageIcon, Film, ExternalLink, Images, Play } from 'lucide-react';
import { notFound } from 'next/navigation';
import ImageLightbox from './ImageLightbox';
import SharePrintButton from '@/components/chiang-rai/SharePrintButton';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

// Type Definition
interface Artifact {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    category: string | null;
    thumbnailUrl: string | null;
    mediaUrls: string[] | null;
    mediaType: string | null;
    author: string | null;
    createdAt: string | null;
}

// Helper: detect media type from URL
function getMediaType(url: string): 'image' | 'video' | 'link' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(url)) return 'image';
    if (url.startsWith('http') && !url.includes('unsplash.com')) return 'link';
    return 'image'; // default for unsplash etc.
}

// Helper: extract YouTube video ID
function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
}

// Categories for label mapping
const categoryLabels: Record<string, string> = {
    HISTORY: 'ประวัติศาสตร์',
    ARCHAEOLOGY: 'โบราณคดี',
    CULTURE: 'ประเพณี/ชาติพันธุ์',
    ARTS: 'ศิลปะการแสดง',
    WISDOM: 'ภูมิปัญญาท้องถิ่น',
};

// Fetch artifact data (Server-side)
async function getArtifact(id: string): Promise<Artifact | null> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/artifacts/${id}`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch artifact');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching artifact:', error);
        return null;
    }
}

// Format Date
function formatDate(dateString: string | null) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const artifact = await getArtifact(id);

    if (!artifact) {
        return {
            title: 'ไม่พบข้อมูล | คลังข้อมูลดิจิทัล',
            description: 'ไม่พบข้อมูลอัตลักษณ์ที่คุณค้นหา'
        };
    }

    const title = `${artifact.title} | คลังข้อมูลดิจิทัล ศูนย์เชียงรายศึกษา`;
    const description = artifact.description
        ? artifact.description.slice(0, 160) + (artifact.description.length > 160 ? '...' : '')
        : 'คลังข้อมูลดิจิทัล รวบรวมองค์ความรู้ ประวัติศาสตร์ ศิลปวัฒนธรรม และภูมิปัญญาท้องถิ่นเชียงราย';
    const ogImage = artifact.thumbnailUrl || (artifact.mediaUrls && artifact.mediaUrls.length > 0 ? artifact.mediaUrls[0] : null);

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `/chiang-rai-studies/archive/${id}`,
            siteName: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: artifact.title }] : [],
            locale: 'th_TH',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ogImage ? [ogImage] : [],
        },
    };
}

export default async function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const artifact = await getArtifact(id);

    if (!artifact) {
        notFound();
    }

    const { id } = await params;

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: artifact.title,
        description: artifact.description || '',
        image: artifact.thumbnailUrl || (artifact.mediaUrls && artifact.mediaUrls.length > 0 ? artifact.mediaUrls[0] : ''),
        datePublished: artifact.createdAt || new Date().toISOString(),
        author: {
            '@type': 'Person',
            name: artifact.author || 'ศูนย์เชียงรายศึกษา',
        },
        publisher: {
            '@type': 'Organization',
            name: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
            logo: {
                '@type': 'ImageObject',
                url: 'https://soc.crru.ac.th/images/soc-logo.png',
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-32 font-kanit">
            {/* JSON-LD Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb / Navigation Banner */}
            <div className="bg-[#2e1065] text-purple-200 py-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 text-sm">
                        <Link href="/chiang-rai-studies" className="hover:text-white transition">หน้าแรก</Link>
                        <span className="opacity-40">/</span>
                        <Link href="/chiang-rai-studies/archive" className="hover:text-white transition">คลังข้อมูลดิจิทัล</Link>
                        <span className="opacity-40">/</span>
                        <span className="text-orange-400 font-bold truncate max-w-[150px] md:max-w-xs">{artifact.title}</span>
                    </div>
                    <Link href="/chiang-rai-studies/archive" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-white transition">
                        <ArrowLeft size={14} /> Back to Archive
                    </Link>
                </div>
            </div>

            <article className="container mx-auto px-4 py-16 max-w-5xl">
                {/* Content Header Section */}
                <div className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest shadow-sm">
                            <Landmark size={14} />
                            {artifact.category ? categoryLabels[artifact.category] || artifact.category : 'Identity Item'}
                        </span>
                        <span className="w-12 h-px bg-purple-200"></span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-[#2e1065] mb-8 leading-tight tracking-tight drop-shadow-sm">
                        {artifact.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-purple-900/40 text-sm border-y border-purple-100 py-6">
                        {artifact.author && (
                            <div className="flex items-center gap-2.5 font-medium">
                                <User size={18} className="text-purple-300" />
                                <span>โดย <span className="text-purple-800">{artifact.author}</span></span>
                            </div>
                        )}
                        {artifact.createdAt && (
                            <div className="flex items-center gap-2.5 font-medium">
                                <Calendar size={18} className="text-purple-300" />
                                <span>เผยแพร่เมื่อ {formatDate(artifact.createdAt)}</span>
                            </div>
                        )}
                        <div className="md:ml-auto flex items-center gap-6">
                            <SharePrintButton title={artifact.title} description={artifact.description || undefined} />
                        </div>
                    </div>
                </div>

                {/* Cover Image / Media Section */}
                <div className="relative mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up w-full aspect-video max-h-[600px]" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/20 to-transparent z-10 pointer-events-none"></div>
                    <Image
                        src={artifact.thumbnailUrl || (artifact.mediaUrls && artifact.mediaUrls[0]) || 'https://placehold.co/1200x700/2e1065/white?text=Artifact+Display'}
                        alt={artifact.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                </div>

                {/* Descriptive Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    {/* Main Story */}
                    <div className="lg:col-span-8">
                        {artifact.description && (
                            <div className="relative mb-12">
                                <span className="absolute -left-6 top-0 text-7xl text-orange-200 opacity-50 font-serif">"</span>
                                <p className="text-2xl text-purple-900/70 leading-relaxed font-light italic pl-4">
                                    {artifact.description}
                                </p>
                            </div>
                        )}

                        <div className="h-px bg-gradient-to-r from-purple-100 to-transparent mb-12"></div>

                        {artifact.content ? (
                            <div className="prose prose-lg prose-purple max-w-none text-purple-950/80 leading-loose
                                prose-headings:text-[#2e1065] prose-headings:font-black
                                prose-p:font-light prose-p:mb-8
                                prose-strong:text-orange-600 prose-strong:font-bold
                                prose-img:rounded-3xl prose-img:shadow-xl">
                                <div dangerouslySetInnerHTML={{ __html: artifact.content }} />
                            </div>
                        ) : (
                            <div className="py-20 text-center text-purple-300 bg-white rounded-[2rem] border-2 border-dashed border-purple-50">
                                <ScrollText className="mx-auto mb-6 opacity-20" size={64} />
                                <p className="text-xl font-light">ขออภัย เนื้อหาฉบับเต็มยังอยู่ระหว่างการจัดทำข้อมูลดิจิทัล</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Associated Info */}
                    <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-purple-50">
                            <h4 className="text-lg font-bold text-[#2e1065] mb-6 border-b border-purple-50 pb-4">สารบัญอัตลักษณ์</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <li key={key}>
                                        <Link
                                            href={`/chiang-rai-studies/archive?category=${key}`}
                                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${artifact.category === key ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-purple-50 text-purple-900/60 hover:text-purple-900'}`}
                                        >
                                            {label}
                                            <ArrowRight size={14} className={artifact.category === key ? 'opacity-100' : 'opacity-0'} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Media Summary Card */}
                        {artifact.mediaUrls && artifact.mediaUrls.length > 0 && (
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-purple-50">
                                <h4 className="text-lg font-bold text-[#2e1065] mb-6 border-b border-purple-50 pb-4">Galleries</h4>
                                <div className="space-y-3">
                                    {artifact.mediaUrls.filter(u => getMediaType(u) === 'image').length > 0 && (
                                        <div className="flex items-center gap-3 text-sm text-purple-700">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                                <ImageIcon size={16} className="text-purple-500" />
                                            </div>
                                            <span className="font-medium">{artifact.mediaUrls.filter(u => getMediaType(u) === 'image').length} รูปภาพ</span>
                                        </div>
                                    )}
                                    {artifact.mediaUrls.filter(u => getMediaType(u) === 'video').length > 0 && (
                                        <div className="flex items-center gap-3 text-sm text-rose-600">
                                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                                                <Film size={16} className="text-rose-500" />
                                            </div>
                                            <span className="font-medium">{artifact.mediaUrls.filter(u => getMediaType(u) === 'video').length} วิดีโอ</span>
                                        </div>
                                    )}
                                    {artifact.mediaUrls.filter(u => getMediaType(u) === 'link').length > 0 && (
                                        <div className="flex items-center gap-3 text-sm text-blue-600">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <ExternalLink size={16} className="text-blue-500" />
                                            </div>
                                            <span className="font-medium">{artifact.mediaUrls.filter(u => getMediaType(u) === 'link').length} ลิงก์</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-[#2e1065] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Landmark size={150} />
                            </div>
                            <h4 className="text-xl font-bold mb-4 relative z-10">สืบค้นคลังดิจิทัล</h4>
                            <p className="text-purple-200/70 text-sm mb-6 font-light relative z-10 leading-relaxed">ค้นพบเรื่องราวและเอกสารโบราณที่หาดูได้ยากจากแหล่งข้อมูลทั่วเชียงราย</p>
                            <Link href="/chiang-rai-studies/archive" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-orange-500 transition-all relative z-10">
                                Go to Archive
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ===== Galleries Section (after article content) ===== */}
                {artifact.mediaUrls && artifact.mediaUrls.length > 0 && (() => {
                    const imageUrls = artifact.mediaUrls!.filter(u => getMediaType(u) === 'image');
                    const videoUrls = artifact.mediaUrls!.filter(u => getMediaType(u) === 'video');
                    const linkUrls = artifact.mediaUrls!.filter(u => getMediaType(u) === 'link');

                    return (
                        <div className="mt-20 pt-16 border-t border-purple-100 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <Images size={22} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#2e1065]">Galleries</h2>
                                    <p className="text-purple-400 text-sm font-light">
                                        {artifact.mediaUrls!.length} รายการ
                                        {imageUrls.length > 0 && ` · ${imageUrls.length} รูปภาพ`}
                                        {videoUrls.length > 0 && ` · ${videoUrls.length} วิดีโอ`}
                                        {linkUrls.length > 0 && ` · ${linkUrls.length} ลิงก์`}
                                    </p>
                                </div>
                            </div>

                            {/* Image Gallery Grid with Lightbox */}
                            {imageUrls.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-5">
                                        <ImageIcon size={16} className="text-purple-400" />
                                        <h3 className="text-sm font-bold text-purple-600 uppercase tracking-widest">รูปภาพ</h3>
                                    </div>
                                    <ImageLightbox images={imageUrls} />
                                </div>
                            )}

                            {/* Video Section */}
                            {videoUrls.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Film size={16} className="text-rose-500" />
                                        <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest">วิดีโอ</h3>
                                    </div>
                                    <div className={`grid gap-6 ${videoUrls.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
                                        {videoUrls.map((url, i) => {
                                            const ytId = getYouTubeId(url);
                                            if (ytId) {
                                                return (
                                                    <div key={i} className="rounded-2xl overflow-hidden shadow-lg border border-purple-50 bg-black">
                                                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                                            <iframe
                                                                src={`https://www.youtube.com/embed/${ytId}`}
                                                                title={`วิดีโอ ${i + 1}`}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                                className="absolute inset-0 w-full h-full"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-purple-50 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all group">
                                                    <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                                                        <Play size={24} className="text-rose-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-[#2e1065] group-hover:text-rose-600 transition-colors">วิดีโอ {i + 1}</p>
                                                        <p className="text-xs text-purple-400 truncate">{url}</p>
                                                    </div>
                                                    <ExternalLink size={16} className="text-purple-300 shrink-0 ml-auto group-hover:text-rose-500 transition-colors" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* External Links Section */}
                            {linkUrls.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 mb-5">
                                        <ExternalLink size={16} className="text-blue-500" />
                                        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">ลิงก์ที่เกี่ยวข้อง</h3>
                                    </div>
                                    <div className="space-y-3 max-w-3xl">
                                        {linkUrls.map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-purple-50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                    <ExternalLink size={18} className="text-blue-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-[#2e1065] group-hover:text-blue-600 transition-colors truncate">{url}</p>
                                                </div>
                                                <ArrowRight size={14} className="text-purple-300 shrink-0 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Footer Back Link */}
                <div className="mt-24 pt-10 border-t border-purple-100 flex justify-center">
                    <Link
                        href="/chiang-rai-studies/archive"
                        className="group flex flex-col items-center gap-4 text-purple-300 hover:text-orange-600 transition-all"
                    >
                        <div className="w-12 h-12 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-orange-500 transition-all">
                            <ArrowLeft size={24} />
                        </div>
                        <span className="font-bold tracking-widest uppercase text-[10px]">Back to Digital Archive</span>
                    </Link>
                </div>
            </article>

            {/* Back Button (Floating) */}
            <div className="fixed bottom-10 right-10 z-[60]">
                <Link href="/chiang-rai-studies/archive" className="w-16 h-16 bg-[#2e1065] text-white rounded-full shadow-2xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center group hover:-translate-y-2">
                    <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
