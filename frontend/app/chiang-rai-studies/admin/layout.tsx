
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Image,
    LogOut,
    Menu,
    ChevronLeft,
    ExternalLink,
    ShieldCheck,
    ScrollText,
    Settings
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Kanit } from 'next/font/google';
import { ChiangRaiAdminContext } from './context';

// Use same font as public site
const kanit = Kanit({
    weight: ['300', '400', '500', '700'],
    subsets: ['thai', 'latin'],
    variable: '--font-kanit',
    display: 'swap',
});

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    roles: string[];
}

export default function ChiangRaiAdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isLoginPage = pathname === '/chiang-rai-studies/admin/login';
    const isCallbackPage = pathname === '/chiang-rai-studies/admin/callback';
    const isPublicPage = isLoginPage || isCallbackPage;

    // 1. Auth Logic - Skip for login page
    // 1. Auth Logic - Skip for login page
    useEffect(() => {
        // Strong guard clause against public pages to prevent unnecessary fetches
        if (pathname?.includes('/login') || pathname?.includes('/callback')) {
            setLoading(false);
            return;
        }

        const checkAuth = async (retries = 3) => {
            const token = localStorage.getItem('admin_token');

            if (!token) {
                // Redirect if no token found on protected route
                router.push(`/chiang-rai-studies/admin/login?redirect=${encodeURIComponent(pathname)}`);
                setLoading(false);
                return;
            }

            try {
                // Use relative path '/api/auth/profile' to prevent localhost/container network issues
                // Add AbortSignal for timeout safety
                const res = await fetch('/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: AbortSignal.timeout(5000)
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        // Invalid token -> Logout
                        console.warn('Token expired or invalid');
                        localStorage.removeItem('admin_token');
                        router.push('/chiang-rai-studies/admin/login');
                        setLoading(false);
                        return;
                    }
                    // Server error -> Retry
                    throw new Error(`Server error: ${res.status}`);
                }

                const userData = await res.json();
                setUser(userData);
                setLoading(false);
            } catch (error: any) {
                // Silent retry logic
                if (retries > 0 && error.name !== 'AbortError' && error.message !== 'Invalid token') {
                    console.log(`Auth retry ${(3 - retries) + 1}...`);
                    setTimeout(() => checkAuth(retries - 1), 2000);
                } else {
                    console.error("Auth Final Error:", error);
                    localStorage.removeItem('admin_token');
                    router.push('/chiang-rai-studies/admin/login');
                    setLoading(false);
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/chiang-rai-studies/admin/login');
    };

    // 2. Menu Definitions (Chiang Rai Specific)
    const menuGroups = [
        {
            title: 'Overview',
            items: [
                { href: '/chiang-rai-studies/admin', label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Database Management',
            items: [
                { href: '/chiang-rai-studies/admin/staff', label: 'จัดการบุคลากร', icon: Users },
                { href: '/chiang-rai-studies/admin/artifacts', label: 'คลังข้อมูล 5 อัตลักษณ์', icon: Image },
                { href: '/chiang-rai-studies/admin/articles', label: 'บทความวิชาการ', icon: BookOpen },
                { href: '/chiang-rai-studies/admin/activities', label: 'กิจกรรม/ข่าวสาร', icon: ScrollText },
            ]
        },
        {
            title: 'System',
            items: [
                { href: '/admin/dashboard', label: 'กลับสู่ Admin คณะ', icon: ChevronLeft },
            ]
        }
    ];

    // Login/Callback pages: render directly without admin shell
    if (isPublicPage) {
        return <div className={`${kanit.variable} font-kanit`}>{children}</div>;
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-[#faf5ff] ${kanit.variable} font-kanit`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-800 animate-spin"></div>
                    <p className="text-purple-800 font-bold animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`min-h-screen bg-[#faf5ff] flex text-stone-900 ${kanit.variable} font-kanit`}>
            {/* Sidebar - Chiang Rai Theme (Purple) */}
            <aside
                className={cn(
                    "fixed h-full z-40 bg-[#2e1065] text-purple-100 border-r border-purple-900 transition-all duration-300 ease-in-out flex flex-col shadow-xl",
                    sidebarOpen ? "w-64" : "w-[70px]"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-4 border-b border-purple-800/50 bg-[#2e1065]">
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                        <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                            CR
                        </div>
                        <div className={cn(
                            "transition-opacity duration-300 whitespace-nowrap",
                            sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                        )}>
                            <p className="font-bold text-sm tracking-tight text-white">Chiang Rai Admin</p>
                            <p className="text-[10px] text-orange-400 uppercase tracking-wider">Studies Center</p>
                        </div>
                    </div>
                </div>

                {/* Menu Section */}
                <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-transparent">
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            {sidebarOpen && (
                                <h3 className="px-3 text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">
                                    {group.title}
                                </h3>
                            )}
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (item.href !== '/chiang-rai-studies/admin' && pathname?.startsWith(`${item.href}/`));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-purple-800 text-white shadow-md border border-purple-700"
                                                : "text-purple-300 hover:bg-purple-900/50 hover:text-white",
                                            !sidebarOpen && "justify-center px-0 h-10 w-10 mx-auto"
                                        )}
                                        title={!sidebarOpen ? item.label : undefined}
                                    >
                                        <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-orange-400")} />

                                        {sidebarOpen && <span>{item.label}</span>}

                                        {!sidebarOpen && isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-purple-900/50 mt-auto bg-[#240a50]">
                    <div className={cn(
                        "flex items-center gap-3 transition-all duration-300",
                        !sidebarOpen && "justify-center flex-col gap-1"
                    )}>
                        <div className="relative shrink-0">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500 shadow-sm" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-500 shadow-sm">
                                    {user.name?.charAt(0) || 'A'}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#240a50]" />
                        </div>

                        {sidebarOpen && (
                            <div className="overflow-hidden min-w-0 flex-1">
                                <p className="text-sm font-bold truncate text-white">{user.name}</p>
                                <p className="text-xs text-purple-400 truncate">Admin Access</p>
                            </div>
                        )}

                        {sidebarOpen && (
                            <button
                                onClick={handleLogout}
                                className="text-purple-400 hover:text-red-400 transition-colors p-1"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out",
                sidebarOpen ? "ml-64" : "ml-[70px]"
            )}>
                {/* Top Navbar */}
                <header className="h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-purple-800 hover:bg-purple-50"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>

                        <div className="hidden sm:flex items-center gap-2 text-sm text-stone-500">
                            <span className="font-bold text-purple-900">Chiang Rai Admin</span>
                            <span>/</span>
                            <span className="text-stone-800">Console</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/chiang-rai-studies"
                            target="_blank"
                            className="flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-orange-600 transition-colors px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>ดูหน้าเว็บไซต์</span>
                        </a>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
                    <ChiangRaiAdminContext.Provider value={{ user }}>
                        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
                            {children}
                        </div>
                    </ChiangRaiAdminContext.Provider>
                </main>
            </div>
        </div>
    );
}
