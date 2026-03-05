import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const IndexGatePage = () => {
  const router = useRouter();
  const { isReady, query } = router;

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    const skipLanding = query.skip === '1';
    if (skipLanding) {
      localStorage.setItem('pl_done', 'true');
      router.replace('/home');
      return;
    }

    const jaViuLanding = localStorage.getItem('pl_done') === 'true';
    router.replace(jaViuLanding ? '/home' : '/terminal');
  }, [isReady, query.skip, router]);

  return (
    <>
      <Head>
        <title>Carregando | Juliano</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-[#0a120c] text-[#9df4b8]">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">carregando...</p>
      </main>
    </>
  );
};

export default IndexGatePage;
