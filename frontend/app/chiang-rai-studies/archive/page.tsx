
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, MapPin, Users, Landmark, Loader2, ScrollText, Sparkles, ArrowRight, ImageIcon, Film, Link2, Images } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Use relative path — Next.js Rewrites will proxy /api/* → backend container
// NEXT_PUBLIC_API_URL is set to '' in .env so fetch('/api/...') works correctly
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Categories (Identities) - Static
const categories = [
    { id: 'ALL', title: 'ทั้งหมด', icon: BookOpen },
    { id: 'HISTORY', title: 'ประวัติศาสตร์', icon: Landmark },
    { id: 'ARCHAEOLOGY', title: 'โบราณคดี', icon: ScrollText },
    { id: 'CULTURE', title: 'ประเพณี/ชาติพันธุ์', icon: Users },
    { id: 'ARTS', title: 'ศิลปะการแสดง', icon: Sparkles },
    { id: 'WISDOM', title: 'ภูมิปัญญาท้องถิ่น', icon: BookOpen },
];

// Type Definition
interface Artifact {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    thumbnailUrl: string | null;
    mediaUrls: string[] | null;
    mediaType: string | null;
    createdAt: string | null;
}

function ArchiveContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'ALL';
    const [selectedCategory, setSelectedCategory] = useState(initialCategory.toUpperCase());
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce search query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API State
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Artifacts from API
    useEffect(() => {
        const fetchArtifacts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build URL with optional category filter AND search query
                const params = new URLSearchParams();
                if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
                if (debouncedSearchQuery) params.append('q', debouncedSearchQuery);

                const queryString = params.toString();
                const url = `${API_URL}/api/chiang-rai/artifacts${queryString ? `?${queryString}` : ''}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch artifacts');

                const data = await res.json();
                setArtifacts(data);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchArtifacts();
    }, [selectedCategory, debouncedSearchQuery]); // Re-fetch when category or query changes

    // No client-side filtering needed anymore
    const filteredArtifacts = artifacts;

    // Format Date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Page Header - Chiang Rai Purple */}
            <div className="bg-[#581c87] text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-3 text-orange-400 mb-4 font-bold tracking-widest uppercase text-xs">
                        <div className="w-8 h-px bg-orange-500"></div>
                        Digital Archive
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">คลังข้อมูลดิจิทัล</h1>
                    <p className="text-purple-200/70 text-lg font-light max-w-2xl">
                        แหล่งรวบรวมและสืบค้นองค์ความรู้อัตลักษณ์เชียงราย 5 มิติ เพื่อการศึกษาและอนุรักษ์
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar - Sticky with blur */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">

                        {/* Category Tabs */}
                        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2
                                        ${selectedCategory === cat.id
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 -translate-y-0.5'
                                            : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}
                                    `}
                                >
                                    {cat.id !== 'ALL' && <cat.icon size={16} />}
                                    {cat.title}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full lg:w-80">
                            <input
                                type="text"
                                placeholder="ค้นหาข้อมูลอัตลักษณ์..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-purple-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-purple-50/50 transition-all font-medium text-purple-900 placeholder:text-purple-300"
                            />
                            <Search className="absolute left-4 top-3.5 text-purple-400" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="container mx-auto px-4 py-16">

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-orange-500 animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-orange-100 border-b-purple-500 animate-spin-slow"></div>
                        </div>
                        <p className="mt-8 text-purple-400 font-bold tracking-widest uppercase text-xs">กำลังสืบค้นข้อมูล...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-24 bg-rose-50 rounded-3xl border border-rose-100 max-w-2xl mx-auto px-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="text-rose-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-rose-900 mb-2">เกิดข้อผิดพลาดในการโหลด</h3>
                        <p className="text-rose-600/70 mb-8">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                )}

                {/* Data Grid */}
                {!loading && !error && filteredArtifacts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredArtifacts.map((item, idx) => (
                            <Link
                                key={item.id}
                                href={`/chiang-rai-studies/archive/${item.id}`}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-purple-50 flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {/* Thumbnail */}
                                <div className="h-60 overflow-hidden relative bg-purple-50">
                                    <div className="absolute inset-0 bg-[#2e1065]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                    <img
                                        src={item.thumbnailUrl || 'https://placehold.co/800x600/702963/white?text=Chiang+Rai+Identity'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-purple-900 shadow-sm z-20 uppercase tracking-widest border border-purple-100">
                                        {categories.find(c => c.id === item.category)?.title || 'ทั่วไป'}
                                    </div>
                                    {/* Media count badge */}
                                    {item.mediaUrls && item.mediaUrls.length > 0 && (
                                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold z-20">
                                            <Images size={14} />
                                            <span>{item.mediaUrls.length} Galleries</span>
                                        </div>
                                    )}
                                    {/* Media preview strip */}
                                    {item.mediaUrls && item.mediaUrls.filter(u => !u.includes('youtube.com')).length > 1 && (
                                        <div className="absolute bottom-4 right-4 flex -space-x-2 z-20">
                                            {item.mediaUrls.filter(u => !u.includes('youtube.com')).slice(0, 3).map((url, i) => (
                                                <div key={i} className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden shadow-md">
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {item.mediaUrls.filter(u => !u.includes('youtube.com')).length > 3 && (
                                                <div className="w-8 h-8 rounded-lg border-2 border-white bg-purple-900/80 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                                                    +{item.mediaUrls.filter(u => !u.includes('youtube.com')).length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-8 flex flex-col flex-grow relative">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-[#2e1065] mb-3 group-hover:text-orange-600 transition duration-300 line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>
                                        <div className="w-12 h-0.5 bg-orange-100 group-hover:w-24 group-hover:bg-orange-500 transition-all duration-500"></div>
                                    </div>

                                    <p className="text-purple-900/40 text-sm line-clamp-3 mb-6 font-light leading-relaxed flex-grow">
                                        {item.description || 'ไม่มีรายละเอียดเพิ่มเติมสำหรับรายการนี้'}
                                    </p>

                                    {/* Media type indicators */}
                                    {item.mediaUrls && item.mediaUrls.length > 0 && (
                                        <div className="flex items-center gap-2 mb-6">
                                            {item.mediaUrls.some(u => !u.includes('youtube.com')) && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-500 bg-purple-50 px-2.5 py-1 rounded-full">
                                                    <ImageIcon size={11} /> รูปภาพ
                                                </span>
                                            )}
                                            {item.mediaUrls.some(u => u.includes('youtube.com')) && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                                                    <Film size={11} /> วิดีโอ
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-purple-300 border-t border-purple-50 pt-6 mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-100"></div>
                                            {formatDate(item.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1 text-orange-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                            VIEW DETAILS <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredArtifacts.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-purple-100 max-w-4xl mx-auto px-10">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search className="text-purple-100" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">ไม่พบข้อมูลที่กำลังสืบค้น</h3>
                        <p className="text-purple-400 font-light text-lg mb-8 max-w-md mx-auto">
                            {searchQuery
                                ? `ดูเหมือนว่าจะไม่มีข้อมูลที่ตรงกับคำว่า "${searchQuery}" ในขณะนี้`
                                : 'ขณะนี้คลังข้อมูลในหมวดหมู่นี้ยังไม่มีรายการจัดแสดง'}
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                            className="px-8 py-3 bg-purple-50 text-purple-600 rounded-full font-bold hover:bg-purple-900 hover:text-white transition-all border border-purple-100"
                        >
                            แสดงข้อมูลทั้งหมด
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function ArchivePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF5FF] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
        }>
            <ArchiveContent />
        </Suspense>
    );
}
