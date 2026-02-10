import React from 'react';
import dynamic from 'next/dynamic';
import Menu from './components/Menu';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Footer from './components/Footer';
import CtaSection from './components/CtaSection';
import Head from 'next/head';

const InteractiveHero = dynamic(() => import('./components/InteractiveHero'), {
  ssr: false,
  loading: () => <div className="min-h-[calc(100dvh-4rem)] bg-slate-900 animate-pulse" />
});

const HeroSection = dynamic(() => import('./components/HeroSection'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-800 animate-pulse" />
});

export default function Home() {

  return (
    <>
      <Head>
        <title>Juliano - Programador Web Full Stack</title>
        <meta name="description" content="Portfolio de Juliano, desenvolvedor Full Stack especializado em soluções web eficientes e inovadoras. Veja meus projetos e entre em contato." />
        <meta name="keywords" content="desenvolvedor web, full stack, next.js, react, portfolio, juliano" />
        <meta name="author" content="Juliano" />
      </Head>
      <main>

        <InteractiveHero />

        <About />
        <Portfolio />
        <CtaSection />
      </main>
    </>
  );
}
