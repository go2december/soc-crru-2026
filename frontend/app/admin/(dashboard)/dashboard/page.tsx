'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    Newspaper,
    GraduationCap,
    ShieldCheck,
    Plus,
    PenTool,
    ExternalLink,
    LayoutTemplate
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    roles: string[];
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

    const getPrimaryRole = (roles: string[] | undefined) => {
        if (!roles || roles.length === 0) return 'GUEST';
        if (roles.includes('ADMIN')) return 'ADMIN';
        if (roles.includes('EDITOR')) return 'EDITOR';
        if (roles.includes('STAFF')) return 'STAFF';
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

    const hasPermission = (roles: string[] | undefined, requiredRoles: string[]) => {
        if (!roles) return false;
        return requiredRoles.some(r => roles.includes(r));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-muted-foreground animate-pulse">กำลังโหลดข้อมูล...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-white/10 shadow-inner" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-4 border-white/10 backdrop-blur-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">สวัสดี, {user?.name || 'ผู้ใช้'}</h1>
                        <p className="text-slate-300 max-w-xl">
                            ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์คณะสังคมศาสตร์ - พื้นที่สำหรับการจัดการข้อมูลและเนื้อหาอย่างมีประสิทธิภาพ
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/20 text-sm font-medium flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                {getRoleLabel(getPrimaryRole(user?.roles))}
                            </div>
                            <span className="text-sm text-slate-400 font-mono">{user?.email}</span>
                        </div>
                    </div>
                </div>
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">บุคลากรทั้งหมด</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStaff}</div>
                        <p className="text-xs text-muted-foreground">รายการในระบบ</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">ข่าวสาร</CardTitle>
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalNews}</div>
                        <p className="text-xs text-muted-foreground">บทความเผยแพร่</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">หลักสูตร</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                        <p className="text-xs text-muted-foreground">เปิดสอนปัจจุบัน</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">ผู้ใช้งาน</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-green-500/20 p-0.5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers || '-'}</div>
                        <p className="text-xs text-muted-foreground">Active Users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Permissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Quick Actions */}
                <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🚀 การจัดการด่วน
                        </CardTitle>
                        <CardDescription>ทางลัดสำหรับเข้าถึงฟังก์ชันที่ใช้งานบ่อย</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button variant="outline" className="h-auto py-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary/30 group" asChild>
                                <a href="/admin/staff">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Plus className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">เพิ่มบุคลากร</div>
                                        <div className="text-xs text-muted-foreground">จัดการข้อมูลอาจารย์/จนท.</div>
                                    </div>
                                </a>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 justify-start gap-4 hover:bg-orange-500/5 hover:border-orange-500/30 group" asChild>
                                <a href="/admin/news">
                                    <div className="bg-orange-500/10 p-2 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                                        <PenTool className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">เขียนข่าวใหม่</div>
                                        <div className="text-xs text-muted-foreground">ประชาสัมพันธ์กิจกรรม</div>
                                    </div>
                                </a>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 justify-start gap-4 hover:bg-blue-500/5 hover:border-blue-500/30 group" asChild>
                                <a href="/admin/programs">
                                    <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <LayoutTemplate className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">จัดการหลักสูตร</div>
                                        <div className="text-xs text-muted-foreground">แก้ไขข้อมูลรายวิชา</div>
                                    </div>
                                </a>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 justify-start gap-4 hover:bg-slate-500/5 hover:border-slate-500/30 group" asChild>
                                <a href="/" target="_blank">
                                    <div className="bg-slate-500/10 p-2 rounded-lg group-hover:bg-slate-500/20 transition-colors">
                                        <ExternalLink className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">ดูหน้าเว็บไซต์</div>
                                        <div className="text-xs text-muted-foreground">Preview หน้าเว็บจริง</div>
                                    </div>
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Permission Status */}
                <Card className="col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">📋 สิทธิ์การใช้งาน</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                                <span className="text-sm font-medium">จัดการบุคลากร</span>
                                {hasPermission(user?.roles, ['ADMIN', 'EDITOR'])
                                    ? <span className="text-xs bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full font-medium">อนุญาต</span>
                                    : <span className="text-xs bg-red-500/15 text-red-600 px-2 py-0.5 rounded-full font-medium">ไม่อนุญาต</span>
                                }
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                                <span className="text-sm font-medium">จัดการข่าวสาร</span>
                                {hasPermission(user?.roles, ['ADMIN', 'EDITOR'])
                                    ? <span className="text-xs bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full font-medium">อนุญาต</span>
                                    : <span className="text-xs bg-red-500/15 text-red-600 px-2 py-0.5 rounded-full font-medium">ไม่อนุญาต</span>
                                }
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                                <span className="text-sm font-medium">จัดการผู้ใช้</span>
                                {hasPermission(user?.roles, ['ADMIN'])
                                    ? <span className="text-xs bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full font-medium">อนุญาต</span>
                                    : <span className="text-xs bg-red-500/15 text-red-600 px-2 py-0.5 rounded-full font-medium">ไม่อนุญาต</span>
                                }
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground text-center">
                                * หากต้องการขอสิทธิ์เพิ่ม กรุณาติดต่อผู้ดูแลระบบสูงสุด
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
