
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Calendar,
    ArrowLeft,
    Clock,
    MapPin,
    Share2,
    Facebook,
    Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function getActivity(slug: string) {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || 'http://soc_backend:4000';
        const res = await fetch(`${baseUrl}/api/chiang-rai/activities/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        return null;
    }
}

export default async function ActivityDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const activity = await getActivity(params.slug);

    if (!activity) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FAF5FF] font-kanit">
            {/* Hero / Header Image */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div className="absolute inset-0">
                    <img
                        src={activity.thumbnailUrl || 'https://placehold.co/1920x600/2e1065/FFF?text=Activity'}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#2e1065]/60 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10 text-white">
                    <Link href="/chiang-rai-studies/activities" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-wider">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Activities
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/90 w-fit text-xs font-bold uppercase mb-4 shadow-lg border border-orange-400/50">
                        {activity.type}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight max-w-4xl drop-shadow-xl">
                        {activity.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm font-medium text-purple-100">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-orange-400" />
                            <span>
                                {new Date(activity.publishedAt).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        {/* If location/time existed, we would show them here */}
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-orange-400" />
                            <span>09:00 - 16:00 น.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-purple-50">
                            <div
                                className="prose prose-lg prose-purple max-w-none font-light prose-headings:font-bold prose-headings:text-[#2e1065] prose-p:text-stone-600"
                                dangerouslySetInnerHTML={{ __html: activity.content || activity.description || '<p>ไม่มีเนื้อหาเพิ่มเติม</p>' }}
                            />

                            {/* Tags or Footer of Article */}
                            <div className="mt-12 pt-8 border-t border-purple-100 flex justify-between items-center">
                                <div className="text-stone-400 text-sm font-bold">
                                    Share this activity:
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="rounded-full text-purple-600 hover:bg-purple-50">
                                        <Facebook size={20} />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-full text-purple-600 hover:bg-purple-50">
                                        <Twitter size={20} />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-full text-purple-600 hover:bg-purple-50">
                                        <Share2 size={20} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Related Box */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-50 sticky top-24">
                            <h3 className="text-xl font-black text-[#2e1065] mb-6">กิจกรรมอื่นๆ</h3>
                            <div className="space-y-6">
                                {/* Placeholder for related items - could fetch proper data later */}
                                <div className="group cursor-pointer">
                                    <div className="text-xs font-bold text-stone-400 mb-1">Upcoming</div>
                                    <h4 className="font-bold text-stone-700 group-hover:text-orange-600 transition-colors">
                                        นิทรรศการศิลปะร่วมสมัย
                                    </h4>
                                </div>
                                <div className="w-full h-px bg-purple-50"></div>
                                <div className="group cursor-pointer">
                                    <div className="text-xs font-bold text-stone-400 mb-1">Past Event</div>
                                    <h4 className="font-bold text-stone-700 group-hover:text-orange-600 transition-colors">
                                        การประชุมวิชาการระดับชาติ
                                    </h4>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-purple-50">
                                <Link href="/chiang-rai-studies/activities">
                                    <Button className="w-full rounded-full font-bold bg-[#581c87] hover:bg-[#2e1065]">
                                        ดูทั้งหมด
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
