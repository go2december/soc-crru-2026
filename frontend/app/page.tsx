import Hero from "@/components/Hero";
import CurriculumDeck from "@/components/CurriculumDeck";
import StatsDashboard from "@/components/StatsDashboard";
import NewsSection from "@/components/NewsSection";

export default function Home() {
  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-800">
      <Hero />
      <CurriculumDeck />
      <StatsDashboard />
      <NewsSection />
    </div>
  );
}
