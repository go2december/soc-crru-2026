'use client';

import { useEffect, useState } from 'react';

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
    { value: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)', desc: 'จัดการทุกอย่างในระบบ', color: 'badge-error' },
    { value: 'EDITOR', label: 'บรรณาธิการ (Editor)', desc: 'จัดการเนื้อหา ข่าว หลักสูตร บุคลากร', color: 'badge-warning' },
    { value: 'STAFF', label: 'บุคลากร (Staff)', desc: 'เข้าสู่ระบบและแก้ไขข้อมูลส่วนตัว', color: 'badge-info' },
    { value: 'GUEST', label: 'ผู้เยี่ยมชม (Guest)', desc: 'ไม่มีสิทธิ์จัดการใดๆ', color: 'badge-ghost' },
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

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

            console.log('Update Response:', res.status, res.statusText); // Debug

            if (res.ok) {
                const updatedUser = await res.json();
                console.log('Updated User:', updatedUser); // Debug
                await fetchUsers();

                // Close Native Dialog
                const modal = document.getElementById('role_modal') as HTMLDialogElement | null;
                if (modal) {
                    modal.close();
                }
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

    const confirmDeleteUser = (user: User) => {
        setUserToDelete(user);
        const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
        if (modal) modal.showModal();
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                await fetchUsers();
                const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
                if (modal) modal.close();
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

        // Show Native Dialog
        const modal = document.getElementById('role_modal') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {ROLE_OPTIONS.map(role => (
                    <div key={role.value} className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                        <span className={`badge ${role.color} mb-1`}>{role.value}</span>
                        <p className="text-xs opacity-70">{role.desc}</p>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-sm">
                <div className="form-control w-full max-w-sm">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือ อีเมล..."
                            className="input input-bordered w-full pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-0 top-0 h-full px-3 text-base-content/50">
                            🔍
                        </button>
                    </div>
                </div>
                <div className="text-sm opacity-60">
                    ทั้งหมด {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length} คน
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
                                    <th>ระดับสิทธิ์</th>
                                    <th>สถานะ</th>
                                    <th>เข้าสู่ระบบล่าสุด</th>
                                    <th>จัดการ</th>
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
                                                            <div className="text-xs opacity-60">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${roleInfo?.color || 'badge-ghost'}`}>
                                                        {primaryRole}
                                                    </span>
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
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="btn btn-ghost btn-xs text-primary tooltip"
                                                            data-tip="แก้ไขสิทธิ์"
                                                            disabled={updating === user.id}
                                                        >
                                                            ✎
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDeleteUser(user)}
                                                            className="btn btn-ghost btn-xs text-error tooltip"
                                                            data-tip="ลบผู้ใช้"
                                                            disabled={updating === user.id}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 opacity-50">ไม่พบข้อมูลผู้ใช้</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">ยืนยันการลบผู้ใช้</h3>
                    <p className="py-4">คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ <strong>{userToDelete?.name || userToDelete?.email}</strong>? <br />การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost" onClick={() => setUserToDelete(null)}>ยกเลิก</button>
                        </form>
                        <button
                            className="btn btn-error"
                            onClick={handleDeleteUser}
                            disabled={updating === userToDelete?.id}
                        >
                            {updating === userToDelete?.id ? <span className="loading loading-spinner"></span> : 'ยืนยันลบ'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setUserToDelete(null)}>close</button>
                </form>
            </dialog>

            {/* Standard DaisyUI Modal using <dialog> */}
            <dialog id="role_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setSelectedUser(null)}>✕</button>
                    </form>

                    <h3 className="font-bold text-lg mb-4">ปรับระดับสิทธิ์: {selectedUser?.name}</h3>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">เลือกระดับสิทธิ์ (Hierarchy)</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedRoleLevel}
                            onChange={(e) => setSelectedRoleLevel(e.target.value)}
                        >
                            {ROLE_OPTIONS.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <label className="label">
                            <span className="label-text-alt text-gray-500">
                                {ROLE_OPTIONS.find(r => r.value === selectedRoleLevel)?.desc}
                            </span>
                        </label>
                    </div>

                    <div className="modal-action mt-6">
                        <form method="dialog">
                            <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>ยกเลิก</button>
                        </form>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveRole}
                            disabled={updating === selectedUser?.id}
                        >
                            {updating === selectedUser?.id ? <span className="loading loading-spinner"></span> : 'บันทึก'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setSelectedUser(null)}>close</button>
                </form>
            </dialog>
        </div>
    );
}
