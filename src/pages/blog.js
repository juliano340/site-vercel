import { getDatabase, getUserDetails } from '../lib/notion';
import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb'; // ajuste o caminho para o Breadcrumb

export async function getStaticProps() {
    const database = await getDatabase();

    // Fetch user details for each post
    for (const post of database) {
        const userId = post.properties.Person?.people?.[0]?.id;
        if (userId) {
            const userDetails = await getUserDetails(userId);
            post.authorDetails = userDetails;
        } else {
            post.authorDetails = { name: 'Unknown author' };
        }
    }

    return {
        props: {
            posts: database,
        },
        revalidate: 10,
    };
}

const Blog = ({ posts }) => {
    const breadcrumbPaths = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
    ];

    return (
        <div className="container mx-auto px-4 pt-24 mb-8 min-h-screen">
            <Breadcrumb paths={breadcrumbPaths} />
            <h1 className='text-3xl font-bold text-gray-800 my-5'>Posts</h1>
            <div className="space-y-8">
                {posts
                    .filter((post) => post.properties.Published.checkbox)
                    .map((post) => {
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
                            return null; // Skip this post if the slug is missing
                        }

                        return (
                            <div key={id} className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Link href={`/blog/${slug}`} legacyBehavior>
                                    <a className="text-2xl font-semibold text-slate-700 hover:underline">{title}</a>
                                </Link>
                                <p className="mt-2 text-gray-600">{description}</p>
                                <p className="mt-2 text-gray-500"><strong>Autor:</strong> {author}</p>
                                <Link href={`/blog/${slug}`} legacyBehavior>
                                    <a className="inline-block text-white bg-blue-400 hover:bg-blue-500 rounded px-4 py-2 mt-4">Ler tudo 🔍</a>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Blog;
