/**
 * Define default routes
 */

import { get } from 'lodash';
import { config } from 'multisite-config';
import path from 'path';

import { cachedFetch } from '../fetch';
import apiFetch from '../fetch/api-fetch';
import cache from '../fetch/cache';
import { DelayedQueue } from '../lib/delayed-queue';
import { genAPICacheKey } from '../lib/gen-api-cache-key';
import { ServerRequest } from '../server/server-request';
import { Route } from './route';

let invalidationQueue;

const handleMenus = async () => {
    const result = await cachedFetch({
        params: {
            lang: 'all',
        },
        type: 'menus',
    });

    return Object.assign({}, result);
};

const handleRouteWithSlug = async (req: ServerRequest) => {
    let slug = req.params._ || req.url;

    // only send the URL, get rid of the query-part
    slug = slug.split('?').shift();

    const queries = req.query || {};

    const type = 'permalink';
    const params = { q: slug };

    if (queries.preview) {
        Object.assign(params, queries);

        return apiFetch({ type, params });
    }

    return cachedFetch({ type, params });
};

const handleDelayedCacheInvalidate = async (items) => {

    const invalidator = config.get('cache.invalidator', false);
    // TODO: generalize / bullet-proof this callable-from-config pattern,
    // it's used in multiple locations (also see require-muliple)
    const callback =
        (typeof invalidator === 'string') ? require(path.resolve(process.env.PWD, invalidator)) || false : invalidator;

    if (typeof callback === 'function') {
        await callback(items);
    } else if (Array.isArray(callback)) {
        const promises = [];

        callback.forEach((promise) => {
            promises.push(promise(items));
        });

        await Promise.all(promises);
    }

};

const handleCacheInvalidate = async (req: ServerRequest) => {
    const data = (req.body && req.body.cache) ? req.body.cache : false;

    if (!data) {
        return false;
    }

    switch (data.action) {

        case 'destroy':
            const type = get(data, 'params.type');
            const params = {
                q: get(data, 'params.slug'),
            };

            const cacheKey = genAPICacheKey(type, params);

            cache.destroy(cacheKey);
            break;

        case 'flush':
            cache.flushAll();
            break;
    }

    if (!invalidationQueue) {
        invalidationQueue =
            new DelayedQueue(config.get('cache.invalidationTimeout', 15000), handleDelayedCacheInvalidate);
    }

    invalidationQueue.push(data);

    return true;
};

const handlePreviewRequest = async (req: ServerRequest) => {

    const type = 'preview';
    const params = req.query || {};

    return apiFetch({ type, params });
};

export const DefaultRoutes = [
    new Route({
        handler: handlePreviewRequest,
        method: 'GET',
        route: '/preview(/)',
    }),
    new Route({
        handler: handleCacheInvalidate,
        method: 'POST',
        route: '/cache(/)',
    }),
    new Route({
        handler: [handleMenus, handleRouteWithSlug],
        method: 'GET',
        route: '(*)',
    }),
];
