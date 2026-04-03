import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function AdminPagination({ currentPage, totalPages, onPageChange }: AdminPaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pages.push(
                <Button key="1" variant="outline" size="icon" onClick={() => onPageChange(1)} className="w-8 h-8">1</Button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis-start" className="px-2 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="icon"
                    onClick={() => onPageChange(i)}
                    className="w-8 h-8"
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis-end" className="px-2 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></span>);
            }
            pages.push(
                <Button key={totalPages} variant="outline" size="icon" onClick={() => onPageChange(totalPages)} className="w-8 h-8">
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
                {renderPageNumbers()}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
