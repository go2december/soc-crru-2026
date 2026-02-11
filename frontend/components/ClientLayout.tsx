'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isChiangRaiStudies = pathname?.startsWith('/chiang-rai-studies');

    // Exclude Admin and Chiang Rai Studies from main Navbar/Footer
    if (isAdmin || isChiangRaiStudies) {
        return (
            <main className="flex-grow min-h-screen bg-base-200">
                {children}
            </main>
        );
    }

    return (
        <>
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </>
    );
}
