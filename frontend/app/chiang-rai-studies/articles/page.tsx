
import Link from 'next/link';

export default function ArticlesPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-stone-800 mb-8">บทความวิชาการและงานวิจัย</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mock Article 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 bg-stone-200 rounded-lg flex-shrink-0"></div>
                        <div>
                            <span className="text-xs text-amber-600 font-bold uppercase mb-2 block">Research</span>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">
                                พลวัตทางสังคมของชุมชนลุ่มน้ำโขง
                            </h3>
                            <p className="text-stone-500 text-sm mb-4">
                                การศึกษาการเปลี่ยนแปลงทางเศรษฐกิจและสังคม...
                            </p>
                            <Link href="#" className="text-amber-700 font-medium hover:underline text-sm">อ่านต่อ</Link>
                        </div>
                    </div>

                    {/* Mock Article 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 bg-stone-200 rounded-lg flex-shrink-0"></div>
                        <div>
                            <span className="text-xs text-amber-600 font-bold uppercase mb-2 block">Article</span>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">
                                พุทธศิลป์เชียงแสน: มรดกโลกทางวัฒนธรรม
                            </h3>
                            <p className="text-stone-500 text-sm mb-4">
                                วิเคราะห์รูปแบบทางศิลปะและอิทธิพลที่มีต่อ..
                            </p>
                            <Link href="#" className="text-amber-700 font-medium hover:underline text-sm">อ่านต่อ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
