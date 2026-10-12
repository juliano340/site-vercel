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
        title="Juliano Pereira | Dev Full Stack — IA e qualidade de software"
        seoTitle="Desenvolvedor Full Stack em Porto Alegre | Juliano Pereira"
        description="IA aplicada com processo de qualidade real — ISO 25010, CMMI, PSP e TDD. Do suporte em produção (Sicredi, Bling ERP) ao código, do conceito ao deploy."
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
