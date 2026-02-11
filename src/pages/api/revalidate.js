import { getPublishedPosts } from '../../lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = req.headers['x-webhook-secret'];
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Revalida as páginas principais
    await res.revalidate('/blog');
    await res.revalidate('/sitemap.xml');
    
    // Pega todos os posts para revalidar
    const posts = await getPublishedPosts();
    
    // Revalida cada post individualmente
    for (const post of posts) {
      const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
      if (slug) {
        await res.revalidate(`/blog/${slug}`);
      }
    }

    return res.json({ 
      revalidated: true, 
      postsUpdated: posts.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ 
      message: 'Error revalidating', 
      error: err.message 
    });
  }
}
