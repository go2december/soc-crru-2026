'use client';

import React, { useState } from 'react';
import { ProcurementRecord } from '@/lib/procurement';
import ProcurementHero from './components/ProcurementHero';
import ProcurementFilterBar from './components/ProcurementFilterBar';
import ProcurementLedgerTable from './components/ProcurementLedgerTable';
import ProcurementCardsGrid from './components/ProcurementCardsGrid';
import ProcurementNoticeSection from './components/ProcurementNoticeSection';
import MinimalPagination from '@/components/MinimalPagination';

interface ProcurementClientProps {
  records: ProcurementRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  totalBudget: number;
  completedCount: number;
  fiscalYears: number[];
  currentYear?: number;
  currentType?: string;
  currentCategory?: string;
  currentStatus?: string;
  currentSearch?: string;
}

export default function ProcurementClient({
  records,
  meta,
  totalBudget,
  completedCount,
  fiscalYears,
  currentYear,
  currentType,
  currentCategory,
  currentStatus,
  currentSearch,
}: ProcurementClientProps) {
  const [viewMode, setViewMode] = useState<'ledger' | 'grid'>('ledger');

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna + Quick Stats Ribbon) */}
      <ProcurementHero
        totalRecords={meta.total}
        totalBudget={totalBudget}
        completedCount={completedCount}
        currentYear={currentYear}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Filter & Search Bar with Dual View Mode Toggle */}
        <ProcurementFilterBar
          currentSearch={currentSearch}
          currentYear={currentYear}
          currentType={currentType}
          currentCategory={currentCategory}
          currentStatus={currentStatus}
          fiscalYears={fiscalYears}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalRecords={meta.total}
        />

        {/* 2.2 Dual View Render (Ledger Table vs Cards Grid) */}
        {records.length === 0 ? (
          <div className="bg-white rounded-sm border border-stone-200/90 p-12 text-center shadow-xs">
            <p className="text-base font-bold text-slate-800 mb-1 font-heading">
              ไม่พบรายการจัดซื้อจัดจ้างตามเงื่อนไขที่ค้นหา
            </p>
            <p className="text-xs text-slate-500 mb-4 font-light">
              ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองปีงบประมาณและหมวดหมู่อีกครั้ง
            </p>
          </div>
        ) : viewMode === 'ledger' ? (
          <ProcurementLedgerTable records={records} />
        ) : (
          <ProcurementCardsGrid records={records} />
        )}

        {/* 2.3 Pagination */}
        {meta.totalPages > 1 && (
          <div className="pt-8">
            <MinimalPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              basePath="/eservice/procurement"
              searchParams={{
                ...(currentYear ? { year: currentYear.toString() } : {}),
                ...(currentType ? { type: currentType } : {}),
                ...(currentCategory ? { category: currentCategory } : {}),
                ...(currentStatus ? { status: currentStatus } : {}),
                ...(currentSearch ? { q: currentSearch } : {}),
              }}
            />
          </div>
        )}

        {/* 2.4 Governance, e-GP Notice & Contacts */}
        <ProcurementNoticeSection />
      </main>
    </>
  );
}
