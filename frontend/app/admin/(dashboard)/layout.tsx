'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Building2,
    Newspaper,
    GraduationCap,
    Settings,
    UserCircle,
    LogOut,
    Menu,
    ChevronLeft,
    ExternalLink,
    ShieldCheck,
    Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    roles: string[];
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');

            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const res = await fetch(`${apiUrl}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Invalid token');
                }

                const userData = await res.json();
                setUser(userData);
            } catch {
                localStorage.removeItem('admin_token');
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    };

    // กำหนดลำดับขั้นของสิทธิ์ (Hierarchy)
    const ROLE_LEVELS: Record<string, number> = {
        'ADMIN': 3,
        'EDITOR': 2,
        'STAFF': 1,
        'GUEST': 0
    };

    const getUserRoleLevel = (roles: string[] | undefined) => {
        if (!roles || roles.length === 0) return 0;
        return Math.max(...roles.map(r => ROLE_LEVELS[r] || 0));
    };

    const getPrimaryRole = (roles: string[] | undefined) => {
        const level = getUserRoleLevel(roles);
        if (level >= 3) return 'ADMIN';
        if (level >= 2) return 'EDITOR';
        if (level >= 1) return 'STAFF';
        return 'GUEST';
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'ผู้ดูแลระบบ';
            case 'EDITOR': return 'บรรณาธิการ';
            case 'STAFF': return 'บุคลากร';
            default: return 'ผู้เยี่ยมชม';
        }
    };

    // Menu Definitions (Grouped with Lucide Icons)
    const menuGroups = [
        {
            title: 'Overview',
            items: [
                { href: '/admin/dashboard', label: 'หน้าหลัก', icon: LayoutDashboard, minLevel: 1 },
            ]
        },
        {
            title: 'Organization',
            items: [
                { href: '/admin/staff', label: 'บุคลากร', icon: Users, minLevel: 2 },
                { href: '/admin/departments', label: 'จัดการสังกัด', icon: Building2, minLevel: 3 },
                { href: '/admin/positions', label: 'ตำแหน่ง/หน้าที่', icon: Briefcase, minLevel: 3 },
            ]
        },
        {
            title: 'Content',
            items: [
                { href: '/admin/news', label: 'ข่าวสาร', icon: Newspaper, minLevel: 2 },
                { href: '/admin/programs', label: 'หลักสูตร', icon: GraduationCap, minLevel: 2 },
            ]
        },
        {
            title: 'System',
            items: [
                { href: '/admin/users', label: 'จัดการผู้ใช้', icon: Settings, minLevel: 3 },
                { href: '/admin/profile', label: 'โปรไฟล์', icon: UserCircle, minLevel: 1 },
            ]
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const userLevel = getUserRoleLevel(user.roles);
    const primaryRole = getPrimaryRole(user.roles);

    return (
        <div className="min-h-screen bg-background flex text-foreground font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed h-full z-40 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col shadow-sm",
                    sidebarOpen ? "w-64" : "w-[70px]"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-4 border-b border-border/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-sm">
                            S
                        </div>
                        <div className={cn(
                            "transition-opacity duration-300 whitespace-nowrap",
                            sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                        )}>
                            <p className="font-bold text-sm tracking-tight text-foreground">SOC Admin</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Management</p>
                        </div>
                    </div>
                </div>

                {/* Menu Section */}
                <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {menuGroups.map((group, groupIdx) => {
                        const validItems = group.items.filter(item => userLevel >= item.minLevel);
                        if (validItems.length === 0) return null;

                        return (
                            <div key={groupIdx} className="space-y-1">
                                {sidebarOpen && (
                                    <h3 className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
                                        {group.title}
                                    </h3>
                                )}
                                {validItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-primary/10 text-primary shadow-sm"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                                !sidebarOpen && "justify-center px-0 h-10 w-10 mx-auto"
                                            )}
                                            title={!sidebarOpen ? item.label : undefined}
                                        >
                                            <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive && "text-primary")} />

                                            {sidebarOpen && <span>{item.label}</span>}

                                            {/* Active Indicator for collapsed state */}
                                            {!sidebarOpen && isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-3 border-t border-border mt-auto mb-20 md:mb-0">
                    <div className={cn(
                        "rounded-xl bg-accent/50 border border-border/50 p-2 flex items-center gap-3 transition-all duration-300",
                        !sidebarOpen && "justify-center p-0 bg-transparent border-0"
                    )}>
                        <div className="relative shrink-0">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-background shadow-sm" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold ring-2 ring-background shadow-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        </div>

                        {sidebarOpen && (
                            <div className="overflow-hidden min-w-0 flex-1">
                                <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                    <span className="truncate">{getRoleLabel(primaryRole)}</span>
                                </div>
                            </div>
                        )}

                        {sidebarOpen && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={handleLogout}
                                title="ออกจากระบบ"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
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
                <header className="h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground md:flex hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>

                        {/* Mobile Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground md:hidden flex"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="opacity-50">Admin Panel</span>
                            <span>/</span>
                            <span className="font-medium text-foreground capitalize">
                                {pathname.split('/').pop() || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
                        <a
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-primary/5"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>ดูหน้าเว็บไซต์</span>
                        </a>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 md:p-8 bg-muted/20">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
