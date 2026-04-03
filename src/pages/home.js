import dynamic from 'next/dynamic';
import Head from 'next/head';
import Portfolio from './components/Portfolio';
import About from './components/About';
import CtaSection from './components/CtaSection';

const HeroSection = dynamic(() => import('./components/HeroSectionView'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-800 animate-pulse" />,
});

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Juliano - Programador Web Full Stack</title>
        <meta
          name="description"
          content="Portfolio de Juliano, desenvolvedor Full Stack especializado em soluções web eficientes e inovadoras. Veja meus projetos e entre em contato."
        />
        <meta
          name="keywords"
          content="desenvolvedor web, full stack, next.js, react, portfolio, juliano"
        />
        <meta name="author" content="Juliano" />
      </Head>
      <main>
        <HeroSection />
        <About />
        <Portfolio />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
