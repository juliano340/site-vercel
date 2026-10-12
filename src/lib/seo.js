// Fonte única de verdade para URLs e identidade nos metadados.
// Substituto do metadataBase (exclusivo do App Router) para Pages Router.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.juliano340.com';

export const SITE_NAME = 'Juliano Pereira';
export const SITE_TITLE_SUFFIX = 'Juliano340';
export const SITE_LOCALE = 'pt_BR';
export const TWITTER_HANDLE = '@JULIANO340';

export const DEFAULT_DESCRIPTION =
  'Desenvolvedor full stack. Construo MVPs, sistemas e sites com Next.js, TypeScript e IA aplicada — do conceito ao deploy.';

// 1200x630 é o tamanho ideal para Open Graph e Twitter summary_large_image.
// Uma única imagem PNG serve o site inteiro (gerada por scripts/generate-og.mjs).
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/png';
export const OG_IMAGE_PATH = '/og/default.png';

// Converte um path (absoluto no site ou URL completa) em URL absoluta.
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString();

export const OG_IMAGE_URL = absoluteUrl(OG_IMAGE_PATH);
