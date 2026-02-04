export interface AdminPosition {
    id: number;
    nameTh: string;
    nameEn?: string;
    level?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const getAuthHeaders = () => {
    // Client-side only
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const adminPositionService = {
    async getAll(): Promise<AdminPosition[]> {
        // Handle server side rendering basic check
        if (typeof window === 'undefined') return [];

        const res = await fetch(`${API_URL}/api/admin-positions`, {
            headers: getAuthHeaders() as any
        });
        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error('Response body:', text);
            throw new Error(`Failed to fetch positions: ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    async create(data: Omit<AdminPosition, 'id'>) {
        const res = await fetch(`${API_URL}/api/admin-positions`, {
            method: 'POST',
            headers: getAuthHeaders() as any,
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create position');
        return res.json();
    },

    async update(id: number, data: Partial<AdminPosition>) {
        const res = await fetch(`${API_URL}/api/admin-positions/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders() as any,
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update position');
        return res.json();
    },

    async delete(id: number) {
        const res = await fetch(`${API_URL}/api/admin-positions/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders() as any
        });
        if (!res.ok) throw new Error('Failed to delete position');
        return res.json();
    }
};
