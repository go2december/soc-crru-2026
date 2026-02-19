
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
    Layout,
    ScrollText,
    Settings
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
    activities: number;
    recentUpdates: any[];
}

export default function ChiangRaiAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        artifacts: 0,
        staff: 0,
        articles: 0,
        activities: 0,
        recentUpdates: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const fetchData = async (url: string) => {
                try {
                    const res = await fetch(url);
                    return res.ok ? await res.json() : [];
                } catch (e) {
                    console.error(`Error fetching ${url}:`, e);
                    return [];
                }
            };

            const [artifactsData, staffData, articlesData, activitiesData] = await Promise.all([
                fetchData(`${API_URL}/api/chiang-rai/artifacts?limit=100`), // Fetch more for accuratest count
                fetchData(`${API_URL}/api/chiang-rai/staff`),
                fetchData(`${API_URL}/api/chiang-rai/articles`),
                fetchData(`${API_URL}/api/chiang-rai/activities`)
            ]);

            // Handle pagination wrappers if necessary
            const artifacts = Array.isArray(artifactsData) ? artifactsData : (artifactsData.data || []);
            const staff = Array.isArray(staffData) ? staffData : (staffData.data || []);
            const articles = Array.isArray(articlesData) ? articlesData : (articlesData.data || []);
            const activities = Array.isArray(activitiesData) ? activitiesData : (activitiesData.data || []);

            setStats({
                artifacts: artifactsData.total || artifacts.length || 0, // Prefer meta total if avail
                staff: staff.length || 0,
                articles: articles.length || 0,
                activities: activities.length || 0,
                recentUpdates: [
                    ...activities.slice(0, 3).map((a: any) => ({
                        type: 'News',
                        title: a.title,
                        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('th-TH') : 'Draft',
                        status: a.isPublished !== false ? 'Published' : 'Draft',
                        color: 'bg-emerald-100 text-emerald-700'
                    })),
                    ...artifacts.slice(0, 3).map((a: any) => ({
                        type: 'Data',
                        title: a.title,
                        date: new Date(a.createdAt).toLocaleDateString('th-TH'),
                        status: 'Published',
                        color: 'bg-purple-100 text-purple-700'
                    })),
                    ...articles.slice(0, 2).map((a: any) => ({
                        type: 'Article',
                        title: a.title,
                        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('th-TH') : 'Draft',
                        status: a.isPublished !== false ? 'Published' : 'Draft',
                        color: 'bg-blue-100 text-blue-700'
                    }))
                ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, link, desc }: any) => (
        <Link href={link || '#'}>
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white relative">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 shadow-inner`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-stone-50 rounded-full p-2 group-hover:bg-orange-50 transition-colors">
                            <ArrowRight size={16} className="text-stone-300 group-hover:text-orange-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold text-stone-800 mb-1 tracking-tight">
                            {loading ? <span className="animate-pulse bg-stone-200 h-8 w-12 rounded inline-block"></span> : value}
                        </div>
                        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">{title}</h3>
                        <p className="text-xs text-stone-400 mt-1 font-light">{desc}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
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
                        href="/chiang-rai-studies/admin/artifacts/create"
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
                    title="กิจกรรม/ข่าวสาร (Activities)"
                    value={stats.activities}
                    icon={ScrollText}
                    color="from-emerald-500 to-green-400"
                    link="/chiang-rai-studies/admin/activities"
                    desc="ข่าวสาร กิจกรรม ประกาศ"
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
                                                    ${item.type === 'Artifact' ? 'bg-purple-100 text-purple-600' : item.type === 'Article' ? 'bg-blue-100 text-blue-600' : item.type === 'Activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}
                                            `}>
                                                {item.type === 'Artifact' ? 'IMG' : item.type === 'Article' ? 'DOC' : item.type === 'Activity' ? 'ACT' : 'USER'}
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
                        <Link href="/chiang-rai-studies/admin/artifacts/create" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เพิ่มข้อมูลอัตลักษณ์</span>
                            <div className="bg-orange-500 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/staff" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เพิ่มบุคลากรใหม่</span>
                            <div className="bg-purple-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/articles/create" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เผยแพร่บทความ</span>
                            <div className="bg-blue-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/activities/create" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">เพิ่มกิจกรรม/ข่าวสาร</span>
                            <div className="bg-emerald-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <PlusCircle size={16} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/chiang-rai-studies/admin/settings" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                            <span className="text-sm font-medium">ตั้งค่าหน้าแรก (Hero)</span>
                            <div className="bg-pink-400 rounded-full p-1 group-hover:scale-110 transition-transform">
                                <Settings size={16} className="text-white" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
