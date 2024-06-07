// pages/404.js

import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404 - Página não encontrada</h1>
      <p className="mt-4 text-gray-700">Desculpe, a página que você está procurando não existe.</p>
      <Link href="/" passHref>
        <div className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer">
          Voltar para a Home
        </div>
      </Link>
    </div>
  );
};

export default Custom404;
