'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResearchForm, { ResearchFormValues } from '../ResearchForm';

export default function CreateResearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: ResearchFormValues) => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      const res = await fetch(`${apiUrl}/api/research/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(errorText);
        alert('เกิดข้อผิดพลาดในการสร้างโครงการวิจัย');
        return;
      }

      router.push('/admin/research');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการสร้างโครงการวิจัย');
    } finally {
      setLoading(false);
    }
  };

  return <ResearchForm mode="create" onSubmit={handleSubmit} submitting={loading} />;
}
