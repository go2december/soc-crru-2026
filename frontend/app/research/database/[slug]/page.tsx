import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Globe,
  MapPin,
  Microscope,
  Users,
  ExternalLink,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import ResearchSdgBadges from '@/components/ResearchSdgBadges';
import {
  fetchResearchList,
  fetchResearchBySlug,
  getResearchServerAssetUrl,
  RESEARCH_MEMBER_ROLE_LABELS,
  RESEARCH_STATUS_LABELS,
} from '@/lib/research';

function formatDate(date?: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatBudget(budget?: string | null): string {
  if (!budget) return '-';
  const parsed = Number(budget);
  if (Number.isNaN(parsed)) return budget;
  return parsed.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchResearchBySlug(slug);

  if (!project) {
    return {
      title: 'ไม่พบข้อมูลงานวิจัย | คณะสังคมศาสตร์ มรภ.เชียงราย',
    };
  }

  const title = `${project.titleTh} | ฐานข้อมูลงานวิจัย`;
  const description = (project.abstractTh || project.abstractEn || project.titleTh).slice(0, 160);
  const ogImage = getResearchServerAssetUrl(project.coverImageUrl) || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/research/database/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/research/database/${slug}`,
      type: 'article',
      locale: 'th_TH',
      images: ogImage ? [{ url: ogImage }] : [],
      publishedTime: project.publishedAt || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const response = await fetchResearchList({ page: 1, limit: 200 });
  return (response.data || [])
    .filter((item) => Boolean(item.slug))
    .map((item) => ({ slug: item.slug }));
}

export default async function ResearchDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await fetchResearchBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const relatedResponse = await fetchResearchList({ page: 1, limit: 12 });
  const orderedProjects = relatedResponse.data || [];
  const currentIndex = orderedProjects.findIndex((item) => item.slug === project.slug);
  const previousProject = currentIndex > 0 ? orderedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < orderedProjects.length - 1
    ? orderedProjects[currentIndex + 1]
    : null;
  const relatedProjects = orderedProjects
    .filter((item) => item.slug !== project.slug)
    .filter((item) => item.sdgIds.some((sdgId) => project.sdgIds.includes(sdgId)) || item.status === project.status)
    .slice(0, 3);

  const heroImage = getResearchServerAssetUrl(project.coverImageUrl) || null;
  const attachments = project.attachments || [];
  const outputs = project.outputs || [];
  const locations = project.locations || [];
  const members = project.members || [];
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: project.titleTh,
    alternateName: project.titleEn || undefined,
    abstract: project.abstractTh || project.abstractEn || undefined,
    datePublished: project.publishedAt || undefined,
    keywords: project.keywords || undefined,
    about: project.sdgIds.map((sdgId) => `SDG ${sdgId}`),
    image: heroImage || undefined,
    url: `/research/database/${project.slug}`,
    funder: project.fundingSource ? { '@type': 'Organization', name: project.fundingSource } : undefined,
    contributor: members.map((member) => ({
      '@type': 'Person',
      name: member.displayName || member.externalName || 'ไม่ระบุชื่อ',
      roleName: RESEARCH_MEMBER_ROLE_LABELS[member.role],
    })),
    subjectOf: outputs.map((output) => ({
      '@type': 'ScholarlyArticle',
      name: output.title,
      isPartOf: output.journalName || undefined,
      datePublished: output.publicationDate || undefined,
      url: output.externalUrl || output.doiUrl || output.tciUrl || undefined,
    })),
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 lg:pb-24 font-sans text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Typographic Header Section ── */}
      <header className="bg-white border-b border-slate-200 pt-6 pb-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/research/database" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-scholar-accent transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                กลับไปฐานข้อมูลงานวิจัย
              </Link>
              <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'ฐานข้อมูลงานวิจัย', href: '/research/database' }, { label: project.titleTh }]} />
            </div>

            <div className={heroImage ? "grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-start" : "max-w-4xl"}>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <span className="rounded-sm px-2.5 py-1 bg-scholar-accent/10 text-scholar-accent border border-scholar-accent/20">
                    {RESEARCH_STATUS_LABELS[project.status]}
                  </span>
                  {project.publishedAt && (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      เผยแพร่เมื่อ {formatDate(project.publishedAt)}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl text-slate-900 leading-tight">
                  {project.titleTh}
                </h1>

                {project.titleEn && (
                  <p className="text-base text-slate-400 font-medium font-sans leading-relaxed pt-2 border-t border-slate-100">{project.titleEn}</p>
                )}
              </div>

              {heroImage && (
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-slate-200 shadow-sm rounded-sm bg-slate-50">
                  <Image
                    src={heroImage}
                    alt={project.titleTh}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* ── Key Metrics HUD ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden shadow-sm mt-8">
              <div className="bg-white p-4">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">ปีงบประมาณ</span>
                <span className="block text-base font-extrabold text-slate-800 mt-1">{project.year}</span>
              </div>
              <div className="bg-white p-4">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">งบประมาณวิจัย</span>
                <span className="block text-base font-extrabold text-slate-800 mt-1">{formatBudget(project.budget)} บาท</span>
              </div>
              <div className="bg-white p-4">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">แหล่งทุนสนับสนุน</span>
                <span className="block text-base font-extrabold text-slate-800 mt-1 truncate" title={project.fundingSource || 'ไม่ระบุ'}>{project.fundingSource || 'ไม่ระบุ'}</span>
              </div>
              <div className="bg-white p-4">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">สถานะโครงการ</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold mt-1 text-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${project.status === 'COMPLETED' || project.status === 'PUBLISHED' ? 'bg-emerald-500' : project.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                  {RESEARCH_STATUS_LABELS[project.status]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Grid ── */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[2.5fr_1fr]">
          <div className="space-y-12">
            
            {/* ── Abstract Section (Thai default, English interactive details) ── */}
            {(project.abstractTh || project.abstractEn) && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-scholar-accent" />
                  <h2 className="text-xl font-bold text-slate-900">บทคัดย่อ (Abstract)</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Thai Abstract */}
                  {project.abstractTh ? (
                    <div className="border border-slate-200 bg-white p-6 shadow-sm rounded-sm">
                      <span className="inline-block text-[10px] font-bold text-scholar-accent tracking-wider uppercase bg-scholar-accent/5 px-2.5 py-1 rounded-sm border border-scholar-accent/15 mb-4">ภาษาไทย</span>
                      <p className="text-sm leading-8 text-slate-600 whitespace-pre-line text-justify">{project.abstractTh}</p>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-400 text-sm rounded-sm italic">
                      ไม่มีบทคัดย่อภาษาไทย
                    </div>
                  )}
                  
                  {/* English Abstract (Interactive Details Expander) */}
                  {project.abstractEn ? (
                    <details className="group border border-slate-200 bg-white rounded-sm shadow-sm transition-all duration-300">
                      <summary className="flex items-center justify-between cursor-pointer p-4 font-bold text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 select-none [&::-webkit-details-marker]:hidden list-none">
                        <span className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-400 group-open:text-scholar-accent transition-colors" />
                          <span>English Abstract</span>
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-open:hidden">คลิกเพื่อเปิดอ่าน</span>
                          <span className="text-[10px] font-bold text-scholar-accent uppercase tracking-wider hidden group-open:inline">คลิกเพื่อซ่อน</span>
                          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-open:rotate-90" />
                        </div>
                      </summary>
                      <div className="p-6 border-t border-slate-200 bg-white leading-8 text-sm text-slate-600 text-justify whitespace-pre-line">
                        <p>{project.abstractEn}</p>
                      </div>
                    </details>
                  ) : (
                    <div className="border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-400 text-sm rounded-sm italic">
                      No English abstract available.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Academic Outputs (Publications) ── */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-scholar-accent" />
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-slate-400" /> ผลผลิตวิชาการและการเผยแพร่ (Publications)
                </h2>
              </div>
              
              <div className="space-y-4">
                {outputs.map((output, index) => (
                  <div key={index} className="border border-slate-200 bg-white p-6 shadow-sm rounded-sm hover:border-scholar-accent/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-12 bg-scholar-accent/20 group-hover:bg-scholar-accent transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {output.outputType && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-sm">
                            {output.outputType}
                          </span>
                        )}
                        {output.tier && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-scholar-accent/5 border border-scholar-accent/20 text-scholar-accent rounded-sm">
                            {output.tier}
                          </span>
                        )}
                      </div>
                      {output.publicationDate && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                          <CalendarDays className="h-3.5 w-3.5" />
                          เผยแพร่เมื่อ {formatDate(output.publicationDate)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-800 leading-snug mb-2">{output.title}</h3>
                    {output.journalName && (
                      <p className="text-sm text-slate-500 font-medium italic">{output.journalName}</p>
                    )}
                    
                    {(output.volume || output.issue || output.pages) && (
                      <p className="text-xs text-slate-400 mt-1 font-semibold">
                        {[output.volume && `Volume ${output.volume}`, output.issue && `Issue ${output.issue}`, output.pages && `Pages ${output.pages}`].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    
                    {output.citation && (
                      <div className="mt-3 bg-slate-50 border-l-2 border-slate-300 p-3 text-xs text-slate-500 font-mono leading-relaxed select-all">
                        {output.citation}
                      </div>
                    )}
                    
                    {(output.doiUrl || output.tciUrl || output.externalUrl) && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
                        {output.doiUrl && (
                          <a href={output.doiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-scholar-accent border border-slate-200 px-3 py-1.5 rounded-sm hover:bg-slate-50 transition-colors">
                            DOI <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {output.tciUrl && (
                          <a href={output.tciUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-scholar-accent border border-slate-200 px-3 py-1.5 rounded-sm hover:bg-slate-50 transition-colors">
                            TCI Database <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {output.externalUrl && (
                          <a href={output.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-scholar-accent border border-slate-200 px-3 py-1.5 rounded-sm hover:bg-slate-50 transition-colors">
                            ดูงานวิจัยฉบับเต็ม <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {outputs.length === 0 && (
                  <div className="border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-400 text-sm rounded-sm italic">
                    ยังไม่มีข้อมูลผลผลิตวิชาการในขณะนี้
                  </div>
                )}
              </div>
            </section>

            {/* ── Project Locations ── */}
            {locations.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-scholar-accent" />
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-400" /> พื้นที่ดำเนินการวิจัย
                  </h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {locations.map((location, index) => (
                    <div key={index} className="border border-slate-200 bg-white p-4 shadow-sm rounded-sm flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-sm text-slate-500 mt-0.5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-snug">
                          {[location.subDistrict, location.district, location.province].filter(Boolean).join(' • ') || 'ไม่ระบุพื้นที่'}
                        </p>
                        {(location.lat !== undefined && location.lng !== undefined) && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-scholar-accent hover:underline font-semibold mt-1"
                          >
                            พิกัดแผนที่: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── KeyWords ── */}
            {project.keywords && project.keywords.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-scholar-accent" />
                  <h2 className="text-base font-bold text-slate-900">คำสำคัญ (Keywords)</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((keyword) => (
                    <span key={keyword} className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-sm">
                      #{keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── Sidebar Column (Right 1/3) ── */}
          <aside className="space-y-8">
            
            {/* ── Research Team HUD ── */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Users className="h-5 w-5 text-slate-400" /> ทีมผู้ดำเนินการวิจัย
              </h3>
              
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
                {members.map((member, index) => (
                  <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      {member.staffProfileId ? (
                        <Link
                          href={`/about/staff/${member.staffProfileId}`}
                          className="font-bold text-sm text-slate-800 hover:text-scholar-accent transition-colors"
                        >
                          {member.displayName || member.externalName || 'ไม่ระบุชื่อ'}
                        </Link>
                      ) : (
                        <span className="font-bold text-sm text-slate-800">{member.displayName || member.externalName || 'ไม่ระบุชื่อ'}</span>
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-sm border border-slate-200 whitespace-nowrap">
                        {RESEARCH_MEMBER_ROLE_LABELS[member.role]}
                      </span>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-sm italic">
                    ยังไม่มีข้อมูลทีมวิจัย
                  </div>
                )}
              </div>
            </section>

            {/* ── SDGs & Strategic Impact ── */}
            <section className="border border-slate-200 bg-white p-5 rounded-sm shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Globe className="h-5 w-5 text-scholar-accent" /> เป้าหมายความยั่งยืน & ผลลัพธ์
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sustainable Development Goals</span>
                  <ResearchSdgBadges sdgIds={project.sdgIds} />
                </div>
                
                <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-sm border ${project.isSocialService ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {project.isSocialService ? '✓ รับใช้สังคม' : '✗ ไม่รับใช้สังคม'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-sm border ${project.isCommercial ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {project.isCommercial ? '✓ เชิงพาณิชย์' : '✗ ไม่ใช่เชิงพาณิชย์'}
                  </span>
                </div>
              </div>
            </section>

            {/* ── Related Attachments/Documents ── */}
            {attachments.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <FileText className="h-5 w-5 text-slate-400" /> เอกสารดาวน์โหลด
                </h3>
                
                <div className="space-y-3">
                  {attachments.map((attachment, index) => {
                    const directHref = getResearchServerAssetUrl(attachment.fileUrl) || attachment.fileUrl;
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                    const href = attachment.id ? `${apiUrl}/api/research/attachments/${attachment.id}/download` : directHref;
                    return (
                      <a
                        key={index}
                        href={href}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-1.5 rounded-sm border border-slate-200 bg-white p-4 transition-all hover:border-scholar-accent/50 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-sm bg-slate-50 border border-slate-100 p-2 text-slate-500 group-hover:bg-scholar-accent group-hover:text-white group-hover:border-scholar-accent transition-colors">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-words font-bold text-sm text-slate-700 group-hover:text-scholar-accent transition-colors leading-snug line-clamp-2">
                              {attachment.fileName}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400">
                              <span className="uppercase tracking-wider px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-sm">
                                {attachment.fileType || 'FILE'}
                              </span>
                              <span>{attachment.downloadCount || 0} Downloads</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

          </aside>
        </div>

        {/* ── Dynamic Layout Navigation ── */}
        {(previousProject || nextProject) && (
          <section className="mt-16 pt-8 border-t border-slate-200">
            <div className="grid gap-4 md:grid-cols-2">
              {previousProject ? (
                <Link href={`/research/database/${previousProject.slug}`} className="group rounded-sm border border-slate-200 bg-white p-5 shadow-sm hover:border-scholar-accent/40 hover:bg-slate-50/50 transition-all flex flex-col items-start gap-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" /> โครงการก่อนหน้า
                  </span>
                  <p className="font-bold text-sm text-slate-800 group-hover:text-scholar-accent transition-colors leading-snug">{previousProject.titleTh}</p>
                </Link>
              ) : <div className="hidden md:block" />}

              {nextProject ? (
                <Link href={`/research/database/${nextProject.slug}`} className="group rounded-sm border border-slate-200 bg-white p-5 shadow-sm hover:border-scholar-accent/40 hover:bg-slate-50/50 transition-all flex flex-col items-end gap-1 text-right">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    โครงการถัดไป <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <p className="font-bold text-sm text-slate-800 group-hover:text-scholar-accent transition-colors leading-snug">{nextProject.titleTh}</p>
                </Link>
              ) : <div className="hidden md:block" />}
            </div>
          </section>
        )}

        {/* ── Related Research Projects ── */}
        {relatedProjects.length > 0 && (
          <section className="mt-16 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">งานวิจัยที่เกี่ยวข้องอื่นๆ</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link key={item.id} href={`/research/database/${item.slug}`} className="group rounded-sm border border-slate-200 bg-white p-5 shadow-sm hover:border-scholar-accent/40 transition-all flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400">
                      <span className="px-2 py-0.5 border border-slate-200 rounded-sm bg-slate-50 uppercase tracking-wider">
                        {RESEARCH_STATUS_LABELS[item.status]}
                      </span>
                      <span>ปีงบฯ {item.year}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-scholar-accent transition-colors line-clamp-2 leading-snug">
                      {item.titleTh}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 border-t border-slate-50 pt-2 font-semibold">
                    นักวิจัย: {item.memberDisplay.length > 0 ? item.memberDisplay.join(', ') : 'ไม่ระบุ'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
