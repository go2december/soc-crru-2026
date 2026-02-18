'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Loader2, Filter, Star, Calendar, Megaphone, Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Activity {
    id: string;
    title: string;
    slug: string;
    type: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT';
    description: string | null;
    author: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    eventDate: string | null;
    location: string | null;
    publishedAt: string;
    createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    NEWS: { label: 'ข่าวสาร', color: 'bg-blue-100 text-blue-700', icon: Newspaper },
    EVENT: { label: 'กิจกรรม', color: 'bg-purple-100 text-purple-700', icon: Calendar },
    ANNOUNCEMENT: { label: 'ประกาศ', color: 'bg-amber-100 text-amber-700', icon: Megaphone },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');
    const router = useRouter();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/activities?limit=100`);
            if (res.ok) {
                const json = await res.json();
                setActivities(json.data || []);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้')) return;

        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/activities/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setActivities(prev => prev.filter(item => item.id !== id));
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    const filteredActivities = activities.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'ALL' || item.type === filterType;
        return matchesSearch && matchesType;
    });

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
                    <h1 className="text-2xl font-bold text-stone-800">จัดการกิจกรรม/ข่าวสาร</h1>
                    <p className="text-stone-500 text-sm">Activities & News Management</p>
                </div>
                <Link
                    href="/chiang-rai-studies/admin/activities/create"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                    <Plus size={18} /> เพิ่มรายการใหม่
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาตามชื่อ, ผู้เขียน, สถานที่..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-stone-400" />
                    {['ALL', 'NEWS', 'EVENT', 'ANNOUNCEMENT'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${filterType === type
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            {type === 'ALL' ? 'ทั้งหมด' : TYPE_CONFIG[type]?.label || type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ชื่อรายการ</th>
                                <th className="p-4 font-semibold">ประเภท</th>
                                <th className="p-4 font-semibold">สถานะ</th>
                                <th className="p-4 font-semibold">ผู้เขียน</th>
                                <th className="p-4 font-semibold">วันที่เผยแพร่</th>
                                <th className="p-4 font-semibold text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map((item) => {
                                    const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.NEWS;
                                    const TypeIcon = typeConfig.icon;
                                    return (
                                        <tr key={item.id} className="hover:bg-purple-50/30 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {item.isFeatured && (
                                                        <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                                                    )}
                                                    <span className="font-medium text-stone-800 line-clamp-1">{item.title}</span>
                                                </div>
                                                {item.type === 'EVENT' && item.eventDate && (
                                                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                                                        <Calendar size={10} />
                                                        {new Date(item.eventDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        {item.location && ` • ${item.location}`}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${typeConfig.color}`}>
                                                    <TypeIcon size={12} />
                                                    {typeConfig.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {item.isPublished ? (
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">เผยแพร่</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold">ฉบับร่าง</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-stone-500 text-sm">{item.author || '-'}</td>
                                            <td className="p-4 text-stone-500 text-sm">
                                                {item.publishedAt
                                                    ? new Date(item.publishedAt).toLocaleDateString('th-TH')
                                                    : '-'}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Link
                                                    href={`/chiang-rai-studies/admin/activities/edit/${item.id}`}
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
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-stone-400">
                                        {searchQuery || filterType !== 'ALL' ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลในระบบ'}
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
