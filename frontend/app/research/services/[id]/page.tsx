import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { getStatusLabel } from '@/lib/academic-services';
import GalleryClient from '@/components/GalleryClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

async function getServiceById(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/academic-services/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export default async function AcademicServiceDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const project = await getServiceById(params.id);

    if (!project) {
        notFound();
    }

    const galleryImages = project.galleryImages || [];

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Header */}
            <div className="relative h-[300px] w-full bg-scholar-deep overflow-hidden">
                {project.coverImageUrl ? (
                    <Image
                        src={project.coverImageUrl}
                        alt={project.title}
                        fill
                        className="object-cover opacity-30"
                    />
                ) : (
                    <Image
                        src="/images/research-banner.png"
                        alt="Academic Service Banner"
                        fill
                        className="object-cover opacity-20"
                    />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="mb-4">
                        <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm border border-white/30">
                            {getStatusLabel(project.status || 'ONGOING')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">{project.title}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'บริการวิชาการ', href: '/research/services' }, { label: project.title }]} />

                <div className="max-w-4xl mx-auto mt-8 bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-scholar-deep mb-4 border-l-4 border-scholar-accent pl-4">ข้อมูลโครงการ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-gray-50 p-6 rounded-xl">
                            <div>
                                <strong className="block text-gray-500 text-sm mb-1">พื้นที่ดำเนินการ</strong>
                                <span>{project.area || 'ไม่ระบุพื้นที่'}</span>
                            </div>
                            <div>
                                <strong className="block text-gray-500 text-sm mb-1">ประเภทบริการ</strong>
                                <span>{project.serviceType === 'CONSULTING' ? 'ให้คำปรึกษา' : 'บริการวิชาการเพื่อสังคม'}</span>
                            </div>
                        </div>
                    </div>

                    {project.description && (
                        <div className="mb-12">
                            <h2 className="text-xl font-bold text-scholar-deep mb-4">รายละเอียดโครงการ</h2>
                            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {project.description}
                            </div>
                        </div>
                    )}

                    {galleryImages.length > 0 && (
                        <div className="mt-12">
                            <GalleryClient galleryImages={galleryImages} />
                        </div>
                    )}
                </div>
                
                <div className="text-center mt-12">
                    <Link href="/research/services" className="inline-flex items-center gap-2 text-scholar-deep hover:text-scholar-accent font-medium transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        กลับไปหน้ารวมบริการวิชาการ
                    </Link>
                </div>
            </div>
        </div>
    );
}
