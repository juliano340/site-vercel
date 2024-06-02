import React from 'react';
import Menu from './components/Menu';
import HeroSection from './components/HeroSection';
import Portfolio from './components/Portfolio';



export default function Home() {
  
  return (
    <main>
      
      <Menu />
      <HeroSection />
      <Portfolio />
      
      
      <div className='bg-slate-500 min-h-screen'>
        

      </div>


    </main>
  );
}
