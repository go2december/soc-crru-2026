import Link from 'next/link';
import Image from 'next/image';

export default function HomeEcoPage() {
    return (
        <div className="min-h-screen bg-scholar-deep/5 font-sans">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop"
                        alt="Home Economics"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/80 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <span className="inline-block px-3 py-1 bg-scholar-gold/20 text-scholar-gold border border-scholar-gold rounded-full text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
                        Department of Home Economics
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-scholar-gold/50">
                            สาขาวิชาคหกรรมศาสตร์
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-white/80 font-light leading-relaxed">
                        พัฒนาทักษะวิชาชีพคหกรรมศาสตร์สู่ความเป็นเลิศ โดยแบ่งเป็น 2 วิชาเอกที่เน้นศักยภาพเฉพาะด้าน
                        ทั้งด้านอาหารและการบริการระดับมาตรฐานสากล และด้านคหกรรมศาสตร์ประยุกต์
                    </p>
                </div>
            </section>

            {/* Selection Section */}
            <section className="container mx-auto px-4 py-20 -mt-12 relative z-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: Culinary */}
                    <Link href="/programs/home-eco/culinary" className="group">
                        <div className="h-full bg-[#FDFBF7] dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-transparent hover:border-scholar-gold/30 hover:shadow-2xl hover:shadow-scholar-gold/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />

                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-scholar-gold/10 text-scholar-gold flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-scholar-gold group-hover:text-white transition-all duration-300 shadow-sm">
                                    CU
                                </div>
                                <h3 className="text-2xl font-bold text-scholar-deep dark:text-white mb-3 group-hover:text-scholar-accent transition-colors">
                                    วิชาเอกการประกอบอาหารและบริการ
                                </h3>
                                <p className="text-sm font-medium text-scholar-gold uppercase tracking-wider mb-4 opacity-80">
                                    Culinary and Service
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    เน้นทักษะด้านอาหารไทยและนานาชาติ การบริการ และการจัดเลี้ยง โดยผู้จบหลักสูตรจะสอบมาตรฐานอาหารไทยระดับหนึ่ง
                                </p>
                            </div>

                            <div className="flex items-center text-scholar-accent font-bold group-hover:translate-x-2 transition-transform">
                                <span>ดูรายละเอียดหลักสูตร</span>
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: Applied */}
                    <Link href="/programs/home-eco/applied" className="group">
                        <div className="h-full bg-[#FDFBF7] dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-transparent hover:border-scholar-gold/30 hover:shadow-2xl hover:shadow-scholar-gold/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />

                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-scholar-gold/10 text-scholar-gold flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-scholar-gold group-hover:text-white transition-all duration-300 shadow-sm">
                                    AP
                                </div>
                                <h3 className="text-2xl font-bold text-scholar-deep dark:text-white mb-3 group-hover:text-scholar-accent transition-colors">
                                    วิชาเอกคหกรรมศาสตร์ประยุกต์
                                </h3>
                                <p className="text-sm font-medium text-scholar-gold uppercase tracking-wider mb-4 opacity-80">
                                    Applied Home Economics
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    เน้นงานคหกรรมศาสตร์รอบด้าน เช่น การจัดดอกไม้ ออกแบบแฟชั่น ตัดเย็บ และการแกะสลักผักผลไม้
                                </p>
                            </div>

                            <div className="flex items-center text-scholar-accent font-bold group-hover:translate-x-2 transition-transform">
                                <span>ดูรายละเอียดหลักสูตร</span>
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                </div>
            </section>
        </div>
    );
}
