import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ทำเนียบบุคลากร (Staff Directory) | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description: 'ทำเนียบบุคลากรสายวิชาการและสายสนับสนุน คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย คณาจารย์ นักวิจัย และข้อมูลผลงานวิชาการ Google Scholar, ORCID, Scopus',
    keywords: [
        'บุคลากร',
        'อาจารย์คณะสังคมศาสตร์',
        'ทำเนียบบุคลากร',
        'นักวิจัย',
        'มหาวิทยาลัยราชภัฏเชียงราย',
        'Faculty of Social Sciences',
        'Chiang Rai Rajabhat University',
        'CRRU Staff Directory'
    ],
    openGraph: {
        title: 'ทำเนียบบุคลากร | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        description: 'ทำเนียบบุคลากรสายวิชาการและสายสนับสนุน คณาจารย์และนักวิจัย คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        url: 'https://soc.crru.ac.th/about/staff',
        siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        type: 'website',
        locale: 'th_TH',
    },
    alternates: {
        canonical: 'https://soc.crru.ac.th/about/staff',
    },
};

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
