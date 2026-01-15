"use client";

import { useEffect, useState } from 'react';
import { Program, fetchPrograms } from '../lib/api';
import Link from 'next/link';

export default function ProgramList() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrograms = async () => {
            try {
                const data = await fetchPrograms();
                setPrograms(data);
            } catch (error) {
                console.error("Failed to load programs", error);
            } finally {
                setLoading(false);
            }
        };

        loadPrograms();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">กำลังโหลดข้อมูลหลักสูตร...</div>;
    }

    if (programs.length === 0) {
        return null; // Don't show anything if no API connection or empty
    }

    return (
        <div className="mt-16">
            <div className="text-center mb-10">
                <span className="text-scholar-gold font-bold tracking-wider uppercase text-sm mb-2 block">Our Programs</span>
                <h2 className="text-3xl font-bold text-scholar-deep">หลักสูตรทั้งหมด</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                    <div key={program.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${program.degreeLevel === 'BACHELOR' ? 'bg-blue-100 text-blue-700' :
                                    program.degreeLevel === 'MASTER' ? 'bg-purple-100 text-purple-700' :
                                        'bg-red-100 text-red-700'}`}>
                                {program.degreeLevel}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-scholar-deep mb-2 line-clamp-2 min-h-[56px]">
                            {program.nameTh}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 min-h-[60px]">
                            {program.description}
                        </p>
                        <Link href={`/programs/${program.code}`} className="text-scholar-accent font-medium text-sm flex items-center hover:underline">
                            ดูรายละเอียด <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
