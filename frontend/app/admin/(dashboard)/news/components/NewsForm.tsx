'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';

interface NewsData {
    title: string;
    content: string;
    category: string;
    thumbnailUrl: string;
}

interface NewsFormProps {
    initialData?: NewsData;
    id?: string; // If editing
    onSubmit: (data: NewsData) => Promise<void>;
    loading: boolean;
}

export default function NewsForm({ initialData, id, onSubmit, loading }: NewsFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<NewsData>({
        title: '',
        content: '',
        category: 'NEWS',
        thumbnailUrl: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="max-w-4xl mx-auto shadow-md">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/admin/news" className="hover:text-primary transition-colors flex items-center gap-1 text-sm">
                            <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
                        </Link>
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        {id ? '✏️ แก้ไขข่าว' : '✍️ เขียนข่าวใหม่'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">หัวข้อข่าว <span className="text-destructive">*</span></Label>
                        <Input
                            id="title"
                            placeholder="ระบุหัวข้อข่าวที่น่าสนใจ..."
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">หมวดหมู่</Label>
                            <Select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="NEWS">📢 ข่าวประชาสัมพันธ์ (News)</option>
                                <option value="EVENT">📅 กิจกรรม (Event)</option>
                                <option value="ANNOUNCE">📣 ประกาศทั่วไป (Announcement)</option>
                            </Select>
                        </div>

                        {/* Thumbnail URL */}
                        <div className="space-y-2">
                            <Label htmlFor="thumbnailUrl">รูปภาพปก (URL)</Label>
                            <Input
                                id="thumbnailUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnailUrl}
                                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {formData.thumbnailUrl && (
                        <div className="relative aspect-video w-full md:w-1/2 bg-muted rounded-lg overflow-hidden border">
                            <img
                                src={formData.thumbnailUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL'}
                            />
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                Preview
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">เนื้อหาข่าว / รายละเอียด <span className="text-destructive">*</span></Label>
                        <Textarea
                            id="content"
                            className="min-h-[300px] font-mono text-sm leading-relaxed"
                            placeholder="เขียนเนื้อหาข่าวที่นี่ (รองรับ HTML เบื้องต้น)..."
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                            * Tip: สามารถใช้ HTML Tags ได้ (เช่น &lt;b&gt;, &lt;br&gt;, &lt;p&gt;)
                        </p>
                    </div>

                </CardContent>

                <CardFooter className="flex justify-between border-t bg-muted/20 py-4">
                    <Button type="button" variant="ghost" asChild>
                        <Link href="/admin/news">ยกเลิก</Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> บันทึกข่าว
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
