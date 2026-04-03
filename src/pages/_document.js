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
        </Head>
        <body>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1381205888731588&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          <Main />
          <NextScript />
          <Script src="https://kit.fontawesome.com/0934ea43d0.js" crossOrigin="anonymous" strategy="lazyOnload" />
          <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8578901708699710" crossOrigin="anonymous" strategy="lazyOnload" />

          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GT25VEZ912" strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
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
