import Hero from '@/components/Hero';
import CourseFinder from '@/components/CourseFinder';
import StatsDashboard from '@/components/StatsDashboard';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <div className="bg-white font-sans text-scholar-text">
      <Hero />
      <CourseFinder />
      <StatsDashboard />
      <NewsSection />
    </div>
  );
}