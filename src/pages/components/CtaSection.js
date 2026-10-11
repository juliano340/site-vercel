import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
          <div>
            <p className="ds-label mb-4">03 — Próximo passo</p>
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
        </div>
      </div>
    </section>
  );
};

export default CtaSection;