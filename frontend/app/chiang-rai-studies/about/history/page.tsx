
import AboutHeader from '@/components/chiang-rai-studies/AboutHeader';
import { BookOpen, Calendar, Award, Landmark } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20 font-kanit scroll-smooth">
            <AboutHeader
                title="ความเป็นมา (History)"
                subtitle="จากรากฐานทางวัฒนธรรม สู่ศูนย์กลางการเรียนรู้ระดับภูมิภาค"
            />

            <div className="container mx-auto px-4 py-16 max-w-5xl">

                {/* Introduction / Origin */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-purple-600 rounded-[2rem] rotate-3 opacity-20 blur-lg group-hover:rotate-6 transition-transform duration-500"></div>
                            <div className="aspect-[4/3] bg-stone-200 rounded-[2rem] relative overflow-hidden shadow-xl border-4 border-white">
                                {/* Placeholder for historical image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400">
                                    <Landmark size={64} opacity={0.5} />
                                    <span className="sr-only">Historical Building Image</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                                    <p className="font-bold text-lg">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
                                <Calendar size={14} />
                                <span>Established 2024</span>
                            </div>
                            <h2 className="text-3xl font-bold text-[#2e1065] leading-tight">
                                หลักการและเหตุผล<br />
                                <span className="text-orange-500">การจัดตั้งเครือข่ายความร่วมมือ</span>
                            </h2>
                            <p className="text-stone-600 text-lg leading-relaxed font-light">
                                จังหวัดเชียงรายเป็นหนึ่งในจังหวัดสำคัญทางภาคเหนือของประเทศไทยที่มีประวัติศาสตร์ยาวนานและวัฒนธรรมที่หลากหลาย
                                ทั้งในด้านประเพณี ความเชื่อ ศิลปะการแสดง และภูมิปัญญาท้องถิ่น ซึ่งเป็นเอกลักษณ์ที่สะท้อนตัวตนและอัตลักษณ์ของชุมชนในพื้นที่
                            </p>
                            <p className="text-stone-600 text-lg leading-relaxed font-light">
                                อย่างไรก็ตาม การเปลี่ยนแปลงทางสังคม เศรษฐกิจ และเทคโนโลยีที่รวดเร็วในยุคปัจจุบัน ได้ส่งผลกระทบต่อการสืบสานและการอนุรักษ์องค์ความรู้
                                ที่เกี่ยวกับจังหวัดเชียงรายโดยเฉพาะอย่างยิ่งข้อมูลที่ยังไม่ได้รับการรวบรวม บันทึก จัดระบบ และเผยแพร่อย่างเป็นระบบ
                                การจัดตั้ง <strong>ศูนย์เชียงรายศึกษา</strong> จึงมีความสำคัญในการรวบรวม จัดระบบข้อมูลองค์ความรู้ อนุรักษ์ และเผยแพร่ข้อมูลเหล่านี้ในรูปแบบที่เข้าถึงได้ง่าย
                                เช่น ฐานข้อมูลดิจิทัล คลังความรู้ หรือนิทรรศการ
                            </p>
                        </div>
                    </div>
                </section>

                {/* Role and Significance */}
                <section className="mb-24 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-orange-200 to-purple-200 -translate-x-1/2 grid-line hidden md:block"></div>

                    <div className="space-y-12 relative">
                        {/* Significance 1 */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 group">
                            <div className="w-full md:w-[45%] md:text-right order-2 md:order-1">
                                <h3 className="text-2xl font-bold text-[#2e1065] mb-2 group-hover:text-orange-600 transition-colors">บทบาทสำคัญ</h3>
                                <p className="text-stone-500 font-light">
                                    เป็นแหล่งสนับสนุนการวิจัยและการศึกษาเกี่ยวกับวัฒนธรรมท้องถิ่น โดยเฉพาะในประเด็นที่เกี่ยวข้องกับประวัติศาสตร์และภูมิปัญญาพื้นบ้าน
                                    ช่วยเสริมสร้างความรู้ ความเข้าใจ และความภาคภูมิใจในมรดกทางวัฒนธรรมของชุมชน
                                </p>
                            </div>
                            <div className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-purple-100 shadow-lg flex items-center justify-center text-[#2e1065] group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300 order-1 md:order-2 shrink-0">
                                <BookOpen size={20} />
                            </div>
                            <div className="w-full md:w-[45%] order-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 md:opacity-80 group-hover:opacity-100 transition-opacity">
                                <span className="text-4xl font-black text-purple-100 absolute -top-4 -right-4 select-none pointer-events-none">Learning</span>
                                <p className="relative z-10 text-stone-600">
                                    เชื่อมโยงนักวิชาการ หน่วยงานท้องถิ่น และชุมชน ให้เกิดการแลกเปลี่ยนองค์ความรู้และการทำงานร่วมกันเพื่อพัฒนาเชิงพื้นที่
                                </p>
                            </div>
                        </div>

                        {/* Significance 2 */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 group">
                            <div className="w-full md:w-[45%] order-3 md:order-1 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 md:opacity-80 group-hover:opacity-100 transition-opacity md:text-right">
                                <span className="text-4xl font-black text-orange-100 absolute -top-4 -left-4 select-none pointer-events-none">Creative</span>
                                <p className="relative z-10 text-stone-600">
                                    สร้างกิจกรรมที่เชื่อมโยงวัฒนธรรมเข้ากับการท่องเที่ยวเชิงสร้างสรรค์ เพื่อส่งเสริมเศรษฐกิจในท้องถิ่น
                                </p>
                            </div>
                            <div className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-orange-100 shadow-lg flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:border-purple-200 transition-all duration-300 order-1 md:order-2 shrink-0">
                                <Award size={20} />
                            </div>
                            <div className="w-full md:w-[45%] order-2 md:order-3">
                                <h3 className="text-2xl font-bold text-[#2e1065] mb-2 group-hover:text-orange-600 transition-colors">พื้นที่ทางวัฒนธรรม</h3>
                                <p className="text-stone-500 font-light">
                                    เป็นพื้นที่ในการแสดงออกถึงความหลากหลายทางวัฒนธรรม เช่น การแสดงศิลปะ งานหัตถกรรม และเทศกาลท้องถิ่น
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion */}
                <section className="bg-purple-50 p-8 rounded-3xl text-center border border-purple-100">
                    <p className="text-xl text-[#2e1065] font-medium leading-relaxed">
                        "ในระยะยาว ศูนย์เชียงรายศึกษาจะเป็นกลไกสำคัญในการสืบสานวัฒนธรรมและองค์ความรู้ท้องถิ่น
                        ควบคู่กับการสร้างโอกาสใหม่ๆ ในการเรียนรู้และพัฒนาให้จังหวัดเชียงรายสามารถรักษาอัตลักษณ์ที่เป็นเอกลักษณ์ได้อย่างยั่งยืน"
                    </p>
                </section>

            </div>
        </div>
    );
}
