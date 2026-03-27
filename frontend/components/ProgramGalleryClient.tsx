'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download, Images } from 'lucide-react';

interface ProgramGalleryClientProps {
  galleryImages: string[];
  apiUrl?: string;
}

export default function ProgramGalleryClient({ galleryImages, apiUrl = '' }: ProgramGalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const fullUrls = galleryImages.map(img =>
    img.startsWith('/') ? `${apiUrl}${img}` : img
  );

  const openLightbox = (index: number) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);

  const prevImage = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex(currentIndex === 0 ? fullUrls.length - 1 : currentIndex - 1);
  }, [currentIndex, fullUrls.length]);

  const nextImage = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex(currentIndex === fullUrls.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, fullUrls.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, prevImage, nextImage]);

  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [currentIndex]);

  const downloadImage = async () => {
    if (currentIndex === null) return;
    const url = fullUrls[currentIndex];
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `program-gallery-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  if (!fullUrls || fullUrls.length === 0) return null;

    return (
      <>
        <div className="grid gap-3 grid-cols-2 pt-2">
          {fullUrls.slice(0, 4).map((imageUrl, index) => {
            const isLastBox = index === 3;
            const remainingCount = fullUrls.length - 4;

            return (
              <div
                key={`${imageUrl}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`ภาพประกอบ ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

                {isLastBox && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-scholar-deep/70 flex flex-col items-center justify-center transition-colors hover:bg-scholar-deep/80 pointer-events-none backdrop-blur-[2px]">
                    <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                    <span className="text-white/80 text-xs font-medium mt-1">ดูทั้งหมด</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Lightbox */}
      {currentIndex !== null && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md">
          <div className="flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-6 relative z-10 bg-gradient-to-b from-black/60 to-transparent">
            <span className="text-white/80 font-medium tracking-widest text-sm">
              {currentIndex + 1} / {fullUrls.length}
            </span>
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={downloadImage} className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" title="ดาวน์โหลดภาพ">
                <Download className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button onClick={closeLightbox} className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" title="ปิด (Esc)">
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {fullUrls.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 sm:left-6 z-10 p-2 sm:p-4 rounded-full bg-black/40 hover:bg-black/80 text-white transition-all backdrop-blur-sm cursor-pointer border border-white/10 shadow-lg">
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 sm:right-6 z-10 p-2 sm:p-4 rounded-full bg-black/40 hover:bg-black/80 text-white transition-all backdrop-blur-sm cursor-pointer border border-white/10 shadow-lg">
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </>
            )}
            <div className="relative w-full h-full max-w-6xl max-h-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <Image src={fullUrls[currentIndex]} alt={`รูปภาพลำดับที่ ${currentIndex + 1}`} fill unoptimized className="object-contain" priority />
            </div>
          </div>

          {fullUrls.length > 1 && (
            <div className="h-24 sm:h-32 w-full bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center px-4 pb-4 sm:pb-6 relative z-10">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto max-w-full px-2" style={{ scrollbarWidth: 'none' }}>
                {fullUrls.map((img, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                    className={`relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      currentIndex === idx ? 'border-scholar-accent scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`ภาพย่อ ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
