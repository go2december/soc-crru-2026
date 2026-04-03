"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import {
    RESEARCH_STATUS_LABELS,
    RESEARCH_STATUS_STYLES,
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
    const [searchInput, setSearchInput] = useState(() => searchParams.get('q') || '');
    const [query, setQuery] = useState(() => searchParams.get('q') || '');
    const [selectedYear, setSelectedYear] = useState(() => searchParams.get('year') || '');
    const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || '');
    const [selectedSdg, setSelectedSdg] = useState(() => searchParams.get('sdg') || '');
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
        page?: number;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (next.q !== undefined) {
            if (next.q) {
                params.set('q', next.q);
            } else {
                params.delete('q');
            }
        }
        if (next.year !== undefined) {
            if (next.year) {
                params.set('year', next.year);
            } else {
                params.delete('year');
            }
        }
        if (next.status !== undefined) {
            if (next.status) {
                params.set('status', next.status);
            } else {
                params.delete('status');
            }
        }
        if (next.sdg !== undefined) {
            if (next.sdg) {
                params.set('sdg', next.sdg);
            } else {
                params.delete('sdg');
            }
        }
        if (next.page !== undefined) {
            if (next.page > 1) {
                params.set('page', String(next.page));
            } else {
                params.delete('page');
            }
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    useEffect(() => {
        const nextQuery = searchParams.get('q') || '';
        const nextYear = searchParams.get('year') || '';
        const nextStatus = searchParams.get('status') || '';
        const nextSdg = searchParams.get('sdg') || '';
        const nextPageRaw = Number(searchParams.get('page') || '1');
        const nextPage = Number.isNaN(nextPageRaw) || nextPageRaw < 1 ? 1 : nextPageRaw;

        setSearchInput(nextQuery);
        setQuery(nextQuery);
        setSelectedYear(nextYear);
        setSelectedStatus(nextStatus);
        setSelectedSdg(nextSdg);
        setCurrentPage(nextPage);
    }, [searchParams]);

    const yearOptions = useMemo(() => {
        return Array.from(new Set(projects.map((item) => item.year))).sort((a, b) => b - a);
    }, [projects]);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: '9',
            });

            if (query.trim()) params.set('q', query.trim());
            if (selectedYear) params.set('year', selectedYear);
            if (selectedStatus) params.set('status', selectedStatus);
            if (selectedSdg) params.set('sdg', selectedSdg);

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
    }, [currentPage, query, selectedSdg, selectedStatus, selectedYear]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="relative h-[300px] w-full bg-scholar-deep overflow-hidden">
                <Image
                    src="/images/research-banner.png"
                    alt="Research Banner"
                    fill
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
                        ฐานข้อมูลงานวิจัยและวิทยานิพนธ์
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        คลังความรู้ทางสังคมศาสตร์ เพื่อการพัฒนาท้องถิ่น ยุทธศาสตร์สังคม และผลกระทบเชิงพื้นที่ในจังหวัดเชียงราย
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'ฐานข้อมูลงานวิจัย' }]} />

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-6 border border-gray-100 space-y-4">
                    <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหางานวิจัย (ชื่อโครงการ, บทคัดย่อ)..."
                                className="input input-bordered w-full pl-10 focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <select
                            className="select select-bordered w-full"
                            value={selectedYear}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setSelectedYear(nextValue);
                                setCurrentPage(1);
                                updateUrl({ year: nextValue, page: 1 });
                            }}
                        >
                            <option value="">ทุกปี</option>
                            {yearOptions.map((year) => (
                                <option key={year} value={String(year)}>{year}</option>
                            ))}
                        </select>

                        <select
                            className="select select-bordered w-full"
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

                        <select
                            className="select select-bordered w-full"
                            value={selectedSdg}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setSelectedSdg(nextValue);
                                setCurrentPage(1);
                                updateUrl({ sdg: nextValue, page: 1 });
                            }}
                        >
                            <option value="">ทุก SDG</option>
                            {Array.from({ length: 17 }, (_, index) => index + 1).map((sdg) => (
                                <option key={sdg} value={String(sdg)}>SDG {sdg}</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                className="btn bg-scholar-deep text-white hover:bg-scholar-deep/90 border-scholar-deep"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setQuery(searchInput);
                                    updateUrl({ q: searchInput, page: 1 });
                                }}
                            >
                                ค้นหา
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setSearchInput('');
                                    setQuery('');
                                    setSelectedYear('');
                                    setSelectedStatus('');
                                    setSelectedSdg('');
                                    setCurrentPage(1);
                                    updateUrl({ q: '', year: '', status: '', sdg: '', page: 1 });
                                }}
                            >
                                ล้าง
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>ทั้งหมด {total} รายการ</span>
                        <span>•</span>
                        <span>แสดงหน้า {currentPage} / {Math.max(totalPages, 1)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-scholar-deep/5">
                        <h2 className="text-xl font-bold text-scholar-deep flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scholar-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            ผลการค้นหา ({projects.length} รายการ)
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-scholar-deep/20 border-t-scholar-deep" />
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {projects.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                                        <div className="space-y-3 flex-grow">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${RESEARCH_STATUS_STYLES[item.status]}`}>
                                                    {RESEARCH_STATUS_LABELS[item.status]}
                                                </span>
                                                {item.isSocialService && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                                        Social Service
                                                    </span>
                                                )}
                                                {item.isCommercial && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                                        Commercial
                                                    </span>
                                                )}
                                                <span className="text-gray-500 text-sm">ปีงบประมาณ: {item.year}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-scholar-accent transition-colors">
                                                <Link href={`/research/database/${item.slug}`}>
                                                    {item.titleTh}
                                                </Link>
                                            </h3>

                                            <p className="text-gray-600 text-sm">
                                                นักวิจัย: {item.memberDisplay.length > 0 ? item.memberDisplay.join(', ') : 'ยังไม่ระบุ'}
                                            </p>

                                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                                {item.fundingSource && <span>แหล่งทุน: {item.fundingSource}</span>}
                                                <span>ผลผลิต: {item.outputCount}</span>
                                                <span>เอกสาร: {item.attachmentCount}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {item.sdgIds.length > 0 ? item.sdgIds.map((sdgId) => (
                                                    <span key={sdgId} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                                        SDG {sdgId}
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-gray-400">ยังไม่ระบุ SDGs</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 min-w-[160px]">
                                            <div className="text-center lg:text-right">
                                                <span className="block text-xl font-bold text-scholar-deep">{item.attachmentCount}</span>
                                                <span className="text-xs text-gray-400">ไฟล์เผยแพร่</span>
                                            </div>
                                            <Link href={`/research/database/${item.slug}`} className="btn btn-sm btn-outline border-scholar-accent text-scholar-accent hover:bg-scholar-accent hover:text-white hover:border-scholar-accent rounded-full w-full lg:w-auto">
                                                ดูรายละเอียด
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg">ไม่พบข้อมูลงานวิจัยที่ค้นหา</p>
                            <button className="btn btn-ghost text-scholar-accent mt-2" onClick={() => {
                                setSearchInput('');
                                setQuery('');
                                setSelectedYear('');
                                setSelectedStatus('');
                                setSelectedSdg('');
                                setCurrentPage(1);
                                updateUrl({ q: '', year: '', status: '', sdg: '', page: 1 });
                            }}>
                                ล้างคำค้นหา
                            </button>
                        </div>
                    )}

                    <div className="p-4 border-t border-gray-100 flex justify-center">
                        <div className="join">
                            <button className="join-item btn btn-sm" disabled={currentPage <= 1} onClick={() => {
                                const nextPage = Math.max(currentPage - 1, 1);
                                setCurrentPage(nextPage);
                                updateUrl({ page: nextPage });
                            }}>«</button>
                            {Array.from({ length: totalPages || 1 }, (_, index) => index + 1)
                                .slice(Math.max(currentPage - 2, 0), Math.max(currentPage - 2, 0) + 5)
                                .map((page) => (
                                    <button
                                        key={page}
                                        className={`join-item btn btn-sm ${currentPage === page ? 'btn-active bg-scholar-deep text-white border-scholar-deep' : ''}`}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            updateUrl({ page });
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            <button className="join-item btn btn-sm" disabled={currentPage >= totalPages} onClick={() => {
                                const nextPage = Math.min(currentPage + 1, totalPages);
                                setCurrentPage(nextPage);
                                updateUrl({ page: nextPage });
                            }}>»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
