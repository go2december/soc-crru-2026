"use client";

import { useEffect, useState, useRef } from 'react';

// Hook สำหรับทำ Count Up Animation
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
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const increment = end / (duration / 16); // 60fps
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

const StatItem = ({ end, label, suffix = "", icon }: { end: number, label: string, suffix?: string, icon: React.ReactNode }) => {
    const { count, countRef } = useCountUp(end);

    // Using DaisyUI stat component structure inside the loop but keeping custom styling
    // Actually, DaisyUI stats are best used as a wrapper. 
    // But here we want to preserve the CountUp hook logic per item.
    // So we will render a single "stat" div here, and the parent will wrap them in "stats".

    return (
        <div ref={countRef} className="stat place-items-center p-6 hover:bg-white/5 transition-colors duration-300">
            <div className="stat-figure text-scholar-accent mb-2">
                <div className="w-12 h-12 rounded-full bg-scholar-accent/20 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="stat-value text-4xl lg:text-5xl text-white font-mono">
                {count}{suffix}
            </div>
            <div className="stat-title text-gray-300 font-medium uppercase tracking-wider mt-2">
                {label}
            </div>
        </div>
    );
};

export default function StatsDashboard() {
    return (
        <section className="py-20 bg-scholar-deep relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-scholar-gold font-bold tracking-widest uppercase text-sm mb-2 block">Our Impact</span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">พลังแห่งการสร้างสรรค์สังคม</h2>
                    <p className="text-gray-400 mt-2">ผลลัพธ์ที่เป็นรูปธรรมจากการทำงานร่วมกับชุมชนและเครือข่าย</p>
                </div>

                {/* DaisyUI Stats Component */}
                <div className="flex justify-center">
                    <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 w-full max-w-6xl divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* 1. Communities */}
                        <StatItem
                            end={150}
                            suffix="+"
                            label="ชุมชนที่ดูแล"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        />

                        {/* 2. Projects/Innovations */}
                        <StatItem
                            end={85}
                            label="นวัตกรรมสังคม"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                        />

                        {/* 3. Partners */}
                        <StatItem
                            end={42}
                            label="เครือข่ายพันธมิตร"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                        />

                        {/* 4. Satisfaction */}
                        <StatItem
                            end={98}
                            suffix="%"
                            label="ความพึงพอใจนายจ้าง"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>}
                        />
                    </div>
                </div>

                {/* Optional: Learn More Button */}
                <div className="text-center mt-12">
                    <a href="/about/strategy" className="btn btn-link text-white hover:text-scholar-accent no-underline hover:no-underline group">
                        ดูแผนยุทธศาสตร์และตัวชี้วัดทั้งหมด
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
