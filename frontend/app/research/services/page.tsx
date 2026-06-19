import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { AcademicServiceItem, getStatusLabel } from '@/lib/academic-services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4201';

async function getServices(): Promise<AcademicServiceItem[]> {
    try {
        const res = await fetch(`${API_URL}/api/academic-services`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

const SERVICES = [
    {
        title: "โครงการบริการวิชาการเพื่อสังคม",
        description: "โครงการพัฒนาศักยภาพชุมชนและท้องถิ่น ผ่านกระบวนการมีส่วนร่วมและการถ่ายทอดองค์ความรู้",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: "bg-blue-50 text-blue-600",
        href: "/contact"
    },
    {
        title: "ศูนย์ที่ปรึกษาวิจัยและนวัตกรรม",
        description: "ให้บริการคำปรึกษาด้านระเบียบวิธีวิจัย การวิเคราะห์ข้อมูลทางสถิติ และการพัฒนาเครื่องมือวิจัย",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        color: "bg-purple-50 text-purple-600",
        href: "/contact"
    },
    {
        title: "ห้องปฏิบัติการทางสังคมศาสตร์ (Social Lab)",
        description: "บริการห้องปฏิบัติการทางสังคมศาสตร์, ห้องประชุม, และอุปกรณ์โสตทัศนูปกรณ์",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        color: "bg-orange-50 text-orange-600",
        href: "https://social-lab.soc.crru.ac.th",
        isExternal: true
    }
];

export default async function AcademicServicesPage() {
    const projects = await getServices();

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
                    {SERVICES.map((service, index) => {
                        const CardWrapper = service.isExternal ? 'a' : Link;
                        return (
                            <CardWrapper 
                                key={index} 
                                href={service.href}
                                target={service.isExternal ? "_blank" : undefined}
                                rel={service.isExternal ? "noopener noreferrer" : undefined}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-scholar-gold transition-all text-center group block"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-scholar-deep mb-3 flex items-center justify-center gap-2">
                                    {service.title}
                                    {service.isExternal && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    )}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {service.description}
                                </p>
                            </CardWrapper>
                        );
                    })}
                </div>

                {/* Project Highlights */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-scholar-deep mb-8 flex items-center gap-2 border-l-4 border-scholar-accent pl-4">
                        โครงการและกิจกรรมล่าสุด
                    </h2>
                    
                    {projects.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-gray-500">ยังไม่มีโครงการในขณะนี้</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link href={`/research/services/${project.id}`} key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 block group">
                                    <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {project.coverImageUrl ? (
                                            <Image
                                                src={project.coverImageUrl}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <svg className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-scholar-deep shadow-sm">
                                            {getStatusLabel(project.status || 'ONGOING')}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-scholar-deep mb-2 line-clamp-2">{project.title}</h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="line-clamp-1">{project.area || 'ไม่ระบุพื้นที่'}</span>
                                        </p>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
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
                        <Link href="/downloads" className="btn bg-white text-scholar-deep border-none hover:bg-gray-100 font-bold px-8 py-3 rounded-full shadow-lg text-center inline-block">
                            ดาวน์โหลดแบบฟอร์ม
                        </Link>
                        <Link href="/contact" className="btn bg-scholar-accent text-white border-none hover:bg-[#D9341C] font-bold px-8 py-3 rounded-full shadow-lg text-center inline-block">
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
