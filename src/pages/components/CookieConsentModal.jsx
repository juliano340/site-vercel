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
        className="mx-auto w-full max-w-5xl rounded-xl p-4 sm:p-5 shadow-xl backdrop-blur-sm"
        style={{
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Ícone + Texto */}
          <div className="flex items-start gap-3 flex-1">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
              style={{
                background: 'rgba(var(--accent-rgb), 0.1)',
                border:     '1px solid rgba(var(--accent-rgb), 0.2)',
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: 'var(--color-accent)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2
                id="lgpd-title"
                className="text-sm font-bold uppercase tracking-[0.12em]"
                style={{ color: 'var(--color-text)' }}
              >
                Aviso de cookies (LGPD)
              </h2>
              <p
                className="mt-1 text-xs leading-relaxed sm:text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                Utilizamos cookies para métricas e anúncios (Meta Pixel, Google Analytics e Google Ads).
                Esses recursos são ativados somente após o seu consentimento.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/politica-de-privacidade"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] rounded-full transition-all duration-200"
              style={{
                background:     'transparent',
                border:         '1px solid var(--color-border)',
                color:          'var(--color-muted)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.4)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              Política
            </Link>

            <button
              type="button"
              onClick={acceptCookies}
              className="mono-button-primary text-xs"
            >
              Aceitar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookieConsentModal;
