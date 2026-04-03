'use client';

import { useState, useEffect, useCallback } from 'react';

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Staff {
    id: string;
    prefixTh: string | null;
    firstNameTh: string;
    lastNameTh: string;
    prefixEn: string | null;
    firstNameEn: string | null;
    lastNameEn: string | null;
    staffType: 'ACADEMIC' | 'SUPPORT';
    academicPositionId: number | null;
    academicPosition: string | null;
    adminPositionId: number | null;
    adminPosition: string | null;
    education: { level: string; detail: string }[] | null;
    expertise: string[] | null;
    shortBios: string[] | null;
    imageUrl: string | null;
    contactEmail: string | null;
    department: string | null;
    departmentId: number | null;
    sortOrder: number;
    userId: string | null;
    isExecutive: boolean;
}

export interface Position {
    id: number;
    nameTh: string;
    nameEn: string | null;
    sortOrder: number;
}

export interface Department {
    id: number;
    nameTh: string;
    nameEn: string | null;
}

export interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
}

const ITEMS_PER_PAGE = 10;

export function useStaffData() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [academicPositions, setAcademicPositions] = useState<Position[]>([]);
    const [adminPositions, setAdminPositions] = useState<Position[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

            const [staffRes, deptRes, usersRes, academicRes, adminRes] = await Promise.all([
                fetch(`${apiUrl}/api/staff?page=${page}&limit=${ITEMS_PER_PAGE}`),
                fetch(`${apiUrl}/api/departments`),
                fetch(`${apiUrl}/api/auth/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/api/staff/academic-positions`),
                fetch(`${apiUrl}/api/staff/admin-positions`)
            ]);

            if (!staffRes.ok) throw new Error('Failed to fetch staff data');
            if (!deptRes.ok) throw new Error('Failed to fetch departments');

            // Users fetch might fail if not admin, but handled gracefully
            const staffJson = await staffRes.json();
            const staffData = staffJson.data || [];
            const deptData = await deptRes.json();
            const usersData = usersRes.ok ? await usersRes.json() : [];
            const academicData = academicRes.ok ? await academicRes.json() : [];
            const adminData = adminRes.ok ? await adminRes.json() : [];

            setStaffList(staffData);
            setMeta(staffJson.meta || null);
            setDepartments(deptData);
            setUsers(usersData);
            setAcademicPositions(academicData);
            setAdminPositions(adminData);

        } catch (err: unknown) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        staffList,
        meta,
        page,
        setPage,
        departments,
        users,
        academicPositions,
        adminPositions,
        loading,
        error,
        refetch: fetchData,
        setStaffList // Export for optimistic update if needed
    };
}
