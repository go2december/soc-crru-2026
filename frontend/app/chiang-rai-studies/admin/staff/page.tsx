
'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Loader2, RefreshCw, ArrowLeft, Search, Save } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const ROLES = [
    { value: 'DIRECTOR', label: 'ผู้อำนวยการศูนย์ฯ' },
    { value: 'ACADEMIC', label: 'ฝ่ายวิชาการ' },
    { value: 'NETWORK', label: 'ฝ่ายประสานเครือข่าย' },
    { value: 'DISSEMINATION', label: 'ฝ่ายเผยแพร่และสารสนเทศ' },
    { value: 'SUPPORT', label: 'เจ้าหน้าที่ช่วยงานทั่วไป' },
];

export default function AdminStaffPage() {
    const [activeTab, setActiveTab] = useState<'LIST' | 'IMPORT'>('LIST');
    const [staffList, setStaffList] = useState<any[]>([]);
    const [facultyStaffList, setFacultyStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Import Selection
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [selectedRole, setSelectedRole] = useState('ACADEMIC');
    const [importLoading, setImportLoading] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/chiang-rai/staff`);
            if (res.ok) {
                const data = await res.json();
                setStaffList(data);
            }
        } catch (error) {
            console.error('Failed to fetch staff', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacultyStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/chiang-rai/admin/faculty-staff`);
            if (res.ok) {
                const data = await res.json();
                setFacultyStaffList(data);
            }
        } catch (error) {
            console.error('Failed to fetch faculty staff', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try {
            const res = await fetch(`${API_URL}/chiang-rai/staff/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchStaff();
            }
        } catch (error) {
            alert('ลบข้อมูลไม่สำเร็จ');
        }
    };

    const handleImport = async () => {
        if (!selectedFacultyId) return alert('กรุณาเลือกบุคลากร');

        setImportLoading(true);
        try {
            const res = await fetch(`${API_URL}/chiang-rai/staff/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facultyStaffId: selectedFacultyId,
                    role: selectedRole
                })
            });

            if (res.ok) {
                alert('นำเข้าข้อมูลสำเร็จ');
                setActiveTab('LIST');
                fetchStaff();
            } else {
                const err = await res.json();
                alert('นำเข้าไม่สำเร็จ: ' + err.message);
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setImportLoading(false);
        }
    };

    // Switch Tabs
    const handleTabChange = (tab: 'LIST' | 'IMPORT') => {
        setActiveTab(tab);
        if (tab === 'LIST') fetchStaff();
        else fetchFacultyStaff();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-stone-800">จัดการบุคลากร (Staff Management)</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleTabChange('LIST')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'LIST' ? 'bg-amber-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
                    >
                        รายชื่อบุคลากร
                    </button>
                    <button
                        onClick={() => handleTabChange('IMPORT')}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'IMPORT' ? 'bg-amber-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
                    >
                        <UserPlus size={18} /> นำเข้าจากคณะ
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-amber-600" size={32} />
                </div>
            )}

            {!loading && activeTab === 'LIST' && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="text-left p-4 font-bold text-stone-600">รูปภาพ</th>
                                <th className="text-left p-4 font-bold text-stone-600">ชื่อ-สกุล</th>
                                <th className="text-left p-4 font-bold text-stone-600">ตำแหน่ง/บทบาท</th>
                                <th className="text-right p-4 font-bold text-stone-600">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-stone-400">ยังไม่มีข้อมูลบุคลากร</td>
                                </tr>
                            ) : (
                                staffList.map((staff) => (
                                    <tr key={staff.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                                {staff.imageUrl ? (
                                                    <img src={staff.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-400">?</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-stone-800">
                                            {staff.title} {staff.firstName} {staff.lastName}
                                        </td>
                                        <td className="p-4 text-stone-600">
                                            <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold mr-2">
                                                {staff.role}
                                            </span>
                                            <span className="text-xs">{staff.position}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(staff.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                title="ลบ"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && activeTab === 'IMPORT' && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserPlus className="text-amber-600" /> เลือกบุคลากรจากคณะ
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">1. เลือกบุคลากร</label>
                            <select
                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                value={selectedFacultyId}
                                onChange={(e) => setSelectedFacultyId(e.target.value)}
                            >
                                <option value="">-- เลือกรายชื่อ --</option>
                                {facultyStaffList.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.firstNameTh} {s.lastNameTh} ({s.department || 'ไม่ระบุสังกัด'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">2. กำหนดบทบาทในศูนย์ฯ</label>
                            <div className="grid grid-cols-1 gap-2">
                                {ROLES.map((role) => (
                                    <label key={role.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${selectedRole === role.value ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={selectedRole === role.value}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="font-medium text-stone-700">{role.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={handleImport}
                                disabled={importLoading}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {importLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                บันทึกข้อมูล
                            </button>
                            <button
                                onClick={() => setActiveTab('LIST')}
                                className="px-6 py-3 border border-stone-300 rounded-lg font-medium text-stone-600 hover:bg-stone-50"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
