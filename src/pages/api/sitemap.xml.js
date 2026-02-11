import { getPublishedPosts } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    const posts = await getPublishedPosts();
    const date = new Date().toISOString();

    const urls = [
      { loc: 'https://juliano340.com/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://juliano340.com/blog', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://juliano340.com/contato', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://juliano340.com/links', priority: '0.5', changefreq: 'monthly' },
      ...posts.map(post => {
        const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
        const lastmod = post.last_edited_time.split('T')[0];
        return {
          loc: `https://juliano340.com/blog/${slug}`,
          lastmod,
          priority: '0.8',
          changefreq: 'weekly'
        };
      }).filter(url => url.loc.includes('/blog/'))
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || date.split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
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
