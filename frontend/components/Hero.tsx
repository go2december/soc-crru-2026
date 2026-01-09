"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SlideData {
    id: number;
    title: string;
    description: string;
    image: string;
    buttons: {
        text: string;
        href: string;
        style: 'primary' | 'outline';
    }[];
    tag?: string;
}

const slides: SlideData[] = [
    {
        id: 1,
        tag: "Social Innovator",
        title: "สร้างนวัตกรสังคม เพื่อการพัฒนาที่ยั่งยืน",
        description: "คณะสังคมศาสตร์ มรภ.เชียงราย มุ่งเน้นการสร้างบัณฑิตที่มีทักษะการคิดวิเคราะห์และสร้างสรรค์นวัตกรรมเพื่อสังคม",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        buttons: [
            { text: "ค้นหาหลักสูตร", href: "/courses", style: "primary" },
            { text: "เกี่ยวกับเรา", href: "/about", style: "outline" }
        ]
    },
    {
        id: 2,
        tag: "Admission 2026",
        title: "เปิดรับสมัครนักศึกษาใหม่ ประจำปี 2569",
        description: "เข้าร่วมครอบครัวสังคมศาสตร์ พร้อมทุนการศึกษาและโอกาสฝึกงานทั้งในและต่างประเทศ",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
        buttons: [
            { text: "สมัครเรียน (TCAS)", href: "/admissions", style: "primary" },
            { text: "ดูเกณฑ์การรับสมัคร", href: "/admissions/requirements", style: "outline" }
        ]
    },
    {
        id: 3,
        tag: "Lifelong Learning",
        title: "Upskill & Reskill ไปกับหลักสูตรระยะสั้น",
        description: "เรียนรู้ได้ทุกที่ทุกเวลา พร้อมระบบสะสมหน่วยกิต (Credit Bank) สำหรับวัยทำงานและบุคคลทั่วไป",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
        buttons: [
            { text: "ดูคอร์สระยะสั้น", href: "/short-courses", style: "primary" },
            { text: "ระบบคลังหน่วยกิต", href: "/credit-bank", style: "outline" }
        ]
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-play effect
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextSlide, 6000); // เปลี่ยนทุก 6 วินาที
        return () => clearInterval(interval);
    }, [nextSlide, isPaused]);

    return (
        <div
            className="relative w-full h-[600px] lg:h-[700px] overflow-hidden bg-scholar-deep group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides Container */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
                        ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                    `}
                >
                    {/* Background Image with Parallax-like scaling */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className={`object-cover ${index === currentSlide ? 'scale-105 transition-transform duration-[8000ms]' : 'scale-100'}`}
                            priority={index === 0}
                        />
                        {/* Gradient Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-scholar-deep/95 via-scholar-deep/80 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center max-w-7xl">
                        <div className={`max-w-2xl transform transition-all duration-1000 delay-300
                            ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                        `}>
                            {slide.tag && (
                                <span className="inline-block py-1 px-3 rounded bg-scholar-accent/20 text-scholar-gold border border-scholar-accent/30 text-sm font-semibold mb-4 tracking-wider uppercase">
                                    {slide.tag}
                                </span>
                            )}
                            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md pr-10">
                                {slide.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {slide.buttons.map((btn, btnIndex) => (
                                    <Link
                                        key={btnIndex}
                                        href={btn.href}
                                        className={`btn btn-lg rounded-full px-8 shadow-lg transition-all transform hover:scale-105 border-0
                                            ${btn.style === 'primary'
                                                ? 'bg-gradient-to-r from-scholar-accent to-[#D9341C] text-white'
                                                : 'bg-white/10 text-white hover:bg-white hover:text-scholar-deep backdrop-blur-sm ring-1 ring-white/30'}
                                        `}
                                    >
                                        {btn.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white/50 hover:bg-scholar-accent hover:text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 duration-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white/50 hover:bg-scholar-accent hover:text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 duration-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full h-3
                            ${index === currentSlide ? 'w-10 bg-scholar-accent' : 'w-3 bg-white/30 hover:bg-white'}
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-20"></div>
        </div>
    );
}