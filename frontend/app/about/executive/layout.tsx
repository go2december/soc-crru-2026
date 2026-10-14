import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'คณะผู้บริหาร (Executive Board) | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description: 'ทำเนียบคณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย นำโดยคณบดี รองคณบดี ผู้ช่วยคณบดี และประธานสาขาวิชา/แขนงวิชา ขับเคลื่อนสู่ความเป็นเลิศทางวิชาการและสังคม',
    keywords: [
        'คณะผู้บริหาร คณะสังคมศาสตร์',
        'คณบดี คณะสังคมศาสตร์ มรภ.เชียงราย',
        'Executive Board Faculty of Social Sciences CRRU',
        'ผู้บริหาร มรภ.เชียงราย',
        'มหาวิทยาลัยราชภัฏเชียงราย'
    ],
    openGraph: {
        title: 'คณะผู้บริหาร (Executive Board) | คณะสังคมศาสตร์ มรภ.เชียงราย',
        description: 'ทำเนียบคณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย นำโดยคณบดี รองคณบดี ผู้ช่วยคณบดี และประธานสาขาวิชา/แขนงวิชา',
        type: 'website',
        locale: 'th_TH',
    },
};

export default function ExecutiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
