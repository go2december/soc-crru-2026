'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, Save, Upload, Trash2, Plus, Image as ImageIcon, FileText, CheckCircle,
    Share2, ShieldAlert, Sparkles, Video, ExternalLink, Layers, Edit3, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProgramEditorPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tracks, setTracks] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        code: '',
        name_th: '',
        degree_title_th: '',
        degree_title_en: '',
        degree_level: 'BACHELOR',
        department_id: undefined as number | undefined,
        description: '',
        is_active: true,
        banner_url: '',
        curriculum_url: '',
        structure: { totalCredits: 0, general: 0, major: 0, freeElective: 0 },
        careers: [] as string[],
        highlights: [] as { title: string; description: string }[],
        social_links: {
            facebook: '',
            tiktok: '',
            instagram: '',
            youtube: '',
            line: ''
        },
        gallery_images: [] as string[],
        attachments: [] as { originalName: string; fileUrl: string; size?: number; mimeType?: string }[],
        youtube_video_url: '',
        facebook_video_url: '',
        admission_status: 'เปิดรับสมัครตรง (มีสิทธิ์ยื่นกู้ยืม กยศ.)'
    });

    const fetchTracks = async (progId: string) => {
        try {
            const trRes = await fetch(`${API_URL}/api/programs/${progId}/tracks`);
            if (trRes.ok) {
                const trData = await trRes.json();
                setTracks(trData || []);
            }
        } catch (e) {
            console.error('Failed to load tracks', e);
        }
    };

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const token = localStorage.getItem('admin_token');

                // 1. Fetch current user profile for RBAC
                let userObj: any = null;
                if (token) {
                    try {
                        const profRes = await fetch(`${API_URL}/api/auth/profile`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (profRes.ok) {
                            userObj = await profRes.json();
                            setCurrentUser(userObj);
                        }
                    } catch (e) {
                        console.error('Failed to load profile', e);
                    }
                }

                // 2. Fetch Program & its Tracks if not new
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
                            department_id: data.departmentId,
                            description: data.description || '',
                            is_active: data.isActive ?? true,
                            banner_url: data.bannerUrl || '',
                            curriculum_url: data.curriculumUrl || '',
                            structure: data.structure || { totalCredits: 0, general: 0, major: 0, freeElective: 0 },
                            careers: data.careers || [],
                            highlights: data.highlights || [],
                            social_links: data.socialLinks || {
                                facebook: data.facebookVideoUrl || '',
                                tiktok: '',
                                instagram: '',
                                youtube: data.youtubeVideoUrl || '',
                                line: ''
                            },
                            gallery_images: data.galleryImages || [],
                            attachments: data.attachments || [],
                            youtube_video_url: data.youtubeVideoUrl || '',
                            facebook_video_url: data.facebookVideoUrl || '',
                            admission_status: data.admissionStatus || 'เปิดรับสมัครตรง (มีสิทธิ์ยื่นกู้ยืม กยศ.)'
                        });

                        // Fetch dedicated tracks
                        await fetchTracks(params.id as string);
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

    const isSuperAdmin = currentUser?.roles?.includes('ADMIN');
    const isDeptStaff = currentUser?.roles?.includes('STAFF') || currentUser?.roles?.includes('EDITOR');
    const hasEditPermission = isSuperAdmin || (isDeptStaff && (!formData.department_id || formData.department_id === currentUser?.departmentId));

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

    const handleDeleteTrack = async (trackId: string, trackName: string) => {
        if (!confirm(`ยืนยันการลบแขนงวิชา "${trackName}" หรือไม่?\nข้อมูลสื่อ รูปภาพกิจกรรม และลิงก์โซเชียลมีเดียของแขนงนี้จะถูกลบ`)) {
            return;
        }

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/programs/tracks/${trackId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setTracks(prev => prev.filter(t => t.id !== trackId));
            } else {
                alert('ไม่สามารถลบแขนงวิชาได้');
            }
        } catch (e) {
            console.error('Error deleting track:', e);
            alert('เกิดข้อผิดพลาดในการลบแขนงวิชา');
        }
    };

    const handleSave = async () => {
        if (!hasEditPermission) {
            alert('คุณไม่มีสิทธิ์แก้ไขหลักสูตรนี้เนื่องจากสังกัดอยู่คนละสาขาวิชา');
            return;
        }

        if (!formData.code || !formData.name_th) {
            alert('กรุณากรอกรหัสหลักสูตรและชื่อภาษาไทยให้ครบถ้วน');
            return;
        }

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
                social_links: formData.social_links,
                gallery_images: formData.gallery_images,
                attachments: formData.attachments,
                youtube_video_url: formData.youtube_video_url || formData.social_links.youtube || '',
                facebook_video_url: formData.facebook_video_url || formData.social_links.facebook || '',
                admission_status: formData.admission_status
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.text();
                alert(`Error saving program: ${err}`);
                setSaving(false);
                return;
            }

            const savedProgram = await res.json();
            alert('บันทึกข้อมูลหลักสูตรเรียบร้อยแล้ว');

            if (isNew) {
                router.push(`/admin/programs/${savedProgram.id}`);
            } else {
                router.push('/admin/programs');
            }
            router.refresh();
        } catch (error) {
            console.error('Error saving program:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const planBadge = (plan: string) => {
        switch (plan) {
            case 'TRANSFER_2YR':
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">เทียบโอน 2 ปีหลัง (ปวส.)</span>;
            case 'GRADUATE':
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">บัณฑิตศึกษา</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">4 ปีปกติ</span>;
        }
    };

    const trackTypeBadge = (type: string) => {
        switch (type) {
            case 'MAJOR':
                return <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-300 text-xs">กลุ่มวิชาเอก</Badge>;
            case 'MINOR':
                return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300 text-xs">กลุ่มวิชาโท</Badge>;
            default:
                return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs">แขนงวิชา</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="p-16 text-center text-muted-foreground flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                <span>กำลังโหลดข้อมูลหลักสูตร...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isNew ? 'เพิ่มหลักสูตรใหม่' : `แก้ไขหลักสูตร: ${formData.name_th}`}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {isSuperAdmin 
                                ? '🛡️ ผู้ดูแลระบบส่วนกลาง (Full Administrative Scope)' 
                                : `🏢 บุคลากรประจำสาขาวิชา (Department Scope ID: ${currentUser?.departmentId || 'Unassigned'})`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={handleSave} 
                        disabled={saving || !hasEditPermission} 
                        className="gap-2 bg-primary text-white shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'กำลังบันทึก...' : 'บันทึกหลักสูตร'}
                    </Button>
                </div>
            </div>

            {/* Scope Warning Banner if staff is from another department */}
            {!hasEditPermission && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 text-amber-900 text-sm">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">จำกัดสิทธิ์การแก้ไข (Read-Only Mode)</p>
                        <p className="text-xs text-amber-800 mt-0.5">
                            คุณสังกัดสาขาวิชา ID: {currentUser?.departmentId} จึงไม่สามารถแก้ไขข้อมูลของหลักสูตรในสาขาวิชาอื่นได้ หากต้องการปรับปรุงข้อมูล กรุณาติดต่อผู้ดูแลระบบส่วนกลาง
                        </p>
                    </div>
                </div>
            )}

            {/* 1. Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">ข้อมูลพื้นฐานของหลักสูตร</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>รหัสหลักสูตร (URL Slug)*</Label>
                            <Input 
                                value={formData.code} 
                                onChange={e => setFormData(p => ({ ...p, code: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} 
                                placeholder="เช่น social-sci, home-eco" 
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>ชื่อหลักสูตร (ภาษาไทย)*</Label>
                            <Input 
                                value={formData.name_th} 
                                onChange={e => setFormData(p => ({ ...p, name_th: e.target.value }))} 
                                placeholder="เช่น ศิลปศาสตรบัณฑิต สาขาวิชาสังคมศาสตร์" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>ระดับการศึกษา*</Label>
                            <select 
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                value={formData.degree_level}
                                onChange={e => setFormData(p => ({ ...p, degree_level: e.target.value }))}
                            >
                                <option value="BACHELOR">ปริญญาตรี (Bachelor)</option>
                                <option value="MASTER">ปริญญาโท (Master)</option>
                                <option value="PHD">ปริญญาเอก (Doctoral)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>ชื่อย่อวุฒิการศึกษา (ภาษาไทย)</Label>
                            <Input 
                                value={formData.degree_title_th} 
                                onChange={e => setFormData(p => ({ ...p, degree_title_th: e.target.value }))} 
                                placeholder="เช่น ศศ.บ. (สังคมศาสตร์)" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>ชื่อย่อวุฒิการศึกษา (English)</Label>
                            <Input 
                                value={formData.degree_title_en} 
                                onChange={e => setFormData(p => ({ ...p, degree_title_en: e.target.value }))} 
                                placeholder="เช่น B.A. (Social Sciences)" 
                            />
                        </div>
                    </div>

                    {/* Admission Status Field */}
                    <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="admission_status" className="font-semibold text-slate-800">
                                สถานะการรับสมัคร (Admission Status)
                            </Label>
                            <span className="text-xs text-muted-foreground">แสดงบนแถบหัวข้อหลักสูตร</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${formData.admission_status?.includes('ปิด') ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                            <Input 
                                id="admission_status"
                                value={formData.admission_status} 
                                onChange={e => setFormData(p => ({ ...p, admission_status: e.target.value }))} 
                                placeholder="เช่น เปิดรับสมัครตรง (มีสิทธิ์ยื่นกู้ยืม กยศ.)" 
                                className="bg-white"
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            ข้อความนี้จะปรากฏบนแถบด้านบนของหน้าหลักสูตรสาธารณะ เช่น &quot;เปิดรับสมัครตรง (มีสิทธิ์ยื่นกู้ยืม กยศ.)&quot; หรือ &quot;เปิดรับสมัครรอบที่ 1&quot;
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>ปรัชญาและคำอธิบายหลักสูตร</Label>
                        <Textarea 
                            rows={4} 
                            value={formData.description} 
                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                            placeholder="ระบุจุดมุ่งหมาย ความสำคัญ และรายละเอียดภาพรวมของหลักสูตร..." 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label>รูปภาพ Banner หลักสูตร</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={formData.banner_url} 
                                    onChange={e => setFormData(p => ({ ...p, banner_url: e.target.value }))} 
                                    placeholder="https://... หรืออัปโหลดไฟล์" 
                                />
                                <div className="relative shrink-0">
                                    <Button variant="outline" type="button" className="cursor-pointer pointer-events-none">
                                        <Upload className="w-4 h-4 mr-1" /> อัปโหลด
                                    </Button>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        onChange={e => handleFileUpload(e, 'banner_url')} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>ไฟล์เล่มหลักสูตร (PDF Curriculum)</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={formData.curriculum_url} 
                                    onChange={e => setFormData(p => ({ ...p, curriculum_url: e.target.value }))} 
                                    placeholder="https://... หรืออัปโหลดไฟล์ PDF" 
                                />
                                <div className="relative shrink-0">
                                    <Button variant="outline" type="button" className="cursor-pointer pointer-events-none">
                                        <FileText className="w-4 h-4 mr-1" /> อัปโหลด
                                    </Button>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        onChange={e => handleFileUpload(e, 'curriculum_url')} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Multi-Channel Social Media */}
            <Card className="border-sky-200 bg-sky-50/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-sky-600" />
                        <div>
                            <CardTitle className="text-lg text-sky-950">ช่องทางโซเชียลมีเดียหลักสูตร (Social Media Channels)</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                เพิ่มช่องทางสื่อสารสำหรับนักศึกษา ทั้ง Facebook, TikTok, Instagram, Line Official และ YouTube
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#1877F2] flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook Fanpage URL
                            </Label>
                            <Input 
                                placeholder="เช่น https://www.facebook.com/soc.crru" 
                                value={formData.social_links.facebook} 
                                onChange={e => setFormData(p => ({ 
                                    ...p, 
                                    social_links: { ...p.social_links, facebook: e.target.value },
                                    facebook_video_url: e.target.value
                                }))} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-black flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                                TikTok Account URL
                            </Label>
                            <Input 
                                placeholder="เช่น https://www.tiktok.com/@soc_crru" 
                                value={formData.social_links.tiktok} 
                                onChange={e => setFormData(p => ({ 
                                    ...p, 
                                    social_links: { ...p.social_links, tiktok: e.target.value } 
                                }))} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                                <span>📸</span> Instagram Profile URL
                            </Label>
                            <Input 
                                placeholder="เช่น https://www.instagram.com/soc_crru" 
                                value={formData.social_links.instagram} 
                                onChange={e => setFormData(p => ({ 
                                    ...p, 
                                    social_links: { ...p.social_links, instagram: e.target.value } 
                                }))} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#06C755] flex items-center gap-1.5">
                                <span className="font-bold text-[10px] bg-[#06C755] text-white px-1 rounded-xs">LINE</span>
                                Line Official / Line OpenChat URL
                            </Label>
                            <Input 
                                placeholder="เช่น https://line.me/R/ti/p/@soc_crru" 
                                value={formData.social_links.line} 
                                onChange={e => setFormData(p => ({ 
                                    ...p, 
                                    social_links: { ...p.social_links, line: e.target.value } 
                                }))} 
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <Label className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                                <span>▶️</span> YouTube Channel / Video URL
                            </Label>
                            <Input 
                                placeholder="เช่น https://www.youtube.com/@soc_crru หรือ https://www.youtube.com/watch?v=..." 
                                value={formData.social_links.youtube} 
                                onChange={e => setFormData(p => ({ 
                                    ...p, 
                                    social_links: { ...p.social_links, youtube: e.target.value },
                                    youtube_video_url: e.target.value
                                }))} 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Program Structure */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">โครงสร้างหลักสูตร (จำนวนหน่วยกิต)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">รวมตลอดหลักสูตร (หน่วยกิต)*</Label>
                        <Input 
                            type="number" 
                            value={formData.structure.totalCredits} 
                            onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, totalCredits: Number(e.target.value) } }))} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดศึกษาทั่วไป</Label>
                        <Input 
                            type="number" 
                            value={formData.structure.general} 
                            onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, general: Number(e.target.value) } }))} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดวิชาเฉพาะ</Label>
                        <Input 
                            type="number" 
                            value={formData.structure.major} 
                            onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, major: Number(e.target.value) } }))} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">หมวดเลือกเสรี</Label>
                        <Input 
                            type="number" 
                            value={formData.structure.freeElective} 
                            onChange={e => setFormData(p => ({ ...p, structure: { ...p.structure, freeElective: Number(e.target.value) } }))} 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 4. TRACK MANAGEMENT (DECOUPLED FORM ARCHITECTURE) */}
            <Card className="border-amber-300 shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 bg-amber-50/40 border-b border-amber-200/60 rounded-t-lg">
                    <div>
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-amber-700" />
                            <CardTitle className="text-lg text-amber-950">
                                แขนงวิชา / กลุ่มวิชาเอกเฉพาะทาง (Tracks & Concentrations)
                            </CardTitle>
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                แยกฟอร์มอิสระ
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            จัดการแขนงวิชา แผนเทียบโอน 2 ปีหลัง (ปวส.) พร้อมรูปภาพกิจกรรมและลิงก์โซเชียลแยกเฉพาะ
                        </p>
                    </div>

                    {!isNew && (
                        <Button
                            type="button"
                            onClick={() => router.push(`/admin/programs/${params.id}/tracks/new`)}
                            className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shadow-sm text-xs h-9 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            เพิ่มแขนงวิชาใหม่
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="pt-4">
                    {isNew ? (
                        <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                            💡 กรุณากด &quot;บันทึกหลักสูตร&quot; ก่อน จึงจะสามารถเพิ่มและจัดการแขนงวิชาย่อยได้
                        </div>
                    ) : tracks.length > 0 ? (
                        <div className="space-y-3">
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/50 border-b text-muted-foreground text-left">
                                        <tr>
                                            <th className="px-3 py-2.5 font-medium w-12 text-center">#</th>
                                            <th className="px-3 py-2.5 font-medium">ชื่อแขนงวิชา / รหัส</th>
                                            <th className="px-3 py-2.5 font-medium">แผนการศึกษา</th>
                                            <th className="px-3 py-2.5 font-medium">ประเภท</th>
                                            <th className="px-3 py-2.5 font-medium">สถานะการรับสมัคร</th>
                                            <th className="px-3 py-2.5 text-right font-medium">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {tracks.map((t, idx) => (
                                            <tr key={t.id} className="hover:bg-amber-50/20">
                                                <td className="px-3 py-3 text-center text-muted-foreground font-medium">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-scholar-deep text-sm">{t.nameTh}</span>
                                                        {t.nameEn && <span className="text-[11px] text-muted-foreground italic">{t.nameEn}</span>}
                                                        <span className="text-[10px] font-mono text-muted-foreground mt-0.5">/{formData.code}/{t.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    {planBadge(t.studyPlanType)}
                                                </td>
                                                <td className="px-3 py-3">
                                                    {trackTypeBadge(t.trackType)}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className="text-xs text-slate-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block max-w-[160px] truncate">
                                                        {t.admissionStatus || formData.admission_status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <div className="flex justify-end items-center gap-1">
                                                        {formData.code && t.code && (
                                                            <a
                                                                href={`/programs/${formData.code}/${t.code}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="h-8 w-8 inline-flex items-center justify-center rounded text-scholar-deep hover:bg-slate-100"
                                                                title="ดูหน้าเว็บจริง"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2.5 text-xs text-amber-800 border-amber-300 hover:bg-amber-50"
                                                            onClick={() => router.push(`/admin/programs/${params.id}/tracks/${t.id}`)}
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                                            แก้ไขแขนงวิชา
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-red-50"
                                                            onClick={() => handleDeleteTrack(t.id, t.nameTh)}
                                                            title="ลบแขนงวิชา"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">หลักสูตรนี้แสดงผลเป็น &quot;หลักสูตรเดี่ยว&quot; (Single Curriculum)</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                                    หลักสูตรนี้ไม่มีแขนงวิชาย่อย ระบบจะดึงข้อมูลโครงสร้างหลักสูตร สื่อประชาสัมพันธ์ และลิงก์โซเชียลมีเดียจากฟอร์มหลักนี้ไปแสดงผลบนหน้าเว็บไซต์โดยตรง
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/programs/${params.id}/tracks/new`)}
                                className="border-amber-400 text-amber-800 hover:bg-amber-50 text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                เพิ่มแขนงวิชา / แผนเทียบโอนสำหรับหลักสูตรนี้
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 5. PR Media (Gallery & Attachments) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">สื่อประชาสัมพันธ์รูปภาพ & เอกสารของหลักสูตร (PR Media)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>แกลลอรีรูปภาพกิจกรรมหลักสูตร (Multiple Images)</Label>
                            <div className="relative">
                                <Button variant="outline" size="sm" type="button" className="cursor-pointer pointer-events-none">
                                    <Upload className="w-4 h-4 mr-2" /> อัปโหลดรูปภาพ
                                </Button>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    onChange={e => handleMultiFileUpload(e, 'gallery')} 
                                />
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
                                ยังไม่มีรูปภาพในแกลลอรีของหลักสูตร
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
                                <input 
                                    type="file" 
                                    multiple 
                                    accept=".pdf,.doc,.docx,.xls,.xlsx" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    onChange={e => handleMultiFileUpload(e, 'attachment')} 
                                />
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

            {/* 6. Careers */}
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
                                    placeholder="เช่น นักสังคมสงเคราะห์, ผู้ประกอบการร้านอาหาร, เจ้าหน้าที่สิ่งแวดล้อม"
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

            {/* 7. Highlights */}
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
