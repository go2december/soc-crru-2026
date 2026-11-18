"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Download,
  Copy,
  Check,
  FileCheck2,
  Clock,
  Sparkles,
  Scale,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Breadcrumb from "@/components/Breadcrumb";

const THAIJO_URL = "https://so04.tci-thaijo.org/index.php/social_crru";

// ==========================================
// Editorial Board Types (รองรับ CRUD ในอนาคต)
// ==========================================
export type EditorialRoleGroup =
  | "ADVISOR"
  | "EDITOR_IN_CHIEF"
  | "ASSOCIATE_EDITOR"
  | "JOURNAL_MANAGER"
  | "EDITORIAL_BOARD";

export interface EditorialMember {
  id?: number | string;
  name: string;
  roleTitle: string;
  roleGroup: EditorialRoleGroup;
  academicTitle?: string;
  position?: string;
  institution: string;
  expertise?: string;
  email?: string;
  displayOrder?: number;
}

// Journal Scope Items
const SCOPE_ITEMS = [
  {
    title: "สังคมวิทยาและมานุษยวิทยา",
    en: "Sociology & Anthropology",
    desc: "โครงสร้างทางสังคม ชาติพันธุ์ อัตลักษณ์วัฒนธรรม และการเปลี่ยนแปลงทางสังคมในอนุภูมิภาคลุ่มน้ำโขง",
  },
  {
    title: "การพัฒนาสังคมและชุมชน",
    en: "Social & Community Development",
    desc: "นวัตกรรมสังคมเพื่อการพัฒนาชุมชนท้องถิ่น การจัดการทุนทางสังคม และการมีส่วนร่วมของประชาชน",
  },
  {
    title: "จิตวิทยาสังคมและพฤติกรรมศาสตร์",
    en: "Social Psychology & Behavioral Sciences",
    desc: "สุขภาวะทางจิต พฤติกรรมองค์การ และพลวัตความสัมพันธ์ในกลุ่มคนหลากหลายช่วงวัย",
  },
  {
    title: "ภูมิศาสตร์และภูมิสารสนเทศ",
    en: "Geography & Geo-Informatics",
    desc: "การใช้เทคโนโลยีสารสนเทศภูมิศาสตร์ (GIS) ในการบริหารจัดการทรัพยากรธรรมชาติและสิ่งแวดล้อมชุมชน",
  },
  {
    title: "คหกรรมศาสตร์ประยุกต์และเศรษฐกิจสร้างสรรค์",
    en: "Applied Home Economics & Creative Economy",
    desc: "การยกระดับผลิตภัณฑ์ชุมชน อาหารท้องถิ่น หัตถกรรมสร้างสรรค์ และการจัดการธุรกิจครอบครัว",
  },
  {
    title: "ยุทธศาสตร์การพัฒนาภูมิภาคและท้องถิ่น",
    en: "Regional & Local Development Strategy",
    desc: "นโยบายสาธารณะ การบริหารจัดการท้องถิ่น และยุทธศาสตร์การค้า-การท่องเที่ยวชายแดนภาคเหนือ",
  },
  {
    title: "สหวิทยาการด้านสังคมศาสตร์และวัฒนธรรมศึกษา",
    en: "Interdisciplinary Social Sciences",
    desc: "งานวิจัยบูรณาการข้ามศาสตร์เพื่อตอบโจทย์ความท้าทายร่วมสมัยในบริบทล้านนาและสากล",
  },
];

// Peer Review Process
const PEER_REVIEW_STEPS = [
  {
    step: "01",
    title: "ส่งบทความผ่านระบบ ThaiJO",
    timeframe: "วันที่ 1",
    desc: "ผู้แต่งจัดทำต้นฉบับตาม Author Template และส่งเข้าสู่ระบบ Online Submission ของฐานข้อมูล ThaiJO พร้อมกรอกข้อมูลผู้แต่งครบถ้วน",
    highlight: "ตรวจฟอร์แมตก่อนส่ง",
  },
  {
    step: "02",
    title: "การกลั่นกรองเบื้องต้น (Initial Screening)",
    timeframe: "สัปดาห์ที่ 1 - 2",
    desc: "กองบรรณาธิการตรวจสอบความสอดคล้องกับขอบเขตวารสาร รูปแบบการอ้างอิง และตรวจความซ้ำซ้อนด้วยโปรแกรม CopyCatch / Turnitin (ไม่เกิน 15%)",
    highlight: "Similarity Index < 15%",
  },
  {
    step: "03",
    title: "ประเมินโดยผู้ทรงคุณวุฒิ (Double-Blind Peer Review)",
    timeframe: "สัปดาห์ที่ 3 - 8",
    desc: "ผู้ทรงคุณวุฒิตรงสาขาวิชาอย่างน้อย 3 ท่านพิจารณาคุณภาพทางวิชาการ โดยปกปิดชื่อผู้เขียนและผู้ประเมินทั้งสองฝ่ายเพื่อความยุติธรรมสูงสุด",
    highlight: "ผู้ทรงคุณวุฒิ 3 ท่าน",
  },
  {
    step: "04",
    title: "ปรับปรุงบทความและเผยแพร่ (Revision & Online First)",
    timeframe: "สัปดาห์ที่ 9 - 12",
    desc: "ผู้แต่งแก้ไขตามข้อเสนอแนะ กองบรรณาธิการตรวจรับฉบับสมบูรณ์ จัดรูปเล่ม มอบรหัสสากล DOI และเผยแพร่ออนไลน์ในระบบ ThaiJO ทันที",
    highlight: "มอบหมายเลข DOI ประจำบทความ",
  },
];

// Current Issue Information (Vol. 17 No. 2)
const CURRENT_ISSUE = {
  volume: "ปีที่ 17 ฉบับที่ 2 (กรกฎาคม - ธันวาคม 2569)",
  enVolume: "Vol. 17 No. 2 (July - December 2026)",
  issnPrint: "1906-2508",
  issnOnline: "2697-5831",
  frequency: "ปีละ 2 ฉบับ (ราย 6 เดือน)",
  tciStatus: "TCI กลุ่ม 2 (สาขาสังคมศาสตร์และมนุษยศาสตร์)",
  editorialNote:
    "วารสารสังคมศาสตร์วิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เผยแพร่ผลงานวิชาการและบทความวิจัยระดับชาติผ่านระบบฐานข้อมูลวารสารอิเล็กทรอนิกส์ไทย (ThaiJO) ผู้อ่านสามารถเข้าถึงบทความฉบับเต็มและดาวน์โหลดไฟล์เอกสาร PDF ประจำทุกบทความได้โดยตรงบนระบบ ThaiJO",
};

// ========================================================
// กองบรรณาธิการ (ข้อมูลทางการจริงจากระบบ ThaiJO - social_crru)
// ========================================================
const DEFAULT_EDITORIAL_MEMBERS: EditorialMember[] = [
  // 1. บรรณาธิการ (Editors)
  {
    id: 1,
    name: "ผู้ช่วยศาสตราจารย์ ดร.จามรี พระสุนิล",
    roleTitle: "บรรณาธิการ (Editor-in-Chief)",
    roleGroup: "EDITOR_IN_CHIEF",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    email: "journal.soc@crru.ac.th",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "ผู้ช่วยศาสตราจารย์ธนพัทธ์ จันท์พิพัฒน์พงศ์",
    roleTitle: "บรรณาธิการ",
    roleGroup: "ASSOCIATE_EDITOR",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    displayOrder: 2,
  },

  // 2. กองบรรณาธิการ (Editorial Board - 14 ท่านตามระบบ ThaiJO)
  {
    id: 3,
    name: "ศาสตราจารย์เกียรติคุณ ดร.มนัส สุวรรณ",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยราชภัฏเชียงใหม่",
    email: "manatsuwan@gmail.com",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "ศาสตราจารย์เกียรติคุณ ดร.อนุรักษ์ ปัญญานุวัฒน์",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยเชียงใหม่",
    email: "anurak.p@cmu.ac.th",
    displayOrder: 4,
  },
  {
    id: 5,
    name: "รองศาสตราจารย์ ดร.มนตรี พิริยะกุล",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยรามคำแหง",
    email: "mpiriyakul@yahoo.com",
    displayOrder: 5,
  },
  {
    id: 6,
    name: "รองศาสตราจารย์ ดร.บุญฑวรรณ วิงวอน",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "วิทยาลัยอินเตอร์เทคลําปาง",
    email: "boonthawan2009@gmail.com",
    displayOrder: 6,
  },
  {
    id: 7,
    name: "รองศาสตราจารย์ ดร.รังสรรค์ โฉมยา",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยมหาสารคาม",
    email: "rungson.c@msu.ac.th",
    displayOrder: 7,
  },
  {
    id: 8,
    name: "รองศาสตราจารย์ ดร.อัจศรา ประเสริฐสิน",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยนอร์ทกรุงเทพ",
    email: "ubib_p@hotmail.com",
    displayOrder: 8,
  },
  {
    id: 9,
    name: "รองศาสตราจารย์ ดร.ขวัญหญิง ศรีประเสริฐภาพ",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    email: "khwanying@g.swu.ac.th",
    displayOrder: 9,
  },
  {
    id: 10,
    name: "ผู้ช่วยศาสตราจารย์ ดร.สุดารัตน์ ตันติวิวัทน์",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    email: "juntuntivivat@gmail.com",
    displayOrder: 10,
  },
  {
    id: 11,
    name: "ผู้ช่วยศาสตราจารย์ ดร.พิมพาภรณ์ บุญประเสริฐ",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    email: "pimpaporn@g.swu.ac.th",
    displayOrder: 11,
  },
  {
    id: 12,
    name: "ผู้ช่วยศาสตราจารย์ ดร.วีระวัฒน์ อุ่นเสน่หา",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยราชภัฏวไลยอลงกรณ์",
    email: "weerawat@vru.ac.th",
    displayOrder: 12,
  },
  {
    id: 13,
    name: "ผู้ช่วยศาสตราจารย์ ดร.พิชิต ลำใย",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยเกษตรศาสตร์",
    email: "fforpcl@ku.ac.th",
    displayOrder: 13,
  },
  {
    id: 14,
    name: "ผู้ช่วยศาสตราจารย์ ดร.สุวิมล สายสวัสดิ์ พิชญไพบูลย์",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "มหาวิทยาลัยเทคโนโลยีราชมงคล",
    email: "Noonoi0509@gmail.com",
    displayOrder: 14,
  },
  {
    id: 15,
    name: "อาจารย์ ดร.กนกวรรณ เอี่ยมชัย",
    roleTitle: "กองบรรณาธิการ",
    roleGroup: "EDITORIAL_BOARD",
    institution: "วิทยาลัยพยาบาลบรมราชชนนี พะเยา",
    email: "K_aiemchai@hotmail.com",
    displayOrder: 15,
  },
  {
    id: 16,
    name: "นางศรีสมร พิริยะสุรวงศ์",
    roleTitle: "ผู้จัดการวารสาร / กองบรรณาธิการ",
    roleGroup: "JOURNAL_MANAGER",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    email: "srisamorn8184@gmail.com",
    displayOrder: 16,
  },

  // 3. ที่ปรึกษา (Advisors)
  {
    id: 17,
    name: "ผู้ช่วยศาสตราจารย์ ดร.เลหล้า ตรีเอกานุกูล",
    roleTitle: "ที่ปรึกษา",
    roleGroup: "ADVISOR",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    displayOrder: 17,
  },
  {
    id: 18,
    name: "ผู้ช่วยศาสตราจารย์ ดร.นาวิน พรมใจสา",
    roleTitle: "ที่ปรึกษา",
    roleGroup: "ADVISOR",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    displayOrder: 18,
  },
  {
    id: 19,
    name: "ผู้ช่วยศาสตราจารย์ภัทรีพันธุ์ พันธุ",
    roleTitle: "ที่ปรึกษา",
    roleGroup: "ADVISOR",
    institution: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    displayOrder: 19,
  },
];

interface JournalClientProps {
  customEditorialMembers?: EditorialMember[];
}

export default function JournalClient({ customEditorialMembers }: JournalClientProps) {
  const [activeTab, setActiveTab] = useState("current");
  const [citationCopied, setCitationCopied] = useState(false);
  const [fetchedMembers, setFetchedMembers] = useState<EditorialMember[] | null>(null);
  const isReducedMotion = useReducedMotion();

  // Dynamic fetch from API (supporting real-time CRUD sync)
  useEffect(() => {
    let ignore = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/api/journal/editorial-board`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setFetchedMembers(data);
        }
      })
      .catch(() => {
        // Fallback to verified default ThaiJO data
      });

    return () => {
      ignore = true;
    };
  }, []);

  const editorialMembers = customEditorialMembers || fetchedMembers || DEFAULT_EDITORIAL_MEMBERS;

  // Filter by role groups in exact ThaiJO order:
  // 1. บรรณาธิการ (Editors)
  const editors = editorialMembers.filter(
    (m) => m.roleGroup === "EDITOR_IN_CHIEF" || m.roleGroup === "ASSOCIATE_EDITOR"
  );
  // 2. กองบรรณาธิการ (Editorial Board - 14 members including journal manager)
  const boardMembers = editorialMembers.filter(
    (m) => m.roleGroup === "EDITORIAL_BOARD" || m.roleGroup === "JOURNAL_MANAGER"
  );
  // 3. ที่ปรึกษา (Advisors)
  const advisors = editorialMembers.filter((m) => m.roleGroup === "ADVISOR");

  const handleCopyCitation = () => {
    const citation = `วารสารสังคมศาสตร์วิชาการ มหาวิทยาลัยราชภัฏเชียงราย. (2569). Journal of Social Academic (Vol. 17, No. 2). https://so04.tci-thaijo.org/index.php/social_crru`;
    navigator.clipboard.writeText(citation);
    setCitationCopied(true);
    setTimeout(() => setCitationCopied(false), 2400);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-24 selection:bg-[#C2410C]/20 selection:text-[#C2410C]">
      {/* 1. HERO SECTION (EDITORIAL LANNA MODERNIST) */}
      <section className="relative bg-[#0B132B] text-white pt-24 pb-20 overflow-hidden border-b border-slate-800">
        {/* Architectural Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#C2410C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient Warm Corner Light */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-[#C2410C]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "หน้าหลัก", href: "/" },
              { label: "วิจัยและบริการวิชาการ", href: "/research" },
              { label: "วารสารสังคมศาสตร์วิชาการ" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-8">
            {/* Left Col: Main Journal Header */}
            <motion.div
              className="lg:col-span-8 space-y-6"
              initial={isReducedMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="saffron"
                  className="px-3 py-1 text-xs font-medium tracking-wide uppercase shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
                  TCI Tier 2 Indexed (ThaiJO)
                </Badge>
                <Badge
                  variant="slate"
                  className="bg-white/10 text-slate-200 border-white/15 px-3 py-1 text-xs"
                >
                  Double-Blind Peer Reviewed
                </Badge>
                <Badge
                  variant="slate"
                  className="bg-white/10 text-slate-200 border-white/15 px-3 py-1 text-xs"
                >
                  Open Access Journal
                </Badge>
              </div>

              {/* Title & Affiliation */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-heading">
                  วารสารสังคมศาสตร์วิชาการ
                </h1>
                <p className="text-slate-300 font-serif italic text-lg sm:text-xl mt-2 tracking-wide text-amber-200/90">
                  Journal of Social Academic, Chiang Rai Rajabhat University
                </p>
              </div>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-3xl">
                พื้นที่เผยแพร่ผลงานทางวิชาการและงานวิจัยคุณภาพระดับชาติด้านสังคมศาสตร์ มนุษยศาสตร์
                และการพัฒนาชุมชนท้องถิ่น ดำเนินงานมาตรฐานสากลผ่านระบบบริหารจัดการวารสารอิเล็กทรอนิกส์ไทย{" "}
                <span className="text-white font-medium underline underline-offset-4 decoration-[#C2410C]">
                  ThaiJO
                </span>{" "}
                ภายใต้การดูแลของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href={`${THAIJO_URL}/issue/current`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-sm shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:ring-offset-2 focus:ring-offset-[#0B132B]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>เข้าสู่วารสารฉบับล่าสุด (Current Issue)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={THAIJO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 backdrop-blur-xs transition-colors"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>ระบบส่งบทความ ThaiJO</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono border border-white/10 transition-colors"
                  title="คัดลอกรูปแบบการอ้างอิงวารสาร"
                >
                  {citationCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-sans">คัดลอกเรียบร้อย!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 opacity-75" />
                      <span className="font-sans">คัดลอกอ้างอิง (Cite)</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Right Col: Journal Factsheet / Key Metrics */}
            <motion.div
              className="lg:col-span-4"
              initial={isReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-200">
                      ข้อมูลประจำวารสาร
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Active Indexed
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 text-sm">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 text-xs">ISSN (Online / Print)</span>
                    <span className="font-mono font-semibold text-white text-xs">
                      2697-5831 / 1906-2508
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 text-xs">ฐานข้อมูลที่รับรอง</span>
                    <span className="font-medium text-[#C2410C] text-xs">
                      TCI กลุ่ม 2 / ThaiJO
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 text-xs">กำหนดออกเผยแพร่</span>
                    <span className="text-white text-xs font-medium">ปีละ 2 ฉบับ (ราย 6 เดือน)</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 text-xs">ผู้ประเมินบทความ</span>
                    <span className="text-white text-xs font-medium">
                      Double-blind (ผู้ทรงคุณวุฒิ 3 ท่าน)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 text-xs">ค่าธรรมเนียมการตีพิมพ์</span>
                    <span className="text-amber-300 font-bold text-xs">
                      5,000 บาท / บทความ
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <a
                    href="https://tci-thailand.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <span>ตรวจสอบสถานะบนศูนย์ดัชนี TCI</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE CONTENT AREA */}
      <main className="container mx-auto px-4 sm:px-6 max-w-7xl pt-10">
        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <TabsList className="bg-slate-100/90 p-1 rounded-xl h-auto flex flex-wrap gap-1 border border-slate-200">
              <TabsTrigger
                value="current"
                className="gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#0B132B] data-[state=active]:shadow-xs rounded-lg transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#C2410C]" />
                <span>ฉบับปัจจุบัน (Current Issue)</span>
              </TabsTrigger>

              <TabsTrigger
                value="scope"
                className="gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#0B132B] data-[state=active]:shadow-xs rounded-lg transition-all"
              >
                <Layers className="w-4 h-4 text-[#0B132B]" />
                <span>ขอบเขตวารสาร (Aims & Scope)</span>
              </TabsTrigger>

              <TabsTrigger
                value="submission"
                className="gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#0B132B] data-[state=active]:shadow-xs rounded-lg transition-all"
              >
                <FileCheck2 className="w-4 h-4 text-[#C2410C]" />
                <span>คำแนะนำผู้แต่ง & ขั้นตอน</span>
              </TabsTrigger>

              <TabsTrigger
                value="editorial"
                className="gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#0B132B] data-[state=active]:shadow-xs rounded-lg transition-all"
              >
                <Users className="w-4 h-4 text-[#0B132B]" />
                <span>กองบรรณาธิการ (Editorial Board)</span>
              </TabsTrigger>

              <TabsTrigger
                value="ethics"
                className="gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#0B132B] data-[state=active]:shadow-xs rounded-lg transition-all"
              >
                <Scale className="w-4 h-4 text-[#581C87]" />
                <span>จริยธรรมการตีพิมพ์ (Ethics)</span>
              </TabsTrigger>
            </TabsList>

            {/* Quick Template Download Link */}
            <div className="flex items-center gap-2">
              <a
                href={`${THAIJO_URL}/about/submissions`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด Template บทความ (.docx)</span>
              </a>
            </div>
          </div>

          {/* TAB 1: CURRENT ISSUE GATEWAY (ตรงไปยัง ThaiJO โดยไม่ต้องแสดง List บทความ) */}
          <TabsContent value="current" className="space-y-8 focus-visible:outline-none">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Cover Spine (Left) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#0B132B] via-slate-900 to-[#1e293b] p-8 sm:p-10 text-white relative flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-[#C2410C]/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                      <span className="tracking-wider uppercase">VOL. 17 NO. 2 (2026)</span>
                      <span className="px-2.5 py-0.5 rounded-sm bg-white/10 text-white border border-white/20 text-[11px]">
                        TCI TIER 2
                      </span>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        วารสารวิชาการ คณะสังคมศาสตร์
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1 leading-snug">
                        วารสารสังคมศาสตร์วิชาการ
                      </h2>
                      <p className="text-sm text-slate-300 font-serif italic mt-1">
                        Journal of Social Academic
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-700/70 text-xs text-slate-300 space-y-1.5 font-light">
                      <p className="flex justify-between">
                        <span>ISSN (Online):</span>
                        <span className="font-mono font-medium text-white">2697-5831</span>
                      </p>
                      <p className="flex justify-between">
                        <span>ISSN (Print):</span>
                        <span className="font-mono font-medium text-white">1906-2508</span>
                      </p>
                      <p className="flex justify-between">
                        <span>รอบการตีพิมพ์:</span>
                        <span className="text-amber-200 font-medium">ปีละ 2 ฉบับ (ราย 6 เดือน)</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 relative z-10">
                    <p className="text-[11px] text-slate-400">
                      มหาวิทยาลัยราชภัฏเชียงราย • Chiang Rai Rajabhat University
                    </p>
                  </div>
                </div>

                {/* Gateway Action Details (Right) */}
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>ฉบับล่าสุด (Current Published Issue)</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                      {CURRENT_ISSUE.volume}
                    </h3>
                    <p className="text-xs font-mono text-slate-500">
                      {CURRENT_ISSUE.enVolume}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed pt-2">
                      {CURRENT_ISSUE.editorialNote}
                    </p>

                    {/* Highlights Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-xs text-slate-500 font-medium">การเข้าถึงบทความ</span>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Open Access (ดาวน์โหลดฟรี)</span>
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-xs text-slate-500 font-medium">มาตรฐานสากล</span>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
                          <span>มีเลข DOI ประจำทุกบทความ</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Direct Gateway Links */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <a
                      href={`${THAIJO_URL}/issue/current`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm shadow-md transition-all group"
                    >
                      <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span>เปิดอ่านและดาวน์โหลดวารสารฉบับล่าสุด (Current Issue บน ThaiJO)</span>
                      <ExternalLink className="w-4 h-4 opacity-80" />
                    </a>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`${THAIJO_URL}/issue/archive`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>คลังวารสารย้อนหลังทั้งหมด (Archives)</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>

                      <a
                        href={`${THAIJO_URL}/about/submissions`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                      >
                        <Send className="w-4 h-4 text-[#C2410C]" />
                        <span>ส่งบทความออนไลน์ (Submission)</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: AIMS & SCOPE */}
          <TabsContent value="scope" className="space-y-8 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#C2410C]/10 text-[#C2410C]">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900">
                          นโยบายและวัตถุประสงค์ (Aims & Objectives)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          พันธกิจเพื่อสร้างองค์ความรู้ที่ตอบสนองต่อสังคมและท้องถิ่น
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                    <p>
                      <strong>วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic)</strong>{" "}
                      จัดทำโดย คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                      มีวัตถุประสงค์เพื่อเป็นสื่อกลางทางวิชาการในการเผยแพร่ผลงานวิจัย
                      บทความวิชาการ และองค์ความรู้ใหม่ทางสังคมศาสตร์ มนุษยศาสตร์
                      และศาสตร์ที่เกี่ยวข้อง เพื่อนำไปสู่การประยุกต์ใช้ในการแก้ไขปัญหา
                      เสริมสร้างความเข้มแข็งของชุมชนท้องถิ่น และสนับสนุนการพัฒนายั่งยืน
                    </p>
                    <p>
                      วารสารมีนโยบายส่งเสริมให้เกิดการแลกเปลี่ยนทางความคิดระหว่างคณาจารย์
                      นักวิจัย นักวิชาการ และผู้สนใจทั่วไปทั้งภายในและต่างประเทศ
                      โดยยึดมั่นในมาตรฐานจริยธรรมการวิจัยและกระบวนการประเมินคุณภาพที่โปร่งใส
                    </p>
                  </CardContent>
                </Card>

                {/* Scope Cards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#C2410C]" />
                    <span>ขอบเขตสาขาวิชาที่เปิดรับ (Scope of Publications)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SCOPE_ITEMS.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono font-bold text-[#C2410C]">
                            0{idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-serif italic">
                            {item.en}
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed pt-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Publication Types & Schedule */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="border-slate-200 shadow-2xs bg-slate-50/50">
                  <CardHeader className="pb-3 border-b border-slate-200">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C2410C]" />
                      <span>ประเภทบทความที่รับพิจารณา</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-800">
                        1. บทความวิจัย (Research Article)
                      </p>
                      <p className="text-slate-500">
                        รายงานผลการวิจัยที่มีระเบียบวิธีวิจัยชัดเจน ข้อค้นพบใหม่
                        และการอภิปรายผลที่มีคุณค่าต่อองค์ความรู้
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-800">
                        2. บทความวิชาการ (Academic Article)
                      </p>
                      <p className="text-slate-500">
                        การวิเคราะห์ สังเคราะห์แนวคิด ทฤษฎี หรือวรรณกรรมที่สะท้อนประเด็นร่วมสมัยทางสังคมศาสตร์
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-800">
                        3. บทวิจารณ์หนังสือ (Book Review)
                      </p>
                      <p className="text-slate-500">
                        บทวิจารณ์เชิงวิชาการสำหรับหนังสือทางสังคมศาสตร์ที่ตีพิมพ์ไม่เกิน 3 ปี
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="pb-3 border-b border-slate-200">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>กำหนดการออกเผยแพร่ (Schedule)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">ฉบับที่ 1 (ราย 6 เดือน)</span>
                        <p className="text-[11px] text-slate-500">มกราคม - มิถุนายน</p>
                      </div>
                      <Badge variant="subtle" className="text-[10px]">No. 1 (Jan - Jun)</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-bold text-slate-800">ฉบับที่ 2 (ราย 6 เดือน)</span>
                        <p className="text-[11px] text-slate-500">กรกฎาคม - ธันวาคม</p>
                      </div>
                      <Badge variant="subtle" className="text-[10px]">No. 2 (Jul - Dec)</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-2 italic border-t border-slate-100">
                      *เปิดรับต้นฉบับตลอดทั้งปี และนำเข้าสู่กระบวนการ Peer Review ทันที
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SUBMISSION & AUTHOR GUIDELINES */}
          <TabsContent value="submission" className="space-y-8 focus-visible:outline-none">
            {/* Peer Review Stepper */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
              <div className="max-w-3xl mb-8">
                <span className="text-xs uppercase tracking-wider font-bold text-[#C2410C]">
                  Workflow & Transparency
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  ขั้นตอนการประเมินบทความ (Peer Review Process)
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  มาตรฐานการกลั่นกรองคุณภาพบทความโดยผู้ทรงคุณวุฒิอย่างน้อย 3 ท่านต่อบทความ (Double-blind)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PEER_REVIEW_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0B132B] text-amber-200">
                          STEP {step.step}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {step.timeframe}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-medium text-[#C2410C] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Guidelines & Downloads Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Guidelines Left */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-[#C2410C]" />
                      <span>ข้อกำหนดการจัดเตรียมต้นฉบับ (Author Formatting Requirements)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4 text-xs sm:text-sm text-slate-700">
                    <div className="space-y-3">
                      {/* Publication Fee Notice */}
                      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-[#C2410C] mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-amber-950">ค่าธรรมเนียมการตีพิมพ์บทความ:</strong>{" "}
                          <span className="font-bold text-[#C2410C]">5,000 บาท ต่อบทความ</span>{" "}
                          <p className="text-xs text-amber-900 mt-0.5">
                            (ชำระหลังจากบทความผ่านการกลั่นกรองเบื้องต้นจากกองบรรณาธิการ เพื่อดำเนินการส่งผู้ทรงคุณวุฒิประเมินคุณภาพ Double-blind ต่อไป)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] mt-2 shrink-0" />
                        <div>
                          <strong>ความยาวบทความ:</strong> รวมเนื้อหา รูปภาพ ตาราง
                          และรายการอ้างอิง ความยาวระหว่าง <strong>10 - 15 หน้ากระดาษ A4</strong>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] mt-2 shrink-0" />
                        <div>
                          <strong>แบบอักษรและการจัดหน้า:</strong> ใช้แบบอักษร TH Sarabun PSK หรือ Cordia New
                          ขนาด 16 pt ระยะบรรทัดเดี่ยว (Single space) กั้นหน้า-หลัง 1 นิ้ว (2.54 ซม.)
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] mt-2 shrink-0" />
                        <div>
                          <strong>บทคัดย่อ (Abstract):</strong> ต้องมีทั้งภาษาไทยและภาษาอังกฤษ
                          ความยาวไม่เกิน 250 - 300 คำ พร้อมระบุคำสำคัญ (Keywords) 3 - 5 คำ
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] mt-2 shrink-0" />
                        <div>
                          <strong>การอ้างอิงเอกสาร:</strong> กำหนดให้ใช้ระบบการอ้างอิงตามรูปแบบ{" "}
                          <strong>APA Style 7th Edition</strong> อย่างเคร่งครัด
                          และต้องมีการอ้างอิงในเนื้อหา (In-text Citation) ตรงกับบรรณานุกรมท้ายบทความ
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Downloads Right */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#C2410C]" />
                      <span>ดาวน์โหลดแบบฟอร์ม (Templates)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2.5">
                    <a
                      href={`${THAIJO_URL}/about/submissions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Template บทความวิจัย (.docx)</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={`${THAIJO_URL}/about/submissions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Template บทความวิชาการ (.docx)</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={`${THAIJO_URL}/about/submissions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck2 className="w-4 h-4 text-amber-600" />
                        <span>แบบฟอร์มขอรับการตีพิมพ์ (.pdf)</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </CardContent>
                </Card>

                {/* Direct CTA */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#0B132B] to-slate-900 text-white space-y-3">
                  <h4 className="font-bold text-sm text-white">พร้อมส่งบทความแล้วหรือยัง?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ส่งผ่านระบบ Online Submission ของ ThaiJO เพื่อรับรหัสติดตามสถานะบทความ
                  </p>
                  <a
                    href={THAIJO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-xs transition-colors"
                  >
                    <span>ไปยังระบบส่งบทความ ThaiJO</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: EDITORIAL BOARD (ข้อมูลสดจากระบบ ThaiJO ครบทั้ง 19 ท่าน พร้อมระบบ CRUD) */}
          <TabsContent value="editorial" className="space-y-8 focus-visible:outline-none">
            {/* 1. บรรณาธิการ (Editors) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <GraduationCap className="w-5 h-5 text-[#C2410C]" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    บรรณาธิการ (Editors)
                  </h3>
                  <p className="text-xs text-slate-500">
                    คณะผู้รับผิดชอบหลักในการบริหารจัดการและกลั่นกรองบทความวารสาร
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editors.map((ed, idx) => (
                  <div
                    key={ed.id || idx}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0B132B] text-amber-200 flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#C2410C] uppercase tracking-wide">
                        {ed.roleTitle}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {ed.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {ed.position || ed.institution}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {ed.institution}
                      </p>
                      {ed.email && (
                        <div className="pt-1 text-[11px] font-mono text-slate-500">
                          <a
                            href={`mailto:${ed.email}`}
                            className="hover:text-[#C2410C] hover:underline inline-flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 opacity-60 shrink-0" />
                            <span>{ed.email}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. กองบรรณาธิการ (Editorial Board - 14 ท่านจาก ThaiJO) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#581C87]" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      กองบรรณาธิการ (Editorial Board)
                    </h3>
                    <p className="text-xs text-slate-500">
                      ผู้ทรงคุณวุฒิระดับศาสตราจารย์ รองศาสตราจารย์ และผู้ช่วยศาสตราจารย์จากสถาบันอุดมศึกษาทั่วประเทศ
                    </p>
                  </div>
                </div>
                <Badge variant="subtle" className="text-xs">
                  14 ท่าน
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boardMembers.map((board, idx) => (
                  <div
                    key={board.id || idx}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#581C87] px-2 py-0.5 rounded bg-[#581C87]/10">
                          ลำดับ 0{idx + 3}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {board.roleTitle}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug pt-1">
                        {board.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {board.institution}
                      </p>
                    </div>

                    {board.email && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                        <a
                          href={`mailto:${board.email}`}
                          className="hover:text-[#C2410C] hover:underline inline-flex items-center gap-1.5 w-full truncate"
                        >
                          <Mail className="w-3 h-3 opacity-60 shrink-0 text-slate-400" />
                          <span className="truncate">{board.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. ที่ปรึกษา (Advisors) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Advisory Board
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  ที่ปรึกษาวารสาร
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {advisors.map((adv, idx) => (
                  <div
                    key={adv.id || idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5"
                  >
                    <span className="text-[11px] font-semibold text-[#C2410C] uppercase tracking-wide">
                      {adv.roleTitle}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {adv.name}
                    </h4>
                    {adv.position && (
                      <p className="text-xs text-slate-600">{adv.position}</p>
                    )}
                    <p className="text-[11px] text-slate-400 font-medium">
                      {adv.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: PUBLICATION ETHICS & POLICIES */}
          <TabsContent value="ethics" className="space-y-8 focus-visible:outline-none">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-8">
              <div className="max-w-3xl">
                <span className="text-xs uppercase tracking-wider font-bold text-[#581C87]">
                  Integrity & Standards
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  จริยธรรมการตีพิมพ์และการตรวจสอบวรรณกรรม (Publication Ethics)
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  แนวปฏิบัติตามมาตรฐานสากลของคณะกรรมการจริยธรรมการตีพิมพ์ (Committee on Publication Ethics - COPE)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Author Duties */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                    <span>หน้าที่ของผู้เขียน (Authors)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li>• ต้องเป็นผลงานที่สร้างสรรค์ขึ้นใหม่ ไม่เคยตีพิมพ์ที่ใดมาก่อน</li>
                    <li>• ห้ามส่งบทความซ้ำซ้อนในเวลาเดียวกัน (No Duplicate Submission)</li>
                    <li>• อ้างอิงแหล่งที่มาของข้อมูล รูปภาพ และผลงานของผู้อื่นอย่างถูกต้องครบถ้วน</li>
                    <li>• กรณีวิจัยในมนุษย์ ต้องระบุการรับรองจริยธรรมการวิจัย (IRB/REC)</li>
                  </ul>
                </div>

                {/* Reviewer Duties */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Scale className="w-4 h-4 text-[#581C87]" />
                    <span>หน้าที่ของผู้ประเมิน (Reviewers)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li>• ประเมินผลงานด้วยความเป็นกลาง ปราศจากอคติ และยึดเกณฑ์วิชาการ</li>
                    <li>• รักษาความลับของบทความ ไม่เปิดเผยเนื้อหาก่อนการเผยแพร่อย่างเป็นทางการ</li>
                    <li>• แจ้งบรรณาธิการทันทีหากพบการขัดกันของผลประโยชน์ (Conflict of Interest)</li>
                    <li>• ส่งผลการประเมินตามกรอบระยะเวลาที่กำหนด</li>
                  </ul>
                </div>

                {/* Editor Duties */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>หน้าที่ของบรรณาธิการ (Editors)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li>• พิจารณารับหรือปฏิเสธบทความโดยคำนึงถึงคุณภาพและความสำคัญทางวิชาการ</li>
                    <li>• ปกป้องความลับของผู้เขียนและผู้ประเมินตลอดกระบวนการ Double-blind</li>
                    <li>• ตรวจสอบและระงับบทความที่มีการคัดลอกวรรณกรรม (Plagiarism)</li>
                    <li>• พัฒนาคุณภาพและมาตรฐานของวารสารให้สอดคล้องกับเกณฑ์ TCI อย่างต่อเนื่อง</li>
                  </ul>
                </div>
              </div>

              {/* Plagiarism Notice Alert */}
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>นโยบายการตรวจสอบการคัดลอกวรรณกรรม (Plagiarism Policy):</span>
                </p>
                <p className="leading-relaxed">
                  วารสารใช้โปรแกรม CopyCatch และ Turnitin ในการตรวจสอบระดับความซ้ำซ้อน
                  โดยกำหนดเกณฑ์ความซ้ำซ้อนของบทความต้อง <strong>ไม่เกินร้อยละ 15</strong> หากตรวจพบการคัดลอกผลงานของผู้อื่นโดยมิชอบ
                  กองบรรณาธิการขอสงวนสิทธิ์ในการยุติกระบวนการพิจารณาบทความทันที
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 3. EDITORIAL OFFICE CONTACT CARD */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Inquiries & Coordination
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                ติดต่อกองบรรณาธิการวารสารสังคมศาสตร์วิชาการ
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ฝ่ายวิจัยและบริการวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                เลขที่ 80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่ อำเภอเมือง จังหวัดเชียงราย 57100
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C2410C]" />
                  053-776-000 ต่อ 1211
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C2410C]" />
                  journal.soc@crru.ac.th
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5">
              <a
                href={THAIJO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0B132B] hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                <span>เข้าสู่เว็บไซต์ ThaiJO หลัก</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C2410C]" />
              </a>

              <Link
                href="/research/services"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                <span>บริการวิชาการ คณะสังคมศาสตร์</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
