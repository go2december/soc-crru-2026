'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    BookOpen, Plus, Search, Edit3, Trash2, GraduationCap, AlertTriangle, 
    Layers, ExternalLink, Filter, CheckCircle2, Share2, Video, Sparkles
} from 'lucide-react';
import AdminPagination from '@/components/AdminPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface Program {
    id: string;
    code: string;
    nameTh: string;
    degreeLevel: string;
    isActive: boolean;
    departmentId?: number | null;
    admissionStatus?: string | null;
}

interface Track {
    id: string;
    programId: string;
    code: string;
    nameTh: string;
    nameEn?: string | null;
    trackType: 'MAJOR' | 'CONCENTRATION' | 'MINOR';
    studyPlanType: 'REGULAR_4YR' | 'TRANSFER_2YR' | 'GRADUATE';
    degreeTitleTh?: string | null;
    description?: string | null;
    bannerUrl?: string | null;
    curriculumUrl?: string | null;
    youtubeVideoUrl?: string | null;
    facebookVideoUrl?: string | null;
    admissionStatus?: string | null;
    socialLinks?: {
        facebook?: string;
        tiktok?: string;
        instagram?: string;
        youtube?: string;
        line?: string;
    } | null;
    isActive: boolean;
    sortOrder: number;
    program?: {
        id: string;
        code: string;
        nameTh: string;
        departmentId?: number | null;
        degreeLevel?: string;
        admissionStatus?: string | null;
    };
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const ITEMS_PER_PAGE = 10;
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminProgramsPage() {
    const router = useRouter();

    // Active View Tab: 'programs' or 'tracks'
    const [activeTab, setActiveTab] = useState<'programs' | 'tracks'>('programs');

    // Programs State
    const [programs, setPrograms] = useState<Program[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [page, setPage] = useState(1);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
    const [deletingProgram, setDeletingProgram] = useState(false);

    // Tracks State
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(false);
    const [trackSearchTerm, setTrackSearchTerm] = useState('');
    const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('ALL');
    const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
    const [deletingTrack, setDeletingTrack] = useState(false);

    // Modal to create track
    const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
    const [targetProgramForNewTrack, setTargetProgramForNewTrack] = useState<string>('');

    // User RBAC Context
    const [currentUser, setCurrentUser] = useState<any>(null);

    // 1. Fetch Programs
    const fetchPrograms = useCallback(async (userObj?: any) => {
        setLoadingPrograms(true);
        try {
            const token = localStorage.getItem('admin_token');
            const targetUser = userObj || currentUser;
            const isDeptScoped = (targetUser?.roles?.includes('EDITOR') || targetUser?.roles?.includes('STAFF')) && !targetUser?.roles?.includes('ADMIN');
            const deptQuery = (isDeptScoped && targetUser?.departmentId) ? `&departmentId=${targetUser.departmentId}` : '';

            const res = await fetch(`${API_URL}/api/programs?page=${page}&limit=${ITEMS_PER_PAGE}${deptQuery}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const jsonRes = await res.json();
                setPrograms(jsonRes.data || []);
                setMeta(jsonRes.meta || null);
            }
        } catch (error) {
            console.error('Fetch programs error:', error);
        } finally {
            setLoadingPrograms(false);
        }
    }, [page, currentUser]);

    // 2. Fetch All Tracks
    const fetchAllTracks = useCallback(async (userObj?: any) => {
        setLoadingTracks(true);
        try {
            const token = localStorage.getItem('admin_token');
            const targetUser = userObj || currentUser;
            const isDeptScoped = (targetUser?.roles?.includes('EDITOR') || targetUser?.roles?.includes('STAFF')) && !targetUser?.roles?.includes('ADMIN');
            const deptQuery = (isDeptScoped && targetUser?.departmentId) ? `?departmentId=${targetUser.departmentId}` : '';

            const res = await fetch(`${API_URL}/api/programs/tracks/all${deptQuery}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const jsonRes = await res.json();
                setTracks(jsonRes || []);
            }
        } catch (error) {
            console.error('Fetch tracks error:', error);
        } finally {
            setLoadingTracks(false);
        }
    }, [currentUser]);

    // Initialization
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('admin_token');
            let uData = null;
            if (token) {
                try {
                    const uRes = await fetch(`${API_URL}/api/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (uRes.ok) {
                        uData = await uRes.json();
                        setCurrentUser(uData);
                    }
                } catch (e) {
                    console.error('Profile fetch error:', e);
                }
            }
            await fetchPrograms(uData);
            await fetchAllTracks(uData);
        };
        init();
    }, [page]);

    // Filter tracks by program count for programs table
    const getTrackCountForProgram = (programId: string) => {
        return tracks.filter(t => t.programId === programId).length;
    };

    // Reset pagination on search
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // Delete Program
    const handleDeleteProgram = async () => {
        if (!programToDelete) return;
        setDeletingProgram(true);

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/programs/${programToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                await fetchPrograms();
                await fetchAllTracks();
                setProgramToDelete(null);
            } else {
                alert('Failed to delete program');
            }
        } catch (error) {
            console.error('Error deleting program:', error);
        } finally {
            setDeletingProgram(false);
        }
    };

    // Delete Track
    const handleDeleteTrack = async () => {
        if (!trackToDelete) return;
        setDeletingTrack(true);

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/programs/tracks/${trackToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                await fetchAllTracks();
                setTrackToDelete(null);
            } else {
                alert('Failed to delete track');
            }
        } catch (error) {
            console.error('Error deleting track:', error);
        } finally {
            setDeletingTrack(false);
        }
    };

    // Filtered lists
    const normalizedProgramSearch = searchTerm.trim().toLowerCase();
    const visiblePrograms = normalizedProgramSearch
        ? programs.filter((program) =>
            program.nameTh.toLowerCase().includes(normalizedProgramSearch) ||
            program.code.toLowerCase().includes(normalizedProgramSearch)
        )
        : programs;

    const normalizedTrackSearch = trackSearchTerm.trim().toLowerCase();
    const visibleTracks = tracks.filter((t) => {
        const matchesProgram = selectedProgramFilter === 'ALL' || t.programId === selectedProgramFilter;
        if (!matchesProgram) return false;

        if (!normalizedTrackSearch) return true;
        const nameMatch = t.nameTh?.toLowerCase().includes(normalizedTrackSearch);
        const nameEnMatch = t.nameEn?.toLowerCase().includes(normalizedTrackSearch);
        const codeMatch = t.code?.toLowerCase().includes(normalizedTrackSearch);
        const progNameMatch = t.program?.nameTh?.toLowerCase().includes(normalizedTrackSearch);
        return nameMatch || nameEnMatch || codeMatch || progNameMatch;
    });

    const currentPage = meta?.page ?? page;
    const totalPages = normalizedProgramSearch ? 1 : (meta?.totalPages ?? 1);

    const degreeBadgeColor = (level: string) => {
        switch (level) {
            case 'BACHELOR': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'MASTER': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'PHD': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const degreeBadgeText = (level: string) => {
        switch (level) {
            case 'BACHELOR': return 'ปริญญาตรี';
            case 'MASTER': return 'ปริญญาโท';
            case 'PHD': return 'ปริญญาเอก';
            default: return level;
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-primary" /> จัดการหลักสูตรและแขนงวิชา
                    </h1>
                    <p className="opacity-70 text-sm">
                        ระบบจัดการหลักสูตรการศึกษาและแขนงวิชา/กลุ่มวิชาเอกเฉพาะทาง พร้อมระบบคลังภาพและโซเชียลมีเดียแยกเฉพาะ
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {activeTab === 'programs' ? (
                        <Button
                            onClick={() => router.push('/admin/programs/new')}
                            className="gap-2 bg-primary text-white shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            เพิ่มหลักสูตรใหม่
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                if (programs.length > 0) {
                                    setTargetProgramForNewTrack(programs[0].id);
                                    setIsAddTrackModalOpen(true);
                                } else {
                                    alert('กรุณาสร้างหลักสูตรหลักก่อนเพิ่มแขนงวิชา');
                                }
                            }}
                            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            เพิ่มแขนงวิชา/วิชาเอกใหม่
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border/80 gap-3">
                <button
                    onClick={() => setActiveTab('programs')}
                    className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'programs'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    <span>หลักสูตรสาขาวิชา (Programs)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold">
                        {programs.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('tracks')}
                    className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'tracks'
                            ? 'border-amber-600 text-amber-700'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Layers className="w-4 h-4" />
                    <span>แขนงวิชา / กลุ่มวิชาเอกทั้งหมด (Tracks & Majors)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 font-bold">
                        {tracks.length}
                    </span>
                </button>
            </div>

            {/* TAB 1: ACADEMIC PROGRAMS */}
            {activeTab === 'programs' && (
                <div className="space-y-4">
                    {/* Program Search & Filter */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative w-full md:w-80">
                            <Input
                                type="text"
                                placeholder="ค้นหาชื่อหลักสูตร หรือ รหัส..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                                <Search className="h-4 w-4" />
                            </span>
                        </div>
                    </div>

                    {/* Programs Table */}
                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                                        <tr>
                                            <th className="w-14 px-4 py-3 text-center font-medium">#</th>
                                            <th className="px-4 py-3 font-medium">รหัส / ชื่อหลักสูตร</th>
                                            <th className="px-4 py-3 font-medium">ระดับการศึกษา</th>
                                            <th className="px-4 py-3 font-medium text-center">แขนงวิชา/วิชาเอก</th>
                                            <th className="px-4 py-3 font-medium">สถานะการรับสมัคร</th>
                                            <th className="px-4 py-3 font-medium text-center">สถานะ</th>
                                            <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingPrograms ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                                                        <span>กำลังโหลดข้อมูลหลักสูตร...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : visiblePrograms.map((prog, index) => {
                                            const itemsPerPage = meta?.limit ?? (visiblePrograms.length || 1);
                                            const trackCount = getTrackCountForProgram(prog.id);
                                            return (
                                                <tr key={prog.id} className="border-b align-middle hover:bg-muted/20">
                                                    <td className="px-4 py-3 text-center text-muted-foreground">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-base text-scholar-deep">{prog.nameTh}</span>
                                                            <span className="text-xs text-muted-foreground font-mono">{prog.code}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${degreeBadgeColor(prog.degreeLevel)}`}>
                                                            <GraduationCap className="h-3.5 w-3.5" />
                                                            {degreeBadgeText(prog.degreeLevel)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {trackCount > 0 ? (
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedProgramFilter(prog.id);
                                                                    setActiveTab('tracks');
                                                                }}
                                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
                                                                title="คลิกเพื่อดูแขนงวิชาทั้งหมดของหลักสูตรนี้"
                                                            >
                                                                <Layers className="w-3 h-3 text-amber-600" />
                                                                {trackCount} แขนงวิชา
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-500 bg-slate-100 border border-slate-200">
                                                                หลักสูตรเดี่ยว
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-slate-700 bg-slate-100/80 px-2 py-1 rounded inline-block max-w-[200px] truncate" title={prog.admissionStatus || 'เปิดรับสมัครรอบปัจจุบัน'}>
                                                            {prog.admissionStatus || 'เปิดรับสมัครรอบปัจจุบัน'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${prog.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                            {prog.isActive ? 'เผยแพร่' : 'ซ่อน'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <Button
                                                                onClick={() => router.push(`/admin/programs/${prog.id}/tracks/new`)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-2 text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                                                                title="เพิ่มแขนงวิชาสำหรับหลักสูตรนี้"
                                                            >
                                                                <Plus className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                                                แขนง
                                                            </Button>
                                                            <Button
                                                                onClick={() => router.push(`/admin/programs/${prog.id}`)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-sky-600 hover:bg-sky-50"
                                                                title="แก้ไขข้อมูลหลักสูตร"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => setProgramToDelete(prog)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-red-50"
                                                                title="ลบหลักสูตร"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {!loadingPrograms && visiblePrograms.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                                                    ไม่พบข้อมูลหลักสูตรที่ตรงกับคำค้นหา
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {!normalizedProgramSearch && totalPages > 1 && (
                        <div className="flex justify-end mt-4">
                            <AdminPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: TRACKS & CONCENTRATIONS */}
            {activeTab === 'tracks' && (
                <div className="space-y-4">
                    {/* Tracks Search & Filter Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-lg border border-border/60">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    type="text"
                                    placeholder="ค้นหาแขนงวิชา หรือรหัส..."
                                    className="pl-9 h-9 text-xs"
                                    value={trackSearchTerm}
                                    onChange={(e) => setTrackSearchTerm(e.target.value)}
                                />
                                <span className="absolute left-2.5 top-2.5 text-muted-foreground">
                                    <Search className="h-4 w-4" />
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <select
                                    value={selectedProgramFilter}
                                    onChange={(e) => setSelectedProgramFilter(e.target.value)}
                                    className="h-9 px-2.5 rounded-md border text-xs bg-white text-slate-800"
                                >
                                    <option value="ALL">ทุกลักสูตรสาขาวิชา ({tracks.length})</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nameTh} ({p.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground font-medium">
                            แสดง {visibleTracks.length} จากทั้งหมด {tracks.length} แขนงวิชา
                        </div>
                    </div>

                    {/* Tracks Table */}
                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-amber-50/50 text-left text-muted-foreground">
                                        <tr>
                                            <th className="w-14 px-4 py-3 text-center font-medium">#</th>
                                            <th className="px-4 py-3 font-medium">ชื่อแขนงวิชา / วิชาเอก</th>
                                            <th className="px-4 py-3 font-medium">หลักสูตรสังกัด</th>
                                            <th className="px-4 py-3 font-medium">แผนการศึกษา</th>
                                            <th className="px-4 py-3 font-medium text-center">โซเชียลมีเดีย</th>
                                            <th className="px-4 py-3 font-medium">สถานะการรับสมัคร</th>
                                            <th className="px-4 py-3 font-medium text-center">สถานะ</th>
                                            <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingTracks ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                                                        <span>กำลังโหลดข้อมูลแขนงวิชา...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : visibleTracks.map((t, index) => {
                                            const hasFb = Boolean(t.socialLinks?.facebook);
                                            const hasTiktok = Boolean(t.socialLinks?.tiktok);
                                            const hasIg = Boolean(t.socialLinks?.instagram);
                                            const hasYt = Boolean(t.socialLinks?.youtube || t.youtubeVideoUrl);
                                            const hasLine = Boolean(t.socialLinks?.line);

                                            return (
                                                <tr key={t.id} className="border-b align-middle hover:bg-amber-50/10">
                                                    <td className="px-4 py-3 text-center text-muted-foreground">{index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-scholar-deep">{t.nameTh}</span>
                                                                {trackTypeBadge(t.trackType)}
                                                            </div>
                                                            {t.nameEn && (
                                                                <span className="text-xs text-muted-foreground italic">{t.nameEn}</span>
                                                            )}
                                                            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                                                /{t.program?.code}/{t.code}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-xs text-slate-800">
                                                                {t.program?.nameTh || '—'}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground font-mono">
                                                                รหัส: {t.program?.code}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {planBadge(t.studyPlanType)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {hasFb && <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold" title="Facebook">f</span>}
                                                            {hasTiktok && <span className="w-5 h-5 rounded bg-black text-white flex items-center justify-center text-[9px] font-bold" title="TikTok">TT</span>}
                                                            {hasIg && <span className="w-5 h-5 rounded bg-pink-600 text-white flex items-center justify-center text-[9px] font-bold" title="Instagram">IG</span>}
                                                            {hasYt && <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold" title="YouTube">YT</span>}
                                                            {hasLine && <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold" title="Line">L</span>}
                                                            {!hasFb && !hasTiktok && !hasIg && !hasYt && !hasLine && (
                                                                <span className="text-xs text-muted-foreground">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-slate-700 bg-amber-50 px-2 py-1 rounded inline-block max-w-[180px] truncate border border-amber-200">
                                                            {t.admissionStatus || t.program?.admissionStatus || 'เปิดรับสมัครรอบปัจจุบัน'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${t.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                            {t.isActive ? 'เผยแพร่' : 'ซ่อน'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            {t.program?.code && t.code && (
                                                                <a
                                                                    href={`/programs/${t.program.code}/${t.code}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="h-8 w-8 inline-flex items-center justify-center rounded-md text-scholar-deep hover:bg-slate-100 transition-colors"
                                                                    title="ดูหน้าเว็บไซต์จริง"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                            <Button
                                                                onClick={() => router.push(`/admin/programs/${t.programId}/tracks/${t.id}`)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-amber-700 hover:bg-amber-100"
                                                                title="แก้ไขข้อมูลแขนงวิชา"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => setTrackToDelete(t)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-red-50"
                                                                title="ลบแขนงวิชานี้"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {!loadingTracks && visibleTracks.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                                                    {tracks.length === 0 ? (
                                                        <div className="space-y-3">
                                                            <Layers className="w-10 h-10 text-muted-foreground/50 mx-auto" />
                                                            <p>ยังไม่มีข้อมูลแขนงวิชาหรือกลุ่มวิชาเอกในระบบ</p>
                                                            <Button
                                                                onClick={() => {
                                                                    if (programs.length > 0) {
                                                                        setTargetProgramForNewTrack(programs[0].id);
                                                                        setIsAddTrackModalOpen(true);
                                                                    }
                                                                }}
                                                                size="sm"
                                                                className="bg-amber-600 text-white"
                                                            >
                                                                <Plus className="w-4 h-4 mr-1" /> สร้างแขนงวิชาแรก
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        'ไม่พบแขนงวิชาที่ตรงกับเงื่อนไขการค้นหา'
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* MODAL: SELECT PROGRAM TO ADD TRACK */}
            <Dialog open={isAddTrackModalOpen} onOpenChange={setIsAddTrackModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-amber-600" />
                            เพิ่มแขนงวิชา / กลุ่มวิชาเอกใหม่
                        </DialogTitle>
                        <DialogDescription>
                            กรุณาเลือกหลักสูตรหลักที่ต้องการเพิ่มแขนงวิชาหรือกลุ่มวิชาเอกนี้เข้าไป
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <label className="text-sm font-semibold text-scholar-deep">เลือกหลักสูตรสาขาวิชา</label>
                        <select
                            className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                            value={targetProgramForNewTrack}
                            onChange={(e) => setTargetProgramForNewTrack(e.target.value)}
                        >
                            {programs.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nameTh} ({p.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsAddTrackModalOpen(false)}>
                            ยกเลิก
                        </Button>
                        <Button 
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => {
                                if (targetProgramForNewTrack) {
                                    setIsAddTrackModalOpen(false);
                                    router.push(`/admin/programs/${targetProgramForNewTrack}/tracks/new`);
                                }
                            }}
                        >
                            ดำเนินการต่อ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: DELETE PROGRAM CONFIRMATION */}
            <Dialog open={!!programToDelete} onOpenChange={(open) => !open && setProgramToDelete(null)}>
                <DialogContent>
                    <DialogHeader className="items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <DialogTitle>ยืนยันการลบหลักสูตร?</DialogTitle>
                        <DialogDescription>
                            ต้องการลบหลักสูตร <strong>{programToDelete?.nameTh}</strong> หรือไม่? <br/>ข้อมูลที่เกี่ยวข้อง รวมถึงอาจารย์ประจำหลักสูตรจะถูกลบทั้งหมด
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 sm:justify-center">
                        <Button variant="ghost" onClick={() => setProgramToDelete(null)} disabled={deletingProgram}>
                            ยกเลิก
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProgram} disabled={deletingProgram}>
                            {deletingProgram ? 'กำลังลบ...' : 'ยืนยันการลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: DELETE TRACK CONFIRMATION */}
            <Dialog open={!!trackToDelete} onOpenChange={(open) => !open && setTrackToDelete(null)}>
                <DialogContent>
                    <DialogHeader className="items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <DialogTitle>ยืนยันการลบแขนงวิชา / กลุ่มวิชาเอก?</DialogTitle>
                        <DialogDescription>
                            ต้องการลบแขนงวิชา <strong>{trackToDelete?.nameTh}</strong> (รหัส: {trackToDelete?.code}) หรือไม่? <br/>
                            ข้อมูลสื่อ รูปภาพกิจกรรม และลิงก์โซเชียลมีเดียของแขนงนี้จะถูกลบออกจากระบบ
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 sm:justify-center">
                        <Button variant="ghost" onClick={() => setTrackToDelete(null)} disabled={deletingTrack}>
                            ยกเลิก
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTrack} disabled={deletingTrack}>
                            {deletingTrack ? 'กำลังลบ...' : 'ยืนยันการลบแขนงวิชา'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
