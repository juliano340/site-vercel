import React from 'react'

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

export default function teste() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh]'> <h1>teste</h1></div>
  )
}
