import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <meta charSet="UTF-8" />
          <link rel="icon" href="/favicon.png" type="image/png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src="https://kit.fontawesome.com/0934ea43d0.js" crossOrigin="anonymous" strategy="afterInteractive" />
          <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8578901708699710" crossOrigin="anonymous" strategy="lazyOnload" />

          {/* Google Analytics */}
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GT25VEZ912" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GT25VEZ912');
            `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
