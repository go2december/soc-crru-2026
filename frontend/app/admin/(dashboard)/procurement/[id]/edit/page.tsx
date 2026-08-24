'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProcurementForm from '../../ProcurementForm';
import { ProcurementRecord } from '@/lib/procurement';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditProcurementPage(props: Props) {
  const resolvedParams = use(props.params);
  const router = useRouter();
  const [data, setData] = useState<ProcurementRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      try {
        const res = await fetch(`${API_URL}/api/procurement/${resolvedParams.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            toast.error('ไม่พบรายการที่ต้องการแก้ไข');
            router.push('/admin/procurement');
            return;
          }
          throw new Error('Failed to load item');
        }

        const item = await res.json();
        setData(item);
      } catch (err) {
        console.error(err);
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs">กำลังโหลดข้อมูลโครงการ...</p>
      </div>
    );
  }

  if (!data) return notFound();

  return <ProcurementForm initialData={data} isEdit={true} />;
}
