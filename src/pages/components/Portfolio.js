import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import projects, { FEATURED_PROJECT_TITLE } from '@/lib/projects';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'mobile', label: 'Mobile' },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // O projeto em destaque não se repete na grade — um projeto, um lugar.
  const availableProjects = projects.filter((project) => project.title !== FEATURED_PROJECT_TITLE);

  const filteredProjects = filter === 'all'
    ? availableProjects
    : availableProjects.filter((project) => {
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
      className="bg-background py-20 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <SectionHeader
            number="02"
            label="Portfólio"
            title="Projetos selecionados"
            description="Soluções entregues com tech moderna. Do brief ao deploy."
          />
        </div>

        <nav aria-label="Filtro de projetos" className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              aria-pressed={filter === cat.id}
              className={`mono-focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                filter === cat.id
                  ? 'bg-white text-black'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const projectImages = getProjectImages(project);
            const primaryImage = projectImages[0];

            return (
              <li key={project.title}>
                <Reveal delay={(index % 3) * 0.08} className="h-full">
                  <button
                    type="button"
                    onClick={() => openProjectModal(project)}
                    className="mono-focus-ring group block h-full w-full text-left"
                    aria-label={`Abrir detalhes de ${project.title}`}
                  >
                    <div className="relative overflow-hidden bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-overlay" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-sm)', boxShadow: '0 0 0 1px rgba(var(--accent-rgb), 0.06)' }}>
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
                </Reveal>

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
              className="relative max-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-y-auto bg-surface lg:max-h-[92vh]"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lift)' }}
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
                    <a href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring mono-button-primary min-h-11">
                      Abrir projeto<span className="sr-only"> (nova aba)</span>
                    </a>
                    <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="mono-focus-ring mono-button-secondary min-h-11">
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