const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function updateSitemap() {
  try {
    console.log('🔄 Buscando posts do Notion...');
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    });

    const posts = response.results;
    const date = new Date().toISOString();

    // Gera XML do sitemap
    const urls = [
      // URLs estáticas
      { loc: 'https://juliano340.com/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://juliano340.com/blog', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://juliano340.com/contato', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://juliano340.com/links', priority: '0.5', changefreq: 'monthly' },
      // URLs dos posts
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

    // Salva o sitemap
    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap-0.xml'), sitemap);
    
    // Atualiza o índice do sitemap
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://juliano340.com/sitemap-0.xml</loc>
    <lastmod>${date.split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);

    console.log(`✅ Sitemap atualizado com ${posts.length} posts!`);
    console.log('📄 Arquivos gerados:');
    console.log('   - public/sitemap.xml');
    console.log('   - public/sitemap-0.xml');
    
    return { success: true, postsCount: posts.length };
  } catch (error) {
    console.error('❌ Erro ao atualizar sitemap:', error);
    throw error;
  }
}

// Se executado diretamente
if (require.main === module) {
  updateSitemap()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { updateSitemap };
