import SmartImage from '@/pages/components/SmartImage';
import projects from '@/lib/projects';
import { HOME_CONTAINER, HOME_LABEL, HOME_LINK } from '@/lib/homePresentation';

const FeaturedProject = () => {
  const project = projects.find(({ title }) => title === 'Finly');
  if (!project) return null;

  return (
    <section id="featured-project" aria-labelledby="featured-title" className="scroll-mt-6 border-y border-subtle bg-surface text-primary">
      <div className={`${HOME_CONTAINER} py-10 sm:py-14`}>
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <p className={HOME_LABEL}>01 — Projeto em destaque</p>
          <a href="#portfolio" className={`${HOME_LINK} text-muted`}>Todos os projetos</a>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.8fr_1fr] lg:gap-12">
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar Finly (nova aba)"
            className="mono-focus-ring block overflow-hidden border border-subtle bg-background"
          >
            <SmartImage
              src={project.imageUrl}
              alt="Página inicial do Finly, com apresentação do aplicativo financeiro e painel de receitas e despesas"
              width={1280}
              height={800}
              sizes="(max-width: 1023px) 100vw, 760px"
              priority
              className="h-auto w-full"
            />
          </a>

          <div>
            <h2 id="featured-title" className="ds-h2 text-primary">{project.title}</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">{project.description}</p>

            <p className="mt-6 text-sm leading-6 text-muted">{project.tags.join(' · ')}</p>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className={HOME_LINK}>
                Visitar projeto<span className="sr-only"> (nova aba)</span>
              </a>
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={HOME_LINK}>
                Ver código<span className="sr-only"> (nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;