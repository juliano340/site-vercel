import Link from 'next/link';
import Image from 'next/image';
import { HOME_CONTAINER, HOME_LINK, HOME_BUTTON } from '@/lib/homePresentation';

const HeroSectionView = () => (
  <section aria-labelledby="home-title" className="bg-background text-primary">
    <div className={`${HOME_CONTAINER} pb-14 pt-10 sm:pb-16 sm:pt-12 lg:pt-16`}>
      <p className="ds-label mb-6">Porto Alegre, Brasil</p>

      <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-x-16">
        <div className="max-w-3xl">
          <h1 id="home-title" className="ds-display">
            Desenvolvedor<br />Full Stack
          </h1>
          <p className="ds-body mt-6 max-w-xl text-muted">
            Construo aplicações web de ponta a ponta — TypeScript, Next.js e IA aplicada, do primeiro commit ao deploy.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#portfolio" className={HOME_BUTTON}>Ver projetos</a>
            <Link href="/contato" legacyBehavior><a className={HOME_LINK}>Fale comigo</a></Link>
          </div>
        </div>

        <div className="relative h-52 w-52 overflow-hidden rounded-full bg-surface lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-64 lg:w-64 lg:justify-self-end">
          <Image
            src="/images/profile-about.png"
            alt="Juliano Pereira"
            fill
            sizes="(max-width: 1024px) 208px, 256px"
            className="object-cover object-top"
          />
        </div>

        <div className="max-w-3xl lg:col-start-1">
          <p className="ds-body max-w-xl text-muted">
            Sou graduado em <strong className="text-primary">Sistemas para Internet</strong> pela
            <strong className="text-primary"> Unisinos</strong> e pós-graduando em
            <strong className="text-primary"> Engenharia de Qualidade e Teste de Software</strong> na
            <strong className="text-primary"> PUC Minas</strong>. Tenho experiência prática com front-end, back-end,
            testes e suporte técnico — e gosto de transformar ideias em soluções digitais funcionais.
          </p>
          <div className="mt-6">
            <Link href="/sobre" legacyBehavior>
              <a className="mono-focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-bold hover:underline underline-offset-4">
                Currículo completo →
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSectionView;
