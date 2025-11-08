import React from 'react';

const About = () => {
  return (
    <div id="about" className="bg-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sobre Mim</h2>
        <p className="text-lg text-gray-700 mb-6">
          Sou estudante de <span className="font-semibold text-gray-900">Sistemas para Internet</span> e entusiasta do
          <span className="font-semibold text-gray-900"> desenvolvimento web</span>. Tenho experiência prática com
          <span className="font-semibold text-gray-900"> front-end, testes e suporte técnico</span>, e gosto de transformar ideias em soluções digitais funcionais e bem estruturadas.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Já atuei em equipes de tecnologia em empresas como <span className="font-semibold text-gray-900">Bling ERP</span>,
          <span className="font-semibold text-gray-900"> Dataweb</span> e <span className="font-semibold text-gray-900">Agexcom (Unisinos)</span>,
          sempre focando em oferecer uma boa experiência ao usuário e colaborar com times multidisciplinares.
        </p>
        <p className="text-lg text-gray-700 pb-10">
          Busco constantemente aprender novas tecnologias e aprimorar minhas habilidades para crescer como
          <span className="font-semibold text-gray-900"> desenvolvedor full-stack</span> e contribuir com projetos que façam a diferença.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Formação e Certificações:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Estou cursando <span className="font-semibold text-gray-900">Sistemas para Internet</span> na
              <span className="font-semibold text-gray-900"> Unisinos</span>, onde também obtive certificações nas seguintes áreas:
            </p>

            <ul className="list-disc list-inside text-lg text-gray-700 mb-4 space-y-1">
              <li>Projetista de Interfaces</li>
              <li>Gestor de Projetos</li>
              <li>Analista de Sistemas para Internet</li>
              <li>Programador de Sistemas para Internet</li>
              <li>Programador de Dispositivos Móveis</li>
            </ul>

            <p className="text-lg text-gray-700 mb-4">
              Além disso, sou graduado em <span className="font-semibold text-gray-900"> Marketing</span> e possuo
              <span className="font-semibold text-gray-900"> MBA em Gestão Empresarial e Marketing Digital</span> pela
              <span className="font-semibold text-gray-900"> Uninter</span>.
            </p>

          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Especialização:</h3>
            <p className="text-lg text-gray-700 mb-4">
              Tenho como foco o <span className="font-semibold text-gray-900">desenvolvimento full stack com JavaScript e TypeScript</span>,
              utilizando frameworks modernos como <span className="font-semibold text-gray-900">Express, NestJS, Next.js</span> e
              <span className="font-semibold text-gray-900"> Angular</span>.
            </p>

            <p className="text-lg text-gray-700 mb-4">
              Também possuo conhecimento em <span className="font-semibold text-gray-900">C#</span> e
              <span className="font-semibold text-gray-900"> .NET</span>, o que amplia minha atuação em diferentes ambientes de desenvolvimento.
            </p>

          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Experiência Profissional:</h3>
          <p className="text-lg text-gray-700 mb-4">
            Minha trajetória profissional combina experiências em tecnologia, atendimento e desenvolvimento web. Iniciei como estagiário de programação na
            <span className="font-semibold text-gray-900"> Agexcom (Unisinos)</span>, onde desenvolvi habilidades em front-end e boas práticas de código.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Em seguida, atuei na
            <span className="font-semibold text-gray-900"> Dataweb</span>, passando por cargos de <span className="italic">suporte técnico</span>,
            <span className="italic">assistente de testes</span> e <span className="italic">programador web</span>. Essa vivência me proporcionou uma visão completa
            do ciclo de desenvolvimento de software e aprimorou minha capacidade de solucionar problemas de forma ágil e eficiente.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Atualmente, integro a equipe de <span className="font-semibold text-gray-900">suporte técnico do Bling ERP</span>, contribuindo para a melhoria contínua
            da plataforma e a satisfação dos usuários.
          </p>
          <p className="text-lg text-gray-700">
            Além disso, acumulo experiências em empresas como
            <span className="font-semibold text-gray-900"> Sicredi</span>,
            <span className="font-semibold text-gray-900"> Appmax</span> e
            <span className="font-semibold text-gray-900"> Atento Brasil</span>, que fortaleceram minhas habilidades em comunicação,
            atendimento ao cliente e resolução de demandas técnicas.
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
