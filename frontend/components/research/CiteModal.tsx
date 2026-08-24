'use client';

import React, { useState } from 'react';
import { Quote, Copy, Check, Download, X, BookOpen, FileText } from 'lucide-react';

interface CiteModalProps {
    title: string;
    authors?: string[];
    year?: number | string;
    publisher?: string;
    url?: string;
    doi?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
}

export default function CiteModal({
    title,
    authors = [],
    year = new Date().getFullYear(),
    publisher = 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    url = 'https://soc.crru.ac.th',
    doi,
    journal,
    volume,
    issue,
    pages,
}: CiteModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'APA' | 'IEEE' | 'VANCOUVER' | 'BIBTEX'>('APA');
    const [copied, setCopied] = useState(false);

    // Format Author names
    const authorList = authors.length > 0 ? authors : ['คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย'];
    
    // Formatting Helpers
    const formatAuthorsAPA = () => {
        if (authorList.length === 1) return authorList[0];
        if (authorList.length === 2) return `${authorList[0]}, & ${authorList[1]}`;
        return `${authorList[0]}, et al.`;
    };

    const formatAuthorsIEEE = () => {
        if (authorList.length === 1) return authorList[0];
        if (authorList.length === 2) return `${authorList[0]} and ${authorList[1]}`;
        return `${authorList[0]} et al.`;
    };

    const formatAuthorsVancouver = () => {
        return authorList.slice(0, 6).join(', ') + (authorList.length > 6 ? ', et al.' : '');
    };

    // Citations
    const apaCitation = journal
        ? `${formatAuthorsAPA()} (${year}). ${title}. ${journal}${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, ${pages}` : ''}.${doi ? ` https://doi.org/${doi}` : ` ${url}`}`
        : `${formatAuthorsAPA()} (${year}). ${title}. ${publisher}.${doi ? ` https://doi.org/${doi}` : ` ${url}`}`;

    const ieeeCitation = journal
        ? `${formatAuthorsIEEE()}, "${title}," ${journal}${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${pages ? `, pp. ${pages}` : ''}, ${year}.${doi ? ` doi: ${doi}.` : ` [Online]. Available: ${url}`}`
        : `${formatAuthorsIEEE()}, "${title}," ${publisher}, ${year}.${doi ? ` doi: ${doi}.` : ` [Online]. Available: ${url}`}`;

    const vancouverCitation = journal
        ? `${formatAuthorsVancouver()}. ${title}. ${journal}. ${year}${volume ? `;${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `:${pages}` : ''}.${doi ? ` doi: ${doi}` : ` Available from: ${url}`}`
        : `${formatAuthorsVancouver()}. ${title}. เชียงราย: ${publisher}; ${year}.${doi ? ` doi: ${doi}` : ` Available from: ${url}`}`;

    const bibtexCitation = `@article{soc_${String(year)}_${title.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '_')},
  title={${title}},
  author={${authorList.join(' and ')}},
  journal={${journal || publisher}},
  year={${year}},
  url={${url}}${doi ? `,\n  doi={${doi}}` : ''}
}`;

    const getActiveCitation = () => {
        switch (activeTab) {
            case 'APA':
                return apaCitation;
            case 'IEEE':
                return ieeeCitation;
            case 'VANCOUVER':
                return vancouverCitation;
            case 'BIBTEX':
                return bibtexCitation;
            default:
                return apaCitation;
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getActiveCitation());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const handleDownloadRis = () => {
        const risContent = `TY  - JOUR
TI  - ${title}
${authorList.map((a) => `AU  - ${a}`).join('\n')}
PY  - ${year}
PB  - ${publisher}
UR  - ${url}
${doi ? `DO  - ${doi}\n` : ''}${journal ? `JO  - ${journal}\n` : ''}${volume ? `VL  - ${volume}\n` : ''}${issue ? `IS  - ${issue}\n` : ''}${pages ? `SP  - ${pages}\n` : ''}ER  - `;

        const blob = new Blob([risContent], { type: 'application/x-research-info-systems' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `citation-${year}.ris`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    };

    const handleDownloadBib = () => {
        const blob = new Blob([bibtexCitation], { type: 'application/x-bibtex' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `citation-${year}.bib`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-scholar-accent hover:border-scholar-accent/40 shadow-sm hover:shadow transition-all group cursor-pointer"
                title="คัดลอกรูปแบบการอ้างอิงทางวิชาการ (Cite this research)"
            >
                <Quote className="w-3.5 h-3.5 text-scholar-accent transition-transform group-hover:scale-110" />
                <span>อ้างอิงผลงาน (Cite)</span>
            </button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden text-left font-sans animate-scaleUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-scholar-accent/10 rounded-lg text-scholar-accent">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">รูปแบบการอ้างอิง (Cite this Work)</h3>
                                    <p className="text-xs text-slate-500">คัดลอกหรือดาวน์โหลดไฟล์บรรณานุกรมมาตรฐานสากล</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Tabs */}
                            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                                {(['APA', 'IEEE', 'VANCOUVER', 'BIBTEX'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                            activeTab === tab
                                                ? 'bg-white text-scholar-accent shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {tab === 'APA' ? 'APA 7th' : tab}
                                    </button>
                                ))}
                            </div>

                            {/* Citation Content Box */}
                            <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-700 select-all overflow-x-auto min-h-[100px] flex items-center">
                                <p className="whitespace-pre-wrap">{getActiveCitation()}</p>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDownloadRis}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                        title="Download .RIS for EndNote, Zotero, Mendeley"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>.RIS (EndNote)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownloadBib}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                        title="Download .BIB for LaTeX / BibTeX"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>.BIB (BibTeX)</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-sm transition-all ${
                                        copied
                                            ? 'bg-emerald-600'
                                            : 'bg-scholar-deep hover:bg-opacity-95'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>คัดลอกเรียบร้อยแล้ว</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>คัดลอกข้อความ (Copy)</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
