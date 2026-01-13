
import React from 'react';

const SERVICES = [
    { name: 'ระบบสารบรรณ (E-Document)', desc: 'รับ-ส่ง หนังสือราชการ', url: '#', icon: '📂', color: 'bg-purple-100 text-purple-600' },
    { name: 'ระบบลางานออนไลน์', desc: 'แจ้งวันลาและตรวจสอบสิทธิ์การลา', url: '#', icon: '✈️', color: 'bg-pink-100 text-pink-600' },
    { name: 'ERP System', desc: 'ระบบบริหารจัดการทรัพยากรองค์กร', url: '#', icon: '📊', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'MIS System', desc: 'ระบบสารสนเทศเพื่อการบริหาร', url: '#', icon: '📉', color: 'bg-cyan-100 text-cyan-600' },
    { name: 'แจ้งซ่อมออนไลน์', desc: 'แจ้งซ่อมอุปกรณ์และสาธารณูปโภค', url: '#', icon: '🔧', color: 'bg-stone-100 text-stone-600' },
    { name: 'ดาวน์โหลดแบบฟอร์ม', desc: 'คำร้องต่างๆ และเอกสารราชการ', url: '#', icon: '📄', color: 'bg-gray-100 text-gray-600' },
];

export default function StaffServicePage() {
    return (
        <main className="min-h-screen bg-base-100 text-base-content pb-20">
            <section className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4 font-heading">บริการสำหรับบุคลากร</h1>
                <p className="text-xl opacity-90">Staff E-Services</p>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card bg-base-100 border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer block h-full"
                        >
                            <div className="card-body p-6">
                                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                    {item.icon === 'r' ? <span className="font-bold text-lg">Act</span> : item.icon}
                                </div>
                                <h3 className="card-title text-lg mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                                <p className="text-sm opacity-70 mb-4">{item.desc}</p>
                                <div className="card-actions justify-end mt-auto">
                                    <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        เข้าสู่ระบบ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.5a.75.75 0 010 1.08l-5.5 5.5a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </main>
    );
}
