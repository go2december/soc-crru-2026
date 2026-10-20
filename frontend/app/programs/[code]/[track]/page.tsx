import { fetchProgramByCode, fetchTrackByCode, ProgramInstructor } from '@/lib/api';
import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th';

interface Props {
  params: Promise<{
    code: string;
    track: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { code, track } = await props.params;

  // 1. Try first-class track entity
  const trackData = await fetchTrackByCode(code, track);
  if (trackData) {
    const trackLabel = trackData.trackType === 'MAJOR' ? 'กลุ่มวิชาเอก' : 'แขนงวิชา';
    const planSuffix =
      trackData.studyPlanType === 'TRANSFER_2YR'
        ? ' (หลักสูตรเทียบโอน 2 ปีหลัง ปวส.)'
        : trackData.studyPlanType === 'GRADUATE'
        ? ' (ระดับบัณฑิตศึกษา)'
        : ' (หลักสูตร 4 ปีปกติ)';

    const title = `${trackData.nameTh}${planSuffix} | ${trackData.program.nameTh} สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย`;
    const description =
      trackData.description ||
      `ข้อมูล${trackLabel} ${trackData.nameTh} สาขาวิชา${trackData.program.nameTh} สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`;
    const bannerUrl =
      trackData.bannerUrl ||
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
    const pageUrl = `${BASE_URL}/programs/${code}/${track}`;

    return {
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: 'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        images: [
          {
            url: bannerUrl,
            width: 1200,
            height: 630,
            alt: trackData.nameTh,
          },
        ],
        type: 'website',
        locale: 'th_TH',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [bannerUrl],
      },
    };
  }

  // 2. Fallback to program concentrations
  const program = await fetchProgramByCode(code);
  if (!program) return { title: 'ไม่พบหลักสูตร | สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย' };

  const concentration = (program.concentrations || []).find(
    (c) => c.code === track || c.code.toLowerCase() === track.toLowerCase()
  );

  if (!concentration) return { title: `${program.nameTh} | สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย` };

  const title = `${concentration.title} | ${program.nameTh} สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย`;
  const description = concentration.description || program.description;
  const bannerUrl =
    concentration.bannerUrl ||
    program.bannerUrl ||
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
  const pageUrl = `${BASE_URL}/programs/${code}/${track}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      images: [{ url: bannerUrl, width: 1200, height: 630, alt: concentration.title }],
      type: 'website',
      locale: 'th_TH',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bannerUrl],
    },
  };
}

export default async function ProgramTrackSubPage(props: Props) {
  const params = await props.params;
  const { code, track } = params;

  // 1. Fetch parent program to obtain sibling tracks
  const parentProgram = await fetchProgramByCode(code);

  // 2. First-class track entity fetch
  const trackData = await fetchTrackByCode(code, track);

  if (trackData) {
    const isTransfer = trackData.studyPlanType === 'TRANSFER_2YR';
    const isGrad = trackData.studyPlanType === 'GRADUATE';
    const levelLabel = isTransfer
      ? 'ปริญญาตรี (เทียบโอน 2 ปีหลัง ปวส.)'
      : isGrad
      ? 'บัณฑิตศึกษา (ป.โท / ป.เอก)'
      : 'ปริญญาตรี (หลักสูตร 4 ปีปกติ)';

    // Build sibling tracks for 1-click Quick Switcher
    const siblingTracks = (parentProgram?.tracks || []).map((t) => ({
      code: t.code,
      nameTh: t.nameTh,
      studyPlanType: t.studyPlanType,
      trackType: t.trackType,
    }));

    const templateData: ProgramData = {
      id: trackData.id,
      programCode: trackData.program.code,
      title: trackData.nameTh,
      degree:
        trackData.degreeTitleTh ||
        trackData.nameEn ||
        trackData.program.nameTh,
      image:
        trackData.bannerUrl ||
        parentProgram?.bannerUrl ||
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
      description: trackData.description || '',
      level: levelLabel,
      studyPlanType: trackData.studyPlanType,
      highlights: (trackData.highlights || []).map((h) => ({
        title: h.title,
        description: h.description,
      })),
      careers: trackData.careers || [],
      structure: trackData.structure || {
        totalCredits: 0,
        general: 0,
        major: 0,
        freeElective: 0,
      },
      downloadLink: trackData.curriculumUrl || parentProgram?.curriculumUrl || undefined,
      concentrations: undefined,
      siblingTracks,
      socialLinks: trackData.socialLinks || parentProgram?.socialLinks || null,
      galleryImages: trackData.galleryImages || parentProgram?.galleryImages || undefined,
      attachments: trackData.attachments || parentProgram?.attachments || undefined,
      youtubeVideoUrl: trackData.youtubeVideoUrl || parentProgram?.youtubeVideoUrl || undefined,
      facebookVideoUrl: trackData.facebookVideoUrl || parentProgram?.facebookVideoUrl || undefined,
      instructors: (trackData.instructors || parentProgram?.instructors) as ProgramInstructor[] | undefined,
      parentProgram: {
        code: trackData.program.code,
        nameTh: trackData.program.nameTh,
      },
    };

    // JSON-LD Structured Data (Course / EducationalOccupationalProgram)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: trackData.nameTh,
      alternateName: trackData.nameEn || undefined,
      description: trackData.description,
      courseCode: `${code}/${track}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        url: 'https://soc.crru.ac.th',
      },
      educationalCredentialAwarded: trackData.degreeTitleTh || trackData.program.nameTh,
      timeRequired: trackData.studyPlanType === 'TRANSFER_2YR' ? 'P2Y' : 'P4Y',
      occupationalCredentialAwarded: (trackData.careers || []).slice(0, 3).join(', '),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProgramTemplate data={templateData} />
      </>
    );
  }

  // 3. Fallback: Search in parent program's legacy concentrations
  if (!parentProgram) {
    notFound();
  }

  const concentration = (parentProgram.concentrations || []).find(
    (c) => c.code === track || c.code.toLowerCase() === track.toLowerCase()
  );

  if (!concentration) {
    notFound();
  }

  const siblingTracks = (parentProgram.concentrations || []).map((c) => ({
    code: c.code,
    nameTh: c.title,
    studyPlanType: 'REGULAR_4YR',
    trackType: 'CONCENTRATION',
  }));

  const templateData: ProgramData = {
    id: `${parentProgram.id}-${concentration.code}`,
    programCode: parentProgram.code,
    title: concentration.title,
    degree: concentration.degreeTitle || parentProgram.degreeTitleTh || parentProgram.nameTh,
    image:
      concentration.bannerUrl ||
      parentProgram.bannerUrl ||
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
    description: concentration.description || parentProgram.description || '',
    level:
      parentProgram.degreeLevel === 'BACHELOR'
        ? 'ปริญญาตรี (กลุ่มวิชาเฉพาะทาง)'
        : parentProgram.degreeLevel === 'MASTER'
        ? 'ปริญญาโท (กลุ่มวิชาเฉพาะทาง)'
        : 'ปริญญาเอก (กลุ่มวิชาเฉพาะทาง)',
    studyPlanType: 'REGULAR_4YR',
    highlights: (concentration.highlights && concentration.highlights.length > 0
      ? concentration.highlights
      : parentProgram.highlights || []
    ).map((h) => ({
      title: h.title,
      description: h.description,
    })),
    careers:
      concentration.careers && concentration.careers.length > 0
        ? concentration.careers
        : parentProgram.careers || [],
    structure: concentration.structure ||
      parentProgram.structure || {
        totalCredits: 0,
        general: 0,
        major: 0,
        freeElective: 0,
      },
    downloadLink: concentration.curriculumUrl || parentProgram.curriculumUrl,
    concentrations: undefined,
    siblingTracks,
    socialLinks: parentProgram.socialLinks || null,
    galleryImages: parentProgram.galleryImages,
    attachments: parentProgram.attachments,
    youtubeVideoUrl: concentration.youtubeVideoUrl || parentProgram.youtubeVideoUrl,
    facebookVideoUrl: concentration.facebookVideoUrl || parentProgram.facebookVideoUrl,
    instructors: parentProgram.instructors as ProgramInstructor[] | undefined,
    parentProgram: {
      code: parentProgram.code,
      nameTh: parentProgram.nameTh,
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: concentration.title,
    description: concentration.description,
    courseCode: `${code}/${track}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    educationalCredentialAwarded: concentration.degreeTitle || parentProgram.degreeTitleTh || parentProgram.nameTh,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgramTemplate data={templateData} />
    </>
  );
}
