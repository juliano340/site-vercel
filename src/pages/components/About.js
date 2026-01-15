import React from 'react';

const About = () => {
  const experiences = [
    {
      company: 'Bling ERP',
      role: 'Suporte Técnico',
      hot: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      company: 'Dataweb',
      role: 'Programador Web',
      hot: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      company: 'Agexcom (Unisinos)',
      learning: true,
      role: 'Estagiário de Programação',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const skills = [
    { name: 'JavaScript/TypeScript', level: 90 },
    { name: 'Next.js & React', level: 85 },
    { name: 'Node.js & Express', level: 88 },
    { name: 'NestJS', level: 80 },
    { name: 'C# & .NET', level: 75 },
    { name: 'Angular', level: 70 }
  ];

  const certifications = [
    'Projetista de Interfaces',
    'Gestor de Projetos',
    'Analista de Sistemas para Internet',
    'Programador de Sistemas para Internet',
    'Programador de Dispositivos Móveis'
  ];

  return (
    <div id="about" className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre Mim
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 backdrop-blur-sm bg-opacity-90">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            Sou graduado em <span className="font-semibold text-blue-600">Sistemas para Internet</span> e entusiasta do
            <span className="font-semibold text-blue-600"> desenvolvimento web e mobile</span>. Tenho experiência prática com
            <span className="font-semibold text-blue-600"> front-end, back-end, testes e suporte técnico</span>, e gosto de transformar ideias em soluções digitais funcionais e bem estruturadas.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Busco constantemente aprender novas tecnologias e aprimorar minhas habilidades para crescer como
            <span className="font-semibold text-blue-600"> desenvolvedor full-stack</span> e contribuir com projetos que façam a diferença.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Experiência Profissional</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {exp.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{exp.company}</h4>
                    <p className="text-gray-600 mb-2">{exp.role}</p>
                    {exp.hot && (
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        🔥 HOT EXPERIENCE
                      </span>
                    )}
                    {exp.learning && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        📚 Experiência prática e estudos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tecnologias
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{skill.name}</span>
                    <span className="text-gray-500 text-sm">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formação
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Sistemas para Internet</h4>
                <p className="text-gray-600 mb-3">Unisinos</p>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-1">Marketing</h4>
                <p className="text-gray-600 text-sm mb-2">Graduação</p>
                <h4 className="font-bold text-gray-900 mb-1 mt-3">MBA Gestão Empresarial e Marketing Digital</h4>
                <p className="text-gray-600 text-sm">Uninter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900">Interesses</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Tenho um profundo interesse por programação web, empreendedorismo e marketing digital. Sou um entusiasta dos negócios digitais e busco constantemente me atualizar com as tendências do mercado.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900">Pessoal</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Como um autêntico gaúcho, aprecio um bom churrasco, uma cerveja gelada com amigos e adoro tomar chimarrão. Além disso, sou praticante de corrida e caminhada, sempre em busca de um estilo de vida saudável e equilibrado.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default About;
