
'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Trash2, Loader2, Save, Edit3, X, Users, Crown, Shield, ChevronDown, Plus, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

type StaffGroup = 'ADVISOR' | 'EXECUTIVE' | 'COMMITTEE';

interface StaffMember {
    id: string;
    staffGroup: StaffGroup;
    title: string | null;
    firstName: string;
    lastName: string;
    position: string | null;
    academicTitle: string | null;
    email: string | null;
    imageUrl: string | null;
    bio: string | null;
    facultyStaffId: string | null;
    sortOrder: number | null;
    isActive: boolean;
}

interface FacultyStaff {
    id: string;
    prefixTh: string | null;
    firstNameTh: string;
    lastNameTh: string;
    academicPosition: string | null;
    department: string | null;
    imageUrl: string | null;
    email: string | null;
}

const TABS: { value: StaffGroup; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'ADVISOR', label: 'ที่ปรึกษาโครงการ', icon: <Crown size={18} />, color: 'amber' },
    { value: 'EXECUTIVE', label: 'ฝ่ายบริหารโครงการ', icon: <Shield size={18} />, color: 'purple' },
    { value: 'COMMITTEE', label: 'คณะกรรมการโครงการ', icon: <Users size={18} />, color: 'blue' },
];

const EXECUTIVE_POSITIONS = [
    'ผู้อำนวยการ',
    'รองผู้อำนวยการ',
    'หัวหน้าฝ่ายวิชาการ',
    'หัวหน้าฝ่ายเผยแพร่และประชาสัมพันธ์',
    'หัวหน้าฝ่ายประสานงานเครือข่าย',
];

const COMMITTEE_POSITIONS = [
    'ประธานกรรมการ',
    'กรรมการ',
    'กรรมการและเลขานุการ',
];

const ACADEMIC_MAP: Record<string, string> = {
    'LECTURER': 'อ.',
    'ASSISTANT_PROF': 'ผศ.',
    'ASSOCIATE_PROF': 'รศ.',
    'PROFESSOR': 'ศ.',
};

export default function AdminStaffPage() {
    const [activeTab, setActiveTab] = useState<StaffGroup>('ADVISOR');
    const [staffData, setStaffData] = useState<{ advisors: StaffMember[]; executives: StaffMember[]; committee: StaffMember[] }>({ advisors: [], executives: [], committee: [] });
    const [facultyList, setFacultyList] = useState<FacultyStaff[]>([]);
    const [loading, setLoading] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [showAdvisorForm, setShowAdvisorForm] = useState(false);

    // Import form
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyStaff | null>(null);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [importLoading, setImportLoading] = useState(false);

    // Advisor form
    const [advisorName, setAdvisorName] = useState('');
    const [advisorPosition, setAdvisorPosition] = useState('ที่ปรึกษา');

    // Edit inline
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPosition, setEditPosition] = useState('');
    const [editSortOrder, setEditSortOrder] = useState(0);

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/staff`);
            if (res.ok) setStaffData(await res.json());
        } catch (e) {
            console.error('Failed to fetch staff', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFaculty = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/admin/faculty-staff`);
            if (res.ok) setFacultyList(await res.json());
        } catch (e) {
            console.error('Failed to fetch faculty', e);
        }
    }, []);

    useEffect(() => { fetchStaff(); }, [fetchStaff]);

    const currentList = activeTab === 'ADVISOR' ? staffData.advisors : activeTab === 'EXECUTIVE' ? staffData.executives : staffData.committee;
    const positions = activeTab === 'EXECUTIVE' ? EXECUTIVE_POSITIONS : COMMITTEE_POSITIONS;

    // --- Handlers ---
    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try {
            await fetch(`${API_URL}/api/chiang-rai/staff/${id}`, { method: 'DELETE' });
            fetchStaff();
        } catch { alert('ลบไม่สำเร็จ'); }
    };

    const handleUpdate = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/chiang-rai/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: editPosition, sortOrder: editSortOrder })
            });
            setEditingId(null);
            fetchStaff();
        } catch { alert('แก้ไขไม่สำเร็จ'); }
    };

    const handleAddAdvisor = async () => {
        if (!advisorName.trim()) return alert('กรุณากรอกชื่อ');
        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffGroup: 'ADVISOR',
                    firstName: advisorName.trim(),
                    lastName: '',
                    position: advisorPosition || 'ที่ปรึกษา',
                })
            });
            if (res.ok) {
                setAdvisorName('');
                setAdvisorPosition('ที่ปรึกษา');
                setShowAdvisorForm(false);
                fetchStaff();
            }
        } catch { alert('เพิ่มไม่สำเร็จ'); }
    };

    const handleImport = async () => {
        if (!selectedFaculty) return alert('กรุณาเลือกบุคลากร');
        if (!selectedPosition) return alert('กรุณาเลือกตำแหน่ง');

        setImportLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/chiang-rai/staff/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facultyStaffId: selectedFaculty.id,
                    staffGroup: activeTab,
                    position: selectedPosition,
                })
            });
            if (res.ok) {
                setSelectedFaculty(null);
                setSelectedPosition('');
                setShowImport(false);
                setSearchQuery('');
                fetchStaff();
            } else {
                const err = await res.json();
                alert('นำเข้าไม่สำเร็จ: ' + (err.message || 'Unknown error'));
            }
        } catch { alert('เกิดข้อผิดพลาด'); }
        finally { setImportLoading(false); }
    };

    const openImportPanel = () => {
        setShowImport(true);
        if (facultyList.length === 0) fetchFaculty();
    };

    const filteredFaculty = facultyList.filter(f => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return `${f.firstNameTh} ${f.lastNameTh}`.toLowerCase().includes(q) ||
            (f.department || '').toLowerCase().includes(q);
    });

    const tabColor = TABS.find(t => t.value === activeTab)?.color || 'amber';

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">จัดการบุคลากรศูนย์เชียงรายศึกษา</h1>
                    <p className="text-sm text-stone-400 mt-1">เพิ่ม แก้ไข ลบ บุคลากรใน 3 กลุ่ม</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-stone-200 pb-0">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => { setActiveTab(tab.value); setShowImport(false); setShowAdvisorForm(false); }}
                        className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 ${activeTab === tab.value
                            ? `bg-${tab.color}-50 text-${tab.color}-700 border-${tab.color}-500`
                            : 'bg-transparent text-stone-400 border-transparent hover:text-stone-600 hover:bg-stone-50'
                            }`}
                        style={activeTab === tab.value ? {
                            backgroundColor: tab.color === 'amber' ? '#fffbeb' : tab.color === 'purple' ? '#faf5ff' : '#eff6ff',
                            color: tab.color === 'amber' ? '#b45309' : tab.color === 'purple' ? '#7e22ce' : '#1d4ed8',
                            borderColor: tab.color === 'amber' ? '#f59e0b' : tab.color === 'purple' ? '#a855f7' : '#3b82f6',
                        } : {}}
                    >
                        {tab.icon} {tab.label}
                        <span className="ml-1 text-xs bg-white/80 px-2 py-0.5 rounded-full">
                            {tab.value === 'ADVISOR' ? staffData.advisors.length : tab.value === 'EXECUTIVE' ? staffData.executives.length : staffData.committee.length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
                {activeTab === 'ADVISOR' ? (
                    <button onClick={() => setShowAdvisorForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition shadow-sm">
                        <Plus size={16} /> เพิ่มที่ปรึกษา
                    </button>
                ) : (
                    <button onClick={openImportPanel}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition shadow-sm">
                        <UserPlus size={16} /> นำเข้าจากคณะสังคมศาสตร์
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            )}

            {/* ============ ADVISOR ADD FORM ============ */}
            {showAdvisorForm && activeTab === 'ADVISOR' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 animate-in">
                    <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                        <Crown size={18} /> เพิ่มที่ปรึกษาโครงการ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">ชื่อ / ตำแหน่งหน่วยงาน *</label>
                            <input
                                type="text"
                                value={advisorName}
                                onChange={e => setAdvisorName(e.target.value)}
                                placeholder="เช่น คณบดีคณะสังคมศาสตร์"
                                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">หมายเหตุ (ถ้ามี)</label>
                            <input
                                type="text"
                                value={advisorPosition}
                                onChange={e => setAdvisorPosition(e.target.value)}
                                placeholder="ที่ปรึกษา"
                                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button onClick={handleAddAdvisor}
                                className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition flex items-center justify-center gap-2">
                                <Save size={16} /> บันทึก
                            </button>
                            <button onClick={() => setShowAdvisorForm(false)}
                                className="px-4 py-3 border border-stone-300 rounded-xl text-stone-500 hover:bg-stone-50 transition">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ IMPORT PANEL (Executive / Committee) ============ */}
            {showImport && activeTab !== 'ADVISOR' && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-6 animate-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-purple-800 flex items-center gap-2">
                            <UserPlus size={18} /> นำเข้าบุคลากรจากคณะสังคมศาสตร์
                        </h3>
                        <button onClick={() => { setShowImport(false); setSelectedFaculty(null); }}
                            className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Faculty List */}
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-2">1. ค้นหาและเลือกบุคลากร</label>
                            <div className="relative mb-3">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="ค้นหาชื่อ หรือสาขา..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto border border-stone-200 rounded-xl bg-white divide-y divide-stone-100">
                                {filteredFaculty.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setSelectedFaculty(f)}
                                        className={`w-full text-left p-3 flex items-center gap-3 transition text-sm ${selectedFaculty?.id === f.id ? 'bg-purple-100 border-l-4 border-purple-500' : 'hover:bg-stone-50'}`}
                                    >
                                        <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden shrink-0">
                                            {f.imageUrl ? <img src={f.imageUrl} alt="" className="w-full h-full object-cover" /> :
                                                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">?</div>}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-stone-800 truncate">
                                                {f.academicPosition ? ACADEMIC_MAP[f.academicPosition] || '' : ''}{f.prefixTh}{f.firstNameTh} {f.lastNameTh}
                                            </div>
                                            <div className="text-xs text-stone-400 truncate">{f.department || 'ไม่ระบุสังกัด'}</div>
                                        </div>
                                    </button>
                                ))}
                                {filteredFaculty.length === 0 && (
                                    <div className="p-4 text-center text-stone-400 text-sm">ไม่พบข้อมูล</div>
                                )}
                            </div>
                        </div>

                        {/* Right: Position + Confirm */}
                        <div>
                            {selectedFaculty && (
                                <div className="bg-white p-4 rounded-xl border border-purple-100 mb-4">
                                    <p className="text-xs text-stone-400 mb-1">เลือกแล้ว:</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden">
                                            {selectedFaculty.imageUrl ?
                                                <img src={selectedFaculty.imageUrl} alt="" className="w-full h-full object-cover" /> :
                                                <div className="w-full h-full flex items-center justify-center text-stone-400">?</div>
                                            }
                                        </div>
                                        <div>
                                            <div className="font-bold text-stone-800">
                                                {selectedFaculty.academicPosition ? ACADEMIC_MAP[selectedFaculty.academicPosition] || '' : ''}{selectedFaculty.prefixTh}{selectedFaculty.firstNameTh} {selectedFaculty.lastNameTh}
                                            </div>
                                            <div className="text-xs text-stone-400">{selectedFaculty.department}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <label className="block text-xs font-bold text-stone-500 mb-2">
                                2. เลือกตำแหน่งใน{activeTab === 'EXECUTIVE' ? 'ฝ่ายบริหาร' : 'คณะกรรมการ'}
                            </label>
                            <div className="space-y-2 mb-4">
                                {positions.map(pos => (
                                    <label key={pos}
                                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition text-sm ${selectedPosition === pos
                                            ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                            : 'border-stone-200 hover:border-purple-300'
                                            }`}>
                                        <input type="radio" name="position" value={pos}
                                            checked={selectedPosition === pos}
                                            onChange={e => setSelectedPosition(e.target.value)}
                                            className="accent-purple-600" />
                                        <span className="font-medium text-stone-700">{pos}</span>
                                    </label>
                                ))}
                            </div>

                            <button onClick={handleImport} disabled={importLoading || !selectedFaculty || !selectedPosition}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
                                {importLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                นำเข้าข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ STAFF LIST TABLE ============ */}
            {!loading && (
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                {activeTab !== 'ADVISOR' && <th className="text-left p-4 font-bold text-stone-500 text-xs uppercase tracking-wide">รูปภาพ</th>}
                                <th className="text-left p-4 font-bold text-stone-500 text-xs uppercase tracking-wide">ชื่อ</th>
                                <th className="text-left p-4 font-bold text-stone-500 text-xs uppercase tracking-wide">ตำแหน่ง</th>
                                <th className="text-center p-4 font-bold text-stone-500 text-xs uppercase tracking-wide w-20">ลำดับ</th>
                                <th className="text-right p-4 font-bold text-stone-500 text-xs uppercase tracking-wide w-28">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-10 text-stone-400">
                                        <div className="text-4xl mb-2">📋</div>
                                        ยังไม่มีข้อมูลในกลุ่มนี้
                                    </td>
                                </tr>
                            ) : (
                                currentList.map((staff) => (
                                    <tr key={staff.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                                        {activeTab !== 'ADVISOR' && (
                                            <td className="p-4">
                                                <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                                    {staff.imageUrl ? (
                                                        <img src={staff.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">?</div>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-4 font-medium text-stone-800">
                                            {activeTab === 'ADVISOR' ? (
                                                staff.firstName
                                            ) : (
                                                <>
                                                    {staff.academicTitle}{staff.title}{staff.firstName} {staff.lastName}
                                                </>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === staff.id ? (
                                                activeTab === 'ADVISOR' ? (
                                                    <input type="text" value={editPosition} onChange={e => setEditPosition(e.target.value)}
                                                        className="w-full p-2 border border-stone-300 rounded-lg text-sm" />
                                                ) : (
                                                    <select value={editPosition} onChange={e => setEditPosition(e.target.value)}
                                                        className="w-full p-2 border border-stone-300 rounded-lg text-sm">
                                                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                )
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                                                    {staff.position || '-'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {editingId === staff.id ? (
                                                <input type="number" value={editSortOrder} onChange={e => setEditSortOrder(Number(e.target.value))}
                                                    className="w-16 p-2 border border-stone-300 rounded-lg text-sm text-center" />
                                            ) : (
                                                <span className="text-xs text-stone-400">{staff.sortOrder || 0}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {editingId === staff.id ? (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => handleUpdate(staff.id)}
                                                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition" title="บันทึก">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                        className="text-stone-400 hover:bg-stone-100 p-2 rounded-lg transition" title="ยกเลิก">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => { setEditingId(staff.id); setEditPosition(staff.position || ''); setEditSortOrder(staff.sortOrder || 0); }}
                                                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="แก้ไข">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(staff.id)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="ลบ">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
