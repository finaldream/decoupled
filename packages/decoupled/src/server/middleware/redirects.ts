/**
 * Redirect middleware
 */

import { Redirect } from '../../redirects/redirect';
import { resolveRedirect } from '../../redirects/redirect-store';
import { Logger } from '../../logger';

export const redirectsMiddleware = (logger: Logger) => (req, res, next) => {

    const matched = resolveRedirect(req);

    if (!matched) {
        return next();
    }

    const { redirect: { statusCode }, target } = matched;

    logger.info(() => `RedirectsMiddleware: Redirect (${statusCode}) from "${req.url}" to "${target}"`);
    res.redirect(statusCode, target);
};
