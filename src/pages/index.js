import Head from 'next/head';
const IndexGatePage = () => {

  return (
    <>
      <Head>
        <title>Carregando | Juliano</title>
        <meta name="robots" content="noindex, nofollow" />
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

export async function getServerSideProps({ req, res, query }) {
  const skipLanding = query.skip === '1';

  if (skipLanding) {
    res.setHeader('Set-Cookie', 'pl_done=true; Path=/; Max-Age=31536000; SameSite=Lax');
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  const cookies = req.headers.cookie || '';
  const jaViuLanding = cookies
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === 'pl_done=true');

  return {
    redirect: {
      destination: jaViuLanding ? '/home' : '/terminal',
      permanent: false,
    },
  };
}
