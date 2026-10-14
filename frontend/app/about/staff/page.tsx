import React from 'react';
import { getApiBaseUrl } from '@/lib/api-config';
import { Staff } from '@/lib/staff';
import StaffDirectoryClient from './StaffDirectoryClient';

export const revalidate = 60;

export default async function StaffPage() {
    let initialStaff: Staff[] = [];
    try {
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/api/staff?limit=150`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            const json = await res.json();
            initialStaff = json.data || [];
        }
    } catch (err) {
        console.error('[StaffPage] Error fetching staff during SSR:', err);
    }

    return <StaffDirectoryClient initialStaff={initialStaff} />;
}
