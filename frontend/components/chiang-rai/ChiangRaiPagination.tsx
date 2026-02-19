'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ChiangRaiPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const showEllipsisStart = currentPage > 3;
        const showEllipsisEnd = currentPage < totalPages - 2;

        if (totalPages <= 7) {
            // Show all pages if total pages are 7 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (showEllipsisStart) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (showEllipsisEnd) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-purple-300">
                        <MoreHorizontal size={16} />
                    </span>
                );
            }

            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page as number)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center
                        ${currentPage === page
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                            : 'text-purple-600 hover:bg-purple-100 hover:scale-105'
                        }
                    `}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="flex justify-center items-center gap-2 py-12 animate-fade-in">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-purple-100 bg-white hover:bg-purple-50 text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-50">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-purple-100 bg-white hover:bg-purple-50 text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
