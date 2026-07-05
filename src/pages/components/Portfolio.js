import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';

const projects = [
  {
    title: 'Finly',
    description: 'App financeiro pessoal para controle de receitas, despesas e planejamento — dashboard interativo com gráficos e categorização inteligente.',
    imageUrl: '/images/finly.png',
    projectUrl: 'https://finly.juliano340.com/',
    repoUrl: 'https://github.com/juliano340/finly',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js', 'Tailwind CSS', 'Stripe'],
    category: 'fullstack',
  },
  {
    title: 'Loja Web',
    description: 'E-commerce full-stack com Angular 20 + Tailwind no front e NestJS + TypeORM + PostgreSQL + JWT + Stripe no back.',
    imageUrl: '/images/loja-web.png',
    projectUrl: 'https://loja.juliano340.com/products',
    repoUrl: 'https://github.com/juliano340/loja-web',
    repoBackendUrl: 'https://github.com/juliano340/loja-backend',
    tags: ['Angular 20', 'Tailwind CSS', 'NestJS', 'TypeORM', 'PostgreSQL', 'JWT', 'Stripe', 'TypeScript'],
    category: 'fullstack',
  },
  {
    title: 'TaskMaster',
    description: 'Aplicação SaaS para gerenciamento de tarefas com autenticação, planos free e premium, Stripe e deploy completo.',
    imageUrl: '/images/tasks.png',
    projectUrl: 'https://tasks.juliano340.com/',
    repoUrl: 'https://github.com/juliano340/gr-tasks',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'Stripe', 'Auth.js', 'Tailwind CSS', 'PM2', 'Nginx'],
    category: 'fullstack',
  },
  {
    title: 'Barbearia Moderna',
    description: 'Plataforma full-stack para gestão de barbearia com agendamentos, painel admin e automações via WhatsApp.',
    imageUrl: '/images/j-flix.png',
    imageUrls: ['/images/BarbeariaModerna1.png', '/images/BarbeariaModerna2.png'],
    projectUrl: 'https://barbearia-moderna.juliano340.com/login',
    repoUrl: 'https://github.com/juliano340/webapp',
    tags: ['NextJS', 'SQLITE', 'PRISMA', 'NextAuth', 'WhatsApp BOT'],
    category: 'fullstack',
  },
  {
    title: 'CMS - BLOG',
    description: 'Sistema CMS para blog com Next.js e Notion como backend.',
    imageUrl: '/images/Blog.png',
    projectUrl: 'https://www.juliano340.com/blog',
    repoUrl: 'https://github.com/juliano340/site-vercel',
    tags: ['Next.js', 'Notion', 'CMS'],
    category: 'frontend',
  },
  {
    title: 'RunLab',
    description: 'Aplicativo mobile com Flutter para gerenciamento de corridas, backup em JSON e privacidade.',
    imageUrl: '/images/RUNLAB_SCREEN.jpg',
    imageUrls: ['/images/RUNLAB_SCREEN.jpg', '/images/RUNLAB_SCREEN2.jpg'],
    projectUrl: 'https://www.juliano340.com/runlab',
    repoUrl: 'https://github.com/juliano340/RunLabAG',
    tags: ['Flutter', 'Mobile', 'JSON Backup', 'Privacidade'],
    category: 'mobile',
  },
  {
    title: 'JVerso - Rede Social',
    description: 'Rede social completa com feed, likes, comentários aninhados, perfis e seguidores.',
    imageUrl: '/images/jverso-feed.png',
    projectUrl: 'https://jverso.juliano340.com/',
    repoUrl: 'https://github.com/juliano340/rede-social-rai',
    tags: ['Angular', 'NestJS', 'Prisma', 'PostgreSQL', 'JWT', 'Tailwind CSS'],
    category: 'fullstack',
  },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((project) => {
        if (Array.isArray(project.category)) {
          return project.category.some((cat) => cat === filter);
        }
        return project.category === filter;
      });

  const getProjectImages = (project) => {
    if (Array.isArray(project.imageUrls) && project.imageUrls.length > 0) {
      return project.imageUrls;
    }
    return [project.imageUrl];
  };

  const getProjectCategoryLabel = (project) => {
    const category = Array.isArray(project.category) ? project.category[0] : project.category;
    if (category === 'fullstack') return 'Full Stack';
    if (category === 'frontend') return 'Frontend';
    if (category === 'mobile') return 'Mobile';
    return 'Projeto';
  };

  const changeProjectImage = (projectKey, totalImages, direction) => {
    setActiveImageIndexes((prev) => {
      const current = prev[projectKey] ?? 0;
      const next = (current + direction + totalImages) % totalImages;
      return { ...prev, [projectKey]: next };
    });
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setModalImageIndex(0);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setModalImageIndex(0);
  };

  useEffect(() => {
    if (!selectedProject) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeProjectModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden px-4 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <Reveal delay={0} className="mb-16 text-center">
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
              Projetos selecionados
            </p>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: 'var(--color-text)',
                lineHeight: 0.95,
                marginBottom: '16px',
                letterSpacing: '0.02em',
              }}
            >
              MEU PORTFÓLIO
            </h2>
            <div style={{ height: '1px', width: '96px', background: 'rgba(var(--accent-rgb), 0.2)', margin: '0 auto 24px' }} />
            <p className="mx-auto max-w-2xl text-lg" style={{ color: 'var(--color-muted-dim)' }}>
              Soluções entregues com tech moderna. Do brief ao deploy.
            </p>
          </div>
        </Reveal>

        {/* Filter */}
        <Reveal delay={0} className="mx-auto mb-12 flex max-w-3xl flex-wrap justify-center gap-2 p-2">
          <div
            className="mx-auto mb-12 flex max-w-3xl flex-wrap justify-center gap-2 p-2"
            style={{ border: '1px solid rgba(var(--accent-rgb), 0.1)', background: 'var(--color-surface)', borderRadius: '4px' }}
          >
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="mono-focus-ring transition-all duration-300 px-5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.1em]"
                style={{
                  borderRadius: '999px',
                  border: 'none',
                  background: filter === cat.id ? 'var(--color-accent)' : 'transparent',
                  color: filter === cat.id ? 'var(--btn-text)' : 'var(--color-dim)',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Counter */}
        <Reveal delay={0} className="mb-8 text-center">
          <div className="mb-8 text-center">
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-dim)' }}>
              {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <Reveal delay={0} className="w-full">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const projectKey = project.title;
              const projectImages = getProjectImages(project);
              const currentImageIndex = activeImageIndexes[projectKey] ?? 0;
              const currentImage = projectImages[currentImageIndex] || projectImages[0];

              return (
                <div
                  key={projectKey}
                  role="button"
                  tabIndex={0}
                  onClick={() => openProjectModal(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProjectModal(project);
                    }
                  }}
                  className="group relative flex h-full flex-col overflow-hidden transition-all duration-300"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid rgba(var(--accent-rgb), 0.06)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(var(--accent-rgb), 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: 'var(--color-background-deep)' }}>
                    <Image
                      src={currentImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />

                    {/* Category */}
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          background: 'rgba(0,0,0,0.75)',
                          border: '1px solid rgba(var(--accent-rgb), 0.35)',
                          color: '#FFFFFF',
                          borderRadius: '999px',
                          fontSize: '0.55rem',
                          padding: '3px 10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {getProjectCategoryLabel(project)}
                      </span>
                    </div>

                    {projectImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label={`Anterior: ${project.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            changeProjectImage(projectKey, projectImages.length, -1);
                          }}
                          className="mono-focus-ring mono-icon-button absolute left-2 top-1/2 z-20 -translate-y-1/2 p-1.5"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label={`Próximo: ${project.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            changeProjectImage(projectKey, projectImages.length, 1);
                          }}
                          className="mono-focus-ring mono-icon-button absolute right-2 top-1/2 z-20 -translate-y-1/2 p-1.5"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 px-2 py-1" style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                          {projectImages.map((image, imageIndex) => (
                            <button
                              key={`${projectKey}-${image}`}
                              type="button"
                              aria-label={`Imagem ${imageIndex + 1}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndexes((prev) => ({ ...prev, [projectKey]: imageIndex }));
                              }}
                              className="mono-focus-ring h-2 w-2 rounded-full transition"
                              style={{ background: currentImageIndex === imageIndex ? 'var(--color-accent)' : 'var(--color-dim)', opacity: currentImageIndex === imageIndex ? 1 : 0.5 }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <p style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-dim)', marginBottom: '6px' }}>
                      Case digital
                    </p>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: 'var(--color-text)', lineHeight: 1.1, letterSpacing: '0.04em', marginBottom: '8px' }}>
                      {project.title}
                    </h2>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--color-muted-dim)' }}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="mono-tag"
                          style={{ fontSize: '0.6rem', padding: '3px 8px' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-dim)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.08)'; }}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span style={{ fontSize: '0.6rem', color: 'var(--color-dim)', padding: '3px 6px' }}>
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="mt-auto grid gap-2 pt-3 sm:grid-cols-2">
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir ${project.title}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mono-focus-ring mono-button-primary flex-1 px-3 py-2"
                      >
                        <span className="flex items-center justify-center gap-1.5 text-[0.65rem]">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Ao vivo
                        </span>
                      </a>
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Código de ${project.title}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mono-focus-ring justify-center px-3 py-2 text-[0.65rem] transition-all duration-200"
                        style={{
                          color: 'var(--color-dim)',
                          background: 'transparent',
                          border: '1px solid rgba(var(--accent-rgb), 0.08)',
                          borderRadius: '999px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-dim)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.08)'; }}
                      >
                        <svg className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Código
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Empty */}
        {filteredProjects.length === 0 && (
          <Reveal delay={0} className="text-center py-20">
            <div className="text-center py-20">
              <p className="text-xl font-bold" style={{ color: 'var(--color-dim)' }}>Nenhum projeto encontrado</p>
              <p style={{ color: 'var(--color-dim)', marginTop: '8px' }}>Tente outra categoria</p>
            </div>
          </Reveal>
        )}

        {/* Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-[120] flex items-start justify-center px-4 pb-6 pt-24 backdrop-blur-sm lg:items-center lg:py-6"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={closeProjectModal}
          >
            <div
              className="relative max-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-y-auto rounded-lg lg:max-h-[92vh]"
              style={{ background: 'var(--color-surface)', border: '1px solid rgba(var(--accent-rgb), 0.15)', borderRadius: '8px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeProjectModal}
                className="mono-focus-ring mono-icon-button absolute right-3 z-20 p-2"
                style={{ top: '1rem' }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="relative h-72 lg:col-span-3 lg:h-auto lg:min-h-[480px]" style={{ background: 'var(--color-background-deep)' }}>
                  <Image
                    src={getProjectImages(selectedProject)[modalImageIndex] || getProjectImages(selectedProject)[0]}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    unoptimized
                    className="object-contain p-4"
                  />
                  {getProjectImages(selectedProject).length > 1 && (
                    <>
                      <button type="button" aria-label="Anterior" onClick={() => setModalImageIndex((prev) => (prev - 1 + getProjectImages(selectedProject).length) % getProjectImages(selectedProject).length)} className="mono-focus-ring mono-icon-button absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button type="button" aria-label="Próxima" onClick={() => setModalImageIndex((prev) => (prev + 1) % getProjectImages(selectedProject).length)} className="mono-focus-ring mono-icon-button absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 px-3 py-1.5" style={{ background: 'rgba(0,0,0,0.8)', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                        {getProjectImages(selectedProject).map((img, imgIndex) => (
                          <button
                            key={`modal-${img}`}
                            type="button"
                            onClick={() => setModalImageIndex(imgIndex)}
                            className="mono-focus-ring h-2.5 w-2.5 rounded-full transition"
                            style={{ background: modalImageIndex === imgIndex ? 'var(--color-accent)' : 'var(--color-dim)', opacity: modalImageIndex === imgIndex ? 1 : 0.5 }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col p-6 lg:col-span-2 lg:p-8" style={{ background: 'var(--color-surface)' }}>
                  <p style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-dim)', marginBottom: '8px' }}>Detalhes do projeto</p>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--color-text)', lineHeight: 1, marginBottom: '12px' }}>{selectedProject.title}</h3>
                  <div className="mb-6 p-4" style={{ border: '1px solid rgba(var(--accent-rgb), 0.1)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-dim)', marginBottom: '8px' }}>Resumo</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-dim)' }}>{selectedProject.description}</p>
                  </div>

                  <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-dim)', marginBottom: '10px' }}>Tecnologias</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span key={`${selectedProject.title}-tag-${tag}`} className="mono-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-auto grid gap-3" style={{ borderTop: '1px solid rgba(var(--accent-rgb), 0.1)', paddingTop: '16px' }}>
                    <a href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring mono-button-primary whitespace-nowrap">Abrir projeto</a>
                    <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring mono-button-secondary whitespace-nowrap">Ver código</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
