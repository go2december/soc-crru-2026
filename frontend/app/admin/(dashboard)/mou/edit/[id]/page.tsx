'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MouForm from '../../MouForm';
import { MouItem } from '@/lib/mous';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EditMouPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [item, setItem] = useState<MouItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mous/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else {
          toast.error('ไม่พบข้อมูล MOU ที่ต้องการแก้ไข');
          router.push('/admin/mou');
        }
      } catch (err) {
        console.error(err);
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, router]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-scholar-accent" />
        <p className="text-sm">กำลังโหลดข้อมูล MOU...</p>
      </div>
    );
  }

  if (!item) return null;

  return <MouForm initialData={item} />;
}
