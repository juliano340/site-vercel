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
      role: 'Estagiário em Programação Web',
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
    <section
      id="about"
      className="relative overflow-hidden px-4 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
      style={{ background: '#080808' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#C8FF00',
              marginBottom: '12px',
            }}
          >
            SOBRE MIM
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#FFFFFF',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            QUEM SOU EU
          </h2>
        </div>

        {/* Bio */}
        <div
          className="mb-12 p-8 md:p-10"
          style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#C8FF00',
              marginBottom: '16px',
            }}
          >
            Perfil profissional
          </p>
          <p className="mb-6 text-lg leading-relaxed" style={{ color: '#7A7A7A' }}>
            Sou graduado em{' '}
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Sistemas para Internet</span> e entusiasta do{' '}
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>desenvolvimento web e mobile</span>. Tenho experiência prática com{' '}
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>front-end, back-end, testes e suporte técnico</span>, e gosto de transformar ideias em soluções digitais funcionais e bem estruturadas.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: '#7A7A7A' }}>
            Busco constantemente aprender novas tecnologias e aprimorar minhas habilidades para crescer como{' '}
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>desenvolvedor full-stack</span> e contribuir com projetos que façam a diferença.
          </p>
        </div>

        {/* Experiências */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#C8FF00',
                marginBottom: '8px',
              }}
            >
              Experiência
            </p>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2.5rem',
                color: '#FFFFFF',
                lineHeight: 0.95,
              }}
            >
              EXPERIÊNCIA PROFISSIONAL
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="p-6"
                style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderTop: '2px solid #C8FF00',
                  borderRadius: '4px',
                }}
              >
                <div className="mb-5 flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
                    style={{
                      border: '1px solid #1e1e1e',
                      background: '#0D0D0D',
                      color: '#C8FF00',
                      borderRadius: '4px',
                    }}
                  >
                    {exp.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: '#5A5A5A',
                      }}
                    >
                      Experiência
                    </p>
                    <h4
                      className="mt-2 mb-1 text-xl font-bold"
                      style={{ color: '#FFFFFF' }}
                    >
                      {exp.company}
                    </h4>
                    <p style={{ color: '#7A7A7A', fontSize: '0.875rem' }}>{exp.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
                  {exp.hot && (
                    <span className="mono-button-primary" style={{ fontSize: '0.6rem', padding: '4px 12px' }}>
                      HOT EXPERIENCE
                    </span>
                  )}
                  {exp.learning && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#1a1a1a',
                        border: '1px solid #222',
                        color: '#5A5A5A',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        padding: '4px 10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Experiência prática e estudos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills + Formação */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skills */}
          <div
            className="p-8 md:p-10"
            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#C8FF00',
                marginBottom: '8px',
              }}
            >
              Stack principal
            </p>
            <h3
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              <svg className="h-7 w-7" style={{ color: '#C8FF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tecnologias
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium" style={{ color: '#FFFFFF' }}>{skill.name}</span>
                    <span className="text-sm" style={{ color: '#C8FF00' }}>{skill.level}%</span>
                  </div>
                  <div className="mono-progress-track">
                    <div className="mono-progress-bar" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formação */}
          <div
            className="p-8 md:p-10 flex flex-col"
            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#C8FF00',
                marginBottom: '8px',
              }}
            >
              Formação
            </p>
            <h3
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              <svg className="h-7 w-7" style={{ color: '#C8FF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formação
            </h3>
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div>
                <h4 className="mb-2 font-bold" style={{ color: '#FFFFFF' }}>Sistemas para Internet</h4>
                <p className="mb-3" style={{ color: '#7A7A7A' }}>Unisinos</p>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span style={{ color: '#C8FF00', fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>→</span>
                      <span className="text-sm" style={{ color: '#7A7A7A' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
                <h4 className="mb-1 font-bold" style={{ color: '#FFFFFF' }}>Marketing</h4>
                <p className="mb-2 text-sm" style={{ color: '#7A7A7A' }}>Graduação</p>
                <h4 className="mb-1 mt-3 font-bold" style={{ color: '#FFFFFF' }}>MBA Gestão Empresarial e Marketing Digital</h4>
                <p className="text-sm" style={{ color: '#7A7A7A' }}>Uninter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interesses + Pessoal */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            className="p-8 h-full"
            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8" style={{ color: '#C8FF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Interesses</h3>
            </div>
            <p className="leading-relaxed mb-4" style={{ color: '#7A7A7A' }}>
              Tenho um profundo interesse por programação web, empreendedorismo e marketing digital. Sou um entusiasta dos negócios digitais e busco constantemente me atualizar com as tendências do mercado.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Programação Web', 'Empreendedorismo', 'Marketing Digital', 'Negócios Digitais'].map((interest) => (
                <span
                  key={interest}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(200,255,0,0.08)',
                    border: '1px solid rgba(200,255,0,0.15)',
                    color: '#C8FF00',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    padding: '4px 10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div
            className="p-8 h-full"
            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8" style={{ color: '#C8FF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Pessoal</h3>
            </div>
            <p className="leading-relaxed" style={{ color: '#7A7A7A' }}>
              Como um autêntico gaúcho, aprecio um bom churrasco, uma cerveja gelada com amigos e adoro tomar chimarrão. Além disso, sou praticante de corrida e caminhada, sempre em busca de um estilo de vida saudável e equilibrado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
