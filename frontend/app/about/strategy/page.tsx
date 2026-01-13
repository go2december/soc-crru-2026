import Link from 'next/link';
import React from 'react';

export default function StrategicPlanPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] font-sans text-scholar-text pb-20">
            {/* Hero Section */}
            <section className="relative h-[350px] w-full bg-scholar-deep flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/80 to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto anime-fade-up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-scholar-gold/20 text-scholar-gold border border-scholar-gold/30 mb-4 font-semibold tracking-wider backdrop-blur-sm">
                        STRATEGIC PLAN
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg">
                        แผนยุทธศาสตร์ 5 ปี <br />
                        <span className="text-scholar-gold text-2xl md:text-3xl mt-4 block font-normal">
                            (พ.ศ. 2565 - 2569) ฉบับทบทวน พ.ศ. 2566
                        </span>
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* Vision Wrapper */}
                    <div className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-scholar-gold/20 text-center mb-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-scholar-gold/5 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-scholar-deep/5 rounded-full -ml-10 -mb-10"></div>

                        <h2 className="text-sm font-bold text-scholar-gold uppercase tracking-widest mb-4">วิสัยทัศน์ (Vision)</h2>
                        <p className="text-2xl md:text-4xl font-bold text-scholar-deep leading-relaxed max-w-4xl mx-auto relative z-10">
                            “บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน”
                        </p>
                        <p className="text-gray-500 mt-4 italic">
                            (Integrating knowledge to produce graduates as social innovators for sustainable local development)
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-scholar-deep mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-scholar-accent rounded-full"></span>
                            พันธกิจ (Mission)
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                "ผลิตบัณฑิตที่เป็นนวัตกรมืออาชีพ มีทักษะเด่น มีความรู้ มีคุณธรรม และตอบสนองต่อการพัฒนาท้องถิ่นอย่างยั่งยืน",
                                "ผลิตผลงานวิจัยและงานสร้างสรรค์เพื่อการนำไปใช้ประโยชน์ในชุมชน ท้องถิ่น ประเทศ และภูมิภาคอาเซียน",
                                "ให้บริการวิชาการแก่สังคม เพื่อยกระดับคุณภาพชีวิตของประชาชนในท้องถิ่น และประเทศ",
                                "สืบสานและส่งเสริมศิลปวัฒนธรรมอันดีงามของท้องถิ่นและของชาติ",
                                "พัฒนาคณะให้เป็นองค์กรแห่งการเรียนรู้ที่มีคุณภาพและมีธรรมาภิบาล"
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-scholar-deep/10 text-scholar-deep flex items-center justify-center font-bold text-lg">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed pt-1">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strategic Issues Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-scholar-deep">ประเด็นยุทธศาสตร์ (Strategic Issues)</h2>
                            <div className="w-24 h-1 bg-scholar-accent mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    id: "1",
                                    title: "ยุทธศาสตร์ที่ 1",
                                    name: "การยกระดับคุณภาพการศึกษา",
                                    desc: "Elevating Education Quality",
                                    color: "bg-[#D9341C]",
                                    icon: "📚"
                                },
                                {
                                    id: "2",
                                    title: "ยุทธศาสตร์ที่ 2",
                                    name: "การพัฒนางานวิจัย นวัตกรรม และงานสร้างสรรค์",
                                    desc: "Research, Innovation, and Creative Works",
                                    color: "bg-[#B02815]",
                                    icon: "💡"
                                },
                                {
                                    id: "3",
                                    title: "ยุทธศาสตร์ที่ 3",
                                    name: "การพัฒนาท้องถิ่น",
                                    desc: "Local Development",
                                    color: "bg-[#8E2011]",
                                    icon: "🏡"
                                },
                                {
                                    id: "4",
                                    title: "ยุทธศาสตร์ที่ 4",
                                    name: "การพัฒนาระบบ กลไก และการบริหารจัดการ",
                                    desc: "System, Mechanism, and Management Development",
                                    color: "bg-[#6A180C]",
                                    icon: "⚙️"
                                }
                            ].map((strat, i) => (
                                <Link href={`/about/strategy/${strat.id}`} key={i} className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative group cursor-pointer block h-full`}>
                                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl text-white shadow-lg ${strat.color}`}>
                                        {strat.icon}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider text-scholar-gold mb-2 block`}>
                                        {strat.title}
                                    </span>
                                    <h3 className="text-lg font-bold text-scholar-deep mb-2 min-h-[56px] flex items-center">{strat.name}</h3>
                                    <p className="text-gray-500 text-sm mb-8">{strat.desc}</p>

                                    <div className="absolute bottom-6 right-6 text-scholar-deep opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-bold">
                                        ดูรายละเอียด
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="bg-scholar-deep/5 rounded-3xl p-10 md:p-14 border border-scholar-deep/10">
                        <h2 className="text-3xl font-bold text-scholar-deep mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-scholar-gold rounded-full"></span>
                            เป้าหมายความสำเร็จ (Goals)
                        </h2>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                "บัณฑิตมีความรู้ มีคุณธรรม มีความสามารถในการคิดเชิงสร้างสรรค์ คิดเชิงวิเคราะห์ และมีสมรรถนะวิชาชีพตรงตามความต้องการของผู้ใช้บัณฑิต",
                                "บุคลากรปฏิบัติงานอย่างมืออาชีพและได้รับการยอมรับจากหน่วยงานภายนอก",
                                "มีผลงานวิจัย นวัตกรรม และงานสร้างสรรค์ที่สามารถแก้ไขปัญหาและพัฒนาเชิงพื้นที่ และเกิดประโยชน์ต่อสาธารณชน",
                                "เครือข่ายความร่วมมือทั้งในและต่างประเทศมีความเข้มแข็ง สามารถสร้างประโยชน์ต่อท้องถิ่นร่วมกัน",
                                "มีการนำผลการดำเนินงานบริการวิชาการ โครงการพัฒนาท้องถิ่น โครงการตามยุทธศาสตร์ ไปใช้ประโยชน์ และสามารถถ่ายทอดสู่ผู้รับบริการอย่างเป็นรูปธรรม",
                                "เป็นองค์กรแห่งการเรียนรู้เพื่อการพัฒนาท้องถิ่น มีธรรมาภิบาล ใส่ใจต่อสิ่งแวดล้อม มีระบบการบริหารจัดการที่มีประสิทธิภาพ เป็นที่รู้จักและเป็นที่ยอมรับในระดับชาติ"
                            ].map((goal, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700 leading-relaxed">{goal}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
