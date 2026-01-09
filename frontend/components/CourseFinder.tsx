"use client";

import Link from 'next/link';

export default function CourseFinder() {
    return (
        <section className="py-20 bg-scholar-soft relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-scholar-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-scholar-gold/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Heading */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-scholar-accent font-bold tracking-wider uppercase text-sm mb-2 block">Discovery Your Path</span>
                    <h2 className="text-4xl font-bold text-scholar-deep mb-4">ค้นหาหลักสูตรที่ใช่สำหรับคุณ</h2>
                    <p className="text-gray-500 text-lg">
                        ไม่ว่าคุณจะเป็นนักเรียนที่มองหาปริญญาใบแรก หรือวัยทำงานที่ต้องการ Upskill <br className="hidden md:block" />
                        เรามีเส้นทางการเรียนรู้ที่หลากหลายรอคุณอยู่
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Card 1: Undergraduate (TCAS) */}
                    <Link href="/admissions/tcas" className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-50">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-scholar-deep" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
                        </div>
                        <div className="p-8">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-scholar-deep mb-6 group-hover:bg-scholar-deep group-hover:text-white transition-colors duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">ปริญญาตรี (TCAS)</h3>
                            <p className="text-gray-500 mb-6 line-clamp-2">สำหรับน้องๆ มัธยมศึกษาตอนปลาย ที่ต้องการศึกษาต่อในระดับปริญญาตรี 4 ปี</p>
                            <span className="flex items-center text-sm font-semibold text-scholar-deep group-hover:translate-x-2 transition-transform">
                                ดูสาขาวิชาที่เปิดรับ <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                    </Link>

                    {/* Card 2: Graduate Studies */}
                    <Link href="/admissions/grad" className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-50">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-scholar-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 16l-5 2.72L7 16v-3.73L12 15l5-2.73V16z" /></svg>
                        </div>
                        <div className="p-8">
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-scholar-accent mb-6 group-hover:bg-scholar-accent group-hover:text-white transition-colors duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">บัณฑิตศึกษา</h3>
                            <p className="text-gray-500 mb-6 line-clamp-2">ระดับปริญญาโท และปริญญาเอก เน้นการวิจัยและยุทธศาสตร์การพัฒนาภูมิภาค</p>
                            <span className="flex items-center text-sm font-semibold text-scholar-accent group-hover:translate-x-2 transition-transform">
                                ดูหลักสูตร ป.โท-เอก <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                    </Link>

                    {/* Card 3: Short Courses & Credit Bank */}
                    <Link href="/academics/short-courses" className="group relative bg-scholar-deep rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-scholar-deep">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-scholar-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" /></svg>
                        </div>
                        <div className="p-8 relative z-10 text-white">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-scholar-gold backdrop-blur-sm group-hover:bg-scholar-gold group-hover:text-scholar-deep transition-colors duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <span className="badge badge-warning bg-scholar-gold text-scholar-deep border-none font-bold">New</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-scholar-gold transition-colors">หลักสูตรระยะสั้น</h3>
                            <p className="text-gray-300 mb-6 line-clamp-2">เพิ่มทักษะ Reskill/Upskill สะสมหน่วยกิต (Credit Bank) ได้จริง</p>
                            <span className="flex items-center text-sm font-semibold text-scholar-gold group-hover:translate-x-2 transition-transform">
                                ลงทะเบียนเรียนทันที <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
}
