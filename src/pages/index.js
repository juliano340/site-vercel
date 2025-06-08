import React from 'react';
import Menu from './components/Menu';
import HeroSection from './components/HeroSection';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Footer from './components/Footer';
import CtaSection from './components/CtaSection';

export default function Home() {
  
  return (
    <main>           
      <HeroSection />
      <About />
      <Portfolio />
      <CtaSection />
    </main>
  );
}
