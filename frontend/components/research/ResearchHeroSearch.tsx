'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickFilter {
  label: string;
  href: string;
  tag?: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  { label: 'ชุมชนและสังคมล้านนา', href: '/research/database?q=ล้านนา' },
  { label: 'SDG 1 ขจัดความยากจน', href: '/research/database?sdg=1', tag: 'SDG 1' },
  { label: 'SDG 4 คุณภาพการศึกษา', href: '/research/database?sdg=4', tag: 'SDG 4' },
  { label: 'SDG 11 ชุมชนยั่งยืน', href: '/research/database?sdg=11', tag: 'SDG 11' },
  { label: 'SDG 16 ความยุติธรรม', href: '/research/database?sdg=16', tag: 'SDG 16' },
  { label: 'บริการวิชาการ', href: '/research/database?isSocialService=true' },
];

export default function ResearchHeroSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/research/database?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/research/database');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="w-full max-w-3xl mt-8"
    >
      {/* Search Input Box with Visual Subtraction */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative flex items-center bg-white rounded-xl p-1.5 shadow-xl shadow-slate-950/20 border border-slate-200/80 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
          <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-amber-600 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหางานวิจัย, ชื่อบทความ, ผู้แต่ง, คำสำคัญ, หรือวิทยานิพนธ์..."
            className="w-full py-3 px-2 text-sm md:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-sans"
            aria-label="ค้นหาฐานข้อมูลงานวิจัย"
          />
          <Button
            type="submit"
            className="shrink-0 h-11 px-5 rounded-lg bg-scholar-accent hover:bg-orange-700 text-white font-medium text-sm transition-all duration-200 shadow-sm"
          >
            <span>ค้นหาวิจัย</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline-block ml-1" />
          </Button>
        </div>
      </form>

      {/* Quick Filter Tags with Motion Springs */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 pr-1">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>หัวข้อยอดนิยม:</span>
        </div>
        {QUICK_FILTERS.map((item, idx) => (
          <motion.button
            key={idx}
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push(item.href)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
          >
            {item.tag && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
