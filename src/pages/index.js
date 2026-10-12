import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/pages/components/SEO';

const HOME_PATH = '/home';

// Shim de redirecionamento: responde HTTP 200 com o card OG completo em vez de
// 307 sem corpo. Crawlers que seguem redirect (Facebook, X, LinkedIn) chegam ao
// /home normalmente; os que NÃO seguem (Telegram, WhatsApp, alguns bots) ainda
// extraem título, descrição e imagem. A página segue noindex — a canônica é /home.
const IndexGatePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(HOME_PATH);
  }, [router]);

  return (
    <>
      <SEO
        title="Juliano Pereira | Dev Full Stack — IA e qualidade de software"
        seoTitle="Desenvolvedor Full Stack em Porto Alegre | Juliano Pereira"
        description="Desenvolvedor full stack. Construo MVPs, sistemas e sites com Next.js, TypeScript e IA aplicada — do conceito ao deploy, com comunicação direta."
        path={HOME_PATH}
        noindex
      />
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${HOME_PATH}`} />
      </Head>
      <main
        className="flex min-h-screen items-center justify-center transition-colors duration-300"
        style={{ background: 'var(--color-background)', color: 'var(--color-accent)' }}
      >
        <p className="font-mono text-sm uppercase tracking-[0.16em]">carregando...</p>
      </main>
    </>
  );
};

export default IndexGatePage;
