
import { CheckCircle, Users, Target, BookOpen, Flag } from 'lucide-react';

export default function AboutHeader({
    title,
    subtitle = "มุ่งมั่นในการรวบรวม อนุรักษ์ และเผยแพร่องค์ความรู้ท้องถิ่น เพื่อสืบสานมรดกทางวัฒนธรรมแห่งล้านนาตะวันออก"
}: {
    title: string,
    subtitle?: string
}) {
    return (
        <div className="bg-[#2e1065] text-white py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-4 border border-orange-500/30 shadow-lg">
                    About Us
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md">{title}</h1>
                <p className="text-purple-200/70 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    {subtitle}
                </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF5FF] to-transparent"></div>
        </div>
    );
}
