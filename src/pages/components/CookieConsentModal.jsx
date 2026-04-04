import Link from 'next/link';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookieConsentModal = ({ enabled = true }) => {
  const { consentGiven, consentLoaded, acceptCookies } = useCookieConsent();

  const shouldShow = enabled && consentLoaded && !consentGiven;

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[180] p-3 sm:p-4">
      <section
        role="region"
        aria-labelledby="lgpd-title"
        className="mx-auto w-full max-w-5xl rounded-xl border border-gray-300 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95 sm:p-5"
      >
        <h2 id="lgpd-title" className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
          Aviso de cookies (LGPD)
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300 sm:text-sm">
          Utilizamos cookies e tecnologias similares para métricas e anúncios (Meta Pixel, Google Analytics e Google Ads).
          Esses recursos só são ativados após o seu consentimento.
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/politica-de-privacidade"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 sm:text-sm"
          >
            Ler política de privacidade
          </Link>
          <button
            type="button"
            onClick={acceptCookies}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300 sm:text-sm"
          >
            Aceitar cookies
          </button>
        </div>
      </section>
    </div>
  );
};

export default CookieConsentModal;
