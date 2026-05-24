import Head from 'next/head';
import HeroSectionView from './components/HeroSectionView';
import Portfolio from './components/Portfolio';
import About from './components/About';
import CtaSection from './components/CtaSection';

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
        <meta property="og:url" content="https://www.juliano340.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.juliano340.com" />
      </Head>
      <main>
        <HeroSectionView />
        <About />
        <Portfolio />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
