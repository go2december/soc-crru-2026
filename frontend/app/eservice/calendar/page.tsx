
import React from 'react';

// Mock Events Data
const UPCOMING_EVENTS = [
    { id: 1, date: '15', month: 'ม.ค.', title: 'วันสุดท้ายของการถอนรายวิชา (W)', type: 'registration', desc: 'สำหรับนักศึกษาทุกชั้นปี' },
    { id: 2, date: '20', month: 'ม.ค.', title: 'สอบกลางภาค 2/2568', type: 'exam', desc: 'เริ่มสอบวันแรก' },
    { id: 3, date: '28', month: 'ม.ค.', title: 'วันสุดท้ายของการสอบกลางภาค', type: 'exam', desc: 'สิ้นสุดการสอบ' },
    { id: 4, date: '14', month: 'ก.พ.', title: 'วันราชภัฏ', type: 'activity', desc: 'กิจกรรมรำลึกพระมหากรุณาธิคุณ' },
];

export default function CalendarPage() {
    return (
        <main className="min-h-screen bg-base-100 text-base-content pb-20">
            <section className="bg-gradient-to-r from-red-600 to-rose-800 text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4 font-heading">ปฏิทินวิชาการ</h1>
                <p className="text-xl opacity-90">Academic Calendar</p>
            </section>

            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Calendar Download */}
                <div className="card bg-base-200 border border-base-300 mb-12">
                    <div className="card-body sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="text-5xl">📅</div>
                        <div className="flex-1">
                            <h2 className="card-title text-xl mb-1 justify-center sm:justify-start">ปฏิทินการศึกษา ประจำปีการศึกษา 2568</h2>
                            <p className="opacity-70">ฉบับทางการจากสำนักส่งเสริมวิชาการและงานทะเบียน</p>
                        </div>
                        <button className="btn btn-primary">
                            ดาวน์โหลด PDF
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Upcoming Events */}
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">กิจกรรมที่กำลังจะมาถึง</h2>
                <div className="space-y-4">
                    {UPCOMING_EVENTS.map(event => (
                        <div key={event.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all flex-row overflow-hidden">
                            <div className={`w-24 flex flex-col items-center justify-center p-2 text-white
                   ${event.type === 'exam' ? 'bg-red-500' : event.type === 'registration' ? 'bg-blue-500' : 'bg-green-500'}
                `}>
                                <span className="text-3xl font-bold leading-none">{event.date}</span>
                                <span className="text-sm">{event.month}</span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`badge badge-xs ${event.type === 'exam' ? 'badge-error' : event.type === 'registration' ? 'badge-info' : 'badge-success'}`}></span>
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                </div>
                                <p className="text-sm opacity-70 ml-4">{event.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="https://reg.crru.ac.th" target="_blank" rel="noreferrer" className="link link-primary no-underline hover:underline">
                        ดูปฏิทินทั้งหมดที่เว็บไซต์สำนักทะเบียน &rarr;
                    </a>
                </div>
            </div>
        </main>
    );
}
