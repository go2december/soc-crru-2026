import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'คลังข้อมูล 5 อัตลักษณ์เชียงราย | ศูนย์เชียงรายศึกษา',
    description: 'คลังข้อมูลดิจิทัล 5 อัตลักษณ์เชียงราย: ประวัติศาสตร์ โบราณคดี ชาติพันธุ์ ศิลปะการแสดง และภูมิปัญญาท้องถิ่น ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    openGraph: { title: 'คลังข้อมูล 5 อัตลักษณ์เชียงราย | ศูนย์เชียงรายศึกษา', url: '/chiang-rai-studies/archive' },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
