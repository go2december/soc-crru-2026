"use client";

import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState } from 'react';

interface Course {
    id: number;
    title: string;
    hours: number;
    price: number;
    creditBank: boolean;
    status: 'open' | 'closed' | 'soon';
    image: string;
    category: string;
}

const courses: Course[] = [
    {
        id: 1,
        title: "การเป็นผู้นำและการบริหารทีมงานยุคใหม่",
        hours: 15,
        price: 1500,
        creditBank: true,
        status: 'open',
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        category: "Management"
    },
    {
        id: 2,
        title: "เทคนิคการให้คำปรึกษาเบื้องต้น (Basic Counseling)",
        hours: 30,
        price: 3000,
        creditBank: true,
        status: 'open',
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070&auto=format&fit=crop",
        category: "Psychology"
    },
    {
        id: 3,
        title: "การใช้งานโดรนเพื่อการสำรวจและทำแผนที่",
        hours: 45,
        price: 5500,
        creditBank: true,
        status: 'soon',
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop",
        category: "Technology"
    },
    {
        id: 4,
        title: "ศิลปะการปั้นเซรามิกสร้างสรรค์",
        hours: 20,
        price: 2500,
        creditBank: false,
        status: 'closed',
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=2070&auto=format&fit=crop",
        category: "Art & Craft"
    },
    {
        id: 5,
        title: "โภชนาการอาหารเพื่อสุขภาพผู้สูงอายุ",
        hours: 18,
        price: 1800,
        creditBank: true,
        status: 'open',
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
        category: "Health"
    }
];

export default function ShortCoursesPage() {
    const [filterType, setFilterType] = useState<'all' | 'credit-bank'>('all');

    const filteredCourses = courses.filter(course => {
        if (filterType === 'credit-bank') return course.creditBank;
        return true;
    });

    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Header */}
            <div className="bg-gradient-to-r from-scholar-deep to-gray-900 text-white py-12 px-4 shadow-lg">
                <div className="container mx-auto">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'หลักสูตรระยะสั้น' }]} />
                    <h1 className="text-3xl md:text-4xl font-bold mt-4">หลักสูตรระยะสั้น (Short Courses)</h1>
                    <p className="text-gray-300 mt-2 max-w-2xl">
                        พัฒนาทักษะใหม่ๆ (Upskill/Reskill) กับคอร์สคุณภาพที่ออกแบบโดยคณาจารย์ผู้เชี่ยวชาญ <br />
                        พร้อมสะสมหน่วยกิตในระบบคลังหน่วยกิต (Credit Bank)
                    </p>
                </div>
            </div>

            {/* Filter & List */}
            <div className="container mx-auto px-4 py-12">

                {/* Filter Tabs & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="tabs tabs-boxed bg-gray-100 p-1 rounded-full">
                        <button
                            className={`tab rounded-full px-6 transition-all ${filterType === 'all' ? 'tab-active bg-scholar-accent text-white shadow-md' : 'text-gray-600 hover:text-scholar-deep'}`}
                            onClick={() => setFilterType('all')}
                        >
                            Upskill/Reskill
                        </button>
                        <button
                            className={`tab rounded-full px-6 transition-all ${filterType === 'credit-bank' ? 'tab-active bg-scholar-gold text-scholar-deep shadow-md font-bold' : 'text-gray-600 hover:text-scholar-deep'}`}
                            onClick={() => setFilterType('credit-bank')}
                        >
                            Credit Bank
                        </button>
                    </div>
                    <div className="join w-full md:w-auto">
                        <input className="input input-bordered join-item w-full md:w-64 bg-white" placeholder="ค้นหาหลักสูตร..." />
                        <button className="btn btn-primary join-item bg-scholar-accent border-none text-white">ค้นหา</button>
                    </div>
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                <figure className="relative h-48 overflow-hidden">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        {course.status === 'open' && <span className="badge badge-success text-white">เปิดรับสมัคร</span>}
                                        {course.status === 'soon' && <span className="badge badge-warning text-white">เร็วๆ นี้</span>}
                                        {course.status === 'closed' && <span className="badge badge-neutral text-white">ปิดรับสมัคร</span>}
                                    </div>
                                    {course.creditBank && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="badge bg-white/90 text-scholar-deep text-xs font-bold shadow-sm flex items-center gap-1">
                                                <svg className="w-3 h-3 text-scholar-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                Credit Bank
                                            </span>
                                        </div>
                                    )}
                                </figure>
                                <div className="card-body p-6">
                                    <div className="text-xs font-semibold text-scholar-accent uppercase mb-1">{course.category}</div>
                                    <h2 className="card-title text-lg font-bold text-scholar-deep leading-snug min-h-[3.5rem]">
                                        {course.title}
                                    </h2>
                                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t pt-4">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {course.hours} ชั่วโมง
                                        </span>
                                        <span className="font-bold text-scholar-deep text-lg">{course.price.toLocaleString()} บาท</span>
                                    </div>
                                    <div className="card-actions mt-4">
                                        {course.status === 'open' ? (
                                            <button className="btn btn-primary bg-scholar-accent border-none text-white w-full hover:bg-[#D9341C]">สมัครเรียน</button>
                                        ) : (
                                            <button className="btn btn-disabled w-full bg-gray-200 text-gray-400">ดูรายละเอียด</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-lg font-medium text-gray-500">ไม่พบหลักสูตรที่เลือก</h3>
                        <p className="text-gray-400">กรุณาลองเลือกประเภทอื่น หรือค้นหาใหม่</p>
                    </div>
                )}
            </div>
        </div>
    );
}
