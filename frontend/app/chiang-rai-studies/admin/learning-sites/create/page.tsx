'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, ImagePlus, Video, Link2, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useChiangRaiAdmin } from '../../context';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const categoryOptions = [
    { value: 'CULTURAL_SITE', label: 'แหล่งเรียนรู้ทางวัฒนธรรม' },
    { value: 'MUSEUM', label: 'พิพิธภัณฑ์' },
    { value: 'TEMPLE', label: 'วัด' },
    { value: 'HISTORICAL_SITE', label: 'โบราณสถาน' },
    { value: 'COMMUNITY', label: 'ชุมชน' },
    { value: 'WISDOM_CENTER', label: 'ศูนย์ภูมิปัญญา' },
    { value: 'ART_SPACE', label: 'พื้นที่ศิลปะ' },
];

function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, '').replace(/\s+/g, '-').trim();
}

export default function CreateLearningSitePage() {
    const router = useRouter();
    const { user } = useChiangRaiAdmin();
    const [loading, setLoading] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        author: '',
        thumbnailUrl: '',
        tags: [] as string[],
        isPublished: true,
        mediaUrls: [] as string[],
        externalLinks: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');
    const [autoSlug, setAutoSlug] = useState(true);
    const [externalLinkInput, setExternalLinkInput] = useState('');

    const getMediaType = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo')) return 'video';
        if (url.startsWith('http') && !url.includes('youtube') && !url.includes('vimeo')) return 'link';
        return 'image';
    };

    const handleAddExternalLink = () => {
        if (externalLinkInput.trim() && !formData.externalLinks.includes(externalLinkInput.trim())) {
            setFormData(prev => ({ ...prev, externalLinks: [...prev.externalLinks, externalLinkInput.trim()] }));
            setExternalLinkInput('');
        }
    };

    const handleRemoveExternalLink = (index: number) => {
        setFormData(prev => ({ ...prev, externalLinks: prev.externalLinks.filter((_, i) => i !== index) }));
    };

    useEffect(() => {
        if (!user) return;
    }, [user]);

    const uploadImage = async (file: File): Promise<string | null> => {
        const uploadForm = new FormData();
        uploadForm.append('file', file);
        try {
            const res = await fetch(`${API_URL}/api/upload/chiang-rai`, { method: 'POST', body: uploadForm });
            if (res.ok) {
                const data = await res.json();
                return data.url || data.path;
            }
            return null;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

    const handleTitleChange = (value: string) => {
        setFormData(prev => ({ ...prev, title: value, ...(autoSlug ? { slug: generateSlug(value) } : {}) }));
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingThumbnail(true);
        const url = await uploadImage(file);
        if (url) setFormData(prev => ({ ...prev, thumbnailUrl: url }));
        setUploadingThumbnail(false);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadingMedia(true);
        const newUrls: string[] = [];
        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) newUrls.push(url);
        }
        if (newUrls.length > 0) setFormData(prev => ({ ...prev, mediaUrls: [...prev.mediaUrls, ...newUrls] }));
        setUploadingMedia(false);
        if (mediaInputRef.current) mediaInputRef.current.value = '';
    };

    const handleRemoveMedia = (index: number) => {
        setFormData(prev => ({ ...prev, mediaUrls: prev.mediaUrls.filter((_, i) => i !== index) }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.slug.trim()) {
            alert('กรุณากรอกชื่อและ Slug');
            return;
        }
        setLoading(true);
        try {
            const allMediaUrls = [...formData.mediaUrls, ...formData.externalLinks];
            const payload = {
                ...formData,
                tags: formData.tags.length > 0 ? formData.tags : null,
                thumbnailUrl: formData.thumbnailUrl || null,
                description: formData.description || null,
                author: formData.author || user?.name || 'ศูนย์เชียงรายศึกษา',
                publishedAt: formData.isPublished ? new Date().toISOString() : null,
                mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : [],
                mediaType: allMediaUrls.length > 0 ? 'IMAGE' : 'IMAGE',
            };
            const res = await fetch(`${API_URL}/api/chiang-rai/learning-sites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                alert('บันทึกแหล่งเรียนรู้สำเร็จ');
                router.push('/chiang-rai-studies/admin/learning-sites');
            } else {
                const error = await res.json();
                alert(`เกิดข้อผิดพลาด: ${error.message}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };

    const quillFormats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'color', 'background', 'link', 'image', 'video'];

    return (
        <div className="space-y-6 font-kanit">
            <div className="flex items-center gap-4">
                <button type="button" onClick={() => router.back()} className="p-2 hover:bg-stone-100 rounded-lg transition">
                    <ArrowLeft size={20} className="text-stone-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">เพิ่มแหล่งเรียนรู้ใหม่</h1>
                    <p className="text-stone-500 text-sm">Add New Cultural Learning Site</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">ข้อมูลพื้นฐาน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อเรื่อง (Title) *</label>
                            <input type="text" required value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="ชื่อแหล่งเรียนรู้" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
                            <div className="flex gap-2">
                                <input type="text" required value={formData.slug} onChange={(e) => { setFormData(prev => ({ ...prev, slug: e.target.value })); setAutoSlug(false); }} className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="slug-url" />
                                <button type="button" onClick={() => setAutoSlug(!autoSlug)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${autoSlug ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>Auto</button>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1">บทคัดย่อ (Description)</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="คำอธิบายสั้นๆ" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1">ผู้เขียน (Author)</label>
                            <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={user?.name || 'ศูนย์เชียงรายศึกษา'} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">แท็ก (Tags)</h2>
                    <div className="flex gap-2">
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="เพิ่มแท็ก" />
                        <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"><Plus size={16} /> เพิ่ม</button>
                    </div>
                    {formData.tags.length > 0 && (<div className="flex flex-wrap gap-2">{formData.tags.map(tag => (<span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-100">#{tag}<button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition"><X size={14} /></button></span>))}</div>)}
                </div>

                {/* Section 3: Thumbnail */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">รูปภาพปก (Thumbnail)</h2>
                    <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    <button type="button" onClick={() => thumbnailInputRef.current?.click()} disabled={uploadingThumbnail} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition border border-purple-200">
                        {uploadingThumbnail ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
                        {formData.thumbnailUrl ? 'เปลี่ยนรูปภาพปก' : 'อัปโหลดรูปภาพปก'}
                    </button>
                    {formData.thumbnailUrl && (
                        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src={formData.thumbnailUrl.startsWith('/') ? `${API_URL}${formData.thumbnailUrl}` : formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"><X size={14} /></button>
                        </div>
                    )}
                </div>

                {/* Section 4: Content */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">เนื้อหา (Content)</h2>
                    <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData(prev => ({ ...prev, content }))} modules={quillModules} formats={quillFormats} className="bg-white" placeholder="เนื้อหาเกี่ยวกับแหล่งเรียนรู้..." style={{ minHeight: '200px' }} />
                </div>

                {/* Section 5: Media Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">สื่อประกอบ (Media)</h2>
                    <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} className="hidden" />
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => mediaInputRef.current?.click()} disabled={uploadingMedia} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition border border-purple-200">
                            {uploadingMedia ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
                            อัปโหลดรูปภาพ/วิดีโอ
                        </button>
                    </div>

                    {/* External Link Input */}
                    <div className="flex gap-2 mt-4">
                        <input
                            type="url"
                            value={externalLinkInput}
                            onChange={(e) => setExternalLinkInput(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddExternalLink(); } }}
                            placeholder="เพิ่มลิงก์ภายนอก (YouTube, Vimeo, Website)"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddExternalLink}
                            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition flex items-center gap-2"
                        >
                            <Link2 size={16} /> เพิ่มลิงก์
                        </button>
                    </div>

                    {/* Media Grid */}
                    {formData.mediaUrls.length > 0 || formData.externalLinks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                            {[...formData.mediaUrls.map(url => ({ url, type: 'upload' as const })), ...formData.externalLinks.map(url => ({ url, type: 'link' as const }))].map((item, index) => {
                                const mediaType = getMediaType(item.url);
                                return (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                        {mediaType === 'video' ? (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                                                <Video size={28} className="text-red-500 mb-1" />
                                                <span className="text-[10px] text-red-600 font-medium">Video</span>
                                            </div>
                                        ) : mediaType === 'link' || item.type === 'link' ? (
                                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                                                <Link2 size={28} className="text-blue-500 mb-1" />
                                                <span className="text-[10px] text-blue-600 font-medium">Link</span>
                                            </div>
                                        ) : (
                                            <img src={item.url.startsWith('/') ? `${API_URL}${item.url}` : item.url} alt={`Media ${index + 1}`} className="w-full h-28 object-cover" />
                                        )}
                                        <button type="button" onClick={() => {
                                            if (item.type === 'link') handleRemoveExternalLink(formData.externalLinks.indexOf(item.url));
                                            else handleRemoveMedia(formData.mediaUrls.indexOf(item.url));
                                        }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X size={12} /></button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">ยังไม่มีสื่อประกอบ</div>
                    )}
                </div>

                {/* Section 6: Publishing Options */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-2">ตัวเลือกการเผยแพร่</h2>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer hover:bg-purple-50 transition">
                        <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                        <span className="text-sm font-medium text-stone-700">เผยแพร่ทันที</span>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition">ยกเลิก</button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </div>
    );
}
