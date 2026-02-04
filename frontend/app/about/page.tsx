import React from 'react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-base-200 font-sans text-scholar-text pb-20">
            {/* 1. Hero Section (DaisyUI Hero) */}
            <div className="hero min-h-[450px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop)' }}>
                <div className="hero-overlay bg-scholar-deep/90 bg-opacity-90"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-3xl anime-fade-up">
                        <div className="badge badge-lg badge-outline text-scholar-gold border-scholar-gold mb-6 font-semibold tracking-wider p-4">
                            FACULTY OF SOCIAL SCIENCES
                        </div>
                        <h1 className="mb-5 text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
                            เกี่ยวกับคณะ <br />
                            <span className="text-scholar-gold">มหาวิทยาลัยราชภัฏเชียงราย</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* 2. History (ประวัติความเป็นมา) */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="md:w-1/3 sticky top-24">
                            <h2 className="text-3xl font-bold text-scholar-deep border-l-4 border-scholar-accent pl-4 mb-4">
                                ประวัติความเป็นมา
                            </h2>
                            <p className="text-gray-500">History of the Faculty</p>
                        </div>
                        <div className="md:w-2/3">
                            <div className="card bg-base-100 shadow-xl border border-base-200">
                                <div className="card-body">
                                    <p className="text-lg leading-relaxed text-gray-700">
                                        <strong className="text-scholar-deep">คณะสังคมศาสตร์</strong> ได้ก่อตั้งมาตั้งแต่ปี พ.ศ.2546 โดยเป็นหน่วยงานที่อยู่ภายใต้โครงสร้างภายในของมหาวิทยาลัย มีหน้าที่และการบริหารจัดการศึกษาเทียบเท่ากับหน่วยงานที่อยู่ในโครงสร้างตามกฎหมายของมหาวิทยาลัย ซึ่งปัจจุบันคณะสังคมศาสตร์ ได้พัฒนาให้มีการเรียนการสอนหลักสูตรต่าง ๆ ทั้งระดับปริญญาตรีและบัณฑิตศึกษา จำนวน 7 หลักสูตร
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Identity Grid (Philosophy, Vision, Mission, etc.) */}
            <section className="py-20 bg-base-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-pattern.png')] opacity-5 pointer-events-none"></div>
                <div className="container mx-auto px-4 max-w-6xl relative z-10">

                    {/* Top Row: Philosophy & Vision - Using Cards with colors */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="card bg-scholar-deep text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="card-body">
                                <h3 className="card-title text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="text-4xl">💡</span> ปรัชญา (Philosophy)
                                </h3>
                                <p className="text-lg leading-relaxed text-white/90">
                                    "องค์กรแห่งการบูรณาการองค์ความรู้เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
                                </p>
                            </div>
                        </div>
                        <div className="card bg-scholar-gold text-scholar-deep shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="card-body">
                                <h3 className="card-title text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="text-4xl">👁️</span> วิสัยทัศน์ (Vision)
                                </h3>
                                <p className="text-lg leading-relaxed font-medium">
                                    "บูรณาการองค์ความรู้ในการผลิตบัณฑิตสู่การเป็นนวัตกรสังคม เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Uniqueness & Identity & Core Values - Using Standard Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="card bg-base-200 hover:shadow-lg transition-all border border-transparent hover:border-scholar-gold">
                            <div className="card-body">
                                <h4 className="card-title text-xl font-bold text-scholar-deep mb-3">🌟 เอกลักษณ์</h4>
                                <p className="text-gray-600">
                                    "องค์กรแห่งการเรียนรู้สู่การพัฒนาชุมชน ท้องถิ่น สังคม ประเทศ และนานาชาติ"
                                </p>
                            </div>
                        </div>
                        <div className="card bg-base-200 hover:shadow-lg transition-all border border-transparent hover:border-scholar-gold">
                            <div className="card-body">
                                <h4 className="card-title text-xl font-bold text-scholar-deep mb-3">🎓 อัตลักษณ์</h4>
                                <p className="text-gray-600">
                                    "มีคุณธรรม ความรู้ ความคิดสร้างสรรค์ ทักษะทางสังคม เป็นที่ยอมรับในศตวรรษที่ 21"
                                </p>
                            </div>
                        </div>
                        <div className="card bg-base-200 hover:shadow-lg transition-all border border-transparent hover:border-scholar-gold">
                            <div className="card-body">
                                <h4 className="card-title text-xl font-bold text-scholar-deep mb-3">🤝 ค่านิยม</h4>
                                <p className="text-gray-600">
                                    "บูรณาการศาสตร์ที่หลากหลายสู่การพัฒนาท้องถิ่น"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Mission */}
                    <div className="grid md:grid-cols-1 gap-12">
                        <div className="card bg-base-100 shadow-lg border border-base-200">
                            <div className="card-body">
                                <h3 className="card-title text-2xl font-bold text-scholar-deep mb-6 flex items-center gap-2">
                                    <div className="badge badge-primary badge-lg h-8 w-2 p-0 rounded mr-2"></div>
                                    พันธกิจ (Mission)
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        'ผลิตบัณฑิตที่เป็นนวัตกรมืออาชีพ มีทักษะเด่น มีความรู้ มีคุณธรรม และตอบสนองต่อการพัฒนาท้องถิ่นอย่างยั่งยืน',
                                        'ผลิตผลงานวิจัยและงานสร้างสรรค์เพื่อการนำไปใช้ประโยชน์ในชุมชน ท้องถิ่น ประเทศ และภูมิภาคอาเซียน',
                                        'ให้บริการวิชาการแก่สังคม เพื่อยกระดับคุณภาพชีวิตของประชาชนในท้องถิ่น และประเทศ',
                                        'สืบสานและส่งเสริมศิลปวัฒนธรรมอันดีงามของท้องถิ่นและของชาติ',
                                        'พัฒนาคณะให้เป็นองค์กรแห่งการเรียนรู้ที่มีคุณภาพและมีธรรมาภิบาล'
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-all">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-scholar-deep text-white flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <span className="text-gray-700 text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Call to Action */}
            <div className="bg-neutral text-neutral-content py-12 text-center">
                <h3 className="text-2xl font-bold mb-4">สอบถามข้อมูลเพิ่มเติม</h3>
                <p className="mb-6 opacity-70">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</p>
                <a href="/contact" className="btn btn-outline btn-wide text-white hover:bg-white hover:text-neutral">ติดต่อเรา</a>
            </div>
        </main>
    );
}
