
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

interface Article {
    id: string;
    title: string;
    slug: string;
    abstract: string | null;
    content: string;
    thumbnailUrl: string | null;
    tags: string[] | null;
    author: string | null;
    publishedAt: string | null;
    createdAt: string;
}

// Fetch Article by Slug
async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/articles/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch article');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header / Hero */}
            <div className="bg-[#581c87] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Link
                        href="/chiang-rai-studies/articles"
                        className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} /> กลับไปหน้าบทความ
                    </Link>

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-6 border border-orange-500/30">
                            Research Article
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight drop-shadow-md">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-purple-200/80 text-sm">
                            {article.publishedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-orange-400" />
                                    {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: th })}
                                </div>
                            )}
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-orange-400" />
                                    {article.author}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-purple-100 overflow-hidden">

                    {/* Thumbnail Image */}
                    {article.thumbnailUrl && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={article.thumbnailUrl}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-30"></div>
                        </div>
                    )}

                    <div className="p-8 md:p-14">
                        {/* Abstract */}
                        {article.abstract && (
                            <div className="bg-purple-50 p-8 rounded-3xl mb-10 border-l-4 border-orange-500 italic text-purple-900/80 text-lg leading-relaxed">
                                "{article.abstract}"
                            </div>
                        )}

                        {/* Main Content (HTML rendered) */}
                        <div
                            className="prose prose-lg prose-purple max-w-none hover:prose-a:text-orange-600 prose-headings:font-bold prose-headings:text-[#581c87]"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-purple-100">
                                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Tag size={14} /> Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag, i) => (
                                        <span key={i} className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-100 hover:text-orange-700 transition-colors cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
