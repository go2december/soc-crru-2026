'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload, X, Plus, ImagePlus, Video, Link2, User, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useChiangRaiAdmin } from '../../context';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const TYPE_OPTIONS = [
    { value: 'NEWS', label: 'ข่าวสาร (News)', desc: 'ข่าวประชาสัมพันธ์ทั่วไป' },
    { value: 'EVENT', label: 'กิจกรรม (Event)', desc: 'สัมมนา อบรม นิทรรศการ' },
    { value: 'ANNOUNCEMENT', label: 'ประกาศ (Announcement)', desc: 'ประกาศสำคัญ ผลดำเนินงาน' },
];

export default function CreateActivityPage() {
    const router = useRouter();
    const { user } = useChiangRaiAdmin();

    const [saving, setSaving] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const prevContentRef = useRef<string>('');
    const [slugManual, setSlugManual] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'NEWS' as 'NEWS' | 'EVENT' | 'ANNOUNCEMENT',
        description: '',
        content: '',
        author: '',
        thumbnailUrl: '',
        mediaUrls: [] as string[],
        location: '',
        eventDate: '',
        eventEndDate: '',
        tags: [] as string[],
        isPublished: true,
        isFeatured: false,
    });

    const [tagInput, setTagInput] = useState('');
    const [externalLinkInput, setExternalLinkInput] = useState('');

    // Auto-fill author from user context
    useEffect(() => {
        if (user?.name && !formData.author) {
            setFormData(prev => ({ ...prev, author: user.name }));
        }
    }, [user]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugManual && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, slugManual]);

    // Client-side image resize
    const resizeImage = (file: File, maxWidth = 1024): Promise<File> => {
        return new Promise((resolve) => {
            if (!file.type.startsWith('image/')) return resolve(file);
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                if (img.width <= maxWidth) return resolve(file);
                const canvas = document.createElement('canvas');
                const ratio = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = Math.round(img.height * ratio);
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) resolve(new File([blob], file.name, { type: 'image/webp' }));
                    else resolve(file);
                }, 'image/webp', 0.85);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
            img.src = url;
        });
    };

    // Delete image from server
    const deleteImageFromServer = async (imageUrl: string) => {
        if (!imageUrl || !imageUrl.startsWith('/uploads/chiang-rai/')) return;
        const token = localStorage.getItem('admin_token');
        try {
            await fetch(`${API_URL}/api/upload/chiang-rai`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ url: imageUrl }),
            });
        } catch (err) { console.error('Failed to delete image:', err); }
    };

    // Extract image URLs from HTML
    const extractImageUrls = (html: string): string[] => {
        const matches = html.match(/src=["'](\/uploads\/chiang-rai\/[^"']+)["']/g);
        if (!matches) return [];
        return matches.map(m => m.replace(/src=["']/, '').replace(/["']$/, ''));
    };

    // Quill config
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'align',
        'blockquote', 'code-block', 'link', 'image'
    ];

    // Upload image helper
    const uploadImage = async (file: File): Promise<string | null> => {
        const token = localStorage.getItem('admin_token');
        const resized = await resizeImage(file);
        const fd = new FormData();
        fd.append('file', resized);
        try {
            const res = await fetch(`${API_URL}/api/upload/chiang-rai`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            } else {
                const err = await res.json();
                alert(err.message || 'อัปโหลดรูปภาพไม่สำเร็จ');
                return null;
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
            return null;
        }
    };

    // Thumbnail upload
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingThumbnail(true);
        if (formData.thumbnailUrl) await deleteImageFromServer(formData.thumbnailUrl);
        const url = await uploadImage(file);
        if (url) setFormData(prev => ({ ...prev, thumbnailUrl: url }));
        setUploadingThumbnail(false);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    };

    // Media upload (multiple)
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
            setFormData(prev => ({ ...prev, mediaUrls: [...prev.mediaUrls, ...newUrls] }));
        }
        setUploadingMedia(false);
        if (mediaInputRef.current) mediaInputRef.current.value = '';
    };

    // Tags
    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput('');
        }
    };
    const removeTag = (index: number) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
    };
    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    };

    // External link
    const addExternalLink = () => {
        if (externalLinkInput.trim()) {
            setFormData(prev => ({ ...prev, mediaUrls: [...prev.mediaUrls, externalLinkInput.trim()] }));
            setExternalLinkInput('');
        }
    };
    const removeMediaUrl = async (index: number) => {
        const urlToRemove = formData.mediaUrls[index];
        await deleteImageFromServer(urlToRemove);
        setFormData(prev => ({ ...prev, mediaUrls: prev.mediaUrls.filter((_, i) => i !== index) }));
    };

    // Media type detection
    const getMediaType = (url: string) => {
        if (url.match(/youtube\.com|youtu\.be|vimeo\.com/i)) return 'video';
        if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || url.startsWith('/uploads/')) return 'image';
        return 'link';
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.slug.trim()) {
            alert('กรุณากรอกชื่อรายการและ Slug');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.length > 0 ? formData.tags : null,
                description: formData.description || null,
                thumbnailUrl: formData.thumbnailUrl || null,
                author: formData.author || null,
                location: formData.location || null,
                eventDate: formData.eventDate || null,
                eventEndDate: formData.eventEndDate || null,
                mediaUrls: formData.mediaUrls.length > 0 ? formData.mediaUrls : null,
            };

            const res = await fetch(`${API_URL}/api/chiang-rai/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/chiang-rai-studies/admin/activities');
            } else {
                const error = await res.json();
                alert(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Error creating activity:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-kanit">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-4">
                <Link
                    href="/chiang-rai-studies/admin/activities"
                    className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-stone-800">เพิ่มกิจกรรม/ข่าวสาร</h1>
                    <p className="text-xs text-stone-500">Create Activity / News</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">ข้อมูลพื้นฐาน</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อรายการ (Title) *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="ชื่อกิจกรรมหรือข่าวสาร"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Slug (URL) *
                                <button
                                    type="button"
                                    onClick={() => setSlugManual(!slugManual)}
                                    className="ml-2 text-xs text-purple-500 hover:text-purple-700"
                                >
                                    {slugManual ? '🔓 แก้ไขเอง' : '🔒 สร้างอัตโนมัติ'}
                                </button>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => { setSlugManual(true); setFormData({ ...formData, slug: e.target.value }); }}
                                className={`w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm ${!slugManual ? 'bg-stone-50' : ''}`}
                                readOnly={!slugManual}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">ประเภท (Type) *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {TYPE_OPTIONS.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition text-center ${
                                            formData.type === opt.value
                                                ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={opt.value}
                                            checked={formData.type === opt.value}
                                            onChange={() => setFormData({ ...formData, type: opt.value as any })}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-bold text-stone-700">{opt.label}</span>
                                        <span className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                <span className="flex items-center gap-1.5">
                                    <User size={14} className="text-purple-500" />
                                    ผู้เขียน (Author)
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                readOnly
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-purple-50 text-purple-800 font-medium cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">คำอธิบายย่อ (Description)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="คำอธิบายสั้นๆ สำหรับแสดงในรายการ"
                        />
                    </div>
                </div>

                {/* Section 2: Event Details (only for EVENT type) */}
                {formData.type === 'EVENT' && (
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
                        <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                รายละเอียดกิจกรรม
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-500" /> สถานที่</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="เช่น ห้องประชุม อาคาร..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">วันที่เริ่มกิจกรรม</label>
                                <input
                                    type="datetime-local"
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">วันที่สิ้นสุด (ถ้ามี)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.eventEndDate}
                                    onChange={(e) => setFormData({ ...formData, eventEndDate: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 3: Tags & Status */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">คำสำคัญ & สถานะ</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">คำสำคัญ (Tags)</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม"
                                />
                                <button type="button" onClick={addTag} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition text-sm font-medium">เพิ่ม</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-100">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(index)} className="text-purple-400 hover:text-red-500"><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">สถานะการเผยแพร่</label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition flex-1 ${formData.isPublished ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                        <input type="radio" name="isPublished" checked={formData.isPublished} onChange={() => setFormData({ ...formData, isPublished: true })} className="text-emerald-600" />
                                        <span className="font-medium text-stone-700">เผยแพร่แล้ว</span>
                                    </label>
                                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition flex-1 ${!formData.isPublished ? 'border-stone-500 bg-stone-50 ring-1 ring-stone-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                        <input type="radio" name="isPublished" checked={!formData.isPublished} onChange={() => setFormData({ ...formData, isPublished: false })} className="text-stone-600" />
                                        <span className="font-medium text-stone-700">ฉบับร่าง</span>
                                    </label>
                                </div>
                            </div>

                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${formData.isFeatured ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="text-amber-600 rounded"
                                />
                                <div>
                                    <span className="font-medium text-stone-700">⭐ ปักหมุดข่าวสำคัญ (Featured)</span>
                                    <p className="text-xs text-stone-400">แสดงเด่นในหน้าแรก</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Section 4: Thumbnail */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">รูปปก (Thumbnail)</h2>
                    <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />

                    {formData.thumbnailUrl ? (
                        <div className="relative inline-block">
                            <img
                                src={formData.thumbnailUrl.startsWith('/') ? `${API_URL}${formData.thumbnailUrl}` : formData.thumbnailUrl}
                                alt="Thumbnail preview"
                                className="w-48 h-32 object-cover rounded-lg border-2 border-purple-200 shadow-sm"
                            />
                            <button type="button" onClick={async () => { await deleteImageFromServer(formData.thumbnailUrl); setFormData(prev => ({ ...prev, thumbnailUrl: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"><X size={14} /></button>
                            <button type="button" onClick={() => thumbnailInputRef.current?.click()} className="absolute bottom-1 right-1 bg-white/90 text-purple-700 rounded-md px-2 py-0.5 text-[10px] font-medium hover:bg-white shadow-sm">เปลี่ยน</button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => thumbnailInputRef.current?.click()} disabled={uploadingThumbnail} className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-stone-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
                            {uploadingThumbnail ? <Loader2 className="animate-spin text-purple-500" size={24} /> : <><Upload size={24} className="text-stone-400 mb-1" /><span className="text-xs text-stone-500">คลิกเพื่ออัปโหลดรูปปก</span></>}
                        </button>
                    )}
                </div>

                {/* Section 5: Rich Text Content */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">เนื้อหา (Content)</h2>
                    <div className="quill-wrapper">
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={(value: string) => {
                                const prevImages = extractImageUrls(prevContentRef.current);
                                const newImages = extractImageUrls(value);
                                const removedImages = prevImages.filter(img => !newImages.includes(img));
                                removedImages.forEach(img => deleteImageFromServer(img));
                                prevContentRef.current = value;
                                setFormData(prev => ({ ...prev, content: value }));
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="พิมพ์เนื้อหาที่นี่... สามารถจัดรูปแบบ เพิ่มรูปภาพ ลิงก์ ได้"
                            style={{ minHeight: '300px' }}
                        />
                    </div>
                </div>

                {/* Section 6: Media Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">สื่อประกอบ (Media)</h2>
                    <input ref={mediaInputRef} type="file" accept="image/*" multiple onChange={handleMediaUpload} className="hidden" />

                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => mediaInputRef.current?.click()} disabled={uploadingMedia} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium border border-purple-200">
                            {uploadingMedia ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
                            อัปโหลดรูปภาพ
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                value={externalLinkInput}
                                onChange={(e) => setExternalLinkInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalLink())}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="วาง URL วิดีโอ YouTube, ลิงก์สื่อภายนอก..."
                            />
                        </div>
                        <button type="button" onClick={addExternalLink} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium border border-orange-200"><Plus size={18} /></button>
                    </div>

                    {formData.mediaUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                            {formData.mediaUrls.map((url, index) => {
                                const type = getMediaType(url);
                                return (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                        {type === 'image' ? (
                                            <img src={url.startsWith('/') ? `${API_URL}${url}` : url} alt={`Media ${index + 1}`} className="w-full h-28 object-cover" />
                                        ) : type === 'video' ? (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50"><Video size={28} className="text-red-500 mb-1" /><span className="text-[10px] text-red-600 font-medium">Video</span></div>
                                        ) : (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50"><Link2 size={28} className="text-blue-500 mb-1" /><span className="text-[10px] text-blue-600 font-medium">External Link</span></div>
                                        )}
                                        <div className="px-2 py-1.5 bg-white border-t border-stone-100"><p className="text-[10px] text-stone-500 truncate">{url}</p></div>
                                        <button type="button" onClick={() => removeMediaUrl(index)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X size={12} /></button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {formData.mediaUrls.length === 0 && (
                        <p className="text-sm text-stone-400 text-center py-4">ยังไม่มีสื่อประกอบ — อัปโหลดรูปภาพ หรือเพิ่มลิงก์วิดีโอ/สื่อภายนอก</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/chiang-rai-studies/admin/activities" className="px-6 py-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition font-medium">ยกเลิก</Link>
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition shadow-sm disabled:opacity-50 font-medium">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        บันทึกรายการ
                    </button>
                </div>
            </form>

            <style jsx global>{`
                .quill-wrapper .ql-container { min-height: 250px; font-family: var(--font-kanit), sans-serif; font-size: 14px; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
                .quill-wrapper .ql-toolbar { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; background: #faf5ff; border-color: #e7e5e4; }
                .quill-wrapper .ql-container { border-color: #e7e5e4; }
                .quill-wrapper .ql-editor { min-height: 250px; }
                .quill-wrapper .ql-editor.ql-blank::before { font-style: normal; color: #a8a29e; }
            `}</style>
        </div>
    );
}
