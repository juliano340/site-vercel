import React from 'react';

const About = () => {
  return (
    <div id="about" className="bg-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sobre Mim</h2>
        <p className="text-lg text-gray-700 mb-6">
          Sou apaixonado por ajudar empresas a desenvolverem produtos digitais de alta qualidade e inovação.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Formação e Certificações:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Estou cursando Sistemas para Internet na Unisinos, onde também obtive certificações como projetista de interfaces, gestor de projetos e analista de sistemas para internet. Além disso, sou graduado em Marketing com pós-graduação em MBA de Gestão Empresarial e Marketing Digital pela Uninter.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Especialização:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Minha especialidade é o desenvolvimento fullstack com JavaScript, onde posso explorar toda a minha paixão e conhecimento.
            </p>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Experiência Profissional:</h3>
          <p className="text-lg text-gray-700 mb-4">
            Possuo vasta experiência no mercado financeiro e de tecnologia, atuando em empresas de prestação de serviços. Minha jornada profissional é marcada pela entrega de soluções eficientes e inovadoras.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Interesses:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Tenho um profundo interesse por programação web, empreendedorismo e marketing digital. Sou um entusiasta dos negócios digitais e busco constantemente me atualizar com as tendências do mercado.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Pessoal:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Como um autêntico gaúcho, aprecio um bom churrasco, uma cerveja gelada com amigos e adoro tomar chimarrão. Além disso, sou praticante de corrida e caminhada, sempre em busca de um estilo de vida saudável e equilibrado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
