import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { getPublishedPosts, getPage, getBlocks } from '../../lib/notion';
import { calculateReadingTimeFromBlocks } from '@/lib/readingTime';

const AUTHOR_NAME = 'Juliano Pereira';
const AUTHOR_AVATAR = 'https://avatars.githubusercontent.com/u/87342139?v=4';
const AUTHOR_BIO = 'Desenvolvedor Full Stack apaixonado por tecnologia, empreendedorismo e IA aplicada a negócios.';

const extractTableOfContents = (blocks) => {
  return blocks
    .filter(block => block.type === 'heading_2' || block.type === 'heading_3')
    .map((block, index) => {
      const text = block[block.type]?.rich_text?.map(t => t.text?.content).join('') || '';
      const id = `heading-${index}`;
      return {
        text,
        level: block.type === 'heading_2' ? 2 : 3,
        id
      };
    });
};

export async function getStaticPaths() {
  // Busca apenas posts publicados do Notion
  const publishedPosts = await getPublishedPosts();
  
  const paths = publishedPosts.map(post => {
    const slug = post.properties.Slug?.rich_text?.[0]?.text?.content;
    if (!slug) {
      console.error(`Post with ID ${post.id} is missing a slug`);
      return null;
    }
    return { params: { slug } };
  }).filter(Boolean);

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // Busca apenas posts publicados do Notion
  const publishedPosts = await getPublishedPosts();

  const post = publishedPosts.find(post => post.properties.Slug?.rich_text?.[0]?.text?.content === slug);

  // Se o post não estiver publicado ou não existir, redireciona para o blog
  if (!post) {
    return {
      redirect: {
        destination: '/blog',
        permanent: true, // 301 redirect - SEO friendly
      },
    };
  }

  const page = await getPage(post.id);
  const blocks = await getBlocks(post.id);

  const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;
  
  // Posts relacionados (mesmas tags) - apenas entre posts publicados
  const currentTags = post.properties.Tags?.multi_select?.map(t => t.name) || [];
  const rawRelatedPosts = publishedPosts
    .filter(p => {
      if (p.id === post.id) return false;
      const pTags = p.properties.Tags?.multi_select?.map(t => t.name) || [];
      return pTags.some(tag => currentTags.includes(tag));
    })
    .slice(0, 3);
  
  // Últimas publicações - apenas posts publicados
  const rawRecentPosts = publishedPosts
    .filter(p => p.id !== post.id)
    .slice(0, 5);

  const readingTimeByPostId = new Map();
  readingTimeByPostId.set(post.id, calculateReadingTimeFromBlocks(blocks));

  const readingTimeCandidates = Array.from(
    new Map(
      [...rawRelatedPosts, ...rawRecentPosts].map((candidate) => [candidate.id, candidate])
    ).values()
  );

  const readingTimeResults = await Promise.allSettled(
    readingTimeCandidates.map(async (candidate) => {
      const candidateBlocks = await getBlocks(candidate.id);
      return [candidate.id, calculateReadingTimeFromBlocks(candidateBlocks)];
    })
  );

  readingTimeResults.forEach((result, index) => {
    const postId = readingTimeCandidates[index]?.id;
    if (!postId) return;

    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      readingTimeByPostId.set(postId, result.value[1] || 1);
      return;
    }

    readingTimeByPostId.set(postId, 1);
  });

  const relatedPosts = rawRelatedPosts.map((p) => ({
    title: p.properties.Page?.title?.[0]?.text?.content || 'Post',
    slug: p.properties.Slug?.rich_text?.[0]?.text?.content,
    readingTime: readingTimeByPostId.get(p.id) || 1,
  }));

  const recentPosts = rawRecentPosts.map((p) => ({
    title: p.properties.Page?.title?.[0]?.text?.content || 'Post',
    slug: p.properties.Slug?.rich_text?.[0]?.text?.content,
    readingTime: readingTimeByPostId.get(p.id) || 1,
  }));

  return {
    props: {
      post: page,
      blocks,
      prevPost: prevPost ? {
        title: prevPost.properties.Page?.title?.[0]?.text?.content || 'Post anterior',
        slug: prevPost.properties.Slug?.rich_text?.[0]?.text?.content
      } : null,
      nextPost: nextPost ? {
        title: nextPost.properties.Page?.title?.[0]?.text?.content || 'Próximo post',
        slug: nextPost.properties.Slug?.rich_text?.[0]?.text?.content
      } : null,
      relatedPosts,
      recentPosts,
    },
    revalidate: 10,
  };
}

const countWeirdChars = (value = '') => (value.match(/[�ǭǜǦ��]/g) || []).length;

const repairText = (value = '') => {
  if (!value || typeof value !== 'string') return value;

  const candidates = [value];

  try {
    candidates.push(Buffer.from(value, 'latin1').toString('utf8'));
  } catch (_) { }

  try {
    candidates.push(decodeURIComponent(escape(value)));
  } catch (_) { }

  let best = value;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const weird = countWeirdChars(candidate);
    const replacement = (candidate.match(/�/g) || []).length;
    const score = weird * 3 + replacement * 5;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
};

const renderRichText = (richTextArray) => {
  return richTextArray.map((text, index) => {
    const content = repairText(text?.text?.content || '');
    if (text.href) {
      return (
        <a key={index} href={text.href} className="text-blue-500 hover:underline" style={{
          fontWeight: text.annotations.bold ? 'bold' : 'normal',
          fontStyle: text.annotations.italic ? 'italic' : 'normal',
          textDecoration: `${text.annotations.underline ? 'underline' : ''} ${text.annotations.strikethrough ? 'line-through' : ''}`,
          color: text.annotations.color !== 'default' ? text.annotations.color : 'inherit',
        }}>
          {content}
        </a>
      );
    }
    return (
      <span key={index} style={{
        fontWeight: text.annotations.bold ? 'bold' : 'normal',
        fontStyle: text.annotations.italic ? 'italic' : 'normal',
        textDecoration: `${text.annotations.underline ? 'underline' : ''} ${text.annotations.strikethrough ? 'line-through' : ''}`,
        color: text.annotations.color !== 'default' ? text.annotations.color : 'inherit',
      }}>
        {content}
      </span>
    );
  });
};

const renderBlock = (block, addId = false) => {
  const { type, id, paragraph, image, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item, embed, video, code, to_do, child_database, quote, divider } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed my-6">
          {renderRichText(paragraph.rich_text)}
        </p>
      );
    case 'image':
      const imageUrl = image?.file?.url || image?.external?.url;
      if (!imageUrl) {
        console.error(`Image block with ID ${id} is missing a URL`);
        return null;
      }
      const imageCaption = image.caption?.[0]?.plain_text || '';
      return (
        <div key={id} className="my-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={imageUrl}
            alt={imageCaption || 'Image'}
            className="w-full h-auto"
          />
          {imageCaption && <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-3 bg-gray-50 dark:bg-gray-800">{imageCaption}</p>}
        </div>
      );
    case 'heading_1':
      return <h1 key={id} className="text-4xl font-bold text-[#111111] dark:text-white my-8">{renderRichText(heading_1.rich_text)}</h1>;
    case 'heading_2':
      return <h2 key={id} id={addId ? `heading-${block.index}` : undefined} className="text-2xl font-semibold text-[#111111] dark:text-white mt-10 mb-4 border-l-4 border-[#00B140] pl-4 scroll-mt-24">{renderRichText(heading_2.rich_text)}</h2>;
    case 'heading_3':
      return <h3 key={id} id={addId ? `heading-${block.index}` : undefined} className="text-xl font-semibold text-[#00B140] mt-8 mb-3 scroll-mt-24">{renderRichText(heading_3.rich_text)}</h3>;
    case 'bulleted_list_item':
      return <li key={id} className="ml-4 list-disc text-lg text-gray-700 dark:text-gray-300">{renderRichText(bulleted_list_item.rich_text)}</li>;
    case 'numbered_list_item':
      return <li key={id} className="ml-4 list-decimal text-lg text-gray-700 dark:text-gray-300">{renderRichText(numbered_list_item.rich_text)}</li>;
    case 'embed':
      const embedUrl = embed.url;
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(embedUrl);
      if (isImage) {
        return (
          <div key={id} className="text-center my-8">
            <img
              src={embedUrl}
              alt="Embedded Image"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        );
      }
      return (
        <div key={id} className="text-center my-8">
          <iframe
            src={embedUrl}
            title="Embed"
            className="w-full"
            style={{ height: 'auto' }}
          />
        </div>
      );
    case 'video':
      let videoUrl = video.external.url;
      if (!videoUrl) {
        console.error(`Video block with ID ${id} is missing a URL`);
        return null;
      }

      if (videoUrl.includes('youtube.com')) {
        const videoId = videoUrl.split('v=')[1];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      return (
        <div key={id} className="text-center my-8">
          <iframe
            src={videoUrl}
            title="Video"
            className="w-full h-96"
            allowFullScreen
          />
        </div>
      );
    case 'code':
      return (
        <pre key={id} className="bg-[#1e1e1e] rounded-lg p-5 my-6 overflow-x-auto shadow-lg">
          <code className="text-sm font-mono text-gray-100 language-javascript">
            {Array.isArray(code.rich_text) ? code.rich_text.map((text, index) => (
              <span key={index}>
                {text.text.content}
              </span>
            )) : code.rich_text?.[0]?.text.content || ''}
          </code>
        </pre>
      );
    case 'to_do':
      return (
        <div key={id} className="my-4 flex items-center">
          <input type="checkbox" checked={to_do.checked} readOnly className="mr-2" />
          <span>
            {renderRichText(to_do.rich_text)}
          </span>
        </div>
      );
    case 'child_database':
      return (
        <div key={id} className="my-4">
          <strong>{child_database.title}</strong>
        </div>
      );
    case 'quote':
      return (
        <blockquote key={id} className="border-l-4 border-[#00B140] bg-[#00B140]/5 dark:bg-[#00B140]/10 pl-6 py-4 my-8 italic text-gray-700 dark:text-gray-300 text-lg">
          {renderRichText(quote.rich_text)}
        </blockquote>
      );
    case 'divider':
      return (
        <hr key={id} className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
      );
    default:
      return <p key={id}>[Unsupported block type: {type}]</p>;
  }
};

const Post = ({ post, blocks, prevPost, nextPost, relatedPosts, recentPosts }) => {
    const slug = post?.properties?.Slug?.rich_text?.[0]?.text?.content || '';
    const rawTitle = post?.properties?.Page?.title?.[0]?.text?.content || 'Post';
    const pageTitle = repairText(rawTitle);

    const descriptionRaw = post?.properties?.Description?.rich_text?.map((t) => t?.text?.content || '').join(' ') || '';
    const firstParagraph = blocks?.find((b) => b.type === 'paragraph')?.paragraph?.rich_text?.map((t) => t?.text?.content || '').join(' ') || '';
    const metaDescription = repairText(descriptionRaw || firstParagraph).slice(0, 160) || 'Artigo sobre tecnologia, empreendedorismo e IA aplicada a negócios.';

    const canonical = `https://www.juliano340.com/blog/${slug}`;

    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: pageTitle, href: '#' },
    ];

    const readingTime = calculateReadingTimeFromBlocks(blocks);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.juliano340.com/blog/${slug}`;
    const shareTitle = encodeURIComponent(pageTitle);
    const tableOfContents = extractTableOfContents(blocks);
    
    const [activeSection, setActiveSection] = useState('');
    const [copied, setCopied] = useState(false);
    const [prismLoaded, setPrismLoaded] = useState(false);

    useEffect(() => {
      const loadPrism = async () => {
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
        script.async = true;
        script.onload = () => {
          setPrismLoaded(true);
        };
        document.body.appendChild(script);
      };
      loadPrism();
    }, []);

    useEffect(() => {
      if (prismLoaded && typeof window !== 'undefined' && window.Prism) {
        window.Prism.highlightAll();
      }
    }, [blocks, prismLoaded]);
    
    useEffect(() => {
      const handleScroll = () => {
        const headings = document.querySelectorAll('h2[id], h3[id]');
        let current = '';
        
        headings.forEach(heading => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            current = heading.id;
          }
        });
        
        setActiveSection(current);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const handleCopyLink = () => {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    // Adicionar índice aos blocos de heading
    const blocksWithIndex = blocks.map((block, index) => ({
      ...block,
      index
    }));

    return (
        <>
            <Head>
                <title>{`${pageTitle} | @JULIANO340`}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonical} />

                <meta property="og:type" content="article" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={canonical} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={metaDescription} />
            </Head>

            <main className="container mx-auto px-4 py-8 min-h-screen bg-[#F6F7F8] dark:bg-gray-900 transition-colors duration-300">
              {/* Link voltar ao topo */}
              <div className="mb-6">
                <Link href="/blog" legacyBehavior>
                  <a className="inline-flex items-center text-[#00B140] hover:underline font-medium">
                    ← Voltar ao blog
                  </a>
                </Link>
              </div>

              <Breadcrumb paths={breadcrumbPaths} />
              
              {/* Layout 2 colunas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                {/* Coluna principal (70%) */}
                <div className="lg:col-span-8">
                  <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {/* Imagem de capa */}
                    <div className="relative h-64 md:h-80 w-full">
                      <img 
                        src={`https://picsum.photos/seed/${post.id}/1200/600`}
                        alt={pageTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-6 md:p-10">
                      {/* Título */}
                      <h1 className="text-3xl md:text-5xl font-bold text-[#111111] dark:text-white mb-6 leading-tight">
                        {pageTitle}
                      </h1>
                      
                      {/* Autor e meta */}
                      <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                        <img 
                          src={AUTHOR_AVATAR} 
                          alt={AUTHOR_NAME}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#00B140]"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold text-[#111111] dark:text-white">{AUTHOR_NAME}</p>
                          <Link href="/contato" legacyBehavior>
                            <a className="text-sm text-[#00B140] hover:underline">Enviar email</a>
                          </Link>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>📅 {new Date(post.last_edited_time || post.created_time).toLocaleDateString('pt-BR')}</span>
                          <span>⏱️ {readingTime} min de leitura</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {post.properties?.Tags?.multi_select && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {post.properties.Tags.multi_select.map(tag => (
                            <span key={tag.name} className="text-xs px-3 py-1 rounded-full bg-[#00B140]/10 text-[#00B140] font-medium">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Conteúdo do post */}
                      <div className="prose prose-lg max-w-none">
                        {blocksWithIndex.map(block => renderBlock(block, true))}
                      </div>
                      
                      {/* Compartilhamento */}
                      <div className="flex flex-wrap items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Compartilhar:</span>
                        <div className="flex gap-3">
                          <a 
                            href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            Twitter
                          </a>
                          <a 
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            LinkedIn
                          </a>
                          <a 
                            href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            WhatsApp
                          </a>
                          <button 
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            {copied ? 'Copiado!' : 'Copiar link'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Navegação anterior/próximo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                        {prevPost && (
                          <Link href={`/blog/${prevPost.slug}`} legacyBehavior>
                            <a className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#00B140] hover:shadow-md transition-all group">
                              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#00B140]">← Post anterior</span>
                              <p className="font-semibold text-[#111111] dark:text-white mt-1 line-clamp-2">{prevPost.title}</p>
                            </a>
                          </Link>
                        )}
                        {nextPost && (
                          <Link href={`/blog/${nextPost.slug}`} legacyBehavior>
                            <a className={`p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#00B140] hover:shadow-md transition-all group ${!prevPost ? 'md:col-start-2' : ''}`}>
                              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#00B140]">Próximo post →</span>
                              <p className="font-semibold text-[#111111] dark:text-white mt-1 line-clamp-2">{nextPost.title}</p>
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
                
                {/* Sidebar (30%) - Fixa */}
                <aside className="lg:col-span-4">
                  <div className="sticky top-8 space-y-6">
                    {/* Índice do artigo */}
                    {tableOfContents.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                          <span>📑</span> Neste artigo
                        </h3>
                        <nav className="space-y-2">
                          {tableOfContents.map((item, index) => (
                            <a
                              key={index}
                              href={`#${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className={`block text-sm transition-colors ${
                                item.level === 2 ? 'font-medium' : 'pl-4 text-gray-600 dark:text-gray-400'
                              } ${
                                activeSection === item.id 
                                  ? 'text-[#00B140] font-semibold' 
                                  : 'text-gray-700 dark:text-gray-300 hover:text-[#00B140]'
                              }`}
                            >
                              {item.text}
                            </a>
                          ))}
                        </nav>
                      </div>
                    )}
                    
                    {/* Compartilhamento fixo */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <h3 className="text-base font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                        <span>🔗</span> Compartilhar
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium text-center"
                        >
                          Twitter
                        </a>
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium text-center"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium text-center"
                        >
                          WhatsApp
                        </a>
                        <button 
                          onClick={handleCopyLink}
                          className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
                        >
                          {copied ? 'Copiado!' : 'Copiar link'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Card do autor */}
                    <div className="bg-[#111111] rounded-xl p-5 shadow-sm text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={AUTHOR_AVATAR} 
                          alt={AUTHOR_NAME}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#00B140]"
                        />
                        <div>
                          <p className="font-semibold">{AUTHOR_NAME}</p>
                          <p className="text-xs text-[#9BE8B1]">Autor</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">{AUTHOR_BIO}</p>
                      <div className="flex gap-2">
                        <a 
                          href="https://github.com/juliano340" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-white/10 rounded-full hover:bg-[#00B140] transition-colors"
                        >
                          GitHub
                        </a>
                        <a 
                          href="https://linkedin.com/in/juliano340" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-white/10 rounded-full hover:bg-[#00B140] transition-colors"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                    
                    {/* Tags do post */}
                    {post.properties?.Tags?.multi_select && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                          <span>🏷️</span> Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {post.properties.Tags.multi_select.map(tag => (
                            <Link key={tag.name} href={`/blog?tag=${tag.name}`} legacyBehavior>
                              <a className="text-xs px-3 py-1.5 rounded-full bg-[#00B140]/10 text-[#00B140] font-medium hover:bg-[#00B140]/20 transition-colors">
                                {tag.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Posts relacionados */}
                    {relatedPosts.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                          <span>📚</span> Leia também
                        </h3>
                        <ul className="space-y-3">
                          {relatedPosts.map((relatedPost, index) => (
                            <li key={index}>
                              <Link href={`/blog/${relatedPost.slug}`} legacyBehavior>
                                <a className="text-sm text-[#00B140] hover:underline line-clamp-2">
                                  {relatedPost.title}
                                </a>
                              </Link>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{relatedPost.readingTime || 1} min de leitura</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Últimas publicações */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <h3 className="text-base font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                        <span>🕐</span> Últimas publicações
                      </h3>
                      <ul className="space-y-3">
                        {recentPosts.map((recentPost, index) => (
                          <li key={index} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                            <Link href={`/blog/${recentPost.slug}`} legacyBehavior>
                              <a className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#00B140] transition-colors line-clamp-2">
                                {recentPost.title}
                              </a>
                            </Link>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{recentPost.readingTime || 1} min de leitura</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Newsletter */}
                    <div className="bg-gradient-to-br from-[#00B140] to-[#008f35] rounded-xl p-5 shadow-sm text-white">
                      <h3 className="text-base font-bold mb-2">📧 Newsletter</h3>
                      <p className="text-sm text-white/90 mb-4">Receba novidades sobre tecnologia e IA diretamente no seu email.</p>
                      <Link href="/contato" legacyBehavior>
                        <a className="inline-block w-full text-center px-4 py-2 bg-white text-[#00B140] rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                          Assinar
                        </a>
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
              
              {/* Link voltar ao final */}
              <div className="mt-8 text-center">
                <Link href="/blog" legacyBehavior>
                  <a className="inline-flex items-center text-[#00B140] hover:underline font-medium">
                    ← Voltar ao blog
                  </a>
                </Link>
              </div>
            </main>
        </>
    );
};

export default Post;
