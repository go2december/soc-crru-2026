'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Building2,
  GraduationCap,
  RefreshCw,
  FolderTree,
  Target,
  Sparkles,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  MissionItem,
  CoreValueItem,
  StructureSection,
  StructureSectionItem,
  StrategicPlanItem,
} from '@/lib/site-settings';
import { AVAILABLE_ICON_NAMES, LucideIcon } from '@/components/LucideIcon';

export default function AdminFacultySettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...data,
          coreValues: data.coreValues || DEFAULT_SITE_SETTINGS.coreValues,
          missions: data.missions || DEFAULT_SITE_SETTINGS.missions,
          structureSections: data.structureSections || DEFAULT_SITE_SETTINGS.structureSections,
          strategicPlans: data.strategicPlans || DEFAULT_SITE_SETTINGS.strategicPlans,
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);

      const token = localStorage.getItem('admin_token');
      const payload = {
        historyFoundedYear: settings.historyFoundedYear,
        historyContentTh: settings.historyContentTh,
        philosophyTh: settings.philosophyTh,
        visionTh: settings.visionTh,
        identityTh: settings.identityTh,
        uniquenessTh: settings.uniquenessTh,
        coreValues: settings.coreValues,
        missions: settings.missions,
        structureSections: settings.structureSections,
        strategicPlans: settings.strategicPlans,
      };

      const res = await fetch('/api/site-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }

      const updated = await res.json();
      setSettings(updated);

      // Trigger On-Demand Revalidation
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/about', '/about/structure', '/about/strategy'],
        }),
      }).catch((e) => console.warn('Revalidate trigger failed:', e));

      setStatusMessage({
        type: 'success',
        text: 'บันทึกข้อมูลคณะสำเร็จและอัปเดตหน้าบ้านทันที (On-Demand Revalidated)',
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-[#C2410C]" />
          <p className="text-slate-500 font-medium">กำลังโหลดข้อมูลการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Building2 className="size-6 text-[#C2410C]" />
            <span>จัดการข้อมูลคณะ (Faculty Information & Organization CMS)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            จัดการประวัติ ปรัชญา ค่านิยม พันธกิจ โครงสร้างองค์กรแบบยืดหยุ่น และแผนยุทธศาสตร์ 5 ปี
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0B132B] hover:bg-slate-800 text-white font-medium shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="size-4 text-amber-400" />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* 4 Focused Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="rounded-lg px-4 py-2 font-medium text-xs sm:text-sm">
            🏛️ ข้อมูลทั่วไป & อัตลักษณ์
          </TabsTrigger>
          <TabsTrigger value="values-missions" className="rounded-lg px-4 py-2 font-medium text-xs sm:text-sm">
            💎 ค่านิยม & พันธกิจ (เพิ่ม/ลดได้)
          </TabsTrigger>
          <TabsTrigger value="structure" className="rounded-lg px-4 py-2 font-medium text-xs sm:text-sm">
            🗺️ โครงสร้างองค์กร (ยืดหยุ่นปรับเปลี่ยนได้)
          </TabsTrigger>
          <TabsTrigger value="strategy" className="rounded-lg px-4 py-2 font-medium text-xs sm:text-sm">
            🎯 แผนยุทธศาสตร์ (เพิ่ม/ลดได้)
          </TabsTrigger>
        </TabsList>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & IDENTITY */}
        {/* ======================================================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* History */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                ประวัติความเป็นมาและการก่อตั้งคณะ (History)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-48 space-y-1.5">
                <Label htmlFor="historyFoundedYear" className="text-xs font-semibold text-slate-700">
                  ปีก่อตั้งคณะ (พ.ศ.)
                </Label>
                <Input
                  id="historyFoundedYear"
                  value={settings.historyFoundedYear || ''}
                  onChange={(e) => setSettings({ ...settings, historyFoundedYear: e.target.value })}
                  placeholder="2546"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="historyContentTh" className="text-xs font-semibold text-slate-700">
                  เนื้อหาประวัติความเป็นมา
                </Label>
                <Textarea
                  id="historyContentTh"
                  rows={6}
                  value={settings.historyContentTh || ''}
                  onChange={(e) => setSettings({ ...settings, historyContentTh: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Philosophy & Vision */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                ปรัชญา & วิสัยทัศน์ (Philosophy & Vision)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="philosophyTh" className="text-xs font-semibold text-slate-700">
                  ปรัชญา (Philosophy)
                </Label>
                <Textarea
                  id="philosophyTh"
                  rows={3}
                  value={settings.philosophyTh || ''}
                  onChange={(e) => setSettings({ ...settings, philosophyTh: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visionTh" className="text-xs font-semibold text-slate-700">
                  วิสัยทัศน์ (Vision)
                </Label>
                <Textarea
                  id="visionTh"
                  rows={3}
                  value={settings.visionTh || ''}
                  onChange={(e) => setSettings({ ...settings, visionTh: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identity & Uniqueness */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                เอกลักษณ์ & อัตลักษณ์ (Identity & Uniqueness)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="identityTh" className="text-xs font-semibold text-slate-700">
                  อัตลักษณ์ (Identity)
                </Label>
                <Textarea
                  id="identityTh"
                  rows={3}
                  value={settings.identityTh || ''}
                  onChange={(e) => setSettings({ ...settings, identityTh: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="uniquenessTh" className="text-xs font-semibold text-slate-700">
                  เอกลักษณ์ (Uniqueness)
                </Label>
                <Textarea
                  id="uniquenessTh"
                  rows={3}
                  value={settings.uniquenessTh || ''}
                  onChange={(e) => setSettings({ ...settings, uniquenessTh: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 2: VALUES & MISSIONS (DYNAMIC ADD / REMOVE) */}
        {/* ======================================================== */}
        <TabsContent value="values-missions" className="space-y-6">
          {/* Core Values */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  ค่านิยมหลักขององค์กร (Core Values)
                </CardTitle>
                <CardDescription>
                  สามารถเพิ่มได้ไม่จำกัดจำนวน และเลือกไอคอนประกอบได้
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentValues = settings.coreValues || [];
                  setSettings({
                    ...settings,
                    coreValues: [
                      ...currentValues,
                      { title: 'ค่านิยมใหม่', desc: 'คำอธิบายค่านิยมองค์กร', icon: 'Lightbulb' },
                    ],
                  });
                }}
                className="flex items-center gap-1.5"
              >
                <Plus className="size-4 text-[#C2410C]" />
                <span>เพิ่มค่านิยม</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(settings.coreValues || []).map((cv, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">ค่านิยมที่ {idx + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = settings.coreValues.filter((_, i) => i !== idx);
                        setSettings({ ...settings, coreValues: updated });
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8 space-y-1">
                      <Label className="text-xs font-semibold text-slate-600">ชื่อค่านิยม</Label>
                      <Input
                        value={cv.title}
                        onChange={(e) => {
                          const updated = [...(settings.coreValues || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSettings({ ...settings, coreValues: updated });
                        }}
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-xs font-semibold text-slate-600">ไอคอน (Icon)</Label>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-[#C2410C]">
                          <LucideIcon name={cv.icon} className="size-4" />
                        </div>
                        <select
                          value={cv.icon || 'Lightbulb'}
                          onChange={(e) => {
                            const updated = [...(settings.coreValues || [])];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setSettings({ ...settings, coreValues: updated });
                          }}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs focus:ring-[#C2410C]"
                        >
                          {AVAILABLE_ICON_NAMES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600">คำอธิบายรายละเอียด</Label>
                    <Input
                      value={cv.desc}
                      onChange={(e) => {
                        const updated = [...(settings.coreValues || [])];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setSettings({ ...settings, coreValues: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Missions */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  พันธกิจของคณะ (Missions)
                </CardTitle>
                <CardDescription>
                  รายการพันธกิจหลักในการดำเนินงาน สามารถเพิ่มหรือลดข้อได้ตามความเหมาะสม
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentMissions = settings.missions || [];
                  const newId = currentMissions.length ? Math.max(...currentMissions.map((m) => m.id)) + 1 : 1;
                  setSettings({
                    ...settings,
                    missions: [
                      ...currentMissions,
                      { id: newId, title: 'พันธกิจใหม่', desc: '', icon: 'Users' },
                    ],
                  });
                }}
                className="flex items-center gap-1.5"
              >
                <Plus className="size-4 text-[#C2410C]" />
                <span>เพิ่มพันธกิจ</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(settings.missions || []).map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">พันธกิจข้อที่ {m.id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = settings.missions.filter((_, i) => i !== idx);
                        setSettings({ ...settings, missions: updated });
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8 space-y-1">
                      <Label className="text-xs font-semibold text-slate-600">หัวข้อพันธกิจ</Label>
                      <Input
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...(settings.missions || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSettings({ ...settings, missions: updated });
                        }}
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-xs font-semibold text-slate-600">ไอคอน (Icon)</Label>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-[#C2410C]">
                          <LucideIcon name={m.icon} className="size-4" />
                        </div>
                        <select
                          value={m.icon || 'Users'}
                          onChange={(e) => {
                            const updated = [...(settings.missions || [])];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setSettings({ ...settings, missions: updated });
                          }}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs focus:ring-[#C2410C]"
                        >
                          {AVAILABLE_ICON_NAMES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600">คำอธิบายพันธกิจ</Label>
                    <Textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...(settings.missions || [])];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setSettings({ ...settings, missions: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 3: FLEXIBLE ORGANIZATIONAL STRUCTURE */}
        {/* ======================================================== */}
        <TabsContent value="structure" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="size-5 text-[#C2410C]" />
                <span>กลุ่มโครงสร้างการบริหาร (Organizational Sections)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ออกแบบให้ยืดหยุ่นสูง: เพิ่ม/ลบกลุ่มโครงสร้าง (เช่น ผู้บริหาร, สำนักงานคณบดี, คณะกรรมการ) และเพิ่ม/ลบตำแหน่งได้อย่างอิสระ
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentSections = settings.structureSections || [];
                const newSection: StructureSection = {
                  id: `sec-${Date.now()}`,
                  title: 'กลุ่มโครงสร้างใหม่',
                  titleEn: 'New Section',
                  description: 'คำอธิบายภารกิจของกลุ่มโครงสร้างนี้',
                  displayLayout: 'cards',
                  items: [
                    {
                      id: `item-${Date.now()}-1`,
                      title: 'ตำแหน่งหรือฝ่ายงานใหม่',
                      subtitle: 'Position or Unit Subtitle',
                      description: 'ขอบเขตภาระหน้าที่และความรับผิดชอบ',
                      tag: 'ทั่วไป',
                      accent: 'border-t-4 border-[#C2410C]',
                    },
                  ],
                };
                setSettings({ ...settings, structureSections: [...currentSections, newSection] });
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="size-4 text-[#C2410C]" />
              <span>เพิ่มกลุ่มโครงสร้าง</span>
            </Button>
          </div>

          {(settings.structureSections || []).map((sec, sIdx) => (
            <Card key={sec.id || sIdx} className="border-slate-200 shadow-xs">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#0B132B] text-amber-400 text-xs">กลุ่มที่ {sIdx + 1}</Badge>
                    <Input
                      value={sec.title}
                      onChange={(e) => {
                        const updated = [...(settings.structureSections || [])];
                        updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                        setSettings({ ...settings, structureSections: updated });
                      }}
                      placeholder="ชื่อกลุ่มโครงสร้าง (TH) เช่น คณะผู้บริหาร, สำนักงานคณบดี"
                      className="font-bold text-sm bg-white max-w-xs"
                    />
                    <Input
                      value={sec.titleEn || ''}
                      onChange={(e) => {
                        const updated = [...(settings.structureSections || [])];
                        updated[sIdx] = { ...updated[sIdx], titleEn: e.target.value };
                        setSettings({ ...settings, structureSections: updated });
                      }}
                      placeholder="ชื่อภาษาอังกฤษ (EN)"
                      className="text-xs bg-white max-w-xs"
                    />
                  </div>
                  <Input
                    value={sec.description || ''}
                    onChange={(e) => {
                      const updated = [...(settings.structureSections || [])];
                      updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                      setSettings({ ...settings, structureSections: updated });
                    }}
                    placeholder="คำอธิบายกลุ่มโครงสร้างนี้..."
                    className="text-xs bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = [...(settings.structureSections || [])];
                      const currentItems = updated[sIdx].items || [];
                      updated[sIdx] = {
                        ...updated[sIdx],
                        items: [
                          ...currentItems,
                          {
                            id: `item-${Date.now()}`,
                            title: 'ตำแหน่งใหม่',
                            subtitle: '',
                            description: 'ภาระหน้าที่',
                            tag: 'บริหาร',
                            accent: 'border-t-4 border-[#C2410C]',
                          },
                        ],
                      };
                      setSettings({ ...settings, structureSections: updated });
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <Plus className="size-3.5" />
                    <span>เพิ่มตำแหน่งในกลุ่มนี้</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = settings.structureSections.filter((_, i) => i !== sIdx);
                      setSettings({ ...settings, structureSections: updated });
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-4">
                {(sec.items || []).map((item, iIdx) => (
                  <div key={item.id || iIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">ตำแหน่ง #{iIdx + 1}</span>
                        <Input
                          value={item.tag || ''}
                          onChange={(e) => {
                            const updated = [...(settings.structureSections || [])];
                            const items = [...updated[sIdx].items];
                            items[iIdx] = { ...items[iIdx], tag: e.target.value };
                            updated[sIdx] = { ...updated[sIdx], items };
                            setSettings({ ...settings, structureSections: updated });
                          }}
                          placeholder="ป้ายหมวด (เช่น Academic, Strategy)"
                          className="h-7 text-[11px] w-36 bg-white"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...(settings.structureSections || [])];
                          const items = updated[sIdx].items.filter((_, idx) => idx !== iIdx);
                          updated[sIdx] = { ...updated[sIdx], items };
                          setSettings({ ...settings, structureSections: updated });
                        }}
                        className="text-red-600 hover:bg-red-50 h-7 px-2"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">ชื่อตำแหน่งหรือชื่อฝ่ายงาน (TH)</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...(settings.structureSections || [])];
                            const items = [...updated[sIdx].items];
                            items[iIdx] = { ...items[iIdx], title: e.target.value };
                            updated[sIdx] = { ...updated[sIdx], items };
                            setSettings({ ...settings, structureSections: updated });
                          }}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">ชื่อตำแหน่งหรือชื่อฝ่ายงาน (EN)</Label>
                        <Input
                          value={item.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...(settings.structureSections || [])];
                            const items = [...updated[sIdx].items];
                            items[iIdx] = { ...items[iIdx], subtitle: e.target.value };
                            updated[sIdx] = { ...updated[sIdx], items };
                            setSettings({ ...settings, structureSections: updated });
                          }}
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-600">ขอบเขตภาระหน้าที่และความรับผิดชอบ</Label>
                      <Textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...(settings.structureSections || [])];
                          const items = [...updated[sIdx].items];
                          items[iIdx] = { ...items[iIdx], description: e.target.value };
                          updated[sIdx] = { ...updated[sIdx], items };
                          setSettings({ ...settings, structureSections: updated });
                        }}
                        className="bg-white"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 4: STRATEGIC PLANS (DYNAMIC ADD / REMOVE) */}
        {/* ======================================================== */}
        <TabsContent value="strategy" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="size-5 text-[#C2410C]" />
                <span>แผนยุทธศาสตร์ 5 ปี (Strategic Plans)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                สามารถเพิ่มหรือลบประเด็นยุทธศาสตร์ได้อิสระ ไม่จำกัดเฉพาะ 4 ข้อ
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPlans = settings.strategicPlans || [];
                const nextNum = currentPlans.length + 1;
                const newPlan: StrategicPlanItem = {
                  id: String(nextNum),
                  number: nextNum < 10 ? `0${nextNum}` : String(nextNum),
                  badge: `ยุทธศาสตร์ที่ ${nextNum}`,
                  name: `ประเด็นยุทธศาสตร์ที่ ${nextNum}`,
                  desc: `Strategic Issue ${nextNum}`,
                  icon: 'GraduationCap',
                  summary: 'สรุปประเด็นและทิศทางการขับเคลื่อนยุทธศาสตร์นี้...',
                  color: 'from-amber-500 to-[#C2410C]',
                  borderHover: 'hover:border-[#C2410C]',
                  accentBg: 'bg-orange-50 text-[#C2410C]',
                  objectives: ['วัตถุประสงค์ข้อที่ 1'],
                  kpis: ['ตัวชี้วัดความสำเร็จ (KPI) ข้อที่ 1'],
                };
                setSettings({ ...settings, strategicPlans: [...currentPlans, newPlan] });
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="size-4 text-[#C2410C]" />
              <span>เพิ่มยุทธศาสตร์</span>
            </Button>
          </div>

          <div className="space-y-6">
            {(settings.strategicPlans || []).map((plan, idx) => (
              <Card key={plan.id || idx} className="border-slate-200 shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#0B132B] text-amber-400 font-bold px-3 py-1">
                      {plan.badge || `ยุทธศาสตร์ที่ ${idx + 1}`}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-[#C2410C]">
                        <LucideIcon name={plan.icon} className="size-4" />
                      </div>
                      <select
                        value={plan.icon || 'GraduationCap'}
                        onChange={(e) => {
                          const updated = [...(settings.strategicPlans || [])];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setSettings({ ...settings, strategicPlans: updated });
                        }}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:ring-[#C2410C]"
                      >
                        {AVAILABLE_ICON_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = settings.strategicPlans.filter((_, i) => i !== idx);
                      setSettings({ ...settings, strategicPlans: updated });
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">ป้ายหัวข้อ (Badge)</Label>
                      <Input
                        value={plan.badge}
                        onChange={(e) => {
                          const updated = [...(settings.strategicPlans || [])];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setSettings({ ...settings, strategicPlans: updated });
                        }}
                      />
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">ชื่อประเด็นยุทธศาสตร์ (TH)</Label>
                      <Input
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...(settings.strategicPlans || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setSettings({ ...settings, strategicPlans: updated });
                        }}
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">ชื่อภาษาอังกฤษ (EN)</Label>
                      <Input
                        value={plan.desc}
                        onChange={(e) => {
                          const updated = [...(settings.strategicPlans || [])];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setSettings({ ...settings, strategicPlans: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">สรุปแนวคิดยุทธศาสตร์ (Summary)</Label>
                    <Textarea
                      rows={2}
                      value={plan.summary}
                      onChange={(e) => {
                        const updated = [...(settings.strategicPlans || [])];
                        updated[idx] = { ...updated[idx], summary: e.target.value };
                        setSettings({ ...settings, strategicPlans: updated });
                      }}
                    />
                  </div>

                  {/* Objectives */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">
                      วัตถุประสงค์ (Objectives - 1 บรรทัดต่อ 1 ข้อ)
                    </Label>
                    <Textarea
                      rows={3}
                      value={(plan.objectives || []).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        const updated = [...(settings.strategicPlans || [])];
                        updated[idx] = { ...updated[idx], objectives: lines };
                        setSettings({ ...settings, strategicPlans: updated });
                      }}
                      placeholder="วัตถุประสงค์ 1...&#10;วัตถุประสงค์ 2..."
                    />
                  </div>

                  {/* KPIs */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">
                      ตัวชี้วัดความสำเร็จ (KPIs - 1 บรรทัดต่อ 1 ข้อ)
                    </Label>
                    <Textarea
                      rows={3}
                      value={(plan.kpis || []).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        const updated = [...(settings.strategicPlans || [])];
                        updated[idx] = { ...updated[idx], kpis: lines };
                        setSettings({ ...settings, strategicPlans: updated });
                      }}
                      placeholder="ตัวชี้วัด 1...&#10;ตัวชี้วัด 2..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
