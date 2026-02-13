'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Artifact {
    id: string;
    title: string;
    category: string;
    author: string | null;
    createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    HISTORY: 'ประวัติศาสตร์',
    ARCHAEOLOGY: 'โบราณคดี',
    CULTURE: 'ประเพณี/ชาติพันธุ์',
    ARTS: 'ศิลปะการแสดง',
    WISDOM: 'ภูมิปัญญาท้องถิ่น',
};

export default function AdminArtifactsPage() {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchArtifacts();
    }, []);

    const fetchArtifacts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'}/api/chiang-rai/artifacts`);
            if (res.ok) {
                const data = await res.json();
                setArtifacts(data);
            }
        } catch (error) {
            console.error('Error fetching artifacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้')) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'}/api/chiang-rai/artifacts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setArtifacts(prev => prev.filter(item => item.id !== id));
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('Error deleting artifact:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    const filteredArtifacts = artifacts.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in font-kanit">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">จัดการคลังข้อมูลดิจิทัล</h1>
                    <p className="text-stone-500 text-sm">Digital Archive Management</p>
                </div>
                <Link
                    href="/chiang-rai-studies/admin/artifacts/create"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                    <Plus size={18} /> เพิ่มรายการใหม่
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                    type="text"
                    placeholder="ค้นหาตามชื่อ หรือ ผู้บันทึก..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ชื่อรายการ</th>
                                <th className="p-4 font-semibold">หมวดหมู่</th>
                                <th className="p-4 font-semibold">ผู้บันทึก</th>
                                <th className="p-4 font-semibold">วันที่สร้าง</th>
                                <th className="p-4 font-semibold text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredArtifacts.length > 0 ? (
                                filteredArtifacts.map((item) => (
                                    <tr key={item.id} className="hover:bg-purple-50/30 transition">
                                        <td className="p-4 font-medium text-stone-800">{item.title}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                ${item.category === 'HISTORY' ? 'bg-amber-100 text-amber-700' :
                                                    item.category === 'ARCHAEOLOGY' ? 'bg-stone-100 text-stone-700' :
                                                        item.category === 'CULTURE' ? 'bg-pink-100 text-pink-700' :
                                                            item.category === 'ARTS' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-teal-100 text-teal-700'
                                                }`}
                                            >
                                                {CATEGORY_LABELS[item.category] || item.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-500 text-sm">{item.author || '-'}</td>
                                        <td className="p-4 text-stone-500 text-sm">
                                            {new Date(item.createdAt).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link
                                                href={`/chiang-rai-studies/admin/artifacts/edit/${item.id}`}
                                                className="inline-flex p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                title="แก้ไข"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="ลบ"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-400">
                                        {searchQuery ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลในระบบ'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
