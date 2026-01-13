import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function AcademicsOverview() {
    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Page Header */}
            <header className="relative h-[300px] flex items-center justify-center bg-scholar-deep overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                        alt="Academics"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep to-transparent"></div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">การจัดการศึกษา</h1>
                    <p className="text-xl text-yellow-400 font-light tracking-widest uppercase">Academics</p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'ภาพรวม' }]} />

                {/* Main Content: Philosophy */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <span className="text-scholar-accent font-bold tracking-widest uppercase text-sm mb-4 block">Education First</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-scholar-deep mb-6">สร้าง "นวัตกรสังคม" ผู้เรียนรู้ตลอดชีวิต</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            คณะสังคมศาสตร์ มุ่งเน้นการจัดการศึกษาที่เอาผู้เรียนเป็นศูนย์กลาง (Learner-Centric)
                            ผสมผสานองค์ความรู้ทางวิชาการเข้ากับการปฏิบัติจริงในพื้นที่ (Area-Based Learning)
                            เพื่อผลิตบัณฑิตที่มีทักษะศตวรรษที่ 21 และจิตวิญญาณในการรับใช้สังคม
                        </p>
                    </div>

                    {/* Learning Outcomes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {/* Card 1 */}
                        <div className="bg-scholar-soft p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-scholar-deep mb-3">Social Innovator</h3>
                            <p className="text-gray-500">สามารถคิดวิเคราะห์และสร้างสรรค์นวัตกรรมสังคมเพื่อแก้ปัญหาในชุมชนได้จริง</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-scholar-soft p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-scholar-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-scholar-deep mb-3">Global Mindset & Local Action</h3>
                            <p className="text-gray-500">เข้าใจบริบทโลกแต่ไม่ทิ้งรากเหง้าท้องถิ่น สามารถเชื่อมโยงความรู้สู่การพัฒนาภูมิภาค</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-scholar-soft p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-scholar-deep mb-3">Lifelong Learner</h3>
                            <p className="text-gray-500">มีทักษะการเรียนรู้ตลอดชีวิต พร้อมปรับตัวและพัฒนาตนเองอย่างต่อเนื่อง (Reskill/Upskill)</p>
                        </div>
                    </div>

                    {/* Departments / Programs Navigation */}
                    {/* Departments / Programs Navigation */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-8 bg-scholar-accent rounded-full"></div>
                            <h2 className="text-2xl font-bold text-scholar-deep">หลักสูตรของเรา (Our Programs)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Bachelor Degrees */}
                            <div className="bg-white border rounded-xl p-6 shadow-sm hover:border-scholar-accent transition-colors lg:col-span-2">
                                <h3 className="text-lg font-bold text-scholar-deep mb-4 border-b pb-2">ระดับปริญญาตรี (Bachelor's Degrees)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link href="/programs/social-sci" className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold group-hover:text-scholar-accent">สาขาวิชาสังคมศาสตร์</span>
                                            <span className="text-xs text-gray-500">Social Sciences</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>

                                    <Link href="/programs/social-dev" className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold group-hover:text-scholar-accent">สาขาวิชานวัตกรรมการพัฒนาสังคม</span>
                                            <span className="text-xs text-gray-500">Social Development Innovation</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>

                                    <Link href="/programs/home-eco" className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold group-hover:text-scholar-accent">สาขาวิชาคหกรรมศาสตร์</span>
                                            <span className="text-xs text-gray-500">Home Economics</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>

                                    <Link href="/programs/social-psych" className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold group-hover:text-scholar-accent">สาขาวิชาจิตวิทยาสังคม</span>
                                            <span className="text-xs text-gray-500">Social Psychology</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>

                                    <Link href="/programs/gis" className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold group-hover:text-scholar-accent">สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ</span>
                                            <span className="text-xs text-gray-500">Geography and Geo-Informatics</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Graduate & Short Courses */}
                            <div className="space-y-6">
                                <div className="bg-white border rounded-xl p-6 shadow-sm hover:border-scholar-gold transition-colors">
                                    <h3 className="text-lg font-bold text-scholar-deep mb-4 border-b pb-2">ระดับบัณฑิตศึกษา (Graduate)</h3>
                                    <div className="space-y-3">
                                        <Link href="/programs/regional-dev-ma" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-scholar-gold/10 flex items-center justify-center text-scholar-gold font-bold text-xs group-hover:bg-scholar-gold group-hover:text-white transition-colors">MA</div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-scholar-deep">ป.โท ยุทธศาสตร์การพัฒนาภูมิภาค</span>
                                        </Link>
                                        <Link href="/programs/regional-dev-phd" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-scholar-deep/10 flex items-center justify-center text-scholar-deep font-bold text-xs group-hover:bg-scholar-deep group-hover:text-white transition-colors">PhD</div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-scholar-deep">ป.เอก ยุทธศาสตร์การพัฒนาภูมิภาค</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-scholar-deep to-gray-900 text-white rounded-xl p-6 shadow-md relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-gold/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        Lifelong Learning
                                        <span className="badge badge-warning bg-scholar-gold text-scholar-deep border-none text-xs">Recommended</span>
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4 leading-relaxed">พัฒนาทักษะใหม่ด้วยหลักสูตรระยะสั้น และระบบสะสมหน่วยกิต (Credit Bank)</p>
                                    <div className="flex gap-2">
                                        <Link href="/academics/credit-bank" className="btn btn-sm bg-scholar-gold border-none text-scholar-deep hover:bg-white flex-1">
                                            Credit Bank
                                        </Link>
                                        <Link href="/academics/short-courses" className="btn btn-sm btn-outline text-white hover:bg-white hover:text-scholar-deep flex-1">
                                            ดูคอร์ส
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
}
