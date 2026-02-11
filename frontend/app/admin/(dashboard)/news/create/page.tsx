'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'NEWS',
        thumbnailUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/news');
            } else {
                alert('เกิดข้อผิดพลาดในการสร้างข่าว');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">✍️ เขียนข่าวใหม่</h1>

            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
                <div className="card-body space-y-4">
                    <div className="form-control">
                        <label className="label">หัวข้อข่าว</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">หมวดหมู่</label>
                        <select
                            className="select select-bordered w-full"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="NEWS">ข่าวประชาสัมพันธ์</option>
                            <option value="EVENT">กิจกรรม</option>
                            <option value="ANNOUNCE">ประกาศ</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">รูปภาพปก (URL)</label>
                        <input
                            type="url"
                            className="input input-bordered w-full"
                            placeholder="https://example.com/image.jpg"
                            value={formData.thumbnailUrl}
                            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">เนื้อหาข่าว</label>
                        <textarea
                            className="textarea textarea-bordered h-40"
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="card-actions justify-end mt-4">
                        <a href="/admin/news" className="btn btn-ghost">ยกเลิก</a>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'บันทึกข่าว'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
