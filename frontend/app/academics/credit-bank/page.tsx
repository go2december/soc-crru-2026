import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function CreditBankPage() {
    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Header / Hero */}
            <div className="bg-scholar-deep text-white py-16 px-4">
                <div className="container mx-auto">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'ระบบคลังหน่วยกิต (Credit Bank)' }]} />
                    <div className="flex flex-col md:flex-row items-center gap-8 mt-8">
                        <div className="flex-1">
                            <span className="badge badge-warning bg-scholar-gold text-scholar-deep border-none mb-4 font-bold">New Ecosystem</span>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">ระบบคลังหน่วยกิต <br /> (Credit Bank)</h1>
                            <p className="text-xl text-gray-300 mb-8">
                                "เรียนรู้ สะสม เทียบโอน" <br />
                                เปิดโอกาสให้คนทุกวัยสะสมหน่วยกิตจากการเรียนรู้ตลอดชีวิต เพื่อขอรับปริญญาบัตรเมื่อมีคุณสมบัติครบถ้วน
                            </p>
                            <div className="flex gap-4">
                                <Link href="/register" className="btn btn-primary bg-scholar-accent border-none text-white rounded-full px-8">สมัครสมาชิกคลังหน่วยกิต</Link>
                                <a href="#how-it-works" className="btn btn-outline text-white hover:bg-white hover:text-scholar-deep rounded-full px-8">ขั้นตอนการใช้งาน</a>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-sm border border-white/20">
                                <Image
                                    src="https://cdn-icons-png.flaticon.com/512/2997/2997295.png"
                                    alt="Credit Bank Icon"
                                    width={200}
                                    height={200}
                                    className="object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-scholar-deep mb-4">ขั้นตอนการสะสมหน่วยกิต</h2>
                    <p className="text-gray-500">ง่ายๆ เพียง 4 ขั้นตอน สู่ความสำเร็จตามเป้าหมายของคุณ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { step: 1, title: 'ลงทะเบียน', desc: 'สมัครสมาชิกในระบบคลังหน่วยกิตออนไลน์', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        { step: 2, title: 'เลือกเรียน', desc: 'ลงทะเบียนเรียนวิชา หรืออบรมหลักสูตรระยะสั้นที่สนใจ', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                        { step: 3, title: 'ประเมินผล', desc: 'ผ่านการวัดผลหรือเทียบโอนประสบการณ์การทำงาน', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { step: 4, title: 'รับใบเซอร์ฯ/ปริญญา', desc: 'เมื่อสะสมหน่วยกิตครบตามเกณฑ์หลักสูตร', icon: 'M12 14l9-5-9-5-9 5 9 5z' }
                    ].map((item) => (
                        <div key={item.step} className="text-center p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                            <div className="absolute top-0 left-0 bg-scholar-soft w-16 h-16 rounded-br-3xl flex items-center justify-center text-xl font-bold text-scholar-deep">
                                {item.step}
                            </div>
                            <div className="w-16 h-16 mx-auto mt-8 mb-6 bg-scholar-accent/10 rounded-full flex items-center justify-center text-scholar-accent group-hover:bg-scholar-accent group-hover:text-white transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-scholar-deep mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits & Call to Action */}
            <section className="bg-scholar-soft py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-12 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-scholar-deep mb-6">สิทธิประโยชน์ที่คุณจะได้รับ</h2>
                            <ul className="space-y-4">
                                {[
                                    'ลดเวลาเรียนในระบบปกติ',
                                    'เทียบโอนประสบการณ์ทำงานเป็นหน่วยกิตได้',
                                    'เรียนรู้ตามความสนใจ ไม่จำกัดเวลาและสถานที่',
                                    'ค่าธรรมเนียมถูกลง จ่ายตามวิชาที่เรียน',
                                    'ได้รับทั้งประกาศนียบัตร (Non-Degree) และปริญญาบัตร (Degree)'
                                ].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-gray-700 font-medium">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/academics/short-courses" className="text-scholar-accent font-bold hover:underline flex items-center">
                                    ค้นหาหลักสูตรที่เปิดรับสะสมหน่วยกิต <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-scholar-deep relative min-h-[300px]">
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop"
                                alt="Students"
                                fill
                                className="object-cover opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
