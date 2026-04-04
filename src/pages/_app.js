import Head from 'next/head';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Layout from './components/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';
import CookieConsentModal from './components/CookieConsentModal';
import { CookieConsentProvider, useCookieConsent } from '@/contexts/CookieConsentContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { consentGiven } = useCookieConsent();
  const hideConsentNotice = router.pathname === '/' || router.pathname === '/terminal';

  useEffect(() => {
    if (!consentGiven) return undefined;

    const handleRouteChange = (url) => {
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }

      if (window.gtag) {
        window.gtag('config', 'G-GT25VEZ912', {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [consentGiven, router.events]);

  return (
    <div className={`${poppins.variable} font-sans`}>
      {consentGiven ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1002499805770144');
              fbq('track', 'PageView');
            `}
          </Script>

          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8578901708699710"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-GT25VEZ912"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-GT25VEZ912', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      ) : null}

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
      </Layout>

      <CookieConsentModal enabled={!hideConsentNotice} />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <CookieConsentProvider>
      <ThemeProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </ThemeProvider>
    </CookieConsentProvider>
  );
}

export default MyApp;
