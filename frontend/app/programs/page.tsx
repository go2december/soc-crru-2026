import Link from 'next/link';
import { fetchPrograms, Program } from '@/lib/api';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
    searchParams: Promise<{
        level?: string;
    }>
}

export default async function ProgramsPage(props: Props) {
    const searchParams = await props.searchParams;
    const levelFilter = searchParams.level;

    // Fetch all programs
    const allPrograms = await fetchPrograms();

    // Filter by level if specified
    let programs = allPrograms;
    let pageTitle = 'หลักสูตรทั้งหมด';
    let pageSubtitle = 'เลือกหลักสูตรที่เหมาะกับคุณ';

    if (levelFilter === 'bachelor') {
        programs = allPrograms.filter(p => p.degreeLevel === 'BACHELOR');
        pageTitle = 'หลักสูตรปริญญาตรี';
        pageSubtitle = 'หลักสูตรระดับปริญญาตรี 4 ปี';
    } else if (levelFilter === 'master') {
        programs = allPrograms.filter(p => p.degreeLevel === 'MASTER');
        pageTitle = 'หลักสูตรปริญญาโท';
        pageSubtitle = 'หลักสูตรระดับบัณฑิตศึกษา (ปริญญาโท)';
    } else if (levelFilter === 'doctoral') {
        programs = allPrograms.filter(p => p.degreeLevel === 'DOCTORAL' || p.degreeLevel === 'PHD');
        pageTitle = 'หลักสูตรปริญญาเอก';
        pageSubtitle = 'หลักสูตรระดับบัณฑิตศึกษา (ปริญญาเอก)';
    }

    const getLevelBadge = (degreeLevel: string) => {
        switch (degreeLevel) {
            case 'BACHELOR':
                return <span className="badge badge-primary bg-blue-500 border-none text-white">ปริญญาตรี</span>;
            case 'MASTER':
                return <span className="badge badge-secondary bg-orange-500 border-none text-white">ปริญญาโท</span>;
            case 'DOCTORAL':
            case 'PHD':
                return <span className="badge badge-accent bg-purple-600 border-none text-white">ปริญญาเอก</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Hero Header */}
            <header className="relative py-20 bg-gradient-to-br from-scholar-deep via-scholar-deep to-[#0A2540] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-scholar-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-scholar-accent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-scholar-accent/20 text-scholar-gold text-sm font-semibold mb-4 tracking-wider">
                        ACADEMIC PROGRAMS
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{pageTitle}</h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">{pageSubtitle}</p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'หลักสูตร', href: '/programs' },
                    ...(levelFilter ? [{ label: pageTitle }] : [])
                ]} />

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 mt-6">
                    <Link
                        href="/programs"
                        className={`btn btn-sm ${!levelFilter ? 'btn-primary bg-scholar-deep border-scholar-deep' : 'btn-outline'}`}
                    >
                        ทั้งหมด
                    </Link>
                    <Link
                        href="/programs?level=bachelor"
                        className={`btn btn-sm ${levelFilter === 'bachelor' ? 'btn-primary bg-blue-500 border-blue-500' : 'btn-outline'}`}
                    >
                        ปริญญาตรี
                    </Link>
                    <Link
                        href="/programs?level=master"
                        className={`btn btn-sm ${levelFilter === 'master' ? 'btn-primary bg-orange-500 border-orange-500' : 'btn-outline'}`}
                    >
                        ปริญญาโท
                    </Link>
                    <Link
                        href="/programs?level=doctoral"
                        className={`btn btn-sm ${levelFilter === 'doctoral' ? 'btn-primary bg-purple-600 border-purple-600' : 'btn-outline'}`}
                    >
                        ปริญญาเอก
                    </Link>
                </div>

                {/* Programs Grid */}
                {programs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <Link
                                key={program.id}
                                href={`/programs/${program.code}`}
                                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Card Header */}
                                <div className="h-40 bg-gradient-to-br from-scholar-deep to-[#0A2540] relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-gold rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        {getLevelBadge(program.degreeLevel)}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors line-clamp-2">
                                        {program.nameTh}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {program.degreeTitleTh || program.degreeTitleEn}
                                    </p>
                                    {program.description && (
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                            {program.description}
                                        </p>
                                    )}
                                    <div className="flex items-center text-scholar-accent font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                        ดูรายละเอียด
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">ไม่พบหลักสูตร</h3>
                        <p className="text-gray-500">ยังไม่มีหลักสูตรในหมวดหมู่นี้</p>
                        <Link href="/programs" className="btn btn-primary bg-scholar-accent border-none mt-6">
                            ดูหลักสูตรทั้งหมด
                        </Link>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <section className="py-16 bg-scholar-soft mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-scholar-deep mb-4">ต้องการข้อมูลเพิ่มเติม?</h2>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        หากมีข้อสงสัยเกี่ยวกับหลักสูตร หรือต้องการคำปรึกษา สามารถติดต่อเราได้
                    </p>
                    <Link href="/contact" className="btn btn-primary bg-scholar-deep border-none px-8 rounded-full">
                        ติดต่อสอบถาม
                    </Link>
                </div>
            </section>
        </div>
    );
}
