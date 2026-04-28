import React from 'react';
import Image from 'next/image';

const About = () => {
  const experiences = [
    {
      number: '01',
      period: 'Ago 2025 — Dez 2025',
      role: 'Analista de Suporte Técnico',
      company: 'LWSA · Bling ERP',
      description:
        'Suporte técnico e integração de sistemas no Bling ERP — equipe de integração com lojas virtuais, marketplaces e serviços logísticos.',
      highlights: [
        'Configuração e parametrização do sistema para clientes',
        'Integrações com marketplaces e operadores logísticos',
        'Visão real de como ERP impacta a operação de PMEs',
      ],
      stack: ['ERP', 'Integrações', 'Marketplaces', 'API REST'],
    },
    {
      number: '02',
      period: 'Dez 2022 — Jun 2025',
      role: 'Programador Web Full Stack',
      company: 'Dataweb Tecnologia',
      description:
        'Desenvolvimento full-stack em sistema ERP com backend C# (.NET) e frontend TypeScript/Angular. Antes, atuei como Analista de Testes e em Suporte Técnico na mesma empresa.',
      highlights: [
        'Funcionalidades e correções em ERP corporativo',
        'Testes de software em ambientes desktop, web e mobile',
        'Documentação técnica e treinamentos para usuários finais',
      ],
      stack: ['TypeScript', 'Angular', 'C#', '.NET', 'SQL'],
    },
    {
      number: '03',
      period: 'Set 2022 — Dez 2022',
      role: 'Programador Web',
      company: 'Agexcom · Unisinos',
      description:
        'Agência de Comunicação Experimental da Unisinos — desenvolvimento de hotsites e blogs com Wordpress e manutenção de sites.',
      highlights: [
        'Desenvolvimento de hotsites e blogs em Wordpress',
        'Contribuição em projetos digitais da agência',
        'Manutenção evolutiva de sites em produção',
      ],
      stack: ['WordPress', 'PHP', 'HTML/CSS', 'JavaScript'],
    },
    {
      number: '04',
      period: 'Fev 2009 — Jan 2020',
      tenure: '11 anos',
      role: 'Suporte Técnico → Analista de Suporte',
      company: 'Sicredi',
      description:
        'Onze anos de evolução interna: de operador de atendimento a analista de suporte. Aqui já resolvia com tech antes do título de dev — automatizando processos, criando dashboards e dando suporte a sistemas críticos do banco.',
      highlights: [
        'Automação de processos administrativos e operacionais',
        'Criação de dashboards gerenciais para tomada de decisão',
        'Suporte técnico a Internet Banking, Cartões e Cobrança',
      ],
      stack: ['Automação', 'Dashboards', 'Suporte N2/N3', 'Operações'],
    },
  ];

  const skillGroups = [
    {
      label: 'IA & Agentes Autônomos',
      highlight: true,
      items: [
        'Claude (Anthropic)',
        'Claude Code',
        'OpenAI Codex',
        'OpenCode',
        'Antigravity (Google)',
        'MCP / Tool Use',
        'Agentes Autônomos',
        'RAG & Prompt Engineering',
      ],
    },
    {
      label: 'Frontend',
      items: ['TypeScript', 'Next.js', 'React', 'Angular', 'Tailwind CSS', 'Ionic'],
    },
    {
      label: 'Backend & Dados',
      items: ['Node.js', 'NestJS', 'Express', 'C# / .NET', 'PostgreSQL', 'Prisma', 'SQLite'],
    },
    {
      label: 'DevOps & Infra',
      items: ['Docker', 'Vercel', 'VPS Linux', 'Nginx', 'PM2', 'CI/CD'],
    },
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
      style={{ background: 'var(--color-background)' }}
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
              color: 'var(--color-accent)',
              marginBottom: '12px',
            }}
          >
            SOBRE MIM
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--color-text)',
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
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:items-start">
            {/* Foto estilizada */}
            <div className="flex justify-center md:justify-start">
              <div
                style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  flexShrink: 0,
                }}
              >
                {/* Glow accent atrás */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.25) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                    zIndex: 0,
                  }}
                />
                {/* Marca de canto (estilo mono) */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '14px',
                    height: '14px',
                    borderTop: '2px solid var(--color-accent)',
                    borderLeft: '2px solid var(--color-accent)',
                    zIndex: 2,
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '14px',
                    height: '14px',
                    borderBottom: '2px solid var(--color-accent)',
                    borderRight: '2px solid var(--color-accent)',
                    zIndex: 2,
                  }}
                />
                {/* Container da foto */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    borderTop: '2px solid var(--color-accent)',
                    background: 'var(--color-surface-alt)',
                    borderRadius: '4px',
                    zIndex: 1,
                  }}
                >
                  <Image
                    src="/images/profile-about.png"
                    alt="Foto de Juliano Pereira"
                    fill
                    sizes="180px"
                    style={{
                      objectFit: 'cover',
                      filter: 'contrast(1.05) saturate(0.9)',
                    }}
                  />
                  {/* Overlay com tom do tema */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(var(--accent-rgb), 0.12) 100%)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Texto */}
            <div>
              <p
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-accent)',
                  marginBottom: '16px',
                }}
              >
                Perfil profissional
              </p>
              <p className="mb-6 text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Sou graduado em{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Sistemas para Internet</span> e entusiasta do{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>desenvolvimento web e mobile</span>. Tenho experiência prática com{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>front-end, back-end, testes e suporte técnico</span>, e gosto de transformar ideias em soluções digitais funcionais e bem estruturadas.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Busco constantemente aprender novas tecnologias e aprimorar minhas habilidades para crescer como{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>desenvolvedor full-stack</span> e contribuir com projetos que façam a diferença.
              </p>
            </div>
          </div>
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
                color: 'var(--color-accent)',
                marginBottom: '8px',
              }}
            >
              Experiência
            </p>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2.5rem',
                color: 'var(--color-text)',
                lineHeight: 0.95,
              }}
            >
              EXPERIÊNCIA PROFISSIONAL
            </h3>
          </div>
          <div className="relative">
            {/* Timeline vertical line */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute"
              style={{
                left: '52px',
                top: '12px',
                bottom: '12px',
                width: '1px',
                background:
                  'linear-gradient(to bottom, rgba(var(--accent-rgb), 0.4) 0%, var(--color-border) 50%, transparent 100%)',
              }}
            />

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <article
                  key={index}
                  className="relative"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                  }}
                >
                  {/* Corner brackets — top-left, bottom-right */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '-1px',
                      left: '-1px',
                      width: '12px',
                      height: '12px',
                      borderTop: '2px solid var(--color-accent)',
                      borderLeft: '2px solid var(--color-accent)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      right: '-1px',
                      width: '12px',
                      height: '12px',
                      borderBottom: '2px solid var(--color-accent)',
                      borderRight: '2px solid var(--color-accent)',
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 p-6 md:p-8">
                    {/* Coluna esquerda — número + período */}
                    <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3">
                      {/* Número grande */}
                      <div
                        className="relative flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '64px',
                          height: '64px',
                          background: 'var(--color-surface-alt)',
                          border: '1px solid var(--color-border)',
                          borderTop: '2px solid var(--color-accent)',
                          borderRadius: '4px',
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '2rem',
                            color: 'var(--color-accent)',
                            lineHeight: 1,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {exp.number}
                        </span>
                      </div>

                      {/* Período + status */}
                      <div className="md:mt-1">
                        <p
                          style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            color: 'var(--color-muted-dim)',
                            marginBottom: '4px',
                          }}
                        >
                          Período
                        </p>
                        <p
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '1.1rem',
                            color: 'var(--color-text)',
                            letterSpacing: '0.05em',
                            lineHeight: 1,
                          }}
                        >
                          {exp.period}
                        </p>
                        {exp.tenure && (
                          <span
                            className="mt-2 inline-block"
                            style={{
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.15em',
                              color: 'var(--color-accent)',
                              background: 'rgba(var(--accent-rgb), 0.08)',
                              border: '1px solid rgba(var(--accent-rgb), 0.25)',
                              borderRadius: '4px',
                              padding: '3px 8px',
                            }}
                          >
                            {exp.tenure}
                          </span>
                        )}
                        {exp.current && (
                          <span
                            className="mt-2 inline-flex items-center gap-1.5"
                            style={{
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.15em',
                              color: 'var(--color-accent)',
                              background: 'rgba(var(--accent-rgb), 0.08)',
                              border: '1px solid rgba(var(--accent-rgb), 0.25)',
                              borderRadius: '4px',
                              padding: '3px 8px',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: 'var(--color-accent)',
                                animation: 'pulse 2s infinite',
                              }}
                            />
                            Atual
                          </span>
                        )}
                        {exp.learning && (
                          <span
                            className="mt-2 inline-block"
                            style={{
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.15em',
                              color: 'var(--tag-text)',
                              background: 'var(--tag-bg)',
                              border: '1px solid var(--tag-border)',
                              borderRadius: '4px',
                              padding: '3px 8px',
                            }}
                          >
                            Estágio
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Coluna direita — conteúdo */}
                    <div>
                      <p
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.18em',
                          color: 'var(--color-muted-dim)',
                          marginBottom: '6px',
                        }}
                      >
                        {exp.company}
                      </p>
                      <h4
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                          color: 'var(--color-text)',
                          lineHeight: 1,
                          letterSpacing: '0.02em',
                          marginBottom: '12px',
                        }}
                      >
                        {exp.role.toUpperCase()}
                      </h4>
                      <p
                        style={{
                          color: 'var(--color-muted)',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          marginBottom: '16px',
                        }}
                      >
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      {exp.highlights?.length > 0 && (
                        <ul className="space-y-2 mb-5">
                          {exp.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2"
                              style={{ color: 'var(--color-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}
                            >
                              <span
                                style={{
                                  color: 'var(--color-accent)',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                  marginTop: '1px',
                                }}
                              >
                                →
                              </span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Stack chips */}
                      {exp.stack?.length > 0 && (
                        <div
                          className="flex flex-wrap gap-2 pt-4"
                          style={{ borderTop: '1px solid var(--color-border)' }}
                        >
                          {exp.stack.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                background: 'var(--color-surface-alt)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Skills + Formação */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skills */}
          <div
            className="p-8 md:p-10"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-accent)',
                marginBottom: '8px',
              }}
            >
              Stack principal
            </p>
            <h3
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              <svg className="h-7 w-7" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tecnologias
            </h3>
            <div className="space-y-6">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 flex items-center gap-2">
                    <p
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: group.highlight ? 'var(--color-accent)' : 'var(--color-muted-dim)',
                      }}
                    >
                      {group.label}
                    </p>
                    {group.highlight && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          color: 'var(--color-accent)',
                          background: 'rgba(var(--accent-rgb), 0.08)',
                          border: '1px solid rgba(var(--accent-rgb), 0.2)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: 'var(--color-accent)',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        Diferencial
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: '4px',
                          background: group.highlight ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--color-surface-alt)',
                          border: `1px solid ${group.highlight ? 'rgba(var(--accent-rgb), 0.25)' : 'var(--color-border)'}`,
                          color: group.highlight ? 'var(--color-accent)' : 'var(--color-text)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formação */}
          <div
            className="p-8 md:p-10 flex flex-col"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-accent)',
                marginBottom: '8px',
              }}
            >
              Formação
            </p>
            <h3
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              <svg className="h-7 w-7" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formação
            </h3>
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div>
                <h4 className="mb-2 font-bold" style={{ color: 'var(--color-text)' }}>Sistemas para Internet</h4>
                <p className="mb-3" style={{ color: 'var(--color-muted)' }}>Unisinos</p>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>→</span>
                      <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <h4 className="mb-1 font-bold" style={{ color: 'var(--color-text)' }}>Marketing</h4>
                <p className="mb-2 text-sm" style={{ color: 'var(--color-muted)' }}>Graduação</p>
                <h4 className="mb-1 mt-3 font-bold" style={{ color: 'var(--color-text)' }}>MBA Gestão Empresarial e Marketing Digital</h4>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Uninter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interesses + Pessoal */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            className="p-8 h-full"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Interesses</h3>
            </div>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
              Tenho um profundo interesse por programação web, empreendedorismo e marketing digital. Sou um entusiasta dos negócios digitais e busco constantemente me atualizar com as tendências do mercado.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Programação Web', 'Empreendedorismo', 'Marketing Digital', 'Negócios Digitais'].map((interest) => (
                <span
                  key={interest}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(var(--accent-rgb), 0.08)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    color: 'var(--color-accent)',
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
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Pessoal</h3>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Como um autêntico gaúcho, aprecio um bom churrasco, uma cerveja gelada com amigos e adoro tomar chimarrão. Além disso, sou praticante de corrida e caminhada, sempre em busca de um estilo de vida saudável e equilibrado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
