'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Loader2, BookOpen, Eye } from 'lucide-react';

interface LearningSite {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string | null;
    author: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
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

export default function AdminLearningSitesPage() {
    const [learningSites, setLearningSites] = useState<LearningSite[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLearningSites();
    }, []);

    const fetchLearningSites = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/chiang-rai/learning-sites?limit=100`);
            if (res.ok) {
                const data = await res.json();
                setLearningSites(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching learning sites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบบทความนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/chiang-rai/learning-sites/${id}`, { method: 'DELETE' });
            if (res.ok) setLearningSites(prev => prev.filter(item => item.id !== id));
            else alert('เกิดข้อผิดพลาดในการลบบทความ');
        } catch (error) {
            console.error('Error deleting learning site:', error);
            alert('เกิดข้อผิดพลาดในการลบบทความ');
        }
    };

    const filteredSites = learningSites.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (<div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-600" size={32} /></div>);
    }

    return (
        <div className="space-y-6 animate-fade-in font-kanit">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">จัดการแหล่งเรียนรู้ทางวัฒนธรรม</h1>
                    <p className="text-stone-500 text-sm">Cultural Learning Sites Management</p>
                </div>
                <Link href="/chiang-rai-studies/admin/learning-sites/create" className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm">
                    <Plus size={18} /> เพิ่มแหล่งเรียนรู้ใหม่
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input type="text" placeholder="ค้นหาตามชื่อเรื่อง หรือ ผู้เขียน..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ชื่อเรื่อง</th>
                                <th className="p-4 font-semibold">ผู้เขียน</th>
                                <th className="p-4 font-semibold">สถานะ</th>
                                <th className="p-4 font-semibold">วันที่เผยแพร่</th>
                                <th className="p-4 font-semibold text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredSites.length > 0 ? (
                                filteredSites.map((item) => (
                                    <tr key={item.id} className="hover:bg-purple-50/30 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-400 flex-shrink-0">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-stone-800 truncate max-w-xs">{item.title}</p>
                                                    <p className="text-xs text-stone-400 truncate max-w-xs">/{item.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-stone-500 text-sm">{item.author || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isPublished !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                                                {item.isPublished !== false ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-500 text-sm">
                                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('th-TH') : '-'}
                                        </td>
                                        <td className="p-4 text-right space-x-1">
                                            <Link href={`/chiang-rai-studies/learning-sites/${item.slug}`} target="_blank" className="inline-flex p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="ดูหน้าเว็บ">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/chiang-rai-studies/admin/learning-sites/edit/${item.id}`} className="inline-flex p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="แก้ไข">
                                                <Pencil size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="inline-flex p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="ลบ">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="p-8 text-center text-stone-400">{searchQuery ? 'ไม่พบผลลัพธ์ที่ค้นหา' : 'ยังไม่มีแหล่งเรียนรู้'}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
