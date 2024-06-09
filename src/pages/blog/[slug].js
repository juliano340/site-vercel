import { getDatabase, getPage, getBlocks } from '../../lib/notion';

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
  const { type, id, paragraph, image, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className="my-4">
          {paragraph?.rich_text?.map((text, index) => (
            <span key={index} className={`
              ${text.annotations.bold ? 'font-bold' : ''}
              ${text.annotations.italic ? 'italic' : ''}
              ${text.annotations.underline ? 'underline' : ''}
              ${text.annotations.strikethrough ? 'line-through' : ''}
              ${text.annotations.color !== 'default' ? `text-${text.annotations.color}` : ''}
            `}>
              {text.text.content}
            </span>
          ))}
        </p>
      );
    case 'heading_1':
      return (
        <h1 key={id} className="text-3xl font-bold my-4">
          {heading_1?.rich_text?.[0]?.text?.content}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 key={id} className="text-2xl font-bold my-4">
          {heading_2?.rich_text?.[0]?.text?.content}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 key={id} className="text-xl font-bold my-4">
          {heading_3?.rich_text?.[0]?.text?.content}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li key={id} className="list-disc list-inside">
          {bulleted_list_item?.rich_text?.[0]?.text?.content}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li key={id} className="list-decimal list-inside">
          {numbered_list_item?.rich_text?.[0]?.text?.content}
        </li>
      );
    case 'image':
      const imageUrl = image?.file?.url || image?.external?.url;
      if (!imageUrl) {
        console.error(`Image block with ID ${id} is missing a URL`);
        return null;
      }
      const imageCaption = image.caption?.[0]?.plain_text || 'Image';
      return (
        <div key={id} className="my-8 text-center">
          <img 
            src={imageUrl} 
            alt={imageCaption} 
            className="mx-auto"
            style={{ 
              maxWidth: '100%',
              height: 'auto' 
            }} 
          />
          {imageCaption && <p className="mt-2 text-sm text-gray-600">{imageCaption}</p>}
        </div>
      );
    default:
      return null;
  }
};

const Post = ({ post, blocks }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{post.properties.Page.title[0].text.content}</h1>
      <div className="prose prose-lg mx-auto">
        {blocks.map(block => renderBlock(block))}
      </div>
    </div>
  );
};

export default Post;
