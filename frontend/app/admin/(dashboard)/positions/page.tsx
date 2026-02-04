'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { adminPositionService, AdminPosition } from '@/services/adminPositionService';

export default function AdminPositionsPage() {
    const [positions, setPositions] = useState<AdminPosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ nameTh: '', nameEn: '', level: 0 });

    const fetchPositions = async () => {
        try {
            const data = await adminPositionService.getAll();
            setPositions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const handleOpen = (pos?: AdminPosition) => {
        if (pos) {
            setEditingId(pos.id);
            setFormData({ nameTh: pos.nameTh, nameEn: pos.nameEn || '', level: pos.level || 0 });
        } else {
            setEditingId(null);
            setFormData({ nameTh: '', nameEn: '', level: 0 });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminPositionService.update(editingId, formData);
            } else {
                await adminPositionService.create(formData);
            }
            fetchPositions();
            setIsDialogOpen(false);
        } catch (error: any) {
            console.error(error);
            alert(`Failed to save: ${error.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await adminPositionService.delete(id);
            fetchPositions();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">จัดการตำแหน่ง/หน้าที่ (Admin Positions)</h1>
                    <p className="text-muted-foreground mt-1">กำหนดรายชื่อตำแหน่งบริหารและหน้าที่ต่างๆ สำหรับให้เลือกในระบบบุคลากร</p>
                </div>
                <Button onClick={() => handleOpen()} className="shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4 mr-2" /> เพิ่มตำแหน่ง</Button>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead className="w-[100px]">Level</TableHead>
                            <TableHead>ชื่อตำแหน่ง (TH)</TableHead>
                            <TableHead>Name (EN)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                        ) : positions.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">ยังไม่มีข้อมูลตำแหน่ง</TableCell></TableRow>
                        ) : (
                            positions.map(pos => (
                                <TableRow key={pos.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{pos.id}</TableCell>
                                    <TableCell><div className="badge badge-outline">{pos.level}</div></TableCell>
                                    <TableCell className="font-semibold">{pos.nameTh}</TableCell>
                                    <TableCell className="text-muted-foreground">{pos.nameEn}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => handleOpen(pos)}><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(pos.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่งใหม่'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>ชื่อตำแหน่ง (ไทย) <span className="text-destructive">*</span></Label>
                            <Input required value={formData.nameTh} onChange={e => setFormData({ ...formData, nameTh: e.target.value })} placeholder="เช่น คณบดี, หัวหน้าสาขา" />
                        </div>
                        <div className="space-y-2">
                            <Label>Position Name (English)</Label>
                            <Input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} placeholder="e.g. Dean, Head of Department" />
                        </div>
                        <div className="space-y-2">
                            <Label>Level / Sorting Order</Label>
                            <Input type="number" value={formData.level} onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })} />
                            <p className="text-xs text-muted-foreground">ตัวเลขสำหรับจัดลำดับความสำคัญ (น้อยไปมาก)</p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>ยกเลิก</Button>
                            <Button type="submit">บันทึก</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
