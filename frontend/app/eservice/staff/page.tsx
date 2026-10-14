'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  UserCheck,
  Wallet,
  Building2,
  GraduationCap,
  CheckCircle2,
  MonitorPlay,
  Users,
  BookOpen,
  ShieldCheck,
  Coins,
  Car,
  DoorOpen,
  Wrench,
  Mail,
  Wifi,
  Search,
  ExternalLink,
  Download,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  StaffServiceItem,
  StaffDocumentItem,
  StaffServiceCategory,
  STAFF_CATEGORIES,
  FALLBACK_STAFF_SERVICES,
  FALLBACK_STAFF_DOCS,
  fetchStaffServices,
  fetchStaffDocuments,
} from '@/lib/staff-services';

// Dynamic icon mapper for staff services
function renderStaffIcon(iconKey: string, category: string) {
  const className = "w-7 h-7";
  switch (iconKey) {
    case 'FileText':
      return <FileText className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'MonitorPlay':
      return <MonitorPlay className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'DoorOpen':
      return <DoorOpen className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    default:
      if (category === 'HR_FINANCE') return <FileText className={className} />;
      if (category === 'ACADEMIC_TEACHING') return <GraduationCap className={className} />;
      if (category === 'RESEARCH_QA') return <BookOpen className={className} />;
      if (category === 'FACILITY_REPAIR') return <Wrench className={className} />;
      return <Wifi className={className} />;
  }
}

// Emerald & Teal color styling for staff modules
function getStaffCategoryStyle(category: string) {
  switch (category) {
    case 'HR_FINANCE':
      return {
        iconBg: 'bg-emerald-700 text-white shadow-emerald-700/20',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'ACADEMIC_TEACHING':
      return {
        iconBg: 'bg-teal-700 text-white shadow-teal-700/20',
        badge: 'bg-teal-50 text-teal-800 border-teal-200',
      };
    case 'RESEARCH_QA':
      return {
        iconBg: 'bg-emerald-800 text-white shadow-emerald-800/20',
        badge: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      };
    case 'FACILITY_REPAIR':
      return {
        iconBg: 'bg-amber-700 text-white shadow-amber-700/20',
        badge: 'bg-amber-50 text-amber-900 border-amber-200',
      };
    case 'DIGITAL_IT':
    default:
      return {
        iconBg: 'bg-cyan-800 text-white shadow-cyan-800/20',
        badge: 'bg-cyan-50 text-cyan-900 border-cyan-200',
      };
  }
}

export default function StaffServicePage() {
  const [selectedCategory, setSelectedCategory] = useState<StaffServiceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<StaffServiceItem[]>(FALLBACK_STAFF_SERVICES);
  const [documents, setDocuments] = useState<StaffDocumentItem[]>(FALLBACK_STAFF_DOCS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, docsData] = await Promise.all([
          fetchStaffServices(),
          fetchStaffDocuments(),
        ]);
        setServices(servicesData);
        setDocuments(docsData);
      } catch (err) {
        console.warn('Fallback staff data is active', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchText =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.badge && item.badge.toLowerCase().includes(query));

      return matchCategory && matchText;
    });
  }, [services, selectedCategory, searchQuery]);

  // Filtered Documents (Query filter)
  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;

    return documents.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query)
      );
    });
  }, [documents, searchQuery]);

  // Top 6 most frequently used forms for this main hub page
  const displayedDocuments = useMemo(() => {
    return filteredDocuments.slice(0, 6);
  }, [filteredDocuments]);

  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: services.length };
    for (const s of services) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [services]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Hero Header - Forest Emerald & Deep Teal Theme */}
      <section className="bg-gradient-to-r from-[#064E3B] via-[#065F46] to-[#047857] text-white py-14 px-4 text-center border-b-4 border-amber-400/90 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full pointer-events-none blur-2xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Link
              href="/eservice"
              className="text-xs text-white/80 hover:text-white transition-colors underline flex items-center gap-1"
            >
              ← ระบบสารสนเทศ (E-Services Hub)
            </Link>
          </div>

          <span className="inline-block px-3.5 py-1 bg-white/10 text-amber-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
            CRRU Staff & Faculty Digital Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3 tracking-tight">
            บริการสำหรับบุคลากร
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ศูนย์รวมระบบสารสนเทศ งานสารบรรณอิเล็กทรอนิกส์ การจัดการเรียนการสอน และคลังแบบฟอร์มราชการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
          </p>

          {/* Search Bar in Hero */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาระบบบริการบุคลากร เช่น e-Office, เงินเดือน, ส่งเกรด, ขอใช้รถ, แบบฟอร์มใบลา..."
                className="w-full pl-12 pr-10 py-3.5 bg-white text-slate-800 rounded-2xl shadow-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base transition-all placeholder:text-slate-400"
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
              <p className="text-xs text-white/80 text-left mt-2 pl-2">
                พบผลการค้นหา {filteredServices.length} ระบบบริการ และ {filteredDocuments.length} แบบฟอร์ม
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Module Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-2 overflow-x-auto scrollbar-none flex gap-2">
          {STAFF_CATEGORIES.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const count = categoryCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
                }`}
              >
                <span>{tab.label}</span>
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

        {/* Services Grid Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>ระบบบริการดิจิทัลบุคลากร (Staff Systems)</span>
                <span className="text-sm font-normal text-slate-500">
                  ({filteredServices.length} ระบบ)
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                คลิกเข้าสู่ระบบสารสนเทศสำหรับการปฏิบัติงานของคณาจารย์และเจ้าหน้าที่
              </p>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-semibold">ไม่พบระบบบริการที่ตรงกับเงื่อนไข</p>
              <p className="text-sm text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่ "ทั้งหมด"</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const style = getStaffCategoryStyle(service.category);
                const isInternal = !service.isExternal;

                const CardWrapper = isInternal ? Link : 'a';
                const linkProps = isInternal
                  ? { href: service.url }
                  : { href: service.url, target: '_blank', rel: 'noopener noreferrer' };

                return (
                  <CardWrapper
                    key={service.id}
                    {...linkProps}
                    className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Top: Icon & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                        >
                          {renderStaffIcon(service.icon, service.category)}
                        </div>

                        {service.badge && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}
                          >
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-6">
                        {service.description}
                      </p>
                    </div>

                    {/* Card Footer: Action Link */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-800 transition-colors">
                      <span className="flex items-center gap-1.5">
                        เข้าสู่ระบบงาน
                      </span>
                      <span className="flex items-center gap-1">
                        {isInternal ? (
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        ) : (
                          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                      </span>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          )}
        </section>

        {/* Faculty Staff Documents Section (Top 6 in 2-Column Grid) */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  คณะสังคมศาสตร์
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  แบบฟอร์มคำร้องและเอกสารสำหรับบุคลากร
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                แบบฟอร์มคำร้องที่ใช้บ่อยที่สุด 6 อันดับแรก (คลิกดูคลังแบบฟอร์มทั้งหมดเพื่อดูรายการเพิ่มเติม)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/eservice/staff/forms"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all"
              >
                <span>ดูคลังแบบฟอร์มทั้งหมด ({documents.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2-Column Grid for comfortable Thai title reading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedDocuments.map((doc) => {
              const isPdf = doc.fileType === 'PDF';
              const isDocx = doc.fileType === 'DOCX';

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm ${
                        isPdf
                          ? 'bg-rose-500'
                          : isDocx
                          ? 'bg-teal-700'
                          : 'bg-slate-600'
                      }`}
                    >
                      {doc.fileType}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>หมวด: {doc.category}</span>
                        {doc.fileSize && (
                          <>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={doc.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>ดาวน์โหลด</span>
                  </a>
                </div>
              );
            })}
          </div>

          {displayedDocuments.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-6">
              ไม่พบแบบฟอร์มที่ค้นหา
            </p>
          )}

          {/* Section Footer: Link to full staff forms repository */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              แสดง <strong>{displayedDocuments.length}</strong> แบบฟอร์มที่ใช้บ่อยที่สุด (จากคลังแบบฟอร์มทั้งหมด {documents.length} รายการ)
            </span>
            <Link
              href="/eservice/staff/forms"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-700 transition-colors"
            >
              <span>เข้าสู่คลังแบบฟอร์มคำร้องบุคลากรฉบับเต็ม ({documents.length} รายการ)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Guidance & Administrative Contacts */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] text-white rounded-2xl p-6 shadow-md border border-emerald-800">
            <div className="flex items-center gap-2.5 mb-3 text-amber-300">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">การล็อกอินเข้าสู่ระบบงาน</h3>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              ระบบสารบรรณ (e-Office) และระบบบริการอาจารย์ (REG) ใช้บัญชีผู้ใช้เดียวกับระบบเครือข่าย หรือบัญชีอีเมลองค์กร (@crru.ac.th)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2.5 mb-3 text-emerald-700">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">กองบริหารงานบุคคล มรภ.</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              ติดต่อเรื่องสวัสดิการ กองทุนสำรองเลี้ยงชีพ การขอตำแหน่งทางวิชาการ หรือสิทธิการลา ณ กองบริหารงานบุคคล อาคารบริหารส่วนกลาง
            </p>
            <span className="text-xs font-semibold text-emerald-800">โทร. 0-5377-6000 ต่อ 1100, 1105</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2.5 mb-3 text-teal-700">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">งานสารบรรณ & บริหาร คณะ</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              ยื่นหนังสือราชการ ขออนุมัติโครงการไปราชการ หรือติดต่อธุรการ ณ สำนักงานคณบดี คณะสังคมศาสตร์
            </p>
            <span className="text-xs font-semibold text-teal-800">อาคาร 4 ชั้น 1 คณะสังคมศาสตร์ (ต่อ 1214)</span>
          </div>
        </section>
      </div>
    </main>
  );
}
