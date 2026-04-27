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

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: false,
    },
  };
}
