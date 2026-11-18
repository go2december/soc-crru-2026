'use client';

import React, { useState, useMemo } from 'react';
import {
  StaffServiceItem,
  StaffDocumentItem,
  StaffServiceCategory,
} from '@/lib/staff-services';
import StaffHero from './components/StaffHero';
import StaffCategoryTabs from './components/StaffCategoryTabs';
import StaffServicesGrid from './components/StaffServicesGrid';
import StaffFormsPreview from './components/StaffFormsPreview';
import StaffHelpdeskSection from './components/StaffHelpdeskSection';

interface StaffClientProps {
  initialServices: StaffServiceItem[];
  initialDocuments: StaffDocumentItem[];
}

export default function StaffClient({
  initialServices,
  initialDocuments,
}: StaffClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<StaffServiceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live filter services
  const filteredServices = useMemo(() => {
    return initialServices.filter((item) => {
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchText =
        (item.title || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.badge || '').toLowerCase().includes(query);

      return matchCategory && matchText;
    });
  }, [initialServices, selectedCategory, searchQuery]);

  // Live filter documents
  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialDocuments;

    return initialDocuments.filter((doc) => {
      return (
        (doc.title || '').toLowerCase().includes(query) ||
        (doc.category || '').toLowerCase().includes(query)
      );
    });
  }, [initialDocuments, searchQuery]);

  // Top 6 most frequently used forms for staff preview
  const displayedDocuments = useMemo(() => {
    return filteredDocuments.slice(0, 6);
  }, [filteredDocuments]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialServices.length };
    for (const s of initialServices) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [initialServices]);

  const hrFinanceCount = categoryCounts['HR_FINANCE'] || 0;
  const teachingCount = categoryCounts['ACADEMIC_TEACHING'] || 0;

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna + Search + Big Numbers) */}
      <StaffHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalServices={initialServices.length}
        hrFinanceCount={hrFinanceCount}
        teachingCount={teachingCount}
        totalDocs={initialDocuments.length}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Category Tabs Bar */}
        <StaffCategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* 2.2 Central Staff E-Services Grid */}
        <StaffServicesGrid
          services={filteredServices}
          onResetFilters={handleResetFilters}
        />

        {/* 2.3 Top Faculty Administrative Forms & Petitions */}
        <StaffFormsPreview
          documents={displayedDocuments}
          totalAllDocs={initialDocuments.length}
        />

        {/* 2.4 Administrative Guidance & Helpdesk Contacts */}
        <StaffHelpdeskSection />
      </main>
    </>
  );
}
