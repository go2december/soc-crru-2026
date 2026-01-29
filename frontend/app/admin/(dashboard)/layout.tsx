'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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
        // หา Level สูงสุดจาก Roles ที่ user มี
        return Math.max(...roles.map(r => ROLE_LEVELS[r] || 0));
    };

    const getPrimaryRole = (roles: string[] | undefined) => {
        const level = getUserRoleLevel(roles);
        if (level >= 3) return 'ADMIN';
        if (level >= 2) return 'EDITOR';
        if (level >= 1) return 'STAFF';
        return 'GUEST';
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'badge-error';
            case 'EDITOR': return 'badge-warning';
            case 'STAFF': return 'badge-info';
            default: return 'badge-ghost';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'ผู้ดูแลระบบ';
            case 'EDITOR': return 'บรรณาธิการ';
            case 'STAFF': return 'บุคลากร';
            default: return 'ผู้เยี่ยมชม';
        }
    };

    // Menu Items พร้อมกำหนด Minimum Role Level ที่เข้าถึงได้
    const menuItems = [
        { href: '/admin/dashboard', label: 'หน้าหลัก', icon: '🏠', minLevel: 1 }, // Staff ขึ้นไป
        { href: '/admin/staff', label: 'บุคลากร', icon: '👥', minLevel: 2 }, // Editor ขึ้นไป
        { href: '/admin/news', label: 'ข่าวสาร', icon: '📰', minLevel: 2 }, // Editor ขึ้นไป
        { href: '/admin/programs', label: 'หลักสูตร', icon: '📚', minLevel: 2 }, // Editor ขึ้นไป
        { href: '/admin/users', label: 'จัดการผู้ใช้', icon: '⚙️', minLevel: 3 }, // Admin เท่านั้น
        { href: '/admin/profile', label: 'โปรไฟล์ของฉัน', icon: '👤', minLevel: 1 }, // Staff ขึ้นไป
    ];

    if (loading) {
        // ...
    }

    if (!user) {
        return null;
    }

    const userLevel = getUserRoleLevel(user.roles);
    const primaryRole = getPrimaryRole(user.roles);

    return (
        <div className="min-h-screen bg-base-200 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-base-100 shadow-xl transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="p-4 border-b border-base-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            SOC
                        </div>
                        {sidebarOpen && (
                            <div>
                                <p className="font-bold text-sm">Admin Panel</p>
                                <p className="text-xs opacity-60">คณะสังคมศาสตร์</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4">
                    <ul className="menu gap-1">
                        {menuItems
                            .filter(item => userLevel >= item.minLevel)
                            .map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`${pathname === item.href ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {sidebarOpen && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-base-200">
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    <div className="bg-primary/20 w-full h-full flex items-center justify-center text-primary font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{user.name}</p>
                                <span className={`badge badge-xs ${getRoleBadgeClass(primaryRole)}`}>
                                    {getRoleLabel(primaryRole)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-base-100 shadow-sm flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4">
                        <a href="/" target="_blank" className="btn btn-ghost btn-sm gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81l-8.97 8.97a.75.75 0 11-1.06-1.06l8.97-8.97h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
                            </svg>
                            ดูเว็บไซต์
                        </a>
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                            ออกจากระบบ
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div >
    );
}
