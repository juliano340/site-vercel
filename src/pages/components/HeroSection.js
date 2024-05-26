import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Bem-vindo ao Meu Site</h1>
        <p className="mt-4 text-lg sm:text-xl lg:text-2xl max-w-2xl">
          Aqui você encontra as melhores soluções para suas necessidades. Explore nossos serviços e produtos.
        </p>
        <a
          href="#services"
          className="mt-8 px-6 py-3 bg-teal-500 text-white rounded-md text-lg sm:text-xl lg:text-2xl transition duration-300 transform hover:bg-teal-700 hover:scale-105"
        >
          Explore Mais
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
