"use client";

import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

const SERVICES = [
    {
        title: "โครงการบริการวิชาการเพื่อสังคม",
        description: "โครงการพัฒนาศักยภาพชุมชนและท้องถิ่น ผ่านกระบวนการมีส่วนร่วมและการถ่ายทอดองค์ความรู้",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "ศูนย์ที่ปรึกษาวิจัยและนวัตกรรม",
        description: "ให้บริการคำปรึกษาด้านระเบียบวิธีวิจัย การวิเคราะห์ข้อมูลทางสถิติ และการพัฒนาเครื่องมือวิจัย",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "การใช้พื้นที่และเครื่องมือทางวิชาการ",
        description: "บริการห้องปฏิบัติการทางสังคมศาสตร์ (Social Lab), ห้องประชุม, และอุปกรณ์โสตทัศนูปกรณ์",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        color: "bg-orange-50 text-orange-600"
    }
];

const PROJECTS = [
    {
        title: "โครงการยกระดับเศรษฐกิจและสังคมรายตำบลแบบบูรณาการ (U2T)",
        area: "ต.แม่ข้าวต้ม อ.เมือง จ.เชียงราย",
        status: "ดำเนินการเสร็จสิ้น",
        image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "การอบรมเชิงปฏิบัติการ: นักวิจัยชุมชนรุ่นใหม่",
        area: "หอประชุมคณะสังคมศาสตร์",
        status: "กำลังเปิดรับสมัคร",
        image: "https://images.unsplash.com/photo-1544531696-9342a533af63?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "บริการวิชาการด้านภูมิสารสนเทศเพื่อการจัดการภัยพิบัติ",
        area: "พื้นที่เสี่ยงภัย อ.แม่สาย",
        status: "ดำเนินการต่อเนื่อง",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
    }
];

export default function AcademicServicesPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Header */}
            <div className="relative h-[300px] w-full bg-scholar-deep overflow-hidden">
                <Image
                    src="/images/research-banner.png"
                    alt="Academic Service Banner"
                    fill
                    className="object-cover opacity-20"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">บริการวิชาการแก่สังคม</h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        "พันธกิจสัมพันธ์เพื่อสังคม" (Social Engagement)
                        นำองค์ความรู้สู่ชุมชน เพื่อการพัฒนาที่ยั่งยืน
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'บริการวิชาการ' }]} />

                {/* Main Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-8">
                    {SERVICES.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-scholar-gold transition-all text-center group">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-scholar-deep mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {service.description}
                            </p>
                            <Link href="/contact" className="inline-block mt-6 text-scholar-accent font-semibold hover:underline">
                                ติดต่อสอบถาม &rarr;
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Project Highlights */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-scholar-deep mb-8 flex items-center gap-2 border-l-4 border-scholar-accent pl-4">
                        โครงการและกิจกรรมล่าสุด
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PROJECTS.map((project, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                                <div className="relative h-48">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-scholar-deep shadow-sm">
                                        {project.status}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-scholar-deep mb-2 line-clamp-2">{project.title}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {project.area}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Request Service Form / CTA */}
                <div className="bg-scholar-deep text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-scholar-accent/10"></div>
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-2xl font-bold mb-3">ต้องการขอรับบริการวิชาการ?</h2>
                        <p className="text-white/80">
                            หน่วยงาน ชุมชน หรือองค์กรที่สนใจให้คณะสังคมศาสตร์เข้าไปมีส่วนร่วมในการพัฒนา หรือต้องการวิทยากร
                            สามารถส่งแบบคำร้องได้ที่นี่
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button className="btn bg-white text-scholar-deep border-none hover:bg-gray-100 font-bold px-8 rounded-full shadow-lg">
                            ดาวน์โหลดแบบฟอร์ม
                        </button>
                        <button className="btn bg-scholar-accent text-white border-none hover:bg-[#D9341C] font-bold px-8 rounded-full shadow-lg">
                            ติดต่อเรา
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
