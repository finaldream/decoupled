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
import { handleDelayedCacheInvalidate } from "../cache/utils";

let invalidationQueue;

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
    const params = { q: slug };

    if (queries.preview) {
        Object.assign(params, queries);

        return apiFetch(site, { type, params });
    }

    return site.cachedFetch({ type, params });
};

const handleCacheInvalidate = async (site: Site, req: ServerRequest) => {
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

            site.cache.delete(cacheKey);
            break;

        case 'flush':
            site.cache.clear();
            break;
    }

    const customInvalidates = site.config.get('cache.invalidator', false);

    if (customInvalidates) {
        if (!invalidationQueue) {
            invalidationQueue =
                new DelayedQueue(
                    customInvalidates,
                    site.config.get('cache.invalidationTimeout', 15000),
                    handleDelayedCacheInvalidate
                );
        }

        invalidationQueue.push(data);
    }

    return true;
};

const handlePreviewRequest = async (site: Site, req: ServerRequest) => {

    const type = 'preview';
    const params = req.query || {};

    return apiFetch(site, { type, params });
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
