import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Tag,
  Calendar,
  Users,
  Coins,
  FileText,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import {
  AcademicServiceItem,
  getServiceTypeConfig,
  getStatusConfig,
  getRoleLabel,
} from '@/lib/academic-services';
import GalleryClient from '@/components/GalleryClient';
import JsonLd from '@/components/seo/JsonLd';
import ResearchSdgBadges from '@/components/ResearchSdgBadges';
import { getApiBaseUrl } from '@/lib/api-config';

const API_URL = getApiBaseUrl();

async function getServiceById(id: string): Promise<AcademicServiceItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/academic-services/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch academic service detail:', error);
    return null;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const project = await getServiceById(params.id);

  if (!project) {
    return {
      title: 'ไม่พบข้อมูลโครงการ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    };
  }

  const cleanDescription = project.description
    ? project.description.slice(0, 160).replace(/\s+/g, ' ').trim()
    : 'โครงการบริการวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย';

  return {
    title: `${project.title} | บริการวิชาการ คณะสังคมศาสตร์ มรภ.เชียงราย`,
    description: cleanDescription,
    alternates: {
      canonical: `/research/services/${project.id}`,
    },
    openGraph: {
      title: `${project.title} | บริการวิชาการ คณะสังคมศาสตร์`,
      description: cleanDescription,
      url: `/research/services/${project.id}`,
      type: 'article',
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : undefined,
    },
  };
}

export default async function AcademicServiceDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const project = await getServiceById(params.id);

  if (!project) {
    notFound();
  }

  const typeConfig = getServiceTypeConfig(project.serviceType);
  const statusConfig = getStatusConfig(project.status || 'ONGOING');
  const galleryImages = project.galleryImages || [];
  const members = project.members || [];
  const sdgIds = project.sdgIds || [];

  // Schema.org Structured Data (Strictly aligned with actual schema)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: project.title,
    description: project.description || '',
    areaServed: project.area || 'จังหวัดเชียงราย',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    ...(project.coverImageUrl ? { image: project.coverImageUrl } : {}),
  };

  const formattedBudget = project.budget
    ? new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(
        Number(project.budget)
      )
    : null;

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800 pb-24">
      <JsonLd data={serviceSchema} />

      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-20 overflow-hidden">
        {project.coverImageUrl && (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            priority
            className="object-cover opacity-15"
          />
        )}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและนวัตกรรม', href: '/research' },
              { label: 'บริการวิชาการ', href: '/research/services' },
              { label: project.title },
            ]}
          />

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-scholar-accent text-white shadow-sm">
                {typeConfig.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md border ${statusConfig.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight leading-snug">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <main className="container mx-auto px-4 max-w-5xl -mt-10 relative z-10">
        <div className="space-y-8">
          {/* 2.1 QUICK FACT SHEET (4-Column Clean Matrix) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-scholar-accent" /> ข้อมูลสรุปโครงการ (Project Fact Sheet)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Area */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  พื้นที่ดำเนินงาน
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-scholar-accent shrink-0" />
                  <span className="line-clamp-2">{project.area || 'ไม่ระบุพื้นที่เฉพาะ'}</span>
                </p>
              </div>

              {/* Service Type */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  ประเภทบริการ
                </span>
                <p className="text-sm font-bold text-slate-900 line-clamp-2">
                  {typeConfig.label}
                </p>
              </div>

              {/* Budget / Funding */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  แหล่งทุน / งบประมาณ
                </span>
                <p className="text-sm font-bold text-slate-900 line-clamp-2">
                  {project.fundingSource || 'งบประมาณคณะ/มหาวิทยาลัย'}
                  {formattedBudget ? ` (${formattedBudget})` : ''}
                </p>
              </div>

              {/* Status */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  สถานะโครงการ
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusConfig.label}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 2.2 PROJECT DESCRIPTION CARD */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-scholar-accent pl-3">
              รายละเอียดโครงการและเป้าหมายการดำเนินงาน
            </h2>

            {project.description ? (
              <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">
                {project.description}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลรายละเอียดเพิ่มเติม</p>
            )}
          </div>

          {/* 2.3 RESPONSIBLE TEAM & FACULTY MEMBERS CARD (PDPA Compliant) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-l-4 border-scholar-accent pl-3">
                  คณะทำงานและอาจารย์ผู้รับผิดชอบโครงการ
                </h2>
                <span className="text-xs text-slate-400 pl-4 block mt-0.5">
                  Project Leadership & Academic Staff
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {members.length} ท่าน
              </span>
            </div>

            {members.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-50 text-xs text-slate-500 text-center">
                ดำเนินงานโดย คณาจารย์และบุคลากร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => {
                  const isLeader = member.role === 'LEADER';
                  const fullName = `${member.prefix || ''}${member.firstNameTh || ''} ${
                    member.lastNameTh || ''
                  }`.trim();

                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border flex items-center gap-3 transition-colors ${
                        isLeader
                          ? 'bg-amber-50/50 border-amber-200/80'
                          : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isLeader
                            ? 'bg-scholar-accent text-white font-bold'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider block ${
                            isLeader ? 'text-scholar-accent' : 'text-slate-400'
                          }`}
                        >
                          {getRoleLabel(member.role)}
                        </span>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {fullName || 'บุคลากรคณะสังคมศาสตร์'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2.4 SDGS SECTION */}
          {sdgIds.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2 border-l-4 border-scholar-accent pl-3">
                เป้าหมายการพัฒนาที่ยั่งยืน (SDGs Contribution)
              </h2>
              <p className="text-xs text-slate-500 mb-4 pl-4">
                โครงการนี้สอดคล้องกับเป้าหมายการพัฒนาที่ยั่งยืนขององค์การสหประชาชาติ (UN SDGs)
              </p>
              <div className="pt-2">
                <ResearchSdgBadges sdgIds={sdgIds} />
              </div>
            </div>
          )}

          {/* 2.5 ATTACHED DOCUMENTS & REPORT DOWNLOAD CARD (Safe Download) */}
          {project.documentUrl && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-scholar-accent pl-3">
                เอกสารเผยแพร่และรายงานสรุปผล
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      รายงานสรุปผลการดำเนินโครงการ / เอกสารเผยแพร่
                    </h3>
                    <span className="text-xs text-slate-400">
                      เอกสารดาวน์โหลดทางการ คณะสังคมศาสตร์
                    </span>
                  </div>
                </div>

                <a
                  href={project.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-scholar-deep hover:bg-scholar-accent text-white text-xs font-bold transition-colors shadow-sm shrink-0"
                >
                  <Download className="w-4 h-4" /> ดาวน์โหลดเอกสาร (PDF)
                </a>
              </div>
            </div>
          )}

          {/* 2.6 GALLERY IMAGES */}
          {galleryImages.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-scholar-accent pl-3">
                ภาพบรรยากาศการดำเนินงานและกิจกรรมในพื้นที่
              </h2>
              <GalleryClient galleryImages={galleryImages} />
            </div>
          )}

          {/* 2.7 BOTTOM BACK BUTTON */}
          <div className="pt-6 text-center">
            <Link
              href="/research/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-scholar-accent hover:border-scholar-accent text-sm font-bold transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> กลับสู่หน้ารวมบริการวิชาการ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
