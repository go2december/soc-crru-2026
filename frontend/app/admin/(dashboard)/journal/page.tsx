'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Mail,
  Loader2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type EditorialRoleGroup =
  | 'ADVISOR'
  | 'EDITOR_IN_CHIEF'
  | 'ASSOCIATE_EDITOR'
  | 'JOURNAL_MANAGER'
  | 'EDITORIAL_BOARD';

export interface EditorialMember {
  id: number;
  name: string;
  roleTitle: string;
  roleGroup: EditorialRoleGroup;
  academicTitle?: string | null;
  position?: string | null;
  institution: string;
  expertise?: string | null;
  email?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ROLE_GROUP_OPTIONS: { value: EditorialRoleGroup; label: string; badgeVariant: 'slate' | 'saffron' | 'lotus' | 'subtle' }[] = [
  { value: 'EDITOR_IN_CHIEF', label: 'บรรณาธิการบริหาร (Editor-in-Chief)', badgeVariant: 'saffron' },
  { value: 'ASSOCIATE_EDITOR', label: 'ผู้ช่วยบรรณาธิการ', badgeVariant: 'slate' },
  { value: 'JOURNAL_MANAGER', label: 'ผู้จัดการวารสาร (Journal Manager)', badgeVariant: 'subtle' },
  { value: 'ADVISOR', label: 'ที่ปรึกษาวารสาร (Advisory Board)', badgeVariant: 'lotus' },
  { value: 'EDITORIAL_BOARD', label: 'กองบรรณาธิการผู้ทรงคุณวุฒิ', badgeVariant: 'subtle' },
];

export default function AdminJournalEditorialPage() {
  const [members, setMembers] = useState<EditorialMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as EditorialRoleGroup,
    academicTitle: '',
    position: '',
    institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
    expertise: '',
    email: '',
    displayOrder: 0,
    isActive: true,
  });

  // Modal Delete
  const [deleteTarget, setDeleteTarget] = useState<EditorialMember | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    try {
      const res = await fetch(`${API_URL}/api/journal/editorial-board/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Fallback to public if token not accepted or not admin
        const fallbackRes = await fetch(`${API_URL}/api/journal/editorial-board`);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setMembers(data);
          return;
        }
        throw new Error('Failed to load editorial board');
      }

      const data = await res.json();
      setMembers(data);
    } catch (err: unknown) {
      console.error(err);
      toast.error('ไม่สามารถโหลดข้อมูลกองบรรณาธิการได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      try {
        const res = await fetch(`${API_URL}/api/journal/editorial-board/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const fallbackRes = await fetch(`${API_URL}/api/journal/editorial-board`);
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            if (!ignore) {
              setMembers(data);
              setLoading(false);
            }
            return;
          }
          throw new Error('Failed to load editorial board');
        }

        const data = await res.json();
        if (!ignore) {
          setMembers(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error(err);
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      roleTitle: 'กองบรรณาธิการ',
      roleGroup: 'EDITORIAL_BOARD',
      academicTitle: '',
      position: '',
      institution: 'มหาวิทยาลัยราชภัฏเชียงราย',
      expertise: '',
      email: '',
      displayOrder: members.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: EditorialMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      roleTitle: member.roleTitle,
      roleGroup: member.roleGroup,
      academicTitle: member.academicTitle || '',
      position: member.position || '',
      institution: member.institution,
      expertise: member.expertise || '',
      email: member.email || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.institution.trim()) {
      toast.error('กรุณาระบุชื่อและสถาบันต้นสังกัด');
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const url = editingMember
        ? `${API_URL}/api/journal/editorial-board/${editingMember.id}`
        : `${API_URL}/api/journal/editorial-board`;

      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }

      toast.success(editingMember ? 'แก้ไขข้อมูลสำเร็จ' : 'เพิ่มรายชื่อสำเร็จ');
      setIsModalOpen(false);
      fetchMembers();
    } catch (err: unknown) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/journal/editorial-board/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');

      toast.success('ลบข้อมูลสำเร็จ');
      setDeleteTarget(null);
      fetchMembers();
    } catch (err: unknown) {
      console.error(err);
      toast.error('ไม่สามารถลบข้อมูลได้');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedOfficialData = async () => {
    if (!confirm('ต้องการดึงและติดตั้งข้อมูลกองบรรณาธิการทางการจากระบบ ThaiJO หรือไม่?')) return;
    setActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/journal/editorial-board/seed`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Seed failed');

      toast.success('เชื่อมต่อและปรับปรุงข้อมูลทางการจาก ThaiJO สำเร็จ');
      fetchMembers();
    } catch (err: unknown) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการติดตั้งข้อมูล');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (roleFilter !== 'ALL' && m.roleGroup !== roleFilter) return false;
      if (statusFilter === 'ACTIVE' && !m.isActive) return false;
      if (statusFilter === 'INACTIVE' && m.isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchInst = m.institution.toLowerCase().includes(q);
        const matchRole = m.roleTitle.toLowerCase().includes(q);
        const matchEmail = (m.email || '').toLowerCase().includes(q);
        return matchName || matchInst || matchRole || matchEmail;
      }

      return true;
    });
  }, [members, roleFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
            <BookOpen className="w-4 h-4" />
            <span>Journal Management System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            จัดการกองบรรณาธิการวารสารสังคมศาสตร์วิชาการ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ระบบจัดการรายนามบรรณาธิการ ที่ปรึกษา และผู้ทรงคุณวุฒิประจำวารสาร (เชื่อมโยงฐานข้อมูล ThaiJO)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSeedOfficialData}
            disabled={actionLoading}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ซิงค์ข้อมูลจริง ThaiJO</span>
          </Button>

          <Button
            type="button"
            onClick={openCreateModal}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มกรรมการ/ผู้ทรงคุณวุฒิ</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                placeholder="ค้นหาชื่อ, สถาบัน, ตำแหน่ง หรืออีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">ทุกกลุ่มบทบาท (All Roles)</option>
                {ROLE_GROUP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">ทุกสถานะ</option>
                <option value="ACTIVE">เปิดใช้งาน (Active)</option>
                <option value="INACTIVE">ปิดใช้งาน (Inactive)</option>
              </select>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('ALL');
                  setStatusFilter('ALL');
                }}
                title="รีเซ็ตตัวกรอง"
                className="h-9 w-9 shrink-0 text-slate-500"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
                <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3 px-4">ตำแหน่งในวารสาร</th>
                <th className="py-3 px-4">กลุ่มบทบาท</th>
                <th className="py-3 px-4">สถาบันต้นสังกัด</th>
                <th className="py-3 px-4">อีเมลประสานงาน</th>
                <th className="py-3 px-4 w-20 text-center">สถานะ</th>
                <th className="py-3 px-4 w-28 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C2410C]" />
                    <span>กำลังโหลดรายนามกองบรรณาธิการ...</span>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-slate-700">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ลองปรับคำค้นหา หรือกดปุ่ม &quot;ซิงค์ข้อมูลจริง ThaiJO&quot; ด้านบน
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const roleConfig = ROLE_GROUP_OPTIONS.find((r) => r.value === member.roleGroup);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-400 font-semibold">
                        {member.displayOrder}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                        {member.position && (
                          <div className="text-[11px] text-slate-500">{member.position}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{member.roleTitle}</span>
                        {member.expertise && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            สาขา: {member.expertise}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={roleConfig?.badgeVariant || 'subtle'} className="text-[10px]">
                          {roleConfig?.label || member.roleGroup}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {member.institution}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="hover:text-[#C2410C] hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 opacity-60" />
                            <span>{member.email}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(member)}
                            className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            title="แก้ไขข้อมูล"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(member)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="ลบข้อมูล"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Create / Edit Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'แก้ไขข้อมูลกรรมการกองบรรณาธิการ' : 'เพิ่มกรรมการ/ผู้ทรงคุณวุฒิวารสาร'}
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลเพื่อแสดงในหน้ารายชื่อกองบรรณาธิการวารสารสังคมศาสตร์วิชาการ
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ชื่อ - นามสกุล (พร้อมคำนำหน้า/ตำแหน่งทางวิชาการ) <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="เช่น ผู้ช่วยศาสตราจารย์ ดร.จามรี พระสุนิล"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  กลุ่มบทบาท (Role Group) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.roleGroup}
                  onChange={(e) => setFormData({ ...formData, roleGroup: e.target.value as EditorialRoleGroup })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {ROLE_GROUP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ชื่อตำแหน่งในวารสาร <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="เช่น บรรณาธิการ, กองบรรณาธิการ, ที่ปรึกษา"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  สถาบันต้นสังกัด (Institution) <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="เช่น มหาวิทยาลัยราชภัฏเชียงราย, มหาวิทยาลัยเชียงใหม่"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ตำแหน่งบริหาร / สังกัดหน่วยงาน
                </label>
                <Input
                  placeholder="เช่น คณบดีคณะสังคมศาสตร์, อาจารย์ประจำ"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  อีเมลประสานงาน (Email)
                </label>
                <Input
                  type="email"
                  placeholder="name@crru.ac.th"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ความเชี่ยวชาญ / สาขาวิชา
                </label>
                <Input
                  placeholder="เช่น สังคมวิทยาและการพัฒนา, ระเบียบวิธีวิจัย"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">ลำดับการแสดงผล</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5 flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-[#C2410C] focus:ring-[#C2410C] h-4 w-4"
                  />
                  <span>เปิดแสดงผลในหน้าเว็บไซต์ (Active)</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={actionLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionLoading}
                className="bg-[#C2410C] hover:bg-[#9A3412] text-white"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                <span>บันทึกข้อมูล</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600">ยืนยันการลบข้อมูล</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อ <strong>&quot;{deleteTarget?.name}&quot;</strong> ออกจากกองบรรณาธิการ? การดำเนินการนี้ไม่สามารถเรียกคืนได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={actionLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              <span>ยืนยันลบข้อมูล</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
