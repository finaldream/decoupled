import { get } from 'lodash';

import { Site, ServerRequest, genAPICacheKey } from 'decoupled';

export const handleMenus = async (site: Site) => {
    site.logger.debug('[WP-API]', 'handleMenus invoked');
    return Object.assign({});
};

export const handleRouteWithSlug = async (site: Site, req: ServerRequest) => {
    site.logger.debug('[WP-API]', 'handleRouteWithSlug invoked');
    return Object.assign({});
};

export const handleCacheInvalidate = async (site: Site, req: ServerRequest) => {
    site.logger.debug('[WP-API]', 'handleCacheInvalidate invoked');
    return Object.assign({});
};

export const handlePreviewRequest = async (site: Site, req: ServerRequest) => {

    site.logger.debug('[WP-API]', 'handlePreviewRequest invoked');
    return Object.assign({});
};
