'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload, X, Plus, ImagePlus, Video, Link2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useChiangRaiAdmin } from '../../context';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';

// ... (existing code: generateSlug function)

export default function CreateArticlePage() {
    const router = useRouter();
    const { user } = useChiangRaiAdmin();
    const [loading, setLoading] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const uploadedImagesRef = useRef<Set<string>>(new Set());
    const prevContentRef = useRef<string>('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'ACADEMIC', // Default
        abstract: '',
        content: '',
        author: '',
        thumbnailUrl: '',
        tags: [] as string[],
        isPublished: true,
        mediaUrls: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');
    const [autoSlug, setAutoSlug] = useState(true);
    const [externalLinkInput, setExternalLinkInput] = useState('');

    // ... (existing code: useEffect user, resizeImage, deleteImageFromServer, extractImageUrls, quillModules, quillFormats, uploadImage helper)

    // ... (existing code: handleTitleChange, handleSlugChange, handleThumbnailUpload)

    // Media images upload handler (multiple)
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingMedia(true);
        const newUrls: string[] = [];

        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) newUrls.push(url);
        }

        if (newUrls.length > 0) {
            setFormData(prev => ({
                ...prev,
                mediaUrls: [...prev.mediaUrls, ...newUrls]
            }));
        }
        setUploadingMedia(false);
        if (mediaInputRef.current) mediaInputRef.current.value = '';
    };

    // ... (existing code: Tags logic)

    // ... (existing code: External link logic, removeMediaUrl, getMediaType)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.slug.trim()) {
            alert('กรุณากรอกชื่อบทความและ Slug');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.length > 0 ? formData.tags : null,
                abstract: formData.abstract || null,
                thumbnailUrl: formData.thumbnailUrl || null,
                author: formData.author || null,
                publishedAt: formData.isPublished ? new Date().toISOString() : null,
                // Ensure mediaUrls are sent correctly
                mediaUrls: formData.mediaUrls.length > 0 ? formData.mediaUrls : [],
                mediaType: formData.mediaUrls.length > 0 ? 'IMAGE' : 'IMAGE', // Default to IMAGE for mixed content
            };

            const res = await fetch(`${API_URL}/api/chiang-rai/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            // ... (rest of handleSubmit)
        } catch (error) {
            // ... (error handling)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 font-kanit">
            {/* ... (Header) */}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Info with Category */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">ข้อมูลพื้นฐาน</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อบทความ (Title) *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="ชื่อบทความวิชาการ"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">หมวดหมู่ (Category)</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="ACADEMIC">บทความวิชาการ (Academic Article)</option>
                                <option value="RESEARCH">งานวิจัย (Research)</option>
                            </select>
                        </div>

                        {/* ... (Slug, Author inputs) */}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1">บทคัดย่อ (Abstract)</label>
                            {/* ... (TextArea) */}
                        </div>
                    </div>
                </div>

                {/* ... (Section 2: Tags - No change) */}
                {/* ... (Section 3: Thumbnail - Ensure Preview URL is correct) */}
                {/* ... (Section 4: Content - No change) */}

                {/* Section 5: Media Gallery (Improved) */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">สื่อประกอบ (Media)</h2>

                    <input
                        ref={mediaInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMediaUpload}
                        className="hidden"
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => mediaInputRef.current?.click()}
                            disabled={uploadingMedia}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium border border-purple-200"
                        >
                            {uploadingMedia ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
                            อัปโหลดรูปภาพ
                        </button>
                    </div>

                    {/* External Link Input */}
                    <div className="flex gap-2">
                        {/* ... (Link Input) */}
                    </div>

                    {/* Media Grid - Fix Preview URL */}
                    {formData.mediaUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                            {formData.mediaUrls.map((url, index) => {
                                const type = getMediaType(url);
                                return (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                        {type === 'image' ? (
                                            <img
                                                src={url.startsWith('/') ? `${API_URL}${url}` : url}
                                                alt={`Media ${index + 1}`}
                                                className="w-full h-28 object-cover"
                                            />
                                        ) : type === 'video' ? (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                                                <Video size={28} className="text-red-500 mb-1" />
                                                <span className="text-[10px] text-red-600 font-medium">Video</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                                                <Link2 size={28} className="text-blue-500 mb-1" />
                                                <span className="text-[10px] text-blue-600 font-medium">External Link</span>
                                            </div>
                                        )}
                                        {/* ... (Remove button) */}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* ... (Empty State) */}
                </div>
                {/* ... (Actions) */}
            </form>
            {/* ... (Styles) */}
        </div>
    );
}
