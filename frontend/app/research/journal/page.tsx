import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {
  BookOpen,
  ExternalLink,
  FileText,
  Award,
  CheckCircle2,
  Users,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic) | คณะสังคมศาสตร์ มรภ.เชียงราย',
  description:
    'วารสารสังคมศาสตร์วิชาการ มหาวิทยาลัยราชภัฏเชียงราย เผยแพร่ผลงานวิชาการและบทความวิจัยระดับชาติ ผ่านระบบฐานข้อมูลวารสารอิเล็กทรอนิกส์ไทย (ThaiJO) ได้รับการรับรองดัชนี TCI',
  alternates: {
    canonical: '/research/journal',
  },
  openGraph: {
    title: 'วารสารสังคมศาสตร์วิชาการ (Journal of Social Academic) | มรภ.เชียงราย',
    description:
      'วารสารวิชาการคณะสังคมศาสตร์ เผยแพร่ผ่านระบบ ThaiJO ได้รับการรับรองดัชนี TCI',
    url: '/research/journal',
    type: 'website',
    locale: 'th_TH',
  },
};

const THAIJO_URL = 'https://so04.tci-thaijo.org/index.php/social_crru';

const SCOPE_ITEMS = [
  'สังคมวิทยาและมานุษยวิทยา (Sociology & Anthropology)',
  'การพัฒนาสังคมและชุมชน (Social & Community Development)',
  'จิตวิทยาสังคมและพฤติกรรมศาสตร์ (Social Psychology)',
  'ภูมิศาสตร์และภูมิสารสนเทศ (Geography & Geo-Informatics)',
  'คหกรรมศาสตร์ประยุกต์และเศรษฐกิจสร้างสรรค์ (Applied Home Economics)',
  'ยุทธศาสตร์การพัฒนาภูมิภาคและท้องถิ่น (Regional Development)',
  'สหวิทยาการด้านสังคมศาสตร์และวัฒนธรรมศึกษา (Interdisciplinary Social Sciences)',
];

const PEER_REVIEW_STEPS = [
  {
    step: '01',
    title: 'ส่งบทความผ่าน ThaiJO',
    desc: 'ผู้แต่งจัดทำต้นฉบับตาม Template ของวารสารและ Submit เข้าสู่ระบบ Online Submission',
  },
  {
    step: '02',
    title: 'ตรวจประเมินเบื้องต้น',
    desc: 'กองบรรณาธิการตรวจสอบความถูกต้องของรูปแบบ ขอบเขตเนื้อหา และตรวจสอบการคัดลอกวรรณกรรม (Plagiarism)',
  },
  {
    step: '03',
    title: 'ประเมินโดยผู้ทรงคุณวุฒิ',
    desc: 'พิจารณาโดยผู้ทรงคุณวุฒิตรงสาขา 3 ท่าน ในรูปแบบ Double-Blind Peer Review (ปกปิดชื่อผู้แต่งและผู้ประเมิน)',
  },
  {
    step: '04',
    title: 'ปรับปรุงและเผยแพร่',
    desc: 'ผู้แต่งแก้ไขตามข้อเสนอแนะ และออกเผยแพร่ในระบบ e-Journal พร้อมเลข DOI ประจำบทความ',
  },
];

export default function JournalPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-800 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-scholar-deep to-slate-900 text-white pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f14627_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'หน้าหลัก', href: '/' },
              { label: 'วิจัยและบริการวิชาการ', href: '/research' },
              { label: 'วารสารสังคมศาสตร์วิชาการ' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-8">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse" />
                Journal of Social Academic (ThaiJO)
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight text-white mb-4">
                วารสารสังคมศาสตร์วิชาการ
              </h1>
              <p className="text-scholar-gold font-serif italic text-lg md:text-xl mb-4">
                Journal of Social Academic, Chiang Rai Rajabhat University
              </p>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light max-w-3xl mb-8">
                พื้นที่เผยแพร่ผลงานทางวิชาการและงานวิจัยคุณภาพสูงด้านสังคมศาสตร์ มนุษยศาสตร์
                และการพัฒนาชุมชนท้องถิ่น ดำเนินงานภายใต้มาตรฐานวารสารอิเล็กทรอนิกส์สากล
                บริหารจัดการกระบวนการประเมินและการตีพิมพ์ผ่านระบบ <strong>ThaiJO</strong>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={THAIJO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-scholar-accent hover:bg-red-700 text-white font-semibold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" /> เข้าสู่ระบบส่งบทความ (Submit on ThaiJO)
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`${THAIJO_URL}/issue/current`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 backdrop-blur-sm transition-all"
                >
                  <BookOpen className="w-4 h-4 text-scholar-gold" /> อ่านฉบับปัจจุบัน (Current Issue)
                </a>
              </div>
            </div>

            {/* Quick Journal Badges */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-scholar-gold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> ข้อมูลประจำวารสาร (Journal Metrics)
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">ISSN (Print):</span>
                  <span className="font-mono font-semibold text-white">1906-2508</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">ISSN (Online):</span>
                  <span className="font-mono font-semibold text-white">2697-5831</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">ดัชนีฐานข้อมูล:</span>
                  <span className="font-semibold text-scholar-gold">TCI / ThaiJO</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">ความถี่การตีพิมพ์:</span>
                  <span className="text-white">ปีละ 3 ฉบับ (ราย 4 เดือน)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-300">รูปแบบการประเมิน:</span>
                  <span className="text-emerald-400 font-medium">Double-blind (3 ท่าน)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <main className="container mx-auto px-4 max-w-7xl pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Scope & Review Process */}
          <div className="lg:col-span-8 space-y-10">
            {/* Aims and Scope */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-lg bg-scholar-accent/10 text-scholar-accent">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-scholar-deep">
                    นโยบายและขอบเขตการตีพิมพ์ (Aims & Scope)
                  </h2>
                  <p className="text-sm text-slate-500">
                    รับพิจารณาบทความวิจัย (Research Article) และบทความวิชาการ (Academic Article)
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">
                วารสารสังคมศาสตร์วิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                มีเป้าหมายเพื่อเป็นสื่อกลางในการเผยแพร่ผลงานวิชาการ องค์ความรู้ใหม่
                และนวัตกรรมทางสังคมที่มีผลต่อการขับเคลื่อนและยกระดับชุมชนท้องถิ่น โดยครอบคลุมสาขาวิชาดังนี้:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCOPE_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-scholar-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer Review Process */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-scholar-deep">
                    กระบวนการประเมินบทความ (Peer Review Process)
                  </h2>
                  <p className="text-sm text-slate-500">
                    มาตรฐานการกลั่นกรองคุณภาพบทความทางวิชาการ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PEER_REVIEW_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-scholar-deep text-scholar-gold inline-block mb-3">
                      STEP {step.step}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base mb-1.5">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <strong>หมายเหตุ:</strong> บทความที่ได้รับการตีพิมพ์ต้องไม่เคยเผยแพร่ในวารสารใดมาก่อน
                และไม่อยู่ระหว่างการพิจารณาของวารสารอื่น (Double Submission) ผู้ทรงคุณวุฒิประเมินอย่างน้อย 3 ท่านต่อบทความ
              </div>
            </div>
          </div>

          {/* Right Column: Author Tools & ThaiJO Linkage */}
          <div className="lg:col-span-4 space-y-6">
            {/* ThaiJO Portal Card */}
            <div className="bg-gradient-to-br from-scholar-deep to-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-scholar-accent/20 flex items-center justify-center text-scholar-gold mb-4 border border-scholar-gold/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">ระบบวารสาร ThaiJO</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                เข้าสู่ระบบจัดการวารสารออนไลน์เพื่อติดตามสถานะบทความ ส่งบทความฉบับแก้ไข
                หรือค้นหาบทความวิชาการย้อนหลัง
              </p>
              <div className="space-y-2.5">
                <a
                  href={THAIJO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-scholar-accent hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                >
                  <span>เข้าสู่เว็บไซต์วารสาร ThaiJO</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={`${THAIJO_URL}/about/submissions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-sm transition-colors border border-white/10"
                >
                  <span>คำแนะนำสำหรับผู้แต่ง (Author Guide)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
                <a
                  href={`${THAIJO_URL}/issue/archive`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-sm transition-colors border border-white/10"
                >
                  <span>คลังบทความย้อนหลัง (Archives)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Author Downloads & Contact */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-base border-b pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-scholar-accent" /> ข้อมูลสำหรับผู้แต่ง
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-scholar-accent mt-2 shrink-0" />
                  <span>การจัดเตรียมต้นฉบับต้องพิมพ์ตามรูปแบบ Template ของวารสารอย่างเคร่งครัด</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-scholar-accent mt-2 shrink-0" />
                  <span>บทคัดย่อต้องมีทั้งภาษาไทยและภาษาอังกฤษ พร้อมคำสำคัญ (Keywords) 3-5 คำ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-scholar-accent mt-2 shrink-0" />
                  <span>การอ้างอิงเอกสารตามรูปแบบ APA Style (American Psychological Association)</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <p className="font-semibold text-slate-700 mb-1">ติดต่อกองบรรณาธิการ:</p>
                <p>คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</p>
                <p className="mt-1">โทร: 053-776-000 ต่อ 1211</p>
                <p>อีเมล: social@crru.ac.th</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
