import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="mono-section">
      <div className="mono-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-subtle bg-primary p-8 text-background shadow-soft md:p-12">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:88px_88px]"></div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-background">
                Vamos conversar
              </p>

              <h2 className="max-w-3xl text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl">
                Gostou do meu trabalho?
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background md:text-xl">
                Posso ajudar a transformar a sua ideia em uma solucao digital clara,
                objetiva e pronta para gerar resultado.
              </p>
            </div>

            <div className="grid gap-3">
              <Link href="/contato" legacyBehavior>
                <a className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-background bg-background px-6 py-4 text-sm font-semibold text-primary transition-transform duration-300 hover:-translate-y-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Fale comigo agora
                </a>
              </Link>

              <a
                href="https://github.com/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-background bg-transparent px-6 py-4 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Ver meu GitHub
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 border-t border-background pt-8 md:grid-cols-3">
            <div className="rounded-2xl border border-background bg-background p-5 text-primary">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Entrega</div>
              <div className="mt-3 text-3xl font-bold">5+</div>
              <div className="mt-2 text-sm text-muted">Projetos concluídos com foco em clareza e execução.</div>
            </div>
            <div className="rounded-2xl border border-background bg-background p-5 text-primary">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Stack</div>
              <div className="mt-3 text-3xl font-bold">5+</div>
              <div className="mt-2 text-sm text-muted">Tecnologias aplicadas entre front-end, back-end e produto.</div>
            </div>
            <div className="rounded-2xl border border-background bg-background p-5 text-primary">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Compromisso</div>
              <div className="mt-3 text-3xl font-bold">100%</div>
              <div className="mt-2 text-sm text-muted">Acompanhamento atento da ideia inicial ao resultado final.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
