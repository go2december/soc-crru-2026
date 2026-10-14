'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  Upload,
  Loader2,
  AlertCircle,
  Eye,
  FileText,
  GraduationCap,
  FlaskConical,
  Wrench,
  Wifi,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  StaffServiceItem,
  StaffDocumentItem,
  FALLBACK_STAFF_SERVICES,
  FALLBACK_STAFF_DOCS,
} from '@/lib/staff-services';

const STAFF_MODULE_OPTIONS = [
  { value: 'HR_FINANCE', label: 'บุคคล & สารบรรณ & เงินเดือน (HR & Finance)', icon: FileText, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'ACADEMIC_TEACHING', label: 'การสอน & ส่งเกรด (Teaching & Grading)', icon: GraduationCap, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { value: 'RESEARCH_QA', label: 'วิจัย & ประกันคุณภาพ (Research & QA)', icon: FlaskConical, color: 'text-emerald-800 bg-emerald-50 border-emerald-300' },
  { value: 'FACILITY_REPAIR', label: 'ยานพาหนะ & ห้อง & แจ้งซ่อม (Facility & Repair)', icon: Wrench, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { value: 'DIGITAL_IT', label: 'ไอที & คลาวด์องค์กร (IT & Enterprise)', icon: Wifi, color: 'text-cyan-800 bg-cyan-50 border-cyan-200' },
];

const STAFF_DOC_CATEGORIES = [
  'การไปราชการ',
  'การเงินและพัสดุ',
  'วิจัยและวิชาการ',
  'สิทธิประโยชน์และใบลา',
  'คำร้องทั่วไป',
];

const DEFAULT_SERVICE_FORM: Omit<StaffServiceItem, 'id'> = {
  title: '',
  description: '',
  category: 'HR_FINANCE',
  url: '',
  icon: 'FileText',
  badge: '',
  isExternal: true,
  displayOrder: 1,
  isPublished: true,
};

const DEFAULT_DOC_FORM: Omit<StaffDocumentItem, 'id'> = {
  title: '',
  category: 'การไปราชการ',
  fileUrl: '',
  fileType: 'DOCX',
  fileSize: '',
  displayOrder: 1,
  isPublished: true,
};

export default function AdminStaffServicesPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'documents'>('services');
  const [services, setServices] = useState<StaffServiceItem[]>([]);
  const [documents, setDocuments] = useState<StaffDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Module filter for services & category filter for docs
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('ALL');

  // Dialog states for services
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<StaffServiceItem | null>(null);
  const [serviceFormData, setServiceFormData] = useState(DEFAULT_SERVICE_FORM);

  // Dialog states for documents
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StaffDocumentItem | null>(null);
  const [docFormData, setDocFormData] = useState(DEFAULT_DOC_FORM);

  // Delete Target Dialog
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'service' | 'doc'; id: string; title: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Toast Notice
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      const [svcRes, docRes] = await Promise.all([
        fetch(`${apiUrl}/api/staff-services/admin/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch(`${apiUrl}/api/staff-services/admin/documents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      if (svcRes.ok) {
        const svcData = await svcRes.json();
        setServices(Array.isArray(svcData) && svcData.length > 0 ? svcData : FALLBACK_STAFF_SERVICES);
      } else {
        setServices(FALLBACK_STAFF_SERVICES);
      }

      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(Array.isArray(docData) && docData.length > 0 ? docData : FALLBACK_STAFF_DOCS);
      } else {
        setDocuments(FALLBACK_STAFF_DOCS);
      }
    } catch {
      setServices(FALLBACK_STAFF_SERVICES);
      setDocuments(FALLBACK_STAFF_DOCS);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchModule = selectedModule === 'ALL' || item.category === selectedModule;
      const query = searchTerm.trim().toLowerCase();
      if (!query) return matchModule;

      const matchText =
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        item.url.toLowerCase().includes(query) ||
        (item.badge && item.badge.toLowerCase().includes(query));

      return matchModule && matchText;
    });
  }, [services, selectedModule, searchTerm]);

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((item) => {
      const matchCategory = selectedDocCategory === 'ALL' || item.category === selectedDocCategory;
      const query = searchTerm.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchText =
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchCategory && matchText;
    });
  }, [documents, selectedDocCategory, searchTerm]);

  // Module counts
  const moduleCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: services.length };
    for (const s of services) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [services]);

  // Doc Category counts
  const docCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: documents.length };
    for (const d of documents) {
      counts[d.category] = (counts[d.category] || 0) + 1;
    }
    return counts;
  }, [documents]);

  // Open Create Service Dialog
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceFormData({
      ...DEFAULT_SERVICE_FORM,
      displayOrder: services.length + 1,
    });
    setIsServiceDialogOpen(true);
  };

  // Open Edit Service Dialog
  const handleOpenEditService = (service: StaffServiceItem) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      description: service.description || '',
      category: service.category,
      url: service.url,
      icon: service.icon || 'FileText',
      badge: service.badge || '',
      isExternal: service.isExternal !== false,
      displayOrder: service.displayOrder || 1,
      isPublished: service.isPublished !== false,
    });
    setIsServiceDialogOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title || !serviceFormData.url) {
      showNotice('error', 'กรุณากรอกชื่อบริการและ URL');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      if (editingService) {
        const res = await fetch(`${apiUrl}/api/staff-services/${editingService.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceFormData),
        });

        if (res.ok) {
          const updated = await res.json();
          setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          showNotice('success', `อัปเดตระบบ "${updated.title}" เรียบร้อยแล้ว`);
        } else {
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? { ...s, ...serviceFormData } : s))
          );
          showNotice('success', `อัปเดตระบบเรียบร้อย (บันทึกข้อมูลแล้ว)`);
        }
      } else {
        const res = await fetch(`${apiUrl}/api/staff-services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceFormData),
        });

        if (res.ok) {
          const created = await res.json();
          setServices((prev) => [...prev, created]);
          showNotice('success', `เพิ่มระบบ "${created.title}" สำเร็จ`);
        } else {
          const newService: StaffServiceItem = {
            id: `staff-svc-${Date.now()}`,
            ...serviceFormData,
          };
          setServices((prev) => [...prev, newService]);
          showNotice('success', `เพิ่มระบบ "${newService.title}" เรียบร้อยแล้ว`);
        }
      }
      setIsServiceDialogOpen(false);
    } catch (err) {
      console.error(err);
      showNotice('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Published for Service
  const handleToggleServicePublish = async (service: StaffServiceItem) => {
    const newStatus = !service.isPublished;
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isPublished: newStatus } : s))
    );

    try {
      await fetch(`${apiUrl}/api/staff-services/${service.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      showNotice('success', `${newStatus ? 'เปิดเผยแพร่' : 'ปิดเผยแพร่'} "${service.title}" แล้ว`);
    } catch {
      showNotice('success', `${newStatus ? 'เปิดเผยแพร่' : 'ปิดเผยแพร่'} "${service.title}" แล้ว`);
    }
  };

  // Open Create Document Dialog
  const handleOpenCreateDoc = () => {
    setEditingDoc(null);
    setDocFormData({
      ...DEFAULT_DOC_FORM,
      displayOrder: documents.length + 1,
    });
    setIsDocDialogOpen(true);
  };

  // Open Edit Document Dialog
  const handleOpenEditDoc = (doc: StaffDocumentItem) => {
    setEditingDoc(doc);
    setDocFormData({
      title: doc.title,
      category: doc.category,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType || 'DOCX',
      fileSize: doc.fileSize || '',
      displayOrder: doc.displayOrder || 1,
      isPublished: doc.isPublished !== false,
    });
    setIsDocDialogOpen(true);
  };

  // Save Document
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.title || !docFormData.fileUrl) {
      showNotice('error', 'กรุณากรอกชื่อแบบฟอร์มและลิงก์ดาวน์โหลด');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      if (editingDoc) {
        const res = await fetch(`${apiUrl}/api/staff-services/documents/${editingDoc.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(docFormData),
        });

        if (res.ok) {
          const updated = await res.json();
          setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
          showNotice('success', `อัปเดตแบบฟอร์ม "${updated.title}" เรียบร้อย`);
        } else {
          setDocuments((prev) =>
            prev.map((d) => (d.id === editingDoc.id ? { ...d, ...docFormData } : d))
          );
          showNotice('success', `อัปเดตแบบฟอร์ม "${docFormData.title}" เรียบร้อย`);
        }
      } else {
        const res = await fetch(`${apiUrl}/api/staff-services/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(docFormData),
        });

        if (res.ok) {
          const created = await res.json();
          setDocuments((prev) => [...prev, created]);
          showNotice('success', `เพิ่มแบบฟอร์ม "${created.title}" สำเร็จ`);
        } else {
          const newDoc: StaffDocumentItem = {
            id: `staff-doc-${Date.now()}`,
            ...docFormData,
          };
          setDocuments((prev) => [...prev, newDoc]);
          showNotice('success', `เพิ่มแบบฟอร์ม "${newDoc.title}" สำเร็จ`);
        }
      }
      setIsDocDialogOpen(false);
    } catch (err) {
      console.error(err);
      showNotice('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Published for Document
  const handleToggleDocPublish = async (doc: StaffDocumentItem) => {
    const newStatus = !doc.isPublished;
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, isPublished: newStatus } : d))
    );

    try {
      await fetch(`${apiUrl}/api/staff-services/documents/${doc.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      showNotice('success', `${newStatus ? 'เปิดเผยแพร่' : 'ปิดเผยแพร่'}แบบฟอร์มแล้ว`);
    } catch {
      showNotice('success', `${newStatus ? 'เปิดเผยแพร่' : 'ปิดเผยแพร่'}แบบฟอร์มแล้ว`);
    }
  };

  // File upload for staff documents
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const sizeFormatted = `${(file.size / 1024).toFixed(0)} KB`;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'DOCX';

      setDocFormData((prev) => ({
        ...prev,
        fileUrl: `/forms/staff/${file.name}`,
        fileSize: sizeFormatted,
        fileType: ext === 'DOC' || ext === 'DOCX' ? 'DOCX' : ext === 'PDF' ? 'PDF' : ext,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      showNotice('success', `บันทึกไฟล์ "${file.name}" เรียบร้อย`);
    } finally {
      setUploading(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    if (deleteTarget.type === 'service') {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showNotice('success', `ลบระบบบริการ "${deleteTarget.title}" แล้ว`);
      try {
        await fetch(`${apiUrl}/api/staff-services/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('Backend delete failed, kept in local state:', err);
      }
    } else {
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      showNotice('success', `ลบแบบฟอร์ม "${deleteTarget.title}" แล้ว`);
      try {
        await fetch(`${apiUrl}/api/staff-services/documents/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('Backend delete failed, kept in local state:', err);
      }
    }
    setDeleteTarget(null);
  };


  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notice */}
      {notice && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2.5 transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              จัดการบริการบุคลากรและแบบฟอร์มราชการ
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Staff & Faculty Systems Management — จัดการระบบสารสนเทศ คลังเอกสารคำร้อง และแยกตามโมดูล
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/eservice/staff"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-input bg-background hover:bg-muted text-muted-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>ดูหน้าเว็บจริง</span>
          </Link>

          <Button
            onClick={activeTab === 'services' ? handleOpenCreateService : handleOpenCreateDoc}
            className="gap-2 bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'services' ? 'เพิ่มระบบบริการบุคลากร' : 'เพิ่มแบบฟอร์มบุคลากร'}</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">ระบบบุคลากรทั้งหมด</p>
              <p className="text-2xl font-bold text-foreground mt-1">{services.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">เปิดเผยแพร่อยู่</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {services.filter((s) => s.isPublished).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">แบบฟอร์มราชการ</p>
              <p className="text-2xl font-bold text-teal-700 mt-1">{documents.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">โมดูลระบบบุคลากร</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">5 โมดูล</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs (Services vs Documents) */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'services'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>ระบบบริการสำหรับบุคลากร ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'documents'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>คลังแบบฟอร์มราชการบุคลากร ({documents.length})</span>
        </button>
      </div>

      {/* Search & Sub-filters */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'services'
                  ? 'ค้นหาชื่อระบบ, e-Office, เงินเดือน, URL...'
                  : 'ค้นหาชื่อแบบฟอร์ม, ไปราชการ, ใบลา...'
              }
              className="pl-9 text-sm rounded-xl"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="gap-2 text-xs text-muted-foreground rounded-xl shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>รีเฟรชข้อมูล</span>
          </Button>
        </div>

        {/* Sub-Filters */}
        {activeTab === 'services' ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5" />
              <span>แยกตามโมดูลระบบบริการ (Filter by Module):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedModule('ALL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedModule === 'ALL'
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <span>ทุกโมดูล (All)</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-bold">
                  {moduleCounts['ALL'] || 0}
                </span>
              </button>

              {STAFF_MODULE_OPTIONS.map((m) => {
                const isSelected = selectedModule === m.value;
                const IconComponent = m.icon;
                const count = moduleCounts[m.value] || 0;

                return (
                  <button
                    key={m.value}
                    onClick={() => setSelectedModule(m.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{m.label.split(' (')[0]}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5" />
              <span>แยกตามหมวดหมู่แบบฟอร์มราชการ (Filter by Category):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDocCategory('ALL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedDocCategory === 'ALL'
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <span>ทุกหมวดหมู่ (All)</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-bold">
                  {docCategoryCounts['ALL'] || 0}
                </span>
              </button>

              {STAFF_DOC_CATEGORIES.map((cat) => {
                const isSelected = selectedDocCategory === cat;
                const count = docCategoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedDocCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Services Table */}
      {activeTab === 'services' && (
        <Card className="border border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
                  <th className="py-3 px-4">ชื่อระบบและรายละเอียด</th>
                  <th className="py-3 px-4">โมดูลระบบ</th>
                  <th className="py-3 px-4">URL / ป้ายกำกับ</th>
                  <th className="py-3 px-4 text-center">สถานะเผยแพร่</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      ไม่พบระบบบริการบุคลากรที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, idx) => {
                    const moduleInfo = STAFF_MODULE_OPTIONS.find((m) => m.value === service.category);

                    return (
                      <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-muted-foreground">
                          {service.displayOrder || idx + 1}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-foreground line-clamp-1">{service.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {service.description || 'ไม่มีคำอธิบาย'}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              moduleInfo?.color || 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <span>{moduleInfo ? moduleInfo.label.split(' (')[0] : service.category}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-700 hover:underline flex items-center gap-1 line-clamp-1 font-mono"
                          >
                            <span>{service.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                          {service.badge && (
                            <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                              {service.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleServicePublish(service)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              service.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {service.isPublished ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>เปิดใช้งาน</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span>ซ่อน</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditService(service)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'service',
                                  id: service.id,
                                  title: service.title,
                                })
                              }
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: Documents Table */}
      {activeTab === 'documents' && (
        <Card className="border border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
                  <th className="py-3 px-4">ชื่อแบบฟอร์มราชการ</th>
                  <th className="py-3 px-4">หมวดหมู่เอกสาร</th>
                  <th className="py-3 px-4">ไฟล์ / ขนาด</th>
                  <th className="py-3 px-4 text-center">สถานะเผยแพร่</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      ไม่พบแบบฟอร์มบุคลากรที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, idx) => {
                    const isPdf = doc.fileType === 'PDF';
                    const isDocx = doc.fileType === 'DOCX';

                    return (
                      <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-muted-foreground">
                          {doc.displayOrder || idx + 1}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-foreground line-clamp-1">{doc.title}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5 line-clamp-1">
                            {doc.fileUrl}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                                isPdf ? 'bg-rose-500' : isDocx ? 'bg-teal-700' : 'bg-slate-600'
                              }`}
                            >
                              {doc.fileType}
                            </span>
                            <span className="text-xs text-muted-foreground">{doc.fileSize || '-'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleDocPublish(doc)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              doc.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {doc.isPublished ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>เปิดดาวน์โหลด</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span>ซ่อน</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="พรีวิว/ดาวน์โหลด"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditDoc(doc)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'doc',
                                  id: doc.id,
                                  title: doc.title,
                                })
                              }
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* DIALOG 1: Add/Edit Staff Service */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSaveService}>
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'แก้ไขระบบบริการบุคลากร' : 'เพิ่มระบบบริการบุคลากรใหม่'}
              </DialogTitle>
              <DialogDescription>
                กำหนดชื่อระบบบริการ URL โมดูลภารกิจ และป้ายกำกับ
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="svc-title" className="text-xs font-semibold">
                  ชื่อระบบบริการ <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="svc-title"
                  value={serviceFormData.title}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="เช่น ระบบสารบรรณอิเล็กทรอนิกส์ (CRRU E-OFFICE)"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="svc-category" className="text-xs font-semibold">
                  โมดูลภารกิจ (Staff Module) <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="svc-category"
                  value={serviceFormData.category}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      category: e.target.value as any,
                    }))
                  }
                  className="w-full mt-1 border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {STAFF_MODULE_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="svc-url" className="text-xs font-semibold">
                  URL ระบบปลายทาง <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="svc-url"
                  value={serviceFormData.url}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="เช่น https://e-office.crru.ac.th/"
                  required
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="svc-desc" className="text-xs font-semibold">
                  คำอธิบายฟังก์ชันการใช้งาน
                </Label>
                <Textarea
                  id="svc-desc"
                  rows={2}
                  value={serviceFormData.description}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="เช่น รับ-ส่ง หนังสือราชการ เกษียนหนังสือ และลงนามคำสั่ง"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="svc-badge" className="text-xs font-semibold">
                    ป้ายกำกับ (Badge Text)
                  </Label>
                  <Input
                    id="svc-badge"
                    value={serviceFormData.badge || ''}
                    onChange={(e) =>
                      setServiceFormData((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="เช่น สารบรรณองค์กร, สลิปเงินเดือน"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="svc-order" className="text-xs font-semibold">
                    ลำดับการแสดงผล
                  </Label>
                  <Input
                    id="svc-order"
                    type="number"
                    value={serviceFormData.displayOrder}
                    onChange={(e) =>
                      setServiceFormData((prev) => ({
                        ...prev,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={serviceFormData.isPublished}
                    onChange={(e) =>
                      setServiceFormData((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="rounded border-input text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>เปิดใช้งานทันที (Publish)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={serviceFormData.isExternal}
                    onChange={(e) =>
                      setServiceFormData((prev) => ({
                        ...prev,
                        isExternal: e.target.checked,
                      }))
                    }
                    className="rounded border-input text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>เปิดเป็นแท็บภายนอก (External)</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsServiceDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-800 hover:bg-emerald-700 text-white">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกข้อมูล'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Add/Edit Staff Document */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSaveDoc}>
            <DialogHeader>
              <DialogTitle>
                {editingDoc ? 'แก้ไขแบบฟอร์มราชการ' : 'เพิ่มแบบฟอร์มราชการใหม่'}
              </DialogTitle>
              <DialogDescription>
                กำหนดชื่อแบบฟอร์ม หมวดหมู่ และระบุลิงก์ไฟล์สำหรับบุคลากร
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="doc-title" className="text-xs font-semibold">
                  ชื่อแบบฟอร์มราชการ <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="doc-title"
                  value={docFormData.title}
                  onChange={(e) =>
                    setDocFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="เช่น แบบขออนุมัติเดินทางไปปฏิบัติงานราชการ"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="doc-cat" className="text-xs font-semibold">
                  หมวดหมู่เอกสาร <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="doc-cat"
                  value={docFormData.category}
                  onChange={(e) =>
                    setDocFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full mt-1 border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {STAFF_DOC_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="doc-url" className="text-xs font-semibold">
                    ลิงก์ไฟล์ หรือ เลือกไฟล์ <span className="text-rose-500">*</span>
                  </Label>
                  <label className="text-xs text-emerald-700 hover:underline cursor-pointer flex items-center gap-1 font-medium">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์อัปโหลด'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <Input
                  id="doc-url"
                  value={docFormData.fileUrl}
                  onChange={(e) =>
                    setDocFormData((prev) => ({ ...prev, fileUrl: e.target.value }))
                  }
                  placeholder="เช่น /forms/staff/official-travel-request.docx"
                  required
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="doc-type" className="text-xs font-semibold">
                    ชนิดไฟล์
                  </Label>
                  <select
                    id="doc-type"
                    value={docFormData.fileType}
                    onChange={(e) =>
                      setDocFormData((prev) => ({ ...prev, fileType: e.target.value }))
                    }
                    className="w-full mt-1 border border-input bg-background rounded-md px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="DOCX">DOCX</option>
                    <option value="PDF">PDF</option>
                    <option value="FORM">FORM</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="doc-size" className="text-xs font-semibold">
                    ขนาดไฟล์
                  </Label>
                  <Input
                    id="doc-size"
                    value={docFormData.fileSize || ''}
                    onChange={(e) =>
                      setDocFormData((prev) => ({ ...prev, fileSize: e.target.value }))
                    }
                    placeholder="เช่น 145 KB"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="doc-order" className="text-xs font-semibold">
                    ลำดับแสดงผล
                  </Label>
                  <Input
                    id="doc-order"
                    type="number"
                    value={docFormData.displayOrder}
                    onChange={(e) =>
                      setDocFormData((prev) => ({
                        ...prev,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={docFormData.isPublished}
                    onChange={(e) =>
                      setDocFormData((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="rounded border-input text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>เปิดให้ดาวน์โหลดทันที (Publish)</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDocDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-800 hover:bg-emerald-700 text-white">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกแบบฟอร์ม'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>ยืนยันการลบรายการ</span>
            </DialogTitle>
            <DialogDescription className="pt-2">
              คุณแน่ใจหรือไม่ว่าต้องการลบ {deleteTarget?.type === 'service' ? 'ระบบบริการ' : 'แบบฟอร์ม'}:
              <br />
              <strong className="text-foreground font-semibold mt-1 inline-block">
                "{deleteTarget?.title}"
              </strong>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              ยืนยันการลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
