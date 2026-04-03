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
    <section id="about" className="mono-section mono-section-surface">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:72px_72px]"></div>

      <div className="mono-container">
        <div className="mono-section-header">
          <h2 className="mb-4 text-4xl font-bold text-primary md:text-5xl">Sobre Mim</h2>
          <div className="mono-section-rule"></div>
        </div>

        <div className="mono-panel mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Perfil profissional
          </p>
          <p className="mb-6 text-lg leading-relaxed text-muted md:text-xl">
            Sou graduado em <span className="font-semibold text-primary">Sistemas para Internet</span> e entusiasta do
            <span className="font-semibold text-primary"> desenvolvimento web e mobile</span>. Tenho experiência prática com
            <span className="font-semibold text-primary"> front-end, back-end, testes e suporte técnico</span>, e gosto de transformar ideias em soluções digitais funcionais e bem estruturadas.
          </p>
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            Busco constantemente aprender novas tecnologias e aprimorar minhas habilidades para crescer como
            <span className="font-semibold text-primary"> desenvolvedor full-stack</span> e contribuir com projetos que façam a diferença.
          </p>
        </div>

        <div className="mb-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Experiencia</p>
            <h3 className="mt-3 text-3xl font-bold text-primary">Experiência Profissional</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {experiences.map((exp, index) => (
              <div key={index} className="mono-frame bg-background p-6">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-subtle bg-surface text-primary">
                    {exp.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Experiencia</p>
                    <h4 className="mt-2 mb-1 text-xl font-bold text-primary">{exp.company}</h4>
                    <p className="text-muted">{exp.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-subtle pt-4">
                  {exp.hot && (
                    <span className="mono-tag">HOT EXPERIENCE</span>
                  )}
                  {exp.learning && (
                    <span className="mono-tag">Experiência prática e estudos</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="mono-panel">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Stack principal</p>
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary">
              <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tecnologias
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium text-primary">{skill.name}</span>
                    <span className="text-sm text-muted">{skill.level}%</span>
                  </div>
                  <div className="mono-progress-track">
                    <div className="mono-progress-bar" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mono-panel flex flex-col">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Formacao</p>
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary">
              <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formação
            </h3>
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div>
                <h4 className="mb-2 font-bold text-primary">Sistemas para Internet</h4>
                <p className="mb-3 text-muted">Unisinos</p>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-muted">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-subtle pt-4">
                <h4 className="mb-1 font-bold text-primary">Marketing</h4>
                <p className="mb-2 text-sm text-muted">Graduação</p>
                <h4 className="mb-1 mt-3 font-bold text-primary">MBA Gestão Empresarial e Marketing Digital</h4>
                <p className="text-sm text-muted">Uninter</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="mono-frame bg-surface p-8 h-full">
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold text-primary">Interesses</h3>
            </div>
            <p className="leading-relaxed text-muted">
              Tenho um profundo interesse por programação web, empreendedorismo e marketing digital. Sou um entusiasta dos negócios digitais e busco constantemente me atualizar com as tendências do mercado.
            </p>
          </div>

          <div className="mono-frame bg-surface p-8 h-full">
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-primary">Pessoal</h3>
            </div>
            <p className="leading-relaxed text-muted">
              Como um autêntico gaúcho, aprecio um bom churrasco, uma cerveja gelada com amigos e adoro tomar chimarrão. Além disso, sou praticante de corrida e caminhada, sempre em busca de um estilo de vida saudável e equilibrado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
