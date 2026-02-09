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
    const notionCover = post?.cover;
    if (notionCover?.type === 'external') return notionCover.external.url;
    if (notionCover?.type === 'file') return notionCover.file.url;

    const query = getTopicFromPost(post) || fallbackQuery;
    const seed = hashString(`${post?.id || ''}-${getPostTitle(post)}`) % 999;
    return `https://source.unsplash.com/1200x800/?${encodeURIComponent(query)}&sig=${seed}`;
};

const Blog = ({ posts, generatedAt }) => {
    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
    ];

    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.last_edited_time || b.created_time || 0) - new Date(a.last_edited_time || a.created_time || 0)
    );

    const heroPost = sortedPosts[0] || null;
    const sidePosts = sortedPosts.slice(1, 4);
    const footerPosts = sortedPosts.slice(4, 7);

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
                        <section className="grid grid-cols-1 lg:grid-cols-5 items-stretch gap-7 mb-8">
                            <article className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-[460px] shadow-lg">
                                <img
                                    src={getPostImage(heroPost, 'tecnologia e inovação nos negócios')}
                                    alt={getPostTitle(heroPost)}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
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

                            <aside className="lg:col-span-2 grid grid-cols-1 gap-6 auto-rows-fr">
                                {sidePosts.map((post) => {
                                    const slug = getPostSlug(post);
                                    if (!slug) return null;
                                    return (
                                        <article key={post.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                            <img
                                                src={getPostImage(post)}
                                                alt={getPostTitle(post)}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Link href={`/blog/${slug}`} legacyBehavior>
                                                <a className="block mt-3 text-lg font-bold text-[#00B140] leading-snug hover:opacity-85 transition-opacity line-clamp-2 min-h-[3.25rem]">
                                                    {getPostTitle(post)}
                                                </a>
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">{getPostDescription(post)}</p>
                                            <p className="text-xs text-gray-400 mt-3">
                                                {new Date(post.last_edited_time || post.created_time).toLocaleDateString('pt-BR')}
                                            </p>
                                        </article>
                                    );
                                })}
                            </aside>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6">
                            {footerPosts.map((post) => {
                                const slug = getPostSlug(post);
                                if (!slug) return null;
                                return (
                                    <article key={post.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                        <img
                                            src={getPostImage(post)}
                                            alt={getPostTitle(post)}
                                            className="w-full aspect-[4/3] object-cover rounded-lg"
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
