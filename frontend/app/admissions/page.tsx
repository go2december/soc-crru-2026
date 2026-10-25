import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import {
    fetchAdmissionConfig,
    fetchAdmissionSchedules,
    fetchAdmissionDocuments,
} from '@/lib/admissions';
import { getApiBaseUrl } from '@/lib/api-config';

import AdmissionsHero from '@/components/admissions/AdmissionsHero';
import DirectAdmissionSteps from '@/components/admissions/DirectAdmissionSteps';
import AdmissionPathways from '@/components/admissions/AdmissionPathways';
import SchedulesSection from '@/components/admissions/SchedulesSection';
import BrochureAndMedia from '@/components/admissions/BrochureAndMedia';
import FinancialAidAndFAQ from '@/components/admissions/FinancialAidAndFAQ';
import AdmissionContactDesk from '@/components/admissions/AdmissionContactDesk';

export const revalidate = 600; // ISR cache every 10 minutes

export const metadata: Metadata = {
    title: 'ศูนย์รับสมัครนักศึกษาใหม่ | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
        'ข้อมูลการรับสมัครนักศึกษาใหม่ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย รับสมัครตรง ไม่ต้องสอบข้อเขียน ไม่ต้องยื่น TCAS ระดับปริญญาตรีและบัณฑิตศึกษา ปฏิทินรอบรับสมัคร และเอกสารระเบียบการ',
    alternates: {
        canonical: 'https://soc.crru.ac.th/admissions',
    },
    openGraph: {
        title: 'ศูนย์รับสมัครนักศึกษาใหม่ (รับสมัครตรง) | คณะสังคมศาสตร์ มรภ.เชียงราย',
        description:
            'รับสมัครนักศึกษาใหม่โดยตรง ไม่ต้องสอบข้อเขียน ไม่มีสอบสัมภาษณ์ ไม่ต้องยื่น TCAS ระดับปริญญาตรีและบัณฑิตศึกษา พร้อมสิทธิ์ยื่นกู้ยืมกองทุน กยศ. และสะสมหน่วยกิตล่วงหน้าในระบบธนาคารหน่วยกิต',
        url: 'https://soc.crru.ac.th/admissions',
        siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        locale: 'th_TH',
        type: 'website',
    },
};

export default async function AdmissionsPage() {
    const [config, schedules, documents] = await Promise.all([
        fetchAdmissionConfig(),
        fetchAdmissionSchedules(),
        fetchAdmissionDocuments(),
    ]);

    const bachelorLink = config.bachelorLink || 'https://admission.crru.ac.th/';
    const graduateLink = config.graduateLink || 'https://orasis.crru.ac.th/gds_crru/index.php/main/home';
    const apiUrl = getApiBaseUrl();

    const openRoundCount = schedules.filter(
        (s) => s.status === 'OPEN' || s.status === 'ALWAYS'
    ).length;

    // Rich Schema.org structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        url: 'https://soc.crru.ac.th',
        sameAs: [
            'https://www.facebook.com/soc.crru',
            'https://admission.crru.ac.th',
        ],
        description:
            'ศูนย์รับสมัครบุคคลเข้าศึกษาต่อ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ทั้งระดับปริญญาตรีและบัณฑิตศึกษา',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่',
            addressLocality: 'อำเภอเมือง',
            addressRegion: 'เชียงราย',
            postalCode: '57100',
            addressCountry: 'TH',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'รอบการรับสมัครนักศึกษาใหม่',
            itemListElement: schedules.map((sch, i) => ({
                '@type': 'Offer',
                position: i + 1,
                name: sch.roundName,
                description: sch.description || undefined,
                validThrough: sch.period,
            })),
        },
    };

    return (
        <main className="bg-[#F8FAFC] min-h-screen text-slate-800 pb-24 font-sans selection:bg-[#C2410C]/20 selection:text-[#0B132B]">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* 1. Hero Section (Editorial Lanna Modernist) */}
            <AdmissionsHero
                bachelorLink={bachelorLink}
                graduateLink={graduateLink}
                openRoundCount={openRoundCount}
            />

            {/* 2. Main Content Body */}
            <div className="container mx-auto px-4 max-w-7xl pt-8 space-y-12 sm:space-y-16">
                {/* Breadcrumb Navigation */}
                <Breadcrumb items={[{ label: 'ศูนย์รับสมัครนักศึกษา' }]} />

                {/* 3. Direct Admission Steps Roadmap */}
                <DirectAdmissionSteps schedules={schedules} bachelorLink={bachelorLink} />

                {/* 4. Quick Entry Pathways (ป.ตรี / บัณฑิตศึกษา / Credit Bank) */}
                <AdmissionPathways
                    bachelorLink={bachelorLink}
                    graduateLink={graduateLink}
                />

                {/* 5. Schedule Table / Mobile Responsive Cards */}
                <SchedulesSection
                    schedules={schedules}
                    tableTitle={config.tableTitle || undefined}
                />

                {/* 6. Video Showcase, Brochure Lightbox, & Official Documents */}
                <BrochureAndMedia
                    videoUrl={config.youtubeVideoUrl}
                    brochureUrl={config.brochureUrl}
                    documents={documents}
                    apiUrl={apiUrl}
                />

                {/* 7. Financial Aid, Scholarships & FAQ Accordion */}
                <FinancialAidAndFAQ />

                {/* 8. Institutional Contact Desk & Office Location */}
                <AdmissionContactDesk />
            </div>
        </main>
    );
}
