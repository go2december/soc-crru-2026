'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Award,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Search,
    Clock,
    UserCheck,
    CheckCircle2,
    XCircle,
    Upload,
    Loader2,
    AlertCircle,
    Eye,
    GraduationCap,
    BookOpen,
    HelpCircle,
    Sparkles,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ShortCourse {
    id: string;
    code: string | null;
    title: string;
    category: string | null;
    description: string | null;
    instructorName: string | null;
    coverImageUrl: string | null;
    durationHours: number;
    creditBankValue: number;
    isOnline: boolean;
    price: string | number;
    lifelongUrl: string | null;
    isCreditBank: boolean;
    status: 'OPEN' | 'COMING_SOON' | 'CLOSED';
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const DEFAULT_FORM: Omit<ShortCourse, 'id' | 'createdAt' | 'updatedAt'> = {
    code: '',
    title: '',
    category: '',
    description: '',
    instructorName: '',
    coverImageUrl: '',
    durationHours: 6,
    creditBankValue: 1,
    isOnline: false,
    price: 0,
    lifelongUrl: '',
    isCreditBank: true,
    status: 'OPEN',
    sortOrder: 0,
    isActive: true,
};

export default function AdminShortCoursesPage() {
    const [courses, setCourses] = useState<ShortCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'credit-bank' | 'general'>('all');
    const [showAdminGuide, setShowAdminGuide] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Dialogs
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<ShortCourse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ShortCourse | null>(null);

    // Form State
    const [formData, setFormData] = useState(DEFAULT_FORM);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/short-courses/admin/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses:', res.statusText);
            }
        } catch (error) {
            console.error('Error fetching short courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingCourse(null);
        setFormData(DEFAULT_FORM);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (course: ShortCourse) => {
        setEditingCourse(course);
        setFormData({
            code: course.code || '',
            title: course.title,
            category: course.category || '',
            description: course.description || '',
            instructorName: course.instructorName || '',
            coverImageUrl: course.coverImageUrl || '',
            durationHours: course.durationHours || 0,
            creditBankValue: course.creditBankValue || 0,
            isOnline: course.isOnline || false,
            price: course.price || 0,
            lifelongUrl: course.lifelongUrl || '',
            isCreditBank: course.isCreditBank !== false,
            status: course.status || 'OPEN',
            sortOrder: course.sortOrder || 0,
            isActive: course.isActive !== false,
        });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/upload/course`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: uploadData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setFormData(prev => ({ ...prev, coverImageUrl: data.url }));
        } catch (err) {
            console.error('Upload error:', err);
            alert('อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const payload = {
                ...formData,
                durationHours: Number(formData.durationHours) || 0,
                creditBankValue: Number(formData.creditBankValue) || 0,
                price: Number(formData.price) || 0,
                sortOrder: Number(formData.sortOrder) || 0,
            };

            let res;
            if (editingCourse) {
                res = await fetch(`${apiUrl}/api/short-courses/${editingCourse.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${apiUrl}/api/short-courses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setIsFormOpen(false);
                fetchCourses();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`เกิดข้อผิดพลาด: ${errData.message || 'ไม่สามารถบันทึกข้อมูลได้'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/short-courses/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setDeleteTarget(null);
                fetchCourses();
            } else {
                alert('ไม่สามารถลบหลักสูตรได้');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCourses = courses.filter(c => {
        if (filterType === 'credit-bank' && !c.isCreditBank) return false;
        if (filterType === 'general' && c.isCreditBank) return false;
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            const matchTitle = c.title.toLowerCase().includes(q);
            const matchCode = c.code && c.code.toLowerCase().includes(q);
            const matchInstructor = c.instructorName && c.instructorName.toLowerCase().includes(q);
            const matchCategory = c.category && c.category.toLowerCase().includes(q);
            return matchTitle || matchCode || matchInstructor || matchCategory;
        }
        return true;
    });

    const creditBankCount = courses.filter(c => c.isCreditBank).length;
    const generalCount = courses.filter(c => !c.isCreditBank).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Award className="w-7 h-7 text-primary" />
                        หลักสูตรระยะสั้น / คลังหน่วยกิต (Credit Bank)
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        จัดการหลักสูตรระยะสั้นของคณะสังคมศาสตร์ พร้อมเชื่อมโยงกับระบบ CRRU Lifelong Learning
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdminGuide(!showAdminGuide)}
                        className="gap-1.5 text-xs text-muted-foreground"
                    >
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        {showAdminGuide ? 'ซ่อนคำแนะนำ' : 'คู่มือการลงข้อมูล'}
                    </Button>
                    <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4" />
                        เพิ่มหลักสูตรใหม่
                    </Button>
                </div>
            </div>

            {/* Admin Guidelines Helper Card */}
            {showAdminGuide && (
                <div className="bg-gradient-to-r from-amber-500/10 via-background to-blue-500/10 border border-amber-500/30 rounded-xl p-4 text-xs space-y-2 relative shadow-sm">
                    <button
                        onClick={() => setShowAdminGuide(false)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1 text-xs"
                        title="ซ่อนคำแนะนำ"
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>เกณฑ์การลงข้อมูลหลักสูตรสำหรับผู้ดูแลระบบ (Admin Guidelines)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-muted-foreground">
                        <div className="bg-card p-3 rounded-lg border border-border">
                            <span className="font-bold text-foreground flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400">
                                <Award className="w-3.5 h-3.5" /> 🎓 หลักสูตรสะสมหน่วยกิต (Credit Bank)
                            </span>
                            <p className="leading-relaxed">
                                เลือกเมื่อหลักสูตรมีมติรับรองจากคณะให้ <strong>เทียบโอนเป็นรายวิชาปริญญาตรีได้</strong> โดยต้องระบุจำนวนหน่วยกิตสะสม (เช่น 1-3 หน่วยกิต) ระบบจะนำไปแสดงในหน้าระบบคลังหน่วยกิต (<code className="text-primary font-mono font-semibold">/academics/credit-bank</code>) โดยอัตโนมัติ
                            </p>
                        </div>
                        <div className="bg-card p-3 rounded-lg border border-border">
                            <span className="font-bold text-foreground flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="w-3.5 h-3.5" /> 📘 หลักสูตรระยะสั้นทั่วไป (Non-degree)
                            </span>
                            <p className="leading-relaxed">
                                เลือกสำหรับการอบรมเพิ่มพูนทักษะ (Upskill / Reskill) ทั่วไป ผู้เรียนจะได้รับวุฒิบัตรรับรองทักษะ (ระบบจะตั้งค่าหน่วยกิตเป็น 0 ให้อัตโนมัติ) และแสดงในหน้าแคตตาล็อกหลักสูตรระยะสั้น (<code className="text-primary font-mono font-semibold">/academics/short-courses</code>)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border">
                <div className="flex bg-muted/60 p-1 rounded-lg border border-border gap-1 w-full sm:w-auto">
                    <button
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filterType === 'all'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setFilterType('all')}
                    >
                        ทั้งหมด ({courses.length})
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${filterType === 'credit-bank'
                            ? 'bg-amber-500 text-white shadow-sm font-bold'
                            : 'text-muted-foreground hover:text-amber-600'
                            }`}
                        onClick={() => setFilterType('credit-bank')}
                    >
                        <Award className="w-3 h-3" />
                        Credit Bank ({creditBankCount})
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${filterType === 'general'
                            ? 'bg-slate-700 text-white shadow-sm font-bold'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setFilterType('general')}
                    >
                        <GraduationCap className="w-3 h-3" />
                        ทั่วไป ({generalCount})
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาชื่อหลักสูตร, รหัส, ผู้สอน..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-background h-9 text-xs"
                        />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap hidden lg:inline">
                        พบ {filteredCourses.length} รายการ
                    </span>
                </div>
            </div>

            {/* Courses Table / List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-16 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูลหลักสูตร...</p>
                </div>
            ) : filteredCourses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Award className="w-12 h-12 text-muted-foreground/40 mb-3" />
                        <h3 className="text-base font-semibold text-foreground">ไม่พบข้อมูลหลักสูตร</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                            ยังไม่มีหลักสูตรที่ตรงกับเงื่อนไขการค้นหา หรือยังไม่ได้เพิ่มหลักสูตรลงในระบบ
                        </p>
                        <Button onClick={handleOpenCreate} variant="outline" size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            เพิ่มหลักสูตรแรก
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b border-border">
                            <tr>
                                <th className="px-4 py-3.5">หลักสูตร</th>
                                <th className="px-4 py-3.5">หมวดหมู่</th>
                                <th className="px-4 py-3.5">วิทยากร/ผู้สอน</th>
                                <th className="px-4 py-3.5 text-center">ชั่วโมง / หน่วยกิต</th>
                                <th className="px-4 py-3.5 text-center">Credit Bank</th>
                                <th className="px-4 py-3.5 text-center">สถานะ</th>
                                <th className="px-4 py-3.5 text-center">Lifelong Link</th>
                                <th className="px-4 py-3.5 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCourses.map((c) => {
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                                const imageSrc = c.coverImageUrl
                                    ? (c.coverImageUrl.startsWith('http') ? c.coverImageUrl : `${apiUrl}${c.coverImageUrl}`)
                                    : '/images/faculty-building.jpg';

                                return (
                                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-muted border border-border">
                                                    <Image
                                                        src={imageSrc}
                                                        alt={c.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    {c.code && (
                                                        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded mr-1.5">
                                                            {c.code}
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-foreground line-clamp-1">
                                                        {c.title}
                                                    </span>
                                                    {c.price && Number(c.price) > 0 ? (
                                                        <span className="text-xs text-muted-foreground block mt-0.5">
                                                            ฿{Number(c.price).toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-emerald-600 font-medium block mt-0.5">
                                                            ฟรี (ไม่มีค่าใช้จ่าย)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                                            {c.category || '-'}
                                        </td>
                                        <td className="px-4 py-3.5 text-foreground text-xs font-medium">
                                            {c.instructorName || '-'}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <div className="text-xs font-semibold text-foreground">
                                                {c.durationHours} ชม.
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {c.creditBankValue} หน่วยกิต
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            {c.isCreditBank ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Award className="w-3 h-3 text-amber-600" />
                                                    Credit Bank
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    ทั่วไป
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            {c.status === 'OPEN' && (
                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    เปิดรับสมัคร
                                                </span>
                                            )}
                                            {c.status === 'COMING_SOON' && (
                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                                    เร็วๆ นี้ / แนะนำ
                                                </span>
                                            )}
                                            {c.status === 'CLOSED' && (
                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                    ปิดรับสมัคร
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            {c.lifelongUrl ? (
                                                <a
                                                    href={c.lifelongUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    เปิดดู
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/60">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(c)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteTarget(c)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            {editingCourse ? 'แก้ไขหลักสูตรระยะสั้น' : 'เพิ่มหลักสูตรระยะสั้นใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            กรอกรายละเอียดหลักสูตร และระบุลิงก์บทเรียนบนระบบ CRRU Lifelong
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Title & Code */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="title">ชื่อหลักสูตร *</Label>
                                <Input
                                    id="title"
                                    required
                                    placeholder="เช่น ตุงและโคมประดิษฐ์"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="code">รหัสหลักสูตร (ถ้ามี)</Label>
                                <Input
                                    id="code"
                                    placeholder="เช่น LL6506004"
                                    value={formData.code || ''}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Category & Instructor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="category">หมวดหมู่หลักสูตร</Label>
                                <Input
                                    id="category"
                                    placeholder="เช่น ศิลปวัฒนธรรมและภูมิปัญญาท้องถิ่น"
                                    value={formData.category || ''}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="instructorName">วิทยากร / ผู้ประสานงานหลักสูตร</Label>
                                <Input
                                    id="instructorName"
                                    placeholder="เช่น ผู้ช่วยศาสตราจารย์ ดร.ณรงค์ เจนใจ"
                                    value={formData.instructorName || ''}
                                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Lifelong URL with Test Button */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="lifelongUrl" className="flex items-center gap-1.5 font-medium">
                                    <ExternalLink className="w-4 h-4 text-blue-600" />
                                    ลิงก์ตรงบทเรียนบน CRRU Lifelong (URL) *
                                </Label>
                                {formData.lifelongUrl && (
                                    <a
                                        href={formData.lifelongUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                                    >
                                        <span>ทดสอบเปิดลิงก์</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                            <Input
                                id="lifelongUrl"
                                type="url"
                                required
                                placeholder="https://lifelong.crru.ac.th/course/detail/..."
                                value={formData.lifelongUrl || ''}
                                onChange={(e) => setFormData({ ...formData, lifelongUrl: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                ก๊อปลิงก์จากหน้ารายละเอียดหลักสูตรบนเว็บ lifelong.crru.ac.th มาวาง เมื่อผู้เรียนคลิกจะเปิดหน้านี้ทันที
                            </p>
                        </div>

                        {/* Course Classification / Type Selector */}
                        <div className="space-y-3 border rounded-xl p-4 bg-muted/20">
                            <div>
                                <Label className="block font-semibold text-sm">
                                    ประเภทหลักสูตร (Course Classification) *
                                </Label>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    เลือกว่าหลักสูตรนี้ได้รับการอนุมัติให้สะสมหน่วยกิตปริญญาตรี หรือเป็นการอบรมพัฒนาทักษะทั่วไป
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Option 1: Credit Bank */}
                                <div
                                    onClick={() => setFormData({
                                        ...formData,
                                        isCreditBank: true,
                                        creditBankValue: formData.creditBankValue > 0 ? formData.creditBankValue : 1
                                    })}
                                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${formData.isCreditBank
                                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                                        : 'border-border bg-card hover:bg-muted/40'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <Award className={`w-4 h-4 ${formData.isCreditBank ? 'text-amber-500' : 'text-muted-foreground'}`} />
                                            <span>หลักสูตรสะสมหน่วยกิต</span>
                                        </div>
                                        {formData.isCreditBank && (
                                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                                                <Check className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mt-1">
                                        Credit Bank Course (สะสมเทียบโอน ป.ตรี)
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                        มีผลการเรียนรู้เทียบเคียงรายวิชา ป.ตรี ของคณะ ผู้เรียนสามารถนำหน่วยกิตไปเทียบโอนได้
                                    </p>
                                </div>

                                {/* Option 2: General Short Course */}
                                <div
                                    onClick={() => setFormData({
                                        ...formData,
                                        isCreditBank: false,
                                        creditBankValue: 0
                                    })}
                                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${!formData.isCreditBank
                                        ? 'border-primary bg-primary/10 shadow-sm'
                                        : 'border-border bg-card hover:bg-muted/40'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <GraduationCap className={`w-4 h-4 ${!formData.isCreditBank ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <span>หลักสูตรระยะสั้นทั่วไป</span>
                                        </div>
                                        {!formData.isCreditBank && (
                                            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                                <Check className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-semibold text-muted-foreground block mt-1">
                                        General Short Course (Non-degree)
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                        เน้นการอบรม Upskill / Reskill ได้รับวุฒิบัตรรับรองทักษะ ไม่สะสมหน่วยกิตปริญญาตรี
                                    </p>
                                </div>
                            </div>

                            {formData.isCreditBank ? (
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="creditBankValue" className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                                            <Award className="w-3.5 h-3.5 text-amber-600" />
                                            จำนวนหน่วยกิตที่สามารถเทียบโอนได้ (Credits) *
                                        </Label>
                                        <p className="text-[11px] text-amber-700 dark:text-amber-300">
                                            ระบุตามเกณฑ์รายวิชาของคณะสังคมศาสตร์ (เช่น 1, 2 หรือ 3 หน่วยกิต)
                                        </p>
                                    </div>
                                    <div className="w-32 flex-shrink-0 flex items-center gap-1.5">
                                        <Input
                                            id="creditBankValue"
                                            type="number"
                                            min="1"
                                            max="6"
                                            required={formData.isCreditBank}
                                            value={formData.creditBankValue}
                                            onChange={(e) => setFormData({ ...formData, creditBankValue: Math.max(1, Number(e.target.value)) })}
                                            className="h-9 bg-white dark:bg-background border-amber-300 font-bold text-center"
                                        />
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">หน่วยกิต</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>ระบบกำหนดหน่วยกิตสะสมเป็น 0 หน่วยกิต (แสดงในหน้าแคตตาล็อกทั่วไป ไม่ขึ้นในหน้าระบบคลังหน่วยกิต)</span>
                                </div>
                            )}
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-2 border rounded-lg p-3.5 bg-muted/20">
                            <Label className="block font-medium">รูปภาพหน้าปกหลักสูตร</Label>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-32 h-20 rounded-md overflow-hidden bg-muted border border-border relative flex-shrink-0">
                                    {formData.coverImageUrl ? (
                                        <Image
                                            src={formData.coverImageUrl.startsWith('http')
                                                ? formData.coverImageUrl
                                                : `${process.env.NEXT_PUBLIC_API_URL || ''}${formData.coverImageUrl}`}
                                            alt="Cover Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            ไม่มีรูปภาพ
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 w-full space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                                            {uploading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Upload className="w-3.5 h-3.5" />
                                            )}
                                            {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดภาพเข้า Server'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {formData.coverImageUrl && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs text-destructive"
                                                onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                                            >
                                                ลบรูปภาพ
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="หรือวางลิงก์รูปภาพโดยตรง (https://...)"
                                        value={formData.coverImageUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                        className="text-xs h-8"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hours, Price, Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="durationHours">จำนวนชั่วโมงอบรม (Hours)</Label>
                                <Input
                                    id="durationHours"
                                    type="number"
                                    min="0"
                                    value={formData.durationHours}
                                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="price">ราคาค่าลงทะเบียน (บาท)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    placeholder="0 = ฟรี"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="status">สถานะการรับสมัคร</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="OPEN">เปิดรับสมัคร (Open)</option>
                                    <option value="COMING_SOON">เร็วๆ นี้ / แนะนำ (Soon)</option>
                                    <option value="CLOSED">ปิดรับสมัคร (Closed)</option>
                                </select>
                            </div>
                        </div>

                        {/* Checkboxes: isOnline, isActive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30">
                                <input
                                    type="checkbox"
                                    checked={formData.isOnline}
                                    onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                                />
                                <div>
                                    <span className="text-xs font-semibold text-foreground block">เรียนออนไลน์ 100%</span>
                                    <span className="text-[11px] text-muted-foreground">หลักสูตรนี้จัดแบบ e-Learning ผ่านอินเทอร์เน็ต</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                                />
                                <div>
                                    <span className="text-xs font-semibold text-foreground block">เผยแพร่บนหน้าเว็บทันที</span>
                                    <span className="text-[11px] text-muted-foreground">แสดงหลักสูตรให้บุคคลภายนอกมองเห็น</span>
                                </div>
                            </label>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description">รายละเอียดสังเขป</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                placeholder="อธิบายเนื้อหาและทักษะที่จะได้รับจากหลักสูตร..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                disabled={submitting}
                            >
                                ยกเลิก
                            </Button>
                            <Button type="submit" disabled={submitting || uploading} className="gap-2">
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                บันทึกข้อมูล
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            ยืนยันการลบหลักสูตร
                        </DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตร <strong>"{deleteTarget?.title}"</strong> ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={submitting}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={submitting}
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            ลบหลักสูตร
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
