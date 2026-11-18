'use client';

import React from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  ListFilter,
  X,
} from 'lucide-react';
import { MOU_PARTNER_TYPES } from '@/lib/mous';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MouFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
  onStatusFilterChange: (status: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
  viewMode: 'grid' | 'ledger';
  onViewModeChange: (mode: 'grid' | 'ledger') => void;
  countsByType: Record<string, number>;
  totalResults: number;
  totalAll: number;
  onReset: () => void;
}

export default function MouFilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  countsByType,
  totalResults,
  totalAll,
  onReset,
}: MouFilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedType !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div id="mou-directory-section" className="scroll-mt-24 mb-8 space-y-4">
      {/* Category Tab Strip */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectType('ALL')}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
              selectedType === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            ทั้งหมด ({totalAll})
          </button>

          {MOU_PARTNER_TYPES.map((type) => {
            const isSelected = selectedType === type.value;
            const count = countsByType[type.value] || 0;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onSelectType(type.value)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                {type.label} ({count})
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle (Grid vs Ledger Table) */}
        <div className="flex items-center gap-1 border border-stone-200 rounded-sm p-0.5 bg-stone-50 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            title="แสดงผลแบบการ์ดภาคี (Visual Grid)"
            className={`p-1.5 rounded-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('ledger')}
            title="แสดงผลแบบสารบัญวิชาการ (Ledger Table)"
            className={`p-1.5 rounded-xs transition-colors ${
              viewMode === 'ledger'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search & Status Controls */}
      <div className="bg-white border border-stone-200/90 rounded-sm p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="ค้นหาชื่อบันทึกข้อตกลง, หน่วยงานภาคี, หรือขอบเขตความร่วมมือ..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs md:text-sm bg-stone-50/60 border-stone-200 rounded-sm focus-visible:ring-primary focus-visible:border-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="ล้างข้อความค้นหา"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')
              }
              className="w-full px-3 py-2 text-xs md:text-sm bg-stone-50/60 border border-stone-200 rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="ACTIVE">มีผลบังคับใช้ (Active)</option>
              <option value="INACTIVE">ครบกำหนด / สิ้นสุดระยะเวลา</option>
            </select>
          </div>
        </div>

        {/* Counter and Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-stone-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              แสดง <strong>{totalResults}</strong> จากทั้งหมด <strong>{totalAll}</strong> ข้อตกลง
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200">
                <SlidersHorizontal className="w-3 h-3" /> มีการกรองข้อมูล
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 rounded-sm gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
