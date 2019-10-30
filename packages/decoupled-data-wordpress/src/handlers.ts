import { get } from 'lodash';
import qs from 'qs';
import parser from './fetch-parser';
import { Site, ServerRequest, genAPICacheKey } from 'decoupled';

const handleMenus = async (site: Site) => {

    site.logger.debug('[WP-API]', 'handleMenus invoked');

    const { endpoint } = site.config.get('services.wpapi');

    const params = {
        lang: 'all',
    };
    const type = 'menus';

    const cacheKey = genAPICacheKey({
        params,
        type
    });

    let url = `${endpoint.replace(/\/$/, '')}/${type}/`;

    if (params) {
        url = `${url}?${qs.stringify(params)}`;
    }

    const res = await site.cachedFetch(url, cacheKey);
    const result = await parser(site, res, type);
    
    return result;
};

export const handleRouteWithSlug = async (site: Site, req: ServerRequest) => {

    site.logger.debug('[WP-API]', 'handleRouteWithSlug invoked');

    const { endpoint } = site.config.get('services.wpapi');

    let slug = req.params._ || req.url;

    // only send the URL, get rid of the query-part
    slug = slug.split('?').shift();

    const queries = req.query || {};
    const type = 'permalink';
    const params = { q: slug, ...queries };

    let url = `${endpoint.replace(/\/$/, '')}/${type}/`;

    if (params) {
        url = `${url}?${qs.stringify(params)}`;
    }

    if (queries.preview) {
        const preview = await site.fetch(url);
        return parser(site, preview, type);
    }

    const cacheKey = genAPICacheKey({
        params,
        type
    });

    const res = await site.cachedFetch(endpoint, cacheKey);

    const result = await parser(site, res, type);
    
    return result;
};

export const handleCacheInvalidate = async (site: Site, req: ServerRequest) => {
    site.logger.debug('[WP-API]', 'handleCacheInvalidate invoked');
    return Object.assign({});
};

export const handlePreviewRequest = async (site: Site, req: ServerRequest) => {

    site.logger.debug('[WP-API]', 'handlePreviewRequest invoked');
    return Object.assign({});
};
