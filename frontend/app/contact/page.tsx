'use client';

import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Mail, Phone, Clock, ExternalLink, Facebook, Globe, Building, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-24">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <Breadcrumb items={[{ label: 'ติดต่อเรา' }]} />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-8">
        
        {/* 2. PAGE HEADER */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-scholar-accent mb-2 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-scholar-deep tracking-tight mb-4">
            ติดต่อเรา
          </h1>
          <p className="text-slate-500 max-w-2xl text-base md:text-lg font-light leading-relaxed">
            สำนักงานคณบดี คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย <br />
            ยินดีให้บริการข้อมูล ติดต่อประสานงาน และเข้าเยี่ยมชมหน่วยงานของเรา
          </p>
          <div className="w-12 h-1 bg-scholar-accent mt-6"></div>
        </div>

        {/* 3. MAIN CONTENT GRID - PREMIUM FLAT STYLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Contact Details (Premium Flat Card style) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] transition-all duration-300 flex-grow">
              <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-scholar-accent/10 text-scholar-accent flex items-center justify-center">
                  <Building size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-scholar-deep">ที่ตั้งสำนักงาน</h3>
                  <span className="text-xs text-slate-400 font-medium">Dean&apos;s Office Address</span>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p className="text-lg font-bold text-scholar-deep">
                  คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                </p>
                <p className="text-sm">
                  อาคารเรียนรวมคณะสังคมศาสตร์ (อาคาร 4) ชั้น 1
                </p>
                <p className="text-sm text-slate-500">
                  80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่ <br />
                  อำเภอเมือง จังหวัดเชียงราย 57100
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="https://maps.app.goo.gl/dP5ZgoSctvLc8KdG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-scholar-deep text-white font-bold text-sm hover:bg-scholar-accent transition-all duration-300 shadow-sm"
                >
                  เปิด Google Maps <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {/* Quick Contacts List */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] transition-all duration-300">
              <h3 className="text-lg font-bold text-scholar-deep mb-6 uppercase tracking-tight">
                ช่องทางติดต่อประสานงาน
              </h3>

              <div className="space-y-4">
                {/* Telephone */}
                <a
                  href="tel:053776000"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-50 hover:border-slate-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telephone</span>
                      <span className="text-sm font-bold text-scholar-deep group-hover:text-scholar-accent transition-colors">053-776-000 ต่อ 1500</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Email */}
                <a
                  href="mailto:social@crru.ac.th"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-50 hover:border-slate-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                      <span className="text-sm font-bold text-scholar-deep group-hover:text-scholar-accent transition-colors">social@crru.ac.th</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/social.crru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-50 hover:border-slate-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <Facebook size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Facebook</span>
                      <span className="text-sm font-bold text-scholar-deep group-hover:text-scholar-accent transition-colors">Social Science CRRU</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Website */}
                <a
                  href="https://social.crru.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-50 hover:border-slate-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Globe size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Web</span>
                      <span className="text-sm font-bold text-scholar-deep group-hover:text-scholar-accent transition-colors">social.crru.ac.th</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-scholar-gold flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-scholar-gold">เวลาทำการ (Office Hours)</h4>
                <p className="text-base font-bold mt-0.5">วันจันทร์ – วันศุกร์: 08.30 น. – 16.30 น.</p>
                <p className="text-[11px] text-slate-400">ปิดทำการในวันหยุดราชการและวันหยุดนักขัตฤกษ์</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Map Integration (Clean, Minimal Premium Flat frame) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_15px_30px_rgba(15,23,42,0.03)] flex-grow flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-scholar-accent inline-block"></span>
                    <span className="text-xs font-bold text-scholar-deep uppercase tracking-wider">Faculty Map / แผนที่นำทาง</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">สำนักงานคณบดี ชั้น 1</span>
                </div>

                {/* Map iframe container */}
                <div className="w-full h-[400px] md:h-[480px] lg:h-[500px] relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1872.0!2d99.8490139!3d19.9807707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d701d4c7e675d5%3A0x7de07db9ed543a61!2z4LiE4LiT4Liw4Liq4Lix4LiH4LiE4Lih4Lio4Liy4Liq4LiV4Lij4LmMIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4o-C4suC4iuC4oOC4seC4j-C5gOC4iuC4teC4ouC4h-C4o-C4suC4og!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth"
                    className="absolute inset-0 w-full h-full border-none"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Coordinates info footer */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 font-medium">
                  📍 พิกัดอาคารเรียนรวมคณะสังคมศาสตร์ (อาคาร 4) มหาวิทยาลัยราชภัฏเชียงราย
                </div>
                <a
                  href="https://maps.app.goo.gl/dP5ZgoSctvLc8KdG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-scholar-accent hover:text-scholar-deep transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  เส้นทางใน Google Maps <ExternalLink size={12} />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
