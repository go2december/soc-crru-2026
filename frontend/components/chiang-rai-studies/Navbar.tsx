
'use client';

import Link from 'next/link';
import { Menu, X, Landmark, Search } from 'lucide-react';
import { useState } from 'react';

const MENU_ITEMS = [
    { title: 'หน้าแรก', href: '/chiang-rai-studies' },
    { title: 'เกี่ยวกับเรา', href: '/chiang-rai-studies/about' },
    { title: 'คลังข้อมูล 5 อัตลักษณ์', href: '/chiang-rai-studies/archive' },
    { title: 'งานวิจัยและบทความ', href: '/chiang-rai-studies/articles' },
    { title: 'ทำเนียบบุคลากร', href: '/chiang-rai-studies/staff' },
    { title: 'ติดต่อเรา', href: '/chiang-rai-studies/contact' },
];

export default function ChiangRaiNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#581c87] border-b border-purple-800 text-purple-100 relative z-50 font-kanit">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/chiang-rai-studies" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 border border-orange-400/30">
                        <Landmark size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white leading-tight tracking-wide drop-shadow-sm">
                            ศูนย์เชียงรายศึกษา
                        </h1>
                        <p className="text-[10px] text-orange-300 uppercase tracking-widest font-medium">Chiang Rai Studies Center</p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium hover:text-white transition-colors relative group py-2"
                        >
                            {item.title}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <button className="p-2 hover:bg-purple-800 rounded-full text-purple-200 hover:text-orange-300 transition">
                        <Search size={20} />
                    </button>
                    <Link
                        href="/"
                        className="ml-4 px-4 py-1.5 text-xs font-bold border border-purple-400/50 rounded-full hover:bg-orange-600 hover:border-orange-600 hover:text-white transition text-purple-200"
                    >
                        กลับสู่เว็บคณะ
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 text-purple-200 hover:text-orange-400 transition"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-[#581c87] border-b border-purple-800 lg:hidden shadow-2xl animate-fade-in">
                    <div className="flex flex-col py-4">
                        {MENU_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-4 text-purple-100 hover:bg-purple-800 hover:text-orange-300 border-l-4 border-transparent hover:border-orange-500 transition-all font-medium"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
