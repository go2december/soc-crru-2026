'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import {
    Search,
    UserCog,
    Shield,
    Pencil,
    Trash2,
    Check,
    X
} from "lucide-react";

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

const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)', desc: 'จัดการทุกอย่างในระบบ', variant: 'purple' as const },
    { value: 'EDITOR', label: 'บรรณาธิการ (Editor)', desc: 'จัดการเนื้อหา ข่าว หลักสูตร บุคลากร', variant: 'warning' as const },
    { value: 'STAFF', label: 'บุคลากร (Staff)', desc: 'เข้าสู่ระบบและแก้ไขข้อมูลส่วนตัว', variant: 'info' as const },
    { value: 'GUEST', label: 'ผู้เยี่ยมชม (Guest)', desc: 'ไม่มีสิทธิ์จัดการใดๆ', variant: 'gray' as const },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Modal States
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Selected Data
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRoleLevel, setSelectedRoleLevel] = useState<string>('GUEST');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Search
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
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
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
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

            if (res.ok) {
                await fetchUsers();
                setIsRoleModalOpen(false);
                setSelectedUser(null);
            } else {
                alert(`เกิดข้อผิดพลาด: ${await res.text()}`);
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
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
            if (res.ok) await fetchUsers();
        } catch (error) {
            console.error('Error toggling user:', error);
        } finally {
            setUpdating(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        const userId = userToDelete.id;
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        setUpdating(userId);

        try {
            const res = await fetch(`${apiUrl}/api/auth/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                await fetchUsers();
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            } else {
                alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setUpdating(null);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setSelectedRoleLevel(getPrimaryRole(user.roles));
        setIsRoleModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <UserCog className="w-6 h-6 text-primary" />
                        จัดการผู้ใช้และสิทธิ์
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">กำหนดสิทธิ์การเข้าถึงระบบตามลำดับขั้น (Hierarchy)</p>
                </div>

                {/* Role Legend Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ROLE_OPTIONS.map(role => (
                        <Card key={role.value} className="bg-muted/50 border-none shadow-sm">
                            <CardContent className="p-3">
                                <Badge variant={role.variant} className="mb-1">{role.value}</Badge>
                                <p className="text-xs text-muted-foreground">{role.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาชื่อ หรือ อีเมล..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                    ทั้งหมด {filteredUsers.length} คน
                </div>
            </div>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ผู้ใช้</TableHead>
                                <TableHead>ระดับสิทธิ์</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                        ไม่พบข้อมูลผู้ใช้
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => {
                                    const primaryRole = getPrimaryRole(user.roles);
                                    const roleInfo = ROLE_OPTIONS.find(r => r.value === primaryRole);

                                    return (
                                        <TableRow key={user.id} className={!user.isActive ? 'opacity-50 bg-muted/30' : ''}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar || ''} />
                                                        <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm">{user.name || '-'}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={roleInfo?.variant || 'secondary'}>
                                                    {primaryRole}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleUserActive(user.id, !user.isActive)}
                                                        disabled={updating === user.id}
                                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${user.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${user.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                                    </button>
                                                    <span className="text-xs text-muted-foreground">{user.isActive ? 'Active' : 'Inactive'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(user)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        disabled={updating === user.id}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        disabled={updating === user.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Role Edit Modal */}
            <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ปรับระดับสิทธิ์: {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            เลือกระดับสิทธิ์ที่เหมาะสมสำหรับผู้ใช้นี้
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>ระดับสิทธิ์ (Role Hierarchy)</Label>
                            <Select
                                value={selectedRoleLevel}
                                onChange={(e) => setSelectedRoleLevel(e.target.value)}
                            >
                                {ROLE_OPTIONS.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground border">
                            <Shield className="w-4 h-4 inline mr-2 mb-0.5" />
                            {ROLE_OPTIONS.find(r => r.value === selectedRoleLevel)?.desc}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRoleModalOpen(false)}>ยกเลิก</Button>
                        <Button onClick={handleSaveRole} disabled={updating === selectedUser?.id}>
                            {updating === selectedUser?.id ? 'บันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบผู้ใช้</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ <strong>{userToDelete?.name || userToDelete?.email}</strong>?
                            <br />การกระทำนี้ไม่สามารถย้อนกลับได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>ยกเลิก</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={updating === userToDelete?.id}
                        >
                            ยืนยันลบ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
