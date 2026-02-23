'use client';

import { useState, useEffect, useRef } from 'react';
import { Staff, Department, User } from './hooks/useStaffData';

interface StaffFormProps {
    initialData: Staff | null;
    departments: Department[];
    users: User[];
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const ACADEMIC_POSITIONS = [
    { value: 'LECTURER', label: 'อาจารย์' },
    { value: 'ASSISTANT_PROF', label: 'ผู้ช่วยศาสตราจารย์ (ผศ.)' },
    { value: 'ASSOCIATE_PROF', label: 'รองศาสตราจารย์ (รศ.)' },
    { value: 'PROFESSOR', label: 'ศาสตราจารย์ (ศ.)' },
];

export const EDU_LEVELS = [
    { value: 'DOCTORAL', label: 'ปริญญาเอก (Doctoral)' },
    { value: 'MASTER', label: 'ปริญญาโท (Master)' },
    { value: 'BACHELOR', label: 'ปริญญาตรี (Bachelor)' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function StaffForm({ initialData, departments, users, onSubmit, onCancel, isLoading }: StaffFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Initial State structure
    const getInitialState = () => ({
        prefixTh: '', firstNameTh: '', lastNameTh: '',
        prefixEn: '', firstNameEn: '', lastNameEn: '',
        staffType: 'ACADEMIC',
        academicPosition: '',
        adminPosition: '',
        contactEmail: '',
        departmentId: '',
        userId: '',
        isExecutive: false,
        imageUrl: '',
    });

    const [formData, setFormData] = useState(getInitialState());
    const [eduList, setEduList] = useState<{ level: string; detail: string }[]>([]);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);

    // Inputs for adding new items
    const [newEduLevel, setNewEduLevel] = useState('DOCTORAL');
    const [newEduDetail, setNewEduDetail] = useState('');
    const [newExpertise, setNewExpertise] = useState('');

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setFormData({
                prefixTh: initialData.prefixTh || '',
                firstNameTh: initialData.firstNameTh,
                lastNameTh: initialData.lastNameTh,
                prefixEn: initialData.prefixEn || '',
                firstNameEn: initialData.firstNameEn || '',
                lastNameEn: initialData.lastNameEn || '',
                staffType: initialData.staffType,
                academicPosition: initialData.academicPosition || '',
                adminPosition: initialData.adminPosition || '',
                contactEmail: initialData.contactEmail || '',
                departmentId: initialData.departmentId ? initialData.departmentId.toString() : '',
                userId: initialData.userId || '',
                isExecutive: initialData.isExecutive || false,
                imageUrl: initialData.imageUrl || '',
            });
            setEduList(initialData.education || []);
            setExpertiseList(initialData.expertise || []);
        } else {
            setFormData(getInitialState());
            setEduList([]);
            setExpertiseList([]);
        }
    }, [initialData]);

    const handleUserSelect = (userId: string) => {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
            setFormData(prev => ({
                ...prev,
                userId: userId,
                contactEmail: prev.contactEmail || selectedUser.email,
            }));
        } else {
            setFormData(prev => ({ ...prev, userId: '' }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        const token = localStorage.getItem('admin_token');

        try {
            const res = await fetch(`${API_URL}/api/upload/staff`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadData
            });
            if (res.ok) {
                const data = await res.json();
                const fullUrl = data.url.startsWith('http') ? data.url : `${API_URL}${data.url}`;
                setFormData(prev => ({ ...prev, imageUrl: fullUrl }));
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error('Upload error', err);
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare payload
        const payload = {
            ...formData,
            departmentId: parseInt(formData.departmentId || '0'),
            academicPosition: formData.staffType === 'ACADEMIC' && formData.academicPosition ? formData.academicPosition : undefined,
            userId: formData.userId || undefined,
            education: eduList,
            expertise: expertiseList,
        };

        onSubmit(payload);
    };

    // List Handlers
    const addEducation = () => {
        if (!newEduDetail.trim()) return;
        setEduList([...eduList, { level: newEduLevel, detail: newEduDetail.trim() }]);
        setNewEduDetail('');
    };

    const addExpertise = () => {
        if (!newExpertise.trim()) return;
        if (!expertiseList.includes(newExpertise.trim())) {
            setExpertiseList([...expertiseList, newExpertise.trim()]);
        }
        setNewExpertise('');
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* 1. General Info */}
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
                <input type="radio" name="staff_accordion" defaultChecked />
                <div className="collapse-title text-xl font-medium flex items-center gap-2">
                    <span className="badge badge-primary badge-lg">1</span> ข้อมูลทั่วไป (General Info)
                </div>
                <div className="collapse-content pt-4 bg-base-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Link Section */}
                        <div className="md:col-span-2 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                            <label className="label pt-0"><span className="label-text font-bold text-blue-900">🔗 เชื่อมโยงบัญชีผู้ใช้ (Login Account)</span></label>
                            <select className="select select-bordered w-full" value={formData.userId} onChange={(e) => handleUserSelect(e.target.value)}>
                                <option value="">-- ไม่เชื่อมโยง (ข้อมูลแสดงผลเท่านั้น) --</option>
                                {users.map(u => (<option key={u.id} value={u.id}>{u.email} ({u.name})</option>))}
                            </select>
                            <div className="label pb-0">
                                <span className="label-text-alt opacity-60">เลือกบัญชีผู้ใช้เพื่อให้เจ้าตัวสามารถ Login เข้ามาแก้ไขข้อมูลตัวเองได้</span>
                            </div>
                        </div>

                        {/* Name TH */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">คำนำหน้า (ไทย)</span></label>
                            <input type="text" className="input input-bordered focus:input-primary" value={formData.prefixTh} onChange={e => setFormData({ ...formData, prefixTh: e.target.value })} placeholder="เช่น ผศ., ดร." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">ชื่อ (ไทย) <span className="text-error">*</span></span></label>
                            <input type="text" className="input input-bordered focus:input-primary" required value={formData.firstNameTh} onChange={e => setFormData({ ...formData, firstNameTh: e.target.value })} />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text font-medium">นามสกุล (ไทย) <span className="text-error">*</span></span></label>
                            <input type="text" className="input input-bordered focus:input-primary" required value={formData.lastNameTh} onChange={e => setFormData({ ...formData, lastNameTh: e.target.value })} />
                        </div>

                        {/* Name EN */}
                        <div className="divider md:col-span-2 text-xs opacity-50 uppercase tracking-widest">English Name</div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Prefix (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.prefixEn} onChange={e => setFormData({ ...formData, prefixEn: e.target.value })} placeholder="e.g. Dr., Asst. Prof." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">First Name (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.firstNameEn} onChange={e => setFormData({ ...formData, firstNameEn: e.target.value })} />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Last Name (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.lastNameEn} onChange={e => setFormData({ ...formData, lastNameEn: e.target.value })} />
                        </div>

                        {/* Image Upload */}
                        <div className="form-control md:col-span-2 mt-4 p-4 border border-base-200 rounded-xl bg-base-50">
                            <label className="label pt-0"><span className="label-text font-bold">รูปโปรไฟล์ (Profile Image)</span></label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="relative group">
                                    <div className={`aspect-[3/4] w-32 bg-base-200 rounded-lg overflow-hidden border-2 border-dashed border-base-300 shadow-sm relative ${uploading ? 'opacity-50' : ''}`}>
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl.startsWith('/') ? `${API_URL}${formData.imageUrl}` : formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs p-2 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <span className="loading loading-spinner text-white"></span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-circle absolute -top-2 -right-2 bg-base-100 shadow-md border-base-300"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        disabled={!formData.imageUrl}
                                    >✕</button>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <p className="text-xs text-gray-500">
                                            รองรับ JPG, PNG. ขนาดแนะนำ: ไม่เกิน 2MB. ระบบจะปรับขนาดและแปลงเป็น WebP อัตโนมัติ
                                        </p>
                                    </div>
                                    <div className="divider my-1 text-xs text-gray-400">หรือ</div>
                                    <input
                                        type="text"
                                        className="input input-sm input-bordered w-full"
                                        value={formData.imageUrl}
                                        placeholder="วาง URL ของรูปภาพโดยตรง..."
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text font-medium">อีเมลสำหรับติดต่อ (Contact Email)</span></label>
                            <input type="email" className="input input-bordered" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="example@crru.ac.th" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Position & Status */}
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
                <input type="radio" name="staff_accordion" />
                <div className="collapse-title text-xl font-medium flex items-center gap-2">
                    <span className="badge badge-secondary badge-lg">2</span> ตำแหน่งและสังกัด (Position & Dept)
                </div>
                <div className="collapse-content pt-4 bg-base-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">ประเภทบุคลากร <span className="text-error">*</span></span></label>
                            <select className="select select-bordered" value={formData.staffType} onChange={e => setFormData({ ...formData, staffType: e.target.value as any })}>
                                <option value="ACADEMIC">👨‍🏫 สายวิชาการ (Academic)</option>
                                <option value="SUPPORT">🛠️ สายสนับสนุน (Support)</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">สังกัด (Department) <span className="text-error">*</span></span></label>
                            <select className="select select-bordered" required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                                <option value="">-- เลือกสังกัด --</option>
                                {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.nameTh}</option>))}
                            </select>
                        </div>

                        {formData.staffType === 'ACADEMIC' && (
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">ตำแหน่งทางวิชาการ</span></label>
                                <select className="select select-bordered" value={formData.academicPosition} onChange={e => setFormData({ ...formData, academicPosition: e.target.value })}>
                                    <option value="">-- ไม่มี --</option>
                                    {ACADEMIC_POSITIONS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
                                </select>
                            </div>
                        )}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">ตำแหน่งบริหาร / หน้าที่</span></label>
                            <input type="text" className="input input-bordered" value={formData.adminPosition} onChange={e => setFormData({ ...formData, adminPosition: e.target.value })} placeholder="เช่น คณบดี, หัวหน้าสำนักงาน" />
                        </div>

                        <div className="form-control md:col-span-2 mt-2">
                            <label className="cursor-pointer label justify-start gap-4 p-4 border border-warning/30 bg-warning/5 rounded-xl hover:bg-warning/10 transition-colors">
                                <input type="checkbox" className="checkbox checkbox-warning" checked={formData.isExecutive} onChange={e => setFormData({ ...formData, isExecutive: e.target.checked })} />
                                <div>
                                    <span className="label-text font-bold text-gray-800">ผู้บริหารระดับสูง (Executive Committee)</span>
                                    <p className="text-xs opacity-60 mt-1">แสดงในหน้าทำเนียบผู้บริหารของคณะ</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Education & Expertise */}
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
                <input type="radio" name="staff_accordion" />
                <div className="collapse-title text-xl font-medium flex items-center gap-2">
                    <span className="badge badge-accent badge-lg text-white">3</span> การศึกษาและความเชี่ยวชาญ
                </div>
                <div className="collapse-content pt-4 bg-base-100">
                    <div className="space-y-6">

                        {/* Education List */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                🎓 ประวัติการศึกษา (Education)
                            </h4>
                            <div className="flex gap-2 mb-3 items-end">
                                <div className="w-1/3">
                                    <label className="label py-1 text-xs opacity-50">ระดับ</label>
                                    <select className="select select-sm select-bordered w-full" value={newEduLevel} onChange={e => setNewEduLevel(e.target.value)}>
                                        {EDU_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="label py-1 text-xs opacity-50">รายละเอียด</label>
                                    <input type="text" className="input input-sm input-bordered w-full" placeholder="ระบุวุฒิ, สาขา, สถาบัน..." value={newEduDetail} onChange={e => setNewEduDetail(e.target.value)} />
                                </div>
                                <button type="button" onClick={addEducation} className="btn btn-sm btn-primary">เพิ่ม</button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 min-h-[60px] space-y-2">
                                {eduList.length === 0 && <p className="text-xs text-gray-400 text-center py-4">ยังไม่มีข้อมูลการศึกษา</p>}
                                {eduList.map((edu, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-sm group hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className={`badge badge-sm ${edu.level === 'DOCTORAL' ? 'badge-error' : edu.level === 'MASTER' ? 'badge-warning' : 'badge-info'} text-white`}>
                                                {EDU_LEVELS.find(l => l.value === edu.level)?.label.split(' ')[0]}
                                            </div>
                                            <span>{edu.detail}</span>
                                        </div>
                                        <button type="button" onClick={() => {
                                            const newList = [...eduList];
                                            newList.splice(idx, 1);
                                            setEduList(newList);
                                        }} className="btn btn-xs btn-circle btn-ghost text-red-500 opacity-20 group-hover:opacity-100 hover:bg-red-50">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expertise Tags */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                🧠 ความเชี่ยวชาญ (Expertise)
                            </h4>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="input input-sm input-bordered flex-1"
                                    placeholder="เพิ่มความเชี่ยวชาญ (เช่น Sociology, Data Science, การพัฒนาชุมชน)..."
                                    value={newExpertise}
                                    onChange={e => setNewExpertise(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
                                />
                                <button type="button" onClick={addExpertise} className="btn btn-sm btn-secondary">เพิ่ม Tag</button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 min-h-[60px] flex flex-wrap gap-2">
                                {expertiseList.length === 0 && <p className="text-xs text-gray-400 w-full text-center py-2">ยังไม่มีข้อมูลความเชี่ยวชาญ</p>}
                                {expertiseList.map((tag, idx) => (
                                    <div key={idx} className="badge badge-lg bg-white border-gray-200 shadow-sm gap-2 pl-3 pr-1 py-4 hover:shadow-md transition-shadow">
                                        {tag}
                                        <button type="button" onClick={() => {
                                            setExpertiseList(expertiseList.filter(t => t !== tag));
                                        }} className="btn btn-xs btn-circle btn-ghost text-gray-400 hover:text-red-500 hover:bg-red-50">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="modal-action mt-6 flex justify-between items-center border-t border-base-200 pt-4">
                <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={isLoading}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary px-8" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : 'บันทึกข้อมูล'}
                </button>
            </div>
        </form>
    );
}
