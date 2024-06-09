
import Breadcrumb from '../components/Breadcrumb';
import { getDatabase, getPage, getBlocks } from '../../lib/notion';

export async function getStaticPaths() {
    const database = await getDatabase();
    const paths = database.map(post => {
        const slug = post.properties.Slug?.rich_text?.[0]?.text?.content;
        if (!slug) {
            console.error(`Post with ID ${post.id} is missing a slug`);
            return null;
        }
        return { params: { slug } };
    }).filter(Boolean);

    return {
        paths,
        fallback: 'blocking', // Use 'blocking' para carregar a página no momento do acesso, se ainda não estiver gerada
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
        revalidate: 10, // Intervalo de revalidação em segundos
    };
}

const renderBlock = (block) => {
    const { type, id, paragraph, image, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item, embed } = block;

    switch (type) {
        case 'paragraph':
            return (
                <p key={id}>
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
                <div key={id} style={{ textAlign: 'center', margin: '20px 0' }}>
                    <img 
                        src={imageUrl} 
                        alt={imageCaption} 
                        style={{ 
                            maxWidth: '100%',
                            height: 'auto' 
                        }} 
                    />
                    {imageCaption && <p>{imageCaption}</p>}
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
            return (
                <div key={id} style={{ textAlign: 'center', margin: '20px 0' }}>
                    <iframe 
                        src={embed.url} 
                        title="Embedded Content" 
                        style={{ 
                            width: '100%',
                            height: '100%',
                            border: 'none' 
                        }} 
                    />
                </div>
            );
        default:
            return <p key={id}>[Unsupported block type: {type}]</p>;
    }
};

const Post = ({ post, blocks }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">{post.properties.Page.title[0].text.content}</h1>
            <div className="prose">
                {blocks.map(block => renderBlock(block))}
            </div>
        </div>
    );
};

export default Post;
