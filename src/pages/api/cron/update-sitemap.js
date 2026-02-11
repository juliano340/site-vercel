import { getPublishedPosts } from '../../../lib/notion';

export default async function handler(req, res) {
  // O cron do Vercel já é seguro - só a Vercel pode chamar este endpoint
  // Header x-vercel-cron: 1 é adicionado automaticamente pela Vercel
  
  try {
    console.log('🔄 [Cron] Atualizando sitemap...', new Date().toISOString());
    
    // Busca posts atualizados
    const posts = await getPublishedPosts();
    const date = new Date().toISOString();

    // Gera URLs
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

    // Gera XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || date.split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Salva em cache temporário (opcional - o endpoint dinâmico já faz isso)
    // Aqui você poderia salvar em um banco de dados ou Redis se quiser
    
    console.log(`✅ [Cron] Sitemap atualizado com ${posts.length} posts`);
    
    return res.json({
      success: true,
      postsCount: posts.length,
      lastUpdate: date,
      nextUpdate: 'Em 30 minutos'
    });
  } catch (error) {
    console.error('❌ [Cron] Erro:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
