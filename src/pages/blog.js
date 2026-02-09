import { useState } from 'react';
import { getDatabase, getUserDetails } from '../lib/notion';
import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb';

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

    return {
        props: {
            posts: JSON.parse(JSON.stringify(postsWithAuthors)),
            generatedAt: new Date().toISOString(),
        },
        revalidate: 10,
    };
}

const getPostTitle = (post) => post.properties?.Page?.title?.[0]?.text?.content || 'Untitled';

const getPostDescription = (post) => {
    const descriptionProperty = post.properties?.Description;
    if (!descriptionProperty) return 'Sem descrição disponível.';

    if (descriptionProperty.type === 'multi_select' && descriptionProperty.multi_select?.length > 0) {
        return descriptionProperty.multi_select.map((select) => select.name).join(', ');
    }

    if (descriptionProperty.type === 'rich_text' && descriptionProperty.rich_text?.length > 0) {
        return descriptionProperty.rich_text.map((text) => text.text.content).join(' ');
    }

    return 'Sem descrição disponível.';
};

const getPostSlug = (post) => post.properties?.Slug?.rich_text?.[0]?.text?.content || '';

const getPostDate = (post) => new Date(post.last_edited_time || post.created_time || 0);

const getPostTags = (post) => {
    const tagsProperty = post.properties?.Tags;
    if (tagsProperty?.type === 'multi_select' && tagsProperty.multi_select?.length) {
        return tagsProperty.multi_select.map((tag) => tag.name);
    }
    return [];
};

const hashString = (value = '') => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
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
    // Usa Lorem Picsum para imagens aleatórias baseadas no post
    const query = getTopicFromPost(post) || fallbackQuery;
    const seed = hashString(`${post?.id || ''}-${getPostTitle(post)}-${query}`);
    // Lorem Picsum: imagens randomicas gratuitas com seed para consistência
    return `https://picsum.photos/seed/${seed}/800/600`;
};

const SmartImage = ({ src, alt, className }) => {
    const [error, setError] = useState(false);
    
    // Garante que temos uma URL válida
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B140]/20 to-[#00B140]/40 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{alt || 'Imagem'}</span>
                </div>
            )}
        </div>
    );
};

const Blog = ({ posts, generatedAt }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedTag, setSelectedTag] = useState('all');
    const [visibleCount, setVisibleCount] = useState(9);

    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
    ];

    const sortedPosts = [...posts].sort((a, b) => getPostDate(b) - getPostDate(a));

    const heroPost = sortedPosts[0] || null;
    const widgetPosts = sortedPosts.slice(1, 6);
    const footerPosts = sortedPosts.slice(4, 7);

    const allTags = Array.from(new Set(sortedPosts.flatMap((post) => getPostTags(post)))).sort((a, b) => a.localeCompare(b));

    const filteredPosts = sortedPosts
        .filter((post) => {
            if (selectedTag === 'all') return true;
            return getPostTags(post).includes(selectedTag);
        })
        .filter((post) => {
            if (!searchTerm.trim()) return true;
            const searchable = `${getPostTitle(post)} ${getPostDescription(post)} ${getPostTags(post).join(' ')}`.toLowerCase();
            return searchable.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (sortBy === 'oldest') return getPostDate(a) - getPostDate(b);
            if (sortBy === 'title-asc') return getPostTitle(a).localeCompare(getPostTitle(b));
            if (sortBy === 'title-desc') return getPostTitle(b).localeCompare(getPostTitle(a));
            return getPostDate(b) - getPostDate(a);
        });

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-[#F6F7F8]">
            <div className="container mx-auto px-4 py-8 lg:py-10">
                <Breadcrumb paths={breadcrumbPaths} />

                <header className="mt-6 mb-8">
                    <p className="text-sm font-medium tracking-[0.2em] text-[#00B140] uppercase">Blog Editorial</p>
                    <h1 className="mt-2 text-3xl md:text-5xl font-black text-[#111111] leading-tight">
                        Tecnologia, Empreendedorismo e IA Aplicada
                    </h1>
                    <p className="mt-3 text-gray-600 max-w-2xl">
                        Insights práticos, tendências e análises para quem constrói negócios na nova economia digital.
                    </p>
                </header>

                {!heroPost ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-700">Nenhuma publicação disponível</h2>
                        <p className="text-gray-500 mt-2">Publique novos conteúdos para montar sua capa automaticamente.</p>
                    </div>
                ) : (
                    <>
                        <section className="grid grid-cols-1 lg:grid-cols-5 items-start gap-7 mb-8">
                            <article className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-[460px] shadow-lg">
                                <div className="absolute inset-0">
                                    <SmartImage
                                        src={getPostImage(heroPost, 'tecnologia e inovação nos negócios')}
                                        alt={getPostTitle(heroPost)}
                                        className="absolute inset-0 h-full w-full"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

                                <div className="relative z-10 h-full p-7 md:p-10 flex flex-col justify-end">
                                    <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#9BE8B1] mb-3">Matéria principal</p>
                                    <Link href={`/blog/${getPostSlug(heroPost)}`} legacyBehavior>
                                        <a className="text-3xl md:text-5xl font-extrabold text-white leading-tight hover:opacity-90 transition-opacity">
                                            {getPostTitle(heroPost)}
                                        </a>
                                    </Link>
                                    <ul className="mt-5 space-y-2 text-[#9BE8B1] text-sm md:text-base font-medium list-disc list-inside">
                                        <li>{getPostDescription(heroPost).slice(0, 90)}...</li>
                                        <li>Atualizado em {new Date(heroPost.last_edited_time || heroPost.created_time).toLocaleDateString('pt-BR')}</li>
                                    </ul>
                                </div>
                            </article>

                            <aside className="lg:col-span-2 grid grid-cols-1 gap-6">
                                <section className="bg-white rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-bold text-[#111111] mb-4">Últimas publicações</h3>
                                    <ul className="space-y-3">
                                        {widgetPosts.map((post) => {
                                            const slug = getPostSlug(post);
                                            if (!slug) return null;
                                            return (
                                                <li key={post.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                                    <Link href={`/blog/${slug}`} legacyBehavior>
                                                        <a className="text-sm font-semibold text-[#00B140] leading-snug hover:opacity-80 line-clamp-2">
                                                            {getPostTitle(post)}
                                                        </a>
                                                    </Link>
                                                    <p className="text-xs text-gray-400 mt-1">{getPostDate(post).toLocaleDateString('pt-BR')}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>

                                <section className="bg-white rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-bold text-[#111111] mb-4">Temas do blog</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.slice(0, 12).map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setSelectedTag(tag);
                                                    setVisibleCount(9);
                                                }}
                                                className="text-xs px-3 py-1.5 rounded-full bg-[#00B140]/10 text-[#00B140] font-medium hover:bg-[#00B140]/20 transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-[#111111] rounded-xl p-5 shadow-sm text-white">
                                    <p className="text-xs uppercase tracking-wider text-[#9BE8B1] mb-2">Navegação rápida</p>
                                    <p className="text-sm text-gray-200">Use os filtros abaixo para ver as postagens mais novas, mais antigas ou por tema específico.</p>
                                </section>
                            </aside>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6">
                            {footerPosts.map((post) => {
                                const slug = getPostSlug(post);
                                if (!slug) return null;
                                return (
                                    <article key={post.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                        <SmartImage
                                            src={getPostImage(post)}
                                            alt={getPostTitle(post)}
                                            className="w-full h-48 rounded-lg"
                                        />
                                        <Link href={`/blog/${slug}`} legacyBehavior>
                                            <a className="block mt-3 text-lg font-bold text-[#00B140] leading-snug hover:opacity-85 transition-opacity line-clamp-2 min-h-[3.25rem]">
                                                {getPostTitle(post)}
                                            </a>
                                        </Link>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">{getPostDescription(post)}</p>
                                        <p className="text-xs text-gray-400 mt-3">
                                            {new Date(post.last_edited_time || post.created_time).toLocaleDateString('pt-BR')}
                                        </p>
                                    </article>
                                );
                            })}
                        </section>

                        <section className="mt-10 bg-white rounded-2xl shadow-sm p-5 md:p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#111111]">Todas as postagens</h2>
                                    <p className="text-gray-600 text-sm mt-1">Navegue por data, tema e relevância para encontrar conteúdo com mais rapidez.</p>
                                </div>
                                <p className="text-sm text-gray-500">{filteredPosts.length} resultados</p>
                            </div>

                            <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-3">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setVisibleCount(9);
                                    }}
                                    placeholder="Buscar por título, resumo ou tag"
                                    className="lg:col-span-2 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#00B140]/20 focus:border-[#00B140]"
                                />

                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setVisibleCount(9);
                                    }}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#00B140]/20 focus:border-[#00B140] bg-white"
                                >
                                    <option value="newest">Mais novas</option>
                                    <option value="oldest">Mais antigas</option>
                                    <option value="title-asc">Título A-Z</option>
                                    <option value="title-desc">Título Z-A</option>
                                </select>

                                <select
                                    value={selectedTag}
                                    onChange={(e) => {
                                        setSelectedTag(e.target.value);
                                        setVisibleCount(9);
                                    }}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#00B140]/20 focus:border-[#00B140] bg-white"
                                >
                                    <option value="all">Todos os temas</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {visiblePosts.map((post) => {
                                    const slug = getPostSlug(post);
                                    if (!slug) return null;
                                    const tags = getPostTags(post);

                                    return (
                                        <article key={post.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                                            <SmartImage
                                                src={getPostImage(post)}
                                                alt={getPostTitle(post)}
                                                className="w-full h-48 rounded-lg"
                                            />
                                            <div className="mt-3 flex flex-wrap gap-2 min-h-[1.75rem]">
                                                {tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#00B140]/10 text-[#00B140] font-medium">{tag}</span>
                                                ))}
                                            </div>
                                            <Link href={`/blog/${slug}`} legacyBehavior>
                                                <a className="mt-2 text-lg font-bold text-[#00B140] leading-snug hover:opacity-85 line-clamp-2 min-h-[3.25rem]">
                                                    {getPostTitle(post)}
                                                </a>
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">{getPostDescription(post)}</p>
                                            <p className="text-xs text-gray-400 mt-3">{getPostDate(post).toLocaleDateString('pt-BR')}</p>
                                        </article>
                                    );
                                })}
                            </div>

                            {visiblePosts.length === 0 && (
                                <p className="mt-6 text-center text-gray-500">Nenhuma postagem encontrada com esses filtros.</p>
                            )}

                            {visibleCount < filteredPosts.length && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 9)}
                                        className="px-5 py-2.5 rounded-lg bg-[#111111] text-white font-medium hover:bg-black transition-colors"
                                    >
                                        Carregar mais postagens
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}

                <p className="text-xs text-gray-400 mt-8 text-center">
                    Atualizado em: {new Date(generatedAt).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>
    );
};

export default Blog;
