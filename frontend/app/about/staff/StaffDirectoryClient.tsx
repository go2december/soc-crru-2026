'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  UserX,
  GraduationCap,
  Users,
  Building2,
  UserCircle2,
  Globe,
  Fingerprint,
  BookOpen,
  X,
  ChevronRight,
  Sparkles,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { Staff, getFullName } from '@/lib/staff';
import { getAssetUrl, getApiBaseUrl } from '@/lib/api-config';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Helper: ใช้สำหรับ Search Text
const getSearchPositionString = (staff: Staff): string => {
  return `${staff.academicPosition || ''} ${staff.adminPosition || ''} ${
    staff.staffType === 'SUPPORT' ? 'บุคลากรสายสนับสนุน' : 'อาจารย์'
  }`;
};

// ==========================================
// Skeleton Loader (Zero CLS with shadcn Skeleton)
// ==========================================
const StaffCardSkeleton = () => (
  <Card className="rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden w-full flex flex-col bg-white">
    <div className="pt-5 px-4 pb-2 bg-slate-50 flex justify-center">
      <Skeleton className="aspect-[3/4] w-36 sm:w-40 rounded-xl" />
    </div>
    <CardContent className="p-4 pt-2 pb-5 flex flex-col items-center flex-grow space-y-2.5">
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-3 w-24 rounded" />
      <div className="pt-2 border-t border-slate-100 flex gap-2 w-full justify-center">
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="size-6 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

// ==========================================
// Modern Staff Card (shadcn Card + Tooltips)
// ==========================================
const StaffCard = ({ staff }: { staff: Staff }) => {
  const imageUrl = getAssetUrl(staff.imageUrl);
  const isChair =
    staff.adminPosition &&
    (staff.adminPosition.includes('ประธานสาขา') ||
      staff.adminPosition.includes('ประธานแขนง'));

  return (
    <Link
      href={`/about/staff/${staff.id}`}
      aria-label={`ดูประวัติ ${getFullName(staff)}`}
      className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] rounded-2xl"
    >
      <Card className="rounded-2xl border border-slate-200/90 shadow-2xs group-hover:shadow-md group-hover:border-amber-500/60 transition-all duration-200 overflow-hidden w-full flex flex-col h-full bg-white relative">
        <div className="pt-5 px-4 pb-2 bg-gradient-to-b from-slate-50/80 to-white flex justify-center">
          <figure className="aspect-[3/4] w-36 sm:w-40 bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-xl border border-slate-200/90 group-hover:border-amber-400/60 transition-colors shadow-2xs">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={getFullName(staff)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                <UserCircle2 className="size-16 text-slate-300" strokeWidth={1} />
              </div>
            )}
          </figure>
        </div>

        <CardContent className="p-4 pt-2 pb-5 flex flex-col items-center text-center flex-grow bg-white">
          {/* Department / Category Badge */}
          <div className="mb-2">
            <Badge
              variant="outline"
              className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 border ${
                staff.staffType === 'ACADEMIC'
                  ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                  : 'bg-teal-50 text-teal-700 border-teal-200/80'
              }`}
            >
              {staff.department?.replace(/สาขาวิชา|แขนงวิชา/g, '').trim() ||
                'ไม่ระบุสังกัด'}
            </Badge>
          </div>

          {/* Full Name */}
          <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-[#C2410C] transition-colors line-clamp-2">
            {getFullName(staff)}
          </h3>

          {/* Positions */}
          {isChair ? (
            <p className="text-xs font-semibold text-[#C2410C] leading-snug line-clamp-2 mt-0.5">
              {staff.adminPosition}
            </p>
          ) : staff.adminPosition ? (
            <p className="text-xs font-medium text-slate-500 leading-snug line-clamp-2 mt-0.5">
              {staff.adminPosition}
            </p>
          ) : staff.academicPosition ? (
            <p className="text-xs font-medium text-slate-600 leading-snug line-clamp-1 mt-0.5">
              {staff.academicPosition}
            </p>
          ) : null}

          {/* Researcher Profile Tooltips */}
          {(staff.googleScholarUrl || staff.orcidId || staff.scopusAuthorId) && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 w-full">
              {staff.googleScholarUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center size-6 rounded-md bg-blue-50 text-blue-600 border border-blue-200/80 hover:bg-blue-100 transition-colors cursor-pointer">
                      <Globe className="size-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Google Scholar Profile</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {staff.orcidId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center size-6 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200/80 hover:bg-emerald-100 transition-colors cursor-pointer">
                      <Fingerprint className="size-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ORCID ID: {staff.orcidId}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {staff.scopusAuthorId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center size-6 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition-colors cursor-pointer">
                      <BookOpen className="size-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scopus Author ID: {staff.scopusAuthorId}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

interface StaffDirectoryClientProps {
  initialStaff: Staff[];
}

export default function StaffDirectoryClient({
  initialStaff,
}: StaffDirectoryClientProps) {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff || []);
  const [loading, setLoading] = useState(
    initialStaff && initialStaff.length > 0 ? false : true
  );
  const [error, setError] = useState<string | null>(null);

  // Tabs: Academic (Departments), Support
  const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'SUPPORT'>(
    'DEPARTMENTS'
  );
  const [activeDept, setActiveDept] = useState('ทั้งหมด');
  const [deptSearch, setDeptSearch] = useState('');
  const [deptPopoverOpen, setDeptPopoverOpen] = useState(false);
  const [activeExpertise, setActiveExpertise] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Read ?dept= from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const dept = params.get('dept');
      if (dept) {
        setActiveDept(dept);
        setActiveTab('DEPARTMENTS');
      }
    }
  }, []);

  // Fallback client-side fetch if initialStaff was empty on SSR
  useEffect(() => {
    if (initialStaff && initialStaff.length > 0) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/staff?limit=150`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const jsonArray = await res.json();
        const data: Staff[] = jsonArray.data || [];
        setStaffList(data);
      } catch (err) {
        console.error('Error fetching staff client-side:', err);
        setError('ไม่สามารถโหลดข้อมูลบุคลากรได้ในขณะนี้');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [initialStaff]);

  // Calculate Counts
  const { academicCount, supportCount, departments, deptCounts } =
    useMemo(() => {
      let academic = 0;
      let support = 0;
      const deptSet = new Set<string>();
      const dCounts: Record<string, number> = {};

      staffList.forEach((s) => {
        if (s.staffType === 'ACADEMIC') {
          academic++;
          if (s.department) {
            deptSet.add(s.department);
            dCounts[s.department] = (dCounts[s.department] || 0) + 1;
          }
        } else if (s.staffType === 'SUPPORT') {
          support++;
        }
      });

      const sortedDepts = ['ทั้งหมด', ...Array.from(deptSet).sort()];
      return {
        academicCount: academic,
        supportCount: support,
        departments: sortedDepts,
        deptCounts: dCounts,
      };
    }, [staffList]);

  // Filtered Departments for Combobox Popover
  const filteredDepartments = useMemo(() => {
    if (!deptSearch.trim()) return departments;
    const term = deptSearch.toLowerCase();
    return departments.filter((d) => d.toLowerCase().includes(term));
  }, [departments, deptSearch]);

  const availableExpertise = useMemo(() => {
    if (activeTab !== 'DEPARTMENTS') return [];
    const deptStaff = staffList.filter(
      (s) =>
        s.staffType === 'ACADEMIC' &&
        (activeDept === 'ทั้งหมด' || s.department === activeDept)
    );
    const tags = new Set<string>();
    deptStaff.forEach((s) => {
      if (s.expertise && Array.isArray(s.expertise)) {
        s.expertise.forEach((e) => {
          const clean = e.trim();
          if (clean) tags.add(clean);
        });
      }
    });
    return Array.from(tags).sort();
  }, [staffList, activeTab, activeDept]);

  const filteredStaff = staffList.filter((staff) => {
    // 1. Tab Filtering Logic
    if (activeTab === 'DEPARTMENTS') {
      if (staff.staffType !== 'ACADEMIC') return false;
      if (activeDept !== 'ทั้งหมด' && staff.department !== activeDept)
        return false;
      if (
        activeExpertise &&
        (!staff.expertise ||
          !staff.expertise.some((e) => e.trim() === activeExpertise))
      )
        return false;
    } else if (activeTab === 'SUPPORT') {
      if (staff.staffType !== 'SUPPORT') return false;
    }

    // 2. Search
    const fullName = getFullName(staff).toLowerCase();
    const position = getSearchPositionString(staff).toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <TooltipProvider delayDuration={200}>
      <main className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
        {/* ================= 1. HERO HEADER (EDITORIAL LANNA) ================= */}
        <section className="bg-[#0B132B] text-white pt-14 pb-16 px-4 relative overflow-hidden border-b-4 border-[#C2410C]">
          {/* Geometric Dot Canvas Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-600" />
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    เกี่ยวกับคณะ
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-600" />
                </li>
                <li className="text-amber-400 font-semibold" aria-current="page">
                  ทำเนียบบุคลากร
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
                <Users className="size-3.5" />
                <span>STAFF & FACULTY DIRECTORY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading">
                ทำเนียบคณาจารย์และบุคลากร <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F97316] to-[#C2410C]">
                  คณะสังคมศาสตร์ มรภ.เชียงราย
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* ================= 2. STICKY SUB-NAVIGATION BAR ================= */}
        <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-6 text-xs sm:text-sm font-semibold whitespace-nowrap">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="px-3 py-1.5 rounded-lg text-[#C2410C] bg-orange-50/80 font-bold">
                  ทำเนียบบุคลากร
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="hidden sm:inline">หน้าอื่นในหมวด:</span>
                <Link href="/about" className="hover:text-[#C2410C] hover:underline">
                  ภาพรวมคณะ
                </Link>
                <span>•</span>
                <Link href="/about/strategy" className="hover:text-[#C2410C] hover:underline">
                  แผนยุทธศาสตร์
                </Link>
                <span>•</span>
                <Link href="/about/structure" className="hover:text-[#C2410C] hover:underline">
                  โครงสร้างการบริหาร
                </Link>
                <span>•</span>
                <Link href="/about/executive" className="hover:text-[#C2410C] hover:underline">
                  ผู้บริหาร
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. CONTROLS (FILTER & SEARCH) ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mb-8">
          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 bg-white">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Left & Middle: Tabs + Department Combobox */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 flex-wrap">
                {/* Main Tabs (shadcn Tabs: Academic vs Support) */}
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => {
                    setActiveTab(val as 'DEPARTMENTS' | 'SUPPORT');
                    setActiveExpertise(null);
                    if (val === 'SUPPORT') {
                      setActiveDept('ทั้งหมด');
                    }
                  }}
                  className="w-auto"
                >
                  <TabsList className="bg-slate-100/90 p-1 rounded-xl h-auto flex gap-1 w-fit">
                    <TabsTrigger
                      value="DEPARTMENTS"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-[#0B132B] data-[state=active]:text-white transition-all shadow-none data-[state=active]:shadow-2xs"
                    >
                      <GraduationCap className="size-4 text-amber-400" />
                      <span>
                        คณาจารย์<span className="hidden xl:inline">ประจำสาขาวิชา</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 data-[state=active]:bg-white/20 data-[state=active]:text-white border-none"
                      >
                        {academicCount}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="SUPPORT"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-[#0B132B] data-[state=active]:text-white transition-all shadow-none data-[state=active]:shadow-2xs"
                    >
                      <Building2 className="size-4 text-teal-400" />
                      <span>
                        บุคลากร<span className="hidden xl:inline">สายสนับสนุน</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 data-[state=active]:bg-white/20 data-[state=active]:text-white border-none"
                      >
                        {supportCount}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Combobox Popover for Departments (Only shown for Academic/Departments) */}
                {activeTab === 'DEPARTMENTS' && (
                  <Popover open={deptPopoverOpen} onOpenChange={setDeptPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={deptPopoverOpen}
                        className="h-10 justify-between rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#C2410C] hover:border-amber-500/60 transition-colors shadow-2xs gap-2 min-w-[200px] sm:min-w-[230px]"
                      >
                        <span className="truncate">
                          {activeDept === 'ทั้งหมด'
                            ? 'ทุกสาขาวิชา'
                            : activeDept}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 rounded-full"
                          >
                            {activeDept === 'ทั้งหมด'
                              ? academicCount
                              : deptCounts[activeDept] || 0}
                          </Badge>
                          <ChevronsUpDown className="size-4 opacity-50" />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2 rounded-xl shadow-xl border-slate-200 bg-white" align="start">
                      <div className="p-1 mb-2 relative">
                        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="พิมพ์ค้นหาสาขาวิชา..."
                          value={deptSearch}
                          onChange={(e) => setDeptSearch(e.target.value)}
                          className="h-8 pl-8 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white"
                        />
                        {deptSearch && (
                          <button
                            onClick={() => setDeptSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
                        {filteredDepartments.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-3">
                            ไม่พบสาขาวิชาที่ค้นหา
                          </p>
                        ) : (
                          filteredDepartments.map((dept) => {
                            const count =
                              dept === 'ทั้งหมด'
                                ? academicCount
                                : deptCounts[dept] || 0;
                            const isSelected = activeDept === dept;
                            return (
                              <button
                                key={dept}
                                onClick={() => {
                                  setActiveDept(dept);
                                  setActiveExpertise(null);
                                  setDeptPopoverOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-[#C2410C]/10 text-[#C2410C] font-bold'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <Check
                                    className={`size-3.5 shrink-0 ${
                                      isSelected ? 'opacity-100 text-[#C2410C]' : 'opacity-0'
                                    }`}
                                  />
                                  <span className="truncate">{dept}</span>
                                </div>
                                <Badge
                                  variant={isSelected ? 'saffron' : 'subtle'}
                                  className="text-[10px] ml-2 shrink-0 px-1.5 py-0"
                                >
                                  {count}
                                </Badge>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Right: Search Box (shadcn Input with Icons) */}
              <div className="w-full lg:w-72 xl:w-80 relative">
                <Input
                  type="text"
                  placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                  className="pl-10 pr-9 h-10 rounded-xl bg-slate-50 border-slate-200 focus:border-[#C2410C] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#C2410C]/20 transition-colors shadow-2xs text-xs sm:text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    title="ล้างคำค้นหา"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

              {/* Expertise Tags Filter */}
              {activeTab === 'DEPARTMENTS' && availableExpertise.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      ความเชี่ยวชาญ :
                    </span>
                    {activeExpertise && (
                      <button
                        onClick={() => setActiveExpertise(null)}
                        className="text-xs text-[#C2410C] hover:underline font-semibold transition-colors"
                      >
                        ล้างตัวกรอง ({activeExpertise})
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableExpertise.map((exp) => (
                      <button
                        key={exp}
                        onClick={() =>
                          setActiveExpertise(exp === activeExpertise ? null : exp)
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                          activeExpertise === exp
                            ? 'bg-[#C2410C] text-white border-[#C2410C] shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-amber-500/50 hover:bg-white'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* ================= 4. STAFF GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Filter & Results Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 mb-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                {activeTab === 'DEPARTMENTS'
                  ? 'คณาจารย์ประจำสาขาวิชา'
                  : 'บุคลากรสายสนับสนุน'}
              </span>
              <span className="text-slate-300">•</span>
              <span>
                แสดง{' '}
                <strong className="text-slate-900 font-bold">
                  {filteredStaff.length}
                </strong>{' '}
                จากทั้งหมด{' '}
                {activeTab === 'DEPARTMENTS' ? academicCount : supportCount} ท่าน
              </span>
              {(searchTerm ||
                (activeTab === 'DEPARTMENTS' && activeDept !== 'ทั้งหมด') ||
                activeExpertise) && (
                <span className="hidden sm:inline text-slate-400 italic">
                  (คัดกรองตามเงื่อนไข)
                </span>
              )}
            </div>

            {(searchTerm ||
              (activeTab === 'DEPARTMENTS' && activeDept !== 'ทั้งหมด') ||
              activeExpertise) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveDept('ทั้งหมด');
                  setActiveExpertise(null);
                }}
                className="text-xs font-semibold text-[#C2410C] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <X className="size-3.5" /> ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>

          {/* Content States */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <StaffCardSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-20 bg-white rounded-2xl border border-red-200 shadow-2xs p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-base font-bold text-red-600 mb-2">{error}</p>
              <p className="text-xs text-slate-500 mb-6">
                กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#0B132B] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
              >
                โหลดข้อมูลใหม่
              </Button>
            </Card>
          ) : filteredStaff.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {[...filteredStaff]
                .sort((a, b) => {
                  if (activeTab === 'DEPARTMENTS') {
                    const aIsChair =
                      a.adminPosition?.includes('ประธานสาขา') ||
                      a.adminPosition?.includes('ประธานแขนง');
                    const bIsChair =
                      b.adminPosition?.includes('ประธานสาขา') ||
                      b.adminPosition?.includes('ประธานแขนง');

                    if (aIsChair && !bIsChair) return -1;
                    if (!aIsChair && bIsChair) return 1;
                  }
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                })
                .map((staff) => (
                  <StaffCard key={staff.id} staff={staff} />
                ))}
            </div>
          ) : (
            <Card className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-lg mx-auto p-8">
              <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <UserX className="size-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                ไม่พบข้อมูลบุคลากร
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                ไม่พบรายชื่อตามเงื่อนไขที่เลือก หรือลองปรับคำค้นหาใหม่
              </p>
              {(searchTerm || activeDept !== 'ทั้งหมด' || activeExpertise) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveDept('ทั้งหมด');
                    setActiveExpertise(null);
                  }}
                  className="rounded-lg text-xs font-semibold"
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              )}
            </Card>
          )}
        </section>
      </main>
    </TooltipProvider>
  );
}
