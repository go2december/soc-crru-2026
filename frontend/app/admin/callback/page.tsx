'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // เก็บ token ใน localStorage
            localStorage.setItem('admin_token', token);

            // Redirect ไป Dashboard
            router.push('/admin/dashboard');
        } else {
            // ถ้าไม่มี token redirect กลับ login
            router.push('/admin/login?error=Token not found');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg">กำลังเข้าสู่ระบบ...</p>
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
