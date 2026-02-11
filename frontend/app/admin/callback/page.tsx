
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const redirectParam = searchParams.get('redirect');

        // Check LocalStorage for redirect intent (set by login pages)
        const storedRedirect = localStorage.getItem('redirect_after_login');

        // Determine destination: Param > Storage > Default
        const destination = redirectParam || storedRedirect || '/admin/dashboard';

        if (token) {
            // เก็บ token ใน localStorage
            localStorage.setItem('admin_token', token);

            // Clear stored redirect intent
            localStorage.removeItem('redirect_after_login');

            // Redirect ไปยังหน้าที่ต้องการ
            router.push(destination);
        } else {
            // ถ้าไม่มี token redirect กลับ login
            router.push('/admin/login?error=Token not found');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-purple-50">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <p className="text-lg font-bold text-gray-800">กำลังยืนยันตัวตน...</p>
                <p className="text-sm text-gray-500 mt-2">กรุณารอสักครู่ ระบบกำลังนำท่านไปยังหน้าจัดการ</p>
            </div>
        </div>
    );
}

export default function AdminCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
