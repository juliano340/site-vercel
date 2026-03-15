import Head from 'next/head';
import Link from 'next/link';

const faqs = [
  {
    question: 'Como faço backup das minhas corridas?',
    answer:
      'Abra Perfil > Dados e Privacidade > Exportar meus treinos. O RunLab gera automaticamente um arquivo JSON com todo o historico.',
  },
  {
    question: 'Em qual formato os dados sao exportados?',
    answer:
      'A exportacao e feita em JSON (.json). Esse formato e padrao e facilita armazenamento, migracao e restauracao.',
  },
  {
    question: 'Consigo restaurar os dados depois?',
    answer:
      'Sim. Acesse Perfil > Dados e Privacidade > Restaurar backup e selecione o arquivo JSON salvo para recuperar os treinos.',
  },
  {
    question: 'Se eu trocar de celular, perco minhas corridas?',
    answer:
      'Nao, desde que voce tenha feito o backup JSON. No novo dispositivo, basta instalar o app e usar a opcao de importacao.',
  },
  {
    question: 'O RunLab envia meus dados para servidores?',
    answer:
      'Nao. Os dados das corridas ficam sob responsabilidade do usuario, armazenados localmente no dispositivo.',
  },
  {
    question: 'Onde encontro a politica de privacidade?',
    answer:
      'Voce pode acessar a politica completa na pagina oficial de privacidade do RunLab, com detalhes sobre armazenamento local e anuncios.',
  },
];

const RunLabSuportePage = () => {
  return (
    <>
      <Head>
        <title>RunLab - Central de Suporte</title>
        <meta
          name="description"
          content="Central de suporte oficial do RunLab com orientacoes de backup, exportacao JSON, importacao e FAQ."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="relative overflow-hidden border-b border-green-100 dark:border-green-900/40">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-green-100/70 blur-3xl dark:bg-green-900/20" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl dark:bg-emerald-900/20" />

          <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <Link
              href="/runlab"
              className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para RunLab
            </Link>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:border-green-800/60 dark:bg-green-900/30 dark:text-green-300">
              Suporte oficial
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Central de Suporte do RunLab
            </h1>
            <p className="mt-4 max-w-3xl text-base text-gray-600 dark:text-gray-300 md:text-lg">
              Orientacoes oficiais para backup, exportacao em JSON e restauracao segura dos seus treinos.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm dark:border-green-900/40 dark:bg-gray-800 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comece por aqui</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              O RunLab faz backup, exporta os dados no formato JSON e permite importar o arquivo no sistema.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">1) Backup</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Gere uma copia dos seus dados direto no app para evitar perda de historico.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">2) Exportacao JSON</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  O arquivo e exportado no formato JSON para facilitar armazenamento e migracao.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">3) Importacao</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Reimporte o JSON no RunLab para restaurar corridas no mesmo aparelho ou em outro.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Como fazer backup dos seus treinos</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Siga este passo a passo para gerar um backup completo dos seus dados.
              </p>

              <ol className="mt-5 ml-5 list-decimal space-y-3 text-gray-700 dark:text-gray-300">
                <li>Abra o aplicativo RunLab.</li>
                <li>
                  Na barra de navegacao inferior, localize o icone de perfil (representado por uma pessoa),
                  que fica na ultima aba a direita.
                </li>
                <li>Toque na aba Perfil.</li>
                <li>Na tela de perfil, procure pela secao Dados e Privacidade.</li>
                <li>Dentro dessa secao, selecione a opcao Exportar meus treinos.</li>
                <li>Ao selecionar essa opcao, sera aberta a tela de compartilhamento de arquivos do dispositivo.</li>
                <li>
                  Um arquivo no formato JSON (.json) sera gerado automaticamente contendo todos os treinos do usuario.
                </li>
                <li>
                  Salve esse arquivo em um local seguro, como Google Drive, armazenamento do dispositivo
                  ou outro servico de nuvem de sua preferencia.
                </li>
              </ol>

              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                Esse arquivo representa o backup completo dos seus treinos.
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Como restaurar um backup</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Caso seja necessario recuperar os dados posteriormente, siga os passos abaixo.
              </p>

              <ol className="mt-5 ml-5 list-decimal space-y-3 text-gray-700 dark:text-gray-300">
                <li>Acesse novamente a secao Dados e Privacidade dentro da aba Perfil.</li>
                <li>Selecione a opcao Restaurar backup.</li>
                <li>Escolha o arquivo JSON de backup previamente salvo.</li>
                <li>O sistema ira importar os dados e restaurar os treinos no aplicativo.</li>
              </ol>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQ</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Perguntas frequentes sobre backup, restauracao, importacao e privacidade.</p>

            <div className="mt-6 space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-gray-200 bg-gray-50 p-4 open:border-green-300 open:bg-green-50/40 dark:border-gray-700 dark:bg-gray-900/50 dark:open:border-green-800 dark:open:bg-green-900/10"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-gray-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-lg md:p-8">
            <h2 className="text-2xl font-bold">Ainda precisa de ajuda?</h2>
            <p className="mt-2 text-green-100">
              Fale com o suporte do RunLab e descreva sua duvida. Vamos te ajudar com backup, importacao e uso do app.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:juliano340@gmail.com"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-green-700 transition hover:scale-[1.02]"
              >
                Enviar email para suporte
              </a>
              <Link
                href="/privacidade-runlab"
                className="inline-flex items-center justify-center rounded-xl border border-white/50 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Ver politica de privacidade
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RunLabSuportePage;
