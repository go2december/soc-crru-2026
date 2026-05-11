'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AcademicServiceForm from '../../AcademicServiceForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EditAcademicServicePage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const res = await fetch(`${API_URL}/api/academic-services/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInitialData(data);
        } else {
          alert('ไม่พบข้อมูลบริการวิชาการ');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/admin/academic-services">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">แก้ไขข้อมูลบริการวิชาการ</h1>
          <p className="text-sm text-muted-foreground">
            แก้ไขรายละเอียดโครงการหรือกิจกรรม
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      ) : initialData ? (
        <AcademicServiceForm initialData={initialData} />
      ) : (
        <div className="text-center text-red-500 py-12">ไม่พบข้อมูล กรุณาลองใหม่อีกครั้ง</div>
      )}
    </div>
  );
}
