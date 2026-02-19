
import AboutHeader from '@/components/chiang-rai-studies/AboutHeader';
import { Flag, CheckCircle, Globe, Users, BookOpen, Layers, PenTool, Radio } from 'lucide-react';

export default function GoalsMissionPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20 font-kanit scroll-smooth">
            <AboutHeader
                title="เป้าหมายและกิจกรรมหลัก"
                subtitle="ขับเคลื่อนเชียงรายศึกษา สู่การอนุรักษ์และพัฒนาที่ยั่งยืน"
            />

            <div className="container mx-auto px-4 py-16 max-w-7xl">

                {/* Section 1: Goals (เป้าหมาย) */}
                <section className="mb-24">
                    <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                        {/* Core Goal Highlight */}
                        <div className="w-full lg:w-4/12 bg-[#2e1065] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-300 text-xs font-bold uppercase tracking-widest mb-8">
                                    <Flag size={14} /> 4 Strategic Goals
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight drop-shadow-lg">
                                    เป้าหมาย<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">การดำเนินงาน</span>
                                </h2>
                                <p className="text-purple-200 font-light leading-relaxed">
                                    มุ่งเน้นการสร้างฐานข้อมูลดิจิทัล การเผยแพร่องค์ความรู้ การสร้างเครือข่าย และการผลิตผลงานวิชาการที่ได้มาตรฐาน
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3 text-sm text-purple-300">
                                    <CheckCircle size={16} className="text-orange-400" />
                                    <span>Digital Database</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-purple-300 mt-2">
                                    <CheckCircle size={16} className="text-orange-400" />
                                    <span>Knowledge Dissemination</span>
                                </div>
                            </div>
                        </div>

                        {/* Goal Details & 5 Identities */}
                        <div className="w-full lg:w-8/12 space-y-8">
                            {/* Goal 2: 5 Identities Highlight */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-purple-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-orange-50 w-32 h-32 rounded-bl-[5rem] -mr-8 -mt-8"></div>
                                <h3 className="text-xl font-bold text-[#2e1065] mb-6 relative z-10">เผยแพร่องค์ความรู้ 5 อัตลักษณ์นครเชียงราย</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                                    {[
                                        "ประวัติศาสตร์",
                                        "โบราณคดี",
                                        "วัฒนธรรม ความเชื่อ",
                                        "ศิลปะการแสดง",
                                        "วิถีชีวิตและอาชีพ"
                                    ].map((identity, i) => (
                                        <div key={i} className="bg-stone-50 hover:bg-purple-50 p-3 rounded-xl text-stone-600 hover:text-purple-700 text-sm font-medium transition-colors text-center border border-stone-100 flex items-center justify-center h-16">
                                            {identity}
                                        </div>
                                    ))}
                                    <div className="bg-orange-100/50 p-3 rounded-xl text-orange-600 text-sm font-bold flex items-center justify-center h-16 border border-orange-100">
                                        + 5 Identities
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                                    <h4 className="font-bold text-lg text-stone-800 mb-2">สร้างเครือข่ายความร่วมมือ</h4>
                                    <p className="text-sm text-stone-500 font-light">
                                        ระหว่างภาครัฐ เอกชน ประชาสังคม และชุมชน เพื่อแลกเปลี่ยนเรียนรู้ทางวิชาการ
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                                    <h4 className="font-bold text-lg text-stone-800 mb-2">ผลิตผลงานวิชาการ</h4>
                                    <p className="text-sm text-stone-500 font-light">
                                        งานวิจัย และสื่อที่เกี่ยวกับวัฒนธรรมและภูมิปัญญาท้องถิ่นในประเด็น 5 อัตลักษณ์
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Main Activities (กิจกรรมหลัก) */}
                <section>
                    <div className="bg-gradient-to-br from-stone-100 to-white rounded-[4rem] p-8 md:p-12 relative overflow-hidden border border-stone-100">
                        <div className="text-center mb-16">
                            <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block text-xs">Core Actions</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#2e1065]">กิจกรรมหลัก (Main Activities)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Layers size={24} />,
                                    title: "สร้างฐานข้อมูลดิจิทัล",
                                    desc: "รวบรวมข้อมูลประวัติศาสตร์และวัฒนธรรมเชียงรายอย่างเป็นระบบ"
                                },
                                {
                                    icon: <BookOpen size={24} />,
                                    title: "ผลิตหลักสูตรอบรม",
                                    desc: "จัดอบรมและสัมมนาในหัวข้อที่เกี่ยวข้องเพื่อถ่ายทอดองค์ความรู้"
                                },
                                {
                                    icon: <PenTool size={24} />,
                                    title: "ผลิตสื่อมัลติมีเดีย",
                                    desc: "เผยแพร่หนังสือและสื่อสร้างสรรค์เกี่ยวกับวัฒนธรรมท้องถิ่น"
                                },
                                {
                                    icon: <Radio size={24} />,
                                    title: "สนับสนุนงานวิจัย",
                                    desc: "ส่งเสริมโครงการอนุรักษ์และการศึกษาเกี่ยวกับจังหวัดเชียงราย"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all border border-stone-50 group text-center">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-[#2e1065] transition-colors">{item.title}</h3>
                                    <p className="text-sm text-stone-500 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
