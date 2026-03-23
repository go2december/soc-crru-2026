import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import ChiangRaiClientLayout from '../../components/chiang-rai-studies/ChiangRaiClientLayout';

const kanit = Kanit({
    weight: ['300', '400', '500', '700'],
    subsets: ['thai', 'latin'],
    variable: '--font-kanit',
    display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th';
const defaultOgImage = '/chiang-rai-studies/opengraph-image';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Chiang Rai Studies Center | คณะสังคมศาสตร์ มร.ชร.',
    description: 'ศูนย์เชียงรายศึกษา แหล่งเรียนรู้อัตลักษณ์เชียงราย ประวัติศาสตร์ โบราณคดี และภูมิปัญญาท้องถิ่น',
    alternates: {
        canonical: '/chiang-rai-studies',
    },
    openGraph: {
        title: 'Chiang Rai Studies Center | คณะสังคมศาสตร์ มร.ชร.',
        description: 'ศูนย์เชียงรายศึกษา แหล่งเรียนรู้อัตลักษณ์เชียงราย ประวัติศาสตร์ โบราณคดี และภูมิปัญญาท้องถิ่น',
        url: '/chiang-rai-studies',
        siteName: 'Faculty of Social Sciences, CRRU',
        images: [
            {
                url: defaultOgImage,
                width: 1200,
                height: 630,
                alt: 'Chiang Rai Studies Center',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chiang Rai Studies Center | คณะสังคมศาสตร์ มร.ชร.',
        description: 'ศูนย์เชียงรายศึกษา แหล่งเรียนรู้อัตลักษณ์เชียงราย ประวัติศาสตร์ โบราณคดี และภูมิปัญญาท้องถิ่น',
        images: [defaultOgImage],
    },
};

export default function ChiangRaiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${kanit.variable} font-kanit min-h-screen flex flex-col bg-[#faf5ff] text-stone-900`}>
            <ChiangRaiClientLayout>
                {children}
            </ChiangRaiClientLayout>
        </div>
    );
}
