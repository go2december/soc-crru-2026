'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  Crown,
  UserCircle2,
  Lightbulb,
  Globe,
  Fingerprint,
  BookOpen,
  ExternalLink,
  Building2,
  Check,
  FileText,
  Lock,
  Quote,
  Handshake,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Copy,
  FlaskConical,
} from 'lucide-react';
import RequestResumeModal from './RequestResumeModal';
import {
  getFullName,
  getFullNameEn,
  getGoogleScholarLink,
  getOrcidLink,
  getScopusLink,
  Staff,
  LinkedResearchProject,
} from '@/lib/staff';
import { getAssetUrl } from '@/lib/api-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getRoleBadge = (role: LinkedResearchProject['role']) => {
  switch (role) {
    case 'HEAD':
      return {
        text: 'หัวหน้าโครงการ (PI)',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      };
    case 'CO_RESEARCHER':
      return {
        text: 'ผู้ร่วมวิจัย (Co-PI)',
        bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      };
    case 'ADVISOR':
      return {
        text: 'ที่ปรึกษาโครงการ',
        bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      };
    default:
      return {
        text: 'คณะผู้วิจัย',
        bg: 'bg-slate-50 text-slate-700 border-slate-200/80',
      };
  }
};

export default function StaffProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Print Protection: intercept Ctrl+P / Cmd+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsRequestModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    if (!id) return;
    const fetchStaffProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/staff/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('ไม่พบข้อมูลบุคลากร');
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Staff = await res.json();
        setStaff(data);
      } catch (err: any) {
        console.error('Error fetching staff profile:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-3 border-amber-500 border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            กำลังโหลดข้อมูลประวัติและผลงาน...
          </p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-2xs border border-slate-200">
          <div className="size-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <UserCircle2 className="size-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {error || 'ไม่พบข้อมูลบุคลากร'}
          </h2>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed">
            อาจมีการเปลี่ยนแปลงหรือปรับปรุงข้อมูลในระบบ กรุณาลองใหม่อีกครั้ง
          </p>
          <Link
            href="/about/staff"
            className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-lg transition-colors inline-block shadow-2xs"
          >
            กลับหน้าทำเนียบบุคลากร
          </Link>
        </div>
      </div>
    );
  }

  const hasScholar = Boolean(staff.googleScholarUrl);
  const hasOrcid = Boolean(staff.orcidId);
  const hasScopus = Boolean(staff.scopusAuthorId);
  const hasAnyResearcherId = hasScholar || hasOrcid || hasScopus;

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
      {/* CSS Print Protection Style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-restricted-notice,
          #print-restricted-notice * {
            visibility: visible !important;
          }
          #print-restricted-notice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 40px !important;
            text-align: center !important;
            z-index: 99999 !important;
          }
        }
      `}</style>

      {/* Print Restriction Notice (Visible only during print) */}
      <div id="print-restricted-notice" className="hidden">
        <div className="max-w-md border-2 border-slate-400 p-8 rounded-xl text-center bg-slate-50">
          <div className="size-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="size-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2 font-heading">
            เอกสารประวัติบุคลากรได้รับการคุ้มครอง
          </h2>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-body">
            ตามระเบียบของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย และพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            การนำประวัติหรือข้อมูลวิทยากรไปใช้ประกอบราชการหรืองานสัมมนา กรุณายื่นคำขอเอกสารประวัติทางการผ่านระบบเว็บไซต์
          </p>
          <p className="text-xs font-semibold text-slate-800 border-t border-slate-300 pt-3">
            สำนักงานคณบดี คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
          </p>
        </div>
      </div>

      {/* ================= 1. HERO HEADER (EDITORIAL LANNA) ================= */}
      <section className="bg-[#0B132B] text-white pt-10 pb-20 px-4 relative overflow-hidden border-b-4 border-[#C2410C]">
        {/* Geometric Dot Canvas Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Bar: Breadcrumb + Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Semantic Breadcrumbs */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-600" />
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    เกี่ยวกับคณะ
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-600" />
                </li>
                <li>
                  <Link href="/about/staff" className="hover:text-white transition-colors">
                    บุคลากร
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-600" />
                </li>
                <li className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {getFullName(staff)}
                </li>
              </ol>
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/about/staff"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/15 transition-all group font-medium"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>กลับหน้าบุคลากร</span>
              </Link>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-amber-500 to-[#C2410C] hover:opacity-95 px-3.5 py-1.5 rounded-lg shadow-sm transition-opacity font-semibold"
                title="ขอเอกสารประวัติหรือประวัติวิทยากรทางการ"
              >
                <FileText className="size-3.5" />
                <span>ขอประวัติวิทยากร (Resume)</span>
              </button>
            </div>
          </div>

          {/* Profile Identity Title */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-400 border border-white/15 text-[11px] font-bold tracking-wide uppercase mb-3">
              <Sparkles className="size-3" />
              <span>
                {staff.staffType === 'ACADEMIC'
                  ? 'อาจารย์และนักวิจัย • FACULTY & RESEARCHER'
                  : 'บุคลากรสายสนับสนุน • ADMINISTRATIVE STAFF'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
              {getFullName(staff)}
            </h1>

            {getFullNameEn(staff) && (
              <p className="text-slate-300 text-sm sm:text-base font-normal mt-1">
                {getFullNameEn(staff)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= 2. PROFILE CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          {/* Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0B132B] via-[#C2410C] to-amber-500" />

          <div className="flex flex-col md:flex-row">
            {/* ---------------- Left Sidebar ---------------- */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-50/70 p-6 sm:p-7 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200/90">
              {/* Photo Frame */}
              <div className="aspect-[3/4] w-full max-w-[220px] bg-slate-100 relative overflow-hidden rounded-xl shadow-2xs border-2 border-slate-200 mb-5 group">
                {staff.imageUrl ? (
                  <Image
                    src={getAssetUrl(staff.imageUrl)}
                    alt={getFullName(staff)}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-103"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                    <UserCircle2 className="size-20 text-slate-300" strokeWidth={1} />
                    <span className="text-[11px] text-slate-400 mt-2 font-medium">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>

              {/* Department & Affiliation */}
              <div className="w-full mb-6 text-center space-y-1.5">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    staff.staffType === 'ACADEMIC'
                      ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                      : 'bg-teal-50 text-teal-700 border-teal-200/80'
                  }`}
                >
                  {staff.staffType === 'ACADEMIC' ? 'สายวิชาการ (Academic)' : 'สายสนับสนุน (Support)'}
                </span>

                <div>
                  {staff.department ? (
                    <Link
                      href={`/about/staff?dept=${encodeURIComponent(staff.department)}`}
                      className="text-xs font-semibold text-slate-800 hover:text-[#C2410C] transition-colors leading-snug inline-block"
                      title={`ดูบุคลากรทั้งหมดใน ${staff.department}`}
                    >
                      {staff.department}
                    </Link>
                  ) : (
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      คณะสังคมศาสตร์
                    </p>
                  )}
                </div>

                {staff.departmentEn && (
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">
                    {staff.departmentEn}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="w-full space-y-3 pt-5 border-t border-slate-200/90">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ข้อมูลการติดต่อ (Contact)
                </h4>

                {staff.contactEmail ? (
                  <div className="space-y-2">
                    <a
                      href={`mailto:${staff.contactEmail}`}
                      className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-[#C2410C] hover:border-amber-400/60 transition-colors text-xs font-medium break-all shadow-2xs group"
                    >
                      <Mail className="size-3.5 flex-shrink-0 text-slate-400 group-hover:text-[#C2410C] transition-colors" />
                      <span className="flex-grow">{staff.contactEmail}</span>
                    </a>

                    <button
                      onClick={() => handleCopyEmail(staff.contactEmail!)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors shadow-2xs"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="size-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">คัดลอกอีเมลแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5 text-slate-400" />
                          <span>คัดลอกอีเมล</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-white border border-dashed border-slate-200 p-2.5 rounded-lg text-center">
                    ไม่มีข้อมูลอีเมลติดต่อ
                  </p>
                )}

                {/* Resume Request CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#0B132B] hover:bg-[#C2410C] text-white rounded-lg text-xs font-semibold shadow-2xs transition-all"
                  >
                    <FileText className="size-3.5 text-amber-400" />
                    <span>ขอเอกสารประวัติ / วิทยากร</span>
                  </button>
                </div>

                {/* PDPA Privacy Protection Badge */}
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
                  <Lock className="size-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>
                    ข้อมูลได้รับการคุ้มครองตาม พ.ร.บ. PDPA การขอเอกสารประวัติราชการหรือเทียบเชิญวิทยากร กรุณายื่นคำขอผ่านระบบ
                  </span>
                </div>

                {/* Official Affiliation Badge */}
                <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-100/90 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="font-semibold text-slate-700 block mb-0.5">หน่วยงานต้นสังกัด:</span>
                  คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                </div>
              </div>
            </div>

            {/* ---------------- Right Content Area ---------------- */}
            <div className="w-full md:w-2/3 lg:w-3/4 p-6 sm:p-8 lg:p-10">
              {/* Header Badges & Titles */}
              <div className="border-b border-slate-200/90 pb-6 mb-7">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
                  {getFullName(staff)}
                </h2>

                {getFullNameEn(staff) && (
                  <p className="text-base sm:text-lg font-medium text-slate-500 mt-0.5">
                    {getFullNameEn(staff)}
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {staff.academicPosition && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800">
                      <Briefcase className="size-3.5 text-slate-500" />
                      <span>ตำแหน่งวิชาการ: {staff.academicPosition}</span>
                    </div>
                  )}

                  {staff.adminPosition && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#C2410C]">
                      <Crown className="size-3.5 text-[#C2410C]" />
                      <span>ตำแหน่งบริหาร: {staff.adminPosition}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography / Vision Quote */}
              {staff.bio && (
                <div className="mb-8 p-5 bg-gradient-to-br from-slate-50 to-orange-50/20 border-l-4 border-[#C2410C] rounded-r-xl shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
                    <Quote className="size-4 text-[#C2410C]" />
                    <span>ประวัติและวิสัยทัศน์การทำงาน (Biography & Vision)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal italic font-serif">
                    &ldquo;{staff.bio}&rdquo;
                  </p>
                </div>
              )}

              {/* Webometrics Researcher Hub */}
              {hasAnyResearcherId && (
                <div className="mb-8 p-5 sm:p-6 bg-slate-50 rounded-xl border border-slate-200/90">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                        <BookOpen className="size-4 text-[#0B132B]" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                          ฐานข้อมูลนักวิจัยและผลงานวิชาการ (Webometrics Profiles)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          สังกัดมาตรฐานสากล: <span className="font-semibold text-slate-700">Chiang Rai Rajabhat University</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
                      Webometrics Openness
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Google Scholar */}
                    {hasScholar && (
                      <div className="p-4 bg-white border border-blue-200/90 rounded-xl flex flex-col justify-between hover:border-blue-400 hover:shadow-2xs transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                              <Globe className="size-3.5 text-blue-600" /> Google Scholar
                            </span>
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-semibold">
                              เชื่อมต่อแล้ว
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            ดัชนีการอ้างอิงและบทความวิจัย
                          </p>
                        </div>
                        <div className="mt-3.5 pt-2 border-t border-slate-100">
                          <a
                            href={getGoogleScholarLink(staff.googleScholarUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <span>ดูโปรไฟล์วิจัย</span>
                            <ExternalLink className="size-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* ORCID */}
                    {hasOrcid && (
                      <div className="p-4 bg-white border border-emerald-200/90 rounded-xl flex flex-col justify-between hover:border-emerald-400 hover:shadow-2xs transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                              <Fingerprint className="size-3.5 text-emerald-600" /> ORCID iD
                            </span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold">
                              Verified
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-600 truncate">
                            {staff.orcidId?.replace(/^https?:\/\/orcid\.org\//, '')}
                          </p>
                        </div>
                        <div className="mt-3.5 pt-2 border-t border-slate-100">
                          <a
                            href={getOrcidLink(staff.orcidId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                          >
                            <span>ตรวจสอบสิทธิ์</span>
                            <ExternalLink className="size-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Scopus */}
                    {hasScopus && (
                      <div className="p-4 bg-white border border-amber-200/90 rounded-xl flex flex-col justify-between hover:border-amber-400 hover:shadow-2xs transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <BookOpen className="size-3.5 text-amber-600" /> Scopus ID
                            </span>
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                              Scopus
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-600 truncate">
                            ID: {staff.scopusAuthorId?.replace(/^https?:\/\/www\.scopus\.com\/authid\/detail\.uri\?authorId=/, '')}
                          </p>
                        </div>
                        <div className="mt-3.5 pt-2 border-t border-slate-100">
                          <a
                            href={getScopusLink(staff.scopusAuthorId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                          >
                            <span>ดูใน Scopus</span>
                            <ExternalLink className="size-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Linked Research Projects */}
              {Boolean(staff.researchProjects && staff.researchProjects.length > 0) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/90">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                        <FlaskConical className="size-4 text-[#C2410C]" />
                        โครงการวิจัยและผลงานวิชาการล่าสุด
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {Math.min(staff.researchProjects!.length, 3)} / {staff.researchProjects!.length} เรื่อง
                      </span>
                    </div>
                    <Link
                      href="/research/database"
                      className="text-xs text-[#C2410C] hover:underline font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      ดูคลังวิจัย <ArrowRight className="size-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {staff.researchProjects!.slice(0, 3).map((proj) => {
                      const roleBadge = getRoleBadge(proj.role);
                      return (
                        <div
                          key={proj.id}
                          className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-amber-500/60 transition-all shadow-2xs hover:shadow-xs"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${roleBadge.bg}`}>
                              {roleBadge.text}
                            </span>
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                              ปีงบประมาณ {proj.year}
                            </span>
                            {proj.fundingSource && (
                              <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                                ทุน: {proj.fundingSource}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/research/projects/${proj.slug}`}
                            className="group block"
                          >
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#C2410C] transition-colors leading-snug">
                              {proj.titleTh}
                            </h4>
                            {proj.titleEn && (
                              <p className="text-xs text-slate-500 mt-1 font-normal line-clamp-1">
                                {proj.titleEn}
                              </p>
                            )}
                          </Link>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500">
                              สถานะ: {proj.status === 'COMPLETED' ? 'เสร็จสิ้นโครงการ' : 'กำลังดำเนินการ'}
                            </span>
                            <Link
                              href={`/research/projects/${proj.slug}`}
                              className="text-xs font-semibold text-[#0B132B] hover:text-[#C2410C] inline-flex items-center gap-1 group"
                            >
                              รายละเอียด
                              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {staff.researchProjects!.length > 3 && (
                      <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-600">
                          <span>ยังมีโครงการวิจัยและผลงานวิชาการอีก </span>
                          <span className="font-bold text-slate-900">{staff.researchProjects!.length - 3} เรื่อง</span>
                          <span> ในฐานข้อมูลประวัติฉบับเต็ม</span>
                        </div>
                        <button
                          onClick={() => setIsRequestModalOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B132B] hover:text-[#C2410C] transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:border-slate-300"
                        >
                          <FileText className="size-3.5" />
                          <span>ขอประวัติวิจัยฉบับเต็ม</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Linked Academic Services */}
              {staff.academicServices && staff.academicServices.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/90">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                        <Handshake className="size-4 text-[#C2410C]" />
                        โครงการบริการวิชาการและพัฒนาสังคมล่าสุด
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {Math.min(staff.academicServices.length, 3)} / {staff.academicServices.length} เรื่อง
                      </span>
                    </div>
                    <Link
                      href="/research/services"
                      className="text-xs text-[#C2410C] hover:underline font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      ดูทั้งหมด <ArrowRight className="size-3" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {staff.academicServices.slice(0, 3).map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-amber-500/60 transition-all shadow-2xs hover:shadow-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase bg-emerald-50 text-emerald-800 border-emerald-200">
                            {srv.role === 'LEADER' ? 'หัวหน้าโครงการ' : 'ผู้ร่วมโครงการ'}
                          </span>
                          {srv.serviceType && (
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                              {srv.serviceType === 'SOCIAL_SERVICE' ? 'พัฒนาสังคม/ชุมชน' : 'ที่ปรึกษา/อบรม'}
                            </span>
                          )}
                          {srv.area && (
                            <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                              พื้นที่: {srv.area}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/research/services/${srv.id}`}
                          className="group block"
                        >
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#C2410C] transition-colors leading-snug">
                            {srv.title}
                          </h4>
                        </Link>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500">
                            สถานะ: {srv.status === 'COMPLETED' ? 'เสร็จสิ้นโครงการ' : 'กำลังดำเนินการ'}
                          </span>
                          <Link
                            href={`/research/services/${srv.id}`}
                            className="text-xs font-semibold text-[#0B132B] hover:text-[#C2410C] inline-flex items-center gap-1 group"
                          >
                            รายละเอียด
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    ))}

                    {staff.academicServices.length > 3 && (
                      <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-600">
                          <span>ยังมีโครงการบริการวิชาการอีก </span>
                          <span className="font-bold text-slate-900">{staff.academicServices.length - 3} เรื่อง</span>
                          <span> ในฐานข้อมูลประวัติฉบับเต็ม</span>
                        </div>
                        <button
                          onClick={() => setIsRequestModalOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B132B] hover:text-[#C2410C] transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:border-slate-300"
                        >
                          <FileText className="size-3.5" />
                          <span>ขอประวัติวิทยากรฉบับเต็ม</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education & Expertise Grid */}
              <div className="grid md:grid-cols-2 gap-7 pt-4 border-t border-slate-200/90">
                {/* Education */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2 font-heading">
                    <GraduationCap className="size-4 text-[#C2410C]" />
                    ประวัติการศึกษา (Education)
                  </h3>

                  {staff.education && staff.education.length > 0 ? (
                    <ul className="space-y-2.5">
                      {staff.education.map((edu, idx) => (
                        <li
                          key={idx}
                          className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs"
                        >
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full mb-1.5">
                            {edu.level === 'DOCTORAL'
                              ? 'ปริญญาเอก'
                              : edu.level === 'MASTER'
                              ? 'ปริญญาโท'
                              : 'ปริญญาตรี'}
                          </span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {edu.detail}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                      ไม่มีข้อมูลประวัติการศึกษา
                    </p>
                  )}
                </div>

                {/* Expertise & Short Bio */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2 font-heading">
                    <Award className="size-4 text-[#C2410C]" />
                    ความเชี่ยวชาญ (Areas of Expertise)
                  </h3>

                  {staff.expertise && staff.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {staff.expertise.map((exp, idx) => {
                        if (!exp.trim()) return null;
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full border border-slate-200/80 shadow-2xs"
                          >
                            {exp}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center mb-6">
                      ไม่มีข้อมูลความเชี่ยวชาญ
                    </p>
                  )}

                  {/* Short Bio */}
                  {staff.shortBios && staff.shortBios.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 font-heading">
                        <Lightbulb className="size-3.5 text-amber-500" />
                        ประวัติโดยสังเขป
                      </h4>
                      <div className="p-4 bg-slate-50 border-l-4 border-[#0B132B] rounded-r-xl text-xs text-slate-700 space-y-2 leading-relaxed">
                        {staff.shortBios.map((bio, idx) => (
                          <p key={idx}>{bio}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Official Resume / Speaker Bio Modal */}
      <RequestResumeModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        staff={staff}
      />
    </main>
  );
}
