'use client';

import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST';
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

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

    const updateUserRole = async (userId: string, role: string) => {
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
                body: JSON.stringify({ role }),
            });

            if (res.ok) {
                await fetchUsers();
            }
        } catch (error) {
            console.error('Error updating role:', error);
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

            if (res.ok) {
                await fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user:', error);
        } finally {
            setUpdating(null);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'badge-error';
            case 'EDITOR': return 'badge-warning';
            case 'STAFF': return 'badge-info';
            default: return 'badge-ghost';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'ผู้ดูแลระบบ';
            case 'EDITOR': return 'บรรณาธิการ';
            case 'STAFF': return 'บุคลากร';
            default: return 'ผู้เยี่ยมชม';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('th-TH');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">⚙️ จัดการผู้ใช้และสิทธิ์</h1>
                <p className="opacity-70">กำหนดสิทธิ์การเข้าถึงระบบสำหรับบุคลากร @crru.ac.th</p>
            </div>

            {/* Role Legend */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-sm">🔑 ระดับสิทธิ์การใช้งาน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                        <div className="flex items-start gap-3">
                            <span className="badge badge-error">ADMIN</span>
                            <div className="text-sm">
                                <p className="font-medium">ผู้ดูแลระบบ</p>
                                <p className="opacity-60">จัดการทุกอย่าง รวมถึงสิทธิ์ผู้ใช้</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="badge badge-warning">EDITOR</span>
                            <div className="text-sm">
                                <p className="font-medium">บรรณาธิการ</p>
                                <p className="opacity-60">จัดการข่าว บุคลากร หลักสูตร</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="badge badge-info">STAFF</span>
                            <div className="text-sm">
                                <p className="font-medium">บุคลากร</p>
                                <p className="opacity-60">ดูและแก้ไขโปรไฟล์ตัวเอง</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="badge badge-ghost">GUEST</span>
                            <div className="text-sm">
                                <p className="font-medium">ผู้เยี่ยมชม</p>
                                <p className="opacity-60">ดูข้อมูลเท่านั้น</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ผู้ใช้</th>
                                    <th>อีเมล</th>
                                    <th>สิทธิ์</th>
                                    <th>สถานะ</th>
                                    <th>เข้าสู่ระบบล่าสุด</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className={!user.isActive ? 'opacity-50' : ''}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name || ''} />
                                                        ) : (
                                                            <div className="bg-primary/20 w-full h-full flex items-center justify-center text-primary font-bold">
                                                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.name || '-'}</div>
                                                    <div className="text-xs opacity-60">ID: {user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                className={`select select-sm select-bordered ${getRoleBadgeClass(user.role)}`}
                                                value={user.role}
                                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                disabled={updating === user.id}
                                            >
                                                <option value="ADMIN">ADMIN - ผู้ดูแลระบบ</option>
                                                <option value="EDITOR">EDITOR - บรรณาธิการ</option>
                                                <option value="STAFF">STAFF - บุคลากร</option>
                                                <option value="GUEST">GUEST - ผู้เยี่ยมชม</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-success toggle-sm"
                                                checked={user.isActive}
                                                onChange={(e) => toggleUserActive(user.id, e.target.checked)}
                                                disabled={updating === user.id}
                                            />
                                        </td>
                                        <td className="text-sm">{formatDate(user.lastLoginAt)}</td>
                                        <td>
                                            {updating === user.id && (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="text-center py-12 opacity-60">
                                <p className="text-lg">ยังไม่มีผู้ใช้ในระบบ</p>
                                <p className="text-sm">ผู้ใช้จะถูกสร้างอัตโนมัติเมื่อ Login ด้วย Google</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
