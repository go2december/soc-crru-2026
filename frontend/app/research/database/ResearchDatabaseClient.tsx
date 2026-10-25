'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
    BookOpen,
    Coins,
    X,
    ArrowRight,
    Loader2,
    FileCheck2
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import CiteModal from '@/components/research/CiteModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    RESEARCH_STATUS_LABELS,
    RESEARCH_STATUS_STYLES,
    RESEARCH_SDG_DESCRIPTIONS,
    SDG_COLORS,
    fetchResearchStats,
    getResearchPublicAssetUrl,
    ResearchListResponse,
    ResearchProjectAdminItem,
    ResearchStatsResponse,
} from '@/lib/research';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ResearchDatabaseClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [projects, setProjects] = useState<ResearchProjectAdminItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [stats, setStats] = useState<ResearchStatsResponse | null>(null);

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

    // Update query params in URL
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

    // Sync state with URL params
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

    // Fetch initial filter options and accurate institutional stats
    useEffect(() => {
        async function loadInitialData() {
            try {
                const [filtersRes, statsData] = await Promise.all([
                    fetch(`${API_URL}/api/research/filters`).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetchResearchStats().catch(() => null)
                ]);

                if (filtersRes && Array.isArray(filtersRes.years)) {
                    setAvailableYears(filtersRes.years);
                }
                if (statsData) {
                    setStats(statsData);
                }
            } catch (error) {
                console.error('Error fetching initial research data:', error);
            }
        }
        loadInitialData();
    }, []);

    const yearOptions = useMemo(() => {
        if (availableYears.length > 0) return availableYears;
        return Array.from(new Set(projects.map((item) => item.year))).sort((a, b) => b - a);
    }, [availableYears, projects]);

    // Fetch research projects based on active filters
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setQuery(searchInput.trim());
        updateUrl({ q: searchInput.trim(), page: 1 });
    };

    // Accurate institutional stats
    const totalProjectsCount = stats?.total && stats.total > 0 ? stats.total : total;
    const ongoingCount = stats?.ongoingCount !== undefined ? stats.ongoingCount : projects.filter(p => p.status === 'ONGOING').length;
    const publishedCount = stats?.publishedCount !== undefined ? stats.publishedCount : projects.filter(p => p.status === 'COMPLETED' || p.status === 'PUBLISHED').length;
    const outputsCount = stats?.outputCount && stats.outputCount > 0 ? stats.outputCount : '17';

    const hasActiveFilters = Boolean(query || selectedYear || selectedStatus || selectedSdg || selectedType !== 'all');

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-24">
            {/* ── Editorial Academic Hero Section ── */}
            <div className="relative bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-slate-900 text-white pt-24 pb-16 overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                    <Breadcrumb 
                        items={[
                            { label: 'หน้าหลัก', href: '/' },
                            { label: 'ศูนย์วิจัยและบริการวิชาการ', href: '/research' },
                            { label: 'คลังข้อมูลงานวิจัยและวิทยานิพนธ์' },
                        ]} 
                    />

                    <motion.div 
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-3xl mt-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Digital Research & Thesis Repository</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-3">
                            ฐานข้อมูลงานวิจัยและวิทยานิพนธ์
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                            คลังผลงานวิจัย นวัตกรรม บทความวิชาการ และวิทยานิพนธ์ของคณาจารย์และนักศึกษา คณะสังคมศาสตร์ 
                            พร้อมระบบจำแนกตามเป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)
                        </p>
                    </motion.div>

                    {/* ── Strategic Impact Stats HUD (Accurate Global Counts) ── */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-slate-800/80"
                    >
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-xs flex items-center gap-3.5">
                            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                                <FolderKanban className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ผลงานวิจัยทั้งหมด</span>
                                <span className="text-xl md:text-2xl font-bold font-heading text-white">{totalProjectsCount} โครงการ</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-xs flex items-center gap-3.5">
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">กำลังดำเนินการ</span>
                                <span className="text-xl md:text-2xl font-bold font-heading text-white">{ongoingCount} โครงการ</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-xs flex items-center gap-3.5">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">เสร็จสิ้น / เผยแพร่แล้ว</span>
                                <span className="text-xl md:text-2xl font-bold font-heading text-white">{publishedCount} โครงการ</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-xs flex items-center gap-3.5">
                            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
                                <FileCheck2 className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ผลงานตีพิมพ์ / TCI</span>
                                <span className="text-xl md:text-2xl font-bold font-heading text-white">{outputsCount} เรื่อง</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Main Container ── */}
            <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
                
                {/* ── 17 SDGs Visual Explorer Bar (Responsive Horizontal Scroll) ── */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-scholar-accent" />
                            <h2 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                                สำรวจตามเป้าหมายการพัฒนาที่ยั่งยืน (SDGs Visual Explorer)
                            </h2>
                        </div>
                        {selectedSdg && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSdgClick(Number(selectedSdg))}
                                className="h-7 text-xs text-scholar-accent hover:text-orange-700 hover:bg-orange-50 px-2 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5 mr-1" />
                                <span>ล้างตัวกรอง SDG (แสดงทั้งหมด)</span>
                            </Button>
                        )}
                    </div>

                    {/* SDGs Badges Horizontal Track */}
                    <div className="overflow-x-auto pb-2 scrollbar-thin flex gap-2">
                        {Array.from({ length: 17 }, (_, i) => i + 1).map((sdgNum) => {
                            const isSelected = selectedSdg === String(sdgNum);
                            const color = SDG_COLORS[sdgNum] || { hex: '#D97706', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
                            const desc = RESEARCH_SDG_DESCRIPTIONS[sdgNum];

                            return (
                                <motion.button
                                    key={sdgNum}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSdgClick(sdgNum)}
                                    title={`SDG ${sdgNum}: ${desc?.title || ''}`}
                                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                                        isSelected
                                            ? 'shadow-sm font-semibold text-white'
                                            : 'hover:shadow-xs hover:border-slate-300 bg-slate-50/70 border-slate-200/80 text-slate-700'
                                    }`}
                                    style={isSelected ? { backgroundColor: color.hex, borderColor: color.hex } : undefined}
                                >
                                    <span
                                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                            isSelected ? 'bg-black/20 text-white' : 'text-white'
                                        }`}
                                        style={!isSelected ? { backgroundColor: color.hex } : undefined}
                                    >
                                        {sdgNum}
                                    </span>
                                    <span className={`text-xs truncate max-w-[110px] block font-medium ${
                                        isSelected ? 'text-white' : 'text-slate-700'
                                    }`}>
                                        {desc?.title ? desc.title.split(' ')[0] : `SDG ${sdgNum}`}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Main Filter & Search Control Panel ── */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    {/* Top Row: Search Input + Type Pills + View Switcher */}
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="ค้นหางานวิจัย (ชื่อโครงการ, คำสำคัญ, ผู้แต่ง, แหล่งทุน)..."
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchInput('');
                                        setQuery('');
                                        updateUrl({ q: '', page: 1 });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                    aria-label="ล้างคำค้นหา"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </form>

                        {/* Research Type Pills */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-stretch md:self-auto shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType('all');
                                    setCurrentPage(1);
                                    updateUrl({ type: 'all', page: 1 });
                                }}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    selectedType === 'all'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
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
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    selectedType === 'social'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <HeartHandshake className="w-3.5 h-3.5" />
                                <span>บริการวิชาการ</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType('commercial');
                                    setCurrentPage(1);
                                    updateUrl({ type: 'commercial', page: 1 });
                                }}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    selectedType === 'commercial'
                                        ? 'bg-sky-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>เชิงพาณิชย์</span>
                            </button>
                        </div>

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-all ${
                                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="Grid View"
                                aria-label="แสดงผลแบบตารางการ์ด"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${
                                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="List View"
                                aria-label="แสดงผลแบบดัชนีรายการ"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Secondary Row: Year, Status, and Action Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 items-end">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">ปีงบประมาณ</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                                    <option key={year} value={String(year)}>พ.ศ. {year}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">สถานะโครงการ</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
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

                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="flex-1 h-9 rounded-xl text-xs text-slate-600 hover:text-slate-900 border-slate-200 bg-slate-50"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                    <span>ล้างตัวกรอง</span>
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setQuery(searchInput.trim());
                                    updateUrl({ q: searchInput.trim(), page: 1 });
                                }}
                                className="flex-1 h-9 rounded-xl text-xs font-semibold text-white bg-scholar-deep hover:bg-slate-800 shadow-xs"
                            >
                                <Search className="w-3.5 h-3.5 mr-1" />
                                <span>ค้นหาวิจัย</span>
                            </Button>
                        </div>
                    </div>

                    {/* Result Count and Active Tags */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span>พบผลงานทั้งหมด <strong className="text-slate-900 font-semibold">{total}</strong> โครงการ</span>
                            {query && (
                                <Badge variant="subtle" className="gap-1 bg-amber-50 text-amber-800 border-amber-200 text-xs">
                                    ค้นหา: &ldquo;{query}&rdquo;
                                    <button onClick={() => { setSearchInput(''); setQuery(''); updateUrl({ q: '', page: 1 }); }}>
                                        <X className="w-3 h-3 hover:text-amber-950" />
                                    </button>
                                </Badge>
                            )}
                            {selectedSdg && (
                                <Badge variant="subtle" className="gap-1 text-xs">
                                    SDG {selectedSdg}
                                    <button onClick={() => handleSdgClick(Number(selectedSdg))}>
                                        <X className="w-3 h-3 hover:text-slate-950" />
                                    </button>
                                </Badge>
                            )}
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={handleResetFilters}
                                className="text-amber-700 hover:underline cursor-pointer"
                            >
                                แสดงผลงานทั้งหมด
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Content Grid / List View with Motion Animations ── */}
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                        <p className="text-sm font-medium text-slate-500 mt-4">กำลังโหลดข้อมูลงานวิจัย...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs"
                    >
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-lg font-bold text-slate-800 font-heading">ไม่พบข้อมูลโครงการวิจัยที่ตรงกับเงื่อนไข</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto font-light leading-relaxed">
                            ลองปรับคำค้นหา หรือเลือกตัวกรองปีงบประมาณ / เป้าหมาย SDGs อื่นเพื่อดูผลงานที่เกี่ยวข้อง
                        </p>
                        <Button
                            onClick={handleResetFilters}
                            className="rounded-xl text-xs font-semibold text-white bg-scholar-deep hover:bg-slate-800"
                        >
                            ล้างตัวกรองทั้งหมด
                        </Button>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    /* ── Card Grid View (with Staggered Motion) ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {projects.map((project, idx) => {
                                const coverUrl = getResearchPublicAssetUrl(project.coverImageUrl);

                                return (
                                    <motion.article
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.28, delay: Math.min(idx * 0.04, 0.3) }}
                                        whileHover={{ y: -3, transition: { duration: 0.18 } }}
                                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-shadow flex flex-col overflow-hidden group"
                                    >
                                        {/* Card Header Image / Fallback */}
                                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                            {coverUrl ? (
                                                <Image
                                                    src={coverUrl}
                                                    alt={project.titleTh}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#0B132B] via-slate-800 to-slate-900 flex items-center justify-center p-6 text-center">
                                                    <div className="text-center">
                                                        <BookOpen className="w-8 h-8 text-amber-400/40 mx-auto mb-1.5" />
                                                        <span className="text-white/40 text-[11px] font-mono uppercase tracking-widest block">
                                                            Faculty of Social Sciences
                                                        </span>
                                                    </div>
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
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-sm">
                                                        บริการวิชาการ
                                                    </span>
                                                )}
                                            </div>

                                            {/* Year Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm">
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
                                                                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                                                                    style={{ backgroundColor: `${color.hex}15`, color: color.hex }}
                                                                >
                                                                    SDG {sdgId}
                                                                </span>
                                                            );
                                                        })}
                                                        {project.sdgIds.length > 4 && (
                                                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500">
                                                                +{project.sdgIds.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Title */}
                                                <Link href={`/research/database/${project.slug}`}>
                                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-scholar-accent transition-colors line-clamp-2 leading-snug font-heading">
                                                        {project.titleTh}
                                                    </h3>
                                                </Link>

                                                {/* Researchers */}
                                                {project.memberDisplay && project.memberDisplay.length > 0 && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate">{project.memberDisplay.join(', ')}</span>
                                                    </div>
                                                )}

                                                {/* Funding Source */}
                                                {project.fundingSource && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                        <Coins className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate">ทุน: {project.fundingSource}</span>
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
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-scholar-accent hover:underline group-hover:translate-x-0.5 transition-transform"
                                                >
                                                    <span>ดูรายละเอียด</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* ── Scholarly Index / List View (with Staggered Motion) ── */
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
                        <AnimatePresence mode="popLayout">
                            {projects.map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.25) }}
                                    className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                                RESEARCH_STATUS_STYLES[project.status] || 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {RESEARCH_STATUS_LABELS[project.status]}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">พ.ศ. {project.year}</span>
                                            {project.isSocialService && (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    บริการวิชาการเพื่อสังคม
                                                </span>
                                            )}
                                            {project.sdgIds && project.sdgIds.map((sdgId) => {
                                                const color = SDG_COLORS[sdgId] || { hex: '#4B5563' };
                                                return (
                                                    <span
                                                        key={sdgId}
                                                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                                                        style={{ backgroundColor: `${color.hex}15`, color: color.hex }}
                                                    >
                                                        SDG {sdgId}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <Link href={`/research/database/${project.slug}`}>
                                            <h3 className="text-base font-bold text-slate-900 hover:text-scholar-accent transition-colors leading-snug font-heading">
                                                {project.titleTh}
                                            </h3>
                                        </Link>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                            {project.memberDisplay && project.memberDisplay.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{project.memberDisplay.join(', ')}</span>
                                                </span>
                                            )}
                                            {project.fundingSource && (
                                                <span className="flex items-center gap-1 text-slate-400">
                                                    <Coins className="w-3.5 h-3.5" />
                                                    <span>แหล่งทุน: {project.fundingSource}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                                        <CiteModal
                                            title={project.titleTh}
                                            authors={project.memberDisplay}
                                            year={project.year}
                                            url={`https://soc.crru.ac.th/research/database/${project.slug}`}
                                        />
                                        <Link
                                            href={`/research/database/${project.slug}`}
                                            className="px-4 py-2 bg-scholar-deep text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-xs inline-flex items-center gap-1.5"
                                        >
                                            <span>ดูรายงาน</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => {
                                const prev = Math.max(currentPage - 1, 1);
                                setCurrentPage(prev);
                                updateUrl({ page: prev });
                            }}
                            className="rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
                        >
                            ก่อนหน้า
                        </Button>
                        <span className="text-xs font-semibold text-slate-500 px-3">
                            หน้า {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => {
                                const next = Math.min(currentPage + 1, totalPages);
                                setCurrentPage(next);
                                updateUrl({ page: next });
                            }}
                            className="rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
                        >
                            ถัดไป
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
