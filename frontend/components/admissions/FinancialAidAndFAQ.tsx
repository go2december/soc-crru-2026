'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Coins, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        question: 'ต้องสอบข้อเขียน มีสอบสัมภาษณ์ หรือต้องยื่นผ่านระบบ TCAS หรือไม่?',
        answer: 'ไม่ต้องสอบข้อเขียน ไม่มีการสอบสัมภาษณ์ และไม่ต้องยื่นผ่านระบบกลาง TCAS (mytcas.com) คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เปิดรับสมัครบุคคลเข้าศึกษาต่อโดยตรง (Direct Admission) โดยพิจารณาจากหลักฐานผลการเรียนสะสม (GPAX) เมื่อผ่านคุณสมบัติสามารถรายงานตัวเข้าศึกษาต่อได้ทันที',
    },
    {
        question: 'สามารถกู้ยืมเงินกองทุน กยศ. หรือ กรอ. ได้หรือไม่?',
        answer: 'นักศึกษาคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย มีสิทธิ์ยื่นกู้ยืมกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) ทั้งค่าเล่าเรียนและค่าครองชีพรายเดือนตามหลักเกณฑ์ คุณสมบัติ และเพดานวงเงินที่กองทุนกำหนด โดยมีกองพัฒนานักศึกษาและคณะคอยให้คำปรึกษาตลอดขั้นตอน',
    },
    {
        question: 'จบสายอาชีพ (ปวช.) หรือ กศน. สมัครเรียนคณะสังคมศาสตร์ได้ไหม?',
        answer: 'สามารถสมัครได้ โดยคณะสังคมศาสตร์เปิดรับผู้สำเร็จการศึกษาระดับ ม.6, ปวช., หรือ กศน. ในทุกสาขาวิชา ทั้งในรอบ Portfolio, โควตา และรับตรงอิสระ',
    },
    {
        question: 'มีหลักสูตรเทียบโอนสำหรับผู้จบ ปวส. หรือไม่?',
        answer: 'มีหลักสูตรเทียบโอนความรู้และประสบการณ์ในหลายสาขาวิชา โดยใช้เวลาเรียนประมาณ 2 ปี ทั้งนี้ขึ้นอยู่กับเกณฑ์และรายวิชาที่สามารถเทียบโอนได้ของแต่ละสาขาวิชา',
    },
    {
        question: 'ระดับปริญญาโทและปริญญาเอก จัดการเรียนการสอนช่วงเวลาใด?',
        answer: 'ระดับบัณฑิตศึกษามีทั้งแผนการเรียนในเวลาราชการ และแผนการเรียนนอกเวลาราชการ (วันเสาร์ – วันอาทิตย์) ซึ่งออกแบบมาเพื่ออำนวยความสะดวกสำหรับบุคลากรและคนทำงานโดยเฉพาะ',
    },
    {
        question: 'หากต้องการติดต่อสอบถามเกี่ยวกับการรับสมัคร สามารถติดต่อได้ทางใด?',
        answer: 'สามารถติดต่อฝ่ายวิชาการ สำนักงานคณบดี คณะสังคมศาสตร์ โทร. 053-776-000 หรือสอบถามผ่านกล่องข้อความ Facebook Page คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ได้ในวันและเวลาราชการ',
    },
];

export default function FinancialAidAndFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">
                    การสนับสนุนและคำถามพบบ่อย
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] font-heading mt-1">
                    ทุนการศึกษาและการสนับสนุนผู้เรียน
                </h2>
            </div>

            {/* Financial Aid Highlights (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Coins className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-[#0B132B] text-base font-heading">
                        สิทธิ์กู้ยืมกองทุน กยศ.
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        รองรับการยื่นกู้ยืมค่าเล่าเรียนและค่าครองชีพรายเดือน ตามหลักเกณฑ์และเงื่อนไขที่กองทุนกำหนด
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                        <Award className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-[#0B132B] text-base font-heading">
                        ทุนการศึกษาคณะสังคมศาสตร์
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        ทุนช่วยเหลือการศึกษาสำหรับนักศึกษาขาดแคลนทุนทรัพย์ ทุนเรียนดี และทุนกิจกรรมสร้างชื่อเสียง
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
                        <HeartHandshake className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-[#0B132B] text-base font-heading">
                        ทุนทำงานพิเศษระหว่างเรียน
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        เปิดโอกาสให้นักศึกษาปฏิบัติงานช่วยเหลืองานวิชาการและการบริการของคณะ เพื่อเสริมรายได้พิเศษ
                    </p>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <HelpCircle className="w-5 h-5 text-[#C2410C]" strokeWidth={1.75} />
                    <h3 className="text-base sm:text-lg font-bold text-[#0B132B] font-heading">
                        คำถามที่พบบ่อยเกี่ยวกับการรับสมัคร (FAQ)
                    </h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {FAQS.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div key={idx} className="py-3">
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between text-left gap-4 py-1 text-sm font-bold text-[#0B132B] hover:text-[#C2410C] transition-colors cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                                            isOpen ? 'rotate-180 text-[#C2410C]' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="pt-2 pb-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
