import React from 'react';
import Menu from './components/Menu';
import HeroSection from './components/HeroSection';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Footer from './components/Footer';
import CtaSection from './components/CtaSection';
import InteractiveHero from './components/InteractiveHero';


export default function Home() {

  return (
    <main>

      <InteractiveHero />

      <About />
      <Portfolio />
      <CtaSection />
    </main>
  );
}
