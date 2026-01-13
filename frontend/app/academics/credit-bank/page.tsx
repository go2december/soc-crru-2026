import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function CreditBankPage() {
    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                        alt="Lifelong Learning"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-scholar-deep via-scholar-deep/90 to-scholar-deep/60" />
                </div>

                <div className="container mx-auto px-4 relative z-10 py-12">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'ระบบคลังหน่วยกิต' }]} />

                    <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
                        <div className="lg:w-3/5 text-white">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse"></span>
                                New Ecosystem
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                ระบบคลังหน่วยกิต <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-scholar-gold to-white">
                                    Credit Bank System
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed font-light">
                                "เรียนรู้ สะสม เทียบโอน" <br />
                                เปิดโอกาสให้คนทุกวัยสะสมหน่วยกิตจากการเรียนรู้ตลอดชีวิต เพื่อขอรับปริญญาบัตรเมื่อมีคุณสมบัติครบถ้วน
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/register"
                                    className="btn border-none bg-gradient-to-r from-scholar-accent to-red-600 text-white rounded-full px-8 hover:shadow-lg hover:shadow-red-600/30 transition-all transform hover:-translate-y-1"
                                >
                                    สมัครสมาชิกคลังหน่วยกิต
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-scholar-deep rounded-full px-8"
                                >
                                    ขั้นตอนการใช้งาน
                                </a>
                            </div>
                        </div>
                        <div className="lg:w-2/5 hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-scholar-gold/20 rounded-full blur-3xl animate-pulse"></div>
                                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
                                    <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                        <div className="w-12 h-12 rounded-full bg-scholar-gold flex items-center justify-center text-scholar-deep font-bold text-xl">
                                            A+
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Total Credits</div>
                                            <div className="text-2xl font-bold text-white">สะสมได้ไม่จำกัด</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Reskill</span>
                                            <span className="text-scholar-gold">Available</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div className="bg-scholar-gold h-2 rounded-full w-full"></div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Upskill</span>
                                            <span className="text-scholar-gold">Available</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div className="bg-scholar-gold h-2 rounded-full w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-scholar-accent font-bold tracking-widest uppercase text-sm mb-2 block">Process Flow</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-scholar-deep mb-6">ขั้นตอนการสะสมหน่วยกิต</h2>
                        <p className="text-gray-500 text-lg">ง่ายๆ เพียง 4 ขั้นตอน สู่ความสำเร็จตามเป้าหมายของคุณ ไม่ว่าจะเป็นการเรียนเพื่อปริญญา หรือเพื่อพัฒนาทักษะ</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'ลงทะเบียน', desc: 'สมัครสมาชิกในระบบคลังหน่วยกิตออนไลน์ (Credit Bank System)', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
                            { step: '02', title: 'เลือกเรียน', desc: 'ลงทะเบียนเรียนวิชา หรืออบรมหลักสูตรระยะสั้นที่สนใจ', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                            { step: '03', title: 'ประเมินผล', desc: 'ผ่านการวัดผลหรือเทียบโอนประสบการณ์การทำงาน (RPL)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { step: '04', title: 'รับใบรับรอง', desc: 'เมื่อสะสมหน่วยกิตครบตามเกณฑ์ สามารถขอรับปริญญาบัตรได้ทันที', icon: 'M12 14l9-5-9-5-9 5 9 5z' }
                        ].map((item, index) => (
                            <div key={index} className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-scholar-gold/30 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-10 font-black text-6xl text-scholar-deep group-hover:opacity-20 transition-opacity select-none">
                                    {item.step}
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-scholar-deep/5 text-scholar-deep flex items-center justify-center mb-6 group-hover:bg-scholar-deep group-hover:text-white transition-colors duration-300">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-scholar-accent transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits & CTA */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop"
                                    alt="Benefits of Credit Bank"
                                    width={800}
                                    height={600}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-scholar-deep/40 mix-blend-multiply"></div>
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">รับรองโดยสภาฯ</div>
                                        <div className="text-xs text-gray-500">ผ่านการรับรองมาตรฐาน</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <span className="text-scholar-gold font-bold tracking-widest uppercase text-sm mb-2 block">Benefits</span>
                            <h2 className="text-4xl font-bold text-scholar-deep mb-8">สิทธิประโยชน์ที่คุณจะได้รับ</h2>

                            <ul className="space-y-6 mb-10">
                                {[
                                    { title: 'ลดเวลาเรียนในระบบปกติ', desc: 'สามารถนำหน่วยกิตสะสมไปเทียบโอนเพื่อลดระยะเวลาศึกษา' },
                                    { title: 'เทียบโอนประสบการณ์ (RPL)', desc: 'เปลี่ยนประสบการณ์การทำงานจริงให้เป็นหน่วยกิตวิชาการ' },
                                    { title: 'Anywhere, Anytime', desc: 'เรียนรู้ได้ตามความสนใจ โดยไม่จำกัดเวลาและสถานที่' },
                                    { title: 'Save Cost', desc: 'ค่าธรรมเนียมคุ้มค่า จ่ายเฉพาะวิชาที่ลงทะเบียนเรียน' },
                                    { title: 'Degree & Non-Degree', desc: 'ได้รับทั้งประกาศนียบัตรรายวิชา และปริญญาบัตรเมื่อครบหลักสูตร' }
                                ].map((benefit, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-scholar-accent/10 flex items-center justify-center text-scholar-accent mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-scholar-deep">{benefit.title}</h4>
                                            <p className="text-gray-500 text-sm mt-1">{benefit.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div>
                                <Link
                                    href="/academics/short-courses"
                                    className="inline-flex items-center gap-3 text-white bg-scholar-deep hover:bg-scholar-deep/90 px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
                                >
                                    <span>ค้นหาหลักสูตรที่เปิดรับ</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
