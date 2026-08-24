"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
    Search, 
    RotateCcw, 
    LayoutGrid, 
    List, 
    Users, 
    ExternalLink, 
    Sparkles, 
    HeartHandshake, 
    TrendingUp, 
    CheckCircle2, 
    Clock, 
    FolderKanban,
    Globe2,
    BookOpen
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import CiteModal from '@/components/research/CiteModal';
import {
    RESEARCH_STATUS_LABELS,
    RESEARCH_STATUS_STYLES,
    RESEARCH_SDG_DESCRIPTIONS,
    SDG_COLORS,
    ResearchListResponse,
    ResearchProjectAdminItem,
} from '@/lib/research';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ResearchDatabaseClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [projects, setProjects] = useState<ResearchProjectAdminItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [searchInput, setSearchInput] = useState(() => searchParams.get('q') || '');
    const [query, setQuery] = useState(() => searchParams.get('q') || '');
    const [selectedYear, setSelectedYear] = useState(() => searchParams.get('year') || '');
    const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || '');
    const [selectedSdg, setSelectedSdg] = useState(() => searchParams.get('sdg') || '');
    const [selectedType, setSelectedType] = useState<'all' | 'social' | 'commercial'>(() => {
        const type = searchParams.get('type');
        return type === 'social' || type === 'commercial' ? type : 'all';
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [currentPage, setCurrentPage] = useState(() => {
        const page = Number(searchParams.get('page') || '1');
        return Number.isNaN(page) || page < 1 ? 1 : page;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const updateUrl = useCallback((next: {
        q?: string;
        year?: string;
        status?: string;
        sdg?: string;
        type?: string;
        page?: number;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (next.q !== undefined) {
            if (next.q) params.set('q', next.q);
            else params.delete('q');
        }
        if (next.year !== undefined) {
            if (next.year) params.set('year', next.year);
            else params.delete('year');
        }
        if (next.status !== undefined) {
            if (next.status) params.set('status', next.status);
            else params.delete('status');
        }
        if (next.sdg !== undefined) {
            if (next.sdg) params.set('sdg', next.sdg);
            else params.delete('sdg');
        }
        if (next.type !== undefined) {
            if (next.type && next.type !== 'all') params.set('type', next.type);
            else params.delete('type');
        }
        if (next.page !== undefined) {
            if (next.page > 1) params.set('page', String(next.page));
            else params.delete('page');
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    useEffect(() => {
        const nextQuery = searchParams.get('q') || '';
        const nextYear = searchParams.get('year') || '';
        const nextStatus = searchParams.get('status') || '';
        const nextSdg = searchParams.get('sdg') || '';
        const nextType = searchParams.get('type');
        const nextPageRaw = Number(searchParams.get('page') || '1');
        const nextPage = Number.isNaN(nextPageRaw) || nextPageRaw < 1 ? 1 : nextPageRaw;

        setSearchInput(nextQuery);
        setQuery(nextQuery);
        setSelectedYear(nextYear);
        setSelectedStatus(nextStatus);
        setSelectedSdg(nextSdg);
        setSelectedType(nextType === 'social' || nextType === 'commercial' ? nextType : 'all');
        setCurrentPage(nextPage);
    }, [searchParams]);

    useEffect(() => {
        async function fetchFilters() {
            try {
                const res = await fetch(`${API_URL}/api/research/filters`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.years)) {
                        setAvailableYears(data.years);
                    }
                }
            } catch (error) {
                console.error('Error fetching research filters:', error);
            }
        }
        fetchFilters();
    }, []);

    const yearOptions = useMemo(() => {
        if (availableYears.length > 0) return availableYears;
        return Array.from(new Set(projects.map((item) => item.year))).sort((a, b) => b - a);
    }, [availableYears, projects]);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: viewMode === 'list' ? '12' : '9',
            });

            if (query.trim()) params.set('q', query.trim());
            if (selectedYear) params.set('year', selectedYear);
            if (selectedStatus) params.set('status', selectedStatus);
            if (selectedSdg) params.set('sdg', selectedSdg);
            if (selectedType === 'social') params.set('isSocialService', 'true');
            if (selectedType === 'commercial') params.set('isCommercial', 'true');

            const res = await fetch(`${API_URL}/api/research/projects?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch research projects');
            }

            const data = (await res.json()) as ResearchListResponse;
            setProjects(data.data || []);
            setTotalPages(data.meta?.totalPages || 1);
            setTotal(data.meta?.total || 0);
        } catch (error) {
            console.error(error);
            setProjects([]);
            setTotalPages(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, query, selectedSdg, selectedStatus, selectedType, selectedYear, viewMode]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleResetFilters = () => {
        setSearchInput('');
        setQuery('');
        setSelectedYear('');
        setSelectedStatus('');
        setSelectedSdg('');
        setSelectedType('all');
        setCurrentPage(1);
        updateUrl({ q: '', year: '', status: '', sdg: '', type: 'all', page: 1 });
    };

    const handleSdgClick = (sdgNum: number) => {
        const sdgStr = String(sdgNum);
        const nextVal = selectedSdg === sdgStr ? '' : sdgStr;
        setSelectedSdg(nextVal);
        setCurrentPage(1);
        updateUrl({ sdg: nextVal, page: 1 });
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-20">
            {/* ── Banner / Hero Section ── */}
            <div className="relative h-[280px] md:h-[320px] w-full bg-scholar-deep overflow-hidden">
                <Image
                    src="/images/research-banner.png"
                    alt="Research Banner"
                    fill
                    className="object-cover opacity-25"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scholar-accent/20 border border-scholar-accent/30 text-white text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-scholar-accent" />
                        Research & SDGs Repository
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        ฐานข้อมูลงานวิจัยและวิทยานิพนธ์
                    </h1>
                    <p className="text-slate-200 text-sm md:text-base max-w-2xl font-light">
                        คลังผลงานวิจัย นวัตกรรม และบริการวิชาการเพื่อการพัฒนาสังคมและยกระดับคุณภาพชีวิตในพื้นที่จังหวัดเชียงราย
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-10 relative z-10 max-w-7xl space-y-6">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'ฐานข้อมูลงานวิจัย' }]} />

                {/* ── Strategic Impact Stats HUD ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-scholar-deep/10 text-scholar-deep rounded-lg">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ผลงานวิจัยทั้งหมด</span>
                            <span className="text-xl md:text-2xl font-extrabold text-slate-800">{total} โครงการ</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">กำลังดำเนินการ</span>
                            <span className="text-xl md:text-2xl font-extrabold text-slate-800">
                                {projects.filter(p => p.status === 'ONGOING').length} โครงการ
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">เสร็จสิ้น / เผยแพร่</span>
                            <span className="text-xl md:text-2xl font-extrabold text-slate-800">
                                {projects.filter(p => p.status === 'COMPLETED' || p.status === 'PUBLISHED').length} โครงการ
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Globe2 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">เป้าหมาย SDGs</span>
                            <span className="text-xl md:text-2xl font-extrabold text-slate-800">17 เป้าหมาย</span>
                        </div>
                    </div>
                </div>

                {/* ── 17 SDGs Visual Explorer Bar ── */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-scholar-accent" />
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                สำรวจตามเป้าหมายการพัฒนาที่ยั่งยืน (SDGs Visual Explorer)
                            </h2>
                        </div>
                        {selectedSdg && (
                            <button
                                onClick={() => handleSdgClick(Number(selectedSdg))}
                                className="text-xs font-bold text-scholar-accent hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                ล้างเป้าหมาย (ดูทั้งหมด)
                            </button>
                        )}
                    </div>

                    {/* SDGs Badges Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-17 gap-1.5 pt-1">
                        {Array.from({ length: 17 }, (_, i) => i + 1).map((sdgNum) => {
                            const isSelected = selectedSdg === String(sdgNum);
                            const color = SDG_COLORS[sdgNum] || { hex: '#4B5563', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
                            const desc = RESEARCH_SDG_DESCRIPTIONS[sdgNum];

                            return (
                                <button
                                    key={sdgNum}
                                    type="button"
                                    onClick={() => handleSdgClick(sdgNum)}
                                    title={`SDG ${sdgNum}: ${desc?.title || ''}`}
                                    className={`relative group flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer border ${
                                        isSelected
                                            ? 'ring-2 ring-offset-2 ring-slate-900 shadow-md font-bold text-white'
                                            : 'hover:shadow-sm hover:scale-105 bg-slate-50/80 border-slate-200/70 text-slate-700'
                                    }`}
                                    style={isSelected ? { backgroundColor: color.hex, borderColor: color.hex } : undefined}
                                >
                                    <span
                                        className={`text-[10px] font-black uppercase ${
                                            isSelected ? 'text-white' : ''
                                        }`}
                                        style={!isSelected ? { color: color.hex } : undefined}
                                    >
                                        SDG {sdgNum}
                                    </span>
                                    <span className={`text-[9px] truncate max-w-full block font-medium mt-0.5 ${
                                        isSelected ? 'text-white/90' : 'text-slate-500'
                                    }`}>
                                        {desc?.title ? desc.title.split(' ')[0] : `SDG ${sdgNum}`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Main Filter & Search Control Bar ── */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    {/* Search & View Switcher */}
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="ค้นหางานวิจัย (ชื่อโครงการ, คำสำคัญ, ชื่ออาจารย์/นักวิจัย)..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-scholar-deep/20 focus:border-scholar-deep focus:bg-white transition-all"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setCurrentPage(1);
                                        setQuery(searchInput);
                                        updateUrl({ q: searchInput, page: 1 });
                                    }
                                }}
                            />
                        </div>

                        {/* Research Type Pills */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-stretch md:self-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType('all');
                                    setCurrentPage(1);
                                    updateUrl({ type: 'all', page: 1 });
                                }}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    selectedType === 'all'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType('social');
                                    setCurrentPage(1);
                                    updateUrl({ type: 'social', page: 1 });
                                }}
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    selectedType === 'social'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <HeartHandshake className="w-3.5 h-3.5" />
                                <span>รับใช้สังคม</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType('commercial');
                                    setCurrentPage(1);
                                    updateUrl({ type: 'commercial', page: 1 });
                                }}
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    selectedType === 'commercial'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>เชิงพาณิชย์</span>
                            </button>
                        </div>

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-all ${
                                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${
                                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Secondary Filters Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">ปีงบประมาณ</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-scholar-deep"
                                value={selectedYear}
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setSelectedYear(nextValue);
                                    setCurrentPage(1);
                                    updateUrl({ year: nextValue, page: 1 });
                                }}
                            >
                                <option value="">ทุกปีงบประมาณ</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={String(year)}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">สถานะโครงการ</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-scholar-deep"
                                value={selectedStatus}
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setSelectedStatus(nextValue);
                                    setCurrentPage(1);
                                    updateUrl({ status: nextValue, page: 1 });
                                }}
                            >
                                <option value="">ทุกสถานะ</option>
                                {Object.entries(RESEARCH_STATUS_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="flex-1 py-2 px-3 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>ล้างตัวกรอง</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setQuery(searchInput);
                                    updateUrl({ q: searchInput, page: 1 });
                                }}
                                className="flex-1 py-2 px-4 text-xs font-bold text-white bg-scholar-deep hover:bg-opacity-90 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>ค้นหา</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Content Grid / List View ── */}
                {loading ? (
                    <div className="py-20 text-center">
                        <span className="loading loading-spinner loading-lg text-scholar-deep"></span>
                        <p className="text-sm font-medium text-slate-400 mt-4">กำลังโหลดข้อมูลงานวิจัย...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-lg font-bold text-slate-800">ไม่พบข้อมูลโครงการวิจัยที่ตรงกับเงื่อนไข</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            ลองปรับคำค้นหา หรือเลือกตัวกรองปีงบประมาณ / เป้าหมาย SDGs อื่น
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="px-5 py-2 text-xs font-bold text-white bg-scholar-deep rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
                        >
                            ล้างตัวกรองทั้งหมด
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* ── Card Grid View ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <article
                                key={project.id}
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-scholar-accent/40 transition-all duration-300 flex flex-col overflow-hidden group"
                            >
                                {/* Card Header Image / Placeholder */}
                                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                    {project.coverImageUrl ? (
                                        <Image
                                            src={project.coverImageUrl}
                                            alt={project.titleTh}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-scholar-deep/90 via-slate-800 to-slate-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-white/30 text-xs font-mono uppercase tracking-widest">Faculty of Social Sciences</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${
                                            RESEARCH_STATUS_STYLES[project.status] || 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {RESEARCH_STATUS_LABELS[project.status]}
                                        </span>
                                        {project.isSocialService && (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
                                                รับใช้สังคม
                                            </span>
                                        )}
                                        {project.isCommercial && (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/90 text-white backdrop-blur-sm">
                                                เชิงพาณิชย์
                                            </span>
                                        )}
                                    </div>

                                    {/* Year Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-sm">
                                            พ.ศ. {project.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        {/* SDGs Badges */}
                                        {project.sdgIds && project.sdgIds.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.sdgIds.slice(0, 4).map((sdgId) => {
                                                    const color = SDG_COLORS[sdgId] || { hex: '#4B5563', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
                                                    return (
                                                        <span
                                                            key={sdgId}
                                                            className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                                            style={{ backgroundColor: `${color.hex}15`, color: color.hex }}
                                                        >
                                                            SDG {sdgId}
                                                        </span>
                                                    );
                                                })}
                                                {project.sdgIds.length > 4 && (
                                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                                                        +{project.sdgIds.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <Link href={`/research/database/${project.slug}`}>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-scholar-accent transition-colors line-clamp-2 leading-snug">
                                                {project.titleTh}
                                            </h3>
                                        </Link>

                                        {/* Researchers */}
                                        {project.memberDisplay && project.memberDisplay.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{project.memberDisplay.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <CiteModal
                                            title={project.titleTh}
                                            authors={project.memberDisplay}
                                            year={project.year}
                                            url={`https://soc.crru.ac.th/research/database/${project.slug}`}
                                        />
                                        <Link
                                            href={`/research/database/${project.slug}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-scholar-deep hover:text-scholar-accent transition-colors group-hover:translate-x-0.5"
                                        >
                                            <span>ดูรายละเอียด</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    /* ── Academic List / Table View ── */
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                            RESEARCH_STATUS_STYLES[project.status] || 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {RESEARCH_STATUS_LABELS[project.status]}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">พ.ศ. {project.year}</span>
                                        {project.sdgIds && project.sdgIds.map((sdgId) => {
                                            const color = SDG_COLORS[sdgId] || { hex: '#4B5563' };
                                            return (
                                                <span
                                                    key={sdgId}
                                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                                    style={{ backgroundColor: `${color.hex}15`, color: color.hex }}
                                                >
                                                    SDG {sdgId}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <Link href={`/research/database/${project.slug}`}>
                                        <h3 className="text-base font-bold text-slate-900 hover:text-scholar-accent transition-colors leading-snug">
                                            {project.titleTh}
                                        </h3>
                                    </Link>

                                    {project.memberDisplay && project.memberDisplay.length > 0 && (
                                        <p className="text-xs text-slate-500 font-medium">
                                            คณะผู้วิจัย: {project.memberDisplay.join(', ')}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                                    <CiteModal
                                        title={project.titleTh}
                                        authors={project.memberDisplay}
                                        year={project.year}
                                        url={`https://soc.crru.ac.th/research/database/${project.slug}`}
                                    />
                                    <Link
                                        href={`/research/database/${project.slug}`}
                                        className="px-4 py-2 bg-scholar-deep text-white text-xs font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm inline-flex items-center gap-1"
                                    >
                                        <span>ดูรายงาน</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => {
                                const prev = Math.max(currentPage - 1, 1);
                                setCurrentPage(prev);
                                updateUrl({ page: prev });
                            }}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            ก่อนหน้า
                        </button>
                        <span className="text-xs font-bold text-slate-500 px-3">
                            หน้า {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => {
                                const next = Math.min(currentPage + 1, totalPages);
                                setCurrentPage(next);
                                updateUrl({ page: next });
                            }}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            ถัดไป
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
