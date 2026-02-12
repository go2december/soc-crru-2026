'use client';

import Link from 'next/link';
import {
    ArrowRight,
    BookOpen,
    Landmark,
    ScrollText,
    Users,
    Sparkles,
    Search,
    MapPin,
    Calendar,
    ChevronRight,
    PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChiangRaiHomePage() {
    return (
        <div className="min-h-screen bg-[#FAF5FF] font-kanit">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#2e1065]">
                {/* Background Pattern/Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/2e1065/FFF?text=Chiang+Rai+Culture')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065] via-[#581c87]/90 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-4xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/20 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-orange-500/30 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            The Wisdom of Lanna
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                            ศูนย์เชียงราย<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                                ศึกษา
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-purple-100/90 font-light mb-12 max-w-2xl leading-relaxed">
                            แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย
                            เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/chiang-rai-studies/archive">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-orange-600/30 transition-all w-full sm:w-auto">
                                    <Search className="mr-2 h-5 w-5" />
                                    สืบค้นคลังข้อมูล
                                </Button>
                            </Link>
                            <Link href="/chiang-rai-studies/about">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-2 border-purple-400/30 text-purple-100 hover:bg-white/10 hover:text-white hover:border-white font-bold text-lg backdrop-blur-sm w-full sm:w-auto">
                                    รู้จักศูนย์ฯ
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Decor */}
                <div className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none hidden lg:block">
                    <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F97316" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.5,30.6C58.8,39.8,46.7,45.4,35.4,52.6C24.1,59.8,13.6,68.6,-0.4,69.3C-14.4,70,-28,62.6,-40.3,53.4C-52.6,44.2,-63.6,33.2,-69.3,20.1C-75,7,-75.4,-8.2,-69.7,-21.3C-64,-34.4,-52.2,-45.4,-39.9,-53.2C-27.6,-61,-14.8,-65.6,-0.5,-64.7C13.8,-63.9,27.6,-57.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </section>

            {/* 5 Identities Section */}
            <section className="py-24 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-orange-600 tracking-widest uppercase mb-3">Five Dimensions of Chiang Rai</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-[#2e1065]">5 อัตลักษณ์เชียงราย</h3>
                        <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            { id: 'HISTORY', title: 'ประวัติศาสตร์', icon: Landmark, color: 'bg-rose-50 text-rose-700', border: 'hover:border-rose-200' },
                            { id: 'ARCHAEOLOGY', title: 'โบราณคดี', icon: ScrollText, color: 'bg-amber-50 text-amber-700', border: 'hover:border-amber-200' },
                            { id: 'CULTURE', title: 'ชาติพันธุ์', icon: Users, color: 'bg-emerald-50 text-emerald-700', border: 'hover:border-emerald-200' },
                            { id: 'ARTS', title: 'ศิลปะการแสดง', icon: Sparkles, color: 'bg-purple-50 text-purple-700', border: 'hover:border-purple-200' },
                            { id: 'WISDOM', title: 'ภูมิปัญญาท้องถิ่น', icon: BookOpen, color: 'bg-blue-50 text-blue-700', border: 'hover:border-blue-200' },
                        ].map((item, index) => (
                            <Link
                                href={`/chiang-rai-studies/archive?category=${item.id}`}
                                key={index}
                                className={`group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent ${item.border} flex flex-col items-center text-center`}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                    <item.icon size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h4>
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors flex items-center gap-1">
                                    Explore <ArrowRight size={10} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Sections Grid */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-100 to-transparent"></div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                                <img
                                    src="https://placehold.co/800x600/581c87/white?text=Digital+Archive"
                                    alt="Digital Archive"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Digital Archive</h3>
                                    <p className="opacity-90 font-light">รวบรวมหลักฐานทางประวัติศาสตร์และวัฒนธรรมในรูปแบบดิจิทัล</p>
                                </div>
                            </div>
                            {/* Decorative Blur */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        </div>

                        <div className="lg:pl-8">
                            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-4 block">Knowledge Hub</span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#2e1065] mb-6 leading-tight">
                                เชื่อมโยงอดีต<br />สู่ปัจจุบัน
                            </h2>
                            <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                                ศูนย์เชียงรายศึกษา มุ่งเน้นการศึกษาวิจัยและให้บริการทางวิชาการ
                                เพื่อสร้างความตระหนักรู้ในคุณค่าของมรดกทางวัฒนธรรม
                                และส่งเสริมให้นำองค์ความรู้ไปใช้ประโยชน์ในการพัฒนาคุณภาพชีวิต
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/chiang-rai-studies/articles" className="group flex items-center gap-4 p-4 rounded-2xl bg-purple-50 hover:bg-white border border-transparent hover:border-purple-100 transition-all shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#2e1065]">บทความวิชาการ</h4>
                                        <p className="text-xs text-stone-500">Academic Articles</p>
                                    </div>
                                    <ArrowRight size={16} className="text-purple-300 group-hover:text-orange-500 transition-colors" />
                                </Link>

                                <Link href="/chiang-rai-studies/archive" className="group flex items-center gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-white border border-transparent hover:border-orange-100 transition-all shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <Landmark size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-orange-900">วัตถุจัดแสดง</h4>
                                        <p className="text-xs text-stone-500">Artifacts Gallery</p>
                                    </div>
                                    <ArrowRight size={16} className="text-orange-300 group-hover:text-orange-500 transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Updates / News Teaser */}
            <section className="py-24 bg-[#f3e8ff]/30">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-purple-600 font-bold tracking-widest uppercase text-xs mb-2 block">Updates</span>
                            <h2 className="text-3xl font-black text-[#2e1065]">กิจกรรมและข่าวสาร</h2>
                        </div>
                        <Link href="/chiang-rai-studies/articles">
                            <Button variant="ghost" className="hidden sm:flex text-purple-700 hover:text-orange-600 hover:bg-transparent px-0 font-bold">
                                ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Placeholder News Cards */}
                        {[1, 2, 3].map((i) => (
                            <Link href="/chiang-rai-studies/articles" key={i} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="h-48 bg-stone-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img
                                        src={`https://placehold.co/600x400/purple/white?text=News+Update+${i}`}
                                        alt="News"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-purple-900 uppercase tracking-wide z-20 shadow-sm">
                                        Activity
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-3">
                                        <Calendar size={12} />
                                        <span>12 Feb 2026</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2e1065] mb-3 leading-snug group-hover:text-orange-600 transition-colors">
                                        กิจกรรมส่งเสริมการเรียนรู้ศิลปวัฒนธรรมล้านนา ครั้งที่ {i}
                                    </h3>
                                    <p className="text-stone-500 text-sm line-clamp-2 mb-6 font-light">
                                        รายละเอียดกิจกรรมย่อๆ เพื่อเชิญชวนให้ผู้สนใจเข้ามาอ่านต่อ...
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-dashed border-stone-100 text-xs font-bold text-purple-400 group-hover:text-purple-700 uppercase tracking-widest flex items-center gap-2">
                                        Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/chiang-rai-studies/articles">
                            <Button variant="outline" className="w-full rounded-full border-purple-200 text-purple-700">
                                ดูทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats / Footer CTA */}
            <section className="py-20 bg-[#581c87] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-8">ร่วมเป็นส่วนหนึ่งของการอนุรักษ์</h2>
                    <div className="flex flex-wrap justify-center gap-12 mb-12">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-orange-400 mb-2">500+</div>
                            <div className="text-sm text-purple-200 uppercase tracking-widest">Artifacts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-amber-400 mb-2">50+</div>
                            <div className="text-sm text-purple-200 uppercase tracking-widest">Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">5</div>
                            <div className="text-sm text-purple-200 uppercase tracking-widest">Identities</div>
                        </div>
                    </div>
                    <Link href="/chiang-rai-studies/contact">
                        <div className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors cursor-pointer border-b border-purple-400/30 hover:border-white pb-1">
                            <span>ติดต่อศูนย์เชียงรายศึกษา</span>
                            <ArrowRight size={16} />
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
