'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  ImagePlus,
  Loader2,
  Newspaper,
  Paperclip,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FACULTY_NEWS_CATEGORY_LABELS,
  FacultyNewsAttachment,
  FacultyNewsCategory,
  FacultyNewsItem,
  getFacultyNewsImageUrl,
} from '@/lib/faculty-news';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type NewsFormValues = {
  title: string;
  content: string;
  category: FacultyNewsCategory;
  thumbnailUrl: string;
  mediaUrls: string[];
  attachments: FacultyNewsAttachment[];
  isPublished: boolean;
};

interface NewsFormProps {
  mode: 'create' | 'edit';
  initialData?: FacultyNewsItem | null;
  onSubmit: (data: NewsFormValues) => Promise<void>;
  submitting: boolean;
}

const defaultValues: NewsFormValues = {
  title: '',
  content: '',
  category: 'NEWS',
  thumbnailUrl: '',
  mediaUrls: [],
  attachments: [],
  isPublished: true,
};

export default function NewsForm({ mode, initialData, onSubmit, submitting }: NewsFormProps) {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<NewsFormValues>(() => ({
    ...defaultValues,
    ...(initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          category: initialData.category,
          thumbnailUrl: initialData.thumbnailUrl || '',
          mediaUrls: initialData.mediaUrls || [],
          attachments: initialData.attachments || [],
          isPublished: initialData.isPublished,
        }
      : {}),
  }));
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setValues(defaultValues);
      return;
    }

    setValues({
      title: initialData.title,
      content: initialData.content,
      category: initialData.category,
      thumbnailUrl: initialData.thumbnailUrl || '',
      mediaUrls: initialData.mediaUrls || [],
      attachments: initialData.attachments || [],
      isPublished: initialData.isPublished,
    });
  }, [initialData]);

  const uploadImage = async (file: File) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/api/upload/news`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Upload image failed');
    }

    const data = await res.json();
    return data.url as string;
  };

  const uploadAttachment = async (file: File) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/api/upload/news/attachment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Upload attachment failed');
    }

    return (await res.json()) as FacultyNewsAttachment;
  };

  const deleteManagedFile = async (url: string) => {
    if (!url?.startsWith('/uploads/news/')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`${API_URL}/api/upload/news`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const nextUrl = await uploadImage(file);
      if (values.thumbnailUrl && values.thumbnailUrl !== nextUrl) {
        await deleteManagedFile(values.thumbnailUrl);
      }
      setValues((prev) => ({ ...prev, thumbnailUrl: nextUrl }));
    } catch (error) {
      console.error(error);
      alert('อัปโหลดรูปภาพปกไม่สำเร็จ');
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const uploadedUrl = await uploadImage(file);
        urls.push(uploadedUrl);
      }
      setValues((prev) => ({ ...prev, mediaUrls: [...prev.mediaUrls, ...urls] }));
    } catch (error) {
      console.error(error);
      alert('อัปโหลดรูปภาพเพิ่มเติมไม่สำเร็จ');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploadingAttachment(true);
    try {
      const uploaded: FacultyNewsAttachment[] = [];
      for (const file of Array.from(files)) {
        const attachment = await uploadAttachment(file);
        uploaded.push(attachment);
      }
      setValues((prev) => ({ ...prev, attachments: [...prev.attachments, ...uploaded] }));
    } catch (error) {
      console.error(error);
      alert('อัปโหลดเอกสารแนบไม่สำเร็จ');
    } finally {
      setUploadingAttachment(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const quillFormats = ['header', 'bold', 'italic', 'underline', 'list', 'color', 'background', 'link', 'image'];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Newspaper className="h-7 w-7 text-primary" />
          {mode === 'create' ? 'สร้างข่าวใหม่' : 'แก้ไขข่าวสาร'}
        </h1>
        <p className="text-sm text-muted-foreground">
          จัดการข่าวประชาสัมพันธ์ กิจกรรม ประกาศ และสมัครงาน พร้อมรูปภาพหลายภาพและไฟล์แนบดาวน์โหลด
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="grid gap-5 p-6">
            <div className="space-y-2">
              <Label>หัวข้อข่าว</Label>
              <Input
                required
                value={values.title}
                onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>หมวดหมู่</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={values.category}
                  onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value as FacultyNewsCategory }))}
                >
                  {Object.entries(FACULTY_NEWS_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div className="space-y-1">
                  <Label>สถานะการเผยแพร่</Label>
                  <p className="text-xs text-muted-foreground">เปิดไว้เมื่อพร้อมแสดงบนหน้า public</p>
                </div>
                <input
                  type="checkbox"
                  checked={values.isPublished}
                  onChange={(event) => setValues((prev) => ({ ...prev, isPublished: event.target.checked }))}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label>รูปภาพปก</Label>
                  <p className="text-xs text-muted-foreground">รองรับการอัปโหลดเข้า `/uploads/news` ตาม convention ของโปรเจกต์</p>
                </div>
                <div className="flex gap-2">
                  <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()} disabled={uploadingThumbnail} className="gap-2">
                    {uploadingThumbnail ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    อัปโหลดรูปปก
                  </Button>
                  {values.thumbnailUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={async () => {
                        await deleteManagedFile(values.thumbnailUrl);
                        setValues((prev) => ({ ...prev, thumbnailUrl: '' }));
                      }}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> ลบรูปปก
                    </Button>
                  )}
                </div>
              </div>

              {values.thumbnailUrl ? (
                <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={getFacultyNewsImageUrl(values.thumbnailUrl) || values.thumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  ยังไม่ได้เลือกรูปภาพปก
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label>แกลเลอรีรูปภาพ</Label>
                  <p className="text-xs text-muted-foreground">อัปโหลดได้หลายรูปสำหรับหน้า detail ข่าว</p>
                </div>
                <div className="flex gap-2">
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => galleryInputRef.current?.click()} disabled={uploadingGallery} className="gap-2">
                    {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    เพิ่มรูปภาพ
                  </Button>
                </div>
              </div>

              {values.mediaUrls.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {values.mediaUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border bg-muted">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={getFacultyNewsImageUrl(url) || url}
                          alt={`Gallery ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={async () => {
                          await deleteManagedFile(url);
                          setValues((prev) => ({ ...prev, mediaUrls: prev.mediaUrls.filter((item) => item !== url) }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  ยังไม่มีรูปภาพเพิ่มเติม
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label>เอกสารแนบสำหรับดาวน์โหลด</Label>
                  <p className="text-xs text-muted-foreground">เช่น PDF, DOCX หรือไฟล์ประกาศสมัครงาน</p>
                </div>
                <div className="flex gap-2">
                  <input ref={attachmentInputRef} type="file" multiple onChange={handleAttachmentUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => attachmentInputRef.current?.click()} disabled={uploadingAttachment} className="gap-2">
                    {uploadingAttachment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                    เพิ่มเอกสารแนบ
                  </Button>
                </div>
              </div>

              {values.attachments.length > 0 ? (
                <div className="space-y-2">
                  {values.attachments.map((attachment, index) => (
                    <div key={`${attachment.fileUrl}-${index}`} className="flex items-center justify-between rounded-lg border px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="min-w-0">
                          <a 
                            href={getFacultyNewsImageUrl(attachment.fileUrl) || attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={attachment.originalName}
                            className="truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline block"
                          >
                            {attachment.originalName}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            {attachment.mimeType || 'application/octet-stream'}
                            {typeof attachment.size === 'number' ? ` • ${(attachment.size / 1024 / 1024).toFixed(2)} MB` : ''}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={async () => {
                          await deleteManagedFile(attachment.fileUrl);
                          setValues((prev) => ({ ...prev, attachments: prev.attachments.filter((item) => item.fileUrl !== attachment.fileUrl) }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> ลบ
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  ยังไม่มีเอกสารแนบ
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>เนื้อหา</Label>
              <ReactQuill
                theme="snow"
                value={values.content}
                onChange={(content) => setValues((prev) => ({ ...prev, content }))}
                modules={quillModules}
                formats={quillFormats}
              />
              <Textarea
                className="hidden"
                value={values.content}
                onChange={() => undefined}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild type="button" variant="ghost">
            <Link href="/admin/news">ยกเลิก</Link>
          </Button>
          <Button type="submit" disabled={submitting || uploadingThumbnail || uploadingGallery || uploadingAttachment} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === 'create' ? 'บันทึกข่าว' : 'บันทึกการแก้ไข'}
          </Button>
        </div>
      </form>
    </div>
  );
}
