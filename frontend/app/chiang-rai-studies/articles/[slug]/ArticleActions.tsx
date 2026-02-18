'use client';

import { Share2, Printer, Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ArticleActionsProps {
    title: string;
    description?: string;
}

export default function ArticleActions({ title, description }: ArticleActionsProps) {
    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const url = window.location.href;

        // 1. Try Web Share API (Mobile native share)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description || title,
                    url: url,
                });
                return;
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }

        // 2. Fallback: Copy to Clipboard
        try {
            await navigator.clipboard.writeText(url);
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
                title="แชร์บทความ"
            >
                {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                <span className="hidden sm:inline">
                    {copied ? 'คัดลอกแล้ว' : 'แชร์'}
                </span>

                {/* Tooltip for desktop */}
                {!copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                        คัดลอกลิงก์ / แชร์
                    </span>
                )}
            </button>

            <button
                onClick={handlePrint}
                className="flex items-center gap-2 hover:text-[#702963] transition hover:font-bold"
                title="พิมพ์หน้านี้"
            >
                <Printer size={16} />
                <span className="hidden sm:inline">ปริ้นท์</span>
            </button>
        </div>
    );
}
