'use client';

import { Share2, Printer, Check } from 'lucide-react';
import { useState } from 'react';

interface SharePrintButtonProps {
    title: string;
    description?: string;
    url?: string; // Optional custom URL
}

export default function SharePrintButton({ title, description, url }: SharePrintButtonProps) {
    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        // 1. Try Web Share API (Mobile native share)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description || title,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                console.log('Error sharing:', err);
                // Continue to fallback if share failed (or cancelled)
            }
        }

        // 2. Fallback: Copy to Clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2s
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('ไม่สามารถคัดลอกลิงก์ได้ กรุณาคัดลอกด้วยตนเอง');
        }
    };

    return (
        <div className="flex items-center gap-6 ml-auto md:ml-0 border-l border-stone-200 pl-6 print:hidden">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-[#702963] transition hover:font-bold relative group"
                title="แชร์หน้านี้"
            >
                {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                <span className="hidden sm:inline">
                    {copied ? 'คัดลอกแล้ว' : 'แชร์'}
                </span>

                {/* Tooltip */}
                {!copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                        คัดลอกลิงก์ / แชร์
                    </span>
                )}
            </button>

            <button
                onClick={handlePrint}
                className="flex items-center gap-2 hover:text-[#702963] transition hover:font-bold group"
                title="พิมพ์หน้านี้"
            >
                <Printer size={16} />
                <span className="hidden sm:inline">ปริ้นท์</span>
            </button>
        </div>
    );
}
