import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import projects from '@/lib/projects';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'mobile', label: 'Mobile' },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

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
      className="bg-background px-4 py-20 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-2xl">
          <p className="ds-label mb-3">02 — Portfólio</p>
          <h2 className="ds-h1 text-primary">Projetos selecionados</h2>
          <p className="ds-body mt-4 text-muted">
            Soluções entregues com tech moderna. Do brief ao deploy.
          </p>
        </header>

        <nav aria-label="Filtro de projetos" className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-subtle pb-3 text-sm">
          {FILTERS.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              aria-pressed={filter === cat.id}
              className={`mono-focus-ring transition-colors ${
                filter === cat.id ? 'text-primary underline underline-offset-4' : 'text-muted hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectImages = getProjectImages(project);
            const primaryImage = projectImages[0];

            return (
              <li key={project.title}>
                <button
                  type="button"
                  onClick={() => openProjectModal(project)}
                  className="mono-focus-ring group block w-full text-left"
                  aria-label={`Abrir detalhes de ${project.title}`}
                >
                  <div className="relative overflow-hidden border border-subtle bg-surface" style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={primaryImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="ds-h4 text-primary">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  </div>
                </button>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted underline-offset-4 hover:text-primary hover:underline"
                  >
                    Ao vivo<span className="sr-only"> (nova aba)</span>
                  </a>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted underline-offset-4 hover:text-primary hover:underline"
                  >
                    Código<span className="sr-only"> (nova aba)</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        {filteredProjects.length === 0 && (
          <p className="py-20 text-center text-muted">Nenhum projeto encontrado nesta categoria.</p>
        )}

        {selectedProject && (
          <div
            className="fixed inset-0 z-[120] flex items-start justify-center px-4 pb-6 pt-24 backdrop-blur-sm lg:items-center lg:py-6"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={closeProjectModal}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${selectedProject.title}`}
          >
            <div
              className="relative max-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-y-auto border border-subtle bg-surface lg:max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeProjectModal}
                className="mono-focus-ring absolute right-3 top-3 z-20 px-2 py-1 text-sm text-muted hover:text-primary"
                aria-label="Fechar"
              >
                Fechar
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="relative h-72 lg:col-span-3 lg:h-auto lg:min-h-[480px] bg-background-deep">
                  <Image
                    src={getProjectImages(selectedProject)[modalImageIndex] || getProjectImages(selectedProject)[0]}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    unoptimized
                    className="object-contain p-4"
                  />
                </div>

                <div className="flex flex-col p-6 lg:col-span-2 lg:p-8">
                  <p className="ds-label mb-2">Projeto</p>
                  <h3 className="ds-h3 text-primary">{selectedProject.title}</h3>

                  <div className="mt-5">
                    <p className="ds-label mb-2">Resumo</p>
                    <p className="text-sm leading-relaxed text-muted">{selectedProject.description}</p>
                  </div>

                  <div className="mt-6">
                    <p className="ds-label mb-2">Tecnologias</p>
                    <p className="text-sm leading-relaxed text-muted">{selectedProject.tags.join(' · ')}</p>
                  </div>

                  <div className="mt-auto grid gap-3 border-t border-subtle pt-5">
                    <a href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-bg)] px-5 py-3 text-sm font-semibold text-[var(--btn-text)] hover:bg-[var(--btn-hover)]">
                      Abrir projeto<span className="sr-only"> (nova aba)</span>
                    </a>
                    <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-subtle px-5 py-3 text-sm font-semibold text-primary hover:border-primary">
                      Ver código<span className="sr-only"> (nova aba)</span>
                    </a>
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