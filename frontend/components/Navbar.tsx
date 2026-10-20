"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Menu as MenuIcon,
  X as CloseIcon,
  ExternalLink,
  GraduationCap,
  Sparkles,
  LogIn,
  BookOpen,
  Building2,
  FileText,
} from "lucide-react";

// Submenu Item
function NavItem({
  href,
  title,
  onClose,
  isExternal = false,
}: {
  href: string;
  title: string;
  onClose?: () => void;
  isExternal?: boolean;
}) {
  if (isExternal) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors group"
          onClick={onClose}
        >
          <span>{title}</span>
          <ExternalLink className="size-3.5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.75} />
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        onClick={onClose}
      >
        {title}
      </Link>
    </li>
  );
}

// Submenu Group Heading
function MenuHeading({ title }: { title: string }) {
  return (
    <li className="px-3 pt-3 pb-1 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider opacity-90 border-b border-white/10 mb-1">
      {title}
    </li>
  );
}

// Dropdown Component with Motion animation
function DropdownMenu({
  name,
  title,
  children,
  isOpen,
  onToggle,
  highlight = false,
}: {
  name: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: (name: string) => void;
  highlight?: boolean;
}) {
  return (
    <li className="relative h-full flex items-center">
      <button
        type="button"
        onClick={() => onToggle(name)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
          highlight ? "text-[#F59E0B]" : "text-white/90"
        } ${
          isOpen
            ? "bg-white/15 text-white shadow-xs"
            : "hover:bg-white/10 hover:text-white"
        }`}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#C2410C]" : "text-slate-400"
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Motion Animated Submenu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-full mt-2 min-w-[290px] z-50 origin-top-left"
          >
            <div className="bg-[#0B132B] rounded-xl shadow-2xl border border-white/15 border-t-2 border-t-[#C2410C] p-2.5 backdrop-blur-xl">
              <ul className="space-y-0.5">{children}</ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => setOpenDropdown(null);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-[#0B132B]/95 text-white backdrop-blur-md border-b border-white/10 shadow-lg"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="size-6" strokeWidth={1.75} />
            ) : (
              <MenuIcon className="size-6" strokeWidth={1.75} />
            )}
          </button>

          <Link
            href="/"
            className="group flex items-center gap-3 py-1 outline-none"
            onClick={closeMobileMenu}
          >
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <img
                src="/images/soc-logo.png"
                alt="Faculty of Social Sciences Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold leading-tight tracking-wide text-white group-hover:text-[#F97316] transition-colors">
                สำนักวิชาสังคมศาสตร์
              </span>
              <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase opacity-90">
                Chiang Rai Rajabhat University
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center h-full">
          <ul className="flex items-center gap-1 h-full">
            {/* 1. เกี่ยวกับคณะ */}
            <DropdownMenu
              name="about"
              title="เกี่ยวกับคณะ"
              isOpen={openDropdown === "about"}
              onToggle={toggleDropdown}
            >
              <NavItem href="/about" title="ภาพรวมคณะ (Vision & History)" onClose={closeDropdown} />
              <NavItem href="/about/strategy" title="แผนยุทธศาสตร์ (Strategic Plan)" onClose={closeDropdown} />
              <NavItem href="/about/structure" title="โครงสร้างการบริหาร" onClose={closeDropdown} />
              <div className="my-1 border-t border-white/10" />
              <NavItem href="/about/executive" title="คณะผู้บริหาร (Executive Board)" onClose={closeDropdown} />
              <NavItem href="/about/staff" title="ทำเนียบบุคลากร (Staff)" onClose={closeDropdown} />
            </DropdownMenu>

            {/* 2. การจัดการศึกษา (Academics) */}
            <DropdownMenu
              name="academics"
              title="การจัดการศึกษา"
              isOpen={openDropdown === "academics"}
              onToggle={toggleDropdown}
            >
              <li className="mb-2 pb-2 border-b border-white/10">
                <Link
                  href="/programs"
                  className="flex items-center justify-between px-3 py-2 text-sm font-bold text-amber-400 hover:text-white hover:bg-[#C2410C] rounded-lg transition-colors"
                  onClick={closeDropdown}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="size-4" strokeWidth={1.75} />
                    หลักสูตรทั้งหมด (All Programs)
                  </span>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-normal">
                    7 สาขาวิชา
                  </span>
                </Link>
              </li>
              <MenuHeading title="ระดับปริญญาตรี (Undergraduate)" />
              <NavItem href="/programs/social-dev" title="สาขาวิชานวัตกรรมการพัฒนาสังคม" onClose={closeDropdown} />
              <NavItem href="/programs/gis" title="สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ" onClose={closeDropdown} />
              <NavItem href="/programs/social-psych" title="สาขาวิชาจิตวิทยาสังคม" onClose={closeDropdown} />
              <NavItem href="/programs/social-sci" title="สาขาวิชาสังคมศาสตร์" onClose={closeDropdown} />
              <NavItem href="/programs/home-eco" title="สาขาวิชาคหกรรมศาสตร์" onClose={closeDropdown} />

              <MenuHeading title="ระดับบัณฑิตศึกษา (Graduate)" />
              <NavItem href="/programs/regional-dev-ma" title="ปริญญาโท ยุทธศาสตร์การพัฒนาภูมิภาค" onClose={closeDropdown} />
              <NavItem href="/programs/regional-dev-phd" title="ปริญญาเอก ยุทธศาสตร์การพัฒนาภูมิภาค" onClose={closeDropdown} />

              <MenuHeading title="การเรียนรู้ตลอดชีวิต (Lifelong)" />
              <NavItem href="/academics/credit-bank" title="ระบบคลังหน่วยกิต (Credit Bank)" onClose={closeDropdown} />
              <NavItem href="/academics/short-courses" title="หลักสูตรระยะสั้น (Short Courses)" onClose={closeDropdown} />
            </DropdownMenu>

            {/* 3. รับสมัคร (Admissions) */}
            <DropdownMenu
              name="admissions"
              title="รับสมัคร"
              isOpen={openDropdown === "admissions"}
              onToggle={toggleDropdown}
            >
              <li className="mb-2 pb-2 border-b border-white/10">
                <Link
                  href="/admissions"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-amber-400 hover:text-white hover:bg-[#C2410C] rounded-lg transition-colors"
                  onClick={closeDropdown}
                >
                  <Sparkles className="size-4" strokeWidth={1.75} />
                  <span>ศูนย์รับสมัคร (Admission Center)</span>
                </Link>
              </li>
              <NavItem
                href="https://admission.crru.ac.th/"
                title="ระดับปริญญาตรี (มรภ.เชียงราย)"
                onClose={closeDropdown}
                isExternal
              />
              <NavItem
                href="https://orasis.crru.ac.th/gds_crru/index.php/main/home"
                title="ระดับบัณฑิตศึกษา (ป.โท-เอก)"
                onClose={closeDropdown}
                isExternal
              />
              <div className="my-1 border-t border-white/10" />
              <NavItem href="/academics/short-courses" title="สมัครเรียนหลักสูตรระยะสั้น" onClose={closeDropdown} />
            </DropdownMenu>

            {/* 4. วิจัยและบริการวิชาการ */}
            <DropdownMenu
              name="research"
              title="วิจัยและบริการวิชาการ"
              isOpen={openDropdown === "research"}
              onToggle={toggleDropdown}
            >
              <li className="mb-2 pb-2 border-b border-white/10">
                <Link
                  href="/research"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-amber-400 hover:text-white hover:bg-[#C2410C] rounded-lg transition-colors"
                  onClick={closeDropdown}
                >
                  <BookOpen className="size-4" strokeWidth={1.75} />
                  <span>ศูนย์รวมงานวิจัยและบริการวิชาการ</span>
                </Link>
              </li>
              <NavItem href="/research/database" title="ฐานข้อมูลงานวิจัย" onClose={closeDropdown} />
              <NavItem href="/research/journal" title="วารสารสังคมศาสตร์วิชาการ (ThaiJO)" onClose={closeDropdown} />
              <NavItem href="/research/services" title="บริการวิชาการแก่สังคม" onClose={closeDropdown} />
              <NavItem href="/research/mou" title="เครือข่ายความร่วมมือและ MOU" onClose={closeDropdown} />
            </DropdownMenu>

            {/* 5. ศูนย์เชียงรายศึกษา */}
            <li>
              <Link
                href="/chiang-rai-studies"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span>ศูนย์เชียงรายศึกษา</span>
              </Link>
            </li>

            {/* 6. ระบบสารสนเทศ (E-Service) */}
            <DropdownMenu
              name="eservice"
              title="ระบบสารสนเทศ"
              isOpen={openDropdown === "eservice"}
              onToggle={toggleDropdown}
              highlight
            >
              <NavItem href="/eservice/student" title="สำหรับนักศึกษา (Student)" onClose={closeDropdown} />
              <NavItem href="/eservice/staff" title="สำหรับบุคลากร (Staff)" onClose={closeDropdown} />
              <div className="my-1 border-t border-white/10" />
              <NavItem href="/eservice/procurement" title="จัดซื้อจัดจ้าง (Procurement)" onClose={closeDropdown} />
              <NavItem href="/eservice/calendar" title="ปฏิทินวิชาการ" onClose={closeDropdown} />
            </DropdownMenu>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            <LogIn className="size-4" strokeWidth={1.75} />
            <span>เข้าสู่ระบบ</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden border-t border-white/10 bg-[#0B132B] px-4 py-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">เกี่ยวกับคณะ</div>
                <div className="space-y-1 pl-2">
                  <Link href="/about" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200 hover:text-white">ภาพรวมคณะ</Link>
                  <Link href="/about/strategy" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200 hover:text-white">แผนยุทธศาสตร์</Link>
                  <Link href="/about/structure" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200 hover:text-white">โครงสร้างการบริหาร</Link>
                  <Link href="/about/staff" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200 hover:text-white">ทำเนียบบุคลากร</Link>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-[#F97316] uppercase tracking-wider mb-2">การจัดการศึกษา</div>
                <div className="space-y-1 pl-2">
                  <Link href="/programs" onClick={closeMobileMenu} className="block py-1.5 text-sm font-semibold text-white">หลักสูตรทั้งหมด (7 สาขา)</Link>
                  <Link href="/programs/social-dev" onClick={closeMobileMenu} className="block py-1 text-xs text-slate-300">สาขานวัตกรรมการพัฒนาสังคม</Link>
                  <Link href="/programs/gis" onClick={closeMobileMenu} className="block py-1 text-xs text-slate-300">สาขาภูมิศาสตร์และภูมิสารสนเทศ</Link>
                  <Link href="/programs/social-psych" onClick={closeMobileMenu} className="block py-1 text-xs text-slate-300">สาขาจิตวิทยาสังคม</Link>
                  <Link href="/academics/credit-bank" onClick={closeMobileMenu} className="block py-1 text-xs text-amber-400">ระบบคลังหน่วยกิต</Link>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">บริการและสารสนเทศ</div>
                <div className="space-y-1 pl-2">
                  <Link href="/admissions" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200">ศูนย์รับสมัครนักศึกษา</Link>
                  <Link href="/research" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200">ศูนย์รวมงานวิจัย</Link>
                  <Link href="/chiang-rai-studies" onClick={closeMobileMenu} className="block py-1.5 text-sm text-amber-300">ศูนย์เชียงรายศึกษา</Link>
                  <Link href="/eservice/student" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200">E-Service นักศึกษา</Link>
                  <Link href="/eservice/staff" onClick={closeMobileMenu} className="block py-1.5 text-sm text-slate-200">E-Service บุคลากร</Link>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/admin/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#C2410C] text-white font-medium text-sm"
                >
                  <LogIn className="size-4" strokeWidth={1.75} />
                  <span>เข้าสู่ระบบ (Staff Login)</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
