
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            {/* Header */}
            <div className="bg-amber-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/png?text=CR+Studies+Banner')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">เกี่ยวกับศูนย์เชียงรายศึกษา</h1>
                    <p className="text-amber-100 text-lg max-w-2xl mx-auto">
                        มุ่งมั่นในการรวบรวม อนุรักษ์ และเผยแพร่องค์ความรู้อันทรงคุณค่าแห่งล้านนาตะวันออก
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-4xl">

                {/* History Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-stone-800 mb-6 border-l-4 border-amber-600 pl-4">
                        ความเป็นมา (History)
                    </h2>
                    <div className="prose prose-lg prose-stone max-w-none text-stone-600">
                        <p>
                            ศูนย์เชียงรายศึกษา ก่อตั้งขึ้นภายใต้คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                            โดยมีวัตถุประสงค์เพื่อเป็นศูนย์กลางในการรวบรวมข้อมูล ศึกษา และวิจัยเกี่ยวกับจังหวัดเชียงรายในทุกมิติ
                            ทั้งด้านประวัติศาสตร์ โบราณคดี ชาติพันธุ์ วัฒนธรรม และภูมิปัญญาท้องถิ่น
                        </p>
                        <p>
                            ตลอดระยะเวลาที่ผ่านมา ศูนย์ฯ ได้ดำเนินงานวิจัยและกิจกรรมทางวิชาการมากมาย
                            เพื่อสร้างความเข้าใจและตระหนักถึงคุณค่าของมรดกทางวัฒนธรรมแห่งล้านนา
                            พร้อมทั้งสนับสนุนการเรียนการสอนและการบริการวิชาการแก่ชุมชนและสังคม
                        </p>
                    </div>
                </section>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                        <h3 className="text-2xl font-bold text-amber-700 mb-4">วิสัยทัศน์ (Vision)</h3>
                        <p className="text-stone-600 italic">
                            "เป็นแหล่งเรียนรู้ชั้นนำด้านเชียงรายศึกษา ที่เชื่อมโยงอดีต ปัจจุบัน และอนาคต เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                        <h3 className="text-2xl font-bold text-amber-700 mb-4">พันธกิจ (Mission)</h3>
                        <ul className="space-y-3">
                            {[
                                'รวบรวมและจัดระบบข้อมูลสารสนเทศทางวัฒนธรรมเชียงราย',
                                'ส่งเสริมและสนับสนุนการวิจัยทางด้านสังคมศาสตร์และวัฒนธรรม',
                                'ให้บริการวิชาการและเผยแพร่องค์ความรู้แก่ชุมชน',
                                'สร้างเครือข่ายความร่วมมือทางวิชาการทั้งในและต่างประเทศ'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-stone-600">
                                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Structure Section */}
                <section>
                    <h2 className="text-3xl font-bold text-stone-800 mb-8 border-l-4 border-amber-600 pl-4">
                        โครงสร้างการบริหารงาน
                    </h2>
                    <div className="bg-white p-10 rounded-3xl shadow-lg border border-stone-100 text-center">
                        <div className="inline-block px-6 py-3 bg-amber-600 text-white font-bold rounded-lg mb-8 shadow-md">
                            ผู้อำนวยการศูนย์เชียงรายศึกษา
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-stone-300 -translate-y-4 w-4/5 mx-auto"></div>
                            <div className="hidden md:block absolute top-0 left-1/2 w-px h-4 bg-stone-300 -translate-y-4 -translate-x-1/2"></div>
                            <div className="hidden md:block absolute top-0 left-[10%] w-px h-4 bg-stone-300 -translate-y-4"></div>
                            <div className="hidden md:block absolute top-0 right-[10%] w-px h-4 bg-stone-300 -translate-y-4"></div>

                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                                <h4 className="font-bold text-stone-800 mb-2">ฝ่ายวิชาการและวิจัย</h4>
                                <p className="text-xs text-stone-500">ผลิตผลงานวิชาการและรวบรวมข้อมูล</p>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                                <h4 className="font-bold text-stone-800 mb-2">ฝ่ายประสานเครือข่าย</h4>
                                <p className="text-xs text-stone-500">สร้างความร่วมมือกับชุมชนและองค์กร</p>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                                <h4 className="font-bold text-stone-800 mb-2">ฝ่ายเผยแพร่และสารสนเทศ</h4>
                                <p className="text-xs text-stone-500">บริการวิชาการและสื่อดิทัล</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
