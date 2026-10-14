'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Download,
  Filter,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  StudentDocumentItem,
  FALLBACK_STUDENT_DOCS,
  fetchStudentDocuments,
} from '@/lib/student-services';

const FORM_CATEGORIES = [
  { id: 'ALL', label: 'ทั้งหมด (All Forms)' },
  { id: 'คำร้องทั่วไป', label: 'คำร้องทั่วไป' },
  { id: 'การฝึกงานและสหกิจศึกษา', label: 'การฝึกงานและสหกิจศึกษา' },
  { id: 'คำร้องทางวิชาการ', label: 'คำร้องทางวิชาการ' },
  { id: 'วิจัยและสารนิพนธ์', label: 'วิจัยและสารนิพนธ์' },
  { id: 'ทุนและสวัสดิการ', label: 'ทุนและสวัสดิการ' },
];

export default function StudentFormsPage() {
  const [documents, setDocuments] = useState<StudentDocumentItem[]>(FALLBACK_STUDENT_DOCS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFileType, setSelectedFileType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchStudentDocuments();
        if (data && data.length > 0) {
          setDocuments(data);
        }
      } catch (err) {
        console.warn('Using fallback forms data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered documents by search, category, and fileType
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory =
        selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchFileType =
        selectedFileType === 'ALL' || doc.fileType === selectedFileType;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory && matchFileType;

      const matchText =
        doc.title.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        doc.fileType.toLowerCase().includes(query);

      return matchCategory && matchFileType && matchText;
    });
  }, [documents, selectedCategory, selectedFileType, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: documents.length };
    for (const d of documents) {
      counts[d.category] = (counts[d.category] || 0) + 1;
    }
    return counts;
  }, [documents]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-scholar-deep via-[#1A264F] to-scholar-deep text-white py-14 px-4 text-center border-b-4 border-scholar-accent relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-scholar-accent/10 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-center gap-1.5 text-xs text-white/70 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/eservice" className="hover:text-white transition-colors">ระบบสารสนเทศ (E-Services)</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/eservice/student" className="hover:text-white transition-colors">บริการสำหรับนักศึกษา</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-scholar-gold font-semibold">แบบฟอร์มคำร้องและเอกสาร</span>
          </nav>

          <span className="inline-block px-3.5 py-1 bg-white/10 text-scholar-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
            Faculty of Social Sciences Official Forms
          </span>

          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3 tracking-tight">
            คลังแบบฟอร์มคำร้องและเอกสารที่จำเป็น
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ศูนย์รวมดาวน์โหลดแบบฟอร์มคำร้องทางการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย สำหรับนักศึกษาทุกระดับชั้น
          </p>

          {/* Search Box in Hero */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อแบบฟอร์มคำร้อง เช่น ฝึกงาน, สหกิจ, เพิ่ม-ถอน, เทียบโอน, ทุน..."
                className="w-full pl-12 pr-10 py-3.5 bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-scholar-accent text-sm md:text-base transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-xs text-white/70 text-left mt-2 pl-2">
                พบผลการค้นหา {filteredDocuments.length} แบบฟอร์ม
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-2 overflow-x-auto scrollbar-none flex gap-2">
          {FORM_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Header & File Type Filter */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/eservice/student"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้าบริการนักศึกษา</span>
            </Link>

            <span className="text-sm text-slate-500">
              แสดง <strong>{filteredDocuments.length}</strong> จากทั้งหมด {documents.length} แบบฟอร์ม
            </span>
          </div>

          {/* File Type Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">ชนิดไฟล์:</span>
            {['ALL', 'PDF', 'DOCX'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFileType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  selectedFileType === type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type === 'ALL' ? 'ทั้งหมด' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="mt-6">
          {filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-semibold">ไม่พบแบบฟอร์มคำร้องที่ตรงกับคำค้นหา</p>
              <p className="text-sm text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ "ทั้งหมด"</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedFileType('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDocuments.map((doc) => {
                const isPdf = doc.fileType === 'PDF';
                const isDocx = doc.fileType === 'DOCX';

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg text-white shadow-xs ${
                            isPdf ? 'bg-rose-500' : isDocx ? 'bg-blue-600' : 'bg-slate-600'
                          }`}
                        >
                          {doc.fileType}
                        </span>

                        <span className="text-[11px] font-medium px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                          {doc.category}
                        </span>
                      </div>

                      {/* Document Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-scholar-deep transition-colors line-clamp-2 mb-3 leading-snug">
                        {doc.title}
                      </h3>
                    </div>

                    {/* Bottom Metadata & Download Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-500">
                        {doc.fileSize ? `ขนาด: ${doc.fileSize}` : 'แบบฟอร์มทางการ'}
                      </span>

                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-scholar-deep text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลด</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Instructions & Guidelines Box */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-scholar-accent/10 text-scholar-deep flex items-center justify-center font-bold">
              ℹ️
            </div>
            <h2 className="text-xl font-bold text-slate-900">ขั้นตอนการยื่นคำร้องของนักศึกษา</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-scholar-deep px-2 py-0.5 bg-white rounded-md border border-slate-200 inline-block mb-2">
                ขั้นตอนที่ 1
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">ดาวน์โหลดและกรอกข้อมูล</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ดาวน์โหลดแบบฟอร์มที่ต้องการ กรอกข้อความให้ครบถ้วน ชัดเจน พร้อมแนบเอกสารประกอบ (ถ้ามี)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-scholar-deep px-2 py-0.5 bg-white rounded-md border border-slate-200 inline-block mb-2">
                ขั้นตอนที่ 2
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">เสนออาจารย์ที่ปรึกษาลงนาม</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                นำคำร้องเสนออาจารย์ที่ปรึกษาหรือประธานหลักสูตรเพื่อตรวจสอบและลงความเห็นชอบ
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-scholar-deep px-2 py-0.5 bg-white rounded-md border border-slate-200 inline-block mb-2">
                ขั้นตอนที่ 3
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">ยื่น ณ สำนักงานคณบดี</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ยื่นเอกสารฉบับจริง ณ งานบริการการศึกษา อาคาร 4 ชั้น 1 คณะสังคมศาสตร์ หรือส่งตามระบบออนไลน์ที่กำหนด
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span>สำนักงานคณบดี คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</span>
            <span>ติดต่อสอบถาม: โทร. 0-5377-6000 ต่อ 1214 (จันทร์ - ศุกร์ 08:30 - 16:30 น.)</span>
          </div>
        </section>
      </div>
    </main>
  );
}
