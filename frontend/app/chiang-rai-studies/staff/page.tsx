
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
        const res = await fetch(`${API_URL}/chiang-rai/staff`, {
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
                {groupedStaff.length > 0 ? (
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
                ) : (
                    /* Empty State */
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-purple-100 max-w-4xl mx-auto px-10">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Users className="text-purple-200" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">ยังไม่มีการบันทึกข้อมูลบุคลากร</h3>
                        <p className="text-purple-400 font-light text-lg mb-8 max-w-md mx-auto italic">
                            "ข้อมูลทีมงานผู้ขับเคลื่อนจะปรากฏในช่องทางนี้ในเร็วๆ นี้"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
