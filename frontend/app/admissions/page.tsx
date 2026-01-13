import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'ศูนย์รับสมัครนักศึกษา (Admission Center) - คณะสังคมศาสตร์ มรภ.เชียงราย',
    description: 'ศูนย์รวมข้อมูลการรับสมัครนักศึกษาใหม่ ระดับปริญญาตรี บัณฑิตศึกษา และหลักสูตรระยะสั้น คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
};

export default function AdmissionPage() {
    return (
        <div className="bg-white min-h-screen font-sans pb-20">
            {/* 1. Hero Banner */}
            <div className="relative h-[400px] lg:h-[500px] w-full">
                <Image
                    src="/images/admission-banner.png"
                    alt="Admission Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-scholar-deep/90 to-transparent flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl text-white space-y-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-scholar-accent text-white font-semibold tracking-wider text-sm shadow-lg">
                                ADMISSIONS 2026
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                                เปิดรับสมัครนักศึกษาใหม่
                                <span className="block text-scholar-gold mt-2">รอบ TCAS และ บัณฑิตศึกษา</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-white/90 font-light">
                                ร่วมเป็นส่วนหนึ่งของครอบครัวสังคมศาสตร์ สร้างสรรค์นวัตกรรมสังคมเพื่อการเปลี่ยนแปลงที่ยั่งยืน
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10">

                <Breadcrumb items={[{ label: 'ศูนย์รับสมัครนักศึกษา' }]} />

                {/* 2. Main Tracks (Education Levels) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {/* Bachelor */}
                    <Link href="https://admission.crru.ac.th/" target="_blank" className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-scholar-gold transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">ระดับปริญญาตรี</h2>
                        <p className="text-gray-500 mb-6 text-sm">รับสมัครผ่านระบบ TCAS สำหรับนักเรียน ม.6 / ปวช.</p>
                        <span className="mt-auto px-6 py-2 bg-scholar-deep text-white rounded-full text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ไปที่ระบบรับสมัคร (TCAS) &rarr;
                        </span>
                    </Link>

                    {/* Graduate */}
                    <Link href="https://orasis.crru.ac.th/gds_crru/index.php/main/home" target="_blank" className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-scholar-gold transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">ระดับบัณฑิตศึกษา</h2>
                        <p className="text-gray-500 mb-6 text-sm">ปริญญาโท และ ปริญญาเอก (ภาคปกติ / ภาคพิเศษ)</p>
                        <span className="mt-auto px-6 py-2 bg-scholar-deep text-white rounded-full text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ไปที่ระบบรับสมัคร (Graduate) &rarr;
                        </span>
                    </Link>

                    {/* Short Courses */}
                    <Link href="/academics/short-courses" className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-scholar-gold transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">หลักสูตรระยะสั้น</h2>
                        <p className="text-gray-500 mb-6 text-sm">Reskill, Upskill และการเรียนรู้ตลอดชีวิต (Credit Bank)</p>
                        <span className="mt-auto px-6 py-2 bg-scholar-deep text-white rounded-full text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ดูรายละเอียดหลักสูตร &rarr;
                        </span>
                    </Link>
                </div>
            </div>

            {/* 3. Media & PR (Brochure & Video) */}
            <section className="container mx-auto px-4 mt-20">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Video Section */}
                    <div className="lg:w-2/3 space-y-6">
                        <h3 className="text-2xl font-bold text-scholar-deep border-l-4 border-scholar-accent pl-4">
                            แนะนำคณะสังคมศาสตร์ CRRU
                        </h3>
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
                            {/* Placeholder Video Embed */}
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
                                title="แนะนำคณะสังคมศาสตร์"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="text-gray-600">
                            มารู้จักกับพวกเรา "สังคมศาสตร์เพื่อการพัฒนา" พร้อมหลักสูตรที่ตอบโจทย์โลกอนาคต ทั้งด้านสังคม วัฒนธรรม และนวัตกรรม
                        </p>
                    </div>

                    {/* Brochure / Banner Slider */}
                    <div className="lg:w-1/3 space-y-6">
                        <h3 className="text-2xl font-bold text-scholar-deep border-l-4 border-scholar-accent pl-4">
                            เอกสารประชาสัมพันธ์
                        </h3>
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                            <Image
                                src="/images/admission-brochure.png"
                                alt="Admission Brochure"
                                width={500}
                                height={700}
                                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-scholar-deep px-4 py-2 rounded-full font-bold shadow-lg">
                                    ดูภาพขยาย
                                </span>
                            </div>
                        </div>
                        <div className="bg-scholar-soft p-4 rounded-xl border border-scholar-gold/20">
                            <h4 className="font-bold text-scholar-deep mb-2">ดาวน์โหลดเอกสาร</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-scholar-accent">
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                                        คู่มือการสมัครเรียน TCAS 69
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-scholar-accent">
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                                        แผ่นพับแนะนำหลักสูตร (PDF)
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. Schedule Table */}
            <section className="container mx-auto px-4 mt-20 mb-12">
                <h3 className="text-2xl font-bold text-center text-scholar-deep mb-8">
                    <span className="border-b-4 border-scholar-accent pb-2">ปฏิทินการรับสมัคร</span>
                </h3>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-scholar-deep text-white">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-2xl">รอบการรับสมัคร</th>
                                <th className="px-6 py-4">ช่วงเวลา</th>
                                <th className="px-6 py-4">ช่องทาง</th>
                                <th className="px-6 py-4 rounded-tr-2xl">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Row 1 */}
                            <tr className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-scholar-deep block">TCAS รอบที่ 1 Portfolio</span>
                                    <span className="text-xs text-gray-500">ยื่นแฟ้มสะสมผลงาน</span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">1 ต.ค. - 15 พ.ย. 2568</td>
                                <td className="px-6 py-4 text-scholar-accent font-medium">Online</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">ปิดรับสมัคร</span>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="bg-blue-50/30 hover:bg-blue-50/80 transition-colors border-l-4 border-l-scholar-accent">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-scholar-deep block">TCAS รอบที่ 2 Quota</span>
                                    <span className="text-xs text-gray-500">โควตาภาคเหนือ / พื้นที่</span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">14 ก.พ. - 25 มี.ค. 2569</td>
                                <td className="px-6 py-4 text-scholar-accent font-medium">Online</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1 w-fit">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        กำลังเปิดรับ
                                    </span>
                                </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-scholar-deep block">TCAS รอบที่ 3 Admission</span>
                                    <span className="text-xs text-gray-500">สอบเข้า (A-Level)</span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">6 - 12 พ.ค. 2569</td>
                                <td className="px-6 py-4 text-scholar-accent font-medium">mytcas.com</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">ยังไม่เปิด</span>
                                </td>
                            </tr>
                            {/* Grad Row */}
                            <tr className="bg-purple-50 hover:bg-purple-100 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-purple-900 block">รับสมัคร บัณฑิตศึกษา (ป.โท-เอก)</span>
                                    <span className="text-xs text-purple-700">ภาคเรียนที่ 1/2569</span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">พ.ย. 68 - พ.ค. 69</td>
                                <td className="px-6 py-4 text-purple-700 font-medium">Walk-in / Online</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">เปิดรับสมัครตลอดปี</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}
