const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function getDatabase() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return response.results;
}

async function getPage(pageId) {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

async function getBlocks(blockId) {
  const blocks = [];
  let cursor;

  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
}

async function getUserDetails(userId) {
  const response = await notion.users.retrieve({ user_id: userId });
  if (!response) {
    throw new Error(`Failed to fetch user details for userId ${userId}`);
  }
  return response;
}

module.exports = { getDatabase, getPage, getBlocks, getUserDetails };
