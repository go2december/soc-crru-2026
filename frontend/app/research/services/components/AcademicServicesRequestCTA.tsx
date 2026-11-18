'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  FileText,
  ArrowRight,
  Handshake,
  GraduationCap,
  FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AcademicServicesRequestCTA() {
  const shouldReduceMotion = useReducedMotion();

  const offerings = [
    {
      icon: GraduationCap,
      title: 'วิทยากร & ฝึกอบรมเชิงปฏิบัติการ',
      desc: 'ถ่ายทอดทักษะการพัฒนาชุมชน นวัตกรรมสังคม และการวิจัยเชิงพื้นที่',
    },
    {
      icon: Handshake,
      title: 'ที่ปรึกษางานวิจัย & แผนยุทธศาสตร์',
      desc: 'ให้คำปรึกษาแก่ อปท. หน่วยงานภาครัฐ เอกชน และวิสาหกิจชุมชน',
    },
    {
      icon: FlaskConical,
      title: 'ห้องปฏิบัติการทางสังคม (Social Lab)',
      desc: 'พื้นที่ทดลองทางนวัตกรรมสังคมและการประเมินผลลัพธ์คุ้มค่า (SROI)',
    },
  ];

  return (
    <section className="mt-16">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#0B132B] text-white rounded-sm border border-slate-800 p-8 sm:p-10 lg:p-12 overflow-hidden shadow-sm"
      >
        {/* Subtle geometric dot grid background */}
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
            COLLABORATIVE CIVIC ENGAGEMENT PORTAL
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
            ต้องการขอรับบริการวิชาการ <br className="hidden sm:inline" />
            หรือเชิญคณาจารย์เป็นวิทยากรผู้เชี่ยวชาญ?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ยินดีร่วมงานกับองค์กรปกครองส่วนท้องถิ่น (อปท.)
            โรงเรียน วิสาหกิจชุมชน และภาคประชาสังคม เพื่อสร้างผลกระทบเชิงบวกที่ยั่งยืน
          </p>
        </div>

        {/* 3 Offerings Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-sm bg-slate-900/60 border border-slate-800/90 text-left backdrop-blur-xs group hover:border-amber-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-sm bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Direct Action Link to Request Portal */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-[#9A3412] text-white font-medium text-sm rounded-sm px-8 py-3 h-auto shadow-sm transition-transform active:scale-[0.99] gap-2"
          >
            <Link href="/research/services/request">
              <FileText className="w-4 h-4" />
              <span>ยื่นคำขอรับบริการและดาวน์โหลดแบบฟอร์ม</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm rounded-sm px-6 py-3 h-auto"
          >
            <a
              href="https://social-lab.soc.crru.ac.th"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <span>เยี่ยมชม Social Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
