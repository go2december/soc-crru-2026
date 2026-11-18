'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Mail,
  Phone,
  Building2,
  ArrowRight,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MouPartnershipCTA() {
  const shouldReduceMotion = useReducedMotion();

  const benefits = [
    {
      title: 'งานวิจัยร่วมเชิงพื้นที่ (Co-Research)',
      desc: 'ผสานโจทย์จริงจากชุมชนและท้องถิ่น ร่วมกับผู้เชี่ยวชาญทางสังคมศาสตร์',
    },
    {
      title: 'การแลกเปลี่ยนทางวิชาการและสหกิจศึกษา',
      desc: 'เปิดโอกาสให้นักศึกษาและบุคลากรเรียนรู้และฝึกปฏิบัติการในองค์กรจริง',
    },
    {
      title: 'การพัฒนาศักยภาพชุมชนท้องถิ่น (Civic Empowerment)',
      desc: 'ร่วมจัดอบรม ถ่ายทอดเทคโนโลยี และประเมินผลลัพธ์ทางสังคม (SROI)',
    },
  ];

  return (
    <section id="partnership-inquiry" className="mt-16 scroll-mt-24">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#0B132B] text-white rounded-sm border border-slate-800 p-8 sm:p-10 lg:p-12 overflow-hidden shadow-sm"
      >
        {/* Hairline dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center mb-10">
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2 font-mono">
            PARTNERSHIP & COLLABORATION INQUIRY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
            ร่วมสร้างสรรค์ความร่วมมือทางวิชาการ <br className="hidden sm:inline" />
            เพื่อการพัฒนาสังคมภาคเหนือตอนบน
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            องค์กรภาครัฐ องค์กรปกครองส่วนท้องถิ่น ภาคประชาสังคม หรือสถาบันการศึกษาทั้งในและต่างประเทศ
            ที่ประสงค์จัดทำบันทึกข้อตกลงความร่วมมือ (MOU/MOA) ร่วมกับคณะสังคมศาสตร์
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-sm bg-slate-900/60 border border-slate-800/90 text-left backdrop-blur-xs group hover:border-amber-500/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-sm bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 font-heading">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-300">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>สำนักงานคณบดี คณะสังคมศาสตร์ มรภ.เชียงราย</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:social@crru.ac.th" className="hover:text-amber-300 transition-colors">
                social@crru.ac.th
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="tel:053702870,1211" className="hover:text-amber-300 transition-colors">
                โทร. 053-702870 ต่อ 1211
              </a>
            </div>
          </div>

          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-[#9A3412] text-white font-medium text-xs rounded-sm px-6 py-2.5 h-auto shadow-sm gap-2 shrink-0"
          >
            <a href="mailto:social@crru.ac.th?subject=ข้อเสนอความร่วมมือทางวิชาการ (MOU) คณะสังคมศาสตร์">
              <Handshake className="w-4 h-4" />
              <span>ส่งข้อเสนอความร่วมมือ</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
