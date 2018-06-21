import qs from 'qs';
import { getHostUrl } from '../lib/get-host-url';
import { Route } from '../router/route';


interface ServerRequestInternalInterface {
    req: AnyObject;
    path: string;
    query: AnyObject;
    params: AnyObject;
    route: Route | null;
}

/**
 * Normalizes a request between Express and Static Site
 */
export class ServerRequest {

    public internal: ServerRequestInternalInterface;

    get method(): string {
        return this.internal.req.method || 'GET';
    }

    get headers(): AnyObject {
        return this.internal.req.headers || {};
    }

    get statusCode(): number {
        return this.internal.req.statusCode || 200;
    }

    get url(): string {
        return this.internal.req.url || '';
    }

    get originalUrl(): string {
        return this.internal.req.originalUrl || this.url || '';
    }

    get baseUrl(): string {
        return this.internal.req.baseUrl || '';
    }

    get body(): AnyObject | null {
        return this.internal.req.body || null;
    }

    get path(): string {
        return this.internal.req.path || this.internal.path;
    }

    get query(): AnyObject {
        return this.internal.req.query || this.internal.query;
    }

    get hostUrl(): string {
        return getHostUrl(this.internal.req);
    }

    get fullUrl(): string {
        return `${this.hostUrl}${this.url}`;
    }

    get params(): AnyObject {
        return this.internal.params || {};
    }

    get route(): Route | null {
        return this.internal.route;
    }

    set route(route: Route) {
        this.internal.route = route;
        this.internal.params = route.match(this.url) || {};
    }

    constructor(req: AnyObject = {}) {

        this.internal = {
            params: {},
            path: '',
            query: {},
            req,
            route: null,
        };

        if (!req.path || !req.query) {
            const [path, query] = this.internal.req.url.split('?', 2);

            this.internal.path = path;
            this.internal.query = qs.parse(query);

        }

    }

}
