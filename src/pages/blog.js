import { getDatabase, getUserDetails } from '../lib/notion';
import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb';
import { useState } from 'react';

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
        userMap.set(id, r.status === "fulfilled" ? r.value : { name: "Unknown author" });
    });

    const postsWithAuthors = publishedPosts.map((post) => {
        const userId = post.properties?.Person?.people?.[0]?.id;
        return {
            ...post,
            authorDetails: userId ? (userMap.get(userId) ?? { name: "Unknown author" }) : { name: "Unknown author" },
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

const Blog = ({ posts, generatedAt }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');

    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
    ];

    // Filtrar posts por busca
    const filteredPosts = posts
        .filter((post) => post.properties.Published.checkbox)
        .filter((post) => {
            if (!searchTerm) return true;

            const title = post.properties.Page?.title?.[0]?.text?.content || '';
            const author = post.authorDetails?.name || '';
            const descriptionProperty = post.properties.Description;
            let description = '';

            if (descriptionProperty) {
                if (descriptionProperty.type === 'multi_select' && descriptionProperty.multi_select.length > 0) {
                    description = descriptionProperty.multi_select.map(select => select.name).join(', ');
                } else if (descriptionProperty.type === 'rich_text' && descriptionProperty.rich_text.length > 0) {
                    description = descriptionProperty.rich_text.map(text => text.text.content).join(' ');
                }
            }

            const searchLower = searchTerm.toLowerCase();
            return (
                title.toLowerCase().includes(searchLower) ||
                author.toLowerCase().includes(searchLower) ||
                description.toLowerCase().includes(searchLower)
            );
        });

    // Ordenar posts
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const titleA = a.properties.Page?.title?.[0]?.text?.content || '';
        const titleB = b.properties.Page?.title?.[0]?.text?.content || '';
        const authorA = a.authorDetails?.name || '';
        const authorB = b.authorDetails?.name || '';

        switch (sortBy) {
            case 'title-asc':
                return titleA.localeCompare(titleB);
            case 'title-desc':
                return titleB.localeCompare(titleA);
            case 'author-asc':
                return authorA.localeCompare(authorB);
            case 'author-desc':
                return authorB.localeCompare(authorA);
            case 'newest':
            case 'oldest':
            default:
                return 0;
        }
    });

    const PostCard = ({ post }) => {
        const { id, properties, authorDetails } = post;
        const title = properties.Page?.title?.[0]?.text?.content || 'Untitled';
        const descriptionProperty = properties.Description;
        let description = 'No description';

        if (descriptionProperty) {
            if (descriptionProperty.type === 'multi_select' && descriptionProperty.multi_select.length > 0) {
                description = descriptionProperty.multi_select.map(select => select.name).join(', ');
            } else if (descriptionProperty.type === 'rich_text' && descriptionProperty.rich_text.length > 0) {
                description = descriptionProperty.rich_text.map(text => text.text.content).join(' ');
            }
        }

        const author = authorDetails?.name || 'Unknown author';
        const slug = properties.Slug?.rich_text?.[0]?.text?.content || '';

        if (!slug) {
            console.error(`Post with ID ${id} is missing a slug`);
            return null;
        }

        if (viewMode === 'list') {
            return (
                <div key={id} className="bg-white p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <Link href={`/blog/${slug}`} legacyBehavior>
                                <a className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                    {title}
                                </a>
                            </Link>
                            <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>
                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {author}
                                </span>
                            </div>
                        </div>
                        <Link href={`/blog/${slug}`} legacyBehavior>
                            <a className="flex-shrink-0 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                Ler mais →
                            </a>
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div key={id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col h-full">
                <div className="flex-1">
                    <Link href={`/blog/${slug}`} legacyBehavior>
                        <a className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
                            {title}
                        </a>
                    </Link>
                    <p className="mt-3 text-gray-600 line-clamp-3">{description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{author}</span>
                    </div>
                    <Link href={`/blog/${slug}`} legacyBehavior>
                        <a className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            Ler post
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumb paths={breadcrumbPaths} />

                <div className="mt-8 mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
                    <p className="text-gray-600">Explore nossos artigos e conteúdos</p>
                </div>

                {/* Barra de controles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Busca */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {/* Ordenação */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 md:flex-initial px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="newest">Mais recentes</option>
                                <option value="oldest">Mais antigos</option>
                                <option value="title-asc">Título (A-Z)</option>
                                <option value="title-desc">Título (Z-A)</option>
                                <option value="author-asc">Autor (A-Z)</option>
                                <option value="author-desc">Autor (Z-A)</option>
                            </select>

                            {/* Visualização */}
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    title="Visualização em grade"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    title="Visualização em lista"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contador de resultados */}
                    <div className="mt-3 text-sm text-gray-600">
                        {sortedPosts.length} {sortedPosts.length === 1 ? 'post encontrado' : 'posts encontrados'}
                    </div>
                </div>

                {/* Lista de posts */}
                {sortedPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum post encontrado</h3>
                        <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-200'
                    }>
                        {sortedPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                <p className="text-xs text-gray-400 mt-8 text-center">
                    Gerado em: {new Date(generatedAt).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>
    );
};

export default Blog;