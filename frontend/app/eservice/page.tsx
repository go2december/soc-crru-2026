import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ระบบสารสนเทศ (E-Services) | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description: 'ศูนย์รวมระบบสารสนเทศ บริการสำหรับนักศึกษา บุคลากร และงานจัดซื้อจัดจ้าง คณะสังคมศาสตร์ มรภ.เชียงราย',
};

const HUB_ITEMS = [
  {
    title: 'สำหรับนักศึกษา (Student)',
    desc: 'ระบบลงทะเบียนเรียน ตรวจสอบผลการเรียน และบริการออนไลน์สำหรับนักศึกษา',
    href: '/eservice/student',
    icon: '🎓',
    badge: 'นักศึกษา',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    title: 'สำหรับบุคลากร (Staff)',
    desc: 'ระบบสารบรรณอิเล็กทรอนิกส์ ระบบลางานออนไลน์ ERP/MIS และแบบฟอร์มราชการ',
    href: '/eservice/staff',
    icon: '💼',
    badge: 'บุคลากร',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    title: 'จัดซื้อจัดจ้าง (Procurement)',
    desc: 'ศูนย์ข้อมูลจัดซื้อจัดจ้าง ความโปร่งใส ประกาศพัสดุ TOR และผลการจัดซื้อจัดจ้าง',
    href: '/eservice/procurement',
    icon: '📋',
    badge: 'ความโปร่งใส (ITA)',
    color: 'from-amber-500 to-red-600',
  },
  {
    title: 'ปฏิทินวิชาการ (Academic Calendar)',
    desc: 'กำหนดการสำคัญประจำภาคการศึกษา การลงทะเบียน วันสอบ และวันหยุดราชการ',
    href: '/eservice/calendar',
    icon: '📅',
    badge: 'ปฏิทิน',
    color: 'from-sky-600 to-cyan-700',
  },
];

export default function EServiceHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-scholar-deep via-[#1A264F] to-scholar-deep text-white py-16 px-4 text-center border-b-4 border-scholar-accent">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-white/10 text-scholar-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            Faculty Information Systems
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3">ระบบสารสนเทศ (E-Services)</h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            ศูนย์รวมช่องทางบริการดิจิทัล คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เพื่อความสะดวกรวดเร็วและโปร่งใส
          </p>
        </div>
      </section>

      {/* Grid Menu Cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HUB_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 hover:border-scholar-accent transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-scholar-accent/10 group-hover:to-scholar-gold/20 flex items-center justify-center text-3xl shadow-inner transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-scholar-accent transition-colors mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-scholar-accent group-hover:text-red-700">
                <span>เข้าสู่ระบบบริการ</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
