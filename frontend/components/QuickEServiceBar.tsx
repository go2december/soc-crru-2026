import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ClipboardList,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

const QUICK_SERVICES = [
  {
    title: "บริการนักศึกษา",
    subtitle: "คำร้อง ทุนการศึกษา และเอกสารสำคัญ",
    href: "/eservice/student",
    icon: GraduationCap,
  },
  {
    title: "บริการบุคลากร",
    subtitle: "แบบฟอร์ม งานบุคคล และระบบภายใน",
    href: "/eservice/staff",
    icon: Briefcase,
  },
  {
    title: "ประกาศจัดซื้อจัดจ้าง",
    subtitle: "ราคากลาง และประกาศจัดซื้อภาครัฐ",
    href: "/eservice/procurement",
    icon: ClipboardList,
  },
  {
    title: "ปฏิทินวิชาการ",
    subtitle: "กำหนดการลงทะเบียน สอบ และกิจกรรม",
    href: "/eservice/calendar",
    icon: CalendarDays,
  },
];

export default function QuickEServiceBar() {
  return (
    <section className="bg-white border-b border-slate-200/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_SERVICES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between gap-3 p-4 rounded-sm border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-[#C2410C]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-sm bg-white border border-slate-200 text-[#C2410C] group-hover:bg-[#C2410C] group-hover:text-white group-hover:border-[#C2410C] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0B132B] group-hover:text-[#C2410C] transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{item.subtitle}</div>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-slate-400 group-hover:text-[#C2410C] shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
