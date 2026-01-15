import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export interface ProgramData {
    id: string;
    title: string;
    degree: string;
    image: string; // Banner/Hero Image
    description: string;
    highlights: {
        title: string;
        description: string;
        icon?: React.ReactNode;
    }[];
    careers: string[];
    structure: {
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    };
    downloadLink?: string; // Link to PDF curriculum
    level?: string; // e.g. "ปริญญาตรี", "ปริญญาโท"
    concentrations?: {
        title: string;
        description: string;
    }[];
}

interface ProgramTemplateProps {
    data: ProgramData;
}

export default function ProgramTemplate({ data }: ProgramTemplateProps) {
    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* 1. Hero / Header */}
            <header className="relative h-[400px] flex items-center justify-center bg-scholar-deep overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <Image
                        src={data.image}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/60 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4 text-center lg:text-left pt-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-scholar-accent text-white text-sm font-semibold mb-4 tracking-wider">
                        {data.level || "ปริญญาตรี (Bachelor's Degree)"}
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl lg:text-2xl text-scholar-gold font-light tracking-wide mb-8">
                        {data.degree}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a
                            href={data.level?.includes('โท') || data.level?.includes('เอก') || data.level?.includes('Master') || data.level?.includes('Doctor')
                                ? "https://orasis.crru.ac.th/gds_crru/index.php/main/home"
                                : "https://admission.crru.ac.th/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary text-white bg-gradient-to-r from-scholar-accent to-[#D9341C] border-none px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            สมัครเรียนทันที
                        </a>
                        {data.downloadLink && (
                            <a href={data.downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-white hover:bg-white hover:text-scholar-deep px-8 rounded-full">
                                ดาวน์โหลดหลักสูตร (PDF)
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'หลักสูตร', href: '/programs' },
                    {
                        label: data.level?.includes('เอก') || data.level?.includes('Doctor')
                            ? 'หลักสูตรปริญญาเอก'
                            : data.level?.includes('โท') || data.level?.includes('Master')
                                ? 'หลักสูตรปริญญาโท'
                                : 'หลักสูตรปริญญาตรี',
                        href: data.level?.includes('เอก') || data.level?.includes('Doctor')
                            ? '/programs?level=doctoral'
                            : data.level?.includes('โท') || data.level?.includes('Master')
                                ? '/programs?level=master'
                                : '/programs?level=bachelor'
                    },
                    { label: data.title }
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-scholar-deep mb-4 border-l-4 border-scholar-accent pl-3">
                                เกี่ยวกับสาขาวิชา
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed indent-8">
                                {data.description}
                            </p>
                        </section>

                        {/* Concentrations / Majors */}
                        {data.concentrations && data.concentrations.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">
                                    แขนงวิชา / วิชาเอก
                                </h2>
                                <div className="space-y-6">
                                    {data.concentrations.map((item, index) => (
                                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-scholar-gold/30 transition-all">
                                            <h3 className="font-bold text-xl text-scholar-deep mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-scholar-accent"></span>
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 pl-4 border-l border-gray-200 ml-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Highlights */}
                        <section>
                            <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">
                                จุดเด่นของหลักสูตร
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.highlights.map((item, index) => (
                                    <div key={index} className="bg-scholar-soft p-6 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-scholar-accent mb-4 shadow-sm">
                                            {item.icon || (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg text-scholar-deep mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-sm">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Career Paths */}
                        <section>
                            <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">
                                เส้นทางอาชีพในอนาคต
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.careers.map((career, index) => (
                                    <li key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-scholar-gold transition-colors">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-gray-700 font-medium">{career}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                    </div>

                    {/* Right Column: Sidebar info */}
                    <div className="space-y-8">

                        {/* Structure Box */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-scholar-deep">
                            <h3 className="text-xl font-bold text-scholar-deep mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                โครงสร้างหลักสูตร
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาศึกษาทั่วไป</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.general} นก.</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาเฉพาะ</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.major} นก.</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาเลือกเสรี</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.freeElective} นก.</span>
                                </div>
                                <div className="pt-2 flex justify-between items-center bg-scholar-soft -mx-6 px-6 py-4 mt-4 rounded-b-lg">
                                    <span className="font-bold text-scholar-deep">รวมตลอดหลักสูตร</span>
                                    <span className="text-xl font-bold text-scholar-accent">{data.structure.totalCredits} นก.</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact / Ask More */}
                        <div className="bg-scholar-deep text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-accent/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-lg font-bold mb-4">สอบถามข้อมูลเพิ่มเติม</h3>
                            <p className="text-white/80 text-sm mb-4">สงสัยเกี่ยวกับหลักสูตร หรือการรับสมัคร? ทักแชทสอบถามเจ้าหน้าที่ได้เลย</p>
                            <Link href="/contact" className="btn btn-outline text-white hover:bg-white hover:text-scholar-deep w-full">
                                ติดต่อเรา
                            </Link>
                        </div>

                    </div>

                </div>
            </div>

            {/* Bottom CTA */}
            <section className="py-20 bg-scholar-soft mt-12 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-scholar-deep mb-4">พร้อมที่จะเป็นส่วนหนึ่งของครอบครัวเราหรือยัง?</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">เปิดรับสมัครรอบ TCAS แล้ววันนี้ อย่ารอช้า โอกาสดีๆ รอคุณอยู่</p>
                    <a href="https://admission.crru.ac.th/" target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary text-white bg-scholar-accent border-none px-12 rounded-full shadow-xl hover:scale-105">
                        สมัครเรียน
                    </a>
                </div>
            </section>

        </div>
    );
}
