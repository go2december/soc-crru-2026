import Hero from "@/components/Hero";
import CurriculumDeck from "@/components/CurriculumDeck";
import NewsSection from "@/components/NewsSection";
import AdmissionsBanner from "@/components/AdmissionsBanner";
import { getSiteSettings } from "@/lib/site-settings";
import { getActiveBanners } from "@/lib/banners";
import { fetchPrograms } from "@/lib/api";

export default async function Home() {
  const [settings, banners, programs] = await Promise.all([
    getSiteSettings(),
    getActiveBanners(),
    fetchPrograms(),
  ]);

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-800">
      <Hero settings={settings} banners={banners} />
      <CurriculumDeck apiPrograms={programs} />
      <NewsSection />
      <AdmissionsBanner />
    </div>
  );
}
