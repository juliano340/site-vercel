import SEO from '@/pages/components/SEO';
import Link from 'next/link';

const PoliticaDePrivacidade = () => {
  return (
    <>
      <SEO
        title="Política de Privacidade"
        description="Política de Privacidade do site juliano340.com sobre uso de cookies, Meta Pixel, Google Analytics e Google Ads."
        path="/politica-de-privacidade"
      />

      <main
        className="min-h-screen px-4 py-12 sm:px-6 lg:px-8"
        style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}
      >
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/home"
            className="mono-focus-ring mb-6 inline-flex items-center text-sm transition-colors"
            style={{ color: 'var(--color-muted)', textDecoration: 'none' }}
          >
            ← Voltar para o site
          </Link>

          <article
            className="p-6 sm:p-8"
            style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lift)' }}
          >
            <h1 className="ds-h2">Política de Privacidade</h1>
            <p className="ds-caption mt-2" style={{ color: 'var(--color-muted)' }}>Última atualização: 04 de abril de 2026</p>

            <p className="ds-body mt-6" style={{ color: 'var(--color-muted)' }}>
              Esta página explica, de forma simples, como os dados de navegação são tratados no site
              <strong style={{ color: 'var(--color-text)' }}> juliano340.com</strong>.
            </p>

            <section className="mt-8 space-y-4">
              <h2 className="ds-h3" style={{ color: 'var(--color-text)' }}>1. Quais tecnologias usamos</h2>
              <p className="ds-body" style={{ color: 'var(--color-muted)' }}>
                Utilizamos cookies e ferramentas de medição/anúncios para entender visitas e melhorar campanhas, como:
              </p>
              <ul className="ds-body list-disc space-y-2 pl-5" style={{ color: 'var(--color-muted)' }}>
                <li>Meta Pixel (Facebook Ads)</li>
                <li>Google Analytics</li>
                <li>Google Ads / AdSense</li>
              </ul>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="ds-h3" style={{ color: 'var(--color-text)' }}>2. Quando esses cookies são ativados</h2>
              <p className="ds-body" style={{ color: 'var(--color-muted)' }}>
                Essas tecnologias só são carregadas após você clicar em <strong style={{ color: 'var(--color-text)' }}>“Aceitar cookies”</strong> no aviso LGPD do site.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="ds-h3" style={{ color: 'var(--color-text)' }}>3. Quais dados podem ser coletados</h2>
              <p className="ds-body" style={{ color: 'var(--color-muted)' }}>
                Dependendo da ferramenta, podem ser coletados dados de navegação, como páginas acessadas, tempo de visita,
                dispositivo e interações com anúncios.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="ds-h3" style={{ color: 'var(--color-text)' }}>4. Como revogar o consentimento</h2>
              <p className="ds-body" style={{ color: 'var(--color-muted)' }}>
                Você pode limpar os dados do navegador (cookies e armazenamento local) para remover o consentimento e voltar a
                ver o aviso LGPD.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="ds-h3" style={{ color: 'var(--color-text)' }}>5. Contato</h2>
              <p className="ds-body" style={{ color: 'var(--color-muted)' }}>
                Se tiver dúvidas sobre esta política, entre em contato pelo e-mail:{' '}
                <a href="mailto:juliano340@gmail.com" className="font-medium underline" style={{ color: 'var(--color-text)' }}>
                  juliano340@gmail.com
                </a>
              </p>
            </section>
          </article>
        </div>
      </main>
    </>
  );
};

export default PoliticaDePrivacidade;
