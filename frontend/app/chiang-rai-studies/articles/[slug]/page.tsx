import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Clock, Share2, Printer, ImageIcon, Film, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

import ArticleActions from './ArticleActions';

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

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/articles/${slug}`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return { title: 'บทความไม่พบ' };

    return {
        title: `${article.title} | ศูนย์เชียงรายศึกษา`,
        description: article.abstract || article.title,
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    // Process media URLs for display (handle relative paths)
    const processedMediaUrls = article.mediaUrls?.map(url =>
        url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${url}` : url
    ) || [];

    const processedThumbnail = article.thumbnailUrl?.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${article.thumbnailUrl}`
        : article.thumbnailUrl;

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header Image / Pattern */}
            <div className="h-64 md:h-80 bg-[#581c87] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                {processedThumbnail && (
                    <>
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <img
                            src={processedThumbnail}
                            alt={article.title}
                            className="w-full h-full object-cover absolute inset-0 z-0"
                        />
                    </>
                )}
                <div className="absolute -bottom-1 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent z-20"></div>
            </div>

            <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-30">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-50">

                    {/* Article Header */}
                    <div className="p-8 md:p-12 border-b border-stone-100">
                        {/* Breadcrumb / Back */}
                        <Link
                            href="/chiang-rai-studies/articles"
                            className="inline-flex items-center gap-2 text-stone-500 hover:text-[#702963] mb-6 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> กลับไปหน้ารวมบทความ
                        </Link>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-100">
                                {article.category || 'Article'}
                            </span>
                            {article.publishedAt && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                                    <Calendar size={12} />
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
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <User size={16} />
                                    </div>
                                    <span className="font-medium">{article.author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-6 ml-auto md:ml-0 border-l border-stone-200 pl-6">
                                <ArticleActions title={article.title} description={article.abstract || undefined} />
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8 md:p-12">
                        {article.abstract && (
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-10 italic text-purple-900 leading-relaxed font-light text-lg">
                                "{article.abstract}"
                            </div>
                        )}

                        <div
                            className="prose prose-lg prose-stone max-w-none prose-headings:font-bold prose-headings:text-[#2e1065] prose-a:text-[#702963] prose-img:rounded-xl prose-img:shadow-md mb-12"
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
                                                    <div key={idx} className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-stone-100 cursor-zoom-in">
                                                        <img
                                                            src={img}
                                                            alt={`Gallery ${idx + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                                                    <div key={idx} className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative">
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
                                                        className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-xl hover:border-purple-300 hover:shadow-md transition group"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
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
                            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap gap-2">
                                <span className="flex items-center gap-1 text-sm font-bold text-stone-400 uppercase tracking-wider mr-2">
                                    <Tag size={16} /> Tags:
                                </span>
                                {article.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white border border-stone-200 text-stone-600 rounded-full text-sm hover:bg-[#702963] hover:text-white hover:border-[#702963] transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
