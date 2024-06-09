import { getDatabase, getPage, getBlocks } from '../../lib/notion';
import Breadcrumb from '../components/Breadcrumb';


export async function getStaticPaths() {
    const database = await getDatabase();
    const paths = database.map(post => {
        const slug = post.properties.Slug?.rich_text?.[0]?.text?.content;
        if (!slug) {
            console.error(`Post with ID ${post.id} is missing a slug`);
            return null; // Skip this post if the slug is missing
        }
        return { params: { slug } };
    }).filter(Boolean); // Filter out any null values

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const database = await getDatabase();

    const post = database.find(post => post.properties.Slug?.rich_text?.[0]?.text?.content === slug);

    if (!post) {
        return {
            notFound: true,
        };
    }

    const page = await getPage(post.id);
    const blocks = await getBlocks(post.id);

    return {
        props: {
            post: page,
            blocks,
        },
        revalidate: 10,
    };
}

const renderBlock = (block) => {
    const { type, id, paragraph, image, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item, embed, video } = block;

    switch (type) {
        case 'paragraph':
            return (
                <p key={id} className="my-4">
                    {paragraph?.rich_text?.map((text, index) => (
                        <span key={index} style={{
                            fontWeight: text.annotations.bold ? 'bold' : 'normal',
                            fontStyle: text.annotations.italic ? 'italic' : 'normal',
                            textDecoration: `${text.annotations.underline ? 'underline' : ''} ${text.annotations.strikethrough ? 'line-through' : ''}`,
                            color: text.annotations.color !== 'default' ? text.annotations.color : 'inherit',
                        }}>
                            {text.text.content}
                        </span>
                    ))}
                </p>
            );
        case 'image':
            const imageUrl = image?.file?.url || image?.external?.url;
            if (!imageUrl) {
                console.error(`Image block with ID ${id} is missing a URL`);
                return null;
            }
            const imageCaption = image.caption?.[0]?.plain_text || 'Image';
            return (
                <div key={id} className="text-center my-8">
                    <img 
                        src={imageUrl} 
                        alt={imageCaption} 
                        className="max-w-full h-auto mx-auto"
                    />
                    {imageCaption && <p className="text-gray-600">{imageCaption}</p>}
                </div>
            );
        case 'heading_1':
            return <h1 key={id} className="text-4xl font-bold my-4">{heading_1.rich_text[0].text.content}</h1>;
        case 'heading_2':
            return <h2 key={id} className="text-3xl font-semibold my-4">{heading_2.rich_text[0].text.content}</h2>;
        case 'heading_3':
            return <h3 key={id} className="text-2xl font-semibold my-4">{heading_3.rich_text[0].text.content}</h3>;
        case 'bulleted_list_item':
            return <li key={id} className="ml-4 list-disc">{bulleted_list_item.rich_text[0].text.content}</li>;
        case 'numbered_list_item':
            return <li key={id} className="ml-4 list-decimal">{numbered_list_item.rich_text[0].text.content}</li>;
        case 'embed':
        case 'video':
            let videoUrl = embed?.url || video?.external?.url;
            if (!videoUrl) {
                console.error(`Video block with ID ${id} is missing a URL`);
                return null;
            }

            // Check if the URL is a YouTube URL and convert it to an embeddable format
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
        default:
            return <p key={id}>[Unsupported block type: {type}]</p>;
    }
};

const Post = ({ post, blocks }) => {

  console.log(post);

  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Post', href: '#' },
];
    return (
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb paths={breadcrumbPaths} />
          
            <h1 className="text-4xl font-bold mb-6">{post.properties.Page.title[0].text.content}</h1>
            <div className="prose">
                {blocks.map(block => renderBlock(block))}
            </div>
        </div>
    );
};

export default Post;
