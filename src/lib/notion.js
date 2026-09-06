import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (request, maxRetries = 6) => {
    for (let attempt = 0; ; attempt++) {
        try {
            return await request();
        } catch (error) {
            const isRateLimited = error?.code === 'rate_limited' || error?.status === 429;
            if (!isRateLimited || attempt >= maxRetries) throw error;
            const retryAfter = parseFloat(
                typeof error?.headers?.get === 'function'
                    ? error.headers.get('retry-after')
                    : error?.headers?.['retry-after']
            );
            const backoff = Math.min(1000 * 2 ** attempt, 15000) + Math.random() * 500;
            const delay = Math.min(Number.isFinite(retryAfter) ? retryAfter * 1000 : backoff, 30000);
            await sleep(delay);
        }
    }
};

const MIN_REQUEST_INTERVAL = 350;
let lastRequestAt = 0;
let queue = Promise.resolve();

const requestNotion = (request) => {
    const task = queue.then(async () => {
        const wait = lastRequestAt + MIN_REQUEST_INTERVAL - Date.now();
        if (wait > 0) await sleep(wait);
        try {
            return await withRetry(request);
        } finally {
            lastRequestAt = Date.now();
        }
    });
    queue = task.then(() => {}, () => {});
    return task;
};

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
const buildCache = new Map();

const withBuildCache = (key, fn) => {
    if (!isBuildPhase) return fn();
    if (!buildCache.has(key)) {
        buildCache.set(
            key,
            fn().catch((error) => {
                buildCache.delete(key);
                throw error;
            })
        );
    }
    return buildCache.get(key);
};

const queryAllPages = async (query) => {
    const results = [];
    let start_cursor;

    do {
        const response = await requestNotion(() =>
            notion.databases.query({
                ...query,
                ...(start_cursor ? { start_cursor } : {}),
            })
        );

        results.push(...response.results);
        start_cursor = response.next_cursor;
    } while (start_cursor);

    return results;
};

export const getDatabase = async () => {
    return withBuildCache('database', () =>
        queryAllPages({ database_id: process.env.NOTION_DATABASE_ID })
    );
};

// Busca apenas posts com status "Published" (checkbox marcado)
export const getPublishedPosts = async () => {
    return withBuildCache('published-posts', () =>
        queryAllPages({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: 'Published',
                checkbox: {
                    equals: true,
                },
            },
        })
    );
};

export const getPage = async (pageId) => {
    return withBuildCache(`page:${pageId}`, () =>
        requestNotion(() => notion.pages.retrieve({ page_id: pageId }))
    );
};

export const getBlocks = async (blockId) => {
    return withBuildCache(`blocks:${blockId}`, async () => {
        const blocks = [];
        let cursor;

        while (true) {
            const { results, next_cursor } = await requestNotion(() =>
                notion.blocks.children.list({
                    start_cursor: cursor,
                    block_id: blockId,
                })
            );
            blocks.push(...results);
            if (!next_cursor) break;
            cursor = next_cursor;
        }

        return blocks;
    });
};

export const getUserDetails = async (userId) => {
    return withBuildCache(`user:${userId}`, () =>
        requestNotion(() => notion.users.retrieve({ user_id: userId }))
    );
};
