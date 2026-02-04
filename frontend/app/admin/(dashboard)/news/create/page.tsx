'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewsForm from '../components/NewsForm';

export default function CreateNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
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
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/admin/news');
            } else {
                alert('เกิดข้อผิดพลาดในการสร้างข่าว');
            }
        } catch (error) {
            console.error(error);
            alert('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <NewsForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
