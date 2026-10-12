import Head from 'next/head';
import {
  absoluteUrl,
  SITE_NAME,
  SITE_TITLE_SUFFIX,
  SITE_LOCALE,
  TWITTER_HANDLE,
  DEFAULT_DESCRIPTION,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_URL,
} from '@/lib/seo';

// A imagem Open Graph é ÚNICA para o site inteiro: todo preview — home, blog,
// artigo, contato — usa /og/default.png. Um só arquivo em cache CDN, que nunca
// dá 404 e não depende de build. Os textos (title/description) é que variam
// por página, via props.
const OG_IMAGE_ALT = `${SITE_NAME} — Desenvolvedor Full Stack`;

// Fonte única de metadados (og:*, twitter:*, canonical, robots).
// Toda página usa <SEO /> — nunca meta tags soltas em <Head> próprios,
// pois next/head NÃO deduplica meta[property], só meta[name].
//
// Props:
//   path       — canônica do destino; null suprime canonical E og:url.
//   noindex    — robots noindex/nofollow (não afeta og:url).
//   profile    — { firstName, lastName, username, gender } para type="profile".
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  section,
  profile,
  noindex = false,
}) => {
  // Este arquivo mora dentro de pages/, então o Next.js também o prerenderiza
  // como a rota /components/SEO — sem props e sem title. Renderiza nada.
  if (typeof title !== 'string' || !title) return null;

  const canonicalUrl = path ? absoluteUrl(path) : null;

  // Sufixo de título: só acrescenta se o título ainda não o mencionar.
  const hasSuffix = title.toLowerCase().includes(SITE_TITLE_SUFFIX.toLowerCase());
  const fullTitle = hasSuffix ? title : `${title} | ${SITE_TITLE_SUFFIX}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta key="og-type" property="og:type" content={type} />
      <meta key="og-site" property="og:site_name" content={SITE_NAME} />
      <meta key="og-locale" property="og:locale" content={SITE_LOCALE} />
      <meta key="og-title" property="og:title" content={title} />
      <meta key="og-desc" property="og:description" content={description} />
      {canonicalUrl && <meta key="og-url" property="og:url" content={canonicalUrl} />}
      <meta key="og-image" property="og:image" content={OG_IMAGE_URL} />
      {/* secure_url é lido por WhatsApp/Slack antes do og:image em alguns
          caminhos de compartilhamento. */}
      <meta key="og-img-secure" property="og:image:secure_url" content={OG_IMAGE_URL} />
      <meta key="og-img-type" property="og:image:type" content={OG_IMAGE_TYPE} />
      <meta key="og-img-w" property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta key="og-img-h" property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta key="og-img-alt" property="og:image:alt" content={OG_IMAGE_ALT} />

      {type === 'profile' && profile && (
        <>
          {profile.firstName && (
            <meta key="og-p-first" property="og:profile:first_name" content={profile.firstName} />
          )}
          {profile.lastName && (
            <meta key="og-p-last" property="og:profile:last_name" content={profile.lastName} />
          )}
          {profile.username && (
            <meta key="og-p-user" property="og:profile:username" content={absoluteUrl(profile.username)} />
          )}
          {profile.gender && (
            <meta key="og-p-gender" property="og:profile:gender" content={profile.gender} />
          )}
        </>
      )}

      {type === 'article' && (publishedTime || modifiedTime) && (
        <>
          {publishedTime && (
            <meta key="og-published" property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta key="og-modified" property="article:modified_time" content={modifiedTime} />
          )}
          <meta key="og-author" property="article:author" content={absoluteUrl('/sobre')} />
          {section && <meta key="og-section" property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={`og-tag-${tag}`} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter / X — summary_large_image */}
      <meta key="tw-card" name="twitter:card" content="summary_large_image" />
      <meta key="tw-site" name="twitter:site" content={TWITTER_HANDLE} />
      <meta key="tw-creator" name="twitter:creator" content={TWITTER_HANDLE} />
      <meta key="tw-title" name="twitter:title" content={title} />
      <meta key="tw-desc" name="twitter:description" content={description} />
      <meta key="tw-image" name="twitter:image" content={OG_IMAGE_URL} />
      <meta key="tw-image-width" name="twitter:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta key="tw-image-height" name="twitter:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta key="tw-img-alt" name="twitter:image:alt" content={OG_IMAGE_ALT} />
    </Head>
  );
};

export default SEO;
