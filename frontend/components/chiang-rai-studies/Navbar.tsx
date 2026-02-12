'use client';

import Link from 'next/link';
import { Menu, X, Landmark, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    { title: 'หน้าแรก', href: '/chiang-rai-studies' },
    {
        title: 'เกี่ยวกับเรา',
        href: '#',
        submenu: [
            { title: 'ความเป็นมา', href: '/chiang-rai-studies/about/history' },
            { title: 'วัตถุประสงค์', href: '/chiang-rai-studies/about/objectives' },
            { title: 'เป้าหมาย/พันธกิจ', href: '/chiang-rai-studies/about/goals-mission' },
            { title: 'separator', href: '#' },
            { title: 'โครงสร้างองค์กร', href: '/chiang-rai-studies/about/structure' }
        ]
    },
    { title: 'คลังข้อมูล 5 อัตลักษณ์', href: '/chiang-rai-studies/archive' },
    { title: 'งานวิจัยและบทความ', href: '/chiang-rai-studies/articles' },
    { title: 'ทำเนียบบุคลากร', href: '/chiang-rai-studies/staff' },
    { title: 'ติดต่อเรา', href: '/chiang-rai-studies/contact' },
];

export default function ChiangRaiNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setOpenSubmenu(null);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenSubmenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSubmenu = (title: string) => {
        if (openSubmenu === title) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(title);
        }
    };

    return (
        <nav className="bg-[#581c87] border-b border-purple-800 text-purple-100 relative z-50 font-kanit" ref={dropdownRef}>
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
                        <div key={item.title} className="relative group">
                            {item.submenu ? (
                                <button
                                    className="flex items-center gap-1 text-sm font-medium hover:text-white transition-colors py-2 focus:outline-none"
                                    onClick={() => toggleSubmenu(item.title)}
                                    aria-expanded={openSubmenu === item.title}
                                >
                                    {item.title}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${openSubmenu === item.title ? 'rotate-180' : ''}`} />
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium hover:text-white transition-colors relative group py-2"
                                >
                                    {item.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )}

                            {/* Dropdown Content */}
                            {item.submenu && openSubmenu === item.title && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-purple-100 py-2 animate-fade-in z-50">
                                    {item.submenu.map((subItem, index) => (
                                        subItem.title === 'separator' ? (
                                            <div key={`sep-${index}`} className="my-1 border-t border-purple-100"></div>
                                        ) : (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="block px-6 py-3 text-sm text-stone-600 hover:bg-purple-50 hover:text-[#581c87] transition-colors font-medium border-l-4 border-transparent hover:border-orange-500"
                                                onClick={() => setOpenSubmenu(null)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
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
                <div className="absolute top-full left-0 w-full bg-[#581c87] border-b border-purple-800 lg:hidden shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col py-4">
                        {MENU_ITEMS.map((item) => (
                            <div key={item.title}>
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleSubmenu(item.title)}
                                            className="w-full flex justify-between items-center px-6 py-4 text-purple-100 hover:bg-purple-800 hover:text-orange-300 border-l-4 border-transparent hover:border-orange-500 transition-all font-medium text-left"
                                        >
                                            {item.title}
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${openSubmenu === item.title ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openSubmenu === item.title && (
                                            <div className="bg-purple-900/50 border-y border-purple-800/50">
                                                {item.submenu.map((subItem, index) => (
                                                    subItem.title === 'separator' ? (
                                                        <div key={`sep-mobile-${index}`} className="my-1 border-t border-purple-800/50"></div>
                                                    ) : (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className="block px-10 py-3 text-sm text-purple-200 hover:text-white hover:bg-purple-800 transition-colors"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            • {subItem.title}
                                                        </Link>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-6 py-4 text-purple-100 hover:bg-purple-800 hover:text-orange-300 border-l-4 border-transparent hover:border-orange-500 transition-all font-medium"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
