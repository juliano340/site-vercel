import { getPublishedPosts } from '../../lib/notion';

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export default async function handler(req, res) {
  try {
    const posts = await getPublishedPosts();
    const date = new Date().toISOString();

    const urls = [
      { loc: 'https://www.juliano340.com/home', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://www.juliano340.com/blog', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://www.juliano340.com/contato', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://www.juliano340.com/links', priority: '0.5', changefreq: 'monthly' },
      ...posts.map(post => {
        const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
        if (!slug) return null;
        const lastmod = post.last_edited_time.split('T')[0];
        return {
          loc: `https://www.juliano340.com/blog/${slug}`,
          lastmod,
          priority: '0.8',
          changefreq: 'weekly'
        };
      }).filter(Boolean)
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod || date.split('T')[0])}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.send(sitemap);
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
