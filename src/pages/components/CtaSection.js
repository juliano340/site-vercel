import React from 'react';
import Link from 'next/link';
import Reveal from '@/pages/components/Reveal';

const CtaSection = () => {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative grid gap-10 overflow-hidden rounded-md px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end lg:px-12"
          style={{
            background:
              'radial-gradient(ellipse at 100% 0%, rgba(var(--accent-rgb), 0.1) 0%, transparent 55%), var(--inv-bg)',
            border: '1px solid var(--inv-border)',
          }}
        >
          <div className="relative">
            <Reveal>
              <p className="ds-label mb-4 flex items-center gap-3">
                <span
                  className="inline-flex h-6 items-center rounded-full px-2 font-mono text-[0.65rem]"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.08)',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  }}
                >
                  04
                </span>
                Próximo passo
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="ds-h1 max-w-xl text-primary lg:text-4xl lg:leading-tight">
                Tem um projeto travado?<br />
                Vamos destravar.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="ds-body mt-5 max-w-xl text-muted">
                Conta o problema e o que você precisa. Eu respondo com uma proposta de escopo, stack e próximos
                passos — comunicação direta, sem reunião desnecessária.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.24} variant="right">
            <div className="flex flex-col gap-3">
              <Link href="/contato" legacyBehavior>
                <a className="mono-focus-ring mono-button-primary min-h-12 px-6 py-3">
                  Começar meu projeto
                </a>
              </Link>
              <a
                href="https://github.com/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring mono-button-secondary min-h-12 px-6 py-3"
              >
                Ver meu GitHub<span className="sr-only"> (nova aba)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;