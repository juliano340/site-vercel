import Link from 'next/link';
import HeroVisual from '@/pages/components/HeroVisual';
import { HOME_CONTAINER, HOME_LABEL, HOME_LINK, HOME_BUTTON } from '@/lib/homePresentation';

const CURRENT_YEAR = new Date().getFullYear();

const HeroSectionView = () => (
  <section aria-labelledby="home-title" className="bg-background text-primary">
    <div className={`${HOME_CONTAINER} pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pt-20`}>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className={HOME_LABEL}>Juliano Pereira</p>
        <p className="text-xs text-muted">Porto Alegre, Brasil</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_minmax(300px,0.75fr)] lg:gap-x-16 lg:gap-y-12">
        <div>
          <h1 id="home-title" className="ds-display">
            Desenvolvedor<br />Full Stack
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Produtos digitais do conceito ao deploy — com código limpo, velocidade e IA aplicada.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#portfolio" className={HOME_BUTTON}>Ver projetos</a>
            <Link href="/contato" legacyBehavior><a className={HOME_LINK}>Fale comigo</a></Link>
          </div>
        </div>

        <HeroVisual className="lg:col-start-2 lg:row-span-2" />

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-subtle pt-5 sm:pt-6 md:grid-cols-4 lg:col-start-1">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Experiência</dt>
            <dd className="mt-1 font-mono text-xl text-primary sm:text-2xl">{CURRENT_YEAR - 2022}+ anos</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Foco</dt>
            <dd className="mt-1 font-mono text-xl text-primary sm:text-2xl">Full Stack</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Stack</dt>
            <dd className="mt-1 font-mono text-sm text-primary sm:text-base">TS · Next · Node</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Formação</dt>
            <dd className="mt-1 font-mono text-sm text-primary sm:text-base">QA · PUC Minas</dd>
          </div>
        </dl>
      </div>

      <p className="mt-10 hidden border-t border-subtle pt-6 text-sm leading-relaxed text-muted sm:block sm:mt-12">
        TypeScript · Angular · Next.js · C#/.NET · React · Docker · AWS
      </p>
    </div>
  </section>
);

export default HeroSectionView;