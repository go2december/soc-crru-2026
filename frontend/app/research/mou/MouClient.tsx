'use client';

import React, { useState, useMemo } from 'react';
import { MouItem } from '@/lib/mous';
import MouHero from './components/MouHero';
import MouFlagship from './components/MouFlagship';
import MouFilterBar from './components/MouFilterBar';
import MouGrid from './components/MouGrid';
import MouQuickView from './components/MouQuickView';
import MouPartnershipCTA from './components/MouPartnershipCTA';

interface MouClientProps {
  initialItems: MouItem[];
}

export default function MouClient({ initialItems }: MouClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'ledger'>('grid');

  // Quick View State
  const [quickViewItem, setQuickViewItem] = useState<MouItem | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleOpenQuickView = (item: MouItem) => {
    setQuickViewItem(item);
    setQuickViewOpen(true);
  };

  // Compute Metrics
  const metrics = useMemo(() => {
    const totalMous = initialItems.length;
    const govCount = initialItems.filter((i) => i.partnerType === 'GOVERNMENT').length;
    const communityCount = initialItems.filter((i) => i.partnerType === 'COMMUNITY').length;
    const academicCount = initialItems.filter((i) => i.partnerType === 'ACADEMIC').length;
    const privateCount = initialItems.filter((i) => i.partnerType === 'PRIVATE').length;

    return {
      totalMous,
      govCount,
      communityCount,
      academicCount,
      privateCount,
    };
  }, [initialItems]);

  // Compute counts per type
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialItems.length };
    for (const item of initialItems) {
      const type = item.partnerType || 'OTHER';
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [initialItems]);

  // Flagship Item (First item with logo or first active)
  const flagshipItem = useMemo(() => {
    if (initialItems.length === 0) return null;
    return (
      initialItems.find((i) => i.partnerLogoUrl && i.scope && i.isActive) ||
      initialItems.find((i) => i.isActive) ||
      initialItems[0]
    );
  }, [initialItems]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // 1. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchPartner = (item.partnerName || '').toLowerCase().includes(q);
        const matchScope = (item.scope || '').toLowerCase().includes(q);
        if (!matchTitle && !matchPartner && !matchScope) {
          return false;
        }
      }

      // 2. Partner Type Filter
      if (selectedType !== 'ALL') {
        if (item.partnerType !== selectedType) {
          return false;
        }
      }

      // 3. Status Filter
      if (statusFilter === 'ACTIVE' && !item.isActive) {
        return false;
      }
      if (statusFilter === 'INACTIVE' && item.isActive) {
        return false;
      }

      return true;
    });
  }, [initialItems, searchQuery, selectedType, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setStatusFilter('ALL');
  };

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna + Quick Stats Ribbon) */}
      <MouHero
        totalMous={metrics.totalMous}
        govCount={metrics.govCount}
        communityCount={metrics.communityCount}
        academicCount={metrics.academicCount}
        privateCount={metrics.privateCount}
      />

      {/* 2. MAIN CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Flagship Alliance Showcase */}
        <MouFlagship
          flagship={flagshipItem}
          onOpenQuickView={handleOpenQuickView}
        />

        {/* 2.2 Instant Filter Bar */}
        <MouFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          countsByType={countsByType}
          totalResults={filteredItems.length}
          totalAll={initialItems.length}
          onReset={handleResetFilters}
        />

        {/* 2.3 Grid / Ledger View */}
        <MouGrid
          items={filteredItems}
          viewMode={viewMode}
          onOpenQuickView={handleOpenQuickView}
          onResetFilters={handleResetFilters}
        />

        {/* 2.4 Partnership Inquiry Call to Action */}
        <MouPartnershipCTA />

        {/* 2.5 Quick View Modal (shadcn Dialog) */}
        <MouQuickView
          item={quickViewItem}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </main>
    </>
  );
}
