import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'บุคลากรคณะสังคมศาสตร์ (Staff Directory) | Faculty of Social Sciences',
    description: 'ทำเนียบบุคลากรสายวิชาการและสายสนับสนุน คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
};

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
