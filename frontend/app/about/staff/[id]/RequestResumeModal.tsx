'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';
import { Staff, getFullName } from '@/lib/staff';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
}

export default function RequestResumeModal({
  isOpen,
  onClose,
  staff,
}: RequestResumeModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B132B]/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0B132B] via-[#C2410C] to-amber-500" />

        {/* Modal Header (Editorial Lanna) */}
        <div className="p-5 sm:p-6 bg-[#0B132B] text-white flex items-start justify-between relative overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="flex items-center gap-3 relative z-10 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-white/10 rounded-xl text-amber-400 border border-white/15 shadow-2xs shrink-0">
              <FileText className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-amber-400 leading-none mb-1">
                <Sparkles className="size-3 shrink-0" />
                ระบบขอเอกสารทางการ / Official Request
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white font-heading whitespace-nowrap truncate leading-tight">
                ขอเอกสารประวัติ / ประวัติวิทยากร (Resume & Bio)
              </h3>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors relative z-10 shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="size-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="size-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  บันทึกคำขอเอกสารประวัติเรียบร้อยแล้ว
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto mt-1">
                  ระบบได้ส่งต่อคำขอเอกสารประวัติของ{' '}
                  <strong className="text-slate-800 font-bold">
                    {getFullName(staff)}
                  </strong>{' '}
                  ไปยังสำนักงานคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เรียบร้อยแล้ว
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-700 text-left space-y-2">
                <p>
                  <span className="font-semibold text-slate-500">ผู้ขอ:</span>{' '}
                  <span className="font-medium text-slate-900">{name} ({organization})</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-500">อีเมลจัดส่ง:</span>{' '}
                  <span className="font-mono text-[#C2410C] font-bold">{email}</span>
                </p>
                {requestId && (
                  <p>
                    <span className="font-semibold text-slate-500">รหัสคำร้อง:</span>{' '}
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800">
                      {requestId}
                    </code>
                  </p>
                )}
                <div className="text-[11px] text-amber-950 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80 mt-2 leading-relaxed">
                  <span className="font-bold block mb-0.5">⏱️ ระยะเวลาดำเนินการตามระเบียบ:</span>
                  เจ้าหน้าที่และคณะฯ จะทำการตรวจสอบความถูกต้องและจัดส่งเอกสารให้{' '}
                  <strong>ไม่เกิน 7 วันทำการหลังจากได้รับการร้องขอเอกสาร</strong>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 bg-[#0B132B] hover:bg-[#C2410C] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                ตกลงและปิดหน้าต่าง
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Staff Notice Banner */}
              <div className="p-3.5 bg-gradient-to-r from-slate-50 to-orange-50/20 border border-slate-200/90 rounded-xl flex items-center gap-3">
                <div className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0 shadow-2xs">
                  <User className="size-5 text-[#0B132B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                    {getFullName(staff)}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {staff.academicPosition || staff.adminPosition || 'อาจารย์ประจำคณะสังคมศาสตร์'} •{' '}
                    {staff.department || 'คณะสังคมศาสตร์'}
                  </p>
                </div>
              </div>

              {/* PDPA Notice */}
              <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-950 leading-relaxed">
                <Lock className="size-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  ตามระเบียบของคณะฯ และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เอกสารประวัติและเรซูเม่อย่างเป็นทางการจะถูกจัดส่งให้เฉพาะหน่วยงานที่มีวัตถุประสงค์ชัดเจน โดยคณะฯ จะตรวจสอบและ
                  <strong>จัดส่งเอกสารให้ไม่เกิน 7 วันทำการ</strong>
                </span>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                  {error}
                </p>
              )}

              {/* Form Fields */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ชื่อ-นามสกุล ผู้ขอ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายสมคิด จิตมั่นคง"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors placeholder-slate-400 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  หน่วยงาน / องค์กรที่สังกัด <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สำนักงานสาธารณสุขจังหวัดเชียงราย / เทศบาลนครเชียงราย"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors placeholder-slate-400 font-medium"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อีเมลสำหรับรับเอกสาร <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@organization.go.th"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors font-mono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    เบอร์โทรศัพท์ติดต่อ
                  </label>
                  <input
                    type="tel"
                    placeholder="081-xxx-xxxx"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors placeholder-slate-400 font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  วัตถุประสงค์ในการขอรับเอกสาร <span className="text-red-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors text-slate-700 font-medium"
                >
                  <option value="SPEAKER">เทียบเชิญเป็นวิทยากร / ผู้ทรงคุณวุฒิบรรยาย</option>
                  <option value="QA_AUDIT">ประกอบการตรวจประเมินคุณภาพการศึกษา (AUN-QA / สมศ.)</option>
                  <option value="COLLABORATION">โครงการความร่วมมือทางวิชาการและการวิจัย (MoU)</option>
                  <option value="STUDENT_ADVISOR">ติดต่อเป็นอาจารย์ที่ปรึกษา / กรรมการสอบ</option>
                  <option value="OTHER">อื่นๆ (โปรดระบุในช่องรายละเอียดเพิ่มเติม)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  รายละเอียดโครงการ / วันที่จัดงาน (ถ้ามี)
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น โครงการอบรมสัมมนา วันที่ 20 พ.ย. 2569 ณ..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/10 transition-colors placeholder-slate-400 font-medium"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Anti-Bot Human Verification Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>การตรวจสอบความปลอดภัย (Human Verification)</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                    title="เปลี่ยนคำถามใหม่"
                  >
                    <RotateCcw className="size-3" />
                    <span>เปลี่ยนคำถาม</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-600 font-medium">
                    กรุณาตอบคำถาม:
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-xs shadow-2xs">
                    {captchaQuestion || '...'} = ?
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="คำตอบ"
                    className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/10 font-mono text-center font-bold bg-white"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  ระบบตรวจสอบเพื่อป้องกันการส่งสแปมหรือคำขออัตโนมัติจากบอต
                </p>
              </div>

              {/* Invisible Honeypot field for bot trapping */}
              <div
                className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
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

              {/* Form Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0B132B] to-slate-900 hover:from-[#C2410C] hover:to-orange-700 text-white text-xs font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all disabled:opacity-50"
                >
                  <Send className="size-3.5" />
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
