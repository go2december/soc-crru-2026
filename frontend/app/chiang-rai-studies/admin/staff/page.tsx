'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Trash2, Loader2, Save, Edit3, X, Users, Crown, Shield, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

    // Delete confirmation
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        try {
            await fetch(`${API_URL}/api/chiang-rai/staff/${deleteTargetId}`, { method: 'DELETE' });
            fetchStaff();
        } catch (e) { 
            console.error(e);
            alert('ลบไม่สำเร็จ'); 
        } finally {
            setDeleteTargetId(null);
        }
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

    const activeStaffToDelete = [
        ...staffData.advisors, ...staffData.executives, ...staffData.committee
    ].find(s => s.id === deleteTargetId);

    return (
        <div className="space-y-6 animate-fade-in font-kanit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">จัดการบุคลากรศูนย์เชียงรายศึกษา</h1>
                    <p className="text-sm text-stone-400 mt-1">เพิ่ม แก้ไข ลบ บุคลากรใน 3 กลุ่ม</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stone-200 pb-0 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => { setActiveTab(tab.value); setShowImport(false); setShowAdvisorForm(false); }}
                        className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${activeTab === tab.value
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
            <div className="flex gap-2">
                {activeTab === 'ADVISOR' ? (
                    <Button onClick={() => setShowAdvisorForm(true)}
                        className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm font-bold pt-2.5 pb-2.5 h-auto">
                        <Plus size={16} /> เพิ่มที่ปรึกษา
                    </Button>
                ) : (
                    <Button onClick={openImportPanel}
                        className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm font-bold pt-2.5 pb-2.5 h-auto">
                        <UserPlus size={16} /> นำเข้าจากคณะสังคมศาสตร์
                    </Button>
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
                <Card className="bg-amber-50 border-amber-200 shadow-sm animate-in">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <Crown size={18} /> เพิ่มที่ปรึกษาโครงการ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">ชื่อ / ตำแหน่งหน่วยงาน *</label>
                                <Input
                                    type="text"
                                    value={advisorName}
                                    onChange={e => setAdvisorName(e.target.value)}
                                    placeholder="เช่น คณบดีคณะสังคมศาสตร์"
                                    className="bg-white border-stone-300 focus-visible:ring-amber-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">หมายเหตุ (ถ้ามี)</label>
                                <Input
                                    type="text"
                                    value={advisorPosition}
                                    onChange={e => setAdvisorPosition(e.target.value)}
                                    placeholder="ที่ปรึกษา"
                                    className="bg-white border-stone-300 focus-visible:ring-amber-400"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleAddAdvisor}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2 font-bold h-[40px]">
                                    <Save size={16} /> บันทึก
                                </Button>
                                <Button variant="outline" onClick={() => setShowAdvisorForm(false)}
                                    className="border-stone-300 text-stone-500 h-[40px] px-3">
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ============ IMPORT PANEL (Executive / Committee) ============ */}
            {showImport && activeTab !== 'ADVISOR' && (
                <Card className="bg-purple-50 border-purple-200 shadow-sm animate-in">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-purple-800 flex items-center gap-2">
                                <UserPlus size={18} /> นำเข้าบุคลากรจากคณะสังคมศาสตร์
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => { setShowImport(false); setSelectedFaculty(null); }}
                                className="text-stone-400 hover:text-stone-600 hover:bg-purple-100">
                                <X size={18} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Faculty List */}
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-2">1. ค้นหาและเลือกบุคลากร</label>
                                <div className="relative mb-3">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="ค้นหาชื่อ หรือสาขา..."
                                        className="pl-10 bg-white border-stone-300 focus-visible:ring-purple-400"
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
                                    <div className="bg-white p-4 rounded-xl border border-purple-100 mb-4 shadow-sm">
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
                                                className="accent-purple-600 w-4 h-4" />
                                            <span className="font-medium text-stone-700">{pos}</span>
                                        </label>
                                    ))}
                                </div>

                                <Button onClick={handleImport} disabled={importLoading || !selectedFaculty || !selectedPosition}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2 font-bold transition-all shadow-sm h-12">
                                    {importLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    นำเข้าข้อมูล
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ============ STAFF LIST TABLE ============ */}
            {!loading && (
                <Card className="overflow-hidden border-stone-200 shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm uppercase tracking-wider">
                                    <tr>
                                        {activeTab !== 'ADVISOR' && <th className="p-4 font-semibold w-16">รูปภาพ</th>}
                                        <th className="p-4 font-semibold">ชื่อ</th>
                                        <th className="p-4 font-semibold">ตำแหน่ง</th>
                                        <th className="p-4 font-semibold text-center w-24">ลำดับ</th>
                                        <th className="p-4 font-semibold text-right w-32">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {currentList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center p-10 text-stone-400">
                                                <div className="text-4xl mb-2">📋</div>
                                                ยังไม่มีข้อมูลในกลุ่มนี้
                                            </td>
                                        </tr>
                                    ) : (
                                        currentList.map((staff) => (
                                            <tr key={staff.id} className="hover:bg-purple-50/30 transition-colors">
                                                {activeTab !== 'ADVISOR' && (
                                                    <td className="p-4">
                                                        <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden shrink-0 shadow-sm">
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
                                                            <Input type="text" value={editPosition} onChange={e => setEditPosition(e.target.value)}
                                                                className="h-8 max-w-[200px]" />
                                                        ) : (
                                                            <select value={editPosition} onChange={e => setEditPosition(e.target.value)}
                                                                className="h-8 w-full max-w-[200px] border border-stone-300 rounded-md text-sm px-2 focus:ring-2 focus:ring-purple-400 outline-none">
                                                                {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                                            </select>
                                                        )
                                                    ) : (
                                                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold whitespace-nowrap">
                                                            {staff.position || '-'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {editingId === staff.id ? (
                                                        <Input type="number" value={editSortOrder} onChange={e => setEditSortOrder(Number(e.target.value))}
                                                            className="h-8 w-16 text-center mx-auto" />
                                                    ) : (
                                                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">{staff.sortOrder || 0}</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {editingId === staff.id ? (
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => handleUpdate(staff.id)}
                                                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700" title="บันทึก">
                                                                <Save size={16} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}
                                                                className="h-8 w-8 text-stone-400 hover:bg-stone-100 hover:text-stone-600" title="ยกเลิก">
                                                                <X size={16} />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => { setEditingId(staff.id); setEditPosition(staff.position || ''); setEditSortOrder(staff.sortOrder || 0); }}
                                                                className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600" title="แก้ไข">
                                                                <Edit3 size={16} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => setDeleteTargetId(staff.id)}
                                                                className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600" title="ลบ">
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบข้อมูล</DialogTitle>
                        <DialogDescription>
                            คุณต้องการลบบุคลากร <strong>{activeStaffToDelete?.firstName} {activeStaffToDelete?.lastName}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>ยืนยันลบ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
