import SEO from '@/pages/components/SEO';
import HeroSectionView from '@/pages/components/HeroSectionView';
import FeaturedProject from '@/pages/components/FeaturedProject';
import Portfolio from '@/pages/components/Portfolio';
import ExperienceTimeline from '@/pages/components/ExperienceTimeline';
import CtaSection from '@/pages/components/CtaSection';

const HomePage = () => {
  return (
    <>
      <SEO
        title="Juliano340 | Desenvolvedor Full Stack — Next.js, TypeScript e IA"
        description="Desenvolvedor full stack. Construo MVPs, sistemas e sites com Next.js, TypeScript e IA aplicada — do conceito ao deploy, com comunicação direta."
        path="/home"
      />
      <main id="home-content" tabIndex={-1}>
        <HeroSectionView />
        <FeaturedProject />
        <Portfolio />
        <ExperienceTimeline />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
