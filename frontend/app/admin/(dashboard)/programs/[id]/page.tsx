'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, Save, Upload, Trash2, Plus, GripVertical, Image as ImageIcon, FileText, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProgramEditorPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [staffList, setStaffList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        code: '',
        name_th: '',
        degree_title_th: '',
        degree_title_en: '',
        degree_level: 'BACHELOR',
        description: '',
        is_active: true,
        banner_url: '',
        curriculum_url: '',
        structure: { totalCredits: 0, general: 0, major: 0, freeElective: 0 },
        careers: [] as string[],
        highlights: [] as { title: string; description: string }[],
        concentrations: [] as { title: string; description: string }[],
        instructors: [] as { staffId: string; role: string; sortOrder?: number }[],
        gallery_images: [] as string[],
        attachments: [] as { originalName: string; fileUrl: string; size?: number; mimeType?: string }[],
        youtube_video_url: '',
        facebook_video_url: ''
    });

    useEffect(() => {
        const fetchContext = async () => {
            try {
                // Fetch Staff for Instructors Dropdown
                const staffRes = await fetch(`${API_URL}/api/staff`);
                if (staffRes.ok) {
                    const staffJson = await staffRes.json();
                    setStaffList(staffJson.data || []);
                }

                // Fetch Program if not new
                if (!isNew) {
                    const progRes = await fetch(`${API_URL}/api/programs/${params.id}`);
                    if (progRes.ok) {
                        const data = await progRes.json();
                        setFormData({
                            code: data.code || '',
                            name_th: data.nameTh || '',
                            degree_title_th: data.degreeTitleTh || '',
                            degree_title_en: data.degreeTitleEn || '',
                            degree_level: data.degreeLevel || 'BACHELOR',
                            description: data.description || '',
                            is_active: data.isActive ?? true,
                            banner_url: data.bannerUrl || '',
                            curriculum_url: data.curriculumUrl || '',
                            structure: data.structure || { totalCredits: 0, general: 0, major: 0, freeElective: 0 },
                            careers: data.careers || [],
                            highlights: data.highlights || [],
                            concentrations: data.concentrations || [],
                            instructors: data.instructors ? data.instructors.sort((a:any, b:any) => a.sortOrder - b.sortOrder) : [],
                            gallery_images: data.galleryImages || [],
                            attachments: data.attachments || [],
                            youtube_video_url: data.youtubeVideoUrl || '',
                            facebook_video_url: data.facebookVideoUrl || ''
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchContext();
    }, [isNew, params.id]);

    const deleteManagedFile = async (url: string) => {
        if (!url?.startsWith('/uploads/programs/')) return;
        const token = localStorage.getItem('admin_token');
        try {
            await fetch(`${API_URL}/api/upload/programs`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });
        } catch (error) {
            console.error('Error deleting managed file:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'banner_url' | 'curriculum_url') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('admin_token');
        const fd = new FormData();
        fd.append('file', file);

        try {
            const res = await fetch(`${API_URL}/api/upload/programs`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            if (res.ok) {
                const data = await res.json();
                
                // If there was an existing file, delete it first to prevent orphaned files
                if (formData[field]) {
                    await deleteManagedFile(formData[field]);
                }
                
                setFormData(prev => ({ ...prev, [field]: data.url }));
            } else {
                alert('อัปโหลดไฟล์ล้มเหลว');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('ไม่สามารถอัปโหลดไฟล์ได้');
        }
    };

    const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'attachment') => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const token = localStorage.getItem('admin_token');
        const newUrls: string[] = [];
        const newAttachments: any[] = [];

        try {
            for (const file of files) {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch(`${API_URL}/api/upload/programs`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
                if (res.ok) {
                    const data = await res.json();
                    if (type === 'gallery') {
                        newUrls.push(data.url);
                    } else {
                        newAttachments.push({
                            originalName: file.name,
                            fileUrl: data.url,
                            size: file.size,
                            mimeType: file.type
                        });
                    }
                }
            }
            if (type === 'gallery') {
                setFormData(p => ({ ...p, gallery_images: [...p.gallery_images, ...newUrls] }));
            } else {
                setFormData(p => ({ ...p, attachments: [...p.attachments, ...newAttachments] }));
            }
        } catch (error) {
            console.error('Multi Upload Error:', error);
            alert('บางไฟล์อัปโหลดไม่สำเร็จ');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('admin_token');

        try {
            const url = isNew ? `${API_URL}/api/programs` : `${API_URL}/api/programs/${params.id}`;
            const method = isNew ? 'POST' : 'PATCH';

            const payload = {
                code: formData.code,
                name_th: formData.name_th,
                degree_title_th: formData.degree_title_th,
                degree_title_en: formData.degree_title_en,
                degree_level: formData.degree_level,
                description: formData.description,
                is_active: formData.is_active,
                banner_url: formData.banner_url,
                curriculum_url: formData.curriculum_url,
                structure: formData.structure,
                careers: formData.careers,
                highlights: formData.highlights,
                concentrations: formData.concentrations,
                instructors: formData.instructors.map((inst, idx) => ({
                    staffId: inst.staffId,
                    role: inst.role,
                    sortOrder: idx
                })),
                gallery_images: formData.gallery_images,
                attachments: formData.attachments,
                youtube_video_url: formData.youtube_video_url,
                facebook_video_url: formData.facebook_video_url
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/programs');
                router.refresh();
            } else {
                const err = await res.text();
                alert(`Error saving program: ${err}`);
            }
        } catch (error) {
            console.error('Error saving program:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-32">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24 max-w-5xl mx-auto">
            {/* Topbar sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md p-4 border-b rounded-xl -mx-4 px-8 mb-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/programs')} className="shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{isNew ? 'เพิ่มหลักสูตรใหม่' : 'แก้ไขข้อมูลหลักสูตร'}</h1>
                        <p className="text-sm opacity-60 font-mono">{formData.code || 'NO-CODE'}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-2 text-sm mr-4 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="toggle toggle-success toggle-md" 
                            checked={formData.is_active}
                            onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                        />
                        <span className={formData.is_active ? 'text-green-600 font-semibold' : 'text-slate-500'}>
                            {formData.is_active ? 'เผยแพร่' : 'ซ่อนเนื้อหา'}
                        </span>
                    </label>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </Button>
                </div>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader><CardTitle>ข้อมูลพื้นฐาน (Basic Info)</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>รหัสหลักสูตร (Code)</Label>
                        <Input value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} placeholder="เช่น social-sci" />
                    </div>
                    <div className="space-y-2">
                        <Label>ระดับการศึกษา</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.degree_level} onChange={e => setFormData(p => ({ ...p, degree_level: e.target.value }))}>
                            <option value="BACHELOR">ปริญญาตรี (BACHELOR)</option>
                            <option value="MASTER">ปริญญาโท (MASTER)</option>
                            <option value="PHD">ปริญญาเอก (PHD)</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>ชื่อหลักสูตร (ภาษาไทย)</Label>
                        <Input value={formData.name_th} onChange={e => setFormData(p => ({ ...p, name_th: e.target.value }))} placeholder="เช่น หลักสูตรศิลปศาสตรบัณฑิต สาขาวิชาการพัฒนาสังคม" />
                    </div>
                    <div className="space-y-2">
                        <Label>ชื่อปริญญา (ภาษาไทย)</Label>
                        <Input value={formData.degree_title_th} onChange={e => setFormData(p => ({ ...p, degree_title_th: e.target.value }))} placeholder="เช่น ศิลปศาสตรบัณฑิต (การพัฒนาสังคม)" />
                    </div>
                    <div className="space-y-2">
                        <Label>ชื่อปริญญา (ภาษาอังกฤษ)</Label>
                        <Input value={formData.degree_title_en} onChange={e => setFormData(p => ({ ...p, degree_title_en: e.target.value }))} placeholder="เช่น Bachelor of Arts (Social Development)" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>รายละเอียดเบื้องต้น (Description)</Label>
                        <Textarea rows={4} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
                    </div>
                </CardContent>
            </Card>

            {/* Assets */}
            <Card>
                <CardHeader><CardTitle>รูปภาพประกอบ & แฟ้มข้อมูล</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label>แบนเนอร์หลักสูตร (.jpg, .png)</Label>
                        <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-32 bg-muted/20 relative">
                            {formData.banner_url ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                    <img src={formData.banner_url.startsWith('/') ? `${API_URL}${formData.banner_url}` : formData.banner_url} alt="Banner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Button variant="destructive" size="sm" onClick={async () => {
                                            await deleteManagedFile(formData.banner_url);
                                            setFormData(p => ({ ...p, banner_url: '' }));
                                        }}>นำออก</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                                    <input type="file" id="banner-up" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'banner_url')} />
                                    <Label htmlFor="banner-up" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">อัปโหลดแบนเนอร์</Label>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label>ไฟล์เอกสารโครงสร้างหลักสูตร (.pdf)</Label>
                        <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-32 bg-muted/20">
                            {formData.curriculum_url ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileText className="w-10 h-10 text-emerald-500" />
                                    <a href={formData.curriculum_url.startsWith('/') ? `${API_URL}${formData.curriculum_url}` : formData.curriculum_url} target="_blank" rel="noreferrer" className="text-sm text-sky-600 hover:underline break-all block px-4 text-center">
                                        ดูไฟล์ที่แนบไว้
                                    </a>
                                    <Button variant="ghost" size="sm" className="text-destructive mt-2" onClick={async () => {
                                        await deleteManagedFile(formData.curriculum_url);
                                        setFormData(p => ({ ...p, curriculum_url: '' }));
                                    }}>นำออก</Button>
                                </div>
                            ) : (
                                <>
                                    <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                                    <input type="file" id="doc-up" accept=".pdf" className="hidden" onChange={e => handleFileUpload(e, 'curriculum_url')} />
                                    <Label htmlFor="doc-up" className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded-md text-sm hover:bg-primary/30">อัปโหลดแฟ้มข้อมูล PDF</Label>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Instructors */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>อาจารย์ประจำหลักสูตร</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                        setFormData(p => ({ ...p, instructors: [...p.instructors, { staffId: '', role: 'MEMBER' }] }))
                    }}>
                        <Plus className="w-4 h-4 mr-1" /> เพิ่มอาจารย์
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {formData.instructors.map((inst, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-muted/30 p-3 rounded-lg border">
                                <GripVertical className="hidden sm:block w-5 h-5 text-muted-foreground cursor-move" />
                                <div className="flex-1 w-full">
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={inst.staffId}
                                        onChange={(e) => {
                                            const newInsts = [...formData.instructors];
                                            newInsts[index].staffId = e.target.value;
                                            setFormData({ ...formData, instructors: newInsts });
                                        }}
                                    >
                                        <option value="" disabled>-- เลือกอาจารย์ --</option>
                                        {staffList.map(s => (
                                            <option key={s.id} value={s.id}>{s.prefixTh || ''}{s.firstNameTh} {s.lastNameTh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold text-primary"
                                        value={inst.role}
                                        onChange={(e) => {
                                            const newInsts = [...formData.instructors];
                                            newInsts[index].role = e.target.value;
                                            setFormData({ ...formData, instructors: newInsts });
                                        }}
                                    >
                                        <option value="CHAIR">ประธานหลักสูตร</option>
                                        <option value="MEMBER">อาจารย์ประจำหลักสูตร</option>
                                    </select>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive w-full sm:w-auto mt-2 sm:mt-0" onClick={() => {
                                    setFormData(p => ({ ...p, instructors: p.instructors.filter((_, i) => i !== index) }));
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {formData.instructors.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                                ยังไม่มีอาจารย์ประจำหลักสูตร กดปุ่ม &quot;เพิ่มอาจารย์&quot; ด้านบน
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Structure Credits */}
            <Card>
                <CardHeader><CardTitle>โครงสร้างหน่วยกิต (Credits Structure)</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">หน่วยกิตรวม (Total)</Label>
                        <Input type="number" value={formData.structure.totalCredits} onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, totalCredits: Number(e.target.value) } }))} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดศึกษาทั่วไป</Label>
                        <Input type="number" value={formData.structure.general} onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, general: Number(e.target.value) } }))} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดวิชาเฉพาะ</Label>
                        <Input type="number" value={formData.structure.major} onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, major: Number(e.target.value) } }))} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดเลือกเสรี</Label>
                        <Input type="number" value={formData.structure.freeElective} onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, freeElective: Number(e.target.value) } }))} />
                    </div>
                </CardContent>
            </Card>

            {/* Careers */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">อาชีพหลังสำเร็จการศึกษา</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setFormData(p => ({ ...p, careers: [...p.careers, ''] }))}>
                        <Plus className="w-4 h-4 mr-1" /> เพิ่มอาชีพ
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {formData.careers.map((career, index) => (
                            <div key={index} className="flex gap-2">
                                <Input 
                                    value={career} 
                                    placeholder="เช่น นักสังคมสงเคราะห์, พนักงานทรัพยากรบุคคล"
                                    onChange={(e) => {
                                        const newCareers = [...formData.careers];
                                        newCareers[index] = e.target.value;
                                        setFormData(p => ({ ...p, careers: newCareers }));
                                    }} 
                                />
                                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => {
                                    setFormData(p => ({ ...p, careers: p.careers.filter((_, i) => i !== index) }));
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* PR Media (Gallery, Attachments, Videos) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">สื่อประชาสัมพันธ์ (PR Media)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>วิดีโอ YouTube URL</Label>
                            <Input value={formData.youtube_video_url} onChange={e => setFormData(p => ({ ...p, youtube_video_url: e.target.value }))} placeholder="เช่น https://www.youtube.com/watch?v=..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Facebook Fanpage URL (ลิงก์เพจหลักสูตร)</Label>
                            <Input value={formData.facebook_video_url} onChange={e => setFormData(p => ({ ...p, facebook_video_url: e.target.value }))} placeholder="เช่น https://www.facebook.com/soc.crru" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>แกลลอรีรูปภาพกิจกรรม (Multiple Images)</Label>
                            <div className="relative">
                                <Button variant="outline" size="sm" type="button" className="cursor-pointer pointer-events-none">
                                    <Upload className="w-4 h-4 mr-2" /> อัปโหลดรูปภาพ
                                </Button>
                                <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleMultiFileUpload(e, 'gallery')} />
                            </div>
                        </div>
                        {formData.gallery_images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {formData.gallery_images.map((img, i) => (
                                    <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border">
                                        <img src={img.startsWith('/') ? `${API_URL}${img}` : img} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button variant="destructive" size="sm" onClick={async () => {
                                                await deleteManagedFile(img);
                                                setFormData(p => ({ ...p, gallery_images: p.gallery_images.filter((_, idx) => idx !== i) }));
                                            }}>ลบ</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-sm">
                                ยังไม่มีรูปภาพในแกลลอรี
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label>เอกสารดาวน์โหลด (Attachments)</Label>
                            <div className="relative">
                                <Button variant="outline" size="sm" type="button" className="cursor-pointer pointer-events-none text-sky-600 border-sky-200">
                                    <FileText className="w-4 h-4 mr-2" /> อัปโหลดไฟล์เอกสาร
                                </Button>
                                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleMultiFileUpload(e, 'attachment')} />
                            </div>
                        </div>
                        {formData.attachments.length > 0 ? (
                            <div className="space-y-2">
                                {formData.attachments.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between border p-3 rounded-md bg-muted/10">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <span className="text-sm truncate font-medium">{file.originalName}</span>
                                            {file.size && <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">({(file.size / 1024).toFixed(1)} KB)</span>}
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={async () => {
                                            await deleteManagedFile(file.fileUrl);
                                            setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }));
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-sm">
                                ยังไม่มีไฟล์เอกสารแนบ
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">จุดเด่นหลักสูตร (Highlights)</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setFormData(p => ({ ...p, highlights: [...p.highlights, { title: '', description: '' }] }))}>
                        <Plus className="w-4 h-4 mr-1" /> เพิ่มจุดเด่น
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.highlights.map((item, index) => (
                            <div key={index} className="border p-4 rounded-xl space-y-3 bg-muted/10 relative group">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                    setFormData(p => ({ ...p, highlights: p.highlights.filter((_, i) => i !== index) }));
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Label>หัวข้อ</Label>
                                <Input value={item.title} onChange={e => {
                                    const next = [...formData.highlights];
                                    next[index].title = e.target.value;
                                    setFormData(p => ({ ...p, highlights: next }));
                                }} placeholder="เช่น เรียนรู้กับผู้เชี่ยวชาญจริง" />
                                <Label>คำอธิบายสั้นๆ</Label>
                                <Textarea rows={2} value={item.description} onChange={e => {
                                    const next = [...formData.highlights];
                                    next[index].description = e.target.value;
                                    setFormData(p => ({ ...p, highlights: next }));
                                }} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
