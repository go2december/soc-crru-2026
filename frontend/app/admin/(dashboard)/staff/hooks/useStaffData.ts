'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Staff {
    id: string;
    prefixTh: string | null;
    firstNameTh: string;
    lastNameTh: string;
    prefixEn: string | null;
    firstNameEn: string | null;
    lastNameEn: string | null;
    staffType: 'ACADEMIC' | 'SUPPORT';
    academicPosition: string | null;
    adminPosition: string | null;
    education: { level: string; detail: string }[] | null;
    expertise: string[] | null;
    imageUrl: string | null;
    contactEmail: string | null;
    department: string | null;
    departmentId: number | null;
    sortOrder: number;
    userId: string | null;
    isExecutive: boolean;
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

export function useStaffData() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

            const [staffRes, deptRes, usersRes] = await Promise.all([
                fetch(`${apiUrl}/api/staff`),
                fetch(`${apiUrl}/api/departments`),
                fetch(`${apiUrl}/api/auth/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (!staffRes.ok) throw new Error('Failed to fetch staff data');
            if (!deptRes.ok) throw new Error('Failed to fetch departments');

            // Users fetch might fail if not admin, but handled gracefully
            const staffData = await staffRes.json();
            const deptData = await deptRes.json();
            const usersData = usersRes.ok ? await usersRes.json() : [];

            setStaffList(staffData);
            setDepartments(deptData);
            setUsers(usersData);

        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        staffList,
        departments,
        users,
        loading,
        error,
        refetch: fetchData,
        setStaffList // Export for optimistic update if needed
    };
}
