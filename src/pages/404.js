// pages/404.js

import Link from 'next/link';
import SEO from '@/pages/components/SEO';

const Custom404 = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      <SEO
        title="Página não encontrada"
        description="A página que você está procurando não existe."
        path={null}
        noindex
      />
      <p className="ds-label mb-3">Erro 404</p>
      <h1 className="ds-h2">Página não encontrada</h1>
      <p className="ds-body mt-4" style={{ color: 'var(--color-muted)' }}>
        Desculpe, a página que você está procurando não existe.
      </p>
      <Link href="/home" legacyBehavior>
        <a className="mono-focus-ring mono-button-primary mt-8 min-h-12 px-6 py-3">Voltar para a Home</a>
      </Link>
    </div>
  );
};

export default Custom404;
