import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const getDatabase = async () => {
    const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID });
    return response.results;
};

// Busca apenas posts com status "Published" (checkbox marcado)
export const getPublishedPosts = async () => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: 'Published',
            checkbox: {
                equals: true,
            },
        },
    });
    return response.results;
};

export const getPage = async (pageId) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
};

export const getBlocks = async (blockId) => {
    const blocks = [];
    let cursor;

    while (true) {
        const { results, next_cursor } = await notion.blocks.children.list({
            start_cursor: cursor,
            block_id: blockId,
        });
        blocks.push(...results);
        if (!next_cursor) break;
        cursor = next_cursor;
    }

    return blocks;
};

export const getUserDetails = async (userId) => {
    const response = await notion.users.retrieve({ user_id: userId });
    return response;
};
