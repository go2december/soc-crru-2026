import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
    id: number;
    title: string;
    date: string;
    category: string;
    image: string;
    excerpt: string;
}

const featuredNews: NewsItem = {
    id: 1,
    title: "คณะสังคมศาสตร์ ร่วมกับ อบต.แม่ข้าวต้ม พัฒนาโมเดล 'ชุมชนนวัตกรรม'",
    date: "8 มกราคม 2569",
    category: "วิจัยและบริการวิชาการ",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1740&auto=format&fit=crop",
    excerpt: "โครงการบูรณาการพันธกิจสัมพันธ์เพื่อแก้ไขปัญหาความยากจนและส่งเสริมเศรษฐกิจฐานรากด้วยนวัตกรรมทางสังคม..."
};

const newsList: NewsItem[] = [
    {
        id: 2,
        title: "รับสมัครทุนการศึกษา 'ต้นกล้าสังคมศาสตร์' ประจำปีการศึกษา 2569",
        date: "5 มกราคม 2569",
        category: "ทุนการศึกษา",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        excerpt: ""
    },
    {
        id: 3,
        title: "เชิญชวนนักศึกษาเข้าร่วมกิจกรรม 'SOC CAMP 2026' ค่ายอาสาพัฒนา",
        date: "3 มกราคม 2569",
        category: "กิจกรรมนักศึกษา",
        image: "https://images.unsplash.com/photo-1529156069893-b2040c270249?q=80&w=1740&auto=format&fit=crop",
        excerpt: ""
    },
    {
        id: 4,
        title: "ประกาศตารางสอบปลายภาค ภาคการศึกษาที่ 2/2568",
        date: "28 ธันวาคม 2568",
        category: "วิชาการ",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1740&auto=format&fit=crop",
        excerpt: ""
    }
];

export default function NewsSection() {
    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-scholar-accent font-bold tracking-wider uppercase text-sm mb-2 block">Update</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-scholar-deep">ข่าวสารและกิจกรรม</h2>
                    </div>
                    <Link href="/news" className="hidden md:flex items-center btn btn-link text-gray-500 hover:text-scholar-accent no-underline hover:no-underline font-medium transition-colors">
                        ดูข่าวทั้งหมด <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured News (Left - 2 Columns) - Using DaisyUI Card */}
                    <Link href={`/news/${featuredNews.id}`} className="lg:col-span-2 group">
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 h-full">
                            <figure className="relative h-[300px] lg:h-[400px]">
                                <Image
                                    src={featuredNews.image}
                                    alt={featuredNews.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="badge badge-primary border-none px-3 py-3 font-medium shadow-md">
                                        {featuredNews.category}
                                    </div>
                                </div>
                            </figure>
                            <div className="card-body">
                                <div className="flex items-center text-sm text-gray-400 mb-2 gap-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {featuredNews.date}
                                    </span>
                                </div>
                                <h3 className="card-title text-2xl font-bold text-scholar-deep mb-3 group-hover:text-scholar-accent transition-colors leading-tight">
                                    {featuredNews.title}
                                </h3>
                                <p className="text-gray-500 line-clamp-2">{featuredNews.excerpt}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-ghost btn-sm group-hover:text-scholar-accent">อ่านต่อ →</button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* News List (Right - 1 Column) - Using DaisyUI Card Side / Compact */}
                    <div className="flex flex-col gap-6">
                        {newsList.map((news) => (
                            <Link key={news.id} href={`/news/${news.id}`} className="group">
                                <div className="card card-side card-compact bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 overflow-hidden h-32">
                                    <figure className="relative w-1/3 min-w-[120px] h-full">
                                        <Image
                                            src={news.image}
                                            alt={news.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </figure>
                                    <div className="card-body w-2/3 py-3 px-4 justify-center">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="badge badge-outline badge-xs text-scholar-accent font-semibold">{news.category}</span>
                                            <span className="text-[10px] text-gray-400">{news.date}</span>
                                        </div>
                                        <h4 className="font-bold text-scholar-deep text-sm leading-snug group-hover:text-scholar-accent transition-colors line-clamp-2">
                                            {news.title}
                                        </h4>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Mobile View All Button */}
                        <Link href="/news" className="md:hidden btn btn-outline w-full mt-4 normal-case">
                            ดูข่าวทั้งหมด
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
