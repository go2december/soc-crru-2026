'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Send, CheckCircle2, FileText, Lock, ShieldCheck, RotateCcw } from 'lucide-react';
import { Staff, getFullName } from '@/lib/staff';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    staff: Staff;
}

export default function RequestResumeModal({ isOpen, onClose, staff }: RequestResumeModalProps) {
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [purpose, setPurpose] = useState('SPEAKER');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [error, setError] = useState('');

    // Anti-Bot & Human Verification states
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [renderedTime, setRenderedTime] = useState(0);

    const fetchCaptcha = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/staff/captcha-challenge`);
            if (res.ok) {
                const data = await res.json();
                setCaptchaQuestion(data.question);
                setCaptchaToken(data.token);
            }
        } catch {
            setCaptchaQuestion('5 + 4');
            setCaptchaToken('');
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setRenderedTime(Date.now());
            fetchCaptcha();
        }
    }, [isOpen, fetchCaptcha]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !organization.trim() || !email.trim()) {
            setError('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
            return;
        }

        if (!captchaAnswer.trim()) {
            setError('กรุณาตอบคำถามยืนยันความปลอดภัยเพื่อป้องกันสแปม');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const res = await fetch(`${API_URL}/api/staff/resume-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId: staff.id,
                    requesterName: name.trim(),
                    organization: organization.trim(),
                    email: email.trim(),
                    phone: phone.trim() || undefined,
                    purpose,
                    notes: notes.trim() || undefined,
                    captchaToken,
                    captchaAnswer: captchaAnswer.trim(),
                    honeypot: honeypot.trim() || undefined,
                    renderedTime,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'เกิดข้อผิดพลาดในการส่งคำขอ');
            }

            const data = await res.json();
            setRequestId(data.requestId || '');
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่อีกครั้ง');
            fetchCaptcha();
            setCaptchaAnswer('');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetAndClose = () => {
        setSubmitted(false);
        setRequestId('');
        setName('');
        setOrganization('');
        setEmail('');
        setPhone('');
        setPurpose('SPEAKER');
        setNotes('');
        setCaptchaAnswer('');
        setHoneypot('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-5 bg-scholar-deep text-white flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-scholar-accent/20 rounded-lg text-scholar-accent border border-scholar-accent/30">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-scholar-accent block">
                                ระบบขอเอกสารทางการ / Official Request
                            </span>
                            <h3 className="text-base font-bold text-white">
                                ขอเอกสารประวัติ / ประวัติวิทยากร (Resume & Bio)
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={handleResetAndClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="ปิด"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                    {submitted ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">
                                บันทึกคำขอเอกสารประวัติเรียบร้อยแล้ว
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                                ระบบได้ส่งต่อคำขอเอกสารประวัติของ <strong className="text-slate-800">{getFullName(staff)}</strong> ไปยังสำนักงานคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เรียบร้อยแล้ว
                            </p>
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 text-left space-y-1.5">
                                <p><span className="font-semibold text-slate-600">ผู้ขอ:</span> {name} ({organization})</p>
                                <p><span className="font-semibold text-slate-600">อีเมลจัดส่ง:</span> <span className="font-mono text-scholar-accent font-bold">{email}</span></p>
                                {requestId && (
                                    <p><span className="font-semibold text-slate-600">รหัสคำร้อง:</span> <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">{requestId}</code></p>
                                )}
                                <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                                    <span className="font-bold block mb-0.5">⏱️ ระยะเวลาดำเนินการตามระเบียบ:</span>
                                    เจ้าหน้าที่และคณะฯ จะทำการตรวจสอบความถูกต้องและจัดส่งเอกสารให้ <strong>ไม่เกิน 7 วันหลังจากได้รับการร้องขอเอกสาร</strong>
                                </div>
                            </div>
                            <button
                                onClick={handleResetAndClose}
                                className="w-full py-2.5 bg-scholar-deep text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                            >
                                ตกลงและปิดหน้าต่าง
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Target Staff Notice */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-xs font-semibold text-slate-900 leading-tight">{getFullName(staff)}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">{staff.academicPosition || staff.adminPosition || 'อาจารย์ประจำคณะสังคมศาสตร์'} • {staff.department || 'คณะสังคมศาสตร์'}</p>
                            </div>

                            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-800 leading-snug">
                                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>ตามระเบียบของคณะฯ และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เอกสารประวัติและเรซูเม่อย่างเป็นทางการจะถูกจัดส่งให้เฉพาะหน่วยงานที่ยื่นคำขอและมีวัตถุประสงค์ชัดเจน โดยคณะฯ จะทำการตรวจสอบและ<strong>ทำการส่งเอกสารให้ ไม่เกิน 7 วันหลังจากได้รับการร้องขอเอกสาร</strong></span>
                            </div>

                            {error && (
                                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                                    {error}
                                </p>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    ชื่อ-นามสกุล ผู้ขอ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น นายสมคิด จิตมั่นคง"
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    หน่วยงาน / องค์กรที่สังกัด <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น สำนักงานสาธารณสุขจังหวัดเชียงราย / เทศบาลนครเชียงราย"
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        อีเมลสำหรับรับเอกสาร <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@organization.go.th"
                                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent font-mono"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        เบอร์โทรศัพท์ติดต่อ
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="081-xxx-xxxx"
                                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    วัตถุประสงค์ในการขอรับเอกสาร <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent bg-white"
                                >
                                    <option value="SPEAKER">เทียบเชิญเป็นวิทยากร / ผู้ทรงคุณวุฒิบรรยาย</option>
                                    <option value="QA_AUDIT">ประกอบการตรวจประเมินคุณภาพการศึกษา (AUN-QA / สมศ.)</option>
                                    <option value="COLLABORATION">โครงการความร่วมมือทางวิชาการและการวิจัย (MoU)</option>
                                    <option value="STUDENT_ADVISOR">ติดต่อเป็นอาจารย์ที่ปรึกษา / กรรมการสอบ</option>
                                    <option value="OTHER">อื่นๆ (โปรดระบุในช่องรายละเอียดเพิ่มเติม)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    รายละเอียดโครงการ / วันที่จัดงาน (ถ้ามี)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="เช่น โครงการอบรมสัมมนา วันที่ 20 พ.ย. 2569 ณ..."
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* Anti-Bot Human Verification Box */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <span>การตรวจสอบความปลอดภัย (Human Verification)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchCaptcha}
                                        className="text-[11px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 hover:underline cursor-pointer"
                                        title="เปลี่ยนคำถามใหม่"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>เปลี่ยนคำถาม</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600 font-medium">
                                        กรุณาตอบคำถาม:
                                    </span>
                                    <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs shadow-2xs">
                                        {captchaQuestion || '...'} = ?
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        placeholder="คำตอบตัวเลข"
                                        className="w-28 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent font-mono text-center font-bold"
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">
                                    ระบบตรวจสอบเพื่อป้องกันการส่งสแปมหรือคำขออัตโนมัติจาก Bot
                                </p>
                            </div>

                            {/* Invisible Honeypot field for bot trapping */}
                            <div className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden" aria-hidden="true">
                                <label htmlFor="hp_contact_url">Leave this empty</label>
                                <input
                                    id="hp_contact_url"
                                    type="text"
                                    name="hp_contact_url"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={handleResetAndClose}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-scholar-deep hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{submitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอรับเอกสาร'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
