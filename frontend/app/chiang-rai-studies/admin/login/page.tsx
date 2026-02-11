
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, ArrowLeft, Info, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChiangRaiAdminLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [apiUrl, setApiUrl] = useState<string>('');

    useEffect(() => {
        // Set API URL from environment
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        setApiUrl(url);

        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }

        // ถ้ามี token แล้ว redirect ไป dashboard
        const token = localStorage.getItem('admin_token');
        if (token) {
            router.push('/chiang-rai-studies/admin');
        }
    }, [searchParams, router]);

    const handleGoogleLogin = () => {
        // Set redirect target for callback page
        localStorage.setItem('redirect_after_login', '/chiang-rai-studies/admin');
        window.location.href = `${apiUrl}/api/auth/google`;
    };

    const handleDevLogin = () => {
        // Set redirect target for callback page
        localStorage.setItem('redirect_after_login', '/chiang-rai-studies/admin');
        window.location.href = `${apiUrl}/api/auth/dev/login`;
    };

    return (
        <div className="min-h-screen bg-[#faf5ff] flex items-center justify-center p-4 relative overflow-hidden font-kanit">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

            <Card className="w-full max-w-md shadow-2xl border-purple-100 bg-white/90 backdrop-blur-md relative z-10">
                <CardHeader className="space-y-1 items-center text-center pb-8 pt-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2e1065] to-purple-800 flex items-center justify-center mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-3xl font-black text-white">CR</span>
                    </div>
                    <CardTitle className="text-2xl font-black text-[#2e1065]">
                        Chiang Rai Admin
                    </CardTitle>
                    <CardDescription className="text-purple-400 font-light">
                        ระบบจัดการศูนย์เชียงรายศึกษา
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Notice */}
                    <div className="bg-purple-50 text-purple-700 text-sm p-4 rounded-xl flex items-start gap-3 border border-purple-100">
                        <Info className="w-5 h-5 mt-0.5 shrink-0 text-purple-500" />
                        <span className="leading-relaxed font-light">
                            กรุณาเข้าสู่ระบบด้วยบัญชี Google องค์กร <strong>(@crru.ac.th)</strong> เท่านั้น
                        </span>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full h-12 text-base font-bold bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm relative overflow-hidden group rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
                        variant="outline"
                    >
                        <div className="absolute inset-0 w-1 bg-blue-500 group-hover:w-full transition-all duration-300 opacity-5" />
                        <div className="flex items-center gap-3 relative z-10">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            เข้าสู่ระบบด้วย Google
                        </div>
                    </Button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-purple-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-3 text-purple-300 font-bold">
                                For Developers
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleDevLogin}
                        variant="ghost"
                        size="sm"
                        className="w-full text-orange-400 hover:text-orange-600 hover:bg-orange-50 font-medium tracking-wide"
                    >
                        <Lock className="w-3 h-3 mr-2" /> Developer Bypass
                    </Button>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 border-t border-purple-50 bg-purple-50/30 pt-6 pb-8">
                    <Link
                        href="/chiang-rai-studies"
                        className="flex items-center justify-center gap-2 text-sm text-stone-400 hover:text-[#2e1065] transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับสู่หน้าหลักศูนย์เชียงรายศึกษา
                    </Link>
                </CardFooter>
            </Card>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
}
