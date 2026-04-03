'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Settings, CalendarIcon, FileText, Trash2, Plus, Edit3, Image as ImageIcon, Link as LinkIcon, Video, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminAdmissionsPage() {
    const [config, setConfig] = useState<any>({ youtubeVideoUrl: '', brochureUrl: '', bachelorLink: '', graduateLink: '', tableTitle: '' });
    const [schedules, setSchedules] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialogs state
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [docOpen, setDocOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<any>(null);
    const [editingDoc, setEditingDoc] = useState<any>(null);

    // Read Data
    const fetchData = async () => {
        try {
            const [cfgRes, schRes, docRes] = await Promise.all([
                fetch(`${API_URL}/api/admissions/config`),
                fetch(`${API_URL}/api/admissions/schedules`),
                fetch(`${API_URL}/api/admissions/documents`)
            ]);
            if (cfgRes.ok) setConfig(await cfgRes.json());
            if (schRes.ok) setSchedules(await schRes.json());
            if (docRes.ok) setDocuments(await docRes.json());
        } catch (error) {
            console.error('Fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Helper requests
    const getToken = () => localStorage.getItem('admin_token');

    // 1. Config mutations
    const handleSaveConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admissions/config`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                alert('บันทึกการตั้งค่าสำเร็จ');
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 2. Upload helpers
    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
        const file = e.target.files?.[0];
        if (!file) return null;
        const fd = new FormData();
        fd.append('file', file);
        const endpoint = type === 'image' ? '/api/upload/news' : '/api/upload/news/attachment';
        
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd
            });
            if (res.ok) {
                const data = await res.json();
                return data.url || data.fileUrl;
            }
        } catch (error) {
            console.error(error);
        }
        return null;
    };

    // Delete file from server
    const deleteManagedFile = async (fileUrl: string) => {
        if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
        try {
            await fetch(`${API_URL}/api/upload/news`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ url: fileUrl })
            });
        } catch (err) {
            console.error('Failed to delete file:', err);
        }
    };

    // Date formatting helpers
    const formatThaiDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const parsePeriodToDates = (period: string) => {
        // Try to parse "YYYY-MM-DD|YYYY-MM-DD" format (our storage format)
        if (period && period.includes('|')) {
            const [s, e] = period.split('|');
            return { startDate: s, endDate: e };
        }
        return { startDate: '', endDate: '' };
    };

    const formatPeriodDisplay = (period: string) => {
        if (!period) return '-';
        if (period.includes('|')) {
            const [s, e] = period.split('|');
            return `${formatThaiDate(s)} - ${formatThaiDate(e)}`;
        }
        return period; // fallback for legacy text
    };

    // Channel options
    const channelOptions = [
        'สมัครออนไลน์',
        'สมัครด้วยตนเอง',
        'สมัครออนไลน์ / สมัครด้วยตนเอง',
        'ระบบรับสมัครกลางมหาวิทยาลัย',
        'ติดต่อคณะโดยตรง',
    ];

    // 3. Schedule Mutations
    const handleSaveSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingSchedule?.id ? 'PATCH' : 'POST';
        const url = editingSchedule?.id 
            ? `${API_URL}/api/admissions/schedules/${editingSchedule.id}`
            : `${API_URL}/api/admissions/schedules`;

        // Compose period from startDate + endDate
        const payload = {
            ...editingSchedule,
            period: `${editingSchedule.startDate || ''}|${editingSchedule.endDate || ''}`,
        };
        delete payload.startDate;
        delete payload.endDate;
        
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setScheduleOpen(false);
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    const handleDeleteSchedule = async (id: string) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try {
            const res = await fetch(`${API_URL}/api/admissions/schedules/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) fetchData();
        } catch (err) { console.error(err); }
    };

    // 4. Document Mutations
    const handleSaveDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingDoc?.id ? 'PATCH' : 'POST';
        const url = editingDoc?.id 
            ? `${API_URL}/api/admissions/documents/${editingDoc.id}`
            : `${API_URL}/api/admissions/documents`;

        // If editing and fileUrl changed, delete old file
        if (editingDoc?.id) {
            const oldDoc = documents.find((d: any) => d.id === editingDoc.id);
            if (oldDoc && oldDoc.fileUrl !== editingDoc.fileUrl) {
                await deleteManagedFile(oldDoc.fileUrl);
            }
        }
        
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(editingDoc)
            });
            if (res.ok) {
                setDocOpen(false);
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    const handleDeleteDoc = async (id: string) => {
        if (!confirm('ยืนยันการลบเอกสาร?')) return;
        // Delete file from server first
        const doc = documents.find((d: any) => d.id === id);
        if (doc?.fileUrl) await deleteManagedFile(doc.fileUrl);

        try {
            const res = await fetch(`${API_URL}/api/admissions/documents/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) fetchData();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;

    const StatusBadge = ({ status }: { status: string }) => {
        const smap: Record<string, { label: string, color: string }> = {
            'OPEN': { label: 'กำลังเปิดรับ', color: 'bg-green-100 text-green-700 border-green-200' },
            'UPCOMING': { label: 'ยังไม่เปิด', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
            'CLOSED': { label: 'ปิดรับสมัคร', color: 'bg-red-100 text-red-700 border-red-200' },
            'ALWAYS': { label: 'เปิดรับตลอดปี', color: 'bg-blue-100 text-blue-700 border-blue-200' }
        };
        const s = smap[status] || smap['UPCOMING'];
        return <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${s.color}`}>{s.label}</span>;
    };

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-scholar-deep flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-scholar-accent" />
                    จัดการรับสมัคร (Admissions)
                </h1>
                <p className="text-gray-500 text-sm mt-1">อัปเดตแบนเนอร์, ปฏิทินรับสมัคร, และเอกสารประชาสัมพันธ์</p>
            </div>

            {/* Config Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5" /> ตั้งค่าเนื้อหาหน้าแรก (Config)
                    </CardTitle>
                    <CardDescription>ปรับแต่งแบนเนอร์ลิงก์และวิดีโอแนะนำคณะ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Video className="w-4 h-4"/> YouTube Video URL</Label>
                            <Input 
                                value={config.youtubeVideoUrl || ''} 
                                onChange={e => setConfig({...config, youtubeVideoUrl: e.target.value})} 
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4"/> โบรชัวร์ (Image URL)</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={config.brochureUrl || ''} 
                                    onChange={e => setConfig({...config, brochureUrl: e.target.value})} 
                                    placeholder="/uploads/news/brochure.jpg"
                                />
                                <Label className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center px-4 rounded-md">
                                    อัปโหลด
                                    <input 
                                        type="file" className="hidden" accept="image/*"
                                        onChange={async (e) => {
                                            const oldUrl = config.brochureUrl;
                                            const url = await uploadFile(e, 'image');
                                            if (url) {
                                                if (oldUrl) await deleteManagedFile(oldUrl);
                                                setConfig({...config, brochureUrl: url});
                                            }
                                        }}
                                    />
                                </Label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/> ลิงก์ระบบรับสมัคร (ปริญญาตรี)</Label>
                            <Input 
                                value={config.bachelorLink || ''} 
                                onChange={e => setConfig({...config, bachelorLink: e.target.value})} 
                                placeholder="https://admission.crru.ac.th/"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/> ลิงก์ระบบรับสมัคร (บัณฑิตศึกษา)</Label>
                            <Input 
                                value={config.graduateLink || ''} 
                                onChange={e => setConfig({...config, graduateLink: e.target.value})} 
                                placeholder="https://orasis.crru.ac.th/gds_crru"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> หัวข้อตารางรับสมัคร</Label>
                            <Input 
                                value={config.tableTitle || ''} 
                                onChange={e => setConfig({...config, tableTitle: e.target.value})} 
                                placeholder="ตารางรอบรับสมัคร ประจำปีการศึกษา 2569"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveConfig} className="bg-scholar-deep hover:bg-scholar-deep/90 mt-4">
                        บันทึกการตั้งค่า
                    </Button>
                </CardContent>
            </Card>

            {/* Schedules Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" /> ปฏิทินรับสมัครนักศึกษา
                        </CardTitle>
                        <CardDescription>ข้อมูลรอบระดับปริญญาตรีและระดับอื่นๆ</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingSchedule({ roundName: '', description: '', startDate: '', endDate: '', channel: 'สมัครออนไลน์', status: 'UPCOMING', sortOrder: 0 }); setScheduleOpen(true); }} size="sm" className="gap-1">
                        <Plus className="w-4 h-4" /> เพิ่มรอบ
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">รอบรับสมัคร</th>
                                    <th className="px-4 py-3">ช่วงเวลา</th>
                                    <th className="px-4 py-3">ช่องทาง</th>
                                    <th className="px-4 py-3">สถานะ</th>
                                    <th className="px-4 py-3 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {schedules.map((sch) => (
                                    <tr key={sch.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-scholar-deep">{sch.roundName}</div>
                                            <div className="text-xs text-muted-foreground">{sch.description}</div>
                                        </td>
                                        <td className="px-4 py-3">{formatPeriodDisplay(sch.period)}</td>
                                        <td className="px-4 py-3 text-scholar-accent font-medium">{sch.channel}</td>
                                        <td className="px-4 py-3"><StatusBadge status={sch.status} /></td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => { const dates = parsePeriodToDates(sch.period); setEditingSchedule({ ...sch, startDate: dates.startDate, endDate: dates.endDate }); setScheduleOpen(true); }}>
                                                <Edit3 className="w-4 h-4 text-sky-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSchedule(sch.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {schedules.length === 0 && (
                                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">ไม่พบปฏิทินรับสมัคร</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Documents Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" /> เอกสารดาวน์โหลด
                        </CardTitle>
                        <CardDescription>เอกสารอ้างอิงและคู่มือการสมัครเรียน</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingDoc({ title: '', fileUrl: '', sortOrder: 0 }); setDocOpen(true); }} size="sm" className="gap-1">
                        <Plus className="w-4 h-4" /> เพิ่มเอกสาร
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">ชื่อเอกสาร</th>
                                    <th className="px-4 py-3">ลิงก์ไฟล์</th>
                                    <th className="px-4 py-3 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-medium text-scholar-deep">{doc.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{doc.fileUrl}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingDoc(doc); setDocOpen(true); }}>
                                                <Edit3 className="w-4 h-4 text-sky-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDoc(doc.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {documents.length === 0 && (
                                    <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">ไม่พบเอกสารดาวน์โหลด</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* SCHEDULE MODAL */}
            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSchedule?.id ? 'แก้ไขรอบรับสมัคร' : 'เพิ่มรอบรับสมัคร'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveSchedule} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>รอบรับสมัคร (ชื่อ) *</Label>
                            <Input required value={editingSchedule?.roundName || ''} onChange={e => setEditingSchedule({...editingSchedule, roundName: e.target.value})} placeholder="เช่น รอบที่ 1 Portfolio" />
                        </div>
                        <div className="space-y-2">
                            <Label>คำอธิบายย่อย</Label>
                            <Input value={editingSchedule?.description || ''} onChange={e => setEditingSchedule({...editingSchedule, description: e.target.value})} placeholder="เช่น ยื่นแฟ้มสะสมผลงาน" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> วันเริ่มรับสมัคร *</Label>
                                <Input 
                                    type="date" 
                                    required 
                                    value={editingSchedule?.startDate || ''} 
                                    onChange={e => setEditingSchedule({...editingSchedule, startDate: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> วันปิดรับสมัคร *</Label>
                                <Input 
                                    type="date" 
                                    required 
                                    value={editingSchedule?.endDate || ''} 
                                    onChange={e => setEditingSchedule({...editingSchedule, endDate: e.target.value})} 
                                />
                            </div>
                        </div>
                        {editingSchedule?.startDate && editingSchedule?.endDate && (
                            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                                📅 ช่วงรับสมัคร: <span className="font-medium text-foreground">{formatThaiDate(editingSchedule.startDate)} - {formatThaiDate(editingSchedule.endDate)}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ช่องทาง *</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={editingSchedule?.channel || 'สมัครออนไลน์'}
                                    onChange={e => setEditingSchedule({...editingSchedule, channel: e.target.value})}
                                >
                                    {channelOptions.map(ch => (
                                        <option key={ch} value={ch}>{ch}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>สถานะ</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={editingSchedule?.status || 'UPCOMING'}
                                    onChange={e => setEditingSchedule({...editingSchedule, status: e.target.value})}
                                >
                                    <option value="UPCOMING">UPCOMING (ยังไม่เปิด)</option>
                                    <option value="OPEN">OPEN (กำลังเปิดรับ)</option>
                                    <option value="CLOSED">CLOSED (ปิดรับสมัคร)</option>
                                    <option value="ALWAYS">ALWAYS (เปิดรับตลอดปี)</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setScheduleOpen(false)}>ยกเลิก</Button>
                            <Button type="submit">บันทึกข้อมูล</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DOC MODAL */}
            <Dialog open={docOpen} onOpenChange={setDocOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDoc?.id ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารแนบ'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveDoc} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>ชื่อเอกสาร *</Label>
                            <Input required value={editingDoc?.title || ''} onChange={e => setEditingDoc({...editingDoc, title: e.target.value})} placeholder="เช่น คู่มือการรับสมัครปริญญาตรี" />
                        </div>
                        <div className="space-y-2">
                            <Label>ไฟล์เอกสาร (URL) *</Label>
                            <div className="flex gap-2">
                                <Input required value={editingDoc?.fileUrl || ''} onChange={e => setEditingDoc({...editingDoc, fileUrl: e.target.value})} />
                                <Label className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center px-4 rounded-md">
                                    อัปโหลด
                                    <input 
                                        type="file" className="hidden" 
                                        onChange={async (e) => {
                                            const url = await uploadFile(e, 'doc');
                                            if (url) setEditingDoc({...editingDoc, fileUrl: url});
                                        }}
                                    />
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setDocOpen(false)}>ยกเลิก</Button>
                            <Button type="submit">บันทึกข้อมูล</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
