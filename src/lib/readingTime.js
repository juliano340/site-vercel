const getRichTextContent = (richText = []) => {
  if (!Array.isArray(richText)) return '';
  return richText
    .map((item) => item?.plain_text || item?.text?.content || '')
    .join(' ')
    .trim();
};

const getBlockText = (block = {}) => {
  switch (block.type) {
    case 'paragraph':
      return getRichTextContent(block.paragraph?.rich_text);
    case 'heading_1':
      return getRichTextContent(block.heading_1?.rich_text);
    case 'heading_2':
      return getRichTextContent(block.heading_2?.rich_text);
    case 'heading_3':
      return getRichTextContent(block.heading_3?.rich_text);
    case 'bulleted_list_item':
      return getRichTextContent(block.bulleted_list_item?.rich_text);
    case 'numbered_list_item':
      return getRichTextContent(block.numbered_list_item?.rich_text);
    case 'quote':
      return getRichTextContent(block.quote?.rich_text);
    case 'to_do':
      return getRichTextContent(block.to_do?.rich_text);
    case 'code':
      return getRichTextContent(block.code?.rich_text);
    default:
      return '';
  }
};

export const calculateReadingTimeFromBlocks = (blocks = [], wordsPerMinute = 200) => {
  const fullText = blocks
    .map((block) => getBlockText(block))
    .filter(Boolean)
    .join(' ')
    .trim();

  const words = fullText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};
