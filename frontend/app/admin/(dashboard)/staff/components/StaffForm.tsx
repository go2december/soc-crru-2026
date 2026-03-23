'use client';

import { useState, useEffect, useRef } from 'react';
import { Staff, Department, User, Position } from '../hooks/useStaffData';
import { Link2, GraduationCap, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface StaffFormProps {
    initialData: Staff | null;
    departments: Department[];
    users: User[];
    academicPositions: Position[];
    adminPositions: Position[];
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const EDU_LEVELS = [
    { value: 'DOCTORAL', label: 'ปริญญาเอก (Doctoral)' },
    { value: 'MASTER', label: 'ปริญญาโท (Master)' },
    { value: 'BACHELOR', label: 'ปริญญาตรี (Bachelor)' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function StaffForm({ initialData, departments, users, academicPositions, adminPositions, onSubmit, onCancel, isLoading }: StaffFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Initial State structure
    const getInitialState = () => ({
        prefixTh: '', firstNameTh: '', lastNameTh: '',
        prefixEn: '', firstNameEn: '', lastNameEn: '',
        staffType: 'ACADEMIC',
        academicPositionId: '',
        adminPositionId: '',
        contactEmail: '',
        departmentId: '',
        userId: '',
        isExecutive: false,
        imageUrl: '',
    });

    const [formData, setFormData] = useState(getInitialState());
    const [eduList, setEduList] = useState<{ level: string; detail: string }[]>([]);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [shortBiosList, setShortBiosList] = useState<string[]>([]);

    // Inputs for adding new items
    const [newEduLevel, setNewEduLevel] = useState('DOCTORAL');
    const [newEduDetail, setNewEduDetail] = useState('');
    const [newExpertise, setNewExpertise] = useState('');
    const [newShortBio, setNewShortBio] = useState('');

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
                academicPositionId: initialData.academicPositionId?.toString() || '',
                adminPositionId: initialData.adminPositionId?.toString() || '',
                contactEmail: initialData.contactEmail || '',
                departmentId: initialData.departmentId ? initialData.departmentId.toString() : '',
                userId: initialData.userId || '',
                isExecutive: initialData.isExecutive || false,
                imageUrl: initialData.imageUrl || '',
            });
            setEduList(initialData.education || []);
            setExpertiseList(initialData.expertise || []);
            setShortBiosList(initialData.shortBios || []);
        } else {
            setFormData(getInitialState());
            setEduList([]);
            setExpertiseList([]);
            setShortBiosList([]);
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
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
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

        const cleanString = (val: string | null | undefined) => {
            if (!val || val.trim() === '') return undefined;
            return val.trim();
        };

        // Prepare payload
        const payload = {
            ...formData,
            departmentId: parseInt(formData.departmentId || '0'),
            academicPositionId: formData.staffType === 'ACADEMIC' && formData.academicPositionId ? parseInt(formData.academicPositionId) : undefined,
            userId: cleanString(formData.userId),
            prefixTh: cleanString(formData.prefixTh),
            firstNameTh: formData.firstNameTh.trim(),
            lastNameTh: formData.lastNameTh.trim(),
            prefixEn: cleanString(formData.prefixEn),
            firstNameEn: cleanString(formData.firstNameEn),
            lastNameEn: cleanString(formData.lastNameEn),
            adminPositionId: formData.adminPositionId ? parseInt(formData.adminPositionId) : undefined,
            contactEmail: cleanString(formData.contactEmail),
            imageUrl: cleanString(formData.imageUrl),
            education: eduList,
            expertise: expertiseList,
            shortBios: shortBiosList,
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

    const addShortBio = () => {
        if (!newShortBio.trim()) return;
        if (!shortBiosList.includes(newShortBio.trim())) {
            setShortBiosList([...shortBiosList, newShortBio.trim()]);
        }
        setNewShortBio('');
    };

    const badgeClassForEducation = (level: string) => {
        if (level === 'DOCTORAL') return 'border-red-200 bg-red-100 text-red-700';
        if (level === 'MASTER') return 'border-amber-200 bg-amber-100 text-amber-700';
        return 'border-blue-200 bg-blue-100 text-blue-700';
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* 1. General Info */}
            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-xl font-medium">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">1</span> ข้อมูลทั่วไป (General Info)
                </div>
                <div className="rounded-xl border bg-background p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Link Section */}
                        <div className="md:col-span-2 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                            <Label className="mb-2 flex pt-0 font-bold text-blue-900 gap-1.5"><Link2 className="w-4 h-4 text-blue-700" /> เชื่อมโยงบัญชีผู้ใช้ (Login Account)</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" value={formData.userId} onChange={(e) => handleUserSelect(e.target.value)}>
                                <option value="">-- ไม่เชื่อมโยง (ข้อมูลแสดงผลเท่านั้น) --</option>
                                {users.map(u => (<option key={u.id} value={u.id}>{u.email} ({u.name})</option>))}
                            </select>
                            <p className="pt-2 text-xs opacity-60">เลือกบัญชีผู้ใช้เพื่อให้เจ้าตัวสามารถ Login เข้ามาแก้ไขข้อมูลตัวเองได้</p>
                        </div>

                        {/* Name TH */}
                        <div className="space-y-2">
                            <Label>คำนำหน้า (ไทย)</Label>
                            <Input type="text" value={formData.prefixTh} onChange={e => setFormData({ ...formData, prefixTh: e.target.value })} placeholder="เช่น ผศ., ดร." />
                        </div>
                        <div className="space-y-2">
                            <Label>ชื่อ (ไทย) <span className="text-destructive">*</span></Label>
                            <Input type="text" required value={formData.firstNameTh} onChange={e => setFormData({ ...formData, firstNameTh: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>นามสกุล (ไทย) <span className="text-destructive">*</span></Label>
                            <Input type="text" required value={formData.lastNameTh} onChange={e => setFormData({ ...formData, lastNameTh: e.target.value })} />
                        </div>

                        {/* Name EN */}
                        <div className="md:col-span-2 border-t pt-4 text-xs uppercase tracking-widest text-muted-foreground">English Name</div>

                        <div className="space-y-2">
                            <Label>Prefix (EN)</Label>
                            <Input type="text" value={formData.prefixEn} onChange={e => setFormData({ ...formData, prefixEn: e.target.value })} placeholder="e.g. Dr., Asst. Prof." />
                        </div>
                        <div className="space-y-2">
                            <Label>First Name (EN)</Label>
                            <Input type="text" value={formData.firstNameEn} onChange={e => setFormData({ ...formData, firstNameEn: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Last Name (EN)</Label>
                            <Input type="text" value={formData.lastNameEn} onChange={e => setFormData({ ...formData, lastNameEn: e.target.value })} />
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2 mt-4 rounded-xl border p-4">
                            <Label className="mb-3 block font-bold">รูปโปรไฟล์ (Profile Image)</Label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="relative group">
                                    <div className={`relative aspect-[3/4] w-32 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted shadow-sm ${uploading ? 'opacity-50' : ''}`}>
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
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        disabled={!formData.imageUrl}
                                    ><X className="w-4 h-4" /></Button>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="block w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            รองรับ JPG, PNG. ขนาดแนะนำ: ไม่เกิน 2MB. ระบบจะปรับขนาดและแปลงเป็น WebP อัตโนมัติ
                                        </p>
                                    </div>
                                    <div className="my-1 border-t pt-3 text-xs text-muted-foreground">หรือ</div>
                                    <Input
                                        type="text"
                                        value={formData.imageUrl}
                                        placeholder="วาง URL ของรูปภาพโดยตรง..."
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>อีเมลสำหรับติดต่อ (Contact Email)</Label>
                            <Input type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="example@crru.ac.th" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Position & Status */}
            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-xl font-medium">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-secondary-foreground">2</span> ตำแหน่งและสังกัด (Position & Dept)
                </div>
                <div className="rounded-xl border bg-background p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ประเภทบุคลากร <span className="text-destructive">*</span></Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" value={formData.staffType} onChange={e => setFormData({ ...formData, staffType: e.target.value as 'ACADEMIC' | 'SUPPORT' })}>
                                <option value="ACADEMIC">สายวิชาการ (Academic)</option>
                                <option value="SUPPORT">สายสนับสนุน (Support)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>สังกัด (Department) <span className="text-destructive">*</span></Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                                <option value="">-- เลือกสังกัด --</option>
                                {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.nameTh}</option>))}
                            </select>
                        </div>

                        {formData.staffType === 'ACADEMIC' && (
                            <div className="space-y-2">
                                <Label>ตำแหน่งทางวิชาการ</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" value={formData.academicPositionId} onChange={e => setFormData({ ...formData, academicPositionId: e.target.value })}>
                                    <option value="">-- ไม่มี --</option>
                                    {academicPositions.map(p => (<option key={p.id} value={p.id}>{p.nameTh}</option>))}
                                </select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>ตำแหน่งบริหาร / หน้าที่</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" value={formData.adminPositionId} onChange={e => setFormData({ ...formData, adminPositionId: e.target.value })}>
                                <option value="">-- ไม่มี --</option>
                                {adminPositions.map(p => (<option key={p.id} value={p.id}>{p.nameTh}</option>))}
                            </select>
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <label className="flex cursor-pointer justify-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100">
                                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary" checked={formData.isExecutive} onChange={e => setFormData({ ...formData, isExecutive: e.target.checked })} />
                                <div>
                                    <span className="font-bold text-slate-800">ผู้บริหารระดับสูง (Executive Committee)</span>
                                    <p className="mt-1 text-xs opacity-60">แสดงในหน้าทำเนียบผู้บริหารของคณะ</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Education & Expertise */}
            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-xl font-medium">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">3</span> การศึกษาและความเชี่ยวชาญ
                </div>
                <div className="rounded-xl border bg-background p-4">
                    <div className="space-y-6">

                        {/* Education List */}
                        <div>
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <GraduationCap className="w-5 h-5 text-gray-400" /> ประวัติการศึกษา (Education)
                            </h4>
                            <div className="flex gap-2 mb-3 items-end">
                                <div className="w-1/3">
                                    <Label className="py-1 text-xs opacity-50">ระดับ</Label>
                                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" value={newEduLevel} onChange={e => setNewEduLevel(e.target.value)}>
                                        {EDU_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <Label className="py-1 text-xs opacity-50">รายละเอียด</Label>
                                    <Input type="text" placeholder="ระบุวุฒิ, สาขา, สถาบัน..." value={newEduDetail} onChange={e => setNewEduDetail(e.target.value)} />
                                </div>
                                <Button type="button" onClick={addEducation}>เพิ่ม</Button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 min-h-[60px] space-y-2">
                                {eduList.length === 0 && <p className="text-xs text-gray-400 text-center py-4">ยังไม่มีข้อมูลการศึกษา</p>}
                                {eduList.map((edu, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-sm group hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', badgeClassForEducation(edu.level))}>
                                                {EDU_LEVELS.find(l => l.value === edu.level)?.label.split(' ')[0]}
                                            </div>
                                            <span>{edu.detail}</span>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                            const newList = [...eduList];
                                            newList.splice(idx, 1);
                                            setEduList(newList);
                                        }} className="h-7 w-7 text-red-500 opacity-20 group-hover:opacity-100 hover:bg-red-50"><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expertise Tags */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-gray-400" /> ความเชี่ยวชาญ (Expertise)
                            </h4>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    type="text"
                                    className="flex-1"
                                    placeholder="เพิ่มความเชี่ยวชาญ (เช่น Sociology, Data Science, การพัฒนาชุมชน)..."
                                    value={newExpertise}
                                    onChange={e => setNewExpertise(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
                                />
                                <Button type="button" variant="secondary" onClick={addExpertise}>เพิ่ม Tag</Button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 min-h-[60px] flex flex-wrap gap-2">
                                {expertiseList.length === 0 && <p className="text-xs text-gray-400 w-full text-center py-2">ยังไม่มีข้อมูลความเชี่ยวชาญ</p>}
                                {expertiseList.map((tag, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-shadow hover:shadow-md">
                                        {tag}
                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                            setExpertiseList(expertiseList.filter(t => t !== tag));
                                        }} className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Short Bios */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-gray-400" /> รายละเอียดความเชี่ยวชาญสั้น ๆ (Short Bio)
                            </h4>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    type="text"
                                    className="flex-1"
                                    placeholder="เพิ่มรายละเอียด (เช่น ผู้เชี่ยวชาญด้านการพัฒนาสังคม...)"
                                    value={newShortBio}
                                    onChange={e => setNewShortBio(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addShortBio(); } }}
                                />
                                <Button type="button" onClick={addShortBio}>เพิ่ม</Button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 min-h-[60px] flex flex-col gap-2">
                                {shortBiosList.length === 0 && <p className="text-xs text-gray-400 w-full text-center py-2">ยังไม่มีข้อมูล Short Bio</p>}
                                {shortBiosList.map((bio, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-sm group hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <span>{bio}</span>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                            setShortBiosList(shortBiosList.filter(b => b !== bio));
                                        }} className="h-7 w-7 text-red-500 opacity-20 group-hover:opacity-100 hover:bg-red-50"><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <Button type="button" onClick={onCancel} variant="ghost" disabled={isLoading}>ยกเลิก</Button>
                <Button type="submit" className="px-8" disabled={isLoading}>
                    {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </Button>
            </div>
        </form>
    );
}
