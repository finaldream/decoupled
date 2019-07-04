/**
 * Redirect Class.
 * Represents a single redirect-route with matchers and resolvers.
 */

import { RedirectResolver, RedirectResolverFunction } from './redirect-resolver';
import { RedirectMatcher, RedirectMatcherFunction } from './redirect-matcher';
import { logger } from '../logger';
import { getHostUrl, isAbsoluteUrl } from '../lib';
import { Request } from 'express';

type RedirectCustomResolverFunction = (url: string, req: Request, redirect: Redirect) => string | null;

export interface RedirectProps {
    source: RegExp | string | RedirectMatcherFunction;
    url: RegExp | string | RedirectMatcherFunction;
    path: RegExp | string | RedirectMatcherFunction;
    target: string | RedirectResolverFunction;
    statusCode: number;
    type: string;
    hostname?: string;

    /**
     * if set, this function allows to customize the full resolving process.
     * It gets passed the incoming URL and is expected to return either null or
     * a redirection-URL.
     */
    resolver?: RedirectCustomResolverFunction;
}


export class Redirect {

    public statusCode: number;
    public hostname: string = null; // required to resolve relative URLs in multisite-env

    protected resolver: RedirectCustomResolverFunction;
    protected target: RedirectResolver;
    protected url: RedirectMatcher;
    protected path: RedirectMatcher;

    constructor(props: RedirectProps) {

        if (props.source) {
            logger.deprecate('redirect property "source"', 'Use "url" instead');
        }

        // TODO: remove support for "source" to be clear
        const url = props.url || props.source;

        this.resolver = props.resolver || null;
        this.url = url ? new RedirectMatcher(url) : null;
        this.path = props.path ? new RedirectMatcher(props.path) : null;
        this.target = new RedirectResolver(props.target);
        this.statusCode = props.statusCode || 301;
        this.hostname = props.hostname || null;

    }

    public match(hostUrl: string, urlPath: string): object | boolean {


        if (this.url) {
            logger.silly(() => ['Redirect matching url:', this.url, `${hostUrl}${urlPath}`]);
            return this.url.match(`${hostUrl}${urlPath}`);
        } else if (this.path) {
            logger.silly(() => ['Redirect matching path:', this.url, urlPath]);
            return this.path.match(urlPath);
        }

        return false;
    }

    /**
     * @return Always returns an absolute URL or null for no match.
     */
    public resolve(req: Request): string | null {

        // Only match the path without query-string
        // TODO: ability to rewrite / modify query-string
        const hostUrl = getHostUrl(req);
        const [urlPath, query] = req.url.split('?');
        const fullUrl = `${hostUrl}${urlPath}`;

        logger.silly(() => [
            'Redirect resolving',
            (this.url || this.path || this.resolver).toString(),
            fullUrl,
        ]);

        let result: string = null;

        if (this.resolver) {
            // either pass resolving to a custom handler...
            result = this.resolver(fullUrl, req, this);
        } else {

            // ...or do the actual resolution

            // Check if hostname matches for relative URLs.
            // In order to redirect from others hosts, leave empty and use abolute URLs
            if (!this.url && this.hostname && req.hostname !== this.hostname) {
                return null;
            }

            const matched = this.match(hostUrl, urlPath);

            if (!matched) {
                return null;
            }

            result = this.target.resolve(matched as object || {});
        }

        if (!result || !result.length) {
            return null;
        }

        if (query) {
            result = `${result}?${query}`;
        }

        logger.debug(() => ['Redirect RESOLVED', (this.url || this.path || this.resolver).toString(), result]);


        result = isAbsoluteUrl(result)
            ? result
            : `${getHostUrl(req)}${result}`;

        return result;
    }

}
