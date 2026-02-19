
import AboutHeader from '@/components/chiang-rai-studies/AboutHeader';
import { User, Users, Shield, Crown, Network, BookOpen, Share2, FileText, Monitor, Lightbulb, Landmark, Theater, Globe } from 'lucide-react';

export default function StructurePage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20 font-kanit scroll-smooth">
            <AboutHeader
                title="โครงสร้างองค์กร (Organization)"
                subtitle="แผนผังโครงสร้างการบริหารงานศูนย์เชียงรายศึกษา"
            />

            <div className="container mx-auto px-4 py-16 max-w-7xl overflow-x-auto">
                <div className="min-w-[1000px] flex flex-col items-center pt-8">

                    {/* Level 1: Executive & Oversight Layer */}
                    <div className="flex items-center justify-center gap-20 mb-20 relative">

                        {/* Left Wing: Committee (Oversight) */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-purple-200 text-center w-64 relative group hover:shadow-md transition-all z-10">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-50 text-purple-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-100">Oversight</span>
                                <div className="w-12 h-12 bg-purple-50 rounded-full mx-auto mb-3 flex items-center justify-center text-purple-600">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-stone-700">คณะกรรมการ</h3>
                                <p className="text-stone-400 text-xs mt-1">Committee</p>
                            </div>
                        </div>

                        {/* Dashed Connector Left */}
                        <div className="hidden md:block w-16 border-t-2 border-dashed border-stone-300 relative top-0"></div>

                        {/* Center: Director (Executive) */}
                        <div className="flex flex-col items-center relative z-20 scale-110">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl border-t-8 border-[#2e1065] text-center w-80 relative group hover:-translate-y-1 transition-transform">
                                <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center text-[#2e1065] shadow-inner">
                                    <Crown size={36} />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-800 mb-1">ผู้อำนวยการ</h3>
                                <p className="text-[#2e1065] text-sm font-medium">Director</p>

                                {/* Bottom Solid Connector */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-stone-800"></div>
                            </div>
                        </div>

                        {/* Dashed Connector Right */}
                        <div className="hidden md:block w-16 border-t-2 border-dashed border-stone-300 relative top-0"></div>

                        {/* Right Wing: Advisory (Consulting) */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-orange-200 text-center w-64 relative group hover:shadow-md transition-all z-10">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-50 text-orange-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-100">Consulting</span>
                                <div className="w-12 h-12 bg-orange-50 rounded-full mx-auto mb-3 flex items-center justify-center text-orange-600">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-stone-700">ที่ปรึกษา</h3>
                                <p className="text-stone-400 text-xs mt-1">Advisory Board</p>
                            </div>
                        </div>
                    </div>

                    {/* Level 2: Deputy Director */}
                    <div className="flex flex-col items-center mb-16 relative z-10">
                        {/* Top Line Connector matched to Director's bottom line */}
                        <div className="bg-white p-5 rounded-3xl shadow-md border-2 border-stone-100 text-center w-72 hover:border-orange-200 transition-colors">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl mx-auto mb-3 flex items-center justify-center text-orange-500">
                                <User size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-stone-700">รองผู้อำนวยการ</h4>
                            <p className="text-stone-400 text-xs uppercase tracking-wide mt-1">Deputy Director</p>
                        </div>
                        {/* Bottom Connector to 3 branches */}
                        <div className="h-10 w-0.5 bg-stone-300"></div>
                    </div>

                    {/* Level 3: Departments Tree */}
                    <div className="relative w-full max-w-6xl">
                        {/* Horizontal Distribution Line */}
                        <div className="absolute top-0 left-[16.66%] right-[16.66%] h-8 border-t-2 border-l-2 border-r-2 border-stone-300 rounded-t-2xl"></div>

                        {/* Center vertical line for middle item */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-stone-300"></div>

                        <div className="grid grid-cols-3 gap-8 pt-8">

                            {/* Branch 1: Academic */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-200 w-full hover:shadow-lg transition-all h-full">
                                    <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="font-bold text-[#2e1065] text-lg">ฝ่ายวิชาการ</h5>
                                            <span className="text-xs text-stone-400">Academic Affairs</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {[
                                            { label: "ประวัติศาสตร์", icon: <Landmark size={14} /> },
                                            { label: "โบราณคดี", icon: <Share2 size={14} /> },
                                            { label: "วัฒนธรรมและประเพณี", icon: <Globe size={14} /> },
                                            { label: "ศิลปะการแสดง", icon: <Theater size={14} /> },
                                            { label: "ภูมิปัญญาท้องถิ่น วิถีชีวิต และอาชีพ", icon: <Lightbulb size={14} /> }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-stone-600 text-sm bg-stone-50 p-2 rounded-lg">
                                                <div className="mt-1 text-blue-400 shrink-0">{item.icon}</div>
                                                <span className="leading-tight">{item.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Branch 2: Network */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-200 w-full hover:shadow-lg transition-all h-full">
                                    <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                                        <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shrink-0">
                                            <Network size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="font-bold text-[#2e1065] text-lg">ฝ่ายประสานเครือข่าย</h5>
                                            <span className="text-xs text-stone-400">Network Coordination</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {[
                                            "เครือข่ายภาครัฐ",
                                            "เครือข่ายภาคเอกชน",
                                            "เครือข่ายภาคประชาสังคม"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-stone-600 text-sm bg-stone-50 p-3 rounded-lg">
                                                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Branch 3: Dissemination */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-200 w-full hover:shadow-lg transition-all h-full">
                                    <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                                            <Monitor size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="font-bold text-[#2e1065] text-lg">ฝ่ายเผยแพร่ข้อมูล</h5>
                                            <span className="text-xs text-stone-400">Information Dissemination</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {[
                                            "ฐานข้อมูลด้านวิชาการ",
                                            "สื่อสิ่งพิมพ์เผยแพร่",
                                            "กิจกรรมด้านวิชาการ"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-stone-600 text-sm bg-stone-50 p-3 rounded-lg">
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
