'use client';

import React from 'react';
import {
  CheckCircle2,
  UserCheck,
  Building2,
  Phone,
  Mail,
} from 'lucide-react';

export default function StaffHelpdeskSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Login Guidance */}
      <div className="bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#0B132B] text-white rounded-sm p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-white">
              การเข้าสู่ระบบปฏิบัติราชการ
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">
            ระบบสารบรรณ (e-Office), ระบบประเมินผล TOR (HRMIS) และระบบบริการอาจารย์ (REG)
            ใช้งานด้วยบัญชีผู้ใช้ระบบเครือข่าย หรือบัญชีอีเมลองค์กรของมหาวิทยาลัย (@crru.ac.th)
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 font-mono">
          ✓ Secure Institutional Access
        </div>
      </div>

      {/* 2. Central HR Division */}
      <div className="bg-white rounded-sm p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-primary">
            <UserCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-slate-900">
              กองบริหารงานบุคคล มรภ.เชียงราย
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
            ติดต่อสอบถามเรื่องสวัสดิการ กองทุนสำรองเลี้ยงชีพ ประกันสังคม
            การขอตำแหน่งทางวิชาการ (ผศ., รศ., ศ.) หรือสิทธิการลาศึกษาต่อ
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 text-xs text-slate-600 flex items-center gap-1.5 font-medium">
          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>โทร. 053-776000 ต่อ 1100, 1105</span>
        </div>
      </div>

      {/* 3. Faculty Administrative Office */}
      <div className="bg-white rounded-sm p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base font-heading text-slate-900">
              งานสารบรรณและบริหาร คณะสังคมศาสตร์
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
            ยื่นหนังสือราชการ ขออนุมัติโครงการ ขอไปราชการ จัดซื้อจัดจ้าง
            และติดต่อธุรการทั่วไป ณ สำนักงานคณบดี คณะสังคมศาสตร์
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <a href="tel:053702870,1211" className="hover:text-primary transition-colors">
              โทร. 053-702870 ต่อ 1211, 1214
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
