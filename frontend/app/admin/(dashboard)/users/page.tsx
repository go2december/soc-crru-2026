'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';
import { Pencil, Search, Shield, Trash2 } from 'lucide-react';

interface User {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    roles: string[];
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

// ใช้งานแค่ enum เพื่อแสดงผลและเลือก แต่เก็บจริงเป็น array hierarchy
const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)', desc: 'จัดการทุกอย่างในระบบ', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'EDITOR', label: 'บรรณาธิการ (Editor)', desc: 'จัดการเนื้อหา ข่าว หลักสูตร บุคลากร', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'STAFF', label: 'บุคลากร (Staff)', desc: 'เข้าสู่ระบบและแก้ไขข้อมูลส่วนตัว', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'GUEST', label: 'ผู้เยี่ยมชม (Guest)', desc: 'ไม่มีสิทธิ์จัดการใดๆ', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // สำหรับ Modal เลือก Role แบบ Single Selection
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRoleLevel, setSelectedRoleLevel] = useState<string>('GUEST');

    // Search & Delete
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Fetched Users:', data); // Debug Log
                setUsers(data);
            } else {
                console.error('Fetch Check Failed:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHierarchicalRoles = (role: string): string[] => {
        switch (role) {
            case 'ADMIN': return ['ADMIN', 'EDITOR', 'STAFF'];
            case 'EDITOR': return ['EDITOR', 'STAFF'];
            case 'STAFF': return ['STAFF'];
            default: return [];
        }
    };

    const getPrimaryRole = (roles: string[] | undefined): string => {
        if (!roles || roles.length === 0) return 'GUEST';
        if (roles.includes('ADMIN')) return 'ADMIN';
        if (roles.includes('EDITOR')) return 'EDITOR';
        if (roles.includes('STAFF')) return 'STAFF';
        return 'GUEST';
    };

    const handleSaveRole = async () => {
        if (!selectedUser) return;

        const newRoles = getHierarchicalRoles(selectedRoleLevel);
        const userId = selectedUser.id;

        console.log('Saving Roles:', { userId, newRoles }); // Debug

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setUpdating(userId);

        try {
            const res = await fetch(`${apiUrl}/api/auth/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roles: newRoles }),
            });

            console.log('Update Response:', res.status, res.statusText); // Debug

            if (res.ok) {
                const updatedUser = await res.json();
                console.log('Updated User:', updatedUser); // Debug
                await fetchUsers();

                setSelectedUser(null);
            } else {
                const errorText = await res.text();
                console.error('Update Failed:', errorText); // Debug
                alert(`เกิดข้อผิดพลาด: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating roles:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setUpdating(null);
        }
    };

    const toggleUserActive = async (userId: string, isActive: boolean) => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setUpdating(userId);

        try {
            const res = await fetch(`${apiUrl}/api/auth/users/${userId}/active`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isActive }),
            });

            if (res.ok) {
                await fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user:', error);
        } finally {
            setUpdating(null);
        }
    };

    const confirmDeleteUser = (user: User) => {
        setUserToDelete(user);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        const userId = userToDelete.id;
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setUpdating(userId);

        try {
            const res = await fetch(`${apiUrl}/api/auth/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                await fetchUsers();
                setUserToDelete(null);
            } else {
                alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('th-TH');
    };

    const openEditModal = (user: User) => {
        console.log('Open Edit Modal:', user.id);
        setSelectedUser(user);
        setSelectedRoleLevel(getPrimaryRole(user.roles));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">⚙️ จัดการผู้ใช้และสิทธิ์</h1>
                <p className="opacity-70">กำหนดสิทธิ์การเข้าถึงระบบตามลำดับขั้น (Hierarchy)</p>
            </div>

            {/* Role Legend */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {ROLE_OPTIONS.map(role => (
                    <Card key={role.value} className="border-border/70 shadow-sm">
                        <CardContent className="space-y-2 p-4">
                            <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', role.color)}>{role.value}</span>
                            <p className="text-xs text-muted-foreground">{role.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search Bar */}
            <Card className="border-border/70 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือ อีเมล..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                    ทั้งหมด {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length} คน
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-border/70 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                                    <th className="px-4 py-3 font-medium">ระดับสิทธิ์</th>
                                    <th className="px-4 py-3 font-medium">สถานะ</th>
                                    <th className="px-4 py-3 font-medium">เข้าสู่ระบบล่าสุด</th>
                                    <th className="px-4 py-3 font-medium">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter(user =>
                                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((user) => {
                                        const primaryRole = getPrimaryRole(user.roles);
                                        const roleInfo = ROLE_OPTIONS.find(r => r.value === primaryRole);

                                        return (
                                            <tr key={user.id} className={cn('border-b align-middle', !user.isActive && 'opacity-50')}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold">
                                                            {user.avatar ? (
                                                                <img src={user.avatar} alt={user.name || ''} className="h-full w-full object-cover" />
                                                            ) : (
                                                                user.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{user.name || '-'}</div>
                                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', roleInfo?.color || 'bg-slate-100 text-slate-700 border-slate-200')}>
                                                        {primaryRole}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                                        checked={user.isActive}
                                                        onChange={(e) => toggleUserActive(user.id, e.target.checked)}
                                                        disabled={updating === user.id}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-sm">{formatDate(user.lastLoginAt)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => openEditModal(user)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-primary"
                                                            disabled={updating === user.id}
                                                            title="แก้ไขสิทธิ์"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => confirmDeleteUser(user)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            disabled={updating === user.id}
                                                            title="ลบผู้ใช้"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">ไม่พบข้อมูลผู้ใช้</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบผู้ใช้</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ <strong>{userToDelete?.name || userToDelete?.email}</strong>? การกระทำนี้ไม่สามารถย้อนกลับได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setUserToDelete(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={updating === userToDelete?.id}>
                            {updating === userToDelete?.id ? 'กำลังลบ...' : 'ยืนยันลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedUser} onOpenChange={(open) => { if (!open) setSelectedUser(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ปรับระดับสิทธิ์: {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            เลือกระดับสิทธิ์แบบ hierarchy สำหรับบัญชีผู้ใช้นี้
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">เลือกระดับสิทธิ์ (Hierarchy)</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={selectedRoleLevel}
                                onChange={(e) => setSelectedRoleLevel(e.target.value)}
                            >
                                {ROLE_OPTIONS.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <Shield className="mr-1 inline h-4 w-4" />
                            {ROLE_OPTIONS.find(r => r.value === selectedRoleLevel)?.desc}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedUser(null)}>ยกเลิก</Button>
                        <Button onClick={handleSaveRole} disabled={updating === selectedUser?.id}>
                            {updating === selectedUser?.id ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
