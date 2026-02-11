
'use client';

import { usePathname } from 'next/navigation';
import ChiangRaiNavbar from './Navbar';
import ChiangRaiFooter from './Footer';

export default function ChiangRaiClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/chiang-rai-studies/admin');

    if (isAdmin) {
        // Admin pages manage their own layout (Admin Sidebar, etc.)
        return (
            <main className="flex-grow min-h-screen">
                {children}
            </main>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* --- Dedicated Navbar --- */}
            <ChiangRaiNavbar />

            {/* --- Main Content --- */}
            <main className="flex-grow">
                {children}
            </main>

            {/* --- Dedicated Footer --- */}
            <ChiangRaiFooter />
        </div>
    );
}
