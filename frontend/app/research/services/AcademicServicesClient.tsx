'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  RotateCcw,
  MapPin,
  Users,
  ArrowRight,
  ExternalLink,
  HeartHandshake,
  Lightbulb,
  FlaskConical,
  FolderGit2,
  Sparkles,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  AcademicServiceItem,
  ACADEMIC_SERVICE_TYPES,
  ACADEMIC_SERVICE_STATUSES,
  getServiceTypeConfig,
  getStatusConfig,
} from '@/lib/academic-services';

interface AcademicServicesClientProps {
  initialProjects: AcademicServiceItem[];
}

export default function AcademicServicesClient({ initialProjects }: AcademicServicesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSdg, setSelectedSdg] = useState<string>('ALL');

  // Compute counts per service type for top cards
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialProjects.length };
    for (const project of initialProjects) {
      const type = project.serviceType || 'OTHER';
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [initialProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Search Query (Title, Description, Area)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = (project.description || '').toLowerCase().includes(query);
        const areaMatch = (project.area || '').toLowerCase().includes(query);
        const memberMatch = (project.members || []).some((m) =>
          `${m.prefix || ''}${m.firstNameTh || ''} ${m.lastNameTh || ''}`.toLowerCase().includes(query)
        );
        if (!titleMatch && !descMatch && !areaMatch && !memberMatch) {
          return false;
        }
      }

      // 2. Type Filter
      if (selectedType !== 'ALL') {
        if (project.serviceType !== selectedType) {
          return false;
        }
      }

      // 3. Status Filter
      if (selectedStatus !== 'ALL') {
        if (project.status !== selectedStatus) {
          return false;
        }
      }

      // 4. SDG Filter
      if (selectedSdg !== 'ALL') {
        const sdgNum = parseInt(selectedSdg, 10);
        if (!project.sdgIds || !project.sdgIds.includes(sdgNum)) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, searchQuery, selectedType, selectedStatus, selectedSdg]);

  const handleCardCategoryClick = (categoryValue: string) => {
    if (selectedType === categoryValue) {
      setSelectedType('ALL');
    } else {
      setSelectedType(categoryValue);
    }
    // Smooth scroll to projects section
    const el = document.getElementById('projects-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSelectedSdg('ALL');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedSdg !== 'ALL';

  const renderTypeIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. TOP INTERACTIVE CATEGORY CARDS (Config-driven & Scalable) */}
      <section className="pt-2 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-scholar-accent block mb-1">
              Academic Service Areas
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">
              ประเภทงานบริการวิชาการ
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {selectedType !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedType('ALL')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-scholar-deep text-white hover:bg-scholar-accent transition-colors shadow-sm"
              >
                <span>แสดงทุกประเภท ({initialProjects.length})</span>
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
            <span className="text-xs text-slate-400 hidden sm:inline">
              เลือกหมวดเพื่อกรองดูเฉพาะโครงการ
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ACADEMIC_SERVICE_TYPES.filter((t) => t.value !== 'OTHER').map((service) => {
            const isSelected = selectedType === service.value;
            const projectCount = countsByType[service.value] || 0;

            return (
              <div
                key={service.value}
                onClick={() => handleCardCategoryClick(service.value)}
                className={`relative rounded-xl p-6 sm:p-7 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group overflow-hidden ${
                  isSelected
                    ? 'bg-white border-2 border-scholar-accent shadow-md ring-4 ring-scholar-accent/10'
                    : 'bg-white border border-slate-200/90 hover:border-scholar-accent/50 hover:shadow-sm'
                }`}
              >
                {/* Active Indicator Top Stripe */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-scholar-accent" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-scholar-accent text-white shadow-sm'
                          : `${service.accentBg}`
                      }`}
                    >
                      {renderTypeIcon(service.iconName)}
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-scholar-accent/10 text-scholar-accent border border-scholar-accent/20">
                          <CheckCircle2 className="w-3 h-3" /> กำลังเลือก
                        </span>
                      ) : (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 group-hover:bg-scholar-accent/10 group-hover:text-scholar-accent transition-colors">
                          {projectCount} โครงการ
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    className={`text-lg md:text-xl font-bold mb-2.5 tracking-tight flex items-center gap-2 ${
                      isSelected ? 'text-scholar-deep' : 'text-slate-900 group-hover:text-scholar-accent'
                    } transition-colors`}
                  >
                    {service.label}
                  </h3>

                  <p className="text-xs md:text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold flex items-center gap-1 text-[11px] md:text-xs ${
                      isSelected
                        ? 'text-scholar-accent'
                        : 'text-slate-400 group-hover:text-scholar-accent transition-colors'
                    }`}
                  >
                    {isSelected ? 'คลิกอีกครั้งเพื่อดูทั้งหมด' : 'คลิกเพื่อดูเฉพาะหมวดนี้'}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'rotate-90' : 'group-hover:translate-x-0.5'} transition-transform`} />
                  </span>

                  {service.value === 'SOCIAL_LAB' && (
                    <a
                      href="https://social-lab.soc.crru.ac.th"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-scholar-accent hover:underline px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                      title="เข้าชมเว็บไซต์ห้องปฏิบัติการ Social Lab"
                    >
                      เว็บ Social Lab <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. SEARCH & DYNAMIC FILTER BAR */}
      <section id="projects-section" className="scroll-mt-24 pt-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          {/* Top Row: Search Input + Status Dropdown + SDGs Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อโครงการ, พื้นที่ชุมชน, อาจารย์ผู้รับผิดชอบ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-scholar-accent/20 focus:border-scholar-accent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-scholar-accent/20 focus:border-scholar-accent transition-all"
              >
                <option value="ALL">ทุกสถานะการดำเนินงาน</option>
                {ACADEMIC_SERVICE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SDG Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedSdg}
                onChange={(e) => setSelectedSdg(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-scholar-accent/20 focus:border-scholar-accent transition-all"
              >
                <option value="ALL">เป้าหมายความยั่งยืน SDGs (ทั้งหมด)</option>
                {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num.toString()}>
                    SDG {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pill Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> หมวดหมู่:
              </span>
              <button
                type="button"
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedType === 'ALL'
                    ? 'bg-scholar-deep text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด ({initialProjects.length})
              </button>

              {ACADEMIC_SERVICE_TYPES.map((service) => {
                const isSelected = selectedType === service.value;
                const count = countsByType[service.value] || 0;
                return (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => setSelectedType(service.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-scholar-deep text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {service.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 py-1 px-2 rounded hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            แสดงผลลัพธ์ <strong>{filteredProjects.length}</strong> จากทั้งหมด{' '}
            <strong>{initialProjects.length}</strong> โครงการ
          </span>
          {selectedType !== 'ALL' && (
            <span>
              หมวด:{' '}
              <span className="font-semibold text-scholar-deep">
                {getServiceTypeConfig(selectedType).label}
              </span>
            </span>
          )}
        </div>
      </section>

      {/* 3. PROJECTS GRID (Clean, uncluttered cards) */}
      <section>
        {filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">ไม่พบโครงการที่ค้นหา</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              ไม่มีข้อมูลโครงการบริการวิชาการที่ตรงกับคำค้นหาหรือเงื่อนไขตัวกรองที่คุณเลือก
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-scholar-deep text-white text-xs font-bold hover:bg-scholar-accent transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ล้างการค้นหาและแสดงทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const typeConfig = getServiceTypeConfig(project.serviceType);
              const statusConfig = getStatusConfig(project.status || 'ONGOING');
              const leader = (project.members || []).find((m) => m.role === 'LEADER') || (project.members || [])[0];

              return (
                <Link
                  href={`/research/services/${project.id}`}
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-scholar-accent/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Image & Status Badge */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {project.coverImageUrl ? (
                        <Image
                          src={project.coverImageUrl}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                          <HeartHandshake className="w-12 h-12 stroke-[1.2]" />
                        </div>
                      )}

                      {/* Status Tag */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md border ${statusConfig.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-900/85 text-white backdrop-blur-sm">
                          {typeConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 group-hover:text-scholar-accent transition-colors leading-snug">
                        {project.title}
                      </h3>

                      {/* Area Meta */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-scholar-accent shrink-0" />
                        <span className="line-clamp-1">{project.area || 'ไม่ระบุพื้นที่ชุมชน'}</span>
                      </div>

                      {/* Description Excerpt */}
                      {project.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                      )}

                      {/* SDG Badges (Mini) */}
                      {project.sdgIds && project.sdgIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.sdgIds.slice(0, 4).map((sdg) => (
                            <span
                              key={sdg}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              SDG {sdg}
                            </span>
                          ))}
                          {project.sdgIds.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                              +{project.sdgIds.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Team Leader & View Detail */}
                  <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    {leader ? (
                      <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[65%]">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {leader.prefix || ''}{leader.firstNameTh || ''} {leader.lastNameTh || ''}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">คณะสังคมศาสตร์</span>
                    )}

                    <span className="inline-flex items-center gap-1 font-semibold text-scholar-accent group-hover:translate-x-1 transition-transform shrink-0">
                      รายละเอียด <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. SERVICE REQUEST CTA BANNER (Directs to Dedicated Request Page) */}
      <section className="pt-4">
        <div className="bg-gradient-to-r from-scholar-deep via-slate-900 to-scholar-deep rounded-xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-scholar-gold mb-2 block">
              Official Service Request Portal
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">
              ต้องการขอรับบริการวิชาการหรือวิทยากร?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              หน่วยงาน ชุมชน อปท. หรือโรงเรียน ที่ประสงค์ขอรับการถ่ายทอดองค์ความรู้ ขอความอนุเคราะห์วิทยากร หรือปรึกษาวิจัย สามารถดูขั้นตอนและดาวน์โหลดแบบฟอร์มคำขอได้ที่ศูนย์ประสานงาน
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/research/services/request"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-scholar-deep hover:bg-scholar-accent hover:text-white font-bold text-sm transition-all duration-200 shadow-md"
            >
              ยื่นคำขอรับบริการและดาวน์โหลดแบบฟอร์ม <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
