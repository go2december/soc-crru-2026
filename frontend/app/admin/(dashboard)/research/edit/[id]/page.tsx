'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResearchForm, { ResearchFormValues } from '../../ResearchForm';
import { ResearchProjectDetail } from '@/lib/research';

export default function EditResearchPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<ResearchProjectDetail | null>(null);

  const id = params.id as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      try {
        const res = await fetch(`${apiUrl}/api/research/admin/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          alert('ไม่พบข้อมูลโครงการวิจัย');
          router.push('/admin/research');
          return;
        }

        const data = (await res.json()) as ResearchProjectDetail;
        setProject(data);
      } catch (error) {
        console.error(error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการวิจัย');
        router.push('/admin/research');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [apiUrl, id, router]);

  const handleSubmit = async (formData: ResearchFormValues) => {
    setSubmitting(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${apiUrl}/api/research/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(errorText);
        alert('เกิดข้อผิดพลาดในการแก้ไขโครงการวิจัย');
        return;
      }

      router.push('/admin/research');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการแก้ไขโครงการวิจัย');
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

  return <ResearchForm key={project?.id || 'edit-research'} mode="edit" initialData={project} onSubmit={handleSubmit} submitting={submitting} />;
}
