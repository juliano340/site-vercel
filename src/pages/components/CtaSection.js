// components/CtaSection.js

import Link from 'next/link';

const CtaSection = () => {
  return (
    <div className="bg-blue-600 text-white py-12 flex flex-col items-center justify-center h-[500px]">
      <h2 className="text-3xl font-bold text-center mb-4">Gostou do meu trabalho?</h2>
      <p className="text-lg text-center mb-6">Entre em contato para discutirmos como posso ajudar no seu próximo projeto.</p>
      <Link href="/contato" passHref>
        <div className="px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out">
          Fale comigo aqui!
        </div>
      </Link>
    </div>
  );
};

export default CtaSection;
