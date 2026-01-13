
'use client';

import React, { useState } from 'react';

// Mock Data - To be replaced with API call in Phase 6
const STAFF_DATA = [
    { id: 1, name: 'ผศ.ดร.สมชาย ใจดี', position: 'คณบดีคณะสังคมศาสตร์', department: 'ผู้บริหาร', email: 'somchai@crru.ac.th', image: null },
    { id: 2, name: 'ดร.สมหญิง รักเรียน', position: 'รองคณบดีฝ่ายวิชาการ', department: 'ผู้บริหาร', email: 'somying@crru.ac.th', image: null },
    { id: 3, name: 'อาจารย์ใจรัก พัฒนา', position: 'ประธานหลักสูตรการพัฒนาสังคม', department: 'การพัฒนาสังคม', email: 'jairak@crru.ac.th', image: null },
    { id: 4, name: 'ผศ.วิชาการ เข้มข้น', position: 'อาจารย์ประจำหลักสูตรยุทธศาสตร์ฯ', department: 'ยุทธศาสตร์การพัฒนา', email: 'vichakarn@crru.ac.th', image: null },
    { id: 5, name: 'ดร.ภูมิศาสตร์ โลกกว้าง', position: 'อาจารย์ประจำหลักสูตรภูมิสารสนเทศ', department: 'ภูมิสารสนเทศ', email: 'geo@crru.ac.th', image: null },
    { id: 6, name: 'อ.จิตใจ เมตตา', position: 'อาจารย์ประจำหลักสูตรจิตวิทยาสังคม', department: 'จิตวิทยาสังคม', email: 'psych@crru.ac.th', image: null },
];

const DEPARTMENTS = ['ทั้งหมด', 'ผู้บริหาร', 'การพัฒนาสังคม', 'ยุทธศาสตร์การพัฒนา', 'ภูมิสารสนเทศ', 'จิตวิทยาสังคม', 'สำนักงานคณบดี'];

export default function StaffPage() {
    const [activeDept, setActiveDept] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStaff = STAFF_DATA.filter(staff => {
        const matchesDept = activeDept === 'ทั้งหมด' || staff.department === activeDept;
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.position.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDept && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-base-100 pb-20">
            {/* Header */}
            <section className="bg-base-200/50 py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4 font-heading">บุคลากรคณะสังคมศาสตร์</h1>
                <p className="text-xl opacity-70">Staff Directory</p>
            </section>

            {/* Controls */}
            <section className="max-w-7xl mx-auto px-4 py-8 sticky top-0 z-30 bg-base-100/95 backdrop-blur-sm border-b border-base-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Department Filters */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar scroll-smooth">
                        {DEPARTMENTS.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setActiveDept(dept)}
                                className={`btn btn-sm whitespace-nowrap ${activeDept === dept ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="join w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                            className="input input-bordered join-item w-full md:w-64 input-sm md:input-md"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary join-item btn-sm md:btn-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Staff Grid */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                {filteredStaff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredStaff.map(staff => (
                            <div key={staff.id} className="card bg-base-100 border border-base-200 hover:shadow-xl transition-all hover:-translate-y-1 group">
                                <figure className="aspect-[3/4] bg-base-200 relative overflow-hidden">
                                    {staff.image ? (
                                        <img src={staff.image} alt={staff.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-base-content/10 bg-gradient-to-tr from-base-200 to-base-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </figure>
                                <div className="card-body p-5">
                                    <div className="badge badge-sm badge-outline mb-2">{staff.department}</div>
                                    <h2 className="card-title text-lg font-bold line-clamp-1" title={staff.name}>{staff.name}</h2>
                                    <p className="text-sm opacity-80 min-h-[2.5em] line-clamp-2">{staff.position}</p>
                                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                                        <a href={`mailto:${staff.email}`} className="btn btn-sm btn-ghost text-primary gap-2 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                            </svg>
                                            ติดต่อ
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl">ไม่พบข้อมูลบุคลากรที่ค้นหา</p>
                    </div>
                )}
            </section>
        </main>
    );
}
