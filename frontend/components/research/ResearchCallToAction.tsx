'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Send, HandHeart, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResearchCallToAction() {
  const ctaCards = [
    {
      title: 'ส่งบทความวิชาการตีพิมพ์',
      description: 'ส่งบทความวิจัยและบทความวิชาการเพื่อพิจารณาตีพิมพ์ในวารสารสังคมศาสตร์วิชาการผ่านระบบ ThaiJO',
      icon: Send,
      actionText: 'เข้าสู่ระบบ ThaiJO',
      href: '/research/journal',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      btnStyle: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    {
      title: 'ขอรับบริการวิชาการเพื่อสังคม',
      description: 'หน่วยงานภาครัฐ เอกชน และกลุ่มวิสาหกิจชุมชนสามารถยื่นคำขอรับบริการวิชาการและการพัฒนาเชิงพื้นที่',
      icon: HandHeart,
      actionText: 'ยื่นขอรับบริการวิชาการ',
      href: '/research/services',
      color: 'bg-amber-50 text-amber-800 border-amber-200/80',
      btnStyle: 'bg-amber-700 hover:bg-amber-800 text-white',
    },
    {
      title: 'ร่วมเครือข่ายวิจัยและ MOU',
      description: 'ประสานงานจัดทำบันทึกข้อตกลงความร่วมมือทางวิชาการและการพัฒนาทรัพยากรมนุษย์ร่วมกับคณะ',
      icon: PhoneCall,
      actionText: 'ติดต่อฝ่ายวิจัยและบริการฯ',
      href: '/contact',
      color: 'bg-slate-50 text-slate-700 border-slate-200/80',
      btnStyle: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
  ];

  return (
    <section className="mt-16 sm:mt-20">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white border border-slate-700/80 shadow-lg">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-8"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-scholar-gold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research & Collaboration Portal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-white">
            ร่วมสร้างสรรค์ผลงานวิจัยและขับเคลื่อนสังคมไปกับเรา
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2 font-light leading-relaxed">
            ฝ่ายวิจัยและบริการวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ยินดีต้อนรับนักวิจัย คณาจารย์ 
            และองค์กรภาคีเครือข่ายทุกภาคส่วน
          </p>
        </motion.div>

        {/* 3 Action Pathways with Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctaCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="bg-white rounded-xl p-6 text-slate-800 flex flex-col justify-between shadow-xs border border-slate-100"
              >
                <div>
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 border ${card.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-light">
                    {card.description}
                  </p>
                </div>

                <Button
                  asChild
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${card.btnStyle}`}
                >
                  <Link href={card.href} className="inline-flex items-center justify-center gap-1.5">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
