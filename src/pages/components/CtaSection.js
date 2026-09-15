import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-t border-subtle pt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
          <div>
            <p className="ds-label mb-4">04 — Próximo passo</p>
            <h2 className="ds-h1 text-primary">
              Tem um projeto travado?<br />
              Vamos destravar.
            </h2>
            <p className="ds-body mt-5 max-w-xl text-muted">
              Conta o problema e o que você precisa. Eu respondo com uma proposta de escopo, stack e próximos
              passos — comunicação direta, sem reunião desnecessária.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/contato" legacyBehavior>
              <a className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-bg)] px-6 py-3 text-sm font-semibold text-[var(--btn-text)] hover:bg-[var(--btn-hover)]">
                Começar meu projeto
              </a>
            </Link>
            <a
              href="https://github.com/juliano340"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-subtle px-6 py-3 text-sm font-semibold text-primary hover:border-primary"
            >
              Ver meu GitHub<span className="sr-only"> (nova aba)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;