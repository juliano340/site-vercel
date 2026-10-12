import Head from 'next/head';
import Breadcrumb from './components/Breadcrumb';

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
    period: 'Dez 2022 — Jun 2025',
    role: 'Suporte → QA → Programador Full Stack',
    company: 'Dataweb Tecnologia',
    description:
      'Evolução interna em três frentes: comecei no help desk (instalação e configuração), migrei para QA com testes manuais em desktop, web e mobile, e finalizei como dev full-stack no ERP — backend C# (.NET) e frontend TypeScript/Angular.',
    stack: ['Angular', 'TypeScript', 'C# / .NET', 'Firebird', 'Dapper', 'Entity Framework'],
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
  { label: 'IA & Produtividade', items: ['OpenCode', 'Claude', 'MCP / Tool Use', 'RAG'] },
  { label: 'QA & Testes', items: ['Playwright', 'Vitest', 'Testes de API', 'TDD · BDD'] },
  { label: 'Frontend', items: ['Angular', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Backend & Dados', items: ['NestJS', 'Node.js', 'Prisma', 'TypeORM', 'PostgreSQL', 'SQLite'] },
  { label: 'DevOps & Infra', items: ['Docker', 'Vercel', 'VPS Linux', 'Nginx', 'PM2', 'CI/CD'] },
];

const Sobre = () => {
  return (
    <>
      <Head>
        <title>Sobre | Juliano340</title>
        <meta
          name="description"
          content="Trajetória de Juliano Pereira (@juliano340) — desenvolvedor full stack: experiência profissional, stack e formação."
        />
        <link rel="canonical" href="https://www.juliano340.com/sobre" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sobre | Juliano340" />
        <meta property="og:description" content="Experiência profissional, stack e formação de Juliano Pereira — desenvolvedor full stack." />
        <meta property="og:url" content="https://www.juliano340.com/sobre" />
      </Head>

      <main className="bg-background text-primary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumb paths={[{ label: 'Home', href: '/' }, { label: 'Sobre', href: '/sobre' }]} />

          <header className="mb-12 mt-6 max-w-2xl">
            <p className="ds-label mb-3">Currículo</p>
            <h1 className="ds-h1">Sobre mim</h1>
          </header>

          <div className="mb-16 max-w-3xl">
            <p className="ds-body-lg text-muted">
              Sou graduado em <strong className="text-primary">Sistemas para Internet</strong> pela
              <strong className="text-primary"> Unisinos</strong> e pós-graduando em
              <strong className="text-primary"> Engenharia de Qualidade e Teste de Software</strong> na
              <strong className="text-primary"> PUC Minas</strong>. Tenho experiência prática com front-end, back-end,
              testes e suporte técnico — e gosto de transformar ideias em soluções digitais funcionais.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
            <div>
              <h2 className="ds-h3 mb-8 text-primary">Experiência profissional</h2>

              <ol className="space-y-8 border-l border-subtle pl-6">
                {EXPERIENCES.map((exp) => (
                  <li key={`${exp.company}-${exp.period}`} className="relative">
                    <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">{exp.period}</p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">{exp.role}</h3>
                    <p className="text-sm text-muted">{exp.company}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{exp.description}</p>
                    <p className="mt-3 text-xs leading-5 text-muted">{exp.stack.join(' · ')}</p>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="space-y-12">
              <div>
                <h2 className="ds-h3 mb-8 text-primary">Formação</h2>
                <ol className="space-y-8 border-l border-subtle pl-6">
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">2026 — Atual</p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">Engenharia de Qualidade e Teste de Software</h3>
                    <p className="text-sm text-muted">PUC Minas · Especialização</p>
                  </li>
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">2025</p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">Sistemas para Internet</h3>
                    <p className="text-sm text-muted">Unisinos</p>
                    <p className="mt-3 text-xs leading-5 text-muted">
                      Projetista de Interfaces · Gestor de Projetos · Analista de Sistemas · Programador de
                      Sistemas · Programador de Dispositivos Móveis
                    </p>
                  </li>
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">2019</p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">MBA Gestão Empresarial e Marketing Digital</h3>
                    <p className="text-sm text-muted">Uninter</p>
                  </li>
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">2018</p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">Tecnólogo em Marketing</h3>
                    <p className="text-sm text-muted">Uninter</p>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="ds-h3 mb-6 text-primary">Stack</h2>
                <dl className="space-y-6">
                  {SKILL_GROUPS.map((group) => (
                    <div key={group.label}>
                      <dt className="text-xs font-bold uppercase tracking-[0.07em] text-muted">{group.label}</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className="mono-tag">{item}</span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Sobre;
