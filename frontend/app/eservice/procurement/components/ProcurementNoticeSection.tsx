'use client';

import React from 'react';
import {
  ShieldCheck,
  Scale,
  Building2,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function ProcurementNoticeSection() {
  return (
    <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. e-GP Guidance */}
      <div className="bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#0B132B] text-white rounded-sm p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <Scale className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-white">
              ระบบจัดซื้อจัดจ้างภาครัฐ (e-GP)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">
            ข้อมูลการจัดซื้อจัดจ้างของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
            ดำเนินการสอดคล้องกับระเบียบกรมบัญชีกลางและประกาศในระบบ e-GP ของกระทรวงการคลัง
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <a
            href="http://www.gprocurement.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-amber-300 hover:underline inline-flex items-center gap-1 font-mono"
          >
            <span>www.gprocurement.go.th</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Transparency & ITA */}
      <div className="bg-white rounded-sm p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-slate-900">
              ความโปร่งใสและตรวจสอบได้ (ITA)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
            การเผยแพร่ข้อมูลเปิดเผยภาครัฐตามตัวชี้วัดการประเมินคุณธรรมและความโปร่งใส (OIT)
            ในการดำเนินงานของหน่วยงานภาครัฐ เพื่อให้ประชาชนและผู้สนใจตรวจสอบได้
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 text-[11px] text-slate-500 font-mono">
          ✓ Open Government Data Compliant
        </div>
      </div>

      {/* 3. Procurement Office Contact */}
      <div className="bg-white rounded-sm p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-slate-900">
              งานพัสดุและจัดซื้อจัดจ้าง คณะ
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
            สอบถามรายละเอียดข้อกำหนด TOR ขอรับเอกสารประกวดราคา หรือยื่นข้อเสนอโครงการ
            ณ สำนักงานคณบดี คณะสังคมศาสตร์
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <a href="tel:053702870,1211" className="hover:text-primary transition-colors">
              โทร. 053-702870 ต่อ 1211
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <a href="mailto:social@crru.ac.th" className="hover:text-primary transition-colors">
              social@crru.ac.th
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
