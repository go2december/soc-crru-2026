import type { Metadata } from 'next';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic) | คณะสังคมศาสตร์ มรภ.เชียงราย',
  description:
    'วารสารสังคมศาสตร์วิชาการ มหาวิทยาลัยราชภัฏเชียงราย เผยแพร่ผลงานวิชาการและบทความวิจัยระดับชาติ ผ่านระบบฐานข้อมูลวารสารอิเล็กทรอนิกส์ไทย (ThaiJO) ได้รับการรับรองดัชนี TCI กลุ่ม 2 e-ISSN 2697-5831',
  keywords: [
    'วารสารสังคมศาสตร์วิชาการ',
    'Journal of Social Academic',
    'วารสาร มรภ.เชียงราย',
    'ThaiJO',
    'TCI กลุ่ม 2',
    'งานวิจัยสังคมศาสตร์',
    'ส่งบทความวิชาการ',
    'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  ],
  alternates: {
    canonical: '/research/journal',
  },
  openGraph: {
    title: 'วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic) | มรภ.เชียงราย',
    description:
      'วารสารวิชาการระดับชาติด้านสังคมศาสตร์ มนุษยศาสตร์ และการพัฒนาท้องถิ่น เผยแพร่ผ่านระบบ ThaiJO ได้รับการรับรองดัชนี TCI',
    url: '/research/journal',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

const THAIJO_URL = 'https://so04.tci-thaijo.org/index.php/social_crru';

export default function JournalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: 'วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic)',
    issn: ['1906-2508', '2697-5831'],
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่',
        addressLocality: 'อำเภอเมือง',
        addressRegion: 'จังหวัดเชียงราย',
        postalCode: '57100',
        addressCountry: 'TH',
      },
    },
    url: THAIJO_URL,
    description:
      'วารสารวิชาการระดับชาติด้านสังคมศาสตร์ มนุษยศาสตร์ และการพัฒนาท้องถิ่น ได้รับการรับรองดัชนี TCI กลุ่ม 2 เผยแพร่ผ่านระบบ ThaiJO',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JournalClient />
    </>
  );
}
