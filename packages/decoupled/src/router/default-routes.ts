/**
 * Define default routes
 */

import { get } from 'lodash';

import apiFetch from '../fetch/api-fetch';
import { DelayedQueue } from '../lib/delayed-queue';
import { genAPICacheKey } from '../lib';
import { ServerRequest } from '../server';
import { Route } from './route';
import { Site } from '../site/site';
import { delayedCacheInvalidate } from '../cache/delayed-cache-invalidate';

// Keeps an invalidation-queue per site
const invalidationQueues: Map<Site, DelayedQueue> = new Map();

const handleMenus = async (site: Site) => {
    const result = await site.cachedFetch({
        params: {
            lang: 'all',
        },
        type: 'menus',
    });

    return Object.assign({}, result);
};

const handleRouteWithSlug = async (site: Site, req: ServerRequest) => {
    let slug = req.params._ || req.url;

    // only send the URL, get rid of the query-part
    slug = slug.split('?').shift();

    const queries = req.query || {};
    const type = 'permalink';
    const params = { q: slug, ...queries };

    if (queries.preview) {
        return apiFetch(site, { type, params });
    }

    return site.cachedFetch({ type, params });
};

const handleCacheInvalidate = async (site: Site, req: ServerRequest) => {
    const data = (req.body && req.body.cache) ? req.body.cache : false;
    const invalidator = site.config.get('cache.invalidator', false);

    let queue = invalidationQueues.get(site);

    if (!data) {
        return { error: 'Invalid request' };
    }

    switch (data.action) {

        case 'destroy':
            const type = get(data, 'params.type');
            const params = {
                q: get(data, 'params.slug'),
            };

            const cacheKey = genAPICacheKey(type, params);

            site.cache.delete(cacheKey);

            if (invalidator) {
                if (!queue) {
                    queue = new DelayedQueue(
                        site.config.get('cache.invalidationTimeout', 15000),
                        (items) => delayedCacheInvalidate(site, items),
                    );
                    queue.logger = site.logger;
                    invalidationQueues.set(site, queue);
                }

                queue.push(data);
            }

            break;

        case 'flush':
            console.log('Flush Cache!');
            site.cache.clear();
            if (invalidator) {
                if (queue) {
                    queue.reset();
                }

                await delayedCacheInvalidate(site, ['/*']);
            }

            break;
    }

    return { status: 'ok' };
};

const handlePreviewRequest = async (site: Site, req: ServerRequest) => {

    const type = 'preview';
    const params = req.query || {};

    return apiFetch(site, { type, params });
};

export const DefaultRoutes = [
    new Route({
        handler: [handleMenus, handlePreviewRequest],
        method: 'GET',
        route: '/preview(/)',
    }),
    new Route({
        handler: handleCacheInvalidate,
        method: 'POST',
        route: '/cache(/)',
        docType: '',
        render: (site, { state }) => JSON.stringify(state),
    }),
    new Route({
        handler: [handleMenus, handleRouteWithSlug],
        method: 'GET',
        route: '(*)',
    }),
];
