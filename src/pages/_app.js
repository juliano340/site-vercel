import Head from 'next/head';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Layout from './components/Layout';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={`${poppins.variable} font-sans`}>
      <Layout>
        <Head>
          <title>@JULIANO340 - Desenvolvedor Full Stack</title>
          <meta name="description" content="Portfólio de Juliano Pereira (@JULIANO340), Desenvolvedor Full Stack especializado em soluções web eficientes e inovadoras." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.juliano340.com/" />
          <meta property="og:title" content="@JULIANO340 - Desenvolvedor Full Stack" />
          <meta property="og:description" content="Criando soluções web eficientes e inovadoras. Confira meu portfólio e projetos." />
          <meta property="og:image" content="https://www.juliano340.com/og-image.png" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.juliano340.com/" />
          <meta property="twitter:title" content="@JULIANO340 - Desenvolvedor Full Stack" />
          <meta property="twitter:description" content="Criando soluções web eficientes e inovadoras. Confira meu portfólio e projetos." />
          <meta property="twitter:image" content="https://www.juliano340.com/og-image.png" />
        </Head>
        <Component {...pageProps} />
      </Layout >
    </div>
  );
}

export default MyApp;
