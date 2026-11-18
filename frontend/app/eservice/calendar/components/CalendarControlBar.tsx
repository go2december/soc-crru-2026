'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  RotateCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalendarControlBarProps {
  currentMonthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  viewMode: 'grid' | 'agenda';
  onViewModeChange: (mode: 'grid' | 'agenda') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalFilteredCount: number;
}

export default function CalendarControlBar({
  currentMonthLabel,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  totalFilteredCount,
}: CalendarControlBarProps) {
  return (
    <div className="bg-white border border-stone-200/90 rounded-sm p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border border-stone-200 rounded-sm p-0.5 bg-stone-50">
            <button
              type="button"
              onClick={onPrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xs hover:bg-white transition-colors"
              title="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xs hover:bg-white transition-colors"
              title="เดือนถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="rounded-sm border-stone-300 text-xs text-slate-700 hover:text-slate-900 h-8 px-3"
          >
            วันนี้ (Today)
          </Button>

          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 ml-2 tracking-tight">
            {currentMonthLabel}
          </h2>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="ค้นหากำหนดการ / กิจกรรม..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-7 py-1.5 text-xs bg-stone-50/60 border-stone-200 rounded-sm focus-visible:ring-primary focus-visible:border-primary h-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="ล้างการค้นหา"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sync Refresh Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-sm border-stone-300 text-xs text-slate-700 hover:text-slate-900 h-8 gap-1.5 w-full sm:w-auto"
            title="ซิงค์ข้อมูลล่าสุดจาก Google Calendar"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden sm:inline">ซิงค์สด</span>
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-stone-200 rounded-sm p-0.5 bg-stone-50 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="มุมมองช่องปฏิทินรายเดือน (Month Grid)"
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
              onClick={() => onViewModeChange('agenda')}
              title="มุมมองกำหนดการเรียงตามวัน (Agenda View)"
              className={`p-1.5 rounded-xs transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Info */}
      {searchQuery && (
        <div className="pt-2 border-t border-stone-100 text-xs text-slate-500 flex items-center justify-between">
          <span>
            พบ <strong>{totalFilteredCount}</strong> กิจกรรมที่ตรงกับคำค้นหา
          </span>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-primary hover:underline"
          >
            แสดงกิจกรรมทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
}
