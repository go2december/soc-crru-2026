
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Printer, AlertTriangle, ScrollText, Landmark } from 'lucide-react';
import { notFound } from 'next/navigation';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

// Type Definition
interface Artifact {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    category: string | null;
    thumbnailUrl: string | null;
    mediaUrl: string | null;
    author: string | null;
    createdAt: string | null;
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
        const res = await fetch(`${API_URL}/chiang-rai/artifacts/${id}`, {
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

export default async function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const artifact = await getArtifact(id);

    if (!artifact) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-32 font-kanit">
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
                            <button className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold group">
                                <Share2 size={18} className="group-hover:rotate-12 transition-transform" /> Share
                            </button>
                            <button className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold group">
                                <Printer size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cover Image / Media Section */}
                <div className="relative mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/20 to-transparent"></div>
                    <img
                        src={artifact.thumbnailUrl || artifact.mediaUrl || 'https://placehold.co/1200x700/702963/white?text=Artifact+Display'}
                        alt={artifact.title}
                        className="w-full h-auto object-cover max-h-[700px]"
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
