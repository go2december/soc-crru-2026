'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Newspaper, Plus } from 'lucide-react';

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

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
            <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold"><Newspaper className="h-7 w-7 text-primary" />เขียนข่าวใหม่</h1>
                <p className="text-sm text-muted-foreground">สร้างข่าว กิจกรรม หรือประกาศสำหรับหน้าเว็บไซต์คณะ</p>
            </div>

            <Card className="border-border/70 shadow-sm">
                <CardContent className="space-y-4 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">หัวข้อข่าว</label>
                        <Input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">หมวดหมู่</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="NEWS">ข่าวประชาสัมพันธ์</option>
                            <option value="EVENT">กิจกรรม</option>
                            <option value="ANNOUNCE">ประกาศ</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">รูปภาพปก (URL)</label>
                        <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.thumbnailUrl}
                            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">เนื้อหาข่าว</label>
                        <Textarea
                            className="min-h-40"
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button asChild type="button" variant="ghost">
                            <Link href="/admin/news">ยกเลิก</Link>
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            <Plus className="h-4 w-4" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข่าว'}
                        </Button>
                    </div>
                </form>
                </CardContent>
            </Card>
        </div>
    );
}
