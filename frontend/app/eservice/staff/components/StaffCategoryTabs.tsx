'use client';

import React from 'react';
import {
  FileText,
  GraduationCap,
  FlaskConical,
  Wrench,
  Wifi,
  LayoutGrid,
} from 'lucide-react';
import { StaffServiceCategory, STAFF_CATEGORIES } from '@/lib/staff-services';

interface StaffCategoryTabsProps {
  selectedCategory: StaffServiceCategory;
  onSelectCategory: (cat: StaffServiceCategory) => void;
  categoryCounts: Record<string, number>;
}

export default function StaffCategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: StaffCategoryTabsProps) {
  const getCategoryIcon = (iconName: string) => {
    const className = 'w-3.5 h-3.5';
    switch (iconName) {
      case 'FileText':
        return <FileText className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Wifi':
        return <Wifi className={className} />;
      default:
        return <LayoutGrid className={className} />;
    }
  };

  return (
    <div className="mb-8 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 shrink-0">
        {STAFF_CATEGORIES.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          const count = categoryCounts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <span>{getCategoryIcon(tab.icon)}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
