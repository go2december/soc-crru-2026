import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function ResearchDetailNotFound() {
  return (
    <div className="min-h-[70vh] bg-base-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-base-200 flex items-center justify-center text-primary">
          <SearchX className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            ไม่พบข้อมูลงานวิจัยที่คุณค้นหา
          </h1>
          <p className="text-base-content/70 leading-8">
            รายการนี้อาจถูกย้าย ลบออก หรือยังไม่ได้เผยแพร่บนหน้า public
            คุณสามารถกลับไปยังฐานข้อมูลงานวิจัยเพื่อค้นหารายการอื่นที่เกี่ยวข้องได้
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/research/database" className="btn bg-scholar-deep text-white hover:bg-scholar-deep/90 border-scholar-deep rounded-full px-6">
            <ArrowLeft className="h-4 w-4" />
            กลับไปฐานข้อมูลงานวิจัย
          </Link>
          <Link href="/research/services" className="btn btn-outline rounded-full px-6">
            ดูงานบริการวิชาการ
          </Link>
        </div>
      </div>
    </div>
  );
}
