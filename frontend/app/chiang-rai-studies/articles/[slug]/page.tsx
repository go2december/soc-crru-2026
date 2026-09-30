import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Clock, Share2, Printer, ImageIcon, Film, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

import ArticleActions from './ArticleActions';
import CiteModal from '@/components/research/CiteModal';
import JsonLd from '@/components/seo/JsonLd';
import { getApiBaseUrl, getAssetUrl } from '@/lib/api-config';

interface Article {
    id: string;
    title: string;
    slug: string;
    category: 'ACADEMIC' | 'RESEARCH';
    abstract: string | null;
    content: string;
    thumbnailUrl: string | null;
    mediaType: string | null;
    mediaUrls: string[] | null;
    tags: string[] | null;
    author: string | null;
    publishedAt: string | null;
    createdAt: string;
}

const API_URL = getApiBaseUrl();

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/articles/${slug}`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        const article = await res.json();
        // Normalize URLs
        if (article.thumbnailUrl) {
            article.thumbnailUrl = getAssetUrl(article.thumbnailUrl);
        }
        if (article.mediaUrls && Array.isArray(article.mediaUrls)) {
            article.mediaUrls = article.mediaUrls.map((url: string) => getAssetUrl(url));
        }
        return article;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return { title: 'บทความไม่พบ' };

    const title = `${article.title} | ศูนย์เชียงรายศึกษา`;
    const description = article.abstract || article.title;
    const ogImage = article.thumbnailUrl || (article.mediaUrls && article.mediaUrls.length > 0 ? article.mediaUrls[0] : null);

    return {
        title,
        description,
        alternates: {
            canonical: `/chiang-rai-studies/articles/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/chiang-rai-studies/articles/${slug}`,
            siteName: 'ศูนย์เชียงรายศึกษา (Chiang Rai Studies Center)',
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
            locale: 'th_TH',
            type: 'article',
            authors: article.author ? [article.author] : [],
            publishedTime: article.publishedAt || undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : [],
        },
        other: {
            'citation_title': article.title,
            ...(article.author ? { 'citation_author': [article.author] } : {}),
            ...(article.publishedAt ? { 'citation_publication_date': new Date(article.publishedAt).toISOString().split('T')[0].replace(/-/g, '/') } : {}),
            'citation_publisher': 'ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        },
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    // Process media URLs for display
    const processedMediaUrls = article.mediaUrls?.map(url => getAssetUrl(url)) || [];
    const processedThumbnail = article.thumbnailUrl ? getAssetUrl(article.thumbnailUrl) : null;

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.abstract || article.title,
        image: processedThumbnail || (processedMediaUrls.length > 0 ? processedMediaUrls[0] : ''),
        datePublished: article.publishedAt || article.createdAt,
        author: {
            '@type': 'Person',
            name: article.author || 'ศูนย์เชียงรายศึกษา',
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
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* JSON-LD Script */}
            <JsonLd data={jsonLd} />

            {/* Header Image / Pattern */}
            <div className="h-64 md:h-80 bg-[#2e1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                {processedThumbnail && (
                    <>
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <Image
                            src={processedThumbnail}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover z-0"
                            sizes="100vw"
                        />
                    </>
                )}
                <div className="absolute -bottom-1 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent z-20"></div>
            </div>

            <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-30">
                <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-xl overflow-hidden border border-stone-200">

                    {/* Article Header */}
                    <div className="p-8 md:p-12 border-b border-stone-100">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-stone-500 text-xs mb-6 flex-wrap">
                            <Link href="/chiang-rai-studies" className="hover:text-[#702963] transition-colors">ศูนย์เชียงรายศึกษา</Link>
                            <span className="text-stone-300">/</span>
                            <Link href="/chiang-rai-studies/articles" className="hover:text-[#702963] transition-colors">บทความวิชาการ</Link>
                            <span className="text-stone-300">/</span>
                            <span className="text-stone-700 font-medium truncate max-w-[200px] md:max-w-xs">{article.title}</span>
                        </nav>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-3 py-1 rounded-sm bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-200">
                                {article.category || 'Article'}
                            </span>
                            {article.publishedAt && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
                                    <Calendar size={12} className="text-orange-500" />
                                    {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: th })}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2e1065] leading-tight mb-6">
                            {article.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-stone-500 text-sm">
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-sm bg-purple-50 border border-purple-100 flex items-center justify-center text-[#702963]">
                                        <User size={16} />
                                    </div>
                                    <span className="font-medium text-stone-700">{article.author}</span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3 ml-auto md:ml-0 border-l border-stone-200 pl-6">
                                <CiteModal
                                    title={article.title}
                                    authors={article.author ? [article.author] : []}
                                    year={article.publishedAt ? new Date(article.publishedAt).getFullYear() : new Date().getFullYear()}
                                    publisher="ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย"
                                    url={`https://soc.crru.ac.th/chiang-rai-studies/articles/${article.slug}`}
                                />
                                <ArticleActions title={article.title} description={article.abstract || undefined} />
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8 md:p-12">
                        {article.abstract && (
                            <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 mb-10 italic text-stone-700 leading-relaxed font-light text-lg">
                                "{article.abstract}"
                            </div>
                        )}

                        <div
                            className="prose prose-lg prose-stone max-w-none prose-headings:font-bold prose-headings:text-[#2e1065] prose-a:text-[#702963] prose-img:rounded-sm prose-img:shadow-md mb-12"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Media Groups Logic */}
                        {(() => {
                            const images: string[] = [];
                            const videos: string[] = [];
                            const others: string[] = [];

                            processedMediaUrls.forEach(url => {
                                if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                                    images.push(url);
                                } else if (url.match(/\.(mp4|webm|ogg)$/i) || url.match(/youtube|youtu\.be|vimeo/)) {
                                    videos.push(url);
                                } else {
                                    others.push(url);
                                }
                            });

                            return (
                                <div className="space-y-12 border-t border-stone-100 pt-10">

                                    {/* 1. Image Gallery */}
                                    {images.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-[#2e1065] flex items-center gap-2">
                                                <ImageIcon size={24} className="text-purple-600" />
                                                ภาพประกอบกิจกรรม
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="relative group overflow-hidden rounded-sm aspect-[4/3] bg-stone-100 cursor-zoom-in">
                                                        <Image
                                                            src={img}
                                                            alt={`Gallery ${idx + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. Video Gallery */}
                                    {videos.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-[#2e1065] flex items-center gap-2">
                                                <Film size={24} className="text-red-600" />
                                                วิดีโอที่เกี่ยวข้อง
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {videos.map((vid, idx) => (
                                                    <div key={idx} className="bg-black rounded-sm overflow-hidden shadow-lg aspect-video relative">
                                                        {vid.match(/youtube|youtu\.be/) ? (
                                                            <iframe
                                                                src={vid.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                                className="w-full h-full"
                                                                allowFullScreen
                                                                title={`Video ${idx}`}
                                                            ></iframe>
                                                        ) : (
                                                            <video controls src={vid} className="w-full h-full" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Documents & Links */}
                                    {others.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-[#2e1065] flex items-center gap-2">
                                                <Link2 size={24} className="text-blue-600" />
                                                เอกสารและลิงก์เพิ่มเติม
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {others.map((link, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-sm hover:border-stone-400 hover:shadow-md transition group"
                                                    >
                                                        <div className="w-10 h-10 rounded-sm bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-stone-200 group-hover:text-stone-700 transition-colors">
                                                            {link.endsWith('.pdf') ? <Printer size={20} /> : <Share2 size={20} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-stone-700 group-hover:text-purple-900 truncate">
                                                                {link.split('/').pop() || 'คลิกเพื่อเปิดลิงก์'}
                                                            </p>
                                                            <p className="text-xs text-stone-400 truncate">{link}</p>
                                                        </div>
                                                        <ArrowRight size={16} className="text-stone-300 group-hover:text-purple-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            );
                        })()}

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1 text-sm font-bold text-stone-400 uppercase tracking-wider mr-2">
                                    <Tag size={16} /> Tags:
                                </span>
                                {article.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-stone-50 border border-stone-200 text-stone-600 rounded-sm text-sm hover:bg-[#702963] hover:text-white hover:border-[#702963] transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Bottom Actions / Back */}
                        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Link
                                href="/chiang-rai-studies/articles"
                                className="inline-flex items-center gap-2 bg-[#2e1065] text-white px-6 py-3 rounded-sm font-bold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                กลับไปหน้ารวมบทความ
                            </Link>

                            <div className="flex items-center gap-3">
                                <CiteModal
                                    title={article.title}
                                    authors={article.author ? [article.author] : []}
                                    year={article.publishedAt ? new Date(article.publishedAt).getFullYear() : new Date().getFullYear()}
                                    publisher="ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย"
                                    url={`https://soc.crru.ac.th/chiang-rai-studies/articles/${article.slug}`}
                                />
                                <ArticleActions title={article.title} description={article.abstract || undefined} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
