import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const COOKIE_CONSENT_KEY = 'lgpd_cookie_consent';

const CookieConsentContext = createContext({
  consentGiven: false,
  consentLoaded: false,
  acceptCookies: () => {},
});

export const CookieConsentProvider = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setConsentGiven(savedConsent === 'accepted');
    setConsentLoaded(true);
  }, []);

  const acceptCookies = () => {
    setConsentGiven(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    }
  };

  const value = useMemo(
    () => ({
      consentGiven,
      consentLoaded,
      acceptCookies,
    }),
    [consentGiven, consentLoaded]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);

  if (context === undefined) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }

  return context;
};
