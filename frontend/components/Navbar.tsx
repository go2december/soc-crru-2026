"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
    // State เก็บว่า dropdown ไหนเปิดอยู่ (null = ปิดหมด)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle dropdown - ถ้าคลิกเมนูเดิมจะปิด, ถ้าคลิกเมนูใหม่จะเปิดอันใหม่
    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    // Helper: Component สำหรับ Link ปกติ
    const NavItem = ({ href, title }: { href: string, title: string }) => (
        <li>
            <Link
                href={href}
                className="block px-3 py-2 text-sm text-white/90 hover:text-scholar-accent hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setOpenDropdown(null)}
            >
                {title}
            </Link>
        </li>
    );

    // Helper: Component สำหรับหัวข้อกลุ่มใน Dropdown (ไม่คลิก)
    const MenuHeading = ({ title }: { title: string }) => (
        <li className="px-3 pt-3 pb-1 text-xs font-bold text-scholar-gold uppercase tracking-wider opacity-90 border-b border-white/10 mb-1">
            {title}
        </li>
    );

    // Component สำหรับ Dropdown Menu
    const DropdownMenu = ({
        name,
        title,
        children,
        highlight = false
    }: {
        name: string,
        title: string,
        children: React.ReactNode,
        highlight?: boolean
    }) => {
        const isOpen = openDropdown === name;

        return (
            <li className="relative h-full flex items-center">
                <button
                    onClick={() => toggleDropdown(name)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium h-9
                        ${highlight ? 'text-scholar-gold' : 'text-white'} 
                        ${isOpen ? 'bg-white/10 text-scholar-accent' : 'hover:bg-white/5 hover:text-scholar-accent'}
                    `}
                >
                    {title}
                    <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Submenu */}
                <ul className={`absolute left-0 top-full mt-2 min-w-[260px] z-50 transition-all duration-200 origin-top-left
                    ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                `}>
                    <div className="bg-scholar-deep rounded-lg shadow-2xl border border-white/10 border-t-2 border-t-scholar-accent p-2 overflow-hidden">
                        {children}
                    </div>
                </ul>
            </li>
        );
    };

    return (
        <div ref={navRef} className="navbar bg-scholar-deep text-white sticky top-0 z-50 shadow-xl font-sans h-16">

            {/* 1. Logo & Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    {/* Mobile Menu */}
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-scholar-deep rounded-box w-64 text-white border border-white/10">
                        <li><span className="text-scholar-gold font-bold">การจัดการศึกษา</span>
                            <ul>
                                <li><Link href="/academics/overview">ภาพรวมวิชาการ</Link></li>
                                <li><Link href="/academics/bachelor">ปริญญาตรี (5 สาขา)</Link></li>
                                <li><Link href="/academics/graduate">บัณฑิตศึกษา</Link></li>
                            </ul>
                        </li>
                        <li><Link href="/admissions">การรับสมัคร</Link></li>
                        <li><Link href="/research">วิจัยและนวัตกรรม</Link></li>
                        <li><Link href="/about">เกี่ยวกับคณะ</Link></li>
                        <li><Link href="/e-service" className="text-yellow-400">ระบบสารสนเทศ</Link></li>
                    </ul>
                </div>
                <Link href="/" className="btn btn-ghost text-xl font-bold tracking-wider flex items-center gap-3 hover:bg-transparent">
                    {/* Placeholder Logo Icon */}
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-scholar-accent to-scholar-gold flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        SC
                    </div>
                    <div className="flex flex-col items-start justify-center h-full">
                        <span className="text-lg font-bold leading-none tracking-wide">SOC CRRU</span>
                        <span className="text-[10px] font-light text-scholar-gold tracking-[0.2em] uppercase opacity-90">Social Innovator</span>
                    </div>
                </Link>
            </div>

            {/* 2. Desktop Menu (Click-based Dropdowns) */}
            <div className="navbar-center hidden lg:flex h-full">
                <ul className="flex items-center gap-1 h-full">

                    {/* B. การจัดการศึกษา (Academics) - Highlight Menu */}
                    <DropdownMenu name="academics" title="การจัดการศึกษา">
                        <NavItem href="/academics/overview" title="ภาพรวมวิชาการ (Overview)" />

                        {/* Social Sciences Group */}
                        <div className="relative group">
                            <NavItem href="/programs/social-sci" title="สาขาวิชาสังคมศาสตร์ (ภาพรวม)" />
                            <div className="pl-4 border-l border-white/10 ml-2 mt-1 mb-1 space-y-1">
                                <Link href="/programs/social-sci/sociology" className="block px-3 py-1.5 text-xs text-white/70 hover:text-scholar-accent hover:bg-white/5 rounded-md transition-colors">
                                    - แขนงวิชาสังคมวิทยาและมานุษยวิทยา
                                </Link>
                                <Link href="/programs/social-sci/crm" className="block px-3 py-1.5 text-xs text-white/70 hover:text-scholar-accent hover:bg-white/5 rounded-md transition-colors">
                                    - แขนงวิชาการจัดการทรัพยากรทางวัฒนธรรม
                                </Link>
                            </div>
                        </div>

                        <NavItem href="/programs/social-dev" title="สาขาวิชานวัตกรรมการพัฒนาสังคม" />

                        {/* Home Economics Group */}
                        <div className="relative group">
                            <NavItem href="/programs/home-eco" title="สาขาวิชาคหกรรมศาสตร์ (ภาพรวม)" />
                            <div className="pl-4 border-l border-white/10 ml-2 mt-1 mb-1 space-y-1">
                                <Link href="/programs/home-eco/culinary" className="block px-3 py-1.5 text-xs text-white/70 hover:text-scholar-accent hover:bg-white/5 rounded-md transition-colors">
                                    - วิชาเอกการประกอบอาหารและบริการ
                                </Link>
                                <Link href="/programs/home-eco/applied" className="block px-3 py-1.5 text-xs text-white/70 hover:text-scholar-accent hover:bg-white/5 rounded-md transition-colors">
                                    - วิชาเอกคหกรรมศาสตร์ประยุกต์
                                </Link>
                            </div>
                        </div>

                        <NavItem href="/programs/social-psych" title="สาขาวิชาจิตวิทยาสังคม" />
                        <NavItem href="/programs/gis" title="สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ" />

                        <MenuHeading title="ระดับบัณฑิตศึกษา (Graduate)" />
                        <NavItem href="/programs/regional-dev-ma" title="ปริญญาโท ยุทธศาสตร์การพัฒนาภูมิภาค" />
                        <NavItem href="/programs/regional-dev-phd" title="ปริญญาเอก ยุทธศาสตร์การพัฒนาภูมิภาค" />

                        <MenuHeading title="การเรียนรู้ตลอดชีวิต" />
                        <NavItem href="/academics/credit-bank" title="ระบบคลังหน่วยกิต (Credit Bank)" />
                        <NavItem href="/academics/short-courses" title="หลักสูตรระยะสั้น" />
                    </DropdownMenu>

                    {/* C. การรับสมัคร (Admissions) */}
                    <DropdownMenu name="admissions" title="การรับสมัคร">
                        <li className="mb-2 pb-2 border-b border-white/10">
                            <Link href="/admissions" className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-scholar-gold hover:text-white hover:bg-scholar-accent rounded-md transition-all" onClick={() => setOpenDropdown(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                ศูนย์รับสมัคร (Admission Center)
                            </Link>
                        </li>
                        <li className="block">
                            <a href="https://admission.crru.ac.th/" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-white/90 hover:text-scholar-accent hover:bg-white/10 rounded-md transition-colors" onClick={() => setOpenDropdown(null)}>
                                ระดับปริญญาตรี (TCAS)
                            </a>
                        </li>
                        <li className="block">
                            <a href="https://orasis.crru.ac.th/gds_crru/index.php/main/home" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-white/90 hover:text-scholar-accent hover:bg-white/10 rounded-md transition-colors" onClick={() => setOpenDropdown(null)}>
                                ระดับบัณฑิตศึกษา
                            </a>
                        </li>
                        <div className="divider my-1 border-white/10"></div>
                        <NavItem href="/admissions/short-course" title="สมัครเรียนหลักสูตรระยะสั้น" />
                    </DropdownMenu>

                    {/* D. วิจัยและนวัตกรรม */}
                    <DropdownMenu name="research" title="วิจัยและนวัตกรรม">
                        <NavItem href="/research/database" title="ฐานข้อมูลงานวิจัย" />
                        <NavItem href="/research/startups" title="นวัตกรรมชุมชน (Local Startups)" />
                        <NavItem href="/research/services" title="บริการวิชาการ" />
                    </DropdownMenu>

                    {/* E. เกี่ยวกับคณะ */}
                    <DropdownMenu name="about" title="เกี่ยวกับคณะ">
                        <NavItem href="/about/history" title="รู้จักเรา (History & Vision)" />
                        <NavItem href="/about/structure" title="โครงสร้างองค์กร" />
                        <NavItem href="/about/strategy" title="แผนยุทธศาสตร์" />
                        <NavItem href="/about/staff" title="ทำเนียบบุคลากร" />
                    </DropdownMenu>

                    {/* F. ระบบสารสนเทศ (E-Service) */}
                    <DropdownMenu name="eservice" title="ระบบสารสนเทศ" highlight>
                        <NavItem href="/eservice/student" title="สำหรับนักศึกษา" />
                        <NavItem href="/eservice/staff" title="สำหรับบุคลากร" />
                    </DropdownMenu>

                </ul>
            </div>

            {/* 3. CTA Buttons */}
            <div className="navbar-end gap-3 px-2">
                <button className="btn btn-ghost btn-circle text-white hover:bg-white/10 btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <Link href="/login" className="hidden sm:flex btn btn-sm bg-gradient-to-r from-scholar-accent to-[#D9341C] text-white border-none shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-full px-6 font-medium">
                    เข้าสู่ระบบ
                </Link>
            </div>
        </div>
    );
}