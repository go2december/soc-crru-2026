"use client";

import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

// Mock Data for Startups
const STARTUPS = [
    {
        id: 1,
        name: "Chiang Rai Craft Hub",
        category: "Creative Economy",
        description: "แพลตฟอร์มรวบรวมงานหัตถกรรมพื้นบ้านเชียงราย เชื่อมโยงสู่ตลาดโลกด้วย Storytelling และ Digital Marketing",
        image: "/images/startup-banner.png", // Use banner as placeholder for now or specific crops
        stats: { impact: "50+ ครัวเรือน", income: "+20,000 บาท/เดือน" }
    },
    {
        id: 2,
        name: "Green Waste Management",
        category: "Environment",
        description: "ระบบจัดการขยะชุมชนแบบครบวงจร เปลี่ยนขยะอินทรีย์เป็นปุ๋ยและก๊าซชีวภาพ ลดปริมาณขยะฝังกลบได้กว่า 80%",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop", // External placeholder
        stats: { impact: "3 ชุมชนต้นแบบ", waste: "-5 ตัน/เดือน" }
    },
    {
        id: 3,
        name: "Elderly Care Dee",
        category: "Social Welfare",
        description: "แอปพลิเคชันจับคู่ผู้ดูแลผู้สูงอายุในชุมชน โดยอบรมเยาวชนและแม่บ้านให้มีทักษะ Caregiver มาตรฐาน",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2568&auto=format&fit=crop",
        stats: { impact: "ผู้สูงอายุ 100+", jobs: "สร้างงาน 30 คน" }
    },
    {
        id: 4,
        name: "Agri-Tourism Connect",
        category: "Tourism",
        description: "ส่งเสริมการท่องเที่ยวเชิงเกษตร โดยให้นักท่องเที่ยวได้สัมผัสวิถีชีวิตชาวนาและเรียนรู้วัฒนธรรมอาหารล้านนา",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop",
        stats: { impact: "นักท่องเที่ยว 5k/ปี", income: "+1.5 ลบ./ปี" }
    }
];

export default function StartupsPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full bg-black overflow-hidden">
                <Image
                    src="/images/startup-banner.png"
                    alt="Startup Banner"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-scholar-accent text-white font-bold tracking-wider text-xs mb-4 animate-pulse">
                        WISH : SOCIAL INNOVATION
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-none">
                        Social <span className="text-transparent bg-clip-text bg-gradient-to-r from-scholar-gold to-orange-400">Impact</span><br />
                        Innovators
                    </h1>
                    <p className="text-gray-200 text-lg max-w-2xl font-light">
                        พื้นทีปล่อยของสำหรับ "นวัตกรสังคม" เปลี่ยนไอเดีย เป็นพลังขับเคลื่อนชุมชนเชียงราย
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'นวัตกรรมชุมชน (Startups)' }]} />

                {/* Intro Text */}
                <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
                    <h2 className="text-3xl font-bold text-scholar-deep mb-4">จุดประกายการเปลี่ยนแปลง</h2>
                    <p className="text-gray-600 leading-relaxed">
                        โครงการบ่มเพาะวิสาหกิจเพื่อสังคม (Social Enterprise) โดยคณะสังคมศาสตร์ มรภ.เชียงราย
                        มุ่งเน้นการนำองค์ความรู้ทางวิชาการ ผสานกับภูมิปัญญาท้องถิ่น และเทคโนโลยีสมัยใหม่
                        เพื่อแก้ไขปัญหาและยกระดับคุณภาพชีวิตคนในชุมชนอย่างยั่งยืน
                    </p>
                </div>

                {/* Startup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {STARTUPS.map((startup) => (
                        <div key={startup.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col">

                            {/* Image Area */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={startup.image}
                                    alt={startup.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-scholar-deep shadow-sm">
                                    {startup.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-scholar-deep mb-3 group-hover:text-scholar-accent transition-colors">
                                    {startup.name}
                                </h3>
                                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                                    {startup.description}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-gray-100">
                                    {Object.entries(startup.stats).map(([key, value]) => (
                                        <div key={key}>
                                            <span className="block text-xl font-bold text-scholar-deep">{value}</span>
                                            <span className="text-xs text-gray-400 uppercase tracking-wide">{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Call to Action: Join Incubator */}
                <div className="mt-20 bg-gradient-to-r from-scholar-deep to-blue-900 rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-scholar-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl font-bold mb-4 relative z-10">มีไอเดียเปลี่ยนโลก? มาร่วมกับเรา!</h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-8 relative z-10">
                        ศูนย์บ่มเพาะนวัตกรรมทางสังคม (Social Innovation Incubator) เปิดรับสมัครทีมคนรุ่นใหม่
                        ที่พร้อมลุยแก้ปัญหาชุมชน พร้อมทุนสนับสนุนและพี่เลี้ยงมืออาชีพ
                    </p>
                    <button className="btn btn-lg bg-scholar-gold text-scholar-deep border-none shadow-xl hover:bg-white hover:scale-105 relative z-10 px-10 rounded-full font-bold">
                        เสนอโครงการ (Pitching Deck)
                    </button>
                </div>

            </div>
        </div>
    );
}
