'use client';

import { useEffect, useState } from 'react';

interface News {
    id: string;
    title: string;
    category: 'NEWS' | 'EVENT' | 'ANNOUNCE';
    publishedAt: string;
    isPublished: boolean;
}

export default function AdminNewsPage() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        try {
            const res = await fetch(`${apiUrl}/api/news`);
            if (res.ok) {
                const data = await res.json();
                setNewsList(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNews = async (id: string) => {
        if (!confirm('ยืนยันลบข่าวนี้?')) return;
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/news/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchNews();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">📰 จัดการข่าวสาร</h1>
                <a href="/admin/news/create" className="btn btn-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    สร้างข่าวใหม่
                </a>
            </div>

            <div className="card bg-base-100 shadow">
                <div className="card-body p-0">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>หัวข้อข่าว</th>
                                <th>หมวดหมู่</th>
                                <th>วันที่เผยแพร่</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList.map((item) => (
                                <tr key={item.id}>
                                    <td className="font-medium">{item.title}</td>
                                    <td>
                                        <span className={`badge badge-sm ${item.category === 'NEWS' ? 'badge-primary' :
                                                item.category === 'EVENT' ? 'badge-secondary' : 'badge-accent'
                                            }`}>{item.category}</span>
                                    </td>
                                    <td className="text-sm opacity-70">
                                        {new Date(item.publishedAt).toLocaleDateString('th-TH')}
                                    </td>
                                    <td>
                                        {item.isPublished ?
                                            <span className="text-success text-xs">● เผยแพร่แล้ว</span> :
                                            <span className="text-warning text-xs">● ร่าง</span>
                                        }
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <a href={`/admin/news/edit/${item.id}`} className="btn btn-xs btn-ghost">✏️ แก้ไข</a>
                                            <button onClick={() => deleteNews(item.id)} className="btn btn-xs btn-ghost text-error">🗑️ ลบ</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {newsList.length === 0 && (
                        <div className="text-center py-10 opacity-60">ยังไม่มีข่าวสารในระบบ</div>
                    )}
                </div>
            </div>
        </div>
    );
}
