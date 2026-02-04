'use client';

import { useState, useEffect, useRef } from 'react';
import { Staff, Department, User } from './hooks/useStaffData';
import { adminPositionService, AdminPosition } from '@/services/adminPositionService';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Upload, Image as ImageIcon, ChevronDown } from "lucide-react";

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

// Simple Accordion Component for internal use
const FormSection = ({ title, badge, children, defaultOpen = true }: { title: string, badge: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border rounded-lg overflow-hidden bg-card">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full">{badge}</Badge>
                    <span className="font-medium text-lg">{title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-6 border-t animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};

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
    const [positions, setPositions] = useState<AdminPosition[]>([]);

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

    // Load admin positions
    useEffect(() => {
        adminPositionService.getAll().then(setPositions).catch(err => console.error("Failed to load positions", err));
    }, []);

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/upload/staff`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadData
            });
            if (res.ok) {
                const data = await res.json();
                // Store relative URL path to keep DB clean
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. General Info */}
            <FormSection title="ข้อมูลทั่วไป (General Info)" badge="1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* User Link Section */}
                    <div className="md:col-span-2 p-4 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                        <Label className="text-blue-900 dark:text-blue-300 font-bold mb-2 block">🔗 เชื่อมโยงบัญชีผู้ใช้ (Login Account)</Label>
                        <Select className="w-full bg-background" value={formData.userId} onChange={(e) => handleUserSelect(e.target.value)}>
                            <option value="">-- ไม่เชื่อมโยง (ข้อมูลแสดงผลเท่านั้น) --</option>
                            {users.map(u => (<option key={u.id} value={u.id}>{u.email} ({u.name})</option>))}
                        </Select>
                        <p className="text-xs text-muted-foreground mt-2">เลือกบัญชีผู้ใช้เพื่อให้เจ้าตัวสามารถ Login เข้ามาแก้ไขข้อมูลตัวเองได้</p>
                    </div>

                    {/* Name TH */}
                    <div className="space-y-2">
                        <Label>คำนำหน้า (ไทย)</Label>
                        <Input value={formData.prefixTh} onChange={e => setFormData({ ...formData, prefixTh: e.target.value })} placeholder="เช่น ผศ., ดร." />
                    </div>
                    <div className="space-y-2">
                        <Label>ชื่อ (ไทย) <span className="text-destructive">*</span></Label>
                        <Input required value={formData.firstNameTh} onChange={e => setFormData({ ...formData, firstNameTh: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>นามสกุล (ไทย) <span className="text-destructive">*</span></Label>
                        <Input required value={formData.lastNameTh} onChange={e => setFormData({ ...formData, lastNameTh: e.target.value })} />
                    </div>

                    {/* Name EN */}
                    <div className="md:col-span-2 relative py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">English Name</span></div>
                    </div>

                    <div className="space-y-2">
                        <Label>Prefix (EN)</Label>
                        <Input value={formData.prefixEn} onChange={e => setFormData({ ...formData, prefixEn: e.target.value })} placeholder="e.g. Dr., Asst. Prof." />
                    </div>
                    <div className="space-y-2">
                        <Label>First Name (EN)</Label>
                        <Input value={formData.firstNameEn} onChange={e => setFormData({ ...formData, firstNameEn: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Last Name (EN)</Label>
                        <Input value={formData.lastNameEn} onChange={e => setFormData({ ...formData, lastNameEn: e.target.value })} />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2 mt-2 p-6 border rounded-xl bg-muted/20">
                        <Label className=" font-bold mb-4 block">รูปโปรไฟล์ (Profile Image)</Label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative group shrink-0">
                                <div className={`aspect-[3/4] w-32 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 shadow-sm relative flex items-center justify-center ${uploading ? 'opacity-50' : ''}`}>
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'}${formData.imageUrl}`}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center">
                                            <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                    disabled={!formData.imageUrl}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="max-w-xs"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        รองรับ JPG, PNG. ขนาดแนะนำ: ไม่เกิน 2MB. ระบบจะปรับขนาดอัตโนมัติ
                                    </p>
                                </div>
                                <div className="relative py-1">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs"><span className="bg-muted/20 px-2 text-muted-foreground">หรือใช้ URL</span></div>
                                </div>
                                <Input
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
            </FormSection>

            {/* 2. Position & Status */}
            <FormSection title="ตำแหน่งและสังกัด (Position & Dept)" badge="2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>ประเภทบุคลากร <span className="text-destructive">*</span></Label>
                        <Select value={formData.staffType} onChange={e => setFormData({ ...formData, staffType: e.target.value as any })}>
                            <option value="ACADEMIC">👨‍🏫 สายวิชาการ (Academic)</option>
                            <option value="SUPPORT">🛠️ สายสนับสนุน (Support)</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>สังกัด (Department) <span className="text-destructive">*</span></Label>
                        <Select required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                            <option value="">-- เลือกสังกัด --</option>
                            {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.nameTh}</option>))}
                        </Select>
                    </div>

                    {formData.staffType === 'ACADEMIC' && (
                        <div className="space-y-2">
                            <Label>ตำแหน่งทางวิชาการ</Label>
                            <Select value={formData.academicPosition} onChange={e => setFormData({ ...formData, academicPosition: e.target.value })}>
                                <option value="">-- ไม่มี --</option>
                                {ACADEMIC_POSITIONS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
                            </Select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>ตำแหน่งบริหาร / หน้าที่</Label>
                            <a href="/admin/positions" target="_blank" className="text-[10px] text-blue-500 hover:underline">จัดการตัวเลือก +</a>
                        </div>
                        <Select value={formData.adminPosition} onChange={e => setFormData({ ...formData, adminPosition: e.target.value })}>
                            <option value="">-- เลือกตำแหน่ง / หน้าที่ --</option>
                            {positions.sort((a, b) => (a.level || 0) - (b.level || 0)).map(p => (
                                <option key={p.id} value={p.nameTh}>{p.nameTh}</option>
                            ))}
                            {/* Fallback for existing data not in list */}
                            {formData.adminPosition && !positions.some(p => p.nameTh === formData.adminPosition) && (
                                <option value={formData.adminPosition}>{formData.adminPosition} (Custom/Legacy)</option>
                            )}
                        </Select>
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <label className="flex items-start gap-4 p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-xl hover:bg-yellow-500/10 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                checked={formData.isExecutive}
                                onChange={e => setFormData({ ...formData, isExecutive: e.target.checked })}
                            />
                            <div>
                                <span className="font-bold text-foreground block">ผู้บริหารระดับสูง (Executive Committee)</span>
                                <p className="text-xs text-muted-foreground mt-1">แสดงในหน้าทำเนียบผู้บริหารของคณะ</p>
                            </div>
                        </label>
                    </div>
                </div>
            </FormSection>

            {/* 3. Education & Expertise */}
            <FormSection title="การศึกษาและความเชี่ยวชาญ" badge="3">
                <div className="space-y-8">
                    {/* Education List */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            🎓 ประวัติการศึกษา (Education)
                        </h4>
                        <div className="flex gap-2 mb-4 items-end">
                            <div className="w-1/3 space-y-2">
                                <Label className="text-xs">ระดับ</Label>
                                <Select value={newEduLevel} onChange={e => setNewEduLevel(e.target.value)}>
                                    {EDU_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs">รายละเอียด</Label>
                                <Input placeholder="ระบุวุฒิ, สาขา, สถาบัน..." value={newEduDetail} onChange={e => setNewEduDetail(e.target.value)} />
                            </div>
                            <Button type="button" onClick={addEducation}>เพิ่ม</Button>
                        </div>
                        <div className="bg-muted/30 rounded-xl border p-4 min-h-[60px] space-y-2">
                            {eduList.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">ยังไม่มีข้อมูลการศึกษา</p>}
                            {eduList.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-card px-4 py-3 rounded-lg border shadow-sm text-sm group hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Badge variant={edu.level === 'DOCTORAL' ? 'destructive' : edu.level === 'MASTER' ? 'warning' : edu.level === 'BACHELOR' ? 'info' : 'secondary'}>
                                            {EDU_LEVELS.find(l => l.value === edu.level)?.label.split(' ')[0]}
                                        </Badge>
                                        <span>{edu.detail}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            const newList = [...eduList];
                                            newList.splice(idx, 1);
                                            setEduList(newList);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expertise Tags */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            🧠 ความเชี่ยวชาญ (Expertise)
                        </h4>
                        <div className="flex gap-2 mb-4">
                            <Input
                                className="flex-1"
                                placeholder="เพิ่มความเชี่ยวชาญ (เช่น Sociology, Data Science)..."
                                value={newExpertise}
                                onChange={e => setNewExpertise(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
                            />
                            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addExpertise}>เพิ่ม Tag</Button>
                        </div>
                        <div className="bg-muted/30 rounded-xl border p-4 min-h-[60px] flex flex-wrap gap-2">
                            {expertiseList.length === 0 && <p className="text-xs text-muted-foreground w-full text-center py-2">ยังไม่มีข้อมูลความเชี่ยวชาญ</p>}
                            {expertiseList.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="bg-card py-2 pl-3 pr-2 gap-2 text-sm">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => setExpertiseList(expertiseList.filter(t => t !== tag))}
                                        className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                </div>
            </FormSection>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>ยกเลิก</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                    บันทึกข้อมูล
                </Button>
            </div>
        </form>
    );
}
