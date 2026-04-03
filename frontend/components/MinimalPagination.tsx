import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MinimalPaginationProps {
    currentPage: number;
    totalPages: number;
    // For Server Component (Link)
    basePath?: string; 
    searchParams?: Record<string, string>;
    // For Client Component (Button)
    onPageChange?: (page: number) => void;
}

export default function MinimalPagination({ 
    currentPage, 
    totalPages, 
    basePath, 
    searchParams = {},
    onPageChange
}: MinimalPaginationProps) {
    if (totalPages <= 1) return null;

    const buildUrl = (pageNumber: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        params.append('page', pageNumber.toString());
        return `${basePath}?${params.toString()}`;
    };

    const renderNav = (direction: 'prev' | 'next', pageNumber: number, disabled: boolean) => {
        const label = direction === 'prev' ? 'ก่อนหน้า' : 'ถัดไป';
        const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
        
        const content = (
            <>
                {direction === 'prev' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 group-hover:border-scholar-accent group-hover:bg-scholar-accent/10 transition-colors">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <span>{label}</span>
                {direction === 'next' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 group-hover:border-scholar-accent group-hover:bg-scholar-accent/10 transition-colors">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </>
        );

        if (disabled) {
            return (
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-400 opacity-40 cursor-not-allowed">
                    {content}
                </div>
            );
        }

        if (onPageChange) {
            return (
                <button
                    onClick={() => onPageChange(pageNumber)}
                    className="group flex items-center space-x-2 text-sm font-medium transition-colors hover:text-scholar-accent text-gray-500"
                >
                    {content}
                </button>
            );
        }

        if (basePath) {
            return (
                <Link
                    href={buildUrl(pageNumber)}
                    className="group flex items-center space-x-2 text-sm font-medium transition-colors hover:text-scholar-accent text-gray-500"
                >
                    {content}
                </Link>
            );
        }

        return null; // Should provide either onPageChange or basePath
    };

    return (
        <div className="flex items-center justify-center space-x-6 py-10">
            {renderNav('prev', currentPage - 1, currentPage <= 1)}
            
            <div className="text-sm font-medium text-gray-500">
                หน้าที่ <span className="text-scholar-deep">{currentPage}</span> จาก {totalPages}
            </div>

            {renderNav('next', currentPage + 1, currentPage >= totalPages)}
        </div>
    );
}
