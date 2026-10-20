import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ProgramGalleryClient from '@/components/ProgramGalleryClient';
import type { ProgramInstructor, ProgramConcentration, SocialLinks } from '@/lib/api';
import { formatStaffName } from '@/lib/utils';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
  PhoneCall,
  Video,
  Award,
  Share2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ---- Helper: Parse YouTube ID from various URL formats ----
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ---- Helper: Format Concentration Anchor ID ----
function getConcentrationAnchorId(title: string, index: number): string {
  if (title.includes('สังคมวิทยา')) return 'sociology-anthropology';
  if (title.includes('วัฒนธรรม')) return 'cultural-resource-management';
  if (title.includes('อาหาร') || title.includes('บริการ')) return 'culinary-and-service';
  if (title.includes('ประยุกต์')) return 'applied-home-economics';
  return `track-${index + 1}`;
}

export interface ProgramData {
  id: string;
  title: string;
  degree: string;
  image: string;
  description: string;
  highlights: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  careers: string[];
  structure: {
    totalCredits: number;
    general: number;
    major: number;
    freeElective: number;
  };
  downloadLink?: string;
  level?: string;
  studyPlanType?: 'REGULAR_4YR' | 'TRANSFER_2YR' | 'GRADUATE' | string;
  programCode?: string;
  parentProgram?: {
    code: string;
    nameTh: string;
  };
  concentrations?: ProgramConcentration[];
  siblingTracks?: {
    code: string;
    nameTh: string;
    studyPlanType?: string;
    trackType?: string;
  }[];
  // PR Media & Social Channels
  socialLinks?: SocialLinks | null;
  galleryImages?: string[];
  attachments?: { originalName: string; fileUrl: string; size?: number; mimeType?: string }[];
  youtubeVideoUrl?: string;
  facebookVideoUrl?: string;
  // Instructors
  instructors?: ProgramInstructor[];
}

interface ProgramTemplateProps {
  data: ProgramData;
}

export default function ProgramTemplate({ data }: ProgramTemplateProps) {
    const youtubeId = getYouTubeId(data.youtubeVideoUrl || '');
  const social = data.socialLinks;
  const fbUrl = social?.facebook || data.facebookVideoUrl;
  const tiktokUrl = social?.tiktok;
  const igUrl = social?.instagram;
  const ytUrl = social?.youtube || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined);
  const lineUrl = social?.line;
  const hasSocials = !!(fbUrl || tiktokUrl || igUrl || ytUrl || lineUrl);
  const hasFacebookPage = !!fbUrl;
  const hasGallery = (data.galleryImages ?? []).length > 0;
  const hasAttachments = (data.attachments ?? []).length > 0;
  const hasInstructors = (data.instructors ?? []).length > 0;
  const chair = (data.instructors ?? []).find((i) => i.role === 'CHAIR');
  const members = (data.instructors ?? []).filter((i) => i.role === 'MEMBER');

  const fullGalleryUrls = (data.galleryImages ?? []).map((img) =>
    img.startsWith('/') ? `${API_URL}${img}` : img
  );
  const fullAttachments = (data.attachments ?? []).map((att) => ({
    ...att,
    fileUrl: att.fileUrl.startsWith('/') ? `${API_URL}${att.fileUrl}` : att.fileUrl,
  }));

  const isGrad = data.level?.includes('โท') || data.level?.includes('เอก');
  const admissionUrl = isGrad
    ? 'https://orasis.crru.ac.th/gds_crru/index.php/main/home'
    : 'https://admission.crru.ac.th/';

  return (
    <div className="bg-white font-sans text-scholar-text min-h-screen">
      {/* =========================================================================
          HERO BANNER: Sharp & Authoritative Academic Banner
          ========================================================================= */}
      <header className="relative bg-scholar-deep overflow-hidden border-b-4 border-scholar-gold py-16 lg:py-24">
        {/* Banner Image Background */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            priority
            unoptimized={data.image.startsWith('http')}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/80 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          {/* Back to Parent Program (If Sub-page) */}
          {data.parentProgram && (
            <div className="mb-4">
              <Link
                href={`/programs/${data.parentProgram.code}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-scholar-gold text-xs font-semibold rounded-sm border border-scholar-gold/30 transition-all backdrop-blur-sm"
              >
                <span>← ย้อนกลับไปยัง {data.parentProgram.nameTh}</span>
              </Link>
            </div>
          )}

          {/* Level & Degree Abbreviation */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-scholar-accent text-white text-xs font-bold uppercase tracking-wider rounded-sm">
              {data.level || 'ปริญญาตรี (Bachelor)'}
            </span>
            {data.studyPlanType === 'TRANSFER_2YR' ? (
              <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs">
                เทียบโอน 2 ปีหลัง (ปวส.)
              </span>
            ) : data.studyPlanType === 'REGULAR_4YR' ? (
              <span className="px-3 py-1 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                หลักสูตร 4 ปีปกติ
              </span>
            ) : null}
            <span className="text-scholar-gold text-xs font-semibold px-2 py-1 bg-white/10 rounded-sm border border-scholar-gold/30">
              สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight font-heading max-w-4xl">
            {data.title}
          </h1>

          <p className="text-lg lg:text-xl text-scholar-gold font-light tracking-wide mb-8 max-w-3xl">
            {data.degree}
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={admissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-bold rounded-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>สมัครเรียนทันที</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {data.downloadLink && (
              <a
                href={
                  data.downloadLink.startsWith('/')
                    ? `${API_URL}${data.downloadLink}`
                    : data.downloadLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-scholar-gold" />
                <span>ดาวน์โหลดเล่มหลักสูตร (PDF)</span>
              </a>
            )}

            {fbUrl && (
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#1877F2]/90 hover:bg-[#1877F2] text-white text-xs font-bold rounded-sm transition-all flex items-center gap-2 shadow-xs"
                title="Facebook หลักสูตร"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
            )}

            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-sm transition-all flex items-center gap-2 border border-white/20 shadow-xs"
                title="TikTok หลักสูตร"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>TikTok</span>
              </a>
            )}

            {igUrl && (
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold rounded-sm transition-all flex items-center gap-2 shadow-xs"
                title="Instagram หลักสูตร"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
            )}

            {lineUrl && (
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-sm transition-all flex items-center gap-2 shadow-xs"
                title="Line Official"
              >
                <span className="font-extrabold text-[10px] bg-white text-[#06C755] px-1 rounded-xs">LINE</span>
                <span>Line Official</span>
              </a>
            )}
          </div>

          {/* Quick Sublinks for Concentrations / แขนงวิชา */}
          {data.concentrations && data.concentrations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-scholar-gold font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                แขนงวิชา / กลุ่มวิชาเฉพาะ:
              </span>
              {data.concentrations.map((item, idx) => {
                const anchorId = getConcentrationAnchorId(item.title, idx);
                return (
                  <a
                    key={idx}
                    href={`#${anchorId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-sm border border-white/20 transition-all font-medium"
                  >
                    <span>{item.title.split('(')[0].trim()}</span>
                    <span className="text-scholar-gold text-[10px]">↓</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          BREADCRUMB & ADMISSION ALERT STRIP
          ========================================================================= */}
      <div className="bg-scholar-soft border-b border-gray-200 py-3">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <Breadcrumb
            items={
              data.parentProgram
                ? [
                    { label: 'หลักสูตรทั้งหมด', href: '/programs' },
                    { label: data.parentProgram.nameTh, href: `/programs/${data.parentProgram.code}` },
                    { label: data.title },
                  ]
                : [
                    { label: 'หลักสูตรทั้งหมด', href: '/programs' },
                    {
                      label: data.level?.includes('เอก')
                        ? 'ปริญญาเอก'
                        : data.level?.includes('โท')
                        ? 'ปริญญาโท'
                        : 'ปริญญาตรี',
                      href: data.level?.includes('เอก')
                        ? '/programs?level=doctoral'
                        : data.level?.includes('โท')
                        ? '/programs?level=master'
                        : '/programs?level=bachelor',
                    },
                    { label: data.title },
                  ]
            }
          />

          <div className="flex items-center gap-2 text-scholar-deep">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">สถานะการรับสมัคร:</span>
            <span className="text-gray-600">เปิดรับสมัครรอบปัจจุบัน (กู้ยืม กยศ. ได้ 100%)</span>
          </div>
        </div>
      </div>

      {/* Sibling Tracks Quick Switcher Bar */}
      {data.siblingTracks && data.siblingTracks.length > 1 && (
        <aside aria-label="สลับดูแขนงวิชา/วิชาเอกอื่นในสาขานี้" className="bg-amber-50/70 border-b border-amber-200/80 py-3">
          <div className="container mx-auto px-4 max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-scholar-deep font-semibold">
              <Layers className="w-4 h-4 text-scholar-accent shrink-0" />
              <span>แขนงวิชา/แผนการศึกษาอื่นในสาขานี้:</span>
            </div>
            <nav aria-label="รายชื่อแขนงวิชาในสาขานี้" className="flex flex-wrap items-center gap-2">
              {data.siblingTracks.map((t) => {
                const isCurrent = t.code === data.programCode?.split('/')[1] || data.id?.includes(t.code);
                const isTransfer = t.studyPlanType === 'TRANSFER_2YR';
                return (
                  <Link
                    key={t.code}
                    href={`/programs/${data.parentProgram?.code || data.programCode}/${t.code}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-scholar-deep text-white shadow-xs font-bold'
                        : 'bg-white hover:bg-scholar-deep hover:text-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span>{t.nameTh.split('(')[0].trim()}</span>
                    {isTransfer && (
                      <span className={`text-[10px] px-1 py-0.2 rounded-xs font-bold ${
                        isCurrent ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        เทียบโอน 2 ปี
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* =========================================================================
          MAIN CONTENT & SIDEBAR
          ========================================================================= */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ===== LEFT COLUMN: Primary Information ===== */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. Overview */}
            <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                <BookOpen className="w-5 h-5 text-scholar-accent" />
                <h2 className="text-xl font-bold text-scholar-deep">เกี่ยวกับสาขาวิชา</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light whitespace-pre-line">
                {data.description}
              </p>
            </section>

            {/* 2. Concentrations / แขนงวิชา และกลุ่มวิชาเฉพาะ (Sub-details & In-page Links) */}
            {data.concentrations && data.concentrations.length > 0 && (
              <section id="concentrations" className="bg-white border-2 border-scholar-gold/40 p-8 rounded-sm shadow-sm scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-sm bg-scholar-deep text-scholar-gold flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-scholar-deep">แขนงวิชา / กลุ่มวิชาเฉพาะ</h2>
                      <p className="text-xs text-gray-500 font-normal">เปิดให้เลือกเรียนตามความถนัดและความสนใจเพื่อความเป็นเลิศทางวิชาชีพ</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm self-start sm:self-auto">
                    {data.concentrations.length} แขนง/กลุ่มวิชา
                  </span>
                </div>

                {/* Sublink Quick-jump Navigation */}
                <div className="flex flex-wrap gap-2 mb-6 p-3 bg-scholar-soft border border-gray-200 rounded-sm">
                  <span className="text-xs font-semibold text-scholar-deep self-center mr-1">เลือกดูข้อมูลแขนง:</span>
                  {data.concentrations.map((item, index) => {
                    const anchorId = getConcentrationAnchorId(item.title, index);
                    return (
                      <a
                        key={index}
                        href={`#${anchorId}`}
                        className="px-3 py-1 bg-white hover:bg-scholar-deep hover:text-white text-scholar-deep text-xs font-medium rounded-sm border border-gray-200 shadow-2xs transition-all flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-scholar-accent" />
                        <span>{item.title.split('(')[0].trim()}</span>
                        <span className="text-scholar-accent text-[11px]">↓</span>
                      </a>
                    );
                  })}
                </div>

                {/* Sub-detail Cards */}
                <div className="space-y-5">
                  {data.concentrations.map((item, index) => {
                    const anchorId = getConcentrationAnchorId(item.title, index);
                    const englishTitleMatch = item.title.match(/\(([^)]+)\)/);
                    const englishTitle = englishTitleMatch ? englishTitleMatch[1] : '';
                    const thaiTitle = item.title.replace(/\s*\([^)]*\)/, '').trim();

                    return (
                      <div
                        key={index}
                        id={anchorId}
                        className="p-6 border border-gray-200 rounded-sm bg-scholar-soft scroll-mt-28 hover:border-scholar-accent/50 transition-all target:ring-2 target:ring-scholar-accent target:bg-amber-50/60"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="inline-block px-2 py-0.5 bg-scholar-deep text-scholar-gold text-[10px] font-bold uppercase tracking-wider rounded-sm mb-1.5">
                              กลุ่มวิชาเฉพาะที่ {index + 1}
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-scholar-deep leading-snug">
                              {thaiTitle}
                            </h3>
                            {englishTitle && (
                              <p className="text-xs font-medium text-gray-500 font-sans tracking-wide mt-0.5">
                                {englishTitle}
                              </p>
                            )}
                          </div>
                          <a
                            href={`#${anchorId}`}
                            className="text-gray-400 hover:text-scholar-accent text-xs font-mono self-start transition-colors px-2 py-0.5 rounded-sm hover:bg-white"
                            title="ลิงก์ตรงมายังแขนงนี้"
                          >
                            #{anchorId}
                          </a>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-scholar-accent ml-0.5 mb-4 font-light">
                          {item.description}
                        </p>

                        {/* Highlights & Careers Preview for Concentration */}
                        {item.careers && item.careers.length > 0 && (
                          <div className="mb-4 pt-3 border-t border-gray-200/60">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-scholar-gold" />
                              อาชีพเฉพาะของแขนงนี้:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.careers.slice(0, 3).map((c, ci) => (
                                <span key={ci} className="bg-white border border-gray-200 text-gray-700 text-[11px] px-2 py-0.5 rounded-sm">
                                  {c}
                                </span>
                              ))}
                              {item.careers.length > 3 && (
                                <span className="text-gray-400 text-[11px] px-1 py-0.5">
                                  +{item.careers.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <Link
                            href={`/programs/${data.programCode || 'social-sci'}/${item.code || anchorId}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-bold rounded-sm shadow-sm transition-all"
                          >
                            <span>ดูข้อมูลแขนงนี้ฉบับเต็ม</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={admissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-scholar-deep hover:text-scholar-accent font-bold hover:underline"
                          >
                            <span>สมัครเรียนสาขานี้ (TCAS)</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. YouTube Video Embed */}
            {youtubeId && (
              <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-gray-100">
                  <Video className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl font-bold text-scholar-deep">วิดีโอแนะนำหลักสูตร</h2>
                </div>
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-gray-200 shadow-sm bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title="วิดีโอแนะนำหลักสูตร"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </section>
            )}

            {/* 3. Program Highlights */}
            {data.highlights.length > 0 && (
              <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-gray-100">
                  <Award className="w-5 h-5 text-scholar-gold" />
                  <h2 className="text-xl font-bold text-scholar-deep">จุดเด่นของหลักสูตร</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.highlights.map((item, index) => (
                    <div
                      key={index}
                      className="p-5 border border-gray-200 rounded-sm bg-scholar-soft hover:border-scholar-accent/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-sm bg-scholar-deep text-scholar-gold flex items-center justify-center shrink-0">
                          {item.icon || <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <h3 className="font-bold text-sm text-scholar-deep pt-1">{item.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-11">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Career Pathways (High Appeal) */}
            {data.careers.length > 0 && (
              <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-5 h-5 text-scholar-accent" />
                    <h2 className="text-xl font-bold text-scholar-deep">
                      เส้นทางอาชีพและโอกาสการทำงานในอนาคต
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {data.careers.length} ตำแหน่งงานเด่น
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.careers.map((career, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3.5 bg-scholar-soft border border-gray-200 rounded-sm hover:border-scholar-gold transition-colors"
                    >
                      <div className="w-6 h-6 rounded-sm bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-scholar-deep">{career}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}


          </div>

          {/* ===== RIGHT COLUMN: Sidebar Specifications & Actions ===== */}
          <div className="space-y-8">
            {/* 1. Structure Box */}
            <div className="bg-white border-t-4 border-scholar-deep border-r border-b border-l border-gray-200 p-6 rounded-sm shadow-sm">
              <h3 className="text-base font-bold text-scholar-deep mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-scholar-accent" />
                โครงสร้างหลักสูตร (หน่วยกิต)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-600">หมวดวิชาศึกษาทั่วไป</span>
                  <span className="font-bold text-scholar-deep">{data.structure.general} นก.</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-600">หมวดวิชาเฉพาะ</span>
                  <span className="font-bold text-scholar-deep">{data.structure.major} นก.</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-600">หมวดวิชาเลือกเสรี</span>
                  <span className="font-bold text-scholar-deep">
                    {data.structure.freeElective} นก.
                  </span>
                </div>
                <div className="pt-3 flex justify-between items-center bg-scholar-soft -mx-6 px-6 py-3 mt-4 border-t border-gray-200">
                  <span className="font-bold text-scholar-deep">รวมตลอดหลักสูตร</span>
                  <span className="text-base font-bold text-scholar-accent">
                    {data.structure.totalCredits} นก.
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href={admissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>สมัครเข้าศึกษาต่อ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Downloadable Attachments */}
            {hasAttachments && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
                <h3 className="text-sm font-bold text-scholar-deep mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-scholar-accent" />
                  เอกสารดาวน์โหลด & ประชาสัมพันธ์
                </h3>
                <div className="space-y-2">
                  {fullAttachments.slice(0, 5).map((file, i) => (
                    <a
                      key={i}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-scholar-accent py-2 border-b border-gray-50 last:border-0 group transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-scholar-accent shrink-0" />
                      <span className="truncate flex-1 font-medium">{file.originalName}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Social Media Channels */}
            {hasSocials && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
                <h3 className="text-sm font-bold text-scholar-deep mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-scholar-accent" />
                  ช่องทางโซเชียลมีเดียของหลักสูตร
                </h3>
                <div className="space-y-2.5">
                  {fbUrl && (
                    <a
                      href={fbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/40 hover:bg-blue-50 text-scholar-deep rounded-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-[#1877F2] rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-[#1877F2]">Facebook Page</p>
                        <p className="text-[11px] text-gray-500 truncate">ติดตามกิจกรรมและข่าวสารสาขา</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1877F2] transition-colors" />
                    </a>
                  )}

                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 text-scholar-deep rounded-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-black rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-black">TikTok Channel</p>
                        <p className="text-[11px] text-gray-500 truncate">คลิปสั้นและบรรยากาศการเรียน</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
                    </a>
                  )}

                  {igUrl && (
                    <a
                      href={igUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-pink-100 bg-pink-50/30 hover:bg-pink-50 text-scholar-deep rounded-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-rose-600">Instagram</p>
                        <p className="text-[11px] text-gray-500 truncate">ภาพกิจกรรมและผลงานนักศึกษา</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-rose-600 transition-colors" />
                    </a>
                  )}

                  {lineUrl && (
                    <a
                      href={lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-scholar-deep rounded-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-[#06C755] rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                        <span className="font-extrabold text-[10px] text-white">LINE</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-[#06C755]">Line Official Account</p>
                        <p className="text-[11px] text-gray-500 truncate">ปรึกษาอาจารย์และสอบถามข้อมูล</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#06C755] transition-colors" />
                    </a>
                  )}

                  {ytUrl && (
                    <a
                      href={ytUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-red-100 bg-red-50/30 hover:bg-red-50 text-scholar-deep rounded-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-red-600 rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-red-600">YouTube Channel</p>
                        <p className="text-[11px] text-gray-500 truncate">วิดีโอแนะนำและผลงานวิชาการ</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 4. Photo Gallery */}
            {hasGallery && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
                <h3 className="text-sm font-bold text-scholar-deep mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-scholar-gold" />
                  ภาพกิจกรรมภาคสนาม & ผลงาน
                </h3>
                <ProgramGalleryClient galleryImages={fullGalleryUrls} />
              </div>
            )}

            {/* 5. Minimal Contact Box */}
            <div className="bg-scholar-soft border border-gray-200 p-6 rounded-sm text-center">
              <PhoneCall className="w-6 h-6 text-scholar-deep mx-auto mb-2" />
              <h3 className="text-sm font-bold text-scholar-deep mb-1">สอบถามข้อมูลเพิ่มเติม</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                ฝ่ายวิชาการ สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย
              </p>
              <Link
                href="/contact"
                className="inline-block w-full py-2 bg-white border border-scholar-deep text-scholar-deep font-bold text-xs rounded-sm hover:bg-scholar-deep hover:text-white transition-all shadow-sm"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            INSTRUCTORS SECTION: Faculty Members
            ========================================================================= */}
        {hasInstructors && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-2.5 mb-8">
              <GraduationCap className="w-6 h-6 text-scholar-deep" />
              <h2 className="text-2xl font-bold text-scholar-deep">คณาจารย์ประจำหลักสูตร</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {chair && <InstructorCard inst={chair} apiUrl={API_URL} />}
              {members.map((inst) => (
                <InstructorCard key={inst.id} inst={inst} apiUrl={API_URL} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* =========================================================================
          BOTTOM APPLICATION CTA
          ========================================================================= */}
      <section className="py-16 bg-scholar-deep text-white border-t-4 border-scholar-gold text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-heading">
            พร้อมที่จะเป็นส่วนหนึ่งของครอบครัวสังคมศาสตร์แล้วหรือยัง?
          </h2>
          <p className="text-sm text-gray-300 mb-8 font-light">
            {data.title} • สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
          </p>
          <a
            href={admissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-3 bg-scholar-accent hover:bg-[#D9341C] text-white text-xs font-bold rounded-sm shadow-lg hover:scale-105 transition-all"
          >
            <span>สมัครเรียนรอบ TCAS</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

// ---- InstructorCard Sub-Component ----
function InstructorCard({ inst, apiUrl }: { inst: ProgramInstructor; apiUrl: string }) {
  const isChair = inst.role === 'CHAIR';
  const displayName = formatStaffName(inst);
  const imageUrl = inst.imageUrl
    ? inst.imageUrl.startsWith('/')
      ? `${apiUrl}${inst.imageUrl}`
      : inst.imageUrl
    : null;

  return (
    <Link
      href={`/about/staff/${inst.staffId}`}
      className={`flex flex-col items-center text-center p-4 rounded-sm border shadow-sm transition-all hover:shadow-md hover:border-scholar-accent/40 group ${
        isChair ? 'border-scholar-gold/60 bg-amber-50/50' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Circular Avatar Photo (allowed as exception under Sharp rule) */}
      <div className="relative w-20 h-20 mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            unoptimized
            className="object-cover rounded-full ring-2 ring-white shadow-sm group-hover:ring-scholar-accent/30 transition-all"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-scholar-deep to-scholar-accent flex items-center justify-center ring-2 ring-white shadow-sm">
            <span className="text-white font-bold text-2xl">
              {inst.firstNameTh?.charAt(0) || '?'}
            </span>
          </div>
        )}
        {/* Chair Badge */}
        {isChair && (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm text-white"
            title="ประธานหลักสูตร"
          >
            <Award className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <p className="mt-1 font-bold text-scholar-deep text-xs leading-snug group-hover:text-scholar-accent transition-colors line-clamp-2">
        {displayName}
      </p>

      <span
        className={`mt-2 inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
          isChair ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {isChair ? 'ประธานหลักสูตร' : 'อาจารย์ประจำหลักสูตร'}
      </span>
    </Link>
  );
}
