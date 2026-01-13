"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

// Mock Data
const RESEARCH_DATA = [
    {
        id: 1,
        title: "การจัดการทรัพยากรน้ำแบบมีส่วนร่วมของชุมชนลุ่มน้ำกกร่องช้าง",
        author: "ดร.สมชาย ใจดี และคณะ",
        year: 2567,
        category: "การพัฒนาสังคม",
        publish: "วารสารสังคมศาสตร์เพื่อการพัฒนาท้องถิ่น",
        downloads: 124
    },
    {
        id: 2,
        title: "ผลกระทบทางเศรษฐกิจและสังคมจากการท่องเที่ยวเชิงวัฒนธรรมในเชียงราย",
        author: "ผศ.มานี รักเรียน",
        year: 2566,
        category: "สังคมวิทยา",
        publish: "CRRU Journal of Social Sciences",
        downloads: 89
    },
    {
        id: 3,
        title: "นวัตกรรมการแปรรูปผลิตภัณฑ์สมุนไพรท้องถิ่นสู่ตลาดสากล",
        author: "อาจารย์วิจัย นวัตกรรม",
        year: 2567,
        category: "คหกรรมศาสตร์",
        publish: "International Journal of Local Wisdom",
        downloads: 256
    },
    {
        id: 4,
        title: "การประยุกต์ใช้ GIS เพื่อการจัดการภัยพิบัติในพื้นที่สูง",
        author: "ดร.ภูมิ พิทักษ์ไทย",
        year: 2566,
        category: "ภูมิศาสตร์",
        publish: "Geospatial World",
        downloads: 67
    },
    {
        id: 5,
        title: "พลวัตกลุ่มชาติพันธุ์ในเขตเศรษฐกิจพิเศษชายแดน",
        author: "รศ.ดร.วัฒนา สังคม",
        year: 2565,
        category: "มานุษยวิทยา",
        publish: "Journal of Border Studies",
        downloads: 142
    }
];

const CATEGORIES = ["ทั้งหมด", "การพัฒนาสังคม", "สังคมวิทยา", "มานุษยวิทยา", "คหกรรมศาสตร์", "ภูมิศาสตร์", "จิตวิทยาสังคม"];

export default function ResearchDatabasePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const filteredData = RESEARCH_DATA.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="relative h-[300px] w-full bg-scholar-deep overflow-hidden">
                <Image
                    src="/images/research-banner.png"
                    alt="Research Banner"
                    fill
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
                        ฐานข้อมูลงานวิจัยและวิทยานิพนธ์
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        คลังความรู้ทางสังคมศาสตร์ เพื่อการพัฒนาท้องถิ่นและยกระดับคุณภาพชีวิต
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
                <Breadcrumb items={[{ label: 'วิจัยและนวัตกรรม' }, { label: 'ฐานข้อมูลงานวิจัย' }]} />

                {/* Search & Filter Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-1/2 relative">
                            <input
                                type="text"
                                placeholder="ค้นหางานวิจัย (ชื่อเรื่อง, ผู้วิจัย)..."
                                className="input input-bordered w-full pl-10 focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                        ${selectedCategory === cat
                                            ? 'bg-scholar-deep text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Table/List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-scholar-deep/5">
                        <h2 className="text-xl font-bold text-scholar-deep flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scholar-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            ผลการค้นหา ({filteredData.length} รายการ)
                        </h2>
                    </div>

                    {filteredData.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {filteredData.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2 flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded textxs font-bold bg-blue-100 text-blue-700 text-[10px] uppercase tracking-wider">
                                                    {item.category}
                                                </span>
                                                <span className="text-gray-400 text-xs">|</span>
                                                <span className="text-gray-500 text-sm">ปีที่พิมพ์: {item.year}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-scholar-accent transition-colors">
                                                <Link href={`#research-${item.id}`}>{item.title}</Link>
                                            </h3>
                                            <p className="text-gray-600 text-sm flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {item.author}
                                            </p>
                                            <p className="text-gray-500 text-xs italic">
                                                ตีพิมพ์ใน: {item.publish}
                                            </p>
                                        </div>
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 min-w-[120px]">
                                            <div className="text-center md:text-right">
                                                <span className="block text-xl font-bold text-scholar-deep">{item.downloads}</span>
                                                <span className="text-xs text-gray-400">Downloads</span>
                                            </div>
                                            <button className="btn btn-sm btn-outline border-scholar-accent text-scholar-accent hover:bg-scholar-accent hover:text-white hover:border-scholar-accent rounded-full w-full md:w-auto">
                                                ดาวน์โหลด PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg">ไม่พบข้อมูลงานวิจัยที่ค้นหา</p>
                            <button className="btn btn-ghost text-scholar-accent mt-2" onClick={() => { setSearchTerm(""); setSelectedCategory("ทั้งหมด"); }}>
                                ล้างคำค้นหา
                            </button>
                        </div>
                    )}

                    {/* Pagination (Mock) */}
                    <div className="p-4 border-t border-gray-100 flex justify-center">
                        <div className="join">
                            <button className="join-item btn btn-sm">«</button>
                            <button className="join-item btn btn-sm btn-active bg-scholar-deep text-white border-scholar-deep">1</button>
                            <button className="join-item btn btn-sm">2</button>
                            <button className="join-item btn btn-sm">3</button>
                            <button className="join-item btn btn-sm">»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
