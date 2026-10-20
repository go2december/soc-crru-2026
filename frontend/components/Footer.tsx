"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Link as LinkIcon,
  Send,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-300 font-sans pt-16 pb-8 border-t-4 border-[#C2410C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* ================= Column 1: Brand & Address ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 mb-2">
              {/* Logo without frame/border */}
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/images/soc-logo.png"
                  alt="Faculty of Social Sciences Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                {/* Single line text */}
                <span className="text-base sm:text-lg font-bold text-white leading-tight font-heading whitespace-nowrap">
                  Faculty of Social Sciences
                </span>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                  Chiang Rai Rajabhat University
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5 text-xs sm:text-sm font-body text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#C2410C] mt-1 shrink-0" strokeWidth={1.75} />
                <span className="leading-relaxed">
                  80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่ <br /> อำเภอเมือง จังหวัดเชียงราย 57100
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="size-4 text-[#C2410C] mt-1 shrink-0" strokeWidth={1.75} />
                <span className="flex flex-col">
                  <a
                    href="tel:053776000,1211"
                    className="hover:text-white transition-colors"
                  >
                    053-776-000 ต่อ 1211
                  </a>
                  <a
                    href="tel:053702870"
                    className="hover:text-white transition-colors"
                  >
                    053-702-870
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#C2410C] shrink-0" strokeWidth={1.75} />
                <a
                  href="mailto:social@crru.ac.th"
                  className="hover:text-white transition-colors"
                >
                  social@crru.ac.th
                </a>
              </div>
            </div>
          </div>

          {/* ================= Column 2: Programs ================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-l-4 border-[#C2410C] pl-3 font-heading flex items-center gap-2">
              <GraduationCap className="size-5 text-[#C2410C]" strokeWidth={2} />
              <span>หลักสูตร (Programs)</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-body">
              <li>
                <Link
                  href="/programs/social-dev"
                  className="text-slate-300 hover:text-amber-400 transition-colors block leading-snug"
                >
                  สาขาวิชานวัตกรรมการพัฒนาสังคม
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/gis"
                  className="text-slate-300 hover:text-amber-400 transition-colors block leading-snug"
                >
                  สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/social-psych"
                  className="text-slate-300 hover:text-amber-400 transition-colors block leading-snug"
                >
                  สาขาวิชาจิตวิทยาสังคม
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/social-sci"
                  className="text-slate-300 hover:text-amber-400 transition-colors block leading-snug"
                >
                  สาขาวิชาสังคมศาสตร์
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/home-eco"
                  className="text-slate-300 hover:text-amber-400 transition-colors block leading-snug"
                >
                  สาขาวิชาคหกรรมศาสตร์
                </Link>
              </li>
              {/* ระดับบัณฑิตศึกษา */}
              <li className="pt-1.5 border-t border-white/10 mt-1.5">
                <Link
                  href="/programs?level=graduate"
                  className="text-amber-400 hover:text-amber-300 transition-colors block leading-snug font-medium"
                >
                  ระดับบัณฑิตศึกษา
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Column 3: Quick Links ================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-l-4 border-[#C2410C] pl-3 font-heading flex items-center gap-2">
              <LinkIcon className="size-4 text-[#C2410C]" strokeWidth={2} />
              <span>ลิงก์ด่วน (Quick Links)</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-body">
              <li>
                <Link
                  href="/admissions"
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  รับสมัครนักศึกษาใหม่ (TCAS)
                </Link>
              </li>
              <li>
                <Link
                  href="/academics/credit-bank"
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  ระบบคลังหน่วยกิต (Credit Bank)
                </Link>
              </li>
              <li>
                <Link
                  href="/academics/short-courses"
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  คอร์สฝึกอบรมระยะสั้น
                </Link>
              </li>
              <li>
                <Link
                  href="/research/database"
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  ฐานข้อมูลงานวิจัย
                </Link>
              </li>
              <li>
                <Link
                  href="/eservice/procurement"
                  className="text-amber-400 hover:text-amber-300 transition-colors block font-medium"
                >
                  ประกาศจัดซื้อจัดจ้าง (ITA)
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Column 4: Connect ================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-l-4 border-[#C2410C] pl-3 font-heading">
              ติดตามเรา (Connect)
            </h3>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://www.facebook.com/socialcrru"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
                aria-label="Facebook คณะสังคมศาสตร์"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.crru.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-[#C2410C] text-white flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
                aria-label="มหาวิทยาลัยราชภัฏเชียงราย"
              >
                <Globe className="size-4" strokeWidth={2} />
                <span>CRRU</span>
              </a>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <p className="font-body text-xs text-slate-300 mb-2.5 font-medium">
                รับข่าวสารกิจกรรมและหลักสูตรใหม่ๆ
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 w-full text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#C2410C] transition-all font-body"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-semibold text-white shadow-xs transition-colors shrink-0 active:scale-95"
                >
                  <span>สมัคร</span>
                  <Send className="size-3" strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ================= Bottom Bar: Legal & Navigation ================= */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-body">
          <p>© 2026 Faculty of Social Sciences, Chiang Rai Rajabhat University. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              ข้อกำหนดการใช้งาน
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
