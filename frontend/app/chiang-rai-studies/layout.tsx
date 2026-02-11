import { Kanit } from 'next/font/google';
import ChiangRaiClientLayout from '../../components/chiang-rai-studies/ChiangRaiClientLayout';

const kanit = Kanit({
    weight: ['300', '400', '500', '700'],
    subsets: ['thai', 'latin'],
    variable: '--font-kanit',
    display: 'swap',
});

export const metadata = {
    title: 'Chiang Rai Studies Center | คณะสังคมศาสตร์ มร.ชร.',
    description: 'ศูนย์เชียงรายศึกษา แหล่งเรียนรู้อัตลักษณ์เชียงราย ประวัติศาสตร์ โบราณคดี และภูมิปัญญาท้องถิ่น',
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
