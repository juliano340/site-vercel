import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const projects = [

  {
    title: "TaskMaster",
    description: "Aplicação SaaS para gerenciamento de tarefas com autenticação, planos free e premium, integração com Stripe e deploy completo em VPS Linux.",
    imageUrl: "/images/tasks.png",
    projectUrl: "https://tasks.juliano340.com/",
    repoUrl: "https://github.com/juliano340/gr-tasks",
    tags: ["Next.js", "TypeScript", "Prisma", "SQLite", "Stripe", "Auth.js", "Tailwind CSS", "PM2", "Nginx"],
    category: "fullstack"
  },
  {
    title: 'Barber Admin',
    description: 'Sistema multiplataforma para gestão de barbearias, desenvolvida com Ionic/Angular e Firebase/Firestore',
    imageUrl: '/images/barberadmin.png',
    projectUrl: 'https://barber.juliano340.com/',
    repoUrl: 'https://github.com/juliano340/barber-admin',
    tags: ['Angular', 'Ionic', 'Firebase'],
    category: 'fullstack'
  },
  {
    title: 'Vagas Voluntárias',
    description: 'Plataforma de vagas voluntárias desenvolvida com Angular e NestJS',
    imageUrl: '/images/VagasVoluntarias.png',
    projectUrl: 'https://vagas.juliano340.com/',
    repoUrl: 'https://github.com/juliano340/vagas-voluntarias',
    tags: ['Angular', 'NestJS', 'TypeScript'],
    category: 'fullstack'
  },
  {
    title: 'Meu Link',
    description: 'Encurtador de links desenvolvido em React utilizando API do Bitly',
    imageUrl: '/images/meu-link-snapshoot.png',
    projectUrl: 'https://meu-link-xi.vercel.app/',
    repoUrl: 'https://github.com/juliano340/meu-link',
    tags: ['React', 'API', 'Bitly'],
    category: 'frontend'
  },
  {
    title: 'Busca CEP',
    description: 'Buscador de CEP desenvolvido com React utilizando a API da ViaCep',
    imageUrl: '/images/busca-cep.png',
    projectUrl: 'https://buscador-cep-ecru.vercel.app/',
    repoUrl: 'https://github.com/juliano340/buscador-cep',
    tags: ['React', 'API', 'ViaCep'],
    category: 'frontend'
  },
  {
    title: 'Barbearia Moderna',
    description: 'Plataforma full-stack para gestão de barbearia, com agendamentos, painel administrativo e automações via WhatsApp, desenvolvida com Next.js, Prisma e NextAuth.',
    imageUrl: '/images/j-flix.png',
    imageUrls: ['/images/BarbeariaModerna1.png', '/images/BarbeariaModerna2.png'],
    projectUrl: 'https://barbearia-moderna.juliano340.com/login',
    repoUrl: 'https://github.com/juliano340/webapp',
    tags: ['NextJS', 'SQLITE', 'PRISMA', 'NextAuth', 'WhatsApp BOT'],
    category: 'fullstack'
  },
  {
    title: 'PDV Web',
    description: 'Sistema de Gestão de Vendas completo para ponto de venda',
    imageUrl: '/images/pdv.png',
    projectUrl: 'https://pdv-juliano340s-projects.vercel.app/',
    repoUrl: 'https://github.com/juliano340/pdv',
    tags: ['React', 'Sistema', 'Gestão'],
    category: 'frontend'
  },
  {
    title: 'CMS - BLOG',
    description: 'Sistema CMS para blog desenvolvido com Next.js utilizando a API do Notion',
    imageUrl: '/images/Blog.png',
    projectUrl: 'https://www.juliano340.com/blog',
    repoUrl: 'https://github.com/juliano340/site-vercel',
    tags: ['Next.js', 'Notion', 'CMS'],
    category: 'frontend'
  },
  {
    title: 'RunLab',
    description: 'Aplicativo mobile desenvolvido com Flutter para gerenciamento de corridas com acompanhamento de treinos, backup em JSON, importacao de dados e pagina de suporte dedicada.',
    imageUrl: '/images/RUNLAB_SCREEN.jpg',
    imageUrls: ['/images/RUNLAB_SCREEN.jpg', '/images/RUNLAB_SCREEN2.jpg'],
    projectUrl: 'https://www.juliano340.com/runlab',
    repoUrl: 'https://github.com/juliano340/RunLabAG',
    tags: ['RunLab', 'Mobile', 'JSON Backup', 'Privacidade'],
    category: 'frontend'
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
    { id: 'frontend', label: 'Frontend' }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  const getProjectImages = (project) => {
    if (Array.isArray(project.imageUrls) && project.imageUrls.length > 0) {
      return project.imageUrls;
    }
    return [project.imageUrl];
  };

  const changeProjectImage = (projectKey, totalImages, direction) => {
    setActiveImageIndexes((prev) => {
      const current = prev[projectKey] ?? 0;
      const next = (current + direction + totalImages) % totalImages;
      return {
        ...prev,
        [projectKey]: next,
      };
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
    <div id="portfolio" className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-100 py-20 px-4 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl dark:text-white">
            Meu Portfólio
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"></div>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-gray-300">
            Confira alguns dos projetos que desenvolvi utilizando as mais modernas tecnologias
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${filter === cat.id
                ? 'scale-105 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/40'
                : 'border border-slate-300 bg-white/80 text-slate-700 backdrop-blur-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Counter */}
        <div className="text-center mb-8">
          <p className="text-slate-500 dark:text-gray-400">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const projectKey = project.title;
            const projectImages = getProjectImages(project);
            const currentImageIndex = activeImageIndexes[projectKey] ?? 0;
            const currentImage = projectImages[currentImageIndex] || projectImages[0];

            return (
              <div
                key={projectKey}
                role="button"
                tabIndex={0}
                aria-label={`Abrir detalhes do projeto ${project.title}`}
                onClick={() => openProjectModal(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(project);
                  }
                }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/85 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 dark:border-white/10 dark:bg-white/5"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={currentImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {projectImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label={`Ver imagem anterior de ${project.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          changeProjectImage(projectKey, projectImages.length, -1);
                        }}
                        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white dark:bg-slate-900/70 dark:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        aria-label={`Ver próxima imagem de ${project.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          changeProjectImage(projectKey, projectImages.length, 1);
                        }}
                        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white dark:bg-slate-900/70 dark:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
                        {projectImages.map((image, imageIndex) => (
                          <button
                            key={`${projectKey}-${image}`}
                            type="button"
                            aria-label={`Ver imagem ${imageIndex + 1} de ${project.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndexes((prev) => ({
                                ...prev,
                                [projectKey]: imageIndex,
                              }));
                            }}
                            className={`h-2.5 w-2.5 rounded-full transition ${currentImageIndex === imageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                    {project.title}
                  </h2>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-auto flex gap-3 pt-2">
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver projeto ${project.title} ao vivo`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver Projeto
                    </a>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver código fonte de ${project.title} no GitHub`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg border border-slate-300 bg-white/80 p-2.5 text-slate-600 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                      title="Ver código fonte"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-sky-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              </div>
            );
          })}
        </div>

        {selectedProject && (
          <div
            className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/75 px-4 pb-6 pt-24 backdrop-blur-sm lg:items-center lg:py-6"
            onClick={closeProjectModal}
          >
            <div
              className="relative max-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900 lg:max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeProjectModal}
                aria-label="Fechar detalhes do projeto"
                className="absolute right-4 z-20 rounded-full bg-black/60 p-2 text-white transition hover:scale-105 hover:bg-black/75"
                style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="relative h-72 lg:col-span-3 lg:h-full lg:min-h-[560px]">
                  <Image
                    src={getProjectImages(selectedProject)[modalImageIndex] || getProjectImages(selectedProject)[0]}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    unoptimized
                    className="object-contain bg-slate-950 p-2"
                  />

                  {getProjectImages(selectedProject).length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label={`Imagem anterior de ${selectedProject.title}`}
                        onClick={() => setModalImageIndex((prev) => (prev - 1 + getProjectImages(selectedProject).length) % getProjectImages(selectedProject).length)}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label={`Próxima imagem de ${selectedProject.title}`}
                        onClick={() => setModalImageIndex((prev) => (prev + 1) % getProjectImages(selectedProject).length)}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-1.5">
                        {getProjectImages(selectedProject).map((img, imgIndex) => (
                          <button
                            key={`${selectedProject.title}-modal-${img}`}
                            type="button"
                            aria-label={`Abrir imagem ${imgIndex + 1} de ${selectedProject.title}`}
                            onClick={() => setModalImageIndex(imgIndex)}
                            className={`h-2.5 w-2.5 rounded-full transition ${modalImageIndex === imgIndex ? 'bg-white' : 'bg-white/55 hover:bg-white/80'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col p-6 lg:col-span-2 lg:p-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
                    Detalhes do projeto
                  </p>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{selectedProject.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{selectedProject.description}</p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={`${selectedProject.title}-tag-${tag}`}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid gap-3 sm:grid-cols-2">
                    <a
                      href={selectedProject.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40"
                    >
                      Ver Projeto
                    </a>
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-4 py-2.5 font-medium text-slate-700 transition-all duration-300 hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                    >
                      Ver Código
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <svg className="mx-auto mb-6 h-24 w-24 text-slate-500 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mb-2 text-2xl font-bold text-slate-600 dark:text-gray-400">Nenhum projeto encontrado</h3>
            <p className="text-slate-500 dark:text-gray-500">Tente selecionar outra categoria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
