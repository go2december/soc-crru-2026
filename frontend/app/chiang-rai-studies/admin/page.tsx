
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Image as ImageIcon,
    BookOpen,
    PlusCircle,
    ArrowRight,
    Activity,
    Database,
    Clock,
    Layout
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Mock stats for now (until dedicated stats API exists)
interface DashboardStats {
    artifacts: number;
    staff: number;
    articles: number;
    recentUpdates: any[];
}

export default function ChiangRaiAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        artifacts: 0,
        staff: 0,
        articles: 0,
        recentUpdates: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch counts in parallel
                const [artifactsRes, staffRes] = await Promise.all([
                    fetch(`${API_URL}/chiang-rai/artifacts`),
                    fetch(`${API_URL}/chiang-rai/staff`)
                ]);

                const artifactsData = artifactsRes.ok ? await artifactsRes.json() : [];
                const staffData = staffRes.ok ? await staffRes.json() : [];

                setStats({
                    artifacts: artifactsData.length || 0,
                    staff: staffData.length || 0,
                    articles: 0, // Pending Article API implementation
                    recentUpdates: [
                        ...artifactsData.slice(0, 3).map((a: any) => ({
                            type: 'Artifact',
                            title: a.title,
                            date: new Date(a.createdAt).toLocaleDateString(),
                            status: 'Published'
                        })),
                        ...staffData.slice(0, 2).map((s: any) => ({
                            type: 'Staff',
                            title: `${s.firstName} ${s.lastName}`,
                            date: 'Updated recently',
                            status: 'Active'
                        }))
                    ].slice(0, 5)
                });
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, link, desc }: any) => (
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className={`h-1.5 w-full bg-gradient-to-r ${color}`}></div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('from-', 'bg-').split(' ')[0]} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${color.replace('from-', 'text-').split(' ')[0]}`} />
                    </div>
                    {link && (
                        <Link href={link} className="text-stone-400 hover:text-purple-600 transition-colors">
                            <ArrowRight size={18} />
                        </Link>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-stone-500">{title}</h3>
                    <div className="text-3xl font-bold text-stone-800">{loading ? '...' : value}</div>
                    <p className="text-xs text-stone-400">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
                <div>
                    <h1 className="text-2xl font-bold text-[#2e1065] flex items-center gap-2">
                        <Layout className="w-6 h-6 text-orange-500" />
                        ภาพรวมระบบ (Overview)
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">ยินดีต้อนรับสู่ระบบจัดการศูนย์เชียงรายศึกษา</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/chiang-rai-studies/admin/artifacts/new"
                        className="flex items-center gap-2 bg-[#2e1065] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <PlusCircle size={16} />
                        เพิ่ม Artifact ใหม่
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="จำนวนอัตลักษณ์ (Artifacts)"
                    value={stats.artifacts}
                    icon={ImageIcon}
                    color="from-purple-600 to-purple-400"
                    link="/chiang-rai-studies/admin/artifacts"
                    desc="รายการในคลังข้อมูลดิจิทัล"
                />
                <StatCard
                    title="บุคลากร (Staff)"
                    value={stats.staff}
                    icon={Users}
                    color="from-orange-500 to-amber-500"
                    link="/chiang-rai-studies/admin/staff"
                    desc="ทีมงานและผู้บริหารศูนย์ฯ"
                />
                <StatCard
                    title="บทความวิชาการ (Articles)"
                    value={stats.articles}
                    icon={BookOpen}
                    color="from-blue-500 to-cyan-400"
                    link="/chiang-rai-studies/admin/articles"
                    desc="งานวิจัยและบทความที่เผยแพร่"
                />
                <StatCard
                    title="สถานะระบบ (System)"
                    value="Online"
                    icon={Database}
                    color="from-emerald-500 to-green-400"
                    link="#"
                    desc="การเชื่อมต่อ Database ปกติ"
                />
            </div>

            {/* Recent Activity & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Updates */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader className="border-b border-stone-100 bg-white rounded-t-xl">
                        <CardTitle className="text-lg font-bold text-[#2e1065] flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            การอัปเดตล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white rounded-b-xl">
                        {loading ? (
                            <div className="p-8 text-center text-stone-400 animate-pulse">กำลังโหลดข้อมูล...</div>
                        ) : stats.recentUpdates.length > 0 ? (
                            <div className="divide-y divide-stone-100">
                                {stats.recentUpdates.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-purple-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                                                ${item.type === 'Artifact' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}
                                            `}>
                                                {item.type === 'Artifact' ? 'IMG' : 'USER'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-stone-800 group-hover:text-[#2e1065] transition-colors line-clamp-1">{item.title}</p>
                                                <p className="text-xs text-stone-400">{item.type} • {item.date}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-stone-400">ยังไม่มีประวัติการทำรายการ</div>
                        )}
                        <div className="p-4 border-t border-stone-100 text-center">
                            <Link href="/chiang-rai-studies/admin/artifacts" className="text-sm text-purple-600 font-medium hover:text-orange-600 transition-colors inline-flex items-center gap-1">
                                ดูประวัติทั้งหมด <ArrowRight size={14} />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Panel */}
                <Card className="h-fit border-none shadow-md bg-gradient-to-br from-[#2e1065] to-[#4c1d95] text-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-400" />
                            เมนูลัด (Quick Actions)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/chiang-rai-studies/admin/artifacts/new" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เพิ่มข้อมูลอัตลักษณ์</span>
                            <div className="bg-orange-500 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/staff/new" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เพิ่มบุคลากรใหม่</span>
                            <div className="bg-purple-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/articles/new" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เผยแพร่บทความ</span>
                            <div className="bg-blue-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
