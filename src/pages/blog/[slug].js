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
    fallback: 'blocking', // Use 'blocking' to generate the page on the fly if it doesn't exist
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
  // console.log('Rendering block:', block);
  const { type, id, paragraph, image, heading_1, heading_2, heading_3, bulleted_list_item } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className="mb-4">
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
    case 'heading_1':
      return (
        <h1 key={id} className="text-4xl font-bold my-4">
          {heading_1?.rich_text?.map((text, index) => (
            <span key={index}>
              {text.text.content}
            </span>
          ))}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 key={id} className="text-3xl font-semibold my-4">
          {heading_2?.rich_text?.map((text, index) => (
            <span key={index}>
              {text.text.content}
            </span>
          ))}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 key={id} className="text-2xl font-semibold my-4">
          {heading_3?.rich_text?.map((text, index) => (
            <span key={index}>
              {text.text.content}
            </span>
          ))}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li key={id} className="list-disc list-inside mb-2">
          {bulleted_list_item?.rich_text?.map((text, index) => (
            <span key={index} style={{
              fontWeight: text.annotations.bold ? 'bold' : 'normal',
              fontStyle: text.annotations.italic ? 'italic' : 'normal',
              textDecoration: `${text.annotations.underline ? 'underline' : ''} ${text.annotations.strikethrough ? 'line-through' : ''}`,
              color: text.annotations.color !== 'default' ? text.annotations.color : 'inherit',
            }}>
              {text.text.content}
            </span>
          ))}
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
        <div key={id} className="text-center my-4">
          <img 
            src={imageUrl} 
            alt={imageCaption} 
            className="max-w-full h-auto mx-auto"
          />
          {imageCaption && <p className="text-gray-500 mt-2">{imageCaption}</p>}
        </div>
      );
    // Adicione mais casos aqui para lidar com outros tipos de blocos
    default:
      return <p key={id}>[Unsupported block type: {type}]</p>;
  }
};

const Post = ({ post, blocks }) => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-8 text-center">{post.properties.Page.title[0].text.content}</h1>
      <div className="prose mx-auto">
        <ul>
          {blocks.map(block => renderBlock(block))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
