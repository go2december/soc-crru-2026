'use client';

import { useMemo, useState } from 'react';
import {
  Handshake,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Search,
  RotateCcw,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MOU_PARTNER_TYPES, MouItem, getPartnerTypeConfig } from '@/lib/mous';

export default function MouClient({ initialItems }: { initialItems: MouItem[] }) {
  const [items] = useState<MouItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const govCount = items.filter((i) => i.partnerType === 'GOVERNMENT').length;
    const commCount = items.filter((i) => i.partnerType === 'COMMUNITY').length;
    const acadCount = items.filter((i) => i.partnerType === 'ACADEMIC').length;
    const privCount = items.filter((i) => i.partnerType === 'PRIVATE').length;
    return { total, govCount, commCount, acadCount, privCount };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'ALL' && item.partnerType !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchPartner = item.partnerName?.toLowerCase().includes(q);
        const matchScope = item.scope?.toLowerCase().includes(q);
        return matchTitle || matchPartner || matchScope;
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Category Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="ค้นหาชื่อบันทึกข้อตกลง หรือชื่อหน่วยงานภาคีความร่วมมือ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-slate-50 border-slate-200 text-base rounded-lg"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ALL'
                ? 'bg-scholar-deep text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            ทั้งหมด ({metrics.total})
          </button>
          {MOU_PARTNER_TYPES.map((type) => {
            let count = 0;
            if (type.value === 'GOVERNMENT') count = metrics.govCount;
            if (type.value === 'COMMUNITY') count = metrics.commCount;
            if (type.value === 'ACADEMIC') count = metrics.acadCount;
            if (type.value === 'PRIVATE') count = metrics.privCount;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setActiveTab(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === type.value
                    ? 'bg-scholar-deep text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type.label} ({count})
              </button>
            );
          })}

          {(searchQuery || activeTab !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="text-slate-500 hover:text-slate-800 ml-auto text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> ล้างการค้นหา
            </Button>
          )}
        </div>
      </div>

      {/* 2. Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-400">
          <Handshake className="w-16 h-16 mx-auto mb-4 opacity-30 text-scholar-deep" />
          <h3 className="text-lg font-bold text-slate-700">ไม่พบบันทึกข้อตกลงความร่วมมือ</h3>
          <p className="text-sm mt-1 max-w-md mx-auto">
            ไม่พบข้อมูลตรงตามเงื่อนไขที่เลือก กรุณาลองค้นหาด้วยคำอื่น หรือเลือกประเภทภาคีอื่น
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const partnerConfig = getPartnerTypeConfig(item.partnerType);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:border-scholar-accent/40"
              >
                {/* Card Top: Logo & Type Badge */}
                <div className="p-6 pb-4 flex items-start gap-4 border-b border-slate-100 bg-slate-50/40">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                    {item.partnerLogoUrl ? (
                      <img
                        src={item.partnerLogoUrl}
                        alt={item.partnerName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border mb-1.5 ${partnerConfig.badgeColor}`}
                    >
                      {partnerConfig.label}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-scholar-deep transition-colors">
                      {item.partnerName}
                    </h3>
                  </div>
                </div>

                {/* Card Body: Title & Scope */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed mb-2">
                      {item.title}
                    </h4>
                    {item.scope && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">
                        {item.scope}
                      </p>
                    )}
                  </div>

                  {/* Metadata: Period & Status */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {item.startDate ? (
                            <>
                              {new Date(item.startDate).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                              })}
                              {item.endDate
                                ? ` - ${new Date(item.endDate).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'short',
                                  })}`
                                : ' (ต่อเนื่อง)'}
                            </>
                          ) : (
                            'บันทึกข้อตกลงต่อเนื่อง'
                          )}
                        </span>
                      </span>

                      {item.isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> มีผลบังคับใช้
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action Links */}
                {(item.websiteUrl || item.documentUrl) && (
                  <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    {item.websiteUrl ? (
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" /> เว็บไซต์หน่วยงาน
                      </a>
                    ) : (
                      <span />
                    )}

                    {item.documentUrl && (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-scholar-accent hover:text-red-700 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" /> เอกสารฉบับเต็ม
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
