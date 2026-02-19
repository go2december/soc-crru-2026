'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, Expand } from 'lucide-react';

interface ImageLightboxProps {
    images: string[];
}

export default function ImageLightbox({ images }: ImageLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
    const touchStartX = useRef<number | null>(null);
    const thumbStripRef = useRef<HTMLDivElement>(null);

    const open = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    const goTo = useCallback((newIndex: number, dir: 'left' | 'right') => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSlideDir(dir);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setSlideDir(null);
            setIsAnimating(false);
        }, 180);
    }, [isAnimating]);

    const prev = useCallback(() => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        goTo(newIndex, 'right');
    }, [currentIndex, images.length, goTo]);

    const next = useCallback(() => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        goTo(newIndex, 'left');
    }, [currentIndex, images.length, goTo]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, prev, next]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Auto-scroll thumbnail strip to active thumb
    useEffect(() => {
        if (!thumbStripRef.current) return;
        const activeThumb = thumbStripRef.current.children[currentIndex] as HTMLElement;
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [currentIndex]);

    // Progress bar width
    const progress = images.length > 1 ? ((currentIndex + 1) / images.length) * 100 : 100;

    return (
        <>
            {/* ─── Gallery Grid ─── */}
            {images.length === 1 ? (
                <div className="lb-card rounded-2xl overflow-hidden cursor-pointer group relative w-full h-[500px]" onClick={() => open(0)}>
                    <Image
                        src={images[0]}
                        alt="Gallery"
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-100 scale-75 backdrop-blur-sm bg-white/5">
                            <Expand size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            ) : images.length === 2 ? (
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                    {images.map((url, i) => (
                        <div key={i} className="lb-card rounded-2xl overflow-hidden group relative aspect-[4/3] cursor-pointer" onClick={() => open(i)}>
                            <Image
                                src={url}
                                alt={`Gallery ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                                sizes="(max-width: 768px) 50vw, 400px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                <span className="text-white/90 text-[11px] font-mono tracking-wider">{String(i + 1).padStart(2, '0')}</span>
                                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm bg-white/5">
                                    <Expand size={14} className="text-white/80" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                    {images.map((url, i) => (
                        <div
                            key={i}
                            className={`lb-card rounded-2xl overflow-hidden group relative cursor-pointer ${i === 0 && images.length >= 3 ? 'md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[360px]' : 'h-44 md:h-56'}`}
                            onClick={() => open(i)}
                        >
                            <Image
                                src={url}
                                alt={`Gallery ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                                sizes={i === 0 && images.length >= 3 ? "(max-width: 768px) 100vw, 600px" : "(max-width: 768px) 50vw, 300px"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                <span className="text-white/90 text-[10px] md:text-[11px] font-mono tracking-wider">{String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm bg-white/5">
                                    <Expand size={12} className="text-white/80 md:hidden" />
                                    <Expand size={14} className="text-white/80 hidden md:block" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Lightbox Overlay ─── */}
            {
                isOpen && (
                    <div
                        className="fixed inset-0 z-[100] lb-overlay"
                        onClick={close}
                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            if (touchStartX.current === null) return;
                            const diff = e.changedTouches[0].clientX - touchStartX.current;
                            if (Math.abs(diff) > 50) { diff > 0 ? prev() : next(); }
                            touchStartX.current = null;
                        }}
                    >
                        {/* Ambient background blur from current image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={images[currentIndex]}
                                alt=""
                                className="w-full h-full object-cover blur-[80px] scale-125 opacity-[0.15]"
                            />
                            <div className="absolute inset-0 bg-[#0a0a0f]/90" />
                        </div>

                        {/* ── Top chrome ── */}
                        <div className="absolute top-0 left-0 right-0 z-[120] safe-top">
                            {/* Progress bar */}
                            {images.length > 1 && (
                                <div className="h-[2px] bg-white/[0.06]">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5">
                                {/* Counter */}
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-white font-mono text-sm md:text-base font-semibold tracking-tight">
                                        {String(currentIndex + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-white/20 font-mono text-xs">/</span>
                                    <span className="text-white/40 font-mono text-xs md:text-sm">
                                        {String(images.length).padStart(2, '0')}
                                    </span>
                                </div>
                                {/* Close */}
                                <button
                                    onClick={close}
                                    className="group/close w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                                >
                                    <X size={18} className="group-hover/close:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* ── Navigation arrows ── */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev(); }}
                                    className="absolute left-2 md:left-5 lg:left-8 top-1/2 -translate-y-1/2 z-[120] group/nav"
                                >
                                    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                        <ChevronLeft size={20} className="md:hidden group-hover/nav:-translate-x-0.5 transition-transform" />
                                        <ChevronLeft size={24} className="hidden md:block group-hover/nav:-translate-x-0.5 transition-transform" />
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); next(); }}
                                    className="absolute right-2 md:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-[120] group/nav"
                                >
                                    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                        <ChevronRight size={20} className="md:hidden group-hover/nav:translate-x-0.5 transition-transform" />
                                        <ChevronRight size={24} className="hidden md:block group-hover/nav:translate-x-0.5 transition-transform" />
                                    </div>
                                </button>
                            </>
                        )}

                        {/* ── Main image ── */}
                        <div
                            className="absolute inset-0 flex items-center justify-center px-2 pt-12 pb-2 md:px-8 md:pt-14 md:pb-4 lg:px-12 z-[110]"
                            style={{ paddingBottom: images.length > 1 ? 'calc(env(safe-area-inset-bottom, 0px) + 90px)' : 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`relative w-full h-full flex items-center justify-center lb-image-wrapper ${slideDir === 'left' ? 'lb-slide-left' : slideDir === 'right' ? 'lb-slide-right' : 'lb-slide-in'}`}>
                                <img
                                    key={currentIndex}
                                    src={images[currentIndex]}
                                    alt={`Gallery ${currentIndex + 1}`}
                                    className="max-w-full max-h-[95vh] w-auto h-auto object-contain select-none rounded-sm md:rounded shadow-2xl"
                                    style={{
                                        filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
                                        maxHeight: '95%' // Enforce 95% height of container (which accounts for thumbnails)
                                    }}
                                    draggable={false}
                                />
                            </div>
                        </div>

                        {/* ── Filmstrip thumbnails ── */}
                        {images.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 z-[120] safe-bottom">
                                <div className="flex justify-center px-4 pb-3 md:pb-5">
                                    <div
                                        ref={thumbStripRef}
                                        className="flex gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.06] max-w-[94vw] md:max-w-[80vw] overflow-x-auto lb-no-scrollbar"
                                    >
                                        {images.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (i === currentIndex) return;
                                                    goTo(i, i > currentIndex ? 'left' : 'right');
                                                }}
                                                className={`shrink-0 rounded-md md:rounded-lg overflow-hidden transition-all duration-300 relative
                                                ${i === currentIndex
                                                        ? 'w-14 h-10 md:w-[72px] md:h-[52px] ring-2 ring-orange-400/80 ring-offset-1 ring-offset-black/50 scale-105 md:scale-110'
                                                        : 'w-11 h-8 md:w-14 md:h-10 opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
                                                    }`}
                                            >
                                                <Image
                                                    src={url}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="100px"
                                                />
                                                {i === currentIndex && (
                                                    <div className="absolute inset-0 border border-white/20 rounded-md md:rounded-lg" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            <style jsx global>{`
                /* Grid card shadow */
                .lb-card {
                    box-shadow: 0 2px 16px -4px rgba(46, 16, 101, 0.08), 0 0 0 1px rgba(139, 92, 246, 0.06);
                    transition: box-shadow 0.5s ease, transform 0.5s ease;
                }
                .lb-card:hover {
                    box-shadow: 0 12px 40px -8px rgba(46, 16, 101, 0.18), 0 0 0 1px rgba(139, 92, 246, 0.12);
                }

                /* Overlay entrance */
                .lb-overlay {
                    animation: lb-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes lb-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Image slide transitions */
                .lb-slide-in {
                    animation: lb-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes lb-scale-in {
                    from { opacity: 0; transform: scale(0.96); }
                    to { opacity: 1; transform: scale(1); }
                }
                .lb-slide-left {
                    animation: lb-out-left 0.18s ease-in forwards;
                }
                @keyframes lb-out-left {
                    to { opacity: 0; transform: translateX(-24px) scale(0.98); }
                }
                .lb-slide-right {
                    animation: lb-out-right 0.18s ease-in forwards;
                }
                @keyframes lb-out-right {
                    to { opacity: 0; transform: translateX(24px) scale(0.98); }
                }

                /* Scrollbar hide */
                .lb-no-scrollbar::-webkit-scrollbar { display: none; }
                .lb-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                /* Safe area padding */
                .safe-top { padding-top: env(safe-area-inset-top, 0px); }
                .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
            `}</style>
        </>
    );
}
