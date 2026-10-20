'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    FileCheck,
    Search,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Send,
    AlertTriangle,
    Building2,
    Mail,
    Phone,
    User,
    Calendar,
    ChevronRight,
    ArrowLeft,
    X,
    Download,
    FileSpreadsheet,
    TrendingUp,
    Award,
    BarChart3,
} from 'lucide-react';
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
import AdminPagination from '@/components/AdminPagination';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ResumeRequestStats {
    total: number;
    pending: number;
    sent: number;
    rejected: number;
    slaUrgent: number;
    slaOverdue: number;
    byPurpose: Array<{
        purpose: string;
        label: string;
        count: number;
        percentage: number;
    }>;
    topStaff: Array<{
        staffId: string;
        name: string;
        department: string;
        count: number;
    }>;
}

interface ResumeRequestItem {
    id: string;
    staffId: string;
    requesterName: string;
    organization: string;
    email: string;
    phone?: string | null;
    purpose: string;
    notes?: string | null;
    status: 'PENDING' | 'APPROVED' | 'SENT' | 'REJECTED';
    sentAt?: string | null;
    createdAt: string;
    rejectionReason?: string | null;
    staffFirstNameTh?: string | null;
    staffLastNameTh?: string | null;
    staffPrefixTh?: string | null;
    departmentName?: string | null;
}

export default function ResumeRequestsPage() {
    const [requests, setRequests] = useState<ResumeRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Analytics & Stats (Option A)
    const [stats, setStats] = useState<ResumeRequestStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [exporting, setExporting] = useState<'detailed' | 'summary' | null>(null);

    // Modals
    const [detailItem, setDetailItem] = useState<ResumeRequestItem | null>(null);
    const [approveItem, setApproveItem] = useState<ResumeRequestItem | null>(null);
    const [rejectItem, setRejectItem] = useState<ResumeRequestItem | null>(null);
    const [previewPdfStaffId, setPreviewPdfStaffId] = useState<string | null>(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3500);
    };

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setStatsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/staff/resume-requests/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        if (!token) return;

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '15',
            });
            if (statusFilter !== 'ALL') {
                queryParams.append('status', statusFilter);
            }

            const res = await fetch(`${API_URL}/api/staff/resume-requests?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data.data || []);
                setTotal(data.total || 0);
                setTotalPages(data.totalPages || 1);
            } else {
                showToast('ไม่สามารถดึงข้อมูลคำขอได้', 'error');
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, [fetchRequests, fetchStats]);

    const handleExport = async (type: 'detailed' | 'summary') => {
        setExporting(type);
        const token = localStorage.getItem('admin_token');
        if (!token) {
            showToast('กรุณาเข้าสู่ระบบก่อนทำการส่งออกข้อมูล', 'error');
            setExporting(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/staff/resume-requests/export?type=${type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                showToast('เกิดข้อผิดพลาดในการส่งออกรายงาน', 'error');
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const today = new Date().toISOString().slice(0, 10);
            a.download =
                type === 'summary'
                    ? `resume-requests-summary-${today}.csv`
                    : `resume-requests-detailed-${today}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(
                type === 'summary'
                    ? 'ดาวน์โหลดรายงานสรุปสถิติ (Summary CSV) สำเร็จ'
                    : 'ดาวน์โหลดข้อมูลคำขอทั้งหมด (Detailed CSV) สำเร็จ'
            );
        } catch (err) {
            console.error('Export error:', err);
            showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อส่งออกข้อมูลได้', 'error');
        } finally {
            setExporting(null);
        }
    };

    const handleApprove = async () => {
        if (!approveItem) return;
        setProcessing(true);
        const token = localStorage.getItem('admin_token');

        try {
            const res = await fetch(`${API_URL}/api/staff/resume-requests/${approveItem.id}/approve`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                showToast('อนุมัติและจัดส่งเอกสาร PDF ให้ผู้ขอเรียบร้อยแล้ว');
                setApproveItem(null);
                fetchRequests();
                fetchStats();
            } else {
                const err = await res.json().catch(() => ({}));
                showToast(err.message || 'เกิดข้อผิดพลาดในการอนุมัติ', 'error');
            }
        } catch {
            showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectItem) return;
        if (!rejectionReason.trim()) {
            showToast('กรุณาระบุเหตุผลในการปฏิเสธคำขอ', 'error');
            return;
        }

        setProcessing(true);
        const token = localStorage.getItem('admin_token');

        try {
            const res = await fetch(`${API_URL}/api/staff/resume-requests/${rejectItem.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
            });

            if (res.ok) {
                showToast('ปฏิเสธคำขอเรียบร้อยแล้ว');
                setRejectItem(null);
                setRejectionReason('');
                fetchRequests();
                fetchStats();
            } else {
                const err = await res.json().catch(() => ({}));
                showToast(err.message || 'เกิดข้อผิดพลาดในการปฏิเสธ', 'error');
            }
        } catch {
            showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleOpenPdfPreview = async (staffId: string) => {
        setPreviewPdfStaffId(staffId);
        setPreviewLoading(true);
        if (previewPdfUrl) {
            URL.revokeObjectURL(previewPdfUrl);
            setPreviewPdfUrl(null);
        }

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/staff/${staffId}/resume-preview`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                showToast(err.message || 'ไม่สามารถโหลดเอกสาร PDF ได้', 'error');
                setPreviewPdfStaffId(null);
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setPreviewPdfUrl(url);
        } catch (e) {
            console.error('Failed to preview PDF:', e);
            showToast('เกิดข้อผิดพลาดในการดาวน์โหลดเอกสาร PDF', 'error');
            setPreviewPdfStaffId(null);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleClosePdfPreview = () => {
        if (previewPdfUrl) {
            URL.revokeObjectURL(previewPdfUrl);
            setPreviewPdfUrl(null);
        }
        setPreviewPdfStaffId(null);
    };

    // คำนวณวันคงเหลือในกรอบ 7 วันทำการ
    const getSlaBadge = (createdAt: string, status: string) => {
        if (status === 'SENT') {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ส่งมอบแล้ว
                </span>
            );
        }
        if (status === 'REJECTED') {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    ยกเลิก/ปฏิเสธ
                </span>
            );
        }

        const created = new Date(createdAt).getTime();
        const now = Date.now();
        const diffMs = created + 7 * 24 * 60 * 60 * 1000 - now;
        const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

        if (diffDays <= 0) {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-sm border border-red-300 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    เกินกำหนด 7 วัน
                </span>
            );
        } else if (diffDays <= 2) {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-600" />
                    เหลือ {diffDays} วัน (ด่วน)
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                    <Clock className="w-3 h-3 text-blue-600" />
                    เหลือ {diffDays} วัน
                </span>
            );
        }
    };

    const getPurposeLabel = (purpose: string) => {
        switch (purpose) {
            case 'SPEAKER':
                return 'เทียบเชิญวิทยากร / บรรยาย';
            case 'QA_AUDIT':
                return 'ตรวจประกันคุณภาพ (QA)';
            case 'COLLABORATION':
                return 'ความร่วมมือ / MoU';
            case 'STUDENT_ADVISOR':
                return 'ที่ปรึกษา / กรรมการสอบ';
            default:
                return 'อื่นๆ';
        }
    };

    const filteredRequests = requests.filter((r) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        const staffName = `${r.staffPrefixTh || ''}${r.staffFirstNameTh || ''} ${r.staffLastNameTh || ''}`.toLowerCase();
        return (
            r.requesterName.toLowerCase().includes(term) ||
            r.organization.toLowerCase().includes(term) ||
            r.email.toLowerCase().includes(term) ||
            staffName.includes(term) ||
            r.id.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-6 space-y-6">
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    className={cn(
                        'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-sm shadow-lg text-xs font-semibold flex items-center gap-2 border animate-fade-in text-white',
                        toastMessage.type === 'success'
                            ? 'bg-emerald-600 border-emerald-700'
                            : 'bg-red-600 border-red-700'
                    )}
                >
                    {toastMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{toastMessage.text}</span>
                </div>
            )}

            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Link href="/admin/staff" className="hover:text-primary transition-colors">
                            บุคลากร
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">คำขอเอกสารประวัติวิทยากร</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-foreground">
                                คำขอเอกสารประวัติวิทยากร / Resume (PDPA)
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                จัดการคำขอทางการ ตรวจสอบคุณสมบัติ และอนุมัติส่งไฟล์ PDF ทางอีเมลภายใน 7 วันทำการ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-sm text-xs gap-1.5 border-border hover:bg-muted font-medium text-foreground cursor-pointer"
                        onClick={() => handleExport('summary')}
                        disabled={exporting !== null}
                        title="ส่งออกรายงานสรุปภาพรวม สถิติตามวัตถุประสงค์ และ 5 อันดับอาจารย์ (Summary CSV)"
                    >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                        <span>{exporting === 'summary' ? 'กำลังส่งออก...' : 'รายงานสรุปสถิติ (CSV)'}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-sm text-xs gap-1.5 border-border hover:bg-muted font-medium text-foreground cursor-pointer"
                        onClick={() => handleExport('detailed')}
                        disabled={exporting !== null}
                        title="ส่งออกบันทึกคำขอทั้งหมดทุกรายการอย่างละเอียด (Detailed CSV)"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{exporting === 'detailed' ? 'กำลังส่งออก...' : 'ส่งออกข้อมูลทั้งหมด (CSV)'}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-sm text-xs gap-1.5 cursor-pointer"
                        onClick={() => {
                            fetchRequests();
                            fetchStats();
                        }}
                        disabled={loading || statsLoading}
                    >
                        <RefreshCw className={cn('w-3.5 h-3.5', (loading || statsLoading) && 'animate-spin')} />
                        รีเฟรช
                    </Button>
                    <Link href="/admin/staff">
                        <Button variant="ghost" size="sm" className="rounded-sm text-xs gap-1.5 cursor-pointer">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            กลับหน้าบุคลากร
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Summary Cards (Option A) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total */}
                <Card
                    onClick={() => {
                        setStatusFilter('ALL');
                        setPage(1);
                    }}
                    className={cn(
                        'rounded-sm border transition-all cursor-pointer hover:shadow-xs p-4',
                        statusFilter === 'ALL'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-border bg-card hover:border-border/80'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">คำขอทั้งหมด</span>
                        <div className="w-8 h-8 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                            <FileCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                            {statsLoading ? '...' : (stats?.total ?? 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">รายการ</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">รวมทุกสถานะในระบบ</p>
                </Card>

                {/* Card 2: Pending */}
                <Card
                    onClick={() => {
                        setStatusFilter('PENDING');
                        setPage(1);
                    }}
                    className={cn(
                        'rounded-sm border transition-all cursor-pointer hover:shadow-xs p-4',
                        statusFilter === 'PENDING'
                            ? 'border-amber-500 bg-amber-50/20 ring-1 ring-amber-500/30'
                            : 'border-border bg-card hover:border-border/80'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">รอการพิจารณา</span>
                        <div className="w-8 h-8 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight text-amber-700">
                            {statsLoading ? '...' : (stats?.pending ?? 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">รายการ</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {stats && (stats.slaUrgent > 0 || stats.slaOverdue > 0) ? (
                            <>
                                {stats.slaUrgent > 0 && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-xs border border-amber-300">
                                        <Clock className="w-2.5 h-2.5" /> ด่วน {stats.slaUrgent}
                                    </span>
                                )}
                                {stats.slaOverdue > 0 && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-xs border border-red-300 animate-pulse">
                                        <AlertTriangle className="w-2.5 h-2.5" /> เกิน SLA {stats.slaOverdue}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">อยู่ในเกณฑ์ SLA 7 วัน</span>
                        )}
                    </div>
                </Card>

                {/* Card 3: Sent */}
                <Card
                    onClick={() => {
                        setStatusFilter('SENT');
                        setPage(1);
                    }}
                    className={cn(
                        'rounded-sm border transition-all cursor-pointer hover:shadow-xs p-4',
                        statusFilter === 'SENT'
                            ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30'
                            : 'border-border bg-card hover:border-border/80'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">อนุมัติ & จัดส่งแล้ว</span>
                        <div className="w-8 h-8 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight text-emerald-700">
                            {statsLoading ? '...' : (stats?.sent ?? 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">รายการ</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">จัดส่งไฟล์ PDF ทางอีเมลแล้ว</p>
                </Card>

                {/* Card 4: Rejected */}
                <Card
                    onClick={() => {
                        setStatusFilter('REJECTED');
                        setPage(1);
                    }}
                    className={cn(
                        'rounded-sm border transition-all cursor-pointer hover:shadow-xs p-4',
                        statusFilter === 'REJECTED'
                            ? 'border-red-500 bg-red-50/20 ring-1 ring-red-500/30'
                            : 'border-border bg-card hover:border-border/80'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">ปฏิเสธคำขอ</span>
                        <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                            <XCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight text-slate-700">
                            {statsLoading ? '...' : (stats?.rejected ?? 0)}
                        </span>
                        <span className="text-xs text-muted-foreground">รายการ</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">ไม่ผ่านเกณฑ์ / ยกเลิกคำขอ</p>
                </Card>
            </div>

            {/* Visual Analytics Grid (Option A) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Purpose Distribution */}
                <Card className="rounded-sm border-border shadow-2xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <h2 className="text-xs font-bold text-foreground">
                                    สัดส่วนตามวัตถุประสงค์การขอข้อมูล
                                </h2>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                รวม {stats?.total || 0} ครั้ง
                            </span>
                        </div>

                        {statsLoading ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">กำลังโหลดสถิติ...</div>
                        ) : !stats?.byPurpose || stats.byPurpose.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                ยังไม่มีข้อมูลสถิติวัตถุประสงค์
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.byPurpose.map((item, idx) => {
                                    const barColors = [
                                        'bg-blue-600',
                                        'bg-emerald-600',
                                        'bg-amber-600',
                                        'bg-indigo-600',
                                        'bg-slate-500',
                                    ];
                                    const barColor = barColors[idx % barColors.length];
                                    return (
                                        <div key={item.purpose} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-foreground">{item.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">{item.count} ครั้ง</span>
                                                    <span className="font-bold text-foreground font-mono w-10 text-right">
                                                        {item.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={cn('h-2 rounded-full transition-all duration-500', barColor)}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top 5 Requested Staff */}
                <Card className="rounded-sm border-border shadow-2xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-600" />
                                <h2 className="text-xs font-bold text-foreground">
                                    5 อันดับคณาจารย์ที่ได้รับการขอประวัติสูงสุด
                                </h2>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">Top Requested Staff</span>
                        </div>

                        {statsLoading ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">กำลังโหลดสถิติ...</div>
                        ) : !stats?.topStaff || stats.topStaff.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                ยังไม่มีข้อมูลคำขออาจารย์ในระบบ
                            </div>
                        ) : (
                            <div className="divide-y divide-border/60">
                                {stats.topStaff.map((staff, idx) => {
                                    const rankStyles = [
                                        'bg-amber-500 text-white font-bold',
                                        'bg-slate-400 text-white font-bold',
                                        'bg-amber-700 text-white font-bold',
                                        'bg-muted text-muted-foreground font-semibold',
                                        'bg-muted text-muted-foreground font-semibold',
                                    ];
                                    const rankClass = rankStyles[idx] || 'bg-muted text-muted-foreground font-semibold';

                                    return (
                                        <div key={staff.staffId} className="py-2 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span
                                                    className={cn(
                                                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0',
                                                        rankClass
                                                    )}
                                                >
                                                    {idx + 1}
                                                </span>
                                                <div className="truncate">
                                                    <p className="text-xs font-semibold text-foreground truncate">
                                                        {staff.name}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                        {staff.department}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/20">
                                                    {staff.count} คำขอ
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-sm cursor-pointer"
                                                    title="พรีวิวเอกสาร CV ทางการ"
                                                    onClick={() => handleOpenPdfPreview(staff.staffId)}
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filter & Search Bar */}
            <Card className="rounded-sm border-border shadow-2xs">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                        {[
                            { key: 'ALL', label: 'ทั้งหมด' },
                            { key: 'PENDING', label: 'รอตรวจสอบ' },
                            { key: 'SENT', label: 'จัดส่งแล้ว' },
                            { key: 'REJECTED', label: 'ปฏิเสธ' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setStatusFilter(tab.key);
                                    setPage(1);
                                }}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer',
                                    statusFilter === tab.key
                                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาชื่อผู้ขอ, หน่วยงาน, อาจารย์..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 text-xs rounded-sm h-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="rounded-sm border-border shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full text-left text-xs">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                            <tr>
                                <th className="py-3 px-4">ผู้ยื่นคำขอ / หน่วยงาน</th>
                                <th className="py-3 px-4">อาจารย์ที่ถูกขอประวัติ</th>
                                <th className="py-3 px-4">วัตถุประสงค์</th>
                                <th className="py-3 px-4">กำหนดส่ง (SLA 7 วัน)</th>
                                <th className="py-3 px-4">สถานะ</th>
                                <th className="py-3 px-4 text-right">ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span>กำลังโหลดข้อมูลคำขอ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <FileCheck className="w-8 h-8 text-muted-foreground/40" />
                                            <p className="font-semibold text-sm">ไม่พบรายการคำขอ</p>
                                            <p className="text-[11px]">ไม่มีคำขอเอกสารประวัติวิทยากรในเงื่อนไขที่เลือก</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((item) => {
                                    const staffFullName = `${item.staffPrefixTh || ''}${item.staffFirstNameTh || ''} ${item.staffLastNameTh || ''}`.trim() || 'บุคลากร';
                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Requester & Org */}
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-foreground">
                                                    {item.requesterName}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Building2 className="w-3 h-3 text-muted-foreground/70" />
                                                    <span>{item.organization}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">
                                                    {item.email} {item.phone ? `• ${item.phone}` : ''}
                                                </div>
                                            </td>

                                            {/* Target Staff */}
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-foreground">
                                                    {staffFullName}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {item.departmentName || 'คณะสังคมศาสตร์'}
                                                </div>
                                            </td>

                                            {/* Purpose */}
                                            <td className="py-3 px-4">
                                                <span className="inline-block bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded-sm font-medium border border-slate-200">
                                                    {getPurposeLabel(item.purpose)}
                                                </span>
                                                <div className="text-[10px] text-muted-foreground mt-1">
                                                    ยื่นเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}
                                                </div>
                                            </td>

                                            {/* SLA 7 Days */}
                                            <td className="py-3 px-4">
                                                {getSlaBadge(item.createdAt, item.status)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3 px-4">
                                                {item.status === 'PENDING' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                                                        รอตรวจสอบ
                                                    </span>
                                                )}
                                                {item.status === 'SENT' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                                                        จัดส่งแล้ว
                                                    </span>
                                                )}
                                                {item.status === 'REJECTED' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-sm border border-red-200">
                                                        ปฏิเสธ
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    {/* Preview PDF */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-sm"
                                                        title="พรีวิวเอกสาร PDF ทางการ"
                                                        onClick={() => handleOpenPdfPreview(item.staffId)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>

                                                    {/* View Details */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-sm"
                                                        title="ดูรายละเอียดคำขอ"
                                                        onClick={() => setDetailItem(item)}
                                                    >
                                                        <User className="w-3.5 h-3.5" />
                                                    </Button>

                                                    {/* Approve & Dispatch Button (only for PENDING) */}
                                                    {item.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium rounded-sm gap-1"
                                                                title="อนุมัติและจัดส่งเอกสารทางอีเมลทันที"
                                                                onClick={() => setApproveItem(item)}
                                                            >
                                                                <Send className="w-3 h-3" />
                                                                <span>อนุมัติ & ส่ง</span>
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-[11px] rounded-sm"
                                                                title="ปฏิเสธคำขอ"
                                                                onClick={() => {
                                                                    setRejectItem(item);
                                                                    setRejectionReason('');
                                                                }}
                                                            >
                                                                ปฏิเสธ
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            ทั้งหมด {total} รายการ (หน้า {page} จาก {totalPages})
                        </span>
                        <AdminPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </Card>

            {/* Modal: View Details */}
            <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
                <DialogContent className="rounded-sm max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-primary" />
                            รายละเอียดคำขอเอกสารประวัติ
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            รหัสคำขอ: <code className="font-mono text-foreground font-bold">{detailItem?.id}</code>
                        </DialogDescription>
                    </DialogHeader>

                    {detailItem && (
                        <div className="space-y-3 text-xs py-2">
                            <div className="bg-muted/40 p-3 rounded-sm space-y-1.5 border border-border">
                                <p><span className="text-muted-foreground font-medium">ผู้ขอ:</span> <strong className="text-foreground">{detailItem.requesterName}</strong></p>
                                <p><span className="text-muted-foreground font-medium">หน่วยงาน/องค์กร:</span> {detailItem.organization}</p>
                                <p><span className="text-muted-foreground font-medium">อีเมลจัดส่ง:</span> <span className="font-mono text-primary font-semibold">{detailItem.email}</span></p>
                                {detailItem.phone && <p><span className="text-muted-foreground font-medium">โทร:</span> {detailItem.phone}</p>}
                            </div>

                            <div className="bg-muted/40 p-3 rounded-sm space-y-1.5 border border-border">
                                <p><span className="text-muted-foreground font-medium">อาจารย์ที่ถูกขอประวัติ:</span> <strong className="text-foreground">{detailItem.staffPrefixTh || ''}{detailItem.staffFirstNameTh} {detailItem.staffLastNameTh}</strong> ({detailItem.departmentName || 'คณะสังคมศาสตร์'})</p>
                                <p><span className="text-muted-foreground font-medium">วัตถุประสงค์:</span> {getPurposeLabel(detailItem.purpose)}</p>
                                {detailItem.notes && (
                                    <div className="pt-1 border-t border-border mt-1">
                                        <span className="text-muted-foreground block mb-0.5 font-medium">รายละเอียดโครงการ/งาน:</span>
                                        <p className="bg-card p-2 rounded-sm text-foreground whitespace-pre-wrap leading-relaxed">{detailItem.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                                <span>วันที่ยื่นคำขอ: {new Date(detailItem.createdAt).toLocaleString('th-TH')}</span>
                                {detailItem.sentAt && <span className="text-emerald-700 font-medium">ส่งออกเมื่อ: {new Date(detailItem.sentAt).toLocaleString('th-TH')}</span>}
                            </div>

                            {detailItem.rejectionReason && (
                                <div className="p-2.5 bg-red-50 border border-red-200 rounded-sm text-red-800">
                                    <strong className="block mb-0.5">เหตุผลที่ปฏิเสธ:</strong>
                                    {detailItem.rejectionReason}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-sm text-xs"
                            onClick={() => setDetailItem(null)}
                        >
                            ปิดหน้าต่าง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Approve & Send Confirmation */}
            <Dialog open={!!approveItem} onOpenChange={() => !processing && setApproveItem(null)}>
                <DialogContent className="rounded-sm max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-emerald-800">
                            <Send className="w-4 h-4 text-emerald-600" />
                            ยืนยันการอนุมัติและจัดส่งเอกสาร PDF
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            ระบบจะสร้างเอกสาร PDF เรซูเม่ฉบับทางการ และจัดส่งไปยังอีเมลของผู้ขอโดยอัตโนมัติ
                        </DialogDescription>
                    </DialogHeader>

                    {approveItem && (
                        <div className="space-y-2 text-xs py-2 bg-emerald-50/60 border border-emerald-200 p-3 rounded-sm">
                            <p><span className="text-muted-foreground">ผู้รับเอกสาร:</span> <strong>{approveItem.requesterName}</strong> ({approveItem.organization})</p>
                            <p><span className="text-muted-foreground">ส่งไปยังอีเมล:</span> <span className="font-mono text-emerald-800 font-bold">{approveItem.email}</span></p>
                            <p><span className="text-muted-foreground">เอกสารของ:</span> {approveItem.staffPrefixTh || ''}{approveItem.staffFirstNameTh} {approveItem.staffLastNameTh}</p>
                            <p><span className="text-muted-foreground">ส่งจากอีเมล:</span> <span className="font-mono text-slate-700">social@crru.ac.th</span></p>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-sm text-xs"
                            onClick={() => setApproveItem(null)}
                            disabled={processing}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-sm text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                            onClick={handleApprove}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>กำลังสร้าง PDF และส่งเมล...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>ยืนยันอนุมัติและส่งเอกสาร</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Reject Request */}
            <Dialog open={!!rejectItem} onOpenChange={() => !processing && setRejectItem(null)}>
                <DialogContent className="rounded-sm max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-red-800">
                            <XCircle className="w-4 h-4 text-red-600" />
                            ปฏิเสธคำขอเอกสารประวัติ
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            ระบุเหตุผลในการปฏิเสธคำขอ เพื่อใช้เป็นหลักฐานการดำเนินงานตามเกณฑ์ PDPA
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 text-xs py-2">
                        {rejectItem && (
                            <p className="text-muted-foreground">
                                คำขอจาก: <strong>{rejectItem.requesterName}</strong> ({rejectItem.organization})
                            </p>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">
                                เหตุผลในการปฏิเสธ <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                required
                                placeholder="เช่น วัตถุประสงค์ไม่สอดคล้องกับระเบียบ หรือข้อมูลผู้ขอยังไม่ครบถ้วน..."
                                className="w-full px-3 py-2 text-xs border border-border rounded-sm bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-sm text-xs"
                            onClick={() => setRejectItem(null)}
                            disabled={processing}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-sm text-xs bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleReject}
                            disabled={processing}
                        >
                            {processing ? 'กำลังบันทึก...' : 'ยืนยันปฏิเสธคำขอ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: PDF Preview Dialog */}
            <Dialog open={!!previewPdfStaffId} onOpenChange={() => handleClosePdfPreview()}>
                <DialogContent className="rounded-sm max-w-4xl h-[85vh] flex flex-col p-4">
                    <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                        <div>
                            <DialogTitle className="text-base font-bold flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-primary" />
                                พรีวิวเอกสารประวัติทางการ (Official PDF Preview)
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                ตัวอย่างเอกสารที่จะสร้างและจัดส่งให้ผู้ขอรับเอกสารทางอีเมล (มีตราสัญลักษณ์ มรภ.ชร. และคณะฯ)
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 w-full bg-slate-900 rounded-sm overflow-hidden my-2 relative flex items-center justify-center">
                        {previewLoading ? (
                            <div className="flex flex-col items-center gap-3 text-white">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-medium text-slate-300">กำลังสร้างและโหลดพรีวิวเอกสาร PDF...</span>
                            </div>
                        ) : previewPdfUrl ? (
                            <iframe
                                src={previewPdfUrl}
                                className="w-full h-full border-0 bg-white"
                                title="PDF Resume Preview"
                            />
                        ) : (
                            <div className="text-slate-400 text-xs">
                                ไม่สามารถแสดงตัวอย่างเอกสารได้
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-2 border-t border-border flex items-center justify-between sm:justify-between">
                        {previewPdfUrl ? (
                            <a
                                href={previewPdfUrl}
                                download="Official_Speaker_Bio_Preview.pdf"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>ดาวน์โหลดไฟล์ PDF ทดสอบ</span>
                            </a>
                        ) : <div />}
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-sm text-xs"
                            onClick={handleClosePdfPreview}
                        >
                            ปิดหน้าต่าง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
