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
import {
    Pencil,
    Search,
    Shield,
    Trash2,
    Users,
    ShieldCheck,
    UserCheck,
    Layers,
    Eye,
    CheckCircle2,
    SlidersHorizontal,
    History,
    RefreshCw,
    Plus,
    Save,
    Check,
    X,
    FolderPlus,
    Lock
} from 'lucide-react';

interface Department {
    id: number;
    nameTh: string;
    nameEn: string | null;
    isAcademicUnit: boolean;
}

interface User {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    roles: string[];
    departmentId?: number | null;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

interface AuditLog {
    id: string;
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    action: string;
    targetResource: string;
    targetId: string | null;
    details: any;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

interface RolePerm {
    id?: number;
    role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST';
    moduleKey: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canApprove: boolean;
    scopeType: string;
}

interface SystemModuleItem {
    id: number;
    key: string;
    nameTh: string;
    description: string | null;
    category: string | null;
    routePath: string | null;
    isWorkflowRequired: boolean;
    isCore: boolean;
    permissions: {
        ADMIN: RolePerm | null;
        EDITOR: RolePerm | null;
        STAFF: RolePerm | null;
        GUEST: RolePerm | null;
    };
}

// ใช้งานแค่ enum เพื่อแสดงผลและเลือก แต่เก็บจริงเป็น array hierarchy
const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)', desc: 'จัดการทุกอย่างในระบบ', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'EDITOR', label: 'บรรณาธิการ (Editor)', desc: 'จัดการเนื้อหา ข่าว หลักสูตร บุคลากร ตามสังกัด', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'STAFF', label: 'บุคลากร (Staff)', desc: 'เข้าสู่ระบบและแก้ไขข้อมูลส่วนตัว', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'GUEST', label: 'ผู้เยี่ยมชม (Guest)', desc: 'ไม่มีสิทธิ์จัดการใดๆ', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

function getPrimaryRole(roles: string[] | undefined): string {
    if (!roles || roles.length === 0) return 'GUEST';
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('EDITOR')) return 'EDITOR';
    if (roles.includes('STAFF')) return 'STAFF';
    return 'GUEST';
}

function getHierarchicalRoles(role: string): string[] {
    switch (role) {
        case 'ADMIN': return ['ADMIN', 'EDITOR', 'STAFF'];
        case 'EDITOR': return ['EDITOR', 'STAFF'];
        case 'STAFF': return ['STAFF'];
        default: return [];
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // สำหรับ Modal เลือก Role & สังกัด
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRoleLevel, setSelectedRoleLevel] = useState<string>('GUEST');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

    // Search, Filters & Tabs
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterDepartment, setFilterDepartment] = useState('ALL');
    const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'audit'>('users');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Audit Logs State
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loadingAudit, setLoadingAudit] = useState(false);
    const [auditFilter, setAuditFilter] = useState('ALL');
    const [retentionStats, setRetentionStats] = useState<{
        retentionPolicyDays: number;
        policyDescription: string;
        totalLogs: number;
        oldestLogDate: string | null;
    } | null>(null);
    const [pruning, setPruning] = useState(false);

    // Dynamic System Modules & Permissions State
    const [systemModules, setSystemModules] = useState<SystemModuleItem[]>([]);
    const [loadingModules, setLoadingModules] = useState(false);
    const [savingPermission, setSavingPermission] = useState<string | null>(null);
    const [showNewModuleModal, setShowNewModuleModal] = useState(false);
    const [newModuleData, setNewModuleData] = useState({
        key: '',
        nameTh: '',
        description: '',
        category: 'Custom',
        isWorkflowRequired: false,
    });
    const [creatingModule, setCreatingModule] = useState(false);

    // KPI Metrics calculation
    const metrics = {
        total: users.length,
        adminCount: users.filter(u => u.roles?.includes('ADMIN')).length,
        editorCount: users.filter(u => getPrimaryRole(u.roles) === 'EDITOR').length,
        staffCount: users.filter(u => getPrimaryRole(u.roles) === 'STAFF').length,
        guestCount: users.filter(u => getPrimaryRole(u.roles) === 'GUEST').length,
        activeCount: users.filter(u => u.isActive).length,
    };

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
        fetchModulesPermissions();
    }, []);

    const fetchDepartments = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/departments`);
            if (res.ok) {
                const data = await res.json();
                setDepartments(data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

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

    const fetchAuditLogs = async () => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setLoadingAudit(true);

        try {
            const res = await fetch(`${apiUrl}/api/auth/audit-logs?limit=150`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setAuditLogs(data);
            } else {
                console.error('Fetch Audit Logs Failed:', res.status);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoadingAudit(false);
        }
    };

    const fetchRetentionStats = async () => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        try {
            const res = await fetch(`${apiUrl}/api/auth/audit-logs/retention`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setRetentionStats(data);
            }
        } catch (error) {
            console.error('Error fetching retention stats:', error);
        }
    };

    const handlePruneLogs = async () => {
        if (!confirm('ยืนยันล้างประวัติที่เก่ากว่า 365 วัน (1 ปี) หรือไม่?')) return;
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setPruning(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/audit-logs/prune`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ days: 365 }),
            });
            if (res.ok) {
                const result = await res.json();
                alert(`ล้างประวัติสำเร็จ ลบไปทั้งหมด ${result.deletedCount} รายการ`);
                fetchAuditLogs();
                fetchRetentionStats();
            } else {
                alert('เกิดข้อผิดพลาดในการล้างประวัติ');
            }
        } catch (error) {
            console.error('Prune error:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setPruning(false);
        }
    };

    const fetchModulesPermissions = async () => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setLoadingModules(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/modules-permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSystemModules(data);
            }
        } catch (error) {
            console.error('Error fetching modules permissions:', error);
        } finally {
            setLoadingModules(false);
        }
    };

    const handleTogglePermission = async (
        moduleKey: string,
        role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST',
        action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canApprove',
        currentVal: boolean,
    ) => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const opKey = `${moduleKey}-${role}-${action}`;
        setSavingPermission(opKey);

        const currentMod = systemModules.find(m => m.key === moduleKey);
        const currentPerm = currentMod?.permissions[role];

        const payload = {
            role,
            moduleKey,
            canCreate: action === 'canCreate' ? !currentVal : !!currentPerm?.canCreate,
            canRead: action === 'canRead' ? !currentVal : (currentPerm ? currentPerm.canRead : true),
            canUpdate: action === 'canUpdate' ? !currentVal : !!currentPerm?.canUpdate,
            canDelete: action === 'canDelete' ? !currentVal : !!currentPerm?.canDelete,
            canApprove: action === 'canApprove' ? !currentVal : !!currentPerm?.canApprove,
            scopeType: currentPerm?.scopeType || (role === 'EDITOR' ? 'DEPARTMENT' : 'GLOBAL'),
        };

        try {
            const res = await fetch(`${apiUrl}/api/auth/permissions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // Update local state optimistically
                setSystemModules(prev =>
                    prev.map(m => {
                        if (m.key !== moduleKey) return m;
                        return {
                            ...m,
                            permissions: {
                                ...m.permissions,
                                [role]: {
                                    ...(m.permissions[role] || { role, moduleKey, scopeType: 'GLOBAL' }),
                                    [action]: !currentVal,
                                },
                            },
                        };
                    })
                );
            } else {
                alert('ไม่สามารถอัปเดตสิทธิ์ได้');
            }
        } catch (error) {
            console.error('Error updating permission:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSavingPermission(null);
        }
    };

    const handleScopeChange = async (
        moduleKey: string,
        role: 'EDITOR' | 'STAFF',
        scopeType: string,
    ) => {
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const currentMod = systemModules.find(m => m.key === moduleKey);
        const currentPerm = currentMod?.permissions[role];

        const payload = {
            role,
            moduleKey,
            canCreate: !!currentPerm?.canCreate,
            canRead: currentPerm ? currentPerm.canRead : true,
            canUpdate: !!currentPerm?.canUpdate,
            canDelete: !!currentPerm?.canDelete,
            canApprove: !!currentPerm?.canApprove,
            scopeType,
        };

        try {
            const res = await fetch(`${apiUrl}/api/auth/permissions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setSystemModules(prev =>
                    prev.map(m => {
                        if (m.key !== moduleKey) return m;
                        return {
                            ...m,
                            permissions: {
                                ...m.permissions,
                                [role]: {
                                    ...(m.permissions[role] || { role, moduleKey, canCreate: false, canRead: true, canUpdate: false, canDelete: false, canApprove: false }),
                                    scopeType,
                                },
                            },
                        };
                    })
                );
            }
        } catch (error) {
            console.error('Error changing scope:', error);
        }
    };

    const handleCreateNewModule = async () => {
        if (!newModuleData.key || !newModuleData.nameTh) {
            alert('กรุณากรอกรหัสโมดูลและชื่อภาษาไทย');
            return;
        }

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setCreatingModule(true);

        try {
            const res = await fetch(`${apiUrl}/api/auth/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newModuleData),
            });

            if (res.ok) {
                alert('เพิ่มโมดูลระบบใหม่เรียบร้อยแล้ว!');
                setShowNewModuleModal(false);
                setNewModuleData({
                    key: '',
                    nameTh: '',
                    description: '',
                    category: 'Custom',
                    isWorkflowRequired: false,
                });
                fetchModulesPermissions();
            } else {
                const err = await res.json();
                alert(err.message || 'เกิดข้อผิดพลาดในการสร้างโมดูล');
            }
        } catch (error) {
            console.error('Error creating module:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setCreatingModule(false);
        }
    };

    const handleDeleteModule = async (key: string, nameTh: string) => {
        if (!confirm(`ยืนยันการลบโมดูล '${nameTh}' (${key}) หรือไม่? การลบนี้จะลบการตั้งค่าสิทธิ์ทั้งหมดของโมดูลนี้ด้วย`)) {
            return;
        }

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/auth/modules/${key}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchModulesPermissions();
            } else {
                const err = await res.json();
                alert(err.message || 'ไม่สามารถลบโมดูลได้');
            }
        } catch (error) {
            console.error('Delete module error:', error);
        }
    };

    const handleSaveRole = async () => {
        if (!selectedUser) return;

        const newRoles = getHierarchicalRoles(selectedRoleLevel);
        const userId = selectedUser.id;
        const deptId = selectedDepartmentId ? parseInt(selectedDepartmentId, 10) : null;

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setUpdating(userId);

        try {
            // 1. Update roles
            const resRole = await fetch(`${apiUrl}/api/auth/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roles: newRoles }),
            });

            // 2. Update department
            const resDept = await fetch(`${apiUrl}/api/auth/users/${userId}/department`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ departmentId: deptId }),
            });

            if (resRole.ok && resDept.ok) {
                await fetchUsers();
                setSelectedUser(null);
            } else {
                const errorText = await resRole.text() || await resDept.text();
                alert(`เกิดข้อผิดพลาด: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating roles and department:', error);
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
        setSelectedUser(user);
        setSelectedRoleLevel(getPrimaryRole(user.roles));
        setSelectedDepartmentId(user.departmentId ? user.departmentId.toString() : '');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        const primaryRole = getPrimaryRole(u.roles);
        const matchesRole = filterRole === 'ALL' || primaryRole === filterRole;

        const matchesDept =
            filterDepartment === 'ALL'
                ? true
                : filterDepartment === 'NONE'
                ? !u.departmentId
                : u.departmentId === Number(filterDepartment);

        return matchesSearch && matchesRole && matchesDept;
    });

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-7 h-7 text-primary" /> แดชบอร์ดจัดการสิทธิ์ (RBAC & Access Control)
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        ศูนย์ควบคุมสิทธิ์ผู้ใช้ ขอบเขตประจำสาขาวิชา (Scope) และเมทริกซ์การเข้าถึงระบบสำนักวิชา
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border/60 self-start sm:self-auto">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={cn(
                            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            activeTab === 'users'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Users className="w-3.5 h-3.5" /> รายชื่อผู้ใช้ ({users.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('matrix');
                            if (systemModules.length === 0) fetchModulesPermissions();
                        }}
                        className={cn(
                            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            activeTab === 'matrix'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Layers className="w-3.5 h-3.5" /> เมทริกซ์สิทธิ์รายโมดูล ({systemModules.length > 0 ? systemModules.length : '9+'})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('audit');
                            if (auditLogs.length === 0) fetchAuditLogs();
                            if (!retentionStats) fetchRetentionStats();
                        }}
                        className={cn(
                            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            activeTab === 'audit'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <History className="w-3.5 h-3.5 text-primary" /> ประวัติความปลอดภัย (Audit)
                    </button>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-4 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-medium">ผู้ใช้ทั้งหมด</span>
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                        <div className="text-[11px] text-green-600 font-medium">เปิดใช้งาน {metrics.activeCount} บัญชี</div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm border-l-4 border-l-red-500">
                    <CardContent className="p-4 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-medium">ผู้ดูแลระบบ (Admin)</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Level 3</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">{metrics.adminCount}</div>
                        <div className="text-[11px] text-muted-foreground">สิทธิ์เต็มทุกโมดูล</div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm border-l-4 border-l-amber-500">
                    <CardContent className="p-4 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-medium">บรรณาธิการ (Editor)</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Level 2</span>
                        </div>
                        <div className="text-2xl font-bold text-amber-600">{metrics.editorCount}</div>
                        <div className="text-[11px] text-muted-foreground">จำกัดตามสังกัดสาขา</div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm border-l-4 border-l-blue-500">
                    <CardContent className="p-4 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-medium">บุคลากร (Staff)</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Level 1</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{metrics.staffCount}</div>
                        <div className="text-[11px] text-muted-foreground">ดูสถิติ/ผลงานตนเอง</div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm border-l-4 border-l-slate-400 col-span-2 sm:col-span-1">
                    <CardContent className="p-4 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-medium">ผู้เยี่ยมชม (Guest)</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Level 0</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-600">{metrics.guestCount}</div>
                        <div className="text-[11px] text-muted-foreground">รอการกำหนดสิทธิ์</div>
                    </CardContent>
                </Card>
            </div>

            {activeTab === 'users' ? (
                <>
                    {/* Filter & Search Bar */}
                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="ค้นหาชื่อ หรือ อีเมล..."
                                        className="pl-9 h-9 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Role Filter */}
                                    <select
                                        className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary font-medium"
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                    >
                                        <option value="ALL">บทบาท: ทั้งหมด</option>
                                        <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                                        <option value="EDITOR">EDITOR (บรรณาธิการ)</option>
                                        <option value="STAFF">STAFF (บุคลากร)</option>
                                        <option value="GUEST">GUEST (ผู้เยี่ยมชม)</option>
                                    </select>

                                    {/* Department Filter */}
                                    <select
                                        className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary font-medium max-w-[200px]"
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        <option value="ALL">สังกัด: ทั้งหมด</option>
                                        <option value="NONE">ส่วนกลาง / ไม่ระบุ</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id.toString()}>
                                                {dept.nameTh}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground whitespace-nowrap self-end md:self-center">
                                แสดง {filteredUsers.length} จากทั้งหมด {users.length} คน
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card className="border-border/70 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                                            <th className="px-4 py-3 font-medium">ระดับสิทธิ์ (Role)</th>
                                            <th className="px-4 py-3 font-medium">สังกัด/ขอบเขต (Department Scope)</th>
                                            <th className="px-4 py-3 font-medium text-center">สถานะ</th>
                                            <th className="px-4 py-3 font-medium">เข้าสู่ระบบล่าสุด</th>
                                            <th className="px-4 py-3 font-medium text-right">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredUsers.map((user) => {
                                            const primaryRole = getPrimaryRole(user.roles);
                                            const roleInfo = ROLE_OPTIONS.find((r) => r.value === primaryRole);
                                            const dept = departments.find((d) => d.id === user.departmentId);

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className={cn(
                                                        'align-middle transition-colors hover:bg-muted/20',
                                                        !user.isActive && 'opacity-50 bg-muted/10'
                                                    )}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold shrink-0">
                                                                {user.avatar ? (
                                                                    <img src={user.avatar} alt={user.name || ''} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    user.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-bold truncate text-foreground">{user.name || '-'}</div>
                                                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={cn(
                                                                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                                                roleInfo?.color || 'bg-slate-100 text-slate-700 border-slate-200'
                                                            )}
                                                        >
                                                            <Shield className="w-3 h-3" />
                                                            {primaryRole}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {dept ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-medium text-foreground">{dept.nameTh}</span>
                                                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                    {dept.isAcademicUnit ? 'สาขาวิชา' : 'หน่วยงาน'}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground italic text-xs">ส่วนกลาง (Global Scope)</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                                                            checked={user.isActive}
                                                            onChange={(e) => toggleUserActive(user.id, e.target.checked)}
                                                            disabled={updating === user.id}
                                                            title={user.isActive ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(user.lastLoginAt)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                onClick={() => openEditModal(user)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-primary hover:bg-primary/10"
                                                                disabled={updating === user.id}
                                                                title="ปรับสิทธิ์และสังกัด"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => confirmDeleteUser(user)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                                    ไม่พบผู้ใช้งานตามเงื่อนไขที่เลือก
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : activeTab === 'matrix' ? (
                /* Dynamic Interactive Permission Matrix View */
                <Card className="border-border/70 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-4 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-primary" /> ศูนย์จัดการสิทธิ์และโมเดลระบบแบบไดนามิก (Dynamic RBAC Engine)
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    เพิ่มโมเดลใหม่ ปรับแต่งสิทธิ์ Create, Edit, Delete, Approve และกำหนดขอบเขตสังกัดแบบเรียลไทม์
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchModulesPermissions}
                                    disabled={loadingModules}
                                    className="h-8 text-xs flex items-center gap-1.5"
                                >
                                    <RefreshCw className={cn("w-3.5 h-3.5", loadingModules && "animate-spin")} />
                                    รีเฟรช
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setShowNewModuleModal(true)}
                                    className="h-8 text-xs flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm"
                                >
                                    <FolderPlus className="w-3.5 h-3.5" />
                                    ➕ เพิ่มโมเดล/โมดูลใหม่
                                </Button>
                            </div>
                        </div>

                        {loadingModules && systemModules.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                                <p className="text-xs text-muted-foreground mt-2">กำลังโหลดรายการโมดูลและสิทธิ์...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="border-b bg-muted/50 text-left text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[200px]">โมดูลและรหัสระบบ</th>
                                            <th className="px-3 py-3 text-red-700 min-w-[130px]">ADMIN (Super)</th>
                                            <th className="px-4 py-3 text-amber-800 min-w-[260px] bg-amber-50/20">
                                                EDITOR (บรรณาธิการ / สาขา)
                                            </th>
                                            <th className="px-4 py-3 text-blue-800 min-w-[230px] bg-blue-50/20">
                                                STAFF (บุคลากรทั่วไป)
                                            </th>
                                            <th className="px-3 py-3 text-slate-600 min-w-[120px]">
                                                GUEST (ผู้เยี่ยมชม)
                                            </th>
                                            <th className="px-3 py-3 text-center min-w-[80px]">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {systemModules.map((mod) => {
                                            const editorPerm = mod.permissions.EDITOR;
                                            const staffPerm = mod.permissions.STAFF;
                                            const guestPerm = mod.permissions.GUEST;

                                            return (
                                                <tr key={mod.key} className="hover:bg-muted/10 transition-colors">
                                                    {/* Module Title & Details */}
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                                                            {mod.nameTh}
                                                            {mod.isCore ? (
                                                                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.2 rounded border border-border">
                                                                    Core
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                                    Custom
                                                                </span>
                                                            )}
                                                            {mod.isWorkflowRequired && (
                                                                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                                                    Workflow
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                                            key: {mod.key} • {mod.category}
                                                        </div>
                                                        {mod.description && (
                                                            <div className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5">
                                                                {mod.description}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* ADMIN Permission: Full Access (Locked) */}
                                                    <td className="px-3 py-3 text-xs text-red-700 font-medium whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-[11px] font-semibold">
                                                            <Lock className="w-3 h-3" /> สิทธิ์เต็ม 100%
                                                        </span>
                                                    </td>

                                                    {/* EDITOR Permission Controls */}
                                                    <td className="px-4 py-3 bg-amber-50/10">
                                                        <div className="space-y-1.5">
                                                            {/* Checkboxes: Create, Edit, Delete, Approve */}
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                                                                        checked={!!editorPerm?.canCreate}
                                                                        onChange={() => handleTogglePermission(mod.key, 'EDITOR', 'canCreate', !!editorPerm?.canCreate)}
                                                                        disabled={savingPermission === `${mod.key}-EDITOR-canCreate`}
                                                                    />
                                                                    <span className="text-[11px]">สร้าง</span>
                                                                </label>
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                                                                        checked={!!editorPerm?.canUpdate}
                                                                        onChange={() => handleTogglePermission(mod.key, 'EDITOR', 'canUpdate', !!editorPerm?.canUpdate)}
                                                                        disabled={savingPermission === `${mod.key}-EDITOR-canUpdate`}
                                                                    />
                                                                    <span className="text-[11px]">แก้ไข</span>
                                                                </label>
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                                                                        checked={!!editorPerm?.canDelete}
                                                                        onChange={() => handleTogglePermission(mod.key, 'EDITOR', 'canDelete', !!editorPerm?.canDelete)}
                                                                        disabled={savingPermission === `${mod.key}-EDITOR-canDelete`}
                                                                    />
                                                                    <span className="text-[11px]">ลบ</span>
                                                                </label>
                                                                {mod.isWorkflowRequired && (
                                                                    <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="rounded border-input text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                                                                            checked={!!editorPerm?.canApprove}
                                                                            onChange={() => handleTogglePermission(mod.key, 'EDITOR', 'canApprove', !!editorPerm?.canApprove)}
                                                                            disabled={savingPermission === `${mod.key}-EDITOR-canApprove`}
                                                                        />
                                                                        <span className="text-[11px] font-semibold text-amber-700">อนุมัติ</span>
                                                                    </label>
                                                                )}
                                                            </div>
                                                            {/* Scope Type Selector */}
                                                            <div className="flex items-center gap-1 pt-0.5">
                                                                <span className="text-[10px] text-muted-foreground">ขอบเขต:</span>
                                                                <select
                                                                    className="h-6 text-[10px] bg-background border border-border rounded px-1.5 focus:outline-none"
                                                                    value={editorPerm?.scopeType || 'GLOBAL'}
                                                                    onChange={(e) => handleScopeChange(mod.key, 'EDITOR', e.target.value)}
                                                                >
                                                                    <option value="GLOBAL">ทั้งหมด (Global)</option>
                                                                    <option value="DEPARTMENT">เฉพาะสาขาตนเอง (Dept Scope)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* STAFF Permission Controls */}
                                                    <td className="px-4 py-3 bg-blue-50/10">
                                                        <div className="space-y-1.5">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                                                        checked={!!staffPerm?.canCreate}
                                                                        onChange={() => handleTogglePermission(mod.key, 'STAFF', 'canCreate', !!staffPerm?.canCreate)}
                                                                        disabled={savingPermission === `${mod.key}-STAFF-canCreate`}
                                                                    />
                                                                    <span className="text-[11px]">สร้าง</span>
                                                                </label>
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                                                        checked={!!staffPerm?.canUpdate}
                                                                        onChange={() => handleTogglePermission(mod.key, 'STAFF', 'canUpdate', !!staffPerm?.canUpdate)}
                                                                        disabled={savingPermission === `${mod.key}-STAFF-canUpdate`}
                                                                    />
                                                                    <span className="text-[11px]">แก้ไข</span>
                                                                </label>
                                                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-input text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                                                        checked={!!staffPerm?.canRead}
                                                                        onChange={() => handleTogglePermission(mod.key, 'STAFF', 'canRead', !!staffPerm?.canRead)}
                                                                        disabled={savingPermission === `${mod.key}-STAFF-canRead`}
                                                                    />
                                                                    <span className="text-[11px]">ดูข้อมูล</span>
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center gap-1 pt-0.5">
                                                                <span className="text-[10px] text-muted-foreground">ขอบเขต:</span>
                                                                <select
                                                                    className="h-6 text-[10px] bg-background border border-border rounded px-1.5 focus:outline-none"
                                                                    value={staffPerm?.scopeType || 'GLOBAL'}
                                                                    onChange={(e) => handleScopeChange(mod.key, 'STAFF', e.target.value)}
                                                                >
                                                                    <option value="GLOBAL">ส่วนกลาง</option>
                                                                    <option value="OWN">เฉพาะข้อมูลตนเอง (Own Only)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* GUEST Permission Controls */}
                                                    <td className="px-3 py-3">
                                                        <label className="inline-flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-input text-slate-600 focus:ring-slate-500 h-3.5 w-3.5"
                                                                checked={!!guestPerm?.canRead}
                                                                onChange={() => handleTogglePermission(mod.key, 'GUEST', 'canRead', !!guestPerm?.canRead)}
                                                                disabled={savingPermission === `${mod.key}-GUEST-canRead`}
                                                            />
                                                            <span className="text-[11px] text-muted-foreground">อนุญาตดู</span>
                                                        </label>
                                                    </td>

                                                    {/* Management Actions */}
                                                    <td className="px-3 py-3 text-center">
                                                        {!mod.isCore && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteModule(mod.key, mod.nameTh)}
                                                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                                title="ลบโมเดลนี้ออกจากระบบ"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                /* Audit Logs View */
                <Card className="border-border/70 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-4 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" /> ประวัติการกระทำและความปลอดภัย (Audit Trail)
                                </h3>
                                <p className="text-xs text-muted-foreground">บันทึกทุกการเปลี่ยนแปลงสิทธิ์ การเปิด/ปิดบัญชี และการลบข้อมูล (Tamper-evident log)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    className="h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none"
                                    value={auditFilter}
                                    onChange={(e) => setAuditFilter(e.target.value)}
                                >
                                    <option value="ALL">ทุกประเภทการกระทำ</option>
                                    <option value="USER_ROLES_UPDATE">การเปลี่ยนสิทธิ์ (Role Update)</option>
                                    <option value="USER_STATUS_TOGGLE">เปิด/ปิดบัญชี (Account Active)</option>
                                    <option value="USER_DEPARTMENT_UPDATE">เปลี่ยนสังกัด (Department Scope)</option>
                                    <option value="USER_DELETED">การลบบัญชีผู้ใช้</option>
                                </select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        fetchAuditLogs();
                                        fetchRetentionStats();
                                    }}
                                    disabled={loadingAudit}
                                    className="h-8 text-xs flex items-center gap-1.5"
                                >
                                    <RefreshCw className={cn("w-3.5 h-3.5", loadingAudit && "animate-spin")} />
                                    รีเฟรช
                                </Button>
                            </div>
                        </div>

                        {/* Retention Policy Banner */}
                        <div className="px-4 py-3 bg-muted/40 border-b border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    🛡️ นโยบายการจัดเก็บ 365 วัน (1 ปี)
                                </span>
                                <span>
                                    ระบบทำการลบประวัติที่เก่ากว่า 1 ปีอัตโนมัติทุก 24 ชม.
                                    {retentionStats && (
                                        <> • ปัจจุบันมีทั้งหมด <strong>{retentionStats.totalLogs}</strong> รายการ</>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePruneLogs}
                                    disabled={pruning}
                                    className="h-7 px-2.5 text-[11px] text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    title="ล้างข้อมูลที่เกิน 365 วันทันที"
                                >
                                    {pruning ? 'กำลังล้าง...' : '🧹 ล้างข้อมูลเก่าเกิน 1 ปีทันที'}
                                </Button>
                            </div>
                        </div>

                        {loadingAudit ? (
                            <div className="py-16 text-center">
                                <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                                <p className="text-xs text-muted-foreground mt-2">กำลังโหลดประวัติ...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead className="border-b bg-muted/40 text-left text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">วันและเวลา</th>
                                            <th className="px-4 py-3">ผู้ดำเนินการ</th>
                                            <th className="px-4 py-3">การกระทำ (Action)</th>
                                            <th className="px-4 py-3">เป้าหมาย (Resource)</th>
                                            <th className="px-4 py-3">รายละเอียด (Payload Details)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {auditLogs
                                            .filter(log => auditFilter === 'ALL' || log.action === auditFilter)
                                            .map((log) => {
                                                const actionBadgeClass =
                                                    log.action.includes('DELETE')
                                                        ? 'bg-red-100 text-red-700 border-red-200'
                                                        : log.action.includes('ROLES')
                                                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                        : log.action.includes('STATUS')
                                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200';

                                                return (
                                                    <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                                            {formatDate(log.createdAt)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium text-foreground">{log.userName || log.userEmail || 'ระบบ'}</div>
                                                            <div className="text-[11px] text-muted-foreground font-mono">{log.userEmail}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', actionBadgeClass)}>
                                                                {log.action}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs">
                                                            <span className="font-semibold text-foreground uppercase">{log.targetResource}</span>
                                                            {log.targetId && (
                                                                <span className="block font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">
                                                                    ID: {log.targetId}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                            {log.details ? (
                                                                <pre className="bg-muted/50 p-1.5 rounded text-[11px] max-w-xs overflow-x-auto">
                                                                    {JSON.stringify(log.details, null, 1)}
                                                                </pre>
                                                            ) : '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        {auditLogs.filter(log => auditFilter === 'ALL' || log.action === auditFilter).length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                                    ยังไม่มีบันทึกประวัติการกระทำในระบบ
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

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
                        <DialogTitle>ปรับระดับสิทธิ์และสังกัด: {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            เลือกระดับสิทธิ์แบบ hierarchy และสังกัดสำหรับจำกัดขอบเขตการจัดการข้อมูล
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
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

                        <div className="space-y-2 pt-2 border-t border-border">
                            <label className="text-sm font-medium">สังกัด/สาขาวิชา (Department Scope)</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={selectedDepartmentId}
                                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                            >
                                <option value="">ส่วนกลาง / ไม่ระบุสังกัด (ทุกสาขา)</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id.toString()}>
                                        {dept.nameTh} {dept.isAcademicUnit ? '(สาขาวิชา)' : '(หน่วยงาน)'}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                สำหรับผู้ใช้ระดับ Editor จะมีสิทธิ์จัดการเฉพาะเนื้อหาในสังกัดนี้เท่านั้น
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedUser(null)}>ยกเลิก</Button>
                        <Button onClick={handleSaveRole} disabled={updating === selectedUser?.id}>
                            {updating === selectedUser?.id ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: เพิ่มโมเดล/โมดูลระบบใหม่ (Create Dynamic System Module) */}
            <Dialog open={showNewModuleModal} onOpenChange={setShowNewModuleModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FolderPlus className="w-5 h-5 text-primary" /> เพิ่มโมเดล/โมดูลระบบใหม่
                        </DialogTitle>
                        <DialogDescription>
                            ลงทะเบียนโมดูลเพื่อเพิ่มเข้าสู่ระบบ RBAC และกำหนดสิทธิ์การเข้าถึงให้แต่ละบทบาท
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3.5 py-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                                รหัสโมดูล (Module Key) <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="เช่น admissions, media_library, e_forms"
                                value={newModuleData.key}
                                onChange={(e) => setNewModuleData({ ...newModuleData, key: e.target.value })}
                                className="font-mono text-xs"
                            />
                            <p className="text-[10px] text-muted-foreground">ภาษาอังกฤษตัวพิมพ์เล็กและขีดล่างเท่านั้น (a-z, 0-9, _)</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                                ชื่อโมดูลภาษาไทย <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="เช่น ระบบรับสมัครนักศึกษา, คลังภาพและสื่อ"
                                value={newModuleData.nameTh}
                                onChange={(e) => setNewModuleData({ ...newModuleData, nameTh: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">หมวดหมู่โมดูล</label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none"
                                value={newModuleData.category}
                                onChange={(e) => setNewModuleData({ ...newModuleData, category: e.target.value })}
                            >
                                <option value="Academic">วิชาการและการศึกษา (Academic)</option>
                                <option value="Public Relations">การสื่อสารและประชาสัมพันธ์ (PR)</option>
                                <option value="Personnel">บุคลากรและเจ้าหน้าที่ (Personnel)</option>
                                <option value="E-Service">บริการอิเล็กทรอนิกส์ (E-Service)</option>
                                <option value="Management">การบริหารจัดการ (Management)</option>
                                <option value="Custom">อื่นๆ (Custom)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">คำอธิบาย</label>
                            <Input
                                placeholder="ระบุวัตถุประสงค์สั้นๆ ของโมดูลนี้"
                                value={newModuleData.description}
                                onChange={(e) => setNewModuleData({ ...newModuleData, description: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="pt-2 border-t border-border">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                    checked={newModuleData.isWorkflowRequired}
                                    onChange={(e) => setNewModuleData({ ...newModuleData, isWorkflowRequired: e.target.checked })}
                                />
                                <div>
                                    <div className="text-xs font-semibold">มีระบบตรวจอนุมัติ (Approval Workflow)</div>
                                    <div className="text-[10px] text-muted-foreground">
                                        มีขั้นตอนส่งตรวจฉบับร่าง (Draft) ให้ Admin อนุมัติก่อนเผยแพร่จริง
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setShowNewModuleModal(false)}>
                            ยกเลิก
                        </Button>
                        <Button size="sm" onClick={handleCreateNewModule} disabled={creatingModule}>
                            {creatingModule ? 'กำลังบันทึก...' : 'บันทึกและสร้างโมดูล'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
