'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NewsForm from '../../NewsForm';
import { FacultyNewsItem } from '@/lib/faculty-news';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newsItem, setNewsItem] = useState<FacultyNewsItem | null>(null);

  const id = params.id as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      try {
        const res = await fetch(`${apiUrl}/api/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          alert('ไม่พบข้อมูลข่าวสาร');
          router.push('/admin/news');
          return;
        }

        const data = await res.json();
        setNewsItem(data);
      } catch (error) {
        console.error(error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลข่าว');
        router.push('/admin/news');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [apiUrl, id, router]);

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    category: 'NEWS' | 'EVENT' | 'ANNOUNCE' | 'JOB';
    thumbnailUrl: string;
    mediaUrls: string[];
    attachments: { originalName: string; fileUrl: string; mimeType?: string; size?: number }[];
    isPublished: boolean;
  }) => {
    setSubmitting(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${apiUrl}/api/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/news');
      } else {
        alert('เกิดข้อผิดพลาดในการแก้ไขข่าว');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข่าว');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return <NewsForm mode="edit" initialData={newsItem} onSubmit={handleSubmit} submitting={submitting} />;
}
