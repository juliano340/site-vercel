import React, { useState } from 'react';
import Image from 'next/image';

const EXPERIENCES = [
  {
    period: 'Jun 2026 — Atual',
    role: 'Técnico de Suporte N1',
    company: 'InterOp · TJRS',
    description:
      'Suporte técnico Nível 1 aos usuários do TJRS, com atendimento, diagnóstico inicial, resolução e escalonamento de chamados em sistemas judiciais e plataformas corporativas.',
    stack: ['Suporte N1', 'Service Desk', 'E-Proc', 'PPE', 'SEEU'],
  },
  {
    period: 'Ago 2025 — Dez 2025',
    role: 'Analista de Suporte Técnico',
    company: 'LWSA · Bling ERP',
    description:
      'Suporte técnico e integração de sistemas no Bling ERP — equipe de integração com lojas virtuais, marketplaces e serviços logísticos.',
    stack: ['ERP', 'Integrações', 'Marketplaces', 'API REST'],
  },
  {
    period: 'Dez 2022 — Jun 2025',
    role: 'Suporte → QA → Programador Full Stack',
    company: 'Dataweb Tecnologia',
    description:
      'Evolução interna em três frentes: comecei no help desk (instalação e configuração), migrei para QA com testes manuais em desktop, web e mobile, e finalizei como dev full-stack no ERP — backend C# (.NET) e frontend TypeScript/Angular.',
    stack: ['TypeScript', 'Angular', 'C#', '.NET', 'SQL'],
  },
  {
    period: 'Set 2022 — Dez 2022',
    role: 'Programador Web',
    company: 'Agexcom · Unisinos',
    description:
      'Agência de Comunicação Experimental da Unisinos — desenvolvimento de hotsites e blogs com Wordpress e manutenção de sites.',
    stack: ['WordPress', 'PHP', 'JavaScript'],
  },
  {
    period: 'Jan 2021 — Mar 2022',
    role: 'Customer Experience',
    company: 'Appmax',
    description:
      'Atendimento aos clientes da Appmax, intermediando contato entre empresas parceiras e consumidores finais em temas financeiros e acompanhamento de pedidos.',
    stack: ['CX', 'Atendimento', 'Pagamentos'],
  },
  {
    period: 'Fev 2009 — Jan 2020',
    role: 'Operador → Analista de Suporte',
    company: 'Sicredi',
    description:
      'Onze anos de evolução interna: de operador de atendimento a analista de suporte. Automatização de processos, criação de dashboards e suporte a sistemas críticos do banco.',
    stack: ['Automação', 'Dashboards', 'Suporte N2/N3'],
  },
  {
    period: 'Jan 2006 — Fev 2009',
    role: 'Assistente de Suporte a Internet',
    company: 'Atento Brasil',
    description:
      'Suporte técnico para clientes do provedor Terra, atuando por telefone, chat e e-mail em conexão, e-mail, VoIP e serviços online.',
    stack: ['Suporte Técnico', 'Internet', 'VoIP'],
  },
];

const SKILL_GROUPS = [
  { label: 'IA & Agentes', items: ['Claude', 'Claude Code', 'OpenAI', 'OpenCode', 'MCP / Tool Use', 'RAG'] },
  { label: 'QA & Testes', items: ['Testes Manuais', 'Testes Automatizados', 'TDD · BDD · ATDD', 'Testes de API', 'SAST / DAST'] },
  { label: 'Frontend', items: ['TypeScript', 'Next.js', 'React', 'Angular', 'Tailwind CSS', 'Ionic'] },
  { label: 'Backend & Dados', items: ['Node.js', 'NestJS', 'C# / .NET', 'PostgreSQL', 'Prisma'] },
  { label: 'DevOps & Infra', items: ['Docker', 'Vercel', 'VPS Linux', 'Nginx', 'PM2', 'CI/CD'] },
];

const About = () => {
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const visibleExperiences = showAllExperiences ? EXPERIENCES : EXPERIENCES.slice(0, 4);
  const hiddenExperienceCount = EXPERIENCES.length - visibleExperiences.length;

  return (
    <section
      id="about"
      className="bg-background px-4 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-2xl">
          <p className="ds-label mb-3">03 — Sobre</p>
          <h2 className="ds-h1 text-primary">Quem sou eu</h2>
        </header>

        <div className="mb-16 grid gap-8 md:grid-cols-[1fr_240px] md:items-start">
          <div className="max-w-3xl">
            <p className="ds-body-lg text-muted">
              Sou graduado em <strong className="text-primary">Sistemas para Internet</strong> e pós-graduando em
              <strong className="text-primary"> Engenharia de Qualidade e Teste de Software</strong> na
              <strong className="text-primary"> PUC Minas</strong>. Tenho experiência prática com front-end, back-end,
              testes e suporte técnico — e gosto de transformar ideias em soluções digitais funcionais.
            </p>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden border border-subtle bg-surface md:justify-self-end md:w-[240px]">
            <Image
              src="/images/profile-about.png"
              alt="Juliano Pereira"
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-16">
          <h3 className="ds-h3 mb-8 text-primary">Experiência profissional</h3>

          <ol className="space-y-8 border-l border-subtle pl-6">
            {visibleExperiences.map((exp) => (
              <li key={`${exp.company}-${exp.period}`} className="relative">
                <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">{exp.period}</p>
                <h4 className="mt-1 text-lg font-semibold text-primary">{exp.role}</h4>
                <p className="text-sm text-muted">{exp.company}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{exp.description}</p>
                <p className="mt-3 text-xs leading-5 text-muted">{exp.stack.join(' · ')}</p>
              </li>
            ))}
          </ol>

          {hiddenExperienceCount > 0 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowAllExperiences(true)}
                className="mono-focus-ring text-sm text-primary underline-offset-4 hover:underline"
              >
                Ver mais {hiddenExperienceCount} experiências
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="ds-h3 mb-6 text-primary">Stack</h3>
            <dl className="space-y-6">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{group.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-primary">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="ds-h3 mb-6 text-primary">Formação</h3>
            <ul className="space-y-6">
              <li>
                <p className="text-sm font-semibold text-primary">Engenharia de Qualidade e Teste de Software</p>
                <p className="text-sm text-muted">PUC Minas · Especialização (em andamento)</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-primary">Sistemas para Internet</p>
                <p className="text-sm text-muted">Unisinos</p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  <li>Projetista de Interfaces</li>
                  <li>Gestor de Projetos</li>
                  <li>Analista de Sistemas para Internet</li>
                  <li>Programador de Sistemas para Internet</li>
                  <li>Programador de Dispositivos Móveis</li>
                </ul>
              </li>
              <li>
                <p className="text-sm font-semibold text-primary">Tecnólogo em Marketing</p>
                <p className="text-sm text-muted">Uninter</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-primary">MBA Gestão Empresarial e Marketing Digital</p>
                <p className="text-sm text-muted">Uninter</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;