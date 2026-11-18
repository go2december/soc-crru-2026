'use client';

import React, { useState, useMemo } from 'react';
import { AcademicServiceItem } from '@/lib/academic-services';
import AcademicServicesHero from './components/AcademicServicesHero';
import AcademicServicesFlagship from './components/AcademicServicesFlagship';
import AcademicServicesFilterBar from './components/AcademicServicesFilterBar';
import AcademicServicesGrid from './components/AcademicServicesGrid';
import AcademicServicesQuickView from './components/AcademicServicesQuickView';
import AcademicServicesRequestCTA from './components/AcademicServicesRequestCTA';

interface AcademicServicesClientProps {
  initialProjects: AcademicServiceItem[];
}

export default function AcademicServicesClient({
  initialProjects,
}: AcademicServicesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSdg, setSelectedSdg] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'ledger'>('grid');

  // Quick View Dialog State
  const [quickViewProject, setQuickViewProject] = useState<AcademicServiceItem | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleOpenQuickView = (project: AcademicServiceItem) => {
    setQuickViewProject(project);
    setQuickViewOpen(true);
  };

  // Compute Statistics for Hero Banner
  const stats = useMemo(() => {
    const totalProjects = initialProjects.length;

    // Unique communities/areas
    const areaSet = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.area && p.area.trim()) {
        areaSet.add(p.area.trim());
      }
    });
    const totalCommunities = areaSet.size > 0 ? areaSet.size : Math.max(totalProjects, 1);

    // Unique SDGs
    const sdgSet = new Set<number>();
    initialProjects.forEach((p) => {
      if (Array.isArray(p.sdgIds)) {
        p.sdgIds.forEach((id) => sdgSet.add(id));
      }
    });
    const uniqueSdgsCount = sdgSet.size > 0 ? sdgSet.size : 17;

    // Unique faculty/members
    const memberSet = new Set<string>();
    initialProjects.forEach((p) => {
      if (Array.isArray(p.members)) {
        p.members.forEach((m) => {
          if (m.staffId) memberSet.add(m.staffId);
          else if (m.firstNameTh) memberSet.add(`${m.firstNameTh}_${m.lastNameTh}`);
        });
      }
    });
    const totalFaculty = memberSet.size > 0 ? memberSet.size : 25;

    return {
      totalProjects,
      totalCommunities,
      uniqueSdgsCount,
      totalFaculty,
    };
  }, [initialProjects]);

  // Compute counts per category
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialProjects.length };
    for (const project of initialProjects) {
      const type = project.serviceType || 'OTHER';
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [initialProjects]);

  // Pick a flagship project (e.g., project with cover image or first item)
  const flagshipProject = useMemo(() => {
    if (initialProjects.length === 0) return null;
    return (
      initialProjects.find((p) => p.coverImageUrl && p.description) ||
      initialProjects[0]
    );
  }, [initialProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Keyword search (Title, Description, Area, Members)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = (project.description || '').toLowerCase().includes(query);
        const areaMatch = (project.area || '').toLowerCase().includes(query);
        const memberMatch = (project.members || []).some((m) =>
          `${m.prefix || ''}${m.firstNameTh || ''} ${m.lastNameTh || ''}`
            .toLowerCase()
            .includes(query)
        );
        if (!titleMatch && !descMatch && !areaMatch && !memberMatch) {
          return false;
        }
      }

      // 2. Service Type Filter
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSelectedSdg('ALL');
  };

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna Modernist + Big Numbers) */}
      <AcademicServicesHero
        totalProjects={stats.totalProjects}
        totalCommunities={stats.totalCommunities}
        uniqueSdgsCount={stats.uniqueSdgsCount}
        totalFaculty={stats.totalFaculty}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Flagship Highlight */}
        <AcademicServicesFlagship
          flagshipProject={flagshipProject}
          onOpenQuickView={handleOpenQuickView}
        />

        {/* 2.2 Search & Filter Strip */}
        <AcademicServicesFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          selectedSdg={selectedSdg}
          onSelectSdg={setSelectedSdg}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          countsByType={countsByType}
          totalResults={filteredProjects.length}
          totalAll={initialProjects.length}
          onReset={handleResetFilters}
        />

        {/* 2.3 Projects Grid / Ledger View */}
        <AcademicServicesGrid
          projects={filteredProjects}
          viewMode={viewMode}
          onOpenQuickView={handleOpenQuickView}
          onResetFilters={handleResetFilters}
        />

        {/* 2.4 Service Request Portal CTA (Civic Engagement Flow) */}
        <AcademicServicesRequestCTA />

        {/* 2.5 Quick View Modal (shadcn Dialog) */}
        <AcademicServicesQuickView
          project={quickViewProject}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </main>
    </>
  );
}
