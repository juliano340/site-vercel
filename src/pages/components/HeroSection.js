import React from 'react';
import TypingEffect from 'react-typing-effect';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="bg-gray-800 text-white h-screen flex flex-col justify-center items-center">
      <img
        src="https://avatars.githubusercontent.com/u/87342139?s=400&u=170c2c96bac22f65feb6a2b2602371dcfcd7841b&v=4"
        alt="Profile Picture"
        width={150}
        height={150}
        className="rounded-full mb-4"
      />
      <h1 className="text-5xl text-center font-bold mb-4">Olá, eu sou um Programador Web!</h1>
      <div className="text-2xl text-center">
        <TypingEffect
          text={["Desenvolvedor Front-end", "Desenvolvedor Back-end", "Desenvolvedor Full Stack!"]}
          speed={100}
          eraseSpeed={50}
          eraseDelay={2000}
          typingDelay={500}
          className=""
        />
      </div>
      <p className="mt-6 text-lg text-center text-gray-400">Criando soluções web eficientes e inovadoras.</p>
      <Link href="/contato" passHref>
        <div className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-700 cursor-pointer transition duration-300 ease-in-out">
          Entre em Contato
        </div>
      </Link>
    </div>
  );
};

export default HeroSection;
