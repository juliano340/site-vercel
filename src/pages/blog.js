import { getDatabase, getUserDetails } from '../lib/notion';
import Link from 'next/link';

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
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-12 text-center">POSTS</h1>
        <div className="space-y-8">
          {posts
            .filter((post) => post.properties.Published.checkbox)
            .map((post) => {
              const { id, properties, authorDetails } = post;
              const title = properties.Page?.title?.[0]?.text?.content || 'Untitled';
              const description = properties.Description?.rich_text?.[0]?.text?.content || 'No description';
              const author = authorDetails?.name || 'Unknown author';
              const slug = properties.Slug?.rich_text?.[0]?.text?.content || '';

              if (!slug) {
                console.error(`Post with ID ${id} is missing a slug`);
                return null; // Skip this post if the slug is missing
              }

              return (
                <div key={id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <Link href={`/blog/${slug}`} legacyBehavior>
                    <a className="text-2xl font-semibold text-blue-600 hover:underline block mb-2">{title}</a>
                  </Link>
                  <p className="text-gray-600 mb-2">{description}</p>
                  <p className="text-gray-400"><strong>Autor:</strong> {author}</p>
                  <Link href={`/blog/${slug}`} legacyBehavior>
                    <a className="mt-4 inline-block text-blue-600 hover:underline">Ler mais</a>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
