import React from 'react';
import Menu from './components/Menu';
import HeroSection from './components/HeroSection';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Footer from './components/Footer';
import CtaSection from './components/CtaSection';
import InteractiveHero from './components/InteractiveHero';

import Head from 'next/head';

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
