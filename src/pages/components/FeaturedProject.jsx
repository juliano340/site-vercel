import SmartImage from '@/pages/components/SmartImage';
import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import useScrollProgress from '@/lib/useScrollProgress';
import { useRef } from 'react';
import projects, { FEATURED_PROJECT_TITLE } from '@/lib/projects';
import { HOME_CONTAINER, HOME_LINK } from '@/lib/homePresentation';

const FeaturedProject = () => {
  const project = projects.find(({ title }) => title === FEATURED_PROJECT_TITLE) || projects[0];
  const imageRef = useRef(null);

  // Parallax leve: a imagem anda 6% dentro do frame conforme a seção cruza a viewport.
  useScrollProgress((progress) => {
    const el = imageRef.current;
    if (!el) return;
    const drift = (Math.min(1, Math.max(0, progress)) - 0.5) * -48; // ±24px
    el.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
  });

  if (!project) return null;

  return (
    <section id="featured-project" aria-labelledby="featured-title" className="scroll-mt-6 bg-surface text-primary">
      <div className={`${HOME_CONTAINER} py-20 sm:py-24`}>
        <div className="mb-8 flex flex-col items-start gap-3 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <SectionHeader number="01" label="Projeto em destaque" title={project.title} className="!mb-0" />
          <a href="#portfolio" className={`${HOME_LINK} text-muted`}>Todos os projetos</a>
        </div>
        <span id="featured-title" className="sr-only">{project.title}</span>

        <div className="grid items-center gap-8 lg:grid-cols-[1.8fr_1fr] lg:gap-12">
          <Reveal variant="blur">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar ${project.title} (nova aba)`}
              className="mono-focus-ring group block overflow-hidden bg-background transition-shadow duration-300"
              style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lift)',
              }}
            >
              <div className="overflow-hidden" style={{ borderRadius: 'inherit' }} ref={imageRef}>
                <SmartImage
                  src={project.imageUrl}
                  alt={`Página inicial do ${project.title}`}
                  width={1280}
                  height={800}
                  sizes="(max-width: 1023px) 100vw, 760px"
                  priority
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </div>
            </a>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <p className="text-sm leading-6 text-muted">{project.tags.join(' · ')}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">{project.description}</p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className={HOME_LINK}>
                  Visitar projeto<span className="sr-only"> (nova aba)</span>
                </a>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={HOME_LINK}>
                  Ver código<span className="sr-only"> (nova aba)</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
