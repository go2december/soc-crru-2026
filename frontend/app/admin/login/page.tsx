'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }

        // ถ้ามี token แล้ว redirect ไป dashboard
        const token = localStorage.getItem('admin_token');
        if (token) {
            router.push('/admin/dashboard');
        }
    }, [searchParams, router]);

    const handleGoogleLogin = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        window.location.href = `${apiUrl}/api/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-2xl w-full max-w-md">
                <div className="card-body items-center text-center">
                    {/* Logo & Title */}
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-primary">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm opacity-70 mt-2">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error mb-4 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Notice */}
                    <div className="alert alert-info mb-6 text-left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm">กรุณาเข้าสู่ระบบด้วยอีเมล <strong>@crru.ac.th</strong> เท่านั้น</span>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-lg w-full gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        เข้าสู่ระบบด้วย Google
                    </button>

                    {/* DEV MODE ONLY */}
                    <div className="divider my-4 text-xs opacity-50">Developer Mode</div>
                    <button
                        onClick={() => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                            window.location.href = `${apiUrl}/api/auth/dev/login`;
                        }}
                        className="btn btn-outline btn-warning w-full btn-sm"
                    >
                        🔑 Developer Login (Bypass)
                    </button>

                    {/* Back to Home */}
                    <div className="divider my-6">หรือ</div>
                    <a href="/" className="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                        </svg>
                        กลับหน้าหลัก
                    </a>
                </div>
            </div>
        </div>
    );
}
