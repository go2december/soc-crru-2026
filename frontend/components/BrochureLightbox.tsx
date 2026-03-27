'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ExternalLink } from 'lucide-react';

interface BrochureLightboxProps {
    src: string;
    alt?: string;
    apiUrl?: string;
}

export default function BrochureLightbox({ src, alt = 'เอกสารประชาสัมพันธ์', apiUrl = '' }: BrochureLightboxProps) {
    const [open, setOpen] = useState(false);

    const fullUrl = src.startsWith('/') ? `${apiUrl}${src}` : src;

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, close]);

    if (!src) return null;

    return (
        <>
            {/* Thumbnail trigger */}
            <div
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer bg-gray-50"
                onClick={() => setOpen(true)}
            >
                <Image
                    src={fullUrl}
                    alt={alt}
                    width={500}
                    height={650}
                    unoptimized
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-scholar-deep/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                    <span className="bg-white text-scholar-deep px-4 py-1.5 rounded-xl font-bold shadow-lg text-sm">
                        ดูภาพขยาย
                    </span>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md"
                    onClick={close}
                >
                    {/* Top bar */}
                    <div className="flex h-16 w-full items-center justify-between px-5 bg-gradient-to-b from-black/70 to-transparent shrink-0 relative z-10">
                        <span className="text-white/70 text-sm font-medium tracking-wide">
                            {alt}
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                title="เปิดในแท็บใหม่"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                            <button
                                onClick={close}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                title="ปิด (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Image area – stop propagation so clicking image doesn't close */}
                    <div
                        className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full max-w-3xl max-h-full">
                            <Image
                                src={fullUrl}
                                alt={alt}
                                fill
                                unoptimized
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Bottom hint */}
                    <div className="h-12 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent shrink-0">
                        <span className="text-white/40 text-xs">กด ESC หรือคลิกพื้นหลังเพื่อปิด</span>
                    </div>
                </div>
            )}
        </>
    );
}
