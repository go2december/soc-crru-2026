import React from 'react';

export default function StructurePage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] font-sans text-scholar-text pb-20">
            {/* Hero Section */}
            <section className="relative h-[350px] w-full bg-scholar-deep flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/80 to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto anime-fade-up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-scholar-gold/20 text-scholar-gold border border-scholar-gold/30 mb-4 font-semibold tracking-wider backdrop-blur-sm">
                        ORGANIZATION
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg">
                        โครงสร้างการบริหาร <br />
                        <span className="text-scholar-gold text-2xl md:text-4xl mt-2 block">คณะสังคมศาสตร์</span>
                    </h1>
                </div>
            </section>

            {/* Organizational Structure Content */}
            <section className="py-20 bg-[#FDFBF7]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold text-center text-scholar-deep mb-12">แผนผังโครงสร้าง (Organization Chart)</h2>

                    {/* Organization Chart Rendering */}
                    <div className="flex flex-col items-center select-none">

                        {/* Level 1: Dean */}
                        <div className="w-72 p-6 bg-scholar-deep text-white rounded-xl shadow-xl text-center relative mb-16 transform hover:scale-105 transition-transform cursor-pointer group z-10">
                            <div className="w-4 h-4 bg-scholar-deep absolute left-1/2 -bottom-2 transform -translate-x-1/2 rotate-45 group-hover:bg-scholar-accent transition-colors"></div>
                            <h3 className="font-bold text-xl mb-1">คณบดีคณะสังคมศาสตร์</h3>
                            <p className="text-sm text-scholar-gold font-medium uppercase tracking-wider">Dean</p>

                            {/* Connector */}
                            <div className="absolute top-full left-1/2 w-0.5 h-16 bg-gray-300 -z-10"></div>
                        </div>

                        {/* Level 2: Deputy Deans Container */}
                        <div className="relative w-full max-w-5xl mb-16">
                            {/* Horizontal Line Connector */}
                            <div className="absolute top-0 left-[16%] right-[16%] h-0.5 bg-gray-300"></div>

                            {/* Vertical Lines to Nodes */}
                            <div className="absolute top-0 left-[16%] w-0.5 h-8 bg-gray-300"></div> {/* Left */}
                            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 transform -translate-x-1/2"></div> {/* Center */}
                            <div className="absolute top-0 right-[16%] w-0.5 h-8 bg-gray-300"></div> {/* Right */}

                            {/* Deputy Deans Cards */}
                            <div className="grid grid-cols-3 gap-8 mt-8">
                                {[
                                    { title: "รองคณบดีฝ่ายวิชาการและวิจัย", sub: "Academic & Research" },
                                    { title: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์", sub: "Admin & Strategy" },
                                    { title: "รองคณบดีฝ่ายกิจการนักศึกษา", sub: "Student Affairs" }
                                ].map((position, idx) => (
                                    <div key={idx} className="bg-white border-t-4 border-scholar-accent rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center relative">
                                        <h4 className="font-bold text-scholar-deep text-sm md:text-base">{position.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{position.sub}</p>
                                        {/* Connector for children (optional/conceptual) */}
                                        <div className="absolute top-full left-1/2 w-0.5 h-8 bg-gray-300 -z-10 bg-gradient-to-b from-gray-300 to-transparent opacity-50"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Level 3: Departments & Offices */}
                        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10">
                            {/* Dean's Office */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-scholar-deep group-hover:bg-scholar-gold transition-colors"></div>
                                <h4 className="font-bold text-xl text-scholar-deep mb-6 flex items-center gap-2 border-b pb-4">
                                    <span>📂</span> สำนักงานคณบดี
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "งานบริหารทั่วไป (General Administration)",
                                        "งานนโยบายและแผน (Policy & Planning)",
                                        "งานการเงินและพัสดุ (Finance & Procurement)",
                                        "งานบริการการศึกษา (Educational Services)"
                                    ].map((job, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            {job}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Academic Programs */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-scholar-accent group-hover:bg-scholar-deep transition-colors"></div>
                                <h4 className="font-bold text-xl text-scholar-deep mb-6 flex items-center gap-2 border-b pb-4">
                                    <span>🎓</span> หลักสูตรและสาขาวิชา
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "สาขาวิชาสังคมศาสตร์ (Social Sciences)",
                                        "สาขาวิชานวัตกรรมการพัฒนาสังคม (Social Dev. Innovation)",
                                        "สาขาวิชาจิตวิทยาสังคม (Social Psychology)",
                                        "สาขาวิชาภูมิศาสตร์และภูมิสารสนเทศ (GIS)",
                                        "สาขาวิชาคหกรรมศาสตร์ (Home Economics)",
                                        "หลักสูตรยุทธศาสตร์การพัฒนาภูมิภาค (ป.โท / ป.เอก)"
                                    ].map((prog, p) => (
                                        <li key={p} className="flex items-center gap-3 text-sm text-gray-600 hover:text-scholar-deep transition-colors cursor-default">
                                            <span className="w-1.5 h-1.5 rounded-full bg-scholar-gold"></span>
                                            {prog}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
