
import AboutHeader from '@/components/chiang-rai-studies/AboutHeader';
import { Target, Search, Database, BookOpenCheck, Network, Heart } from 'lucide-react';

export default function ObjectivesPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20 font-kanit scroll-smooth">
            <AboutHeader
                title="วัตถุประสงค์ (Objectives)"
                subtitle="พันธกิจ 5 ประการ เพื่อการอนุรักษ์และพัฒนาเชียงรายศึกษา"
            />

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <section className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Obj 1 */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <Database size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#581c87] mb-3">1. ศูนย์กลางข้อมูลองค์ความรู้</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                เพื่อเป็นแหล่งข้อมูลและองค์ความรู้เกี่ยวกับประวัติศาสตร์ ประเพณีความเชื่อ ศิลปะการแสดง และภูมิปัญญาท้องถิ่นของจังหวัดเชียงราย ที่รวบรวมไว้ในที่เดียวอย่างเป็นระบบ
                            </p>
                        </div>

                        {/* Obj 2 */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                                <Search size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#581c87] mb-3">2. รวบรวม อนุรักษ์ และเผยแพร่</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                เพื่อรวบรวม อนุรักษ์ และเผยแพร่ข้อมูลเกี่ยวกับมรดกทางวัฒนธรรมของเชียงรายในรูปแบบต่างๆ เช่น นิทรรศการ สื่อสิ่งพิมพ์ และสื่อดิจิทัล ให้เข้าถึงได้ง่าย
                            </p>
                        </div>

                        {/* Obj 3 */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group">
                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                                <BookOpenCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#581c87] mb-3">3. ส่งเสริมการวิจัยและการศึกษา</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                สร้างโอกาสให้นักวิชาการและนักศึกษาได้ทำวิจัยเชิงลึก พัฒนาวิทยานิพนธ์ และบทความวิชาการ เพื่อเสริมสร้างองค์ความรู้ใหม่เกี่ยวกับวัฒนธรรมท้องถิ่น
                            </p>
                        </div>

                        {/* Obj 4 */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group lg:col-span-2 lg:w-3/4 lg:mx-auto">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                                <Heart size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#581c87] mb-3">4. สร้างความตระหนักและภาคภูมิใจ</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                สนับสนุนกิจกรรมหรือเวทีแลกเปลี่ยนความคิดเห็นระหว่างคนรุ่นใหม่และผู้รู้ท้องถิ่น เพื่อสร้างความตระหนักและความภาคภูมิใจในมรดกทางวัฒนธรรมของชุมชน
                            </p>
                        </div>

                        {/* Obj 5 */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group lg:col-span-1">
                            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform">
                                <Network size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#581c87] mb-3">5. ศูนย์กลางประสานงานเครือข่าย</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                เป็นศูนย์กลางในการประสานงานแลกเปลี่ยนความรู้ระหว่างนักวิชาการ หน่วยงานราชการ และชุมชน เพื่อการอนุรักษ์และพัฒนาท้องถิ่นร่วมกัน
                            </p>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
