'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';
import {
  PROCUREMENT_TYPES,
  PROCUREMENT_CATEGORIES,
  PROCUREMENT_STATUSES,
} from '@/lib/procurement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProcurementFilterBarProps {
  currentSearch?: string;
  currentYear?: number;
  currentType?: string;
  currentCategory?: string;
  currentStatus?: string;
  fiscalYears: number[];
  viewMode: 'ledger' | 'grid';
  onViewModeChange: (mode: 'ledger' | 'grid') => void;
  totalRecords: number;
}

export default function ProcurementFilterBar({
  currentSearch,
  currentYear,
  currentType,
  currentCategory,
  currentStatus,
  fiscalYears,
  viewMode,
  onViewModeChange,
  totalRecords,
}: ProcurementFilterBarProps) {
  const hasActiveFilters = !!(
    currentSearch ||
    currentYear ||
    currentType ||
    currentCategory ||
    currentStatus
  );

  return (
    <div className="bg-white border border-stone-200/90 rounded-sm p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      {/* Top Controls: Search Input + View Mode Toggle */}
      <form method="GET" className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              name="q"
              defaultValue={currentSearch || ''}
              placeholder="ค้นหาชื่อโครงการ, รายการจัดซื้อจัดจ้าง, หรือชื่อผู้เสนอราคา/คู่สัญญา..."
              className="pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50/60 border-stone-200 rounded-sm focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Button
              type="submit"
              size="sm"
              className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs font-medium px-5 gap-1.5 h-9 w-full md:w-auto"
            >
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหา</span>
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-stone-200 rounded-sm p-0.5 bg-stone-50 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange('ledger')}
                title="แสดงผลแบบตารางสารบัญราชการ (Ledger Table)"
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'ledger'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                title="แสดงผลแบบการ์ดโครงการ (Visual Grid)"
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* 1. Fiscal Year */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block uppercase tracking-wider">
              ปีงบประมาณ
            </label>
            <select
              name="year"
              defaultValue={currentYear || ''}
              className="w-full px-3 py-2 text-xs bg-stone-50/60 border border-stone-200 rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">ทุกปีงบประมาณ</option>
              {fiscalYears.map((y) => (
                <option key={y} value={y}>
                  ปีงบประมาณ พ.ศ. {y}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Procurement Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block uppercase tracking-wider">
              วิธีการจัดซื้อจัดจ้าง
            </label>
            <select
              name="type"
              defaultValue={currentType || ''}
              className="w-full px-3 py-2 text-xs bg-stone-50/60 border border-stone-200 rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">ทุกวิธีจัดซื้อ</option>
              {PROCUREMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block uppercase tracking-wider">
              หมวดหมู่งาน
            </label>
            <select
              name="category"
              defaultValue={currentCategory || ''}
              className="w-full px-3 py-2 text-xs bg-stone-50/60 border border-stone-200 rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">ทุกหมวดหมู่งาน</option>
              {PROCUREMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Status */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block uppercase tracking-wider">
              สถานะโครงการ
            </label>
            <select
              name="status"
              defaultValue={currentStatus || ''}
              className="w-full px-3 py-2 text-xs bg-stone-50/60 border border-stone-200 rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">ทุกสถานะ</option>
              {PROCUREMENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Counter & Reset Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              พบ <strong>{totalRecords}</strong> รายการประกาศ
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200">
                <SlidersHorizontal className="w-3 h-3" /> มีการกรองเงื่อนไข
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <Link
              href="/eservice/procurement"
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-sm transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
