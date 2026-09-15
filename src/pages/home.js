import Head from 'next/head';
import HeroSectionView from '@/pages/components/HeroSectionView';
import FeaturedProject from '@/pages/components/FeaturedProject';
import Portfolio from '@/pages/components/Portfolio';
import About from '@/pages/components/About';
import CtaSection from '@/pages/components/CtaSection';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Juliano340 | Dev Full Stack que entrega rápido com IA</title>
        <meta
          name="description"
          content="Desenvolvedor full stack com cabeça de produto e velocidade de IA. Construo MVPs, sistemas e sites com Next.js, TypeScript e Claude/GPT — do brief ao deploy em 2 a 4 semanas."
        />
        <meta name="keywords" content="desenvolvedor full stack, mvp, ia aplicada, next.js, typescript, claude, freelancer dev, juliano" />
        <meta name="author" content="Juliano Pereira" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Juliano340 | Dev Full Stack que entrega rápido" />
        <meta property="og:description" content="MVPs, sistemas e sites construídos com Next.js, TypeScript e IA aplicada. Do brief ao deploy em 2 a 4 semanas." />
        <meta property="og:url" content="https://www.juliano340.com/home" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.juliano340.com/home" />
      </Head>
      <main id="home-content" tabIndex={-1}>
        <HeroSectionView />
        <FeaturedProject />
        <About />
        <Portfolio />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
