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
  Layers
} from 'lucide-react';

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
    label: 'ภูมิศาสตร์และภูมิสารสนเทศ',
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

  // Level counts
  const levelCounts = useMemo(() => {
    return {
      all: programs.length,
      bachelor: programs.filter((p) => p.degreeLevel === 'BACHELOR').length,
      master: programs.filter((p) => p.degreeLevel === 'MASTER').length,
      doctoral: programs.filter((p) => p.degreeLevel === 'DOCTORAL' || p.degreeLevel === 'PHD').length,
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

      // 2. Interest Cluster Filter (Specific DB program code mapping)
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

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'BACHELOR':
        return (
          <span className="bg-scholar-deep text-white text-xs font-semibold px-2.5 py-1 rounded-sm border border-white/20">
            ระดับปริญญาตรี
          </span>
        );
      case 'MASTER':
        return (
          <span className="bg-scholar-gold text-scholar-deep text-xs font-bold px-2.5 py-1 rounded-sm">
            ระดับปริญญาโท
          </span>
        );
      case 'DOCTORAL':
      case 'PHD':
        return (
          <span className="bg-scholar-accent text-white text-xs font-bold px-2.5 py-1 rounded-sm">
            ระดับปริญญาเอก
          </span>
        );
      default:
        return null;
    }
  };

  const getAdmissionUrl = (degreeLevel: string) => {
    if (degreeLevel === 'MASTER' || degreeLevel === 'DOCTORAL' || degreeLevel === 'PHD') {
      return 'https://orasis.crru.ac.th/gds_crru/index.php/main/home';
    }
    return 'https://admission.crru.ac.th/';
  };

  return (
    <div className="space-y-10">
      {/* =========================================================================
          CONTROL PANEL: Search, Level Tabs & Cluster Carousel
          ========================================================================= */}
      <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามชื่อสาขาวิชา, ทักษะที่สนใจ, หรืออาชีพในฝัน (เช่น GIS, นักจิตวิทยา, นักพัฒนาชุมชน)..."
            className="w-full pl-11 pr-10 py-3.5 bg-scholar-soft border border-gray-300 text-scholar-deep text-base rounded-sm focus:outline-none focus:border-scholar-accent focus:bg-white transition-all placeholder:text-gray-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="ล้างข้อความ"
            >
              <FilterX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all flex items-center gap-2 ${
                selectedLevel === 'all'
                  ? 'bg-scholar-deep text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>ทุกระดับการศึกษา</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedLevel === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {levelCounts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedLevel('bachelor')}
              className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all flex items-center gap-2 ${
                selectedLevel === 'bachelor'
                  ? 'bg-scholar-deep text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>ปริญญาตรี (4 ปี)</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedLevel === 'bachelor' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {levelCounts.bachelor}
              </span>
            </button>

            <button
              onClick={() => setSelectedLevel('master')}
              className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all flex items-center gap-2 ${
                selectedLevel === 'master'
                  ? 'bg-scholar-gold text-scholar-deep shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>ปริญญาโท</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedLevel === 'master' ? 'bg-scholar-deep text-white' : 'bg-gray-200 text-gray-700'}`}>
                {levelCounts.master}
              </span>
            </button>

            <button
              onClick={() => setSelectedLevel('doctoral')}
              className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all flex items-center gap-2 ${
                selectedLevel === 'doctoral'
                  ? 'bg-scholar-accent text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>ปริญญาเอก</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedLevel === 'doctoral' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {levelCounts.doctoral}
              </span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-scholar-accent hover:underline flex items-center gap-1.5 self-center"
            >
              <FilterX className="w-3.5 h-3.5" />
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {/* Dynamic Interest Clusters (Matching Database Programs) */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-scholar-accent" />
              ค้นหาตามกลุ่มความสนใจเฉพาะทาง (เฉพาะหลักสูตรที่เปิดสอน)
            </span>
            {selectedCluster !== 'all' && (
              <button
                onClick={() => setSelectedCluster('all')}
                className="text-xs text-gray-500 hover:text-scholar-deep underline"
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
                  className={`text-left p-3 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-scholar-accent bg-scholar-accent/5 text-scholar-deep font-bold ring-1 ring-scholar-accent'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-scholar-accent' : 'text-gray-400'}`} />
                    <span className="line-clamp-1">{cluster.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 line-clamp-1 font-normal">
                    {cluster.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Career Tags (Clickable Filter Chips) */}
        {allCareers.length > 0 && (
          <div className="pt-6 border-t border-gray-100 mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-scholar-gold" />
                คลิกเลือกตามสายอาชีพเป้าหมาย (Career Tag Filter)
              </span>
              {selectedCareer && (
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="text-xs text-scholar-accent hover:underline"
                >
                  ยกเลิกการเลือกอาชีพ ({selectedCareer})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {allCareers.map((career) => {
                const isSelected = selectedCareer === career;
                return (
                  <button
                    key={career}
                    onClick={() => setSelectedCareer(isSelected ? null : career)}
                    className={`px-2.5 py-1 text-xs rounded-sm border transition-all ${
                      isSelected
                        ? 'bg-scholar-deep text-white border-scholar-deep font-semibold shadow-sm'
                        : 'bg-scholar-soft text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
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
          PROGRAMS GRID & RESULTS STATUS
          ========================================================================= */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500 font-medium">
            แสดงผลลัพธ์ทั้งหมด <span className="font-bold text-scholar-deep">{filteredPrograms.length}</span> หลักสูตร
            {hasActiveFilters && ' (จากการคัดกรอง)'}
          </p>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              const admissionUrl = getAdmissionUrl(program.degreeLevel);
              const fallbackImage =
                'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
              const imageUrl = program.bannerUrl || fallbackImage;

              return (
                <div
                  key={program.id}
                  className="group bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg hover:border-scholar-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Top Media Header */}
                    <div className="relative h-48 w-full bg-scholar-deep overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={program.nameTh}
                        fill
                        unoptimized={imageUrl.startsWith('http')}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/40 to-transparent" />
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        {getLevelBadge(program.degreeLevel)}
                      </div>

                      {/* Total Credits */}
                      {program.structure?.totalCredits ? (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-scholar-deep font-semibold text-xs px-2.5 py-1 rounded-sm border border-gray-200">
                          {program.structure.totalCredits} หน่วยกิต
                        </div>
                      ) : null}

                      {/* Degree Abbr overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-scholar-gold text-xs font-medium tracking-wide drop-shadow-sm block">
                          {program.degreeTitleTh || program.degreeTitleEn || 'สำนักวิชาสังคมศาสตร์'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors line-clamp-2 leading-snug">
                        <Link href={`/programs/${program.code}`}>
                          {program.nameTh}
                        </Link>
                      </h3>

                      {program.description && (
                        <p className="text-gray-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                          {program.description}
                        </p>
                      )}

                      {/* Specialized Concentrations / แขนงวิชาเฉพาะ */}
                      {program.concentrations && program.concentrations.length > 0 && (
                        <div className="mb-4 pt-3 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-scholar-deep uppercase tracking-wider block mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-scholar-accent" />
                              แขนงวิชา / กลุ่มวิชาเฉพาะ
                            </span>
                            <span className="text-[10px] text-scholar-accent font-semibold">
                              {program.concentrations.length} แขนง
                            </span>
                          </span>
                          <div className="space-y-1.5">
                            {program.concentrations.map((con, idx) => (
                              <Link
                                key={idx}
                                href={`/programs/${program.code}/${con.code}`}
                                className="group/item block bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 rounded-sm p-2 text-xs transition-colors"
                              >
                                <span className="font-semibold text-scholar-deep group-hover/item:text-scholar-accent block leading-tight flex items-center justify-between">
                                  <span>{con.title}</span>
                                  <span className="text-[10px] text-scholar-accent opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                                </span>
                                {con.description && (
                                  <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5 font-light">
                                    {con.description}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Careers Chips */}
                      {program.careers && program.careers.length > 0 && (
                        <div className="mb-4 pt-3 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-scholar-gold" />
                            สายอาชีพเด่นเมื่อสำเร็จการศึกษา
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {program.careers.slice(0, 3).map((career, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-sm font-medium"
                              >
                                {career}
                              </span>
                            ))}
                            {program.careers.length > 3 && (
                              <span className="text-gray-400 text-[11px] px-1 py-0.5">
                                +{program.careers.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="p-4 bg-scholar-soft border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/programs/${program.code}`}
                      className="text-xs font-bold text-scholar-deep hover:text-scholar-accent flex items-center gap-1.5 transition-colors"
                    >
                      <span>รายละเอียดหลักสูตร</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a
                      href={admissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-bold rounded-sm shadow-sm transition-all"
                    >
                      <span>สมัครเรียน</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Result */
          <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-scholar-deep mb-2">
              ไม่พบหลักสูตรที่ตรงกับเงื่อนไขการค้นหา
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูหลักสูตรทั้งหมดของสำนักวิชาสังคมศาสตร์
            </p>
            <button
              onClick={resetFilters}
              className="btn btn-sm bg-scholar-deep text-white border-none rounded-sm px-6 hover:bg-scholar-deep/90"
            >
              รีเซ็ตตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
