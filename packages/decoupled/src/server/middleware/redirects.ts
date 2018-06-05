/**
 * Redirect middleware
 */

import { unionBy } from 'lodash';
import { config } from 'multisite-config';
import { Redirect, IRedirectProps } from '../../router/redirect';
import { getHostUrl, isAbsoluteUrl } from '../../lib/';
import logger from '../../logger';
import globalStore from '../../services/global-store';

const RedirectsMiddleware = (req, res, next) => {

    const globalState = globalStore.getState();

    const staticRedirects = config.get('router.redirects', []);
    const dynamicRedirects = globalState.redirects || [];

    const redirects: any[] = unionBy(staticRedirects, dynamicRedirects, 'source');

    if (!redirects.length) {
        next();
    }

    const { url } = req;
    const hostUrl = getHostUrl(req);
    const originalUrl = `${hostUrl}${url}`;

    let target: string | null = null;
    let matched: Redirect | null = null;

    for (const r of redirects) {
        // TODO: Performance and DRY-Issue, don't re-create the Redirects for each request, use the Router here.
        const redirect = new Redirect(r);

        target = redirect.resolve(originalUrl, url);

        if (typeof target === 'string') {
            matched = redirect;
            break;
        }
    }

    if (target && matched) {
        const location = isAbsoluteUrl(target) ? target : `${hostUrl}${target}`;

        logger.info(`RedirectsMiddleware: Redirect (${matched.statusCode}) from "${originalUrl}" to "${location}"`);

        res.redirect(matched.statusCode, location);
    } else {
        next();
    }
};

export default RedirectsMiddleware;
