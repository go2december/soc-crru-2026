"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Users,
  Lightbulb,
  Handshake,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Hook for Smooth Count Up Animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return { count, countRef };
};

const StatItem = ({
  end,
  label,
  suffix = "",
  icon: Icon,
}: {
  end: number;
  label: string;
  suffix?: string;
  icon: typeof Users;
}) => {
  const { count, countRef } = useCountUp(end);

  return (
    <div
      ref={countRef}
      className="text-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#C2410C]/30 transition-all duration-300 hover:-translate-y-1.5 group"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-orange-50 rounded-2xl flex items-center justify-center text-[#C2410C] group-hover:bg-[#C2410C] group-hover:text-white transition-colors duration-300 shadow-2xs">
        <Icon className="size-7" strokeWidth={1.75} />
      </div>
      <div className="text-4xl lg:text-5xl font-extrabold text-[#0B132B] mb-2 font-mono group-hover:text-[#C2410C] transition-colors">
        {count}
        {suffix}
      </div>
      <div className="text-slate-600 text-xs sm:text-sm font-semibold tracking-wide">
        {label}
      </div>
    </div>
  );
};

export default function StatsDashboard() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] relative overflow-hidden border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2410C]/10 text-[#C2410C] border border-[#C2410C]/20 font-bold tracking-widest uppercase text-xs mb-3">
            <TrendingUp className="size-3.5" strokeWidth={2} />
            <span>Social Impact & Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
            พลังแห่งการสร้างสรรค์สังคม
          </h2>
          <p className="font-body text-slate-600 mt-2 text-base">
            ผลลัพธ์ที่เป็นรูปธรรมจากการบูรณาการงานวิจัย นวัตกรรม และความร่วมมือในพื้นที่จริง
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <StatItem
            end={150}
            suffix="+"
            label="ชุมชนเครือข่ายที่ร่วมพัฒนา"
            icon={Users}
          />
          <StatItem
            end={85}
            label="โครงการนวัตกรรมสังคม"
            icon={Lightbulb}
          />
          <StatItem
            end={42}
            label="เครือข่ายความร่วมมือและ MOU"
            icon={Handshake}
          />
          <StatItem
            end={98}
            suffix="%"
            label="ความพึงพอใจนายจ้างต่อบัณฑิต"
            icon={HeartHandshake}
          />
        </div>

        <div className="text-center mt-12">
          <Link
            href="/about/strategy"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B132B] hover:text-[#C2410C] transition-colors"
          >
            <span>ดูแผนยุทธศาสตร์และตัวชี้วัดความสำเร็จทั้งหมด</span>
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
