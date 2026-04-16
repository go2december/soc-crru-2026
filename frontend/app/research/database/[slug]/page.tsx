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
    <div className="bg-base-100 min-h-screen pb-16 lg:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative w-full h-[52vh] sm:h-[60vh] min-h-[380px] max-h-[620px] flex items-end">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={project.titleTh}
            fill
            unoptimized
            className="object-cover pointer-events-none"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-scholar-deep via-slate-900 to-scholar-accent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl space-y-6">
            <Link href="/research/database" className="group inline-flex items-center gap-2 font-medium text-white/80 transition-colors hover:text-white">
              <span className="flex items-center justify-center p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <ArrowLeft className="h-4 w-4" />
              </span>
              กลับไปฐานข้อมูลงานวิจัย
            </Link>

            <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'ฐานข้อมูลงานวิจัย', href: '/research/database' }, { label: project.titleTh }]} />

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="rounded-full px-4 py-1.5 shadow-sm text-xs sm:text-sm whitespace-nowrap bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30">
                {RESEARCH_STATUS_LABELS[project.status]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <CalendarDays className="h-4 w-4" />
                เผยแพร่ {formatDate(project.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <Microscope className="h-4 w-4" />
                ปีงบประมาณ {project.year}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-md">
              {project.titleTh}
            </h1>

            {project.titleEn && (
              <p className="text-white/80 text-lg max-w-4xl">{project.titleEn}</p>
            )}
          </div>
        </div>
      </section>

      <div className={`container mx-auto px-4 py-12 lg:py-16 ${attachments.length > 0 ? 'grid gap-12 lg:grid-cols-[1fr_minmax(0,340px)]' : 'max-w-6xl'}`}>
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body gap-2 p-5">
                <p className="text-xs uppercase tracking-wider text-base-content/60">แหล่งทุน</p>
                <p className="font-semibold text-base-content">{project.fundingSource || '-'}</p>
              </div>
            </div>
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body gap-2 p-5">
                <p className="text-xs uppercase tracking-wider text-base-content/60">งบประมาณ</p>
                <p className="font-semibold text-base-content">{formatBudget(project.budget)} บาท</p>
              </div>
            </div>
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body gap-2 p-5">
                <p className="text-xs uppercase tracking-wider text-base-content/60">รับใช้สังคม</p>
                <p className="font-semibold text-base-content">{project.isSocialService ? 'ใช่' : 'ไม่ใช่'}</p>
              </div>
            </div>
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body gap-2 p-5">
                <p className="text-xs uppercase tracking-wider text-base-content/60">เชิงพาณิชย์</p>
                <p className="font-semibold text-base-content">{project.isCommercial ? 'ใช่' : 'ไม่ใช่'}</p>
              </div>
            </div>
          </div>

          {(project.abstractTh || project.abstractEn) && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-base-content">บทคัดย่อ</h2>
              {project.abstractTh && (
                <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-primary mb-3">ภาษาไทย</p>
                  <p className="leading-8 text-base-content/80 whitespace-pre-line">{project.abstractTh}</p>
                </div>
              )}
              {project.abstractEn && (
                <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-secondary mb-3">English</p>
                  <p className="leading-8 text-base-content/80 whitespace-pre-line">{project.abstractEn}</p>
                </div>
              )}
            </section>
          )}

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> ทีมวิจัย
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member, index) => (
                <div key={`${member.displayName || member.externalName || member.staffProfileId || 'member'}-${index}`} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    {member.staffProfileId ? (
                      <Link
                        href={`/about/staff/${member.staffProfileId}`}
                        className="font-bold text-base-content hover:text-primary transition-colors"
                      >
                        {member.displayName || member.externalName || 'ไม่ระบุชื่อ'}
                      </Link>
                    ) : (
                      <span className="font-bold text-base-content">{member.displayName || member.externalName || 'ไม่ระบุชื่อ'}</span>
                    )}
                    <span className="badge badge-outline">{RESEARCH_MEMBER_ROLE_LABELS[member.role]}</span>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center text-base-content/60">
                  ยังไม่มีข้อมูลทีมวิจัย
                </div>
              )}
            </div>
          </section>

          {project.keywords && project.keywords.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-base-content">คำสำคัญ</h2>
              <div className="flex flex-wrap gap-2">
                {project.keywords.map((keyword) => (
                  <span key={keyword} className="badge badge-lg bg-base-200 border-base-300 text-base-content/80">
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" /> พื้นที่ดำเนินการ
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {locations.map((location, index) => (
                <div key={`${location.province || 'location'}-${index}`} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-2">
                  <p className="font-semibold text-base-content">
                    {[location.subDistrict, location.district, location.province].filter(Boolean).join(' • ') || 'ไม่ระบุพื้นที่'}
                  </p>
                  {(location.lat !== undefined || location.lng !== undefined) && (
                    <p className="text-sm text-base-content/70">
                      พิกัด: {location.lat ?? '-'}, {location.lng ?? '-'}
                    </p>
                  )}
                </div>
              ))}
              {locations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center text-base-content/60">
                  ยังไม่มีข้อมูลพื้นที่ดำเนินการ
                </div>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" /> SDGs และผลลัพธ์เชิงยุทธศาสตร์
            </h2>
            <ResearchSdgBadges sdgIds={project.sdgIds} />
            <div className="flex flex-wrap gap-3">
              <span className={`badge badge-lg ${project.isSocialService ? 'badge-success' : 'badge-ghost'}`}>รับใช้สังคม</span>
              <span className={`badge badge-lg ${project.isCommercial ? 'badge-warning' : 'badge-ghost'}`}>เชิงพาณิชย์</span>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <Microscope className="h-6 w-6 text-primary" /> ผลผลิตวิชาการ
            </h2>
            <div className="space-y-4">
              {outputs.map((output, index) => (
                <div key={`${output.title}-${index}`} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {output.outputType && <span className="badge badge-outline">{output.outputType}</span>}
                    {output.tier && <span className="badge badge-secondary badge-outline">{output.tier}</span>}
                    {output.publicationDate && <span className="text-sm text-base-content/60">{formatDate(output.publicationDate)}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-base-content">{output.title}</h3>
                  {output.journalName && <p className="text-base-content/70">{output.journalName}</p>}
                  {(output.volume || output.issue || output.pages) && (
                    <p className="text-sm text-base-content/60">
                      {[output.volume && `Vol. ${output.volume}`, output.issue && `No. ${output.issue}`, output.pages && `pp. ${output.pages}`].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {output.citation && (
                    <p className="text-sm leading-7 text-base-content/80 whitespace-pre-line">{output.citation}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {output.doiUrl && (
                      <a href={output.doiUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">DOI</a>
                    )}
                    {output.tciUrl && (
                      <a href={output.tciUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">TCI</a>
                    )}
                    {output.externalUrl && (
                      <a href={output.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">External</a>
                    )}
                  </div>
                </div>
              ))}
              {outputs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center text-base-content/60">
                  ยังไม่มีข้อมูลผลผลิตวิชาการ
                </div>
              )}
            </div>
          </section>

          {(previousProject || nextProject) && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-base-content">นำทางงานวิจัย</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {previousProject ? (
                  <Link href={`/research/database/${previousProject.slug}`} className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                      <ArrowLeft className="h-4 w-4" /> ก่อนหน้า
                    </div>
                    <p className="font-semibold text-base-content group-hover:text-primary transition-colors">{previousProject.titleTh}</p>
                  </Link>
                ) : <div className="hidden md:block" />}

                {nextProject ? (
                  <Link href={`/research/database/${nextProject.slug}`} className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all text-left md:text-right">
                    <div className="flex items-center justify-start md:justify-end gap-2 text-sm text-base-content/60 mb-2">
                      ถัดไป <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-base-content group-hover:text-primary transition-colors">{nextProject.titleTh}</p>
                  </Link>
                ) : <div className="hidden md:block" />}
              </div>
            </section>
          )}

          {relatedProjects.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-base-content">งานวิจัยที่เกี่ยวข้อง</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {relatedProjects.map((item) => (
                  <Link key={item.id} href={`/research/database/${item.slug}`} className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
                        <span className="badge badge-outline">{RESEARCH_STATUS_LABELS[item.status]}</span>
                        <span>ปี {item.year}</span>
                      </div>
                      <h3 className="font-bold text-base-content group-hover:text-primary transition-colors line-clamp-2">
                        {item.titleTh}
                      </h3>
                      <p className="text-sm text-base-content/70 line-clamp-2">
                        {item.memberDisplay.length > 0 ? item.memberDisplay.join(', ') : 'ยังไม่ระบุทีมวิจัย'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {attachments.length > 0 && (
          <aside className="space-y-8 lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden text-base-content">
              <div className="bg-base-200/50 p-5 border-b border-base-300">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> เอกสารที่เกี่ยวข้อง
                </h2>
                <p className="text-xs text-base-content/60 mt-1">คลิกเพื่อดาวน์โหลดรายงานวิจัย เอกสารสรุป หรือไฟล์ประกอบ</p>
              </div>

              <div className="p-4 space-y-3">
                {attachments.map((attachment, index) => {
                  const directHref = getResearchServerAssetUrl(attachment.fileUrl) || attachment.fileUrl;
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                  const href = attachment.id ? `${apiUrl}/api/research/attachments/${attachment.id}/download` : directHref;
                  return (
                    <a
                      key={`${attachment.fileUrl}-${index}`}
                      href={href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-4 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-base-200 p-2 text-base-content/70 transition-colors group-hover:bg-primary group-hover:text-primary-content">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-medium text-base-content group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {attachment.fileName}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-base-content/50">
                            <span className="uppercase tracking-wider px-2 py-0.5 bg-base-200 rounded-md">
                              {attachment.fileType || 'FILE'}
                            </span>
                            <span>{attachment.downloadCount || 0} ดาวน์โหลด</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
