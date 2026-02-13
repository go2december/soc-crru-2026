'use client';

import { createContext, useContext } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    roles: string[];
}

interface AdminContextType {
    user: User | null;
}

export const ChiangRaiAdminContext = createContext<AdminContextType>({ user: null });

export function useChiangRaiAdmin() {
    return useContext(ChiangRaiAdminContext);
}
