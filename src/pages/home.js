import SEO from '@/pages/components/SEO';
import HeroExperiment from '@/pages/components/HeroExperiment';
import FeaturedProject from '@/pages/components/FeaturedProject';
import Portfolio from '@/pages/components/Portfolio';
import GitHubActivity from '@/pages/components/GitHubActivity';
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
        <HeroExperiment />
        <FeaturedProject />
        <Portfolio />
        <GitHubActivity />
        <ExperienceTimeline />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
