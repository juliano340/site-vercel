import SmartImage from '@/pages/components/SmartImage';
import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import useInView from '@/lib/useInView';
import projects, { FEATURED_PROJECT_TITLE } from '@/lib/projects';
import { HOME_CONTAINER, HOME_LINK } from '@/lib/homePresentation';

const FeaturedProject = () => {
  const project = projects.find(({ title }) => title === FEATURED_PROJECT_TITLE) || projects[0];

  // Movimento de câmera no print: o zoom enquadra o centro do site e só
  // depois a imagem desce para mostrar o miolo do produto. As duas etapas
  // ficam em elementos aninhados e são coreografadas pelo CSS.
  const [frameRef, inView] = useInView({ threshold: 0.35 });

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
              ref={frameRef}
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
              <div className={`featured-camera ${inView ? 'is-in' : ''}`} style={{ borderRadius: 'inherit' }}>
                <div className="featured-camera-zoom">
                  <SmartImage
                    src={project.imageUrl}
                    alt={`Página inicial do ${project.title}`}
                    width={1280}
                    height={800}
                    sizes="(max-width: 1023px) 100vw, 760px"
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
                  />
                </div>
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
