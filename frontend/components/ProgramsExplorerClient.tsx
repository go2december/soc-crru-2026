'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Program } from '@/lib/api';
import { 
  Search, 
  Briefcase, 
  GraduationCap, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  FilterX,
  Layers,
  LayoutGrid,
  List as ListIcon,
  Eye,
  Share2,
  Check,
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  programs: Program[];
  initialLevel?: string;
}

// Map each interest cluster specifically to database program codes
const INTEREST_CLUSTERS = [
  {
    id: 'all',
    label: 'ทั้งหมด',
    description: 'หลักสูตรทั้งหมดของคณะสังคมศาสตร์',
    codes: [] as string[],
    icon: Layers,
  },
  {
    id: 'geo',
    label: 'ภูมิศาสตร์ & ภูมิสารสนเทศ',
    description: 'สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ (วท.บ.)',
    codes: ['gis'],
    icon: Compass,
  },
  {
    id: 'social-innov',
    label: 'การพัฒนาสังคม & สังคมศาสตร์',
    description: 'สาขานวัตกรรมการพัฒนาสังคม และสังคมศาสตร์ (ศศ.บ.)',
    codes: ['social-dev', 'social-sci'],
    icon: GraduationCap,
  },
  {
    id: 'psychology',
    label: 'จิตวิทยาสังคม',
    description: 'สาขาวิชาจิตวิทยาสังคม (ศศ.บ.)',
    codes: ['social-psych'],
    icon: CheckCircle2,
  },
  {
    id: 'home-eco',
    label: 'คหกรรมศาสตร์',
    description: 'สาขาวิชาคหกรรมศาสตร์ (ศศ.บ.)',
    codes: ['home-eco'],
    icon: BookOpen,
  },
  {
    id: 'regional-grad',
    label: 'ยุทธศาสตร์การพัฒนาภูมิภาค',
    description: 'ระดับบัณฑิตศึกษา (ศศ.ม. และ ปร.ด.)',
    codes: ['regional-dev-ma', 'regional-dev-phd'],
    icon: Briefcase,
  },
];

export default function ProgramsExplorerClient({ programs, initialLevel }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel || 'all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Quick Preview Modal state
  const [previewProgram, setPreviewProgram] = useState<Program | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract all unique careers across active database programs
  const allCareers = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      (p.careers || []).forEach((c) => {
        if (c && c.trim()) set.add(c.trim());
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [programs]);

  // Dynamic Level counts based on whole programs list
  const levelCounts = useMemo(() => {
    return {
      all: programs.length,
      bachelor: programs.filter((p) => p.degreeLevel === 'BACHELOR').length,
      master: programs.filter((p) => p.degreeLevel === 'MASTER').length,
      doctoral: programs.filter(
        (p) => p.degreeLevel === 'DOCTORAL' || p.degreeLevel === 'PHD'
      ).length,
    };
  }, [programs]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      // 1. Level Filter
      if (selectedLevel === 'bachelor' && program.degreeLevel !== 'BACHELOR') return false;
      if (selectedLevel === 'master' && program.degreeLevel !== 'MASTER') return false;
      if (
        selectedLevel === 'doctoral' &&
        program.degreeLevel !== 'DOCTORAL' &&
        program.degreeLevel !== 'PHD'
      ) {
        return false;
      }

      // 2. Interest Cluster Filter
      if (selectedCluster !== 'all') {
        const cluster = INTEREST_CLUSTERS.find((c) => c.id === selectedCluster);
        if (cluster && cluster.codes.length > 0) {
          if (!cluster.codes.includes(program.code)) return false;
        }
      }

      // 3. Career Tag Filter
      if (selectedCareer) {
        const hasCareer = (program.careers || []).some(
          (c) => c.trim().toLowerCase() === selectedCareer.trim().toLowerCase()
        );
        if (!hasCareer) return false;
      }

      // 4. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = program.nameTh?.toLowerCase().includes(q);
        const matchDegree =
          program.degreeTitleTh?.toLowerCase().includes(q) ||
          program.degreeTitleEn?.toLowerCase().includes(q);
        const matchDesc = program.description?.toLowerCase().includes(q);
        const matchCareers = (program.careers || []).some((c) => c.toLowerCase().includes(q));
        const matchHighlights = (program.highlights || []).some(
          (h) => h.title?.toLowerCase().includes(q) || h.description?.toLowerCase().includes(q)
        );

        if (!matchTitle && !matchDegree && !matchDesc && !matchCareers && !matchHighlights) {
          return false;
        }
      }

      return true;
    });
  }, [programs, selectedLevel, selectedCluster, selectedCareer, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedLevel !== 'all' ||
    selectedCluster !== 'all' ||
    selectedCareer !== null;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedCluster('all');
    setSelectedCareer(null);
  };

  const getAdmissionUrl = (degreeLevel: string) => {
    if (degreeLevel === 'MASTER' || degreeLevel === 'DOCTORAL' || degreeLevel === 'PHD') {
      return 'https://orasis.crru.ac.th/gds_crru/index.php/main/home';
    }
    return 'https://admission.crru.ac.th/';
  };

  const renderDegreeLevelBadge = (level: string) => {
    switch (level) {
      case 'BACHELOR':
        return (
          <Badge className="bg-scholar-deep text-white border border-white/20 hover:bg-scholar-deep/90 font-medium px-2.5 py-0.5 text-xs rounded-md shadow-xs">
            ปริญญาตรี
          </Badge>
        );
      case 'MASTER':
        return (
          <Badge className="bg-amber-500 text-slate-950 border border-amber-600/20 hover:bg-amber-400 font-bold px-2.5 py-0.5 text-xs rounded-md shadow-xs">
            ปริญญาโท
          </Badge>
        );
      case 'DOCTORAL':
      case 'PHD':
        return (
          <Badge className="bg-scholar-accent text-white border border-transparent hover:bg-scholar-accent/90 font-bold px-2.5 py-0.5 text-xs rounded-md shadow-xs">
            ปริญญาเอก
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {level}
          </Badge>
        );
    }
  };

  const handleCopyLink = (code: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/programs/${code}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        {/* =========================================================================
            CONTROL PANEL: Search, Level Filters, Interest Clusters & Careers
            ========================================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
          {/* 1. Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสาขาวิชา, ทักษะที่สนใจ, หรืออาชีพในฝัน (เช่น GIS, นักจิตวิทยา, นักพัฒนาชุมชน)..."
              className="pl-11 pr-10 py-5 bg-slate-50/70 border-slate-300 text-scholar-deep text-sm sm:text-base rounded-lg focus-visible:ring-scholar-accent focus-visible:bg-white placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-1 h-8 w-8 self-center text-slate-400 hover:text-slate-700"
                title="ล้างข้อความค้นหา"
              >
                <FilterX className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 2. Degree Level Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedLevel === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('all')}
                className={`rounded-lg transition-all text-xs font-semibold h-9 ${
                  selectedLevel === 'all'
                    ? 'bg-scholar-deep text-white hover:bg-scholar-deep/90 shadow-2xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>ทุกระดับการศึกษา</span>
                <Badge
                  variant="secondary"
                  className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                    selectedLevel === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {levelCounts.all}
                </Badge>
              </Button>

              <Button
                variant={selectedLevel === 'bachelor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('bachelor')}
                className={`rounded-lg transition-all text-xs font-semibold h-9 ${
                  selectedLevel === 'bachelor'
                    ? 'bg-scholar-deep text-white hover:bg-scholar-deep/90 shadow-2xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>ปริญญาตรี (4 ปี)</span>
                <Badge
                  variant="secondary"
                  className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                    selectedLevel === 'bachelor' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {levelCounts.bachelor}
                </Badge>
              </Button>

              <Button
                variant={selectedLevel === 'master' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('master')}
                className={`rounded-lg transition-all text-xs font-semibold h-9 ${
                  selectedLevel === 'master'
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>ปริญญาโท</span>
                <Badge
                  variant="secondary"
                  className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                    selectedLevel === 'master' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {levelCounts.master}
                </Badge>
              </Button>

              <Button
                variant={selectedLevel === 'doctoral' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('doctoral')}
                className={`rounded-lg transition-all text-xs font-semibold h-9 ${
                  selectedLevel === 'doctoral'
                    ? 'bg-scholar-accent text-white hover:bg-[#A3350A] shadow-2xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>ปริญญาเอก</span>
                <Badge
                  variant="secondary"
                  className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                    selectedLevel === 'doctoral' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {levelCounts.doctoral}
                </Badge>
              </Button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs font-semibold text-scholar-accent hover:text-[#A3350A] hover:bg-orange-50 self-start sm:self-center h-8"
              >
                <FilterX className="w-3.5 h-3.5 mr-1" />
                ล้างตัวกรองทั้งหมด
              </Button>
            )}
          </div>

          {/* 3. Interest Clusters Grid */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-scholar-accent" />
                ค้นหาตามกลุ่มความสนใจเฉพาะทาง
              </span>
              {selectedCluster !== 'all' && (
                <button
                  onClick={() => setSelectedCluster('all')}
                  className="text-xs text-slate-500 hover:text-scholar-deep underline transition-colors"
                >
                  ดูทุกกลุ่ม
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {INTEREST_CLUSTERS.map((cluster) => {
                const Icon = cluster.icon;
                const isSelected = selectedCluster === cluster.id;
                return (
                  <button
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster.id)}
                    className={`text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between group ${
                      isSelected
                        ? 'border-scholar-accent bg-orange-50/50 text-scholar-deep font-bold ring-1 ring-scholar-accent shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-scholar-accent' : 'text-slate-400 group-hover:text-scholar-deep'}`} />
                      <span className="line-clamp-1 leading-snug">{cluster.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1 font-normal">
                      {cluster.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Career Tags Filter Chips */}
          {allCareers.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  คลิกเลือกตามสายอาชีพเป้าหมาย (Career Tag Filter)
                </span>
                {selectedCareer && (
                  <button
                    onClick={() => setSelectedCareer(null)}
                    className="text-xs text-scholar-accent hover:underline font-semibold"
                  >
                    ยกเลิกการเลือกอาชีพ ({selectedCareer})
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {allCareers.map((career) => {
                  const isSelected = selectedCareer === career;
                  return (
                    <button
                      key={career}
                      onClick={() => setSelectedCareer(isSelected ? null : career)}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                        isSelected
                          ? 'bg-scholar-deep text-white border-scholar-deep font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      #{career}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            TOOLBAR: Result Count, Active Filter Tags & View Mode Toggle
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 px-4 py-3 rounded-lg shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              แสดงผลลัพธ์ทั้งหมด{' '}
              <span className="font-bold text-scholar-deep text-sm sm:text-base">
                {filteredPrograms.length}
              </span>{' '}
              หลักสูตร
            </p>

            {/* Active Filter Badges */}
            {selectedLevel !== 'all' && (
              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300">
                ระดับ: {selectedLevel === 'bachelor' ? 'ปริญญาตรี' : selectedLevel === 'master' ? 'ปริญญาโท' : 'ปริญญาเอก'}
                <button onClick={() => setSelectedLevel('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {selectedCluster !== 'all' && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-scholar-accent border-orange-200">
                กลุ่ม: {INTEREST_CLUSTERS.find(c => c.id === selectedCluster)?.label}
                <button onClick={() => setSelectedCluster('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {selectedCareer && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
                อาชีพ: #{selectedCareer}
                <button onClick={() => setSelectedCareer(null)} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300">
                คำค้น: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-scholar-deep shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-transparent'
                  }`}
                  aria-label="มุมมองการ์ด (Grid View)"
                >
                  <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                  <span>การ์ด</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">มุมมองการ์ด (Grid View)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-scholar-deep shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-transparent'
                  }`}
                  aria-label="มุมมองรายการสรุป (List View)"
                >
                  <ListIcon className="w-3.5 h-3.5 mr-1" />
                  <span>รายการเทียบ</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">มุมมองรายการเทียบ (List View)</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* =========================================================================
            PROGRAMS RESULTS: Grid View OR List View
            ========================================================================= */}
        {filteredPrograms.length > 0 ? (
          viewMode === 'grid' ? (
            /* ================= GRID VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => {
                const admissionUrl = getAdmissionUrl(program.degreeLevel);
                const fallbackImage =
                  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
                const imageUrl = program.bannerUrl || fallbackImage;

                return (
                  <Card
                    key={program.id}
                    className="group border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-scholar-accent/50 transition-all duration-300 flex flex-col justify-between bg-white"
                  >
                    <div>
                      {/* Media Header */}
                      <div className="relative h-48 w-full bg-scholar-deep overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={program.nameTh}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={imageUrl.startsWith('http')}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/40 to-transparent" />

                        {/* Badges on Top */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                          {renderDegreeLevelBadge(program.degreeLevel)}
                        </div>

                        {/* Total Credits */}
                        {program.structure?.totalCredits ? (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge className="bg-white/95 backdrop-blur-xs text-scholar-deep font-bold text-xs border border-slate-200/80 shadow-xs">
                              {program.structure.totalCredits} หน่วยกิต
                            </Badge>
                          </div>
                        ) : null}

                        {/* Degree Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <span className="text-amber-300 text-xs font-semibold tracking-wide drop-shadow-sm block">
                            {program.degreeTitleTh || program.degreeTitleEn || 'คณะสังคมศาสตร์'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-lg font-bold text-scholar-deep group-hover:text-scholar-accent transition-colors line-clamp-2 leading-snug">
                          <Link href={`/programs/${program.code}`}>
                            {program.nameTh}
                          </Link>
                        </CardTitle>
                        {program.description && (
                          <CardDescription className="text-slate-600 text-xs line-clamp-3 leading-relaxed mt-1 font-normal">
                            {program.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-3.5">
                        {/* Concentrations Section */}
                        {program.concentrations && program.concentrations.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-scholar-deep uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-scholar-accent" />
                                แขนงวิชา / กลุ่มวิชาเฉพาะ
                              </span>
                              <Badge variant="outline" className="text-[10px] text-scholar-accent border-orange-200 bg-orange-50/50">
                                {program.concentrations.length} แขนง
                              </Badge>
                            </div>
                            <div className="space-y-1.5">
                              {program.concentrations.slice(0, 2).map((con, idx) => (
                                <Link
                                  key={idx}
                                  href={`/programs/${program.code}/${con.code}`}
                                  className="group/item block bg-slate-50 hover:bg-orange-50/60 border border-slate-200/70 hover:border-orange-200 rounded-lg p-2 text-xs transition-colors"
                                >
                                  <span className="font-semibold text-scholar-deep group-hover/item:text-scholar-accent block leading-tight flex items-center justify-between">
                                    <span className="line-clamp-1">{con.title}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-scholar-accent shrink-0 ml-1 transition-transform group-hover/item:translate-x-0.5" />
                                  </span>
                                </Link>
                              ))}
                              {program.concentrations.length > 2 && (
                                <p className="text-[11px] text-slate-400 pl-1">
                                  + อีก {program.concentrations.length - 2} แขนงวิชา
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Career Chips */}
                        {program.careers && program.careers.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                              สายอาชีพเด่นเมื่อสำเร็จการศึกษา
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {program.careers.slice(0, 3).map((career, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700 text-[11px] font-normal hover:bg-slate-200 rounded-md"
                                >
                                  {career}
                                </Badge>
                              ))}
                              {program.careers.length > 3 && (
                                <Badge variant="outline" className="text-slate-400 text-[11px] font-normal rounded-md">
                                  +{program.careers.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>

                    {/* Card Footer Actions */}
                    <CardFooter className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewProgram(program)}
                              className="h-8 px-2.5 text-xs text-slate-700 border-slate-300 hover:bg-white"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                              <span>ดูสรุป</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">คลิกดูสรุปภาพรวมหลักสูตร</TooltipContent>
                        </Tooltip>

                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs font-semibold text-scholar-deep hover:text-scholar-accent hover:bg-white"
                        >
                          <Link href={`/programs/${program.code}`}>
                            <span>รายละเอียด</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className="h-8 px-3 bg-scholar-accent hover:bg-[#A3350A] text-white text-xs font-semibold shadow-2xs"
                      >
                        <a
                          href={admissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <span>สมัครเรียน</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ================= LIST VIEW (COMPARISON ROW) ================= */
            <div className="space-y-3.5">
              {filteredPrograms.map((program) => {
                const admissionUrl = getAdmissionUrl(program.degreeLevel);
                const fallbackImage =
                  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
                const imageUrl = program.bannerUrl || fallbackImage;

                return (
                  <Card
                    key={program.id}
                    className="border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-scholar-accent/50 transition-all duration-200 bg-white"
                  >
                    <div className="flex flex-col md:flex-row items-stretch">
                      {/* Left Thumbnail Banner */}
                      <div className="relative w-full md:w-56 h-36 md:h-auto shrink-0 bg-scholar-deep">
                        <Image
                          src={imageUrl}
                          alt={program.nameTh}
                          fill
                          sizes="(max-width: 768px) 100vw, 250px"
                          unoptimized={imageUrl.startsWith('http')}
                          className="object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-scholar-deep via-scholar-deep/40 to-transparent" />
                        <div className="absolute top-3 left-3 z-10">
                          {renderDegreeLevelBadge(program.degreeLevel)}
                        </div>
                        {program.structure?.totalCredits ? (
                          <div className="absolute bottom-3 left-3 z-10">
                            <Badge className="bg-white/95 text-scholar-deep font-bold text-[11px] border border-slate-200">
                              {program.structure.totalCredits} หน่วยกิต
                            </Badge>
                          </div>
                        ) : null}
                      </div>

                      {/* Middle Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div>
                              <span className="text-xs font-semibold text-amber-700 block mb-0.5">
                                {program.degreeTitleTh || program.degreeTitleEn}
                              </span>
                              <h3 className="text-base sm:text-lg font-bold text-scholar-deep hover:text-scholar-accent transition-colors">
                                <Link href={`/programs/${program.code}`}>
                                  {program.nameTh}
                                </Link>
                              </h3>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs text-slate-500 shrink-0">
                              {program.code.toUpperCase()}
                            </Badge>
                          </div>

                          {program.description && (
                            <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-3">
                              {program.description}
                            </p>
                          )}

                          {/* Chips: Concentrations & Careers */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {program.concentrations && program.concentrations.length > 0 && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-700 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-md">
                                <Layers className="w-3 h-3 text-scholar-accent" />
                                <span>{program.concentrations.length} แขนงวิชา</span>
                              </div>
                            )}

                            {program.careers && program.careers.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {program.careers.slice(0, 3).map((career, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 text-[11px] font-normal rounded-md"
                                  >
                                    {career}
                                  </Badge>
                                ))}
                                {program.careers.length > 3 && (
                                  <span className="text-[11px] text-slate-400">
                                    +{program.careers.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons inside row */}
                        <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewProgram(program)}
                            className="h-8 px-3 text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>ดูสรุป</span>
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-semibold text-scholar-deep border-slate-300 hover:bg-slate-50"
                          >
                            <Link href={`/programs/${program.code}`}>
                              <span>รายละเอียด</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          </Button>

                          <Button
                            asChild
                            size="sm"
                            className="h-8 px-3.5 bg-scholar-accent hover:bg-[#A3350A] text-white text-xs font-semibold shadow-2xs"
                          >
                            <a
                              href={admissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <span>สมัครเรียน</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3.5 text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-scholar-deep mb-1.5">
              ไม่พบหลักสูตรที่ตรงกับเงื่อนไขการค้นหา
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 max-w-md mx-auto leading-relaxed">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูหลักสูตรทั้งหมดของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
            </p>
            <Button
              onClick={resetFilters}
              className="bg-scholar-deep hover:bg-scholar-deep/90 text-white text-xs font-semibold px-6"
            >
              <FilterX className="w-3.5 h-3.5 mr-1.5" />
              รีเซ็ตตัวกรองทั้งหมด
            </Button>
          </div>
        )}

        {/* =========================================================================
            QUICK PREVIEW MODAL (SHADCN DIALOG)
            ========================================================================= */}
        <Dialog open={!!previewProgram} onOpenChange={(open) => !open && setPreviewProgram(null)}>
          {previewProgram && (
            <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[85vh] overflow-y-auto p-0 rounded-xl gap-0 border-slate-200">
              {/* Modal Banner Header */}
              <div className="relative h-44 w-full bg-scholar-deep overflow-hidden">
                <Image
                  src={previewProgram.bannerUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'}
                  alt={previewProgram.nameTh}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/60 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  {renderDegreeLevelBadge(previewProgram.degreeLevel)}
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-mono">
                    CODE: {previewProgram.code.toUpperCase()}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <DialogHeader className="p-0 text-left space-y-0.5">
                    <span className="text-amber-300 text-xs font-semibold block mb-0.5">
                      {previewProgram.degreeTitleTh || previewProgram.degreeTitleEn}
                    </span>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-white font-heading leading-tight drop-shadow-sm">
                      {previewProgram.nameTh}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      รายละเอียดและข้อมูลสรุปหลักสูตร {previewProgram.nameTh}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 text-sm">
                {/* Description */}
                {previewProgram.description && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-scholar-deep" />
                      ภาพรวมหลักสูตร
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {previewProgram.description}
                    </p>
                  </div>
                )}

                {/* Credit Structure Grid */}
                {previewProgram.structure && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-scholar-deep mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-scholar-accent" />
                      โครงสร้างหลักสูตร (จำนวนหน่วยกิต)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                      <div className="bg-white border border-slate-200 p-2.5 rounded-md shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">หน่วยกิตรวม</span>
                        <span className="text-lg font-bold text-scholar-deep">
                          {previewProgram.structure.totalCredits || '-'}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-md shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">หมวดศึกษาทั่วไป</span>
                        <span className="text-lg font-bold text-slate-700">
                          {previewProgram.structure.general || '-'}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-md shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">หมวดวิชาเฉพาะ</span>
                        <span className="text-lg font-bold text-slate-700">
                          {previewProgram.structure.major || '-'}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-md shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">หมวดเลือกเสรี</span>
                        <span className="text-lg font-bold text-slate-700">
                          {previewProgram.structure.freeElective || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Concentrations List */}
                {previewProgram.concentrations && previewProgram.concentrations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-scholar-deep mb-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-scholar-accent" />
                        แขนงวิชา / กลุ่มวิชาเฉพาะที่เปิดสอน
                      </span>
                      <span className="text-[11px] text-scholar-accent font-semibold">
                        {previewProgram.concentrations.length} แขนง
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewProgram.concentrations.map((con, idx) => (
                        <Link
                          key={idx}
                          href={`/programs/${previewProgram.code}/${con.code}`}
                          onClick={() => setPreviewProgram(null)}
                          className="p-3 rounded-lg border border-slate-200 hover:border-scholar-accent bg-white hover:bg-orange-50/40 transition-colors block group"
                        >
                          <span className="text-xs font-bold text-scholar-deep group-hover:text-scholar-accent flex items-center justify-between">
                            <span>{con.title}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          {con.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-light">
                              {con.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Careers List */}
                {previewProgram.careers && previewProgram.careers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      สายอาชีพเมื่อสำเร็จการศึกษา
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewProgram.careers.map((career, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 text-xs font-normal"
                        >
                          #{career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Curriculum Doc Link */}
                {previewProgram.curriculumUrl && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>เอกสารหลักสูตรฉบับเต็ม (มคอ.2) พร้อมให้ดาวน์โหลด</span>
                    </div>
                    <a
                      href={previewProgram.curriculumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 inline-flex items-center gap-1"
                    >
                      <span>เปิดเอกสาร</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(previewProgram.code)}
                  className="text-xs text-slate-700 border-slate-300 w-full sm:w-auto"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">คัดลอกลิงก์แล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 mr-1" />
                      <span>แชร์หลักสูตร</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-scholar-deep hover:bg-slate-100 text-xs font-semibold flex-1 sm:flex-initial"
                  >
                    <Link
                      href={`/programs/${previewProgram.code}`}
                      onClick={() => setPreviewProgram(null)}
                    >
                      <span>ดูรายละเอียดเต็ม</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="bg-scholar-accent hover:bg-[#A3350A] text-white text-xs font-semibold shadow-2xs flex-1 sm:flex-initial"
                  >
                    <a
                      href={getAdmissionUrl(previewProgram.degreeLevel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>สมัครเรียน</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
