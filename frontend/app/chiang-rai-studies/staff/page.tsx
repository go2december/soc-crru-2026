
import { Mail, Users, Crown, Shield } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

export const metadata: Metadata = {
    title: 'ทำเนียบบุคลากร | ศูนย์เชียงรายศึกษา',
    description: 'ทีมงานผู้ขับเคลื่อนภารกิจการอนุรักษ์ เผยแพร่ และต่อยอดองค์ความรู้ท้องถิ่น คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
};

interface StaffMember {
    id: string;
    staffGroup: string;
    title: string | null;
    firstName: string;
    lastName: string;
    position: string | null;
    academicTitle: string | null;
    email: string | null;
    imageUrl: string | null;
    bio: string | null;
    sortOrder: number | null;
}

interface StaffData {
    advisors: StaffMember[];
    executives: StaffMember[];
    committee: StaffMember[];
}

async function getStaff(): Promise<StaffData> {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/staff`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) throw new Error('Failed to fetch staff');
        return res.json();
    } catch (error) {
        console.error('Error fetching staff:', error);
        return { advisors: [], executives: [], committee: [] };
    }
}

// Helper: Build full display name
function displayName(s: StaffMember): string {
    if (s.staffGroup === 'ADVISOR') return s.firstName;
    const parts = [s.academicTitle, s.title, s.firstName, s.lastName].filter(Boolean);
    return parts.join('');
}

// Position highlight styling
function positionStyle(position: string | null): { bg: string; text: string } {
    if (!position) return { bg: 'bg-purple-100', text: 'text-purple-600' };
    if (position.includes('ผู้อำนวยการ') && !position.includes('รอง')) return { bg: 'bg-orange-500', text: 'text-white' };
    if (position.includes('รองผู้อำนวยการ')) return { bg: 'bg-[#2e1065]', text: 'text-white' };
    if (position.includes('ประธาน')) return { bg: 'bg-[#2e1065]', text: 'text-white' };
    if (position.includes('เลขานุการ')) return { bg: 'bg-orange-200', text: 'text-orange-800' };
    return { bg: 'bg-purple-100', text: 'text-purple-600' };
}

export default async function StaffPage() {
    const data = await getStaff();
    const { advisors = [], executives = [], committee = [] } = data || {};

    // Separate Director from other executives for special layout
    const director = executives.find(s => s.position?.includes('ผู้อำนวยการ') && !s.position?.includes('รอง'));
    const deputies = executives.filter(s => s.position?.includes('รองผู้อำนวยการ'));
    const heads = executives.filter(s => s.position?.includes('หัวหน้า'));

    // Committee role ordering
    const chairPerson = committee.find(s => s.position?.includes('ประธาน'));
    const secretary = committee.find(s => s.position?.includes('เลขานุการ'));
    const members = committee.filter(s => s.position === 'กรรมการ');

    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header */}
            <div className="bg-[#2e1065] text-white py-20 relative overflow-hidden">
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

                {/* ===== SECTION 1: EXECUTIVES ===== */}
                {executives.length > 0 && (
                    <section className="mb-24">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-widest uppercase mb-4">
                                <Shield size={14} /> Executive Committee
                            </div>
                            <h2 className="text-3xl font-bold text-[#2e1065] relative z-10">
                                <span className="bg-[#FAF5FF] px-6 relative z-10">ฝ่ายบริหารโครงการ</span>
                                <div className="absolute top-1/2 left-0 w-full h-px bg-purple-200 -z-0"></div>
                            </h2>
                        </div>

                        {/* Director + Deputies Row */}
                        {(director || deputies.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                                {/* Director (Center, highlighted) */}
                                {director && (
                                    <div className="bg-white p-4 rounded-[2rem] border border-orange-400 shadow-xl md:scale-105 text-center group transition-all duration-300 hover:-translate-y-2 flex flex-col items-center md:order-1 md:col-start-2">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 border-orange-100 shadow-inner relative">
                                            <Image
                                                src={director.imageUrl || `https://placehold.co/400x500/2e1065/white?text=${director.firstName}`}
                                                alt={displayName(director)}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <div className="font-bold mb-2 text-xs uppercase tracking-widest text-orange-600">{director.position}</div>
                                        <div className="text-xl text-[#2e1065] font-bold">{displayName(director)}</div>
                                        {director.email && (
                                            <a href={`mailto:${director.email}`} className="mt-3 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-orange-600 transition">
                                                <Mail size={12} /> {director.email}
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Deputies */}
                                {deputies.map((dep, i) => (
                                    <div key={dep.id} className={`bg-white p-4 rounded-[2rem] border border-purple-100 shadow-md text-center group transition-all duration-300 hover:-translate-y-2 flex flex-col items-center ${i === 0 ? 'md:order-0' : 'md:order-2'}`}>
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 border-4 border-purple-50 shadow-inner relative">
                                            <Image
                                                src={dep.imageUrl || `https://placehold.co/400x500/2e1065/white?text=${dep.firstName}`}
                                                alt={displayName(dep)}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <div className="font-bold mb-2 text-xs uppercase tracking-widest text-purple-400">{dep.position}</div>
                                        <div className="text-xl text-[#2e1065] font-bold">{displayName(dep)}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Heads of Departments */}
                        {heads.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-[#2e1065] mb-10 text-center">หัวหน้าฝ่ายงาน</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                    {heads.map((head) => (
                                        <div key={head.id} className="bg-white p-6 rounded-[2rem] border border-purple-100 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-100 relative">
                                                <Image
                                                    src={head.imageUrl || `https://placehold.co/300x300/e9d5ff/2e1065?text=${head.firstName}`}
                                                    alt={displayName(head)}
                                                    fill
                                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                />
                                            </div>
                                            <div className="text-purple-400 text-xs font-bold uppercase mb-2">{head.position}</div>
                                            <div className="text-[#2e1065] font-bold text-lg">{displayName(head)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* ===== SECTION 2: COMMITTEE + ADVISORS (Side by Side) ===== */}
                {(committee.length > 0 || advisors.length > 0) && (
                    <section className="mb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* Committee */}
                            {committee.length > 0 && (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-purple-100">
                                    <h3 className="text-xl font-bold text-[#2e1065] mb-6 pb-4 border-b border-purple-50 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                                        คณะกรรมการโครงการ (Project Committee)
                                    </h3>
                                    <ul className="space-y-4">
                                        {/* Chair */}
                                        {chairPerson && (
                                            <li className="flex flex-col sm:flex-row justify-between sm:items-center bg-purple-50 p-4 rounded-xl gap-2">
                                                <span className="font-bold text-[#2e1065] text-lg">{displayName(chairPerson)}</span>
                                                <span className="text-base font-bold bg-[#2e1065] text-white px-3 py-1.5 rounded-lg shadow-sm w-fit">{chairPerson.position}</span>
                                            </li>
                                        )}

                                        {/* Members */}
                                        {members.map((m) => (
                                            <li key={m.id} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-dashed border-purple-100 pb-3 last:border-0 hover:bg-purple-50/50 p-3 rounded-lg transition-colors gap-1">
                                                <span className="text-stone-700 font-medium text-lg">{displayName(m)}</span>
                                                <span className="text-base font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-lg w-fit">{m.position}</span>
                                            </li>
                                        ))}

                                        {/* Secretary */}
                                        {secretary && (
                                            <li className="flex flex-col sm:flex-row justify-between sm:items-center bg-orange-50 p-4 rounded-xl mt-2 gap-2">
                                                <span className="font-bold text-orange-800 text-lg">{displayName(secretary)}</span>
                                                <span className="text-base font-bold bg-orange-200 text-orange-800 px-3 py-1.5 rounded-lg shadow-sm w-fit">{secretary.position}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Advisors */}
                            {advisors.length > 0 && (
                                <div className="bg-[#2e1065] p-8 rounded-[2.5rem] shadow-lg text-white">
                                    <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-purple-400/30 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-white rounded-full"></div>
                                        ที่ปรึกษาโครงการ (Advisors)
                                    </h3>
                                    <ul className="space-y-4">
                                        {advisors.map((advisor) => (
                                            <li key={advisor.id} className="flex items-start gap-4 text-purple-100 hover:text-white transition-colors">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div>
                                                <span className="font-light tracking-wide">{advisor.firstName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== Empty State ===== */}
                {executives.length === 0 && committee.length === 0 && advisors.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-stone-400">ยังไม่มีข้อมูลบุคลากร</h2>
                        <p className="text-stone-400 mt-2">กรุณาเพิ่มข้อมูลบุคลากรผ่านหน้า Admin</p>
                    </div>
                )}
            </div>
        </div>
    );
}
