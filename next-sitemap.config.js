/** @type {import('next-sitemap').IConfig} */

// Função para buscar posts publicados do Notion
const getPublishedPosts = async () => {
  try {
    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results;
  } catch (error) {
    console.error('Erro ao buscar posts do Notion:', error);
    return [];
  }
};

module.exports = {
  siteUrl: 'https://juliano340.com',
  generateRobotsTxt: true,
  exclude: ['/components/*', '/api/*'],

  // Transforma a configuração para adicionar paths dinâmicos
  additionalPaths: async (config) => {
    const publishedPosts = await getPublishedPosts();
    
    // Gera URLs para cada post publicado
    const postUrls = publishedPosts
      .map((post) => {
        const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
        if (!slug) return null;
        
        return {
          loc: `/blog/${slug}`,
          lastmod: post.last_edited_time,
          changefreq: 'weekly',
          priority: 0.8,
        };
      })
      .filter(Boolean); // Remove nulls

    return postUrls;
  },
};
  