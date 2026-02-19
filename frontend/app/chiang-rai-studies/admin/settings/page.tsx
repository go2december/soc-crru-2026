
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [config, setConfig] = useState({
        heroBgUrl: '',
        heroTitle: '',
        heroSubtitle: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch config
        const fetchConfig = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const res = await fetch(`${API_URL}/api/chiang-rai/config`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch (error) {
                console.error('Failed to fetch config', error);
                toast.error('ไม่สามารถโหลดข้อมูลการตั้งค่าได้');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const adminToken = localStorage.getItem('admin_token');

            if (!adminToken) {
                toast.error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
                return;
            }

            const res = await fetch(`${API_URL}/api/chiang-rai/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
            } else {
                toast.error('เกิดข้อผิดพลาดในการบันทึก');
            }
        } catch (error) {
            toast.error('เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            toast.error('รองรับไฟล์รูปภาพ JPG, PNG, WebP เท่านั้น');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const adminToken = localStorage.getItem('admin_token');

            if (!adminToken) {
                toast.error('กรุณาเข้าสู่ระบบก่อนอัปโหลด');
                setUploading(false);
                return;
            }

            console.log('Starting upload to:', `${API_URL}/api/upload/chiang-rai`);
            console.log('Token exists:', !!adminToken);

            const res = await fetch(`${API_URL}/api/upload/chiang-rai`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                // Add API_URL prefix if needed for displaying, but store relative path usually
                // The API returns relative path like /uploads/chiang-rai/filename.webp
                // We need to prepend API URL for display if served from backend
                const fullUrl = `${API_URL}${data.url}`;

                setConfig({ ...config, heroBgUrl: fullUrl });
                toast.success('อัปโหลดรูปภาพสำเร็จ');
            } else {
                const error = await res.text();
                toast.error(`อัปโหลดล้มเหลว: ${error}`);
            }
        } catch (error) {
            console.error('Upload error details:', error);
            if (error instanceof Error) {
                toast.error(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
            } else {
                toast.error('เกิดข้อผิดพลาดในการอัปโหลด (Unknown Error)');
            }
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const clearImage = () => {
        setConfig({ ...config, heroBgUrl: '' });
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#2e1065] animate-spin" />
            <span className="ml-2 text-[#2e1065]">กำลังโหลด...</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-[#2e1065] flex items-center gap-2">
                <span className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Upload className="w-6 h-6" />
                </span>
                ตั้งค่าทั่วไป (General Settings)
            </h1>

            <Card className="border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-white rounded-t-xl border-b border-purple-100">
                    <CardTitle className="text-[#2e1065] flex items-center gap-2">
                        <span>ส่วนหัวของหน้าแรก (Hero Section)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-bold mb-4 text-stone-700">
                            รูปภาพพื้นหลัง (Background Image)
                        </label>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Preview Area */}
                            <div className="w-full md:w-2/3">
                                <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-stone-200 bg-stone-50 h-64 flex items-center justify-center transition-all hover:border-purple-300">
                                    {config.heroBgUrl ? (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${config.heroBgUrl})` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                                <p className="font-medium mb-2">ตัวอย่างการแสดงผล</p>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={clearImage}
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4 mr-1" /> ลบรูปภาพ
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 text-stone-400">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mb-3">
                                                <Upload className="w-6 h-6 text-stone-400" />
                                            </div>
                                            <p className="text-sm font-medium">ยังไม่มีรูปภาพ</p>
                                            <p className="text-xs mt-1">อัปโหลดรูปภาพเพื่อแสดงเป็นพื้นหลัง</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="w-full md:w-1/3 space-y-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileUpload}
                                />

                                <Button
                                    onClick={triggerFileInput}
                                    disabled={uploading}
                                    className="w-full bg-[#2e1065] hover:bg-[#4c1d95] text-white h-12 text-base shadow-sm"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังอัปโหลด...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" /> อัปโหลดรูปภาพใหม่
                                        </>
                                    )}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-stone-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-stone-500 font-medium">หรือระบุ URL</span>
                                    </div>
                                </div>

                                <Input
                                    name="heroBgUrl"
                                    value={config.heroBgUrl || ''}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="border-stone-200 focus:border-purple-500 focus:ring-purple-500"
                                />

                                <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                    <p className="font-semibold text-stone-700 mb-1">คำแนะนำ:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>ขนาดแนะนำ: 1920x1080 px</li>
                                        <li>ไฟล์ที่รองรับ: JPG, PNG, WebP</li>
                                        <li>ขนาดไฟล์สูงสุด: 5MB</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-stone-100 my-8" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-stone-700">หัวข้อหลัก (Hero Title)</label>
                            <Input
                                name="heroTitle"
                                value={config.heroTitle || ''}
                                onChange={handleChange}
                                className="font-bold text-lg border-stone-200 focus:border-purple-500 focus:ring-purple-200 h-12"
                                placeholder="ศูนย์เชียงรายศึกษา"
                            />
                            <p className="text-xs text-stone-400 mt-2">ข้อความขนาดใหญ่ที่จะปรากฏเด่นชัดที่สุด</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-stone-700">คำบรรยายรอง (Hero Subtitle)</label>
                            <Textarea
                                name="heroSubtitle"
                                value={config.heroSubtitle || ''}
                                onChange={handleChange}
                                className="min-h-[120px] border-stone-200 focus:border-purple-500 focus:ring-purple-200 resize-none text-base"
                                placeholder="แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้..."
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-purple-50 flex justify-end">
                        <Button
                            onClick={handleSave}
                            className="bg-orange-600 hover:bg-orange-700 text-white min-w-[160px] h-12 text-base font-bold shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
