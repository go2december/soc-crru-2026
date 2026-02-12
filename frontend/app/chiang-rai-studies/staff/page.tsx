
import { Mail, Users, ArrowRight } from 'lucide-react';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

// Type Definition
interface StaffMember {
    id: string;
    title: string | null;
    firstName: string;
    lastName: string;
    position: string | null;
    role: string;
    email: string | null;
    imageUrl: string | null;
    bio: string | null;
    sortOrder: number | null;
    isActive: boolean;
}

// Role Labels
const roleLabels: Record<string, string> = {
    DIRECTOR: 'ผู้อำนวยการศูนย์ฯ',
    ACADEMIC: 'ฝ่ายวิชาการ',
    NETWORK: 'ฝ่ายประสานเครือข่าย',
    DISSEMINATION: 'ฝ่ายเผยแพร่และสารสนเทศ',
    SUPPORT: 'เจ้าหน้าที่ช่วยงานทั่วไป',
};

// Role Order for sorting
const roleOrder = ['DIRECTOR', 'ACADEMIC', 'NETWORK', 'DISSEMINATION', 'SUPPORT'];

// Fetch Staff from API
async function getStaff(): Promise<StaffMember[]> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/staff`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error('Failed to fetch staff');
        return res.json();
    } catch (error) {
        console.error('Error fetching staff:', error);
        return [];
    }
}

// Group staff by role
function groupByRole(staff: StaffMember[]): { role: string; title: string; members: StaffMember[] }[] {
    const grouped: Record<string, StaffMember[]> = {};

    staff.forEach((member) => {
        if (!grouped[member.role]) {
            grouped[member.role] = [];
        }
        grouped[member.role].push(member);
    });

    // Sort by role order
    return roleOrder
        .filter((role) => grouped[role] && grouped[role].length > 0)
        .map((role) => ({
            role,
            title: roleLabels[role] || role,
            members: grouped[role].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        }));
}

export default async function StaffPage() {
    const staffList = await getStaff();
    const groupedStaff = groupByRole(staffList);

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header - Chiang Rai Purple Brand */}
            <div className="bg-[#581c87] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-4 border border-orange-500/30 shadow-lg">
                        Our Dedicated Team
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md">ทำเนียบบุคลากร</h1>
                    <p className="text-purple-200/70 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        ทีมงานผู้ขับเคลื่อนภารกิจการอนุรักษ์ เผยแพร่ และต่อยอดองค์ความรู้ท้องถิ่น <br className="hidden md:block" />
                        คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 py-16">



                {/* Executive & Committee List (Static from NotebookLM) */}
                <section className="mb-24">
                    {/* Executives */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-[#581c87] mb-12 text-center relative z-10">
                            <span className="bg-[#FAF5FF] px-6 relative z-10">คณะผู้บริหาร (Executive Committee)</span>
                            <div className="absolute top-1/2 left-0 w-full h-px bg-purple-200 -z-0"></div>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { role: 'ผู้อำนวยการ (Director)', name: 'ผศ. ดร.ณรงค์ เจนใจ', highlight: true, img: 'https://placehold.co/400x500/702963/white?text=Director' },
                                { role: 'รองผู้อำนวยการ', name: 'ผศ. ดร.เบญจมาศ เมืองเกษม', img: 'https://placehold.co/400x500/581c87/white?text=Deputy' },
                                { role: 'รองผู้อำนวยการ', name: 'ผศ. ศมล สังคะรัตน์', img: 'https://placehold.co/400x500/581c87/white?text=Deputy' }
                            ].map((person, i) => (
                                <div key={i} className={`bg-white p-4 rounded-[2rem] border ${person.highlight ? 'border-orange-400 shadow-xl scale-105' : 'border-purple-100 shadow-md'} text-center group transition-all duration-300 hover:-translate-y-2 flex flex-col items-center`}>
                                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 ${person.highlight ? 'border-orange-100' : 'border-purple-50'} shadow-inner`}>
                                        <img
                                            src={person.img}
                                            alt={person.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className={`font-bold mb-2 text-xs uppercase tracking-widest ${person.highlight ? 'text-orange-600' : 'text-purple-400'}`}>{person.role}</div>
                                    <div className="text-xl text-[#2e1065] font-bold">{person.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Heads of Departments */}
                    <div className="mb-20">
                        <h3 className="text-2xl font-bold text-[#581c87] mb-10 text-center">หัวหน้าฝ่ายงาน (Heads of Departments)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                { role: 'หัวหน้าฝ่ายวิชาการ', name: 'รศ. จิราพร มะโนวัง', img: 'https://placehold.co/300x300/e9d5ff/702963?text=Academic' },
                                { role: 'หัวหน้าฝ่ายเผยแพร่และประชาสัมพันธ์', name: 'ผศ. ดร.ศศิพัชร์ หาญฤทธิ์', img: 'https://placehold.co/300x300/e9d5ff/702963?text=PR' },
                                { role: 'หัวหน้าฝ่ายประสานงานเครือข่าย', name: 'ผศ. วาสนา เสภา', img: 'https://placehold.co/300x300/e9d5ff/702963?text=Network' }
                            ].map((person, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-purple-100 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-100">
                                        <img
                                            src={person.img}
                                            alt={person.name}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="text-purple-400 text-xs font-bold uppercase mb-2">{person.role}</div>
                                    <div className="text-[#2e1065] font-bold text-lg">{person.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Committee & Advisors Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Committee */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-purple-100">
                            <h3 className="text-xl font-bold text-[#581c87] mb-6 pb-4 border-b border-purple-50 flex items-center gap-3">
                                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                                คณะกรรมการโครงการ (Project Committee)
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex flex-col sm:flex-row justify-between sm:items-center bg-purple-50 p-4 rounded-xl gap-2">
                                    <span className="font-bold text-[#581c87] text-lg">ผศ. ดร.ณรงค์ เจนใจ</span>
                                    <span className="text-base font-bold bg-[#581c87] text-white px-3 py-1.5 rounded-lg shadow-sm w-fit">ประธานกรรมการ</span>
                                </li>
                                {[
                                    'รศ. จิราพร มะโนวัง',
                                    'ผศ. ดร.ชาญชัย ฤทธิร่วม',
                                    'ผศ. ดร.ดุจฤดี คงสุวรรณ์',
                                    'ผศ. ดร.นพชัย ฟองอิสสระ',
                                    'ผศ. ดร.ศศิพัชร์ หาญฤทธิ์',
                                    'ผศ. ดร.จามรี พระสุนิล',
                                    'ผศ. ธนพัทธ์ จันท์พิพัฒน์พงศ์',
                                    'อ. วรัญญา พรมสาขา ณ สกลนคร'
                                ].map((name, i) => (
                                    <li key={i} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-dashed border-purple-100 pb-3 last:border-0 hover:bg-purple-50/50 p-3 rounded-lg transition-colors gap-1">
                                        <span className="text-stone-700 font-medium text-lg">{name}</span>
                                        <span className="text-base font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-lg w-fit">กรรมการ</span>
                                    </li>
                                ))}
                                <li className="flex flex-col sm:flex-row justify-between sm:items-center bg-orange-50 p-4 rounded-xl mt-2 gap-2">
                                    <span className="font-bold text-orange-800 text-lg">ผศ. นครินทร์ น้ำใจดี</span>
                                    <span className="text-base font-bold bg-orange-200 text-orange-800 px-3 py-1.5 rounded-lg shadow-sm w-fit">กรรมการและเลขานุการ</span>
                                </li>
                            </ul>
                        </div>

                        {/* Advisors */}
                        <div className="bg-[#581c87] p-8 rounded-[2.5rem] shadow-lg text-white pattern-dots">
                            <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-purple-400/30 flex items-center gap-3">
                                <div className="w-2 h-8 bg-white rounded-full"></div>
                                ที่ปรึกษาโครงการ (Advisors)
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'วัฒนธรรมจังหวัดเชียงราย',
                                    'รองอธิการบดี มรภ.เชียงราย (ฝ่ายทำนุบำรุงศิลปวัฒนธรรม)',
                                    'ประธานสภาวัฒนธรรมจังหวัดเชียงราย',
                                    'ผู้อำนวยการสำนักศิลปะและวัฒนธรรม มรภ.เชียงราย',
                                    'คณบดีคณะสังคมศาสตร์',
                                    'รองคณบดีคณะสังคมศาสตร์ ฝ่ายวิจัยและบริการวิชาการ',
                                    'รองคณบดีคณะสังคมศาสตร์ ฝ่ายวิชาการ',
                                    'รศ. มาลี หมวกกุล',
                                    'ผศ. ดร.รณิดา ปิงเมือง'
                                ].map((advisor, i) => (
                                    <li key={i} className="flex items-start gap-4 text-purple-100 hover:text-white transition-colors">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div>
                                        <span className="font-light tracking-wide">{advisor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {groupedStaff.length > 0 &&
                    groupedStaff.map((group, index) => (
                        <div key={index} className="mb-24 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            {/* Role Section Header */}
                            <div className="flex flex-col items-center mb-16">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#702963] mb-4 text-center">{group.title}</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                                    <div className="w-4 h-1 bg-[#702963] rounded-full"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                                {group.members.map((staff, sIdx) => (
                                    <div
                                        key={staff.id}
                                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-purple-100 group animate-fade-in-up"
                                        style={{ animationDelay: `${(index * 0.1) + (sIdx * 0.05)}s` }}
                                    >
                                        {/* Image Area */}
                                        <div className="aspect-[4/5] bg-purple-50 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end justify-center pb-8">
                                                <span className="text-white text-xs font-bold tracking-widest uppercase">View Profile</span>
                                            </div>
                                            <img
                                                src={staff.imageUrl || `https://placehold.co/400x500/702963/white?text=${staff.firstName}`}
                                                alt={`${staff.firstName} ${staff.lastName}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 filter group-hover:brightness-110"
                                            />
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-8 text-center relative">
                                            {/* Decorative Label */}
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-orange-600 border border-orange-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {staff.role === 'DIRECTOR' ? 'Management' : 'Staff'}
                                            </div>

                                            <h3 className="text-xl font-bold text-[#2e1065] mt-2 mb-2 line-clamp-1">
                                                {staff.title} {staff.firstName} {staff.lastName}
                                            </h3>
                                            <p className="text-sm text-purple-900/40 mb-6 font-medium tracking-wide uppercase italic">
                                                {staff.position || roleLabels[staff.role]}
                                            </p>

                                            {staff.email && (
                                                <a
                                                    href={`mailto:${staff.email}`}
                                                    className="inline-flex items-center gap-2 bg-purple-50 text-[#702963] text-xs font-bold border border-purple-100 px-6 py-2.5 rounded-full hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-sm"
                                                >
                                                    <Mail size={14} /> Send Email
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
