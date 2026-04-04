import Head from 'next/head';
import Link from 'next/link';

const PoliticaDePrivacidade = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidade | Juliano340</title>
        <meta
          name="description"
          content="Política de Privacidade do site juliano340.com sobre uso de cookies, Meta Pixel, Google Analytics e Google Ads."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/home"
            className="mb-6 inline-flex items-center text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            ← Voltar para o site
          </Link>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Política de Privacidade</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Última atualização: 04 de abril de 2026</p>

            <p className="mt-6 text-gray-700 dark:text-gray-300">
              Esta página explica, de forma simples, como os dados de navegação são tratados no site
              <strong> juliano340.com</strong>.
            </p>

            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Quais tecnologias usamos</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Utilizamos cookies e ferramentas de medição/anúncios para entender visitas e melhorar campanhas, como:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                <li>Meta Pixel (Facebook Ads)</li>
                <li>Google Analytics</li>
                <li>Google Ads / AdSense</li>
              </ul>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Quando esses cookies são ativados</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Essas tecnologias só são carregadas após você clicar em <strong>“Aceitar cookies”</strong> no aviso LGPD do site.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Quais dados podem ser coletados</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Dependendo da ferramenta, podem ser coletados dados de navegação, como páginas acessadas, tempo de visita,
                dispositivo e interações com anúncios.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Como revogar o consentimento</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Você pode limpar os dados do navegador (cookies e armazenamento local) para remover o consentimento e voltar a
                ver o aviso LGPD.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Contato</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Se tiver dúvidas sobre esta política, entre em contato pelo e-mail:{' '}
                <a href="mailto:juliano340@gmail.com" className="font-medium text-gray-900 underline dark:text-white">
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
