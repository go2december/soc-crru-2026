import type { Metadata } from 'next';
import ResearchDatabaseClient from './ResearchDatabaseClient';

export const metadata: Metadata = {
    title: 'ฐานข้อมูลงานวิจัยและวิทยานิพนธ์ | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description: 'ค้นหาฐานข้อมูลงานวิจัยและวิทยานิพนธ์ของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมตัวกรองตามปี สถานะ และ SDGs',
    alternates: {
        canonical: '/research/database',
    },
    openGraph: {
        title: 'ฐานข้อมูลงานวิจัยและวิทยานิพนธ์ | คณะสังคมศาสตร์ มรภ.เชียงราย',
        description: 'ค้นหาฐานข้อมูลงานวิจัยและวิทยานิพนธ์ของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมตัวกรองตามปี สถานะ และ SDGs',
        url: '/research/database',
        type: 'website',
        locale: 'th_TH',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ฐานข้อมูลงานวิจัยและวิทยานิพนธ์ | คณะสังคมศาสตร์ มรภ.เชียงราย',
        description: 'ค้นหาฐานข้อมูลงานวิจัยและวิทยานิพนธ์ของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมตัวกรองตามปี สถานะ และ SDGs',
    },
};

export default function ResearchDatabasePage() {
    return <ResearchDatabaseClient />;
}
