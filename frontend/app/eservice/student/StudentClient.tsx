'use client';

import React, { useState, useMemo } from 'react';
import {
  StudentServiceItem,
  StudentDocumentItem,
  StudentServiceCategory,
} from '@/lib/student-services';
import StudentHero from './components/StudentHero';
import StudentCategoryTabs from './components/StudentCategoryTabs';
import StudentServicesGrid from './components/StudentServicesGrid';
import StudentFormsPreview from './components/StudentFormsPreview';
import StudentHelpdeskSection from './components/StudentHelpdeskSection';

interface StudentClientProps {
  initialServices: StudentServiceItem[];
  initialDocuments: StudentDocumentItem[];
}

export default function StudentClient({
  initialServices,
  initialDocuments,
}: StudentClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<StudentServiceCategory>('ALL');
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

  // Top 6 most frequently used forms for student preview
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

  const academicCount = categoryCounts['ACADEMIC'] || 0;
  const welfareCount = categoryCounts['WELFARE'] || 0;

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna + Search + Big Numbers) */}
      <StudentHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalServices={initialServices.length}
        academicCount={academicCount}
        welfareCount={welfareCount}
        totalDocs={initialDocuments.length}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Category Tabs Bar */}
        <StudentCategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* 2.2 Central E-Services Grid */}
        <StudentServicesGrid
          services={filteredServices}
          onResetFilters={handleResetFilters}
        />

        {/* 2.3 Top Faculty Petitions & Documents */}
        <StudentFormsPreview
          documents={displayedDocuments}
          totalAllDocs={initialDocuments.length}
        />

        {/* 2.4 Guidance & Support Helpdesk Contacts */}
        <StudentHelpdeskSection />
      </main>
    </>
  );
}
