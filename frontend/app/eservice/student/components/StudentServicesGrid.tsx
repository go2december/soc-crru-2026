'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Wifi,
  Building2,
  ExternalLink,
  ArrowRight,
  UserCheck,
  MonitorPlay,
  Coins,
  Calendar,
  Award,
  Wallet,
  Home,
  DoorOpen,
  FileSearch,
  Mail,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { StudentServiceItem } from '@/lib/student-services';
import { Button } from '@/components/ui/button';

interface StudentServicesGridProps {
  services: StudentServiceItem[];
  onResetFilters: () => void;
}

function renderServiceIcon(iconKey: string, category: string) {
  const className = 'w-6 h-6';
  switch (iconKey) {
    case 'GraduationCap':
    case 'academic-cap':
      return <GraduationCap className={className} />;
    case 'UserCheck':
    case 'identification':
      return <UserCheck className={className} />;
    case 'MonitorPlay':
    case 'laptop':
      return <MonitorPlay className={className} />;
    case 'Coins':
    case 'sparkles':
      return <Coins className={className} />;
    case 'Calendar':
    case 'calendar':
      return <Calendar className={className} />;
    case 'Award':
    case 'star':
      return <Award className={className} />;
    case 'Wallet':
    case 'currency-dollar':
      return <Wallet className={className} />;
    case 'HeartHandshake':
    case 'heart':
      return <HeartHandshake className={className} />;
    case 'Home':
    case 'home':
      return <Home className={className} />;
    case 'BookOpen':
    case 'book-open':
      return <BookOpen className={className} />;
    case 'DoorOpen':
    case 'ticket':
      return <DoorOpen className={className} />;
    case 'FileSearch':
    case 'document-magnifying-glass':
      return <FileSearch className={className} />;
    case 'Mail':
    case 'envelope':
      return <Mail className={className} />;
    case 'Wifi':
    case 'wifi':
      return <Wifi className={className} />;
    case 'ShieldCheck':
    case 'shield-check':
      return <ShieldCheck className={className} />;
    default:
      if (category === 'ACADEMIC') return <GraduationCap className={className} />;
      if (category === 'WELFARE') return <HeartHandshake className={className} />;
      if (category === 'LIBRARY') return <BookOpen className={className} />;
      if (category === 'DIGITAL_IT') return <Wifi className={className} />;
      return <Building2 className={className} />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'ACADEMIC':
      return {
        iconBg: 'bg-stone-900 text-amber-400',
        badge: 'bg-stone-100 text-stone-800 border-stone-300',
      };
    case 'WELFARE':
      return {
        iconBg: 'bg-stone-900 text-emerald-400',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'LIBRARY':
      return {
        iconBg: 'bg-stone-900 text-amber-300',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'DIGITAL_IT':
      return {
        iconBg: 'bg-stone-900 text-sky-400',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
      };
    case 'FACULTY':
    default:
      return {
        iconBg: 'bg-stone-900 text-primary',
        badge: 'bg-orange-50 text-primary border-orange-200',
      };
  }
}

export default function StudentServicesGrid({
  services,
  onResetFilters,
}: StudentServicesGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (services.length === 0) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1.5 font-heading">
          ไม่พบระบบบริการนักศึกษาที่ตรงกับเงื่อนไข
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          โปรดลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่บริการทั้งหมดเพื่อดูรายการระบบที่มี
        </p>
        <Button
          onClick={onResetFilters}
          size="sm"
          className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs gap-1.5"
        >
          <span>ล้างตัวกรองและแสดงทั้งหมด</span>
        </Button>
      </div>
    );
  }

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
            CRRU CENTRAL DIGITAL SYSTEMS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
            <span>ระบบบริการดิจิทัลส่วนกลาง</span>
            <span className="text-xs font-normal text-slate-500 font-mono">
              ({services.length} ระบบ)
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const colorStyle = getCategoryColor(service.category);
          const isInternal = !service.isExternal;

          const CardWrapper = isInternal ? Link : 'a';
          const linkProps = isInternal
            ? { href: service.url }
            : { href: service.url, target: '_blank', rel: 'noopener noreferrer' };

          return (
            <motion.article
              key={service.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
              className="group bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <CardWrapper {...linkProps} className="block p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top: Icon + Badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-sm ${colorStyle.iconBg} flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform`}
                    >
                      {renderServiceIcon(service.icon, service.category)}
                    </div>

                    {service.badge && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${colorStyle.badge}`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-2 mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  <span className="flex items-center gap-1.5">
                    {isInternal ? 'ไปยังหน้ากำหนดการ' : 'เข้าสู่ระบบบริการ'}
                  </span>
                  <span>
                    {isInternal ? (
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                  </span>
                </div>
              </CardWrapper>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
