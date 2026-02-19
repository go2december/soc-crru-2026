'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from 'sonner';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isChiangRaiStudies = pathname?.startsWith('/chiang-rai-studies');

    return (
        <>
            {/* Exclude Admin and Chiang Rai Studies from main Navbar/Footer */}
            {(isAdmin || isChiangRaiStudies) ? (
                <main className="flex-grow min-h-screen bg-base-200">
                    {children}
                </main>
            ) : (
                <>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </>
            )}
            <Toaster richColors position="top-right" />
        </>
    );
}
