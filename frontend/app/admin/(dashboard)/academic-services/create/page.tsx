import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AcademicServiceForm from '../AcademicServiceForm';

export default function CreateAcademicServicePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/admin/academic-services">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">เพิ่มโครงการบริการวิชาการ</h1>
          <p className="text-sm text-muted-foreground">
            สร้างข้อมูลโครงการหรือกิจกรรมบริการวิชาการใหม่
          </p>
        </div>
      </div>

      <AcademicServiceForm />
    </div>
  );
}
