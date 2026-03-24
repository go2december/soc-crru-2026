'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewsForm from '../NewsForm';

export default function CreateNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: {
        title: string;
        content: string;
        category: 'NEWS' | 'EVENT' | 'ANNOUNCE' | 'JOB';
        thumbnailUrl: string;
        mediaUrls: string[];
        attachments: { originalName: string; fileUrl: string; mimeType?: string; size?: number }[];
        isPublished: boolean;
    }) => {
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

    return <NewsForm mode="create" onSubmit={handleSubmit} submitting={loading} />;
}
