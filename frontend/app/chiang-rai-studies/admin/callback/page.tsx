'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const redirectParam = searchParams.get('redirect');

        // Check LocalStorage for redirect intent (set by login pages)
        const storedRedirect = localStorage.getItem('redirect_after_login');

        // Determine destination: Param > Storage > Default
        const destination = redirectParam || storedRedirect || '/chiang-rai-studies/admin';

        if (token) {
            // เก็บ token ใน localStorage
            localStorage.setItem('admin_token', token);

            // Clear stored redirect intent
            localStorage.removeItem('redirect_after_login');

            // Redirect ไปยังหน้าที่ต้องการ
            router.push(destination);
        } else {
            // ถ้าไม่มี token redirect กลับ login
            router.push('/chiang-rai-studies/admin/login?error=Token not found');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf5ff] font-kanit p-4">
            <Card className="w-full max-w-md border-purple-100 shadow-lg">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-800 animate-spin" />
                    <p className="text-lg font-bold text-purple-800">กำลังยืนยันตัวตน...</p>
                    <p className="mt-2 text-sm text-purple-500">กรุณารอสักครู่ ระบบกำลังนำท่านไปยังหน้าจัดการ</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ChiangRaiAdminCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#faf5ff]">
                <div className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-800 animate-spin"></div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
