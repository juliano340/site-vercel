import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STACK = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'];

const HeroSectionView = () => {
  return (
    <section className="mono-section flex min-h-[72vh] items-center border-b border-subtle">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:72px_72px]"></div>

      <div className="mono-container grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="relative z-10 max-w-3xl">
          <span className="mono-chip mb-6">Disponível para projetos</span>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-primary md:text-6xl md:leading-[1.05]">
            Programação web com foco em clareza, performance e resultado.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Sou desenvolvedor full stack e construo soluções digitais do design ao deploy,
            com código limpo, experiência consistente e prioridade no que realmente importa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {STACK.map((item) => (
              <span key={item} className="mono-tag">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contato" legacyBehavior>
              <a className="mono-focus-ring mono-button-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Fale comigo
              </a>
            </Link>

            <a
              href="https://github.com/juliano340"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-focus-ring mono-button-secondary"
            >
              Ver GitHub
            </a>
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted">
            Front-end, back-end e full stack.
          </p>
        </div>

        <div className="relative z-10">
          <div className="mono-panel mx-auto max-w-md">
            <div className="flex items-center gap-4 border-b border-subtle pb-6">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-subtle bg-surface">
                <Image
                  src="https://avatars.githubusercontent.com/u/87342139?v=4"
                  alt="Foto de perfil de Juliano"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Juliano340
                </p>
                <h2 className="mt-2 text-2xl font-bold text-primary">Desenvolvedor Web</h2>
                <p className="mt-1 text-sm text-muted">Projetos sob medida para web e produtos digitais.</p>
              </div>
            </div>

            <div className="grid gap-4 pt-6 sm:grid-cols-2">
              <div className="mono-card bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Escopo</p>
                <p className="mt-3 text-base font-semibold text-primary">Landing pages, apps e sistemas web</p>
              </div>

              <div className="mono-card bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Entrega</p>
                <p className="mt-3 text-base font-semibold text-primary">Design consistente e implementação objetiva</p>
              </div>
            </div>

            <div className="mt-6 border-t border-subtle pt-6 text-sm text-muted">
              Você também encontra meu trabalho no{' '}
              <a
                href="https://linkedin.com/in/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring font-semibold text-primary underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionView;
