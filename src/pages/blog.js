import { useState } from 'react';
import { getBlocks, getDatabase, getUserDetails } from '../lib/notion';
import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb';
import { calculateReadingTimeFromBlocks } from '@/lib/readingTime';

export async function getStaticProps() {
    const database = await getDatabase();

    const publishedPosts = database.filter(
        (post) => post.properties?.Published?.checkbox
    );

    const userIds = [
        ...new Set(
            publishedPosts
                .map((post) => post.properties?.Person?.people?.[0]?.id)
                .filter(Boolean)
        ),
    ];

    const results = await Promise.allSettled(
        userIds.map((id) => getUserDetails(id))
    );

    const userMap = new Map();
    userIds.forEach((id, i) => {
        const r = results[i];
        userMap.set(id, r.status === 'fulfilled' ? r.value : { name: 'Unknown author' });
    });

    const postsWithAuthors = publishedPosts.map((post) => {
        const userId = post.properties?.Person?.people?.[0]?.id;
        return {
            ...post,
            authorDetails: userId ? (userMap.get(userId) ?? { name: 'Unknown author' }) : { name: 'Unknown author' },
        };
    });

    const readingTimeResults = await Promise.allSettled(
        postsWithAuthors.map(async (post) => {
            if (!post?.id) return [post?.id, 1];
            const blocks = await getBlocks(post.id);
            return [post.id, calculateReadingTimeFromBlocks(blocks)];
        })
    );

    const readingTimeMap = new Map();
    readingTimeResults.forEach((result, index) => {
        const postId = postsWithAuthors[index]?.id;
        if (!postId) return;

        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            readingTimeMap.set(postId, result.value[1] || 1);
            return;
        }

        readingTimeMap.set(postId, 1);
    });

    const postsWithAuthorsAndReadingTime = postsWithAuthors.map((post) => ({
        ...post,
        readingTime: readingTimeMap.get(post.id) || 1,
    }));

    return {
        props: {
            posts: JSON.parse(JSON.stringify(postsWithAuthorsAndReadingTime)),
            generatedAt: new Date().toISOString(),
        },
        revalidate: 10,
    };
}

// ── helpers ────────────────────────────────────────────────
const getPostTitle = (post) => post.properties?.Page?.title?.[0]?.text?.content || 'Untitled';

const getPostDescription = (post) => {
    const d = post.properties?.Description;
    if (!d) return 'Sem descrição disponível.';
    if (d.type === 'multi_select' && d.multi_select?.length > 0)
        return d.multi_select.map((s) => s.name).join(', ');
    if (d.type === 'rich_text' && d.rich_text?.length > 0)
        return d.rich_text.map((t) => t.text.content).join(' ');
    return 'Sem descrição disponível.';
};

const getPostSlug = (post) => post.properties?.Slug?.rich_text?.[0]?.text?.content || '';
const getPostDate  = (post) => new Date(post.last_edited_time || post.created_time || 0);

const getPostTags = (post) => {
    const t = post.properties?.Tags;
    if (t?.type === 'multi_select' && t.multi_select?.length)
        return t.multi_select.map((tag) => tag.name);
    return [];
};

const hashString = (value = '') => {
    let h = 0;
    for (let i = 0; i < value.length; i++) { h = (h << 5) - h + value.charCodeAt(i); h |= 0; }
    return Math.abs(h);
};

const getTopicFromPost = (post) => {
    const text = `${getPostTitle(post)} ${getPostDescription(post)}`.toLowerCase();
    if (text.includes('finan') || text.includes('mercado') || text.includes('invest')) return 'fintech,business,analytics';
    if (text.includes('empreendedor') || text.includes('startup') || text.includes('growth')) return 'startup,entrepreneur,business';
    if (text.includes('produto') || text.includes('ux') || text.includes('design')) return 'product,design,technology';
    if (text.includes('dados') || text.includes('bi') || text.includes('métrica')) return 'data,analytics,dashboard';
    if (text.includes('ia') || text.includes('ai') || text.includes('inteligência')) return 'artificial-intelligence,technology,future';
    return 'technology,business,innovation';
};

const getPostImage = (post, fallbackQuery = 'technology,business,innovation') => {
    const query = getTopicFromPost(post) || fallbackQuery;
    const seed = hashString(`${post?.id || ''}-${getPostTitle(post)}-${query}`);
    return `https://picsum.photos/seed/${seed}/800/600`;
};

// ── SmartImage ─────────────────────────────────────────────
const SmartImage = ({ src, alt, className }) => {
    const [error, setError] = useState(false);
    const imageUrl = src || 'https://picsum.photos/seed/default/800/600';

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                src={imageUrl}
                alt={alt}
                onError={() => setError(true)}
                className="h-full w-full object-cover"
                loading="lazy"
            />
            {error && (
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(var(--accent-rgb), 0.12)' }}
                >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                        {alt || 'Imagem'}
                    </span>
                </div>
            )}
        </div>
    );
};

// ── Blog page ──────────────────────────────────────────────
const Blog = ({ posts, generatedAt }) => {
    const [searchTerm, setSearchTerm]   = useState('');
    const [sortBy, setSortBy]           = useState('newest');
    const [selectedTag, setSelectedTag] = useState('all');
    const [visibleCount, setVisibleCount] = useState(9);

    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
    ];

    const sortedPosts  = [...posts].sort((a, b) => getPostDate(b) - getPostDate(a));
    const heroPost     = sortedPosts[0] || null;
    const widgetPosts  = sortedPosts.slice(1, 6);
    const featuredPosts = sortedPosts.slice(1, 4);

    const allTags = Array.from(new Set(sortedPosts.flatMap(getPostTags))).sort((a, b) => a.localeCompare(b));

    const filteredPosts = sortedPosts
        .filter((post) => selectedTag === 'all' || getPostTags(post).includes(selectedTag))
        .filter((post) => {
            if (!searchTerm.trim()) return true;
            const s = `${getPostTitle(post)} ${getPostDescription(post)} ${getPostTags(post).join(' ')}`.toLowerCase();
            return s.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (sortBy === 'oldest')     return getPostDate(a) - getPostDate(b);
            if (sortBy === 'title-asc')  return getPostTitle(a).localeCompare(getPostTitle(b));
            if (sortBy === 'title-desc') return getPostTitle(b).localeCompare(getPostTitle(a));
            return getPostDate(b) - getPostDate(a);
        });

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    // Estilos compartilhados de inputs/selects
    const inputStyle = {
        background: 'var(--color-surface-alt)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '0.875rem',
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.2s',
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}
        >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <Breadcrumb paths={breadcrumbPaths} />

                {/* ── Cabeçalho ── */}
                <header className="mt-6 mb-8 sm:mb-10">
                    <p
                        style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--color-accent)',
                            marginBottom: '8px',
                        }}
                    >
                        Blog Editorial
                    </p>
                    <h1
                        style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            color: 'var(--color-text)',
                            lineHeight: 1.05,
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                        }}
                    >
                        Tecnologia, Empreendedorismo e IA Aplicada
                    </h1>
                    <p style={{ color: 'var(--color-muted)', maxWidth: '38rem', lineHeight: 1.7 }}>
                        Insights práticos, tendências e análises para quem constrói negócios na nova economia digital.
                    </p>
                </header>

                {/* ── Sem posts ── */}
                {!heroPost ? (
                    <div
                        className="text-center py-20 rounded-2xl"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Nenhuma publicação disponível
                        </h2>
                        <p className="mt-2" style={{ color: 'var(--color-muted)' }}>
                            Publique novos conteúdos para montar sua capa automaticamente.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ── Hero + Widget ── */}
                        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

                            {/* Hero post — fundo de imagem, sempre escuro */}
                            <article className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] shadow-lg">
                                <div className="absolute inset-0">
                                    <SmartImage
                                        src={getPostImage(heroPost, 'tecnologia e inovação nos negócios')}
                                        alt={getPostTitle(heroPost)}
                                        className="absolute inset-0 h-full w-full"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/18" />

                                <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                                    <div>
                                        <p
                                            className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                                            style={{ color: '#C8FF00' }}
                                        >
                                            Matéria principal
                                        </p>
                                        <Link href={`/blog/${getPostSlug(heroPost)}`} legacyBehavior>
                                            <a
                                                className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold leading-[1.1] hover:opacity-90 transition-opacity"
                                                style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                                            >
                                                {getPostTitle(heroPost)}
                                            </a>
                                        </Link>

                                        <p
                                            className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
                                            style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                                        >
                                            {getPostDescription(heroPost).slice(0, 260)}
                                            {getPostDescription(heroPost).length > 260 ? '…' : ''}
                                        </p>

                                        {getPostTags(heroPost).length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {getPostTags(heroPost).slice(0, 4).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs px-3 py-1 rounded-full font-semibold"
                                                        style={{
                                                            background: 'rgba(200,255,0,0.14)',
                                                            border: '1px solid rgba(200,255,0,0.3)',
                                                            color: '#C8FF00',
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                                        <div className="text-xs sm:text-sm font-medium" style={{ color: 'rgba(200,255,0,0.75)' }}>
                                            <span>📅 {new Date(heroPost.last_edited_time || heroPost.created_time).toLocaleDateString('pt-BR')}</span>
                                            <span className="mx-2">·</span>
                                            <span>⏱️ {heroPost.readingTime || 1} min</span>
                                        </div>
                                        <Link href={`/blog/${getPostSlug(heroPost)}`} legacyBehavior>
                                            <a
                                                className="inline-flex items-center justify-center px-5 py-2.5 font-extrabold text-xs uppercase tracking-[0.1em] rounded-full transition-all duration-200 hover:scale-105"
                                                style={{ background: '#C8FF00', color: '#000000' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#B8EE00'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#C8FF00'; }}
                                            >
                                                Ler artigo completo →
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                            {/* Widget lateral */}
                            <aside className="lg:col-span-2">
                                <div
                                    className="rounded-xl p-5 h-full"
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--color-muted-dim)' }}>
                                        Últimas publicações
                                    </h3>
                                    <ul className="space-y-0">
                                        {widgetPosts.map((post) => {
                                            const slug = getPostSlug(post);
                                            if (!slug) return null;
                                            return (
                                                <li
                                                    key={post.id}
                                                    className="py-3"
                                                    style={{ borderBottom: '1px solid var(--color-border)' }}
                                                >
                                                    <Link href={`/blog/${slug}`} legacyBehavior>
                                                        <a
                                                            className="text-sm font-semibold leading-snug hover:opacity-75 line-clamp-2 transition-opacity"
                                                            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                                        >
                                                            {getPostTitle(post)}
                                                        </a>
                                                    </Link>
                                                    <p className="text-xs mt-1" style={{ color: 'var(--color-muted-dim)' }}>
                                                        {getPostDate(post).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </aside>
                        </section>

                        {/* ── Posts em destaque (3 cols) ── */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                            {featuredPosts.map((post) => {
                                const slug = getPostSlug(post);
                                if (!slug) return null;
                                return (
                                    <article
                                        key={post.id}
                                        className="rounded-xl flex flex-col h-full overflow-hidden transition-all duration-200"
                                        style={{
                                            background: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <SmartImage
                                            src={getPostImage(post)}
                                            alt={getPostTitle(post)}
                                            className="w-full h-44"
                                        />
                                        <div className="p-4 flex flex-col flex-1">
                                            <Link href={`/blog/${slug}`} legacyBehavior>
                                                <a
                                                    className="text-base font-bold leading-snug hover:opacity-80 line-clamp-2 min-h-[2.75rem] transition-opacity"
                                                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                                >
                                                    {getPostTitle(post)}
                                                </a>
                                            </Link>
                                            <p
                                                className="text-sm mt-2 line-clamp-3 flex-1"
                                                style={{ color: 'var(--color-muted)' }}
                                            >
                                                {getPostDescription(post)}
                                            </p>
                                            <p className="text-xs mt-3" style={{ color: 'var(--color-muted-dim)' }}>
                                                {new Date(post.last_edited_time || post.created_time).toLocaleDateString('pt-BR')} · Por Juliano Pereira
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        {/* ── Todas as postagens ── */}
                        <section
                            id="todas-postagens"
                            className="rounded-2xl p-5 sm:p-6 md:p-8"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            {/* Cabeçalho */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
                                <div>
                                    <h2
                                        className="text-xl sm:text-2xl font-bold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Todas as postagens
                                    </h2>
                                    <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
                                        Navegue por data, tema e relevância.
                                    </p>
                                </div>
                                <p className="text-sm" style={{ color: 'var(--color-muted-dim)' }}>
                                    {filteredPosts.length} resultado{filteredPosts.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Filtros */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(9); }}
                                    placeholder="Buscar por título, resumo ou tag"
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
                                />

                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setVisibleCount(9); }}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
                                >
                                    <option value="newest">Mais novas</option>
                                    <option value="oldest">Mais antigas</option>
                                    <option value="title-asc">Título A-Z</option>
                                    <option value="title-desc">Título Z-A</option>
                                </select>

                                <select
                                    value={selectedTag}
                                    onChange={(e) => { setSelectedTag(e.target.value); setVisibleCount(9); }}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
                                >
                                    <option value="all">Todos os temas</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tag pills */}
                            {allTags.length > 0 && (
                                <div
                                    className="mt-4 pt-4"
                                    style={{ borderTop: '1px solid var(--color-border)' }}
                                >
                                    <p
                                        className="text-xs font-bold uppercase tracking-[0.15em] mb-3"
                                        style={{ color: 'var(--color-muted-dim)' }}
                                    >
                                        Temas:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => { setSelectedTag(tag === selectedTag ? 'all' : tag); setVisibleCount(9); }}
                                                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200"
                                                style={
                                                    selectedTag === tag
                                                        ? {
                                                            background: 'var(--color-accent)',
                                                            color: 'var(--btn-text)',
                                                            border: '1px solid transparent',
                                                        }
                                                        : {
                                                            background: 'var(--chip-bg)',
                                                            border: '1px solid var(--chip-border)',
                                                            color: 'var(--chip-text)',
                                                        }
                                                }
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Grade de posts */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {visiblePosts.map((post) => {
                                    const slug = getPostSlug(post);
                                    if (!slug) return null;
                                    const tags = getPostTags(post);

                                    return (
                                        <article
                                            key={post.id}
                                            className="rounded-xl flex flex-col h-full overflow-hidden transition-all duration-200"
                                            style={{
                                                background: 'var(--color-surface-alt)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        >
                                            <SmartImage
                                                src={getPostImage(post)}
                                                alt={getPostTitle(post)}
                                                className="w-full h-44"
                                            />
                                            <div className="p-4 flex flex-col flex-1">
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {tags.slice(0, 3).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                style={{
                                                                    background: 'var(--chip-bg)',
                                                                    border: '1px solid var(--chip-border)',
                                                                    color: 'var(--chip-text)',
                                                                }}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <Link href={`/blog/${slug}`} legacyBehavior>
                                                    <a
                                                        className="text-base font-bold leading-snug hover:opacity-80 line-clamp-2 min-h-[2.75rem] transition-opacity"
                                                        style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                                    >
                                                        {getPostTitle(post)}
                                                    </a>
                                                </Link>
                                                <p
                                                    className="text-sm mt-2 line-clamp-3 flex-1"
                                                    style={{ color: 'var(--color-muted)' }}
                                                >
                                                    {getPostDescription(post)}
                                                </p>
                                                <p className="text-xs mt-3" style={{ color: 'var(--color-muted-dim)' }}>
                                                    {getPostDate(post).toLocaleDateString('pt-BR')} · Por Juliano Pereira · {post.readingTime || 1} min
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {visiblePosts.length === 0 && (
                                <p className="mt-6 text-center" style={{ color: 'var(--color-muted)' }}>
                                    Nenhuma postagem encontrada com esses filtros.
                                </p>
                            )}

                            {visibleCount < filteredPosts.length && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 9)}
                                        className="mono-button-primary"
                                    >
                                        Carregar mais postagens
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}

                <p className="text-xs mt-8 text-center" style={{ color: 'var(--color-muted-dim)' }}>
                    Atualizado em: {new Date(generatedAt).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>
    );
};

export default Blog;
