export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verifica o secret do webhook
  const secret = req.headers['x-notion-secret'];
  if (secret !== process.env.NOTION_WEBHOOK_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { type, entity } = req.body;
    
    // Só processa se for uma página (post) do database de blog
    if (entity?.type === 'page') {
      console.log(`📩 Webhook recebido: ${type} na página ${entity.id}`);
      
      // Revalida as páginas
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'x-webhook-secret': process.env.REVALIDATE_SECRET,
        },
      });

      return res.json({ 
        success: true, 
        message: 'Revalidação disparada automaticamente',
        pageId: entity.id
      });
    }

    return res.json({ success: true, message: 'Evento ignorado' });
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
