'use client';

import React from 'react';
import {
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Wifi,
  Building2,
  LayoutGrid,
} from 'lucide-react';
import { StudentServiceCategory, STUDENT_CATEGORIES } from '@/lib/student-services';

interface StudentCategoryTabsProps {
  selectedCategory: StudentServiceCategory;
  onSelectCategory: (cat: StudentServiceCategory) => void;
  categoryCounts: Record<string, number>;
}

export default function StudentCategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: StudentCategoryTabsProps) {
  const getCategoryIcon = (iconName: string) => {
    const className = 'w-3.5 h-3.5';
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Wifi':
        return <Wifi className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      default:
        return <LayoutGrid className={className} />;
    }
  };

  return (
    <div className="mb-8 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 shrink-0">
        {STUDENT_CATEGORIES.map((tab) => {
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
