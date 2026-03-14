import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PrivacidadeRunLab = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const lastUpdated = '14 de Março de 2026';

  return (
    <>
      <Head>
        <title>Política de Privacidade - RunLab</title>
        <meta name="description" content="Política de Privacidade do RunLab - App de registro de corridas" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link 
              href="/links" 
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Links
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                RunLab
              </h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">Política de Privacidade</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
            
            {/* Introdução */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                1. Introdução
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta Política de Privacidade descreve como o RunLab coleta, usa e protege suas informações. 
                O RunLab é um aplicativo que armazena todos os dados de suas corridas <strong>exclusivamente no seu dispositivo</strong>. 
                Não coletamos, transmitimos ou compartilhamos nenhuma informação pessoal com terceiros.
              </p>
            </section>

            {/* Dados Coletados */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                2. Dados Coletados
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                O RunLab armazena apenas os seguintes dados <strong>localmente no seu dispositivo</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Distância percorrida</li>
                <li>Tempo de duração da corrida</li>
                <li>Ritmo médio</li>
                <li>Localização (durante a atividade, apenas para rastreamento da rota)</li>
                <li>Data e hora das atividades</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>Importante:</strong> Todos esses dados ficam armazenados exclusivamente no seu dispositivo. 
                O aplicativo não possui servidor próprio nem banco de dados externo.
              </p>
            </section>

            {/* Uso dos Dados */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                3. Uso dos Dados
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Os dados armazenados localmente são utilizados <strong>exclusivamente para</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-2">
                <li>Exibir seu histórico de corridas no próprio aplicativo</li>
                <li>Calcular estatísticas pessoais (ritmo, distância total, etc.)</li>
                <li>Mostrar sua rota no mapa durante a atividade</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>Os dados nunca são compartilhados</strong> com servidores externos, empresas parceiras ou terceiros.
              </p>
            </section>

            {/* Anúncios */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                4. Publicidade e Anúncios
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                O RunLab exibe anúncios para manter o aplicativo gratuito. Esses anúncios são fornecidos por redes 
                de publicidade terceiras (como Google AdMob) e <strong>não têm acesso</strong> aos seus dados pessoais 
                ou dados de corrida armazenados no aplicativo.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Os anúncios podem coletar informações básicas do dispositivo (como tipo de dispositivo e idioma) 
                para exibir anúncios relevantes, mas <strong>nenhuma informação sobre suas corridas ou localização</strong> 
                é compartilhada com os anunciantes.
              </p>
            </section>

            {/* Armazenamento */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                5. Armazenamento e Segurança
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Todos os dados são armazenados localmente</strong> no seu dispositivo móvel. 
                O RunLab não possui acesso aos seus dados, não mantém servidores e não realiza backup 
                na nuvem de suas informações.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                <strong>Sua responsabilidade:</strong> Como os dados ficam armazenados apenas no seu dispositivo, 
                a segurança e o backup desses dados são de sua responsabilidade. Recomendamos fazer backups 
                regulares do seu dispositivo.
              </p>
            </section>

            {/* Compartilhamento */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                6. Compartilhamento de Informações
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>O RunLab NÃO compartilha nenhuma informação do usuário com terceiros.</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                Não vendemos, locamos ou compartilhamos seus dados com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-2">
                <li>Empresas de análise de dados</li>
                <li>Redes sociais</li>
                <li>Parceiros comerciais</li>
                <li>Governos ou autoridades</li>
                <li>Qualquer terceiro</li>
              </ul>
            </section>

            {/* Permissões */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                7. Permissões do Aplicativo
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                O RunLab pode solicitar as seguintes permissões:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Localização:</strong> Apenas para rastrear sua rota durante a corrida. Os dados de localização são processados localmente e nunca saem do seu dispositivo.</li>
                <li><strong>Notificações:</strong> Para alerts durante a atividade (se ativado por você).</li>
              </ul>
            </section>

            {/* Seus Direitos */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                8. Seus Direitos
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Como seus dados ficam armazenados apenas no seu dispositivo, você tem controle total sobre eles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-2">
                <li><strong>Acessar:</strong> Visualizar seus dados a qualquer momento no aplicativo</li>
                <li><strong>Excluir:</strong> Remover todos os dados diretamente no aplicativo ou desinstalando-o</li>
                <li><strong>Exportar:</strong> Você pode exportar seus dados se o recurso estiver disponível</li>
              </ul>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                9. Entre em Contato
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre como o RunLab trata seus dados, entre em contato:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> contato@juliano340.com
                </p>
              </div>
            </section>

            {/* Última seção */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                10. Alterações na Política
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta política pode ser atualizada periodicamente. Qualquer alteração será comunicada 
                através de uma notificação no aplicativo ou pela atualização desta página. 
                Recomendamos que você revise esta política regularmente.
              </p>
            </section>

          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>© 2026 RunLab. Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido por Juliano Pereira</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacidadeRunLab;
