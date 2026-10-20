import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Crown,
  UserCircle2,
  Mail,
  ArrowRight,
  Quote,
  Users,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getApiBaseUrl, getAssetUrl } from '@/lib/api-config';
import { Staff, getFullName, getFullNameEn } from '@/lib/staff';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 60;

// ==========================================
// Component: Dean Spotlight Hero Showcase
// ==========================================
function DeanSpotlightCard({ dean }: { dean: Staff }) {
  const defaultQuote =
    'มุ่งมั่นบูรณาการองค์ความรู้ทางสังคมศาสตร์สู่การสร้างนวัตกรรมเพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน และขับเคลื่อนองค์กรสู่มาตรฐานความเป็นเลิศระดับสากล';
  const quoteText = dean.bio?.trim() || defaultQuote;
  const englishName = getFullNameEn(dean);
  const imageUrl = getAssetUrl(dean.imageUrl);

  return (
    <section
      aria-label="สารและข้อมูลคณบดี"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-14 relative group transition-all duration-300 hover:shadow-md"
    >
      {/* Top Accent Strip with Warm Amber Gradient */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0B132B] via-[#C2410C] to-amber-500" />

      <div className="p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
        {/* Dean Portrait Frame */}
        <div className="w-full sm:w-72 lg:w-80 flex-shrink-0 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 border-2 border-amber-500/30 shadow-md group-hover:border-amber-500/60 transition-colors">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={getFullName(dean)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-103"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                <UserCircle2 className="w-24 h-24 mb-2 text-slate-300" strokeWidth={1} />
                <span className="text-xs text-slate-400 font-medium">ไม่มีรูปภาพ</span>
              </div>
            )}

            {/* Emblem Badge */}
            <div className="absolute top-3.5 right-3.5 bg-[#0B132B]/90 text-amber-400 px-3 py-1 rounded-full border border-amber-400/40 text-[11px] font-bold tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm">
              <Crown className="size-3.5" />
              <span>DEAN / คณบดี</span>
            </div>
          </div>

          <div className="mt-3.5 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <ShieldCheck className="size-3.5 text-amber-600" />
              ผู้นำองค์กรและผู้บริหารสูงสุด
            </span>
          </div>
        </div>

        {/* Dean Information & Vision Statement */}
        <div className="flex-1 flex flex-col justify-between text-left h-full">
          <div>
            {/* Hierarchy Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#C2410C] border border-orange-200/80 rounded-full text-xs font-bold tracking-wide mb-3">
              <Sparkles className="size-3.5" />
              <span>หัวหน้าส่วนราชการ / Dean of Faculty</span>
            </div>

            {/* Position & Title */}
            <p className="text-xs sm:text-sm font-bold text-[#C2410C] tracking-wide uppercase mb-1">
              {dean.adminPosition || 'คณบดีคณะสังคมศาสตร์'}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading tracking-tight mb-1">
              {getFullName(dean)}
            </h2>
            {englishName && (
              <p className="text-sm sm:text-base text-slate-500 font-medium mb-5">
                {englishName}
              </p>
            )}

            {/* Vision Statement Quote Card */}
            <div className="relative bg-gradient-to-br from-slate-50 to-orange-50/30 border-l-4 border-[#C2410C] p-5 sm:p-6 rounded-r-xl my-4 shadow-2xs">
              <Quote className="size-8 text-[#C2410C]/20 absolute top-4 right-4 pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#C2410C] uppercase tracking-wider">
                  วิสัยทัศน์และสารจากคณบดี
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  (Dean&apos;s Vision & Statement)
                </span>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic font-serif relative z-10">
                &ldquo;{quoteText}&rdquo;
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <Link
              href={`/about/staff/${dean.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B132B] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-2xs group hover:shadow-sm"
            >
              <span>ประวัติและผลงานวิชาการ</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {dean.contactEmail && (
              <a
                href={`mailto:${dean.contactEmail}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0B132B] text-xs sm:text-sm font-medium rounded-lg border border-slate-200 transition-colors shadow-2xs"
              >
                <Mail className="size-4 text-slate-400" />
                <span>{dean.contactEmail}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Component: Executive Card (Clickable Entire Card)
// ==========================================
function ExecutiveCard({
  staff,
  badgeText,
}: {
  staff: Staff;
  badgeText?: string;
}) {
  const imageUrl = getAssetUrl(staff.imageUrl);
  const englishName = getFullNameEn(staff);

  return (
    <Link
      href={`/about/staff/${staff.id}`}
      aria-label={`ดูประวัติ ${getFullName(staff)}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-500/60 transition-all duration-200 group overflow-hidden flex flex-col relative focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
    >
      <div className="pt-5 px-4 pb-2 bg-gradient-to-b from-slate-50/80 to-white flex justify-center">
        <div className="aspect-[3/4] w-36 sm:w-40 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200/90 group-hover:border-amber-400/60 transition-colors shadow-2xs">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={getFullName(staff)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
              <UserCircle2 className="size-16 text-slate-300" strokeWidth={1} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-2 pb-5 flex flex-col items-center text-center flex-grow bg-white">
        {/* Department / Category Pill */}
        {(badgeText || staff.department) && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 mb-2 max-w-full truncate">
            {badgeText || staff.department?.replace(/สาขาวิชา|แขนงวิชา/g, '').trim()}
          </span>
        )}

        {/* Full Name */}
        <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#C2410C] transition-colors line-clamp-2">
          {getFullName(staff)}
        </h3>

        {englishName && (
          <p className="text-[11px] text-slate-400 font-medium truncate max-w-full mt-0.5">
            {englishName}
          </p>
        )}

        {/* Position Display */}
        <p className="text-xs font-semibold text-[#C2410C] mt-2 line-clamp-2 leading-relaxed">
          {staff.adminPosition || staff.academicPosition || 'ผู้บริหาร'}
        </p>
      </div>
    </Link>
  );
}

// ==========================================
// Main Server Component: ExecutivePage
// ==========================================
export default async function ExecutivePage() {
  let staffList: Staff[] = [];
  let isApiError = false;

  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/api/staff?limit=150`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      const allStaff: Staff[] = json.data || [];
      staffList = allStaff.filter((s) => s.isExecutive);
    } else {
      isApiError = true;
    }
  } catch (err) {
    console.error('[ExecutivePage] Error fetching executive staff during SSR:', err);
    isApiError = true;
  }

  // -------------------------------------------------------------
  // จัดกลุ่มตำแหน่งบริหาร 3 ระดับหลัก:
  // 1. คณบดี (Dean)
  // 2. คณะผู้บริหารระดับสูง (รองคณบดี, ผู้ทรงคุณวุฒิ)
  // 3. ผู้ช่วยคณบดี (Assistant Deans)
  // 4. ประธานหลักสูตรและสาขาวิชา (Department Chairs)
  // -------------------------------------------------------------
  let deanPerson: Staff | null = null;
  const seniorExecs: Staff[] = [];
  const assistantDeans: Staff[] = [];
  const departmentChairs: Staff[] = [];

  staffList.forEach((staff) => {
    const pos = staff.adminPosition || '';
    const posId = staff.adminPositionId;

    const isDean =
      (pos.includes('คณบดี') && !pos.includes('รอง') && !pos.includes('ผู้ช่วย')) ||
      posId === 1;

    if (isDean && !deanPerson) {
      deanPerson = staff;
      return;
    }

    if (
      pos.includes('รองคณบดี') ||
      pos.includes('ผู้ทรงคุณวุฒิ') ||
      (posId !== null && [2, 3, 10].includes(posId))
    ) {
      seniorExecs.push(staff);
      return;
    }

    if (pos.includes('ผู้ช่วยคณบดี') || (posId !== null && [4, 5, 6].includes(posId))) {
      assistantDeans.push(staff);
      return;
    }

    if (
      pos.includes('ประธาน') ||
      pos.includes('ผู้จัดการ') ||
      (posId !== null && [7, 8, 9].includes(posId))
    ) {
      departmentChairs.push(staff);
      return;
    }

    if (pos.includes('ผู้ช่วย')) {
      assistantDeans.push(staff);
    } else if (pos.includes('สาขา') || pos.includes('แขนง')) {
      departmentChairs.push(staff);
    } else {
      seniorExecs.push(staff);
    }
  });

  const sortFn = (a: Staff, b: Staff) => (a.sortOrder || 0) - (b.sortOrder || 0);
  seniorExecs.sort(sortFn);
  assistantDeans.sort(sortFn);
  departmentChairs.sort(sortFn);

  // Schema.org Structured Data
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'คณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ทำเนียบคณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย นำโดยคณบดี รองคณบดี ผู้ช่วยคณบดี และประธานสาขาวิชา',
    numberOfItems: staffList.length,
    itemListElement: staffList.map((staff, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: getFullName(staff),
        jobTitle: staff.adminPosition || 'ผู้บริหาร',
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        },
        ...(staff.contactEmail ? { email: staff.contactEmail } : {}),
        ...(staff.imageUrl ? { image: getAssetUrl(staff.imageUrl) } : {}),
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      {/* Schema.org Structured Data */}
      <JsonLd data={jsonLdData} />

      {/* ================= 1. HERO HEADER (EDITORIAL LANNA) ================= */}
      <section className="bg-[#0B132B] text-white pt-14 pb-16 px-4 relative overflow-hidden border-b-4 border-[#C2410C]">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
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
              <li className="text-amber-400 font-semibold" aria-current="page">
                คณะผู้บริหาร
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
              <Crown className="size-3.5" />
              <span>EXECUTIVE BOARD & LEADERSHIP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4 font-heading">
              คณะผู้บริหาร <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F97316] to-[#C2410C]">
                คณะสังคมศาสตร์ มรภ.เชียงราย
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-2xl">
              ทีมผู้บริหารและผู้นำทางวิชาการ มุ่งมั่นขับเคลื่อนการจัดการศึกษา บูรณาการองค์ความรู้เพื่อสังคม และพัฒนาท้องถิ่นสู่มาตรฐานความเป็นเลิศระดับสากล
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. STICKY SUB-NAVIGATION BAR ================= */}
      <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-6 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="px-3 py-1.5 rounded-lg text-[#C2410C] bg-orange-50/80 font-bold">
                คณะผู้บริหาร
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="hidden sm:inline">หน้าอื่นในหมวด:</span>
              <Link href="/about" className="hover:text-[#C2410C] hover:underline">
                ภาพรวมคณะ
              </Link>
              <span>•</span>
              <Link href="/about/strategy" className="hover:text-[#C2410C] hover:underline">
                แผนยุทธศาสตร์
              </Link>
              <span>•</span>
              <Link href="/about/structure" className="hover:text-[#C2410C] hover:underline">
                โครงสร้างการบริหาร
              </Link>
              <span>•</span>
              <Link href="/about/staff" className="hover:text-[#C2410C] hover:underline">
                บุคลากร
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CONTENT BODY ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isApiError ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-red-200 shadow-2xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <ShieldCheck className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              ไม่สามารถโหลดข้อมูลคณะผู้บริหารได้ในขณะนี้
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              กรุณารีเฟรชหน้าเว็บ หรือตรวจสอบการเชื่อมต่อกับระบบฐานข้อมูล
            </p>
          </div>
        ) : staffList.length > 0 ? (
          <div className="space-y-16">
            {/* 3.1 คณบดี (Dean Spotlight) */}
            {deanPerson && <DeanSpotlightCard dean={deanPerson} />}

            {/* 3.2 คณะผู้บริหารระดับสูง (Senior Leadership: รองคณบดี) */}
            {seniorExecs.length > 0 && (
              <section aria-labelledby="senior-leadership-title" className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#C2410C] rounded-full" />
                    <h2
                      id="senior-leadership-title"
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading"
                    >
                      คณะผู้บริหารระดับสูง (Senior Leadership)
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {seniorExecs.length} ท่าน
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {seniorExecs.map((staff) => (
                    <ExecutiveCard
                      key={staff.id}
                      staff={staff}
                      badgeText="รองคณบดี"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3.3 ผู้ช่วยคณบดี (Assistant Deans) */}
            {assistantDeans.length > 0 && (
              <section aria-labelledby="assistant-deans-title" className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h2
                      id="assistant-deans-title"
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading"
                    >
                      ผู้ช่วยคณบดี (Assistant Deans)
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {assistantDeans.length} ท่าน
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {assistantDeans.map((staff) => (
                    <ExecutiveCard
                      key={staff.id}
                      staff={staff}
                      badgeText="ผู้ช่วยคณบดี"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3.4 ประธานหลักสูตรและสาขาวิชา (Department Chairs) */}
            {departmentChairs.length > 0 && (
              <section aria-labelledby="department-chairs-title" className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#0B132B] rounded-full" />
                    <h2
                      id="department-chairs-title"
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading"
                    >
                      ประธานหลักสูตรและสาขาวิชา (Academic Program Chairs)
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {departmentChairs.length} ท่าน
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {departmentChairs.map((staff) => (
                    <ExecutiveCard key={staff.id} staff={staff} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Users className="size-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              ยังไม่มีการบันทึกข้อมูลคณะผู้บริหาร
            </h3>
            <p className="text-xs text-slate-500">
              อยู่ระหว่างการปรับปรุงข้อมูลทำเนียบผู้บริหารประจำปีการศึกษา
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
