import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { Database, Lightbulb, Rocket, ArrowRight, BookOpen, Globe2, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'ศูนย์วิจัยและบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description: 'ศูนย์รวมงานวิจัย นวัตกรรมเพื่อการพัฒนาท้องถิ่น บริการวิชาการ และการบ่มเพาะสตาร์ทอัพ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    alternates: {
        canonical: '/research',
    },
    openGraph: {
        title: 'ศูนย์วิจัยและบริการวิชาการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        description: 'ศูนย์รวมงานวิจัย นวัตกรรมเพื่อการพัฒนาท้องถิ่น บริการวิชาการ และการบ่มเพาะสตาร์ทอัพ',
        url: '/research',
        type: 'website',
        locale: 'th_TH',
    },
};

const RESEARCH_PILLARS = [
    {
        title: 'ฐานข้อมูลงานวิจัยและวิทยานิพนธ์',
        subtitle: 'Research Database & Thesis',
        description: 'สืบค้นผลงานวิจัย บทความวิชาการ และวิทยานิพนธ์ของคณาจารย์และนักศึกษา พร้อมจำแนกตามเป้าหมายการพัฒนาที่ยั่งยืน (SDGs)',
        icon: Database,
        href: '/research/database',
        badge: 'คลังข้อมูลดิจิทัล',
        accentColor: 'border-blue-500/20 hover:border-blue-500/50',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'ศูนย์บริการวิชาการเพื่อสังคม',
        subtitle: 'Academic Services & Community Impact',
        description: 'โครงการขับเคลื่อนองค์ความรู้สู่ชุมชนท้องถิ่น การพัฒนาเศรษฐกิจฐานราก ห้องปฏิบัติการทางสังคม และงานบริการวิชาการแบบมีส่วนร่วม',
        icon: Lightbulb,
        href: '/research/services',
        badge: 'พันธกิจเพื่อสังคม',
        accentColor: 'border-amber-500/20 hover:border-amber-500/50',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-50 text-amber-600',
    },
    {
        title: 'นวัตกรรมและผู้ประกอบการสังคม',
        subtitle: 'Social Innovation & Student Startups',
        description: 'พื้นที่ส่งเสริมการสร้างโมเดลธุรกิจเพื่อสังคม บ่มเพาะผู้ประกอบการรุ่นใหม่ ผลงานสร้างสรรค์ และการต่อยอดสู่เชิงพาณิชย์',
        icon: Rocket,
        href: '/research/startups',
        badge: 'บ่มเพาะสตาร์ทอัพ',
        accentColor: 'border-emerald-500/20 hover:border-emerald-500/50',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-50 text-emerald-600',
    },
];

const STATS = [
    { number: '100+', label: 'ผลงานวิจัยและตีพิมพ์', icon: BookOpen },
    { number: '17', label: 'เป้าหมาย SDGs ที่เกี่ยวข้อง', icon: Globe2 },
    { number: '50+', label: 'ชุมชนที่ได้รับการบริการวิชาการ', icon: Users },
    { number: '10+', label: 'รางวัลและนวัตกรรมสร้างสรรค์', icon: Award },
];

export default function ResearchHubPage() {
    return (
        <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800">
            {/* Header / Hero Section */}
            <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumb
                        items={[
                            { label: 'หน้าหลัก', href: '/' },
                            { label: 'วิจัยและบริการวิชาการ' },
                        ]}
                    />

                    <div className="max-w-3xl mt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse" />
                            Research & Academic Services
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-6">
                            งานวิจัย นวัตกรรม และบริการวิชาการ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-scholar-gold via-amber-200 to-white">
                                เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน
                            </span>
                        </h1>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                            บูรณาการองค์ความรู้ทางสังคมศาสตร์เพื่อตอบสนองการเปลี่ยนแปลงของสังคม สร้างสรรค์งานวิจัยที่มีผลกระทบสูง
                            และขับเคลื่อนการพัฒนาชุมชนท้องถิ่นจังหวัดเชียงรายและพื้นที่ภาคเหนือตอนบน
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
                        {STATS.map((stat, idx) => {
                            const IconComponent = stat.icon;
                            return (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-scholar-gold shrink-0">
                                        <IconComponent size={20} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold font-heading text-white">{stat.number}</div>
                                        <div className="text-xs text-slate-400">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Portals Grid */}
            <section className="container mx-auto px-4 -mt-8 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {RESEARCH_PILLARS.map((pillar, idx) => {
                        const IconComponent = pillar.icon;
                        return (
                            <Link
                                key={idx}
                                href={pillar.href}
                                className={`group bg-white rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${pillar.accentColor}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${pillar.iconBg}`}>
                                            <IconComponent size={28} />
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium border ${pillar.badgeColor}`}>
                                            {pillar.badge}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-scholar-accent transition-colors mb-1 font-heading">
                                        {pillar.title}
                                    </h2>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                        {pillar.subtitle}
                                    </p>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {pillar.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-700 group-hover:text-scholar-accent transition-colors">
                                    <span>เข้าสู่ระบบ</span>
                                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Callout Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                            ต้องการร่วมงานวิจัยหรือขอรับบริการวิชาการ?
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            ฝ่ายวิจัยและบริการวิชาการ คณะสังคมศาสตร์ ยินดีให้คำปรึกษาและร่วมมือกับองค์กรภาครัฐ ภาคเอกชน และประชาสังคม
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <Link
                            href="/contact"
                            className="px-6 py-3 rounded-full bg-scholar-deep text-white text-sm font-medium hover:bg-scholar-accent transition-colors shadow-sm"
                        >
                            ติดต่อฝ่ายวิจัย
                        </Link>
                        <Link
                            href="/research/database"
                            className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                            ค้นหางานวิจัยทั้งหมด
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
