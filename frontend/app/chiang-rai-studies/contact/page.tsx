'use client';

import { Mail, Phone, MapPin, Facebook, Globe, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FAF5FF] pb-20 font-kanit">
            {/* Header */}
            <div className="bg-[#581c87] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-4 border border-orange-500/30 shadow-lg">
                        Get in Touch
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md">ติดต่อเรา</h1>
                    <p className="text-purple-200/70 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        ศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย<br />
                        ยินดีต้อนรับทุกท่านที่สนใจศึกษาค้นคว้าข้อมูล
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Address Card */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-purple-50 group hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#2e1065] mb-2">ที่อยู่</h3>
                            <p className="text-stone-500 font-light leading-relaxed">
                                อาคาร 1 คณะสังคมศาสตร์<br />
                                มหาวิทยาลัยราชภัฏเชียงราย<br />
                                80 หมู่ 9 ต.บ้านดู่ อ.เมือง<br />
                                จ.เชียงราย 57100
                            </p>
                        </div>

                        {/* Contact Channels */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-purple-50 group hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#2e1065] mb-4">ช่องทางติดต่อ</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Phone size={16} className="text-orange-500" />
                                    <span>053-776-000 ต่อ 1234</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Mail size={16} className="text-orange-500" />
                                    <span>social@crru.ac.th</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Facebook size={16} className="text-orange-500" />
                                    <a href="#" className="hover:text-orange-600 transition-colors">Facebook Page</a>
                                </li>
                            </ul>
                        </div>

                        {/* Office Hours */}
                        <div className="bg-[#2e1065] p-8 rounded-[2rem] shadow-lg text-white pattern-dots">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-orange-400" />
                                <h3 className="text-xl font-bold">เวลาทำการ</h3>
                            </div>
                            <ul className="space-y-3 font-light text-purple-100">
                                <li className="flex justify-between border-b border-white/10 pb-2">
                                    <span>จันทร์ - ศุกร์</span>
                                    <span className="font-bold text-white">08:30 - 16:30</span>
                                </li>
                                <li className="flex justify-between border-b border-white/10 pb-2 opacity-50">
                                    <span>เสาร์ - อาทิตย์</span>
                                    <span>ปิดทำการ</span>
                                </li>
                                <li className="flex justify-between opacity-50">
                                    <span>วันหยุดนักขัตฤกษ์</span>
                                    <span>ปิดทำการ</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-purple-50 h-full min-h-[500px] relative overflow-hidden group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.135324505364!2d99.89408891491873!3d20.19835298645437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d704ec13c7c729%3A0x6c66be628043666!2sSocial%20Science%20Faculty%2C%20Chiang%20Rai%20Rajabhat%20University!5e0!3m2!1sen!2sth!4v1625641728456!5m2!1sen!2sth"
                                className="w-full h-full rounded-[2rem] filter grayscale hover:grayscale-0 transition-all duration-700"
                                loading="lazy"
                            ></iframe>

                            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-lg border border-purple-100 max-w-xs group-hover:-translate-y-2 transition-transform duration-500">
                                <h4 className="font-bold text-[#2e1065] mb-1">การเดินทาง</h4>
                                <p className="text-xs text-stone-500 mb-3">
                                    รถเมล์เขียว (Green Bus) สายเชียงราย-แม่สาย ผ่านหน้ามหาวิทยาลัย
                                </p>
                                <a
                                    href="https://goo.gl/maps/example"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider hover:underline"
                                >
                                    Google Maps <ArrowRight size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
