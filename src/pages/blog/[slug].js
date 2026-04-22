import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { getPublishedPosts, getPage, getBlocks } from '../../lib/notion';
import { calculateReadingTimeFromBlocks } from '@/lib/readingTime';

const AUTHOR_NAME   = 'Juliano Pereira';
const AUTHOR_AVATAR = 'https://avatars.githubusercontent.com/u/87342139?v=4';
const AUTHOR_BIO    = 'Desenvolvedor Full Stack apaixonado por tecnologia, empreendedorismo e IA aplicada a negócios.';

// ── Table of contents ──────────────────────────────────────
const extractTableOfContents = (blocks) =>
    blocks
        .filter(b => b.type === 'heading_2' || b.type === 'heading_3')
        .map((block, index) => ({
            text:  block[block.type]?.rich_text?.map(t => t.text?.content).join('') || '',
            level: block.type === 'heading_2' ? 2 : 3,
            id:    `heading-${index}`,
        }));

// ── getStaticPaths ─────────────────────────────────────────
export async function getStaticPaths() {
    const publishedPosts = await getPublishedPosts();
    const paths = publishedPosts.map(post => {
        const slug = post.properties.Slug?.rich_text?.[0]?.text?.content;
        if (!slug) { console.error(`Post ${post.id} missing slug`); return null; }
        return { params: { slug } };
    }).filter(Boolean);
    return { paths, fallback: 'blocking' };
}

// ── getStaticProps ─────────────────────────────────────────
export async function getStaticProps({ params }) {
    const { slug } = params;
    const publishedPosts = await getPublishedPosts();
    const post = publishedPosts.find(p => p.properties.Slug?.rich_text?.[0]?.text?.content === slug);

    if (!post) return { redirect: { destination: '/blog', permanent: true } };

    const page   = await getPage(post.id);
    const blocks = await getBlocks(post.id);

    const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;

    const currentTags = post.properties.Tags?.multi_select?.map(t => t.name) || [];
    const rawRelatedPosts = publishedPosts
        .filter(p => {
            if (p.id === post.id) return false;
            const pTags = p.properties.Tags?.multi_select?.map(t => t.name) || [];
            return pTags.some(tag => currentTags.includes(tag));
        })
        .slice(0, 3);

    const rawRecentPosts = publishedPosts.filter(p => p.id !== post.id).slice(0, 5);

    const readingTimeByPostId = new Map();
    readingTimeByPostId.set(post.id, calculateReadingTimeFromBlocks(blocks));

    const readingTimeCandidates = Array.from(
        new Map([...rawRelatedPosts, ...rawRecentPosts].map(c => [c.id, c])).values()
    );

    const readingTimeResults = await Promise.allSettled(
        readingTimeCandidates.map(async (c) => [c.id, calculateReadingTimeFromBlocks(await getBlocks(c.id))])
    );

    readingTimeResults.forEach((result, i) => {
        const id = readingTimeCandidates[i]?.id;
        if (!id) return;
        readingTimeByPostId.set(id, result.status === 'fulfilled' && Array.isArray(result.value) ? (result.value[1] || 1) : 1);
    });

    const mapPost = p => ({
        title:       p.properties.Page?.title?.[0]?.text?.content || 'Post',
        slug:        p.properties.Slug?.rich_text?.[0]?.text?.content,
        readingTime: readingTimeByPostId.get(p.id) || 1,
    });

    return {
        props: {
            post: page,
            blocks,
            prevPost: prevPost ? {
                title: prevPost.properties.Page?.title?.[0]?.text?.content || 'Post anterior',
                slug:  prevPost.properties.Slug?.rich_text?.[0]?.text?.content,
            } : null,
            nextPost: nextPost ? {
                title: nextPost.properties.Page?.title?.[0]?.text?.content || 'Próximo post',
                slug:  nextPost.properties.Slug?.rich_text?.[0]?.text?.content,
            } : null,
            relatedPosts: rawRelatedPosts.map(mapPost),
            recentPosts:  rawRecentPosts.map(mapPost),
        },
        revalidate: 10,
    };
}

// ── Text repair ────────────────────────────────────────────
const countWeirdChars = (v = '') => (v.match(/[ǭǜǦ]/g) || []).length;

const repairText = (value = '') => {
    if (!value || typeof value !== 'string') return value;
    const candidates = [value];
    try { candidates.push(Buffer.from(value, 'latin1').toString('utf8')); } catch (_) {}
    try { candidates.push(decodeURIComponent(escape(value))); } catch (_) {}
    let best = value, bestScore = Infinity;
    for (const c of candidates) {
        const score = countWeirdChars(c) * 3 + (c.match(/\uFFFD/g) || []).length * 5;
        if (score < bestScore) { best = c; bestScore = score; }
    }
    return best;
};

// ── Rich text renderer ─────────────────────────────────────
const renderRichText = (richTextArray) =>
    richTextArray.map((text, i) => {
        const content = repairText(text?.text?.content || '');
        const style = {
            fontWeight:    text.annotations.bold          ? 'bold'        : 'normal',
            fontStyle:     text.annotations.italic        ? 'italic'      : 'normal',
            textDecoration:`${text.annotations.underline ? 'underline' : ''} ${text.annotations.strikethrough ? 'line-through' : ''}`.trim() || 'none',
            color:         text.annotations.color !== 'default' ? text.annotations.color : 'inherit',
        };
        if (text.href) {
            return <a key={i} href={text.href} style={{ ...style, color: 'var(--color-accent)' }}>{content}</a>;
        }
        return <span key={i} style={style}>{content}</span>;
    });

// ── Block renderer ─────────────────────────────────────────
const renderBlock = (block, addId = false) => {
    const { type, id } = block;

    switch (type) {
        case 'paragraph':
            return (
                <p key={id} className="text-lg leading-relaxed my-5" style={{ color: 'var(--color-muted)' }}>
                    {renderRichText(block.paragraph.rich_text)}
                </p>
            );

        case 'image': {
            const url     = block.image?.file?.url || block.image?.external?.url;
            if (!url) return null;
            const caption = block.image.caption?.[0]?.plain_text || '';
            return (
                <div key={id} className="my-8 rounded-xl overflow-hidden shadow-lg">
                    <img src={url} alt={caption || 'Image'} className="w-full h-auto" />
                    {caption && (
                        <p
                            className="text-center text-sm py-3 px-4"
                            style={{ color: 'var(--color-muted)', background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)' }}
                        >
                            {caption}
                        </p>
                    )}
                </div>
            );
        }

        case 'heading_1':
            return (
                <h1 key={id} className="text-3xl md:text-4xl font-bold my-8" style={{ color: 'var(--color-text)' }}>
                    {renderRichText(block.heading_1.rich_text)}
                </h1>
            );

        case 'heading_2':
            return (
                <h2
                    key={id}
                    id={addId ? `heading-${block.index}` : undefined}
                    className="text-2xl font-semibold mt-10 mb-4 pl-4 scroll-mt-24"
                    style={{ color: 'var(--color-text)', borderLeft: '4px solid var(--color-accent)' }}
                >
                    {renderRichText(block.heading_2.rich_text)}
                </h2>
            );

        case 'heading_3':
            return (
                <h3
                    key={id}
                    id={addId ? `heading-${block.index}` : undefined}
                    className="text-xl font-semibold mt-8 mb-3 scroll-mt-24"
                    style={{ color: 'var(--color-accent)' }}
                >
                    {renderRichText(block.heading_3.rich_text)}
                </h3>
            );

        case 'bulleted_list_item':
            return (
                <li key={id} className="ml-4 list-disc text-lg my-1" style={{ color: 'var(--color-muted)' }}>
                    {renderRichText(block.bulleted_list_item.rich_text)}
                </li>
            );

        case 'numbered_list_item':
            return (
                <li key={id} className="ml-4 list-decimal text-lg my-1" style={{ color: 'var(--color-muted)' }}>
                    {renderRichText(block.numbered_list_item.rich_text)}
                </li>
            );

        case 'embed': {
            const embedUrl = block.embed.url;
            if (/\.(jpg|jpeg|png|gif)$/i.test(embedUrl)) {
                return (
                    <div key={id} className="text-center my-8">
                        <img src={embedUrl} alt="Embedded" className="max-w-full h-auto mx-auto rounded-lg" />
                    </div>
                );
            }
            return (
                <div key={id} className="text-center my-8">
                    <iframe src={embedUrl} title="Embed" className="w-full" style={{ height: 'auto' }} />
                </div>
            );
        }

        case 'video': {
            let videoUrl = block.video.external.url;
            if (!videoUrl) return null;
            if (videoUrl.includes('youtube.com')) {
                videoUrl = `https://www.youtube.com/embed/${videoUrl.split('v=')[1]}`;
            }
            return (
                <div key={id} className="text-center my-8">
                    <iframe src={videoUrl} title="Video" className="w-full h-64 sm:h-80 md:h-96 rounded-lg" allowFullScreen />
                </div>
            );
        }

        case 'code':
            return (
                <pre key={id} className="rounded-lg p-5 my-6 overflow-x-auto shadow-lg" style={{ background: '#1e1e1e' }}>
                    <code className="text-sm font-mono" style={{ color: '#e5e7eb' }}>
                        {Array.isArray(block.code.rich_text)
                            ? block.code.rich_text.map((t, i) => <span key={i}>{t.text.content}</span>)
                            : block.code.rich_text?.[0]?.text.content || ''}
                    </code>
                </pre>
            );

        case 'to_do':
            return (
                <div key={id} className="my-3 flex items-center gap-2">
                    <input type="checkbox" checked={block.to_do.checked} readOnly className="rounded" />
                    <span style={{ color: 'var(--color-text)' }}>{renderRichText(block.to_do.rich_text)}</span>
                </div>
            );

        case 'child_database':
            return <div key={id} className="my-4"><strong style={{ color: 'var(--color-text)' }}>{block.child_database.title}</strong></div>;

        case 'quote':
            return (
                <blockquote
                    key={id}
                    className="pl-6 py-4 my-8 italic text-lg"
                    style={{
                        borderLeft: '4px solid var(--color-accent)',
                        background: 'rgba(var(--accent-rgb), 0.05)',
                        color: 'var(--color-muted)',
                        borderRadius: '0 4px 4px 0',
                    }}
                >
                    {renderRichText(block.quote.rich_text)}
                </blockquote>
            );

        case 'divider':
            return <hr key={id} className="my-8 border-t-2" style={{ borderColor: 'var(--color-border)' }} />;

        default:
            return <p key={id} style={{ color: 'var(--color-muted-dim)' }}>[Unsupported block: {type}]</p>;
    }
};

// ── SidebarCard ────────────────────────────────────────────
const SidebarCard = ({ children, className = '' }) => (
    <div
        className={`rounded-xl p-5 ${className}`}
        style={{
            background:   'var(--color-surface)',
            border:       '1px solid var(--color-border)',
        }}
    >
        {children}
    </div>
);

const SidebarTitle = ({ children }) => (
    <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--color-muted-dim)' }}>
        {children}
    </h3>
);

// ── Post page ──────────────────────────────────────────────
const Post = ({ post, blocks, prevPost, nextPost, relatedPosts, recentPosts }) => {
    const slug           = post?.properties?.Slug?.rich_text?.[0]?.text?.content || '';
    const rawTitle       = post?.properties?.Page?.title?.[0]?.text?.content || 'Post';
    const pageTitle      = repairText(rawTitle);

    const descRaw        = post?.properties?.Description?.rich_text?.map(t => t?.text?.content || '').join(' ') || '';
    const firstParagraph = blocks?.find(b => b.type === 'paragraph')?.paragraph?.rich_text?.map(t => t?.text?.content || '').join(' ') || '';
    const metaDescription = repairText(descRaw || firstParagraph).slice(0, 160) || 'Artigo sobre tecnologia, empreendedorismo e IA.';

    const canonical      = `https://www.juliano340.com/blog/${slug}`;
    const readingTime    = calculateReadingTimeFromBlocks(blocks);
    const shareUrl       = typeof window !== 'undefined' ? window.location.href : `https://www.juliano340.com/blog/${slug}`;
    const shareTitle     = encodeURIComponent(pageTitle);
    const tableOfContents = extractTableOfContents(blocks);

    const [activeSection, setActiveSection] = useState('');
    const [copied, setCopied]               = useState(false);
    const [prismLoaded, setPrismLoaded]     = useState(false);

    // Prism.js
    useEffect(() => {
        const link     = document.createElement('link');
        link.href      = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
        link.rel       = 'stylesheet';
        document.head.appendChild(link);

        const script   = document.createElement('script');
        script.src     = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
        script.async   = true;
        script.onload  = () => setPrismLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (prismLoaded && window.Prism) window.Prism.highlightAll();
    }, [blocks, prismLoaded]);

    // Active TOC section
    useEffect(() => {
        const onScroll = () => {
            const headings = document.querySelectorAll('h2[id], h3[id]');
            let current = '';
            headings.forEach(h => { if (h.getBoundingClientRect().top <= 100) current = h.id; });
            setActiveSection(current);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const blocksWithIndex = blocks.map((block, index) => ({ ...block, index }));

    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: pageTitle, href: '#' },
    ];

    return (
        <>
            <Head>
                <title>{`${pageTitle} | @JULIANO340`}</title>
                <meta name="description"        content={metaDescription} />
                <link rel="canonical"           href={canonical} />
                <meta property="og:type"        content="article" />
                <meta property="og:title"       content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url"         content={canonical} />
                <meta name="twitter:card"       content="summary_large_image" />
                <meta name="twitter:title"      content={pageTitle} />
                <meta name="twitter:description" content={metaDescription} />
            </Head>

            <main
                className="min-h-screen transition-colors duration-300"
                style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}
            >
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Back link */}
                    <div className="mb-5">
                        <Link href="/blog" legacyBehavior>
                            <a
                                className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                                style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                            >
                                ← Voltar ao blog
                            </a>
                        </Link>
                    </div>

                    <Breadcrumb paths={breadcrumbPaths} />

                    {/* 2-col layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

                        {/* ── Coluna principal ── */}
                        <div className="lg:col-span-8">
                            <article
                                className="rounded-2xl overflow-hidden shadow-lg"
                                style={{
                                    background: 'var(--color-surface)',
                                    border:     '1px solid var(--color-border)',
                                }}
                            >
                                {/* Cover image */}
                                <div className="relative h-52 sm:h-64 md:h-80 w-full overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/seed/${post.id}/1200/600`}
                                        alt={pageTitle}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-5 sm:p-8 md:p-10">
                                    <h1
                                        className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-6 leading-tight"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {pageTitle}
                                    </h1>

                                    {/* Author + meta */}
                                    <div
                                        className="flex flex-wrap items-center gap-4 mb-6 pb-6"
                                        style={{ borderBottom: '1px solid var(--color-border)' }}
                                    >
                                        <img
                                            src={AUTHOR_AVATAR}
                                            alt={AUTHOR_NAME}
                                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                                            style={{ border: '2px solid var(--color-accent)' }}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                                                {AUTHOR_NAME}
                                            </p>
                                            <Link href="/contato" legacyBehavior>
                                                <a className="text-xs font-medium" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                    Enviar email
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                                            <span>📅 {new Date(post.last_edited_time || post.created_time).toLocaleDateString('pt-BR')}</span>
                                            <span>⏱️ {readingTime} min de leitura</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {post.properties?.Tags?.multi_select?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {post.properties.Tags.multi_select.map(tag => (
                                                <span
                                                    key={tag.name}
                                                    className="text-xs px-3 py-1 rounded-full font-semibold"
                                                    style={{
                                                        background: 'var(--chip-bg)',
                                                        border:     '1px solid var(--chip-border)',
                                                        color:      'var(--chip-text)',
                                                    }}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Body */}
                                    <div className="prose-content max-w-none">
                                        {blocksWithIndex.map(block => renderBlock(block, true))}
                                    </div>

                                    {/* Share bar */}
                                    <div
                                        className="flex flex-wrap items-center gap-3 mt-10 pt-6"
                                        style={{ borderTop: '1px solid var(--color-border)' }}
                                    >
                                        <span className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>
                                            Compartilhar:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-85"
                                                style={{ background: '#1DA1F2' }}>
                                                Twitter
                                            </a>
                                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-85"
                                                style={{ background: '#0A66C2' }}>
                                                LinkedIn
                                            </a>
                                            <a href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-85"
                                                style={{ background: '#25D366' }}>
                                                WhatsApp
                                            </a>
                                            <button
                                                onClick={handleCopyLink}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                                                style={{
                                                    background: 'var(--color-surface-raised)',
                                                    border:     '1px solid var(--color-border)',
                                                    color:      'var(--color-text)',
                                                }}
                                            >
                                                {copied ? '✓ Copiado!' : 'Copiar link'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Prev / Next navigation */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                        {prevPost && (
                                            <Link href={`/blog/${prevPost.slug}`} legacyBehavior>
                                                <a
                                                    className="p-4 rounded-xl transition-all duration-200"
                                                    style={{ border: '1px solid var(--color-border)', textDecoration: 'none' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted-dim)' }}>← Post anterior</span>
                                                    <p className="font-semibold mt-1 line-clamp-2 text-sm" style={{ color: 'var(--color-text)' }}>{prevPost.title}</p>
                                                </a>
                                            </Link>
                                        )}
                                        {nextPost && (
                                            <Link href={`/blog/${nextPost.slug}`} legacyBehavior>
                                                <a
                                                    className={`p-4 rounded-xl transition-all duration-200 ${!prevPost ? 'sm:col-start-2' : ''}`}
                                                    style={{ border: '1px solid var(--color-border)', textDecoration: 'none' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted-dim)' }}>Próximo post →</span>
                                                    <p className="font-semibold mt-1 line-clamp-2 text-sm" style={{ color: 'var(--color-text)' }}>{nextPost.title}</p>
                                                </a>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-4">
                            <div className="lg:sticky lg:top-8 space-y-5">

                                {/* Table of Contents */}
                                {tableOfContents.length > 0 && (
                                    <SidebarCard>
                                        <SidebarTitle>📑 Neste artigo</SidebarTitle>
                                        <nav className="space-y-1.5">
                                            {tableOfContents.map((item, i) => (
                                                <a
                                                    key={i}
                                                    href={`#${item.id}`}
                                                    onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                                                    className={`block text-sm transition-colors ${item.level === 3 ? 'pl-4' : ''}`}
                                                    style={{
                                                        color:      activeSection === item.id ? 'var(--color-accent)' : 'var(--color-muted)',
                                                        fontWeight: activeSection === item.id ? 700 : item.level === 2 ? 500 : 400,
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {item.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </SidebarCard>
                                )}

                                {/* Share */}
                                <SidebarCard>
                                    <SidebarTitle>🔗 Compartilhar</SidebarTitle>
                                    <div className="grid grid-cols-2 gap-2">
                                        <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 rounded-lg text-xs font-semibold text-white text-center transition-opacity hover:opacity-85"
                                            style={{ background: '#1DA1F2' }}>Twitter</a>
                                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 rounded-lg text-xs font-semibold text-white text-center transition-opacity hover:opacity-85"
                                            style={{ background: '#0A66C2' }}>LinkedIn</a>
                                        <a href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 rounded-lg text-xs font-semibold text-white text-center transition-opacity hover:opacity-85"
                                            style={{ background: '#25D366' }}>WhatsApp</a>
                                        <button
                                            onClick={handleCopyLink}
                                            className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                                            style={{
                                                background: 'var(--color-surface-raised)',
                                                border:     '1px solid var(--color-border)',
                                                color:      'var(--color-text)',
                                            }}
                                        >
                                            {copied ? '✓ Copiado!' : 'Copiar link'}
                                        </button>
                                    </div>
                                </SidebarCard>

                                {/* Author card — inverted (always dark for visual identity) */}
                                <div
                                    className="rounded-xl p-5"
                                    style={{
                                        background: 'var(--color-surface)',
                                        border:     '1px solid var(--color-accent)',
                                        color:      'var(--color-text)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={AUTHOR_AVATAR}
                                            alt={AUTHOR_NAME}
                                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            style={{ border: '2px solid var(--color-accent)' }}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{AUTHOR_NAME}</p>
                                            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Autor</p>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>{AUTHOR_BIO}</p>
                                    <div className="flex gap-2">
                                        {[
                                            { label: 'GitHub',   href: 'https://github.com/juliano340' },
                                            { label: 'LinkedIn', href: 'https://linkedin.com/in/juliano340' },
                                        ].map(({ label, href }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200"
                                                style={{
                                                    background: 'var(--color-accent)',
                                                    color:      'var(--btn-text)',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {label}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                {post.properties?.Tags?.multi_select?.length > 0 && (
                                    <SidebarCard>
                                        <SidebarTitle>🏷️ Tags</SidebarTitle>
                                        <div className="flex flex-wrap gap-2">
                                            {post.properties.Tags.multi_select.map(tag => (
                                                <Link key={tag.name} href={`/blog?tag=${tag.name}`} legacyBehavior>
                                                    <a
                                                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200"
                                                        style={{
                                                            background: 'var(--chip-bg)',
                                                            border:     '1px solid var(--chip-border)',
                                                            color:      'var(--chip-text)',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                    </SidebarCard>
                                )}

                                {/* Related posts */}
                                {relatedPosts.length > 0 && (
                                    <SidebarCard>
                                        <SidebarTitle>📚 Leia também</SidebarTitle>
                                        <ul className="space-y-3">
                                            {relatedPosts.map((p, i) => (
                                                <li key={i}>
                                                    <Link href={`/blog/${p.slug}`} legacyBehavior>
                                                        <a className="text-sm font-semibold leading-snug hover:opacity-75 line-clamp-2 transition-opacity"
                                                            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                            {p.title}
                                                        </a>
                                                    </Link>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-dim)' }}>
                                                        {p.readingTime || 1} min de leitura
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </SidebarCard>
                                )}

                                {/* Recent posts */}
                                <SidebarCard>
                                    <SidebarTitle>🕐 Últimas publicações</SidebarTitle>
                                    <ul className="space-y-0">
                                        {recentPosts.map((p, i) => (
                                            <li
                                                key={i}
                                                className="py-2.5"
                                                style={{ borderBottom: '1px solid var(--color-border)' }}
                                            >
                                                <Link href={`/blog/${p.slug}`} legacyBehavior>
                                                    <a
                                                        className="text-sm leading-snug hover:opacity-75 line-clamp-2 transition-opacity"
                                                        style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                                                    >
                                                        {p.title}
                                                    </a>
                                                </Link>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-dim)' }}>
                                                    {p.readingTime || 1} min de leitura
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </SidebarCard>

                                {/* Newsletter CTA */}
                                <div
                                    className="rounded-xl p-5"
                                    style={{
                                        background: 'var(--color-surface)',
                                        border:     '1px solid var(--color-accent)',
                                        color:      'var(--color-text)',
                                    }}
                                >
                                    <h3 className="text-sm font-bold mb-2">📧 Newsletter</h3>
                                    <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
                                        Receba novidades sobre tecnologia e IA diretamente no seu email.
                                    </p>
                                    <Link href="/contato" legacyBehavior>
                                        <a
                                            className="inline-flex w-full items-center justify-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                                            style={{
                                                background:     'var(--color-accent)',
                                                color:          'var(--btn-text)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Assinar
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Back link bottom */}
                    <div className="mt-8 text-center">
                        <Link href="/blog" legacyBehavior>
                            <a
                                className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                                style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                            >
                                ← Voltar ao blog
                            </a>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Post;
