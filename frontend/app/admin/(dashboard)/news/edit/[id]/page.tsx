'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NewsForm from '../../components/NewsForm';
import { Loader2 } from "lucide-react";

export default function EditNewsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        if (id) fetchNewsDetail(id);
    }, [id]);

    const fetchNewsDetail = async (newsId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        try {
            const res = await fetch(`${apiUrl}/api/news/${newsId}`);
            if (res.ok) {
                const data = await res.json();
                setInitialData(data);
            } else {
                alert('ไม่พบข้อมูลข่าว');
                router.push('/admin/news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/news/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/admin/news');
            } else {
                alert('เกิดข้อผิดพลาดในการแก้ไขข่าว');
            }
        } catch (error) {
            console.error(error);
            alert('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">กำลังโหลดข้อมูลข่าว...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <NewsForm
                initialData={initialData}
                id={id}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
