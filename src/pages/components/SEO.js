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
} from '@/lib/seo';

const DEFAULT_IMAGE_PATH = '/og/default.png';
const DEFAULT_IMAGE_ALT = `${SITE_NAME} — Desenvolvedor Full Stack`;

// Fonte única de metadados (og:*, twitter:*, canonical, robots).
// Toda página usa <SEO /> — nunca meta tags soltas em <Head> próprios,
// pois next/head NÃO deduplica meta[property], só meta[name].
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  image,
  imageAlt = DEFAULT_IMAGE_ALT,
  publishedTime,
  modifiedTime,
  tags = [],
  noindex = false,
}) => {
  const canonicalUrl = absoluteUrl(path);

  const imageUrl = absoluteUrl(image || DEFAULT_IMAGE_PATH);
  const fullTitle = /juliano/i.test(title) ? title : `${title} | ${SITE_TITLE_SUFFIX}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta key="og-type" property="og:type" content={type} />
      <meta key="og-site" property="og:site_name" content={SITE_NAME} />
      <meta key="og-locale" property="og:locale" content={SITE_LOCALE} />
      <meta key="og-title" property="og:title" content={title} />
      <meta key="og-desc" property="og:description" content={description} />
      <meta key="og-url" property="og:url" content={canonicalUrl} />
      <meta key="og-image" property="og:image" content={imageUrl} />
      <meta key="og-img-w" property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta key="og-img-h" property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta key="og-img-alt" property="og:image:alt" content={imageAlt} />

      {type === 'article' && (publishedTime || modifiedTime) && (
        <>
          {publishedTime && (
            <meta key="og-published" property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta key="og-modified" property="article:modified_time" content={modifiedTime} />
          )}
          <meta key="og-author" property="article:author" content={absoluteUrl('/sobre')} />
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
      <meta key="tw-image" name="twitter:image" content={imageUrl} />
      <meta key="tw-img-alt" name="twitter:image:alt" content={imageAlt} />
    </Head>
  );
};

export default SEO;
