'use client';

import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST';
    lastLoginAt: string;
}

interface Stats {
    totalStaff: number;
    totalNews: number;
    totalPrograms: number;
    totalUsers: number;
}

export default function AdminDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats>({ totalStaff: 0, totalNews: 0, totalPrograms: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

            try {
                // Fetch user profile
                const profileRes = await fetch(`${apiUrl}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (profileRes.ok) {
                    setUser(await profileRes.json());
                }

                // Fetch stats (staff count)
                const staffRes = await fetch(`${apiUrl}/api/staff`);
                if (staffRes.ok) {
                    const staffData = await staffRes.json();
                    setStats(prev => ({ ...prev, totalStaff: staffData.length }));
                }

                // Fetch programs count
                const programsRes = await fetch(`${apiUrl}/api/programs`);
                if (programsRes.ok) {
                    const programsData = await programsRes.json();
                    setStats(prev => ({ ...prev, totalPrograms: programsData.length }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'ผู้ดูแลระบบ';
            case 'EDITOR': return 'บรรณาธิการ';
            case 'STAFF': return 'บุคลากร';
            default: return 'ผู้เยี่ยมชม';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="avatar">
                        <div className="w-20 rounded-full ring ring-white/30 ring-offset-2 ring-offset-primary">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <div className="bg-white/20 w-full h-full flex items-center justify-center text-3xl font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">สวัสดี, {user?.name || 'ผู้ใช้'}</h1>
                        <p className="opacity-90 mt-1">ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์คณะสังคมศาสตร์</p>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="badge badge-lg bg-white/20 border-0">{getRoleLabel(user?.role || 'GUEST')}</span>
                            <span className="text-sm opacity-75">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat bg-base-100 rounded-xl shadow-lg">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                        </svg>
                    </div>
                    <div className="stat-title">บุคลากร</div>
                    <div className="stat-value text-primary">{stats.totalStaff}</div>
                    <div className="stat-desc">รายการในระบบ</div>
                </div>

                <div className="stat bg-base-100 rounded-xl shadow-lg">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
                            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                        </svg>
                    </div>
                    <div className="stat-title">ข่าวสาร</div>
                    <div className="stat-value text-secondary">{stats.totalNews}</div>
                    <div className="stat-desc">บทความที่เผยแพร่</div>
                </div>

                <div className="stat bg-base-100 rounded-xl shadow-lg">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                        </svg>
                    </div>
                    <div className="stat-title">หลักสูตร</div>
                    <div className="stat-value text-accent">{stats.totalPrograms}</div>
                    <div className="stat-desc">หลักสูตรที่เปิดสอน</div>
                </div>

                <div className="stat bg-base-100 rounded-xl shadow-lg">
                    <div className="stat-figure text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                    </div>
                    <div className="stat-title">ผู้ใช้ระบบ</div>
                    <div className="stat-value text-info">{stats.totalUsers}</div>
                    <div className="stat-desc">ผู้ใช้ที่ลงทะเบียน</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">🚀 Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <a href="/admin/staff" className="btn btn-outline btn-primary">
                                ➕ เพิ่มบุคลากร
                            </a>
                            <a href="/admin/news" className="btn btn-outline btn-secondary">
                                ✍️ เขียนข่าว
                            </a>
                            <a href="/admin/programs" className="btn btn-outline btn-accent">
                                📚 จัดการหลักสูตร
                            </a>
                            <a href="/" target="_blank" className="btn btn-outline">
                                🌐 ดูเว็บไซต์
                            </a>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">📋 สิทธิ์การใช้งานของคุณ</h2>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className={user?.role === 'ADMIN' || user?.role === 'EDITOR' ? 'text-success' : 'text-error'}>
                                    {user?.role === 'ADMIN' || user?.role === 'EDITOR' ? '✅' : '❌'}
                                </span>
                                จัดการบุคลากร
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={user?.role === 'ADMIN' || user?.role === 'EDITOR' ? 'text-success' : 'text-error'}>
                                    {user?.role === 'ADMIN' || user?.role === 'EDITOR' ? '✅' : '❌'}
                                </span>
                                จัดการข่าวสาร
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={user?.role === 'ADMIN' ? 'text-success' : 'text-error'}>
                                    {user?.role === 'ADMIN' ? '✅' : '❌'}
                                </span>
                                จัดการผู้ใช้และสิทธิ์
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-success">✅</span>
                                ดูและแก้ไขโปรไฟล์ตัวเอง
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
