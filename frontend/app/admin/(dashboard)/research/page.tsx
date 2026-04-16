'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  FilterX,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Search,
  Target,
  TrendingUp,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AdminPagination from '@/components/AdminPagination';
import {
  RESEARCH_STATUS_LABELS,
  RESEARCH_STATUS_STYLES,
  ResearchListResponse,
  ResearchProjectAdminItem,
  ResearchProjectStatus,
} from '@/lib/research';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface FilterState {
  q: string;
  year: string;
  status: string;
  isPublished: string;
  isSocialService: string;
  isCommercial: string;
}

interface ResearchStats {
  total: number;
  publishedCount: number;
  ongoingCount: number;
  socialServiceCount: number;
  commercialCount: number;
  outputCount: number;
  totalBudget: number;
  socialServicePercent: number;
  commercialPercent: number;
  topSdgs: { sdgId: number; count: number }[];
}

const EMPTY_FILTERS: FilterState = {
  q: '',
  year: '',
  status: '',
  isPublished: '',
  isSocialService: '',
  isCommercial: '',
};

const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 543 - i);

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminResearchPage() {
  const [items, setItems] = useState<ResearchProjectAdminItem[]>([]);
  const [stats, setStats] = useState<ResearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResearchProjectAdminItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<FilterState>(EMPTY_FILTERS);

  const buildParams = useCallback((f: FilterState, page: number) => {
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (f.q.trim()) p.set('q', f.q.trim());
    if (f.year) p.set('year', f.year);
    if (f.status) p.set('status', f.status);
    if (f.isPublished) p.set('isPublished', f.isPublished);
    if (f.isSocialService) p.set('isSocialService', f.isSocialService);
    if (f.isCommercial) p.set('isCommercial', f.isCommercial);
    return p;
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/research/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // non-critical — stats failure shouldn't break the page
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const params = buildParams(filters, currentPage);
      const res = await fetch(`${API_URL}/api/research/admin/projects?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || res.statusText);
      }
      const data = (await res.json()) as ResearchListResponse;
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalCount(data.meta?.total || 0);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการวิจัย');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, buildParams]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = () => { setCurrentPage(1); setFilters({ ...draft }); };
  const handleClear = () => { setDraft(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setCurrentPage(1); };
  const hasFilters = Object.values(filters).some((v) => v !== '');

  const handleExport = async () => {
    setExporting(true);
    const token = localStorage.getItem('admin_token');
    try {
      const params = buildParams(filters, 1);
      params.delete('page');
      params.delete('limit');
      const res = await fetch(`${API_URL}/api/research/admin/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('ส่งออกข้อมูลไม่สำเร็จ');
    } finally {
      setExporting(false);
    }
  };

  const deleteProject = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/research/projects/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      await Promise.all([fetchProjects(), fetchStats()]);
      setDeleteTarget(null);
    } catch {
      alert('เกิดข้อผิดพลาดในการลบโครงการวิจัย');
    }
  };

  const formatBudget = (n: number) =>
    n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FileText className="h-7 w-7 text-primary" /> จัดการฐานข้อมูลงานวิจัย
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการโครงการวิจัย ผลผลิตวิชาการ ทีมวิจัย พื้นที่ดำเนินการ และเอกสารเผยแพร่
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? 'กำลังส่งออก...' : 'Export CSV'}
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/research/create">
              <Plus className="h-4 w-4" /> สร้างโครงการใหม่
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Dashboard Stats ── */}
      {statsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> กำลังโหลดสถิติ...
        </div>
      ) : stats ? (
        <div className="space-y-4">
          {/* Main Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FileText}
              label="จำนวนโครงการทั้งหมด"
              value={stats.total}
              sub={`กำลังดำเนินการ ${stats.ongoingCount} โครงการ`}
              color="bg-blue-500"
            />
            <StatCard
              icon={Globe}
              label="เผยแพร่บนเว็บไซต์"
              value={stats.publishedCount}
              sub={`${stats.total ? Math.round((stats.publishedCount / stats.total) * 100) : 0}% ของทั้งหมด`}
              color="bg-emerald-500"
            />
            <StatCard
              icon={BookOpen}
              label="ผลผลิตวิชาการรวม"
              value={stats.outputCount}
              sub="บทความ / งานตีพิมพ์ทั้งหมด"
              color="bg-violet-500"
            />
            <StatCard
              icon={TrendingUp}
              label="งบประมาณวิจัยรวม"
              value={`${formatBudget(stats.totalBudget)} ฿`}
              sub="จากทุกโครงการในระบบ"
              color="bg-amber-500"
            />
          </div>

          {/* Secondary Row */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Social/Commercial */}
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm">ผลกระทบเชิงยุทธศาสตร์</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">งานวิจัยรับใช้สังคม</span>
                      <span className="font-medium">{stats.socialServiceCount} ({stats.socialServicePercent}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${stats.socialServicePercent}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">งานวิจัยเชิงพาณิชย์</span>
                      <span className="font-medium">{stats.commercialCount} ({stats.commercialPercent}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${stats.commercialPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top SDGs */}
            <Card className="border-border/70 shadow-sm xl:col-span-2">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm">SDGs ที่ใช้มากที่สุด (5 อันดับ)</p>
                </div>
                {stats.topSdgs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล SDGs</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {stats.topSdgs.map((sdg, i) => {
                      const sdgColors = [
                        'bg-red-500', 'bg-amber-500', 'bg-green-500',
                        'bg-blue-500', 'bg-violet-500',
                      ];
                      const maxCount = stats.topSdgs[0]?.count || 1;
                      const pct = Math.round((sdg.count / maxCount) * 100);
                      return (
                        <div key={sdg.sdgId} className="flex flex-col items-center gap-1.5 min-w-[64px]">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-sm ${sdgColors[i] || 'bg-slate-500'}`}>
                            {sdg.sdgId}
                          </div>
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${sdgColors[i] || 'bg-slate-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{sdg.count} โครงการ</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ── Filter Panel ── */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={draft.q}
                onChange={(e) => setDraft((prev) => ({ ...prev, q: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ค้นหาชื่อโครงการ / บทคัดย่อ"
                className="pl-9"
              />
            </div>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.year}
              onChange={(e) => setDraft((prev) => ({ ...prev, year: e.target.value }))}
            >
              <option value="">ทุกปีงบประมาณ</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.status}
              onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">ทุกสถานะ</option>
              {(['ONGOING', 'COMPLETED', 'PUBLISHED', 'CANCELLED'] as ResearchProjectStatus[]).map((s) => (
                <option key={s} value={s}>{RESEARCH_STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.isPublished}
              onChange={(e) => setDraft((prev) => ({ ...prev, isPublished: e.target.value }))}
            >
              <option value="">ทุกการเผยแพร่</option>
              <option value="true">เผยแพร่แล้ว</option>
              <option value="false">ร่าง (ไม่เผยแพร่)</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.isSocialService}
              onChange={(e) => setDraft((prev) => ({ ...prev, isSocialService: e.target.value }))}
            >
              <option value="">งานวิจัยรับใช้สังคม (ทั้งหมด)</option>
              <option value="true">เฉพาะงานรับใช้สังคม</option>
              <option value="false">ไม่ใช่งานรับใช้สังคม</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.isCommercial}
              onChange={(e) => setDraft((prev) => ({ ...prev, isCommercial: e.target.value }))}
            >
              <option value="">เชิงพาณิชย์ (ทั้งหมด)</option>
              <option value="true">เฉพาะเชิงพาณิชย์</option>
              <option value="false">ไม่ใช่เชิงพาณิชย์</option>
            </select>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button type="button" onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" /> ค้นหา
            </Button>
            <Button type="button" variant="ghost" onClick={handleClear} className="gap-2">
              <FilterX className="h-4 w-4" /> ล้างตัวกรอง
            </Button>
            {hasFilters && (
              <span className="text-sm text-muted-foreground">
                พบ <strong>{totalCount}</strong> รายการ
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ชื่อโครงการ</th>
                  <th className="px-4 py-3 font-medium">ปี</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  <th className="px-4 py-3 font-medium">ผลกระทบ</th>
                  <th className="px-4 py-3 font-medium">ทีม / SDGs</th>
                  <th className="px-4 py-3 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t align-top hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium">{item.titleTh}</p>
                        <p className="text-xs text-muted-foreground">slug: {item.slug}</p>
                        {item.fundingSource && (
                          <p className="text-xs text-muted-foreground">แหล่งทุน: {item.fundingSource}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.year}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${RESEARCH_STATUS_STYLES[item.status]}`}>
                          {RESEARCH_STATUS_LABELS[item.status]}
                        </span>
                        <div>
                          {item.isPublished ? (
                            <span className="text-xs text-emerald-600">● เผยแพร่แล้ว</span>
                          ) : (
                            <span className="text-xs text-amber-600">● ร่าง</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {item.isSocialService && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">รับใช้สังคม</span>
                        )}
                        {item.isCommercial && (
                          <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5">เชิงพาณิชย์</span>
                        )}
                        {!item.isSocialService && !item.isCommercial && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                      <p className="mt-1 text-muted-foreground">{item.outputCount} ผลผลิต / {item.attachmentCount} ไฟล์</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <p>{item.memberDisplay.slice(0, 2).join(', ') || 'ยังไม่ระบุทีม'}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.sdgIds.length > 0 ? item.sdgIds.map((sdgId) => (
                          <span key={sdgId} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">SDG {sdgId}</span>
                        )) : <span>-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <Button asChild variant="ghost" size="sm" className="gap-1">
                          <Link href={`/admin/research/edit/${item.id}`}>
                            <Pencil className="h-3.5 w-3.5" /> แก้ไข
                          </Link>
                        </Button>
                        {item.isPublished && (
                          <Button asChild variant="ghost" size="sm" className="gap-1">
                            <Link href={`/research/database/${item.slug}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && items.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {hasFilters ? 'ไม่พบผลลัพธ์ที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีโครงการวิจัยในระบบ'}
            </div>
          )}
        </CardContent>
      </Card>

      <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* ── Delete Dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">ยืนยันการลบโครงการวิจัย</DialogTitle>
            <DialogDescription>
              ต้องการลบ <strong>{deleteTarget?.titleTh}</strong> ใช่หรือไม่?
              <br />
              <span className="mt-1 block text-xs text-muted-foreground">
                การลบจะลบไฟล์เอกสารแนบออกจากเซิร์ฟเวอร์ด้วย ไม่สามารถกู้คืนได้
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={deleteProject}>ยืนยันลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
