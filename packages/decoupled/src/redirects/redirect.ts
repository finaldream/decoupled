/**
 * Redirect Class.
 * Represents a single redirect-route with matchers and resolvers.
 */

import { RedirectResolver, RedirectResolverFunction } from './redirect-resolver';
import { RedirectMatcher, RedirectMatcherFunction } from './redirect-matcher';
import { logger } from '../logger';
import { getHostUrl, isAbsoluteUrl } from '../lib';
import { Request } from 'express';


export interface RedirectProps {
    source: RegExp | string | RedirectMatcherFunction;
    url: RegExp | string | RedirectMatcherFunction;
    path: RegExp | string | RedirectMatcherFunction;
    target: string | RedirectResolverFunction;
    statusCode: number;
    type: string;
    hostname?: string;
}

export class Redirect {

    public target: RedirectResolver;
    public url: RedirectMatcher;
    public path: RedirectMatcher;

    public statusCode: number;
    public hostname: string = null; // required to resolve relative URLs in multisite-env

    constructor(props: RedirectProps) {


        if (props.source) {
            logger.deprecate('redirect property "source"', 'Use "url" instead');
        }

        // TODO: remove support for "source" to be clear
        const url = props.url || props.source;

        this.url = url ? new RedirectMatcher(url) : null;
        this.path = props.path ? new RedirectMatcher(props.path) : null;
        this.target = new RedirectResolver(props.target);
        this.statusCode = props.statusCode || 301;
        this.hostname = props.hostname || null;

    }

    public match(req: Request): object | boolean {


        if (this.url) {
            const hostUrl = getHostUrl(req);
            logger.silly(() => ['Redirect matching url:', this.url, `${hostUrl}${req.url}`]);
            return this.url.match(`${hostUrl}${req.url}`);
        } else if (this.path) {
            logger.silly(() => ['Redirect matching path:', this.url, req.url]);
            return this.path.match(req.url);
        }

        return false;
    }

    /**
     * @return Always returns an absolute URL or null for no match.
     */
    public resolve(req: Request): string | null {

        logger.silly(() => ['Redirect resolving', (this.url || this.path).toString(), `${getHostUrl(req)}${req.url}`]);
        // Check if hostname matches for relative URLs.
        // In order to redirect from others hosts, leave empty and use abolute URLs
        if (!this.url && this.hostname && req.hostname !== this.hostname) {
            return null;
        }

        const matched = this.match(req);

        if (!matched) {
            return null;
        }

        let result = this.target.resolve(matched as object || {});

        if (!result && !result.length) {
            return null;
        }

        logger.debug(() => ['Redirect RESOLVED', (this.url || this.path).toString(), result]);


        result = isAbsoluteUrl(result)
            ? result
            : `${getHostUrl(req)}${result}`;

        return result;
    }

}
