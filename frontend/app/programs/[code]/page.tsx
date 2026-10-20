import { fetchProgramByCode, ProgramInstructor } from '@/lib/api';
import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th';

interface Props {
  params: Promise<{
    code: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { code } = await props.params;
  const program = await fetchProgramByCode(code);

  if (!program) {
    return { title: 'ไม่พบหลักสูตร | สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย' };
  }

  const title = `${program.nameTh} (${program.degreeTitleTh || 'หลักสูตรวิชาการ'}) | สำนักวิชาสังคมศาสตร์ มรภ.เชียงราย`;
  const description =
    program.description ||
    `ข้อมูลหลักสูตร ${program.nameTh} สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`;
  const bannerUrl =
    program.bannerUrl ||
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
  const pageUrl = `${BASE_URL}/programs/${code}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
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
          alt: program.nameTh,
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

export default async function ProgramDynamicsPage(props: Props) {
  const params = await props.params;
  const { code } = params;

  // Fetch data from API
  const program = await fetchProgramByCode(code);

  if (!program) {
    notFound();
  }

  // Support both new first-class relational tracks and legacy concentrations
  const concentrationsList =
    program.tracks && program.tracks.length > 0
      ? program.tracks.map((t) => ({
          code: t.code,
          title: t.nameTh,
          titleEn: t.nameEn || undefined,
          degreeTitle: t.degreeTitleTh || undefined,
          description: t.description || '',
          bannerUrl: t.bannerUrl || undefined,
          highlights: t.highlights || undefined,
          careers: t.careers || undefined,
          structure: t.structure || undefined,
          curriculumUrl: t.curriculumUrl || undefined,
          youtubeVideoUrl: t.youtubeVideoUrl || undefined,
          facebookVideoUrl: t.facebookVideoUrl || undefined,
        }))
      : program.concentrations;

  // Map API data to UI Component Props
  const templateData: ProgramData = {
    id: program.id,
    programCode: program.code,
    title: program.nameTh,
    degree: program.degreeTitleTh || program.degreeTitleEn || program.nameTh,
    image:
      program.bannerUrl ||
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
    description: program.description || '',
    level:
      program.degreeLevel === 'BACHELOR'
        ? 'ปริญญาตรี'
        : program.degreeLevel === 'MASTER'
        ? 'ปริญญาโท'
        : 'ปริญญาเอก',
    studyPlanType: 'REGULAR_4YR',
    highlights: (program.highlights || []).map((h) => ({
      title: h.title,
      description: h.description,
    })),
    careers: program.careers || [],
    structure: program.structure || {
      totalCredits: 0,
      general: 0,
      major: 0,
      freeElective: 0,
    },
    downloadLink: program.curriculumUrl,
    concentrations: concentrationsList,
    socialLinks: program.socialLinks,
    galleryImages: program.galleryImages,
    attachments: program.attachments,
    youtubeVideoUrl: program.youtubeVideoUrl,
    facebookVideoUrl: program.facebookVideoUrl,
    instructors: program.instructors as ProgramInstructor[] | undefined,
  };

  // JSON-LD Structured Data for Degree Program
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: program.nameTh,
    description: program.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    educationalCredentialAwarded: program.degreeTitleTh || program.nameTh,
    occupationalCategory: (program.careers || []).slice(0, 5).join(', '),
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
