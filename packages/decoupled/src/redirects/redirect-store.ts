/**
 * Public interface for working with redirects.
 */

import { Request } from 'express';
import { Redirect, RedirectProps } from './redirect';
import { Site } from '../site/site';
import { isAbsoluteUrl } from '../lib';

/**
 * Handles domain-level redirects, which need tp be processed separately from site-level redirects.
 */

interface ResolveRedirectResult {
    target: string;
    redirect: Redirect;
}

let RedirectCollection: Redirect[] = [];

const addRedirects = (redirects: AnyObject[]) => {

    const newRedirects = redirects.map((i: RedirectProps) => new Redirect(i));

    RedirectCollection = [...newRedirects, ...RedirectCollection];

};

export const registerRedirects = (redirect: AnyObject | AnyObject[], site?: Site) => {

    let redirects: AnyObject[] = [];

    if (Array.isArray(redirect)) {
        redirects = redirect as AnyObject[];
    } else {
        redirects = [redirect];
    }

    const hostname = site
        ? site.config.get('site.domain')
        : null;

    redirects = redirects.map((r) => {

        // Allow raw resolvers a functions
        if (typeof r === 'function') {
            r = { resolver: r };
        }

        r.hostname = r.hostname || hostname;
        return r;
    });

    addRedirects(redirects);

};

export const resolveRedirect = (req: Request | AnyObject): ResolveRedirectResult | null => {

    if (!RedirectCollection.length) {
        return null;
    }

    for (const redirect of RedirectCollection) {

        const target = redirect.resolve(req as Request);

        if (typeof target === 'string' && target.length) {
            return { redirect, target };
        }
    }

    return null;

};
