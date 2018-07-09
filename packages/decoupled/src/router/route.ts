import { merge } from 'lodash';
import UrlPattern from 'url-pattern';
import { joinPromises, validateHttpMethod } from '../lib';
import { AsyncFunction } from '../lib/types/async-function';
import { RenderEngineInterface } from '../renderer';

export type RouteHandlerType = AsyncFunction | AsyncFunction[] | null;

interface RouteInternalInterface {
    handler: RouteHandlerType;
}

export class Route {


    public internal: RouteInternalInterface;
    public method: string = 'GET';
    public route: string = '(*)';
    public docType: string = '<!DOCTYPE html>';
    public headers: object = {};
    public pattern: UrlPattern;
    public expires: number | null = null;
    public statusCode: number | null = null;
    public render?: RenderEngineInterface = null;

    get handler(): RouteHandlerType {
        return this.internal.handler;
    }

    constructor(props: AnyObject) {

        this.internal = {
            handler: null,
        };

        this.method = (props.method || this.method).toUpperCase();
        this.route = props.route || this.route;
        this.internal.handler = props.handler || null;
        this.headers = props.headers || this.headers;
        this.expires = props.expires || this.expires;
        this.statusCode = props.statusCode || this.statusCode;
        this.docType = (typeof props.docType === 'string') ? props.docType : this.docType;

        validateHttpMethod(this.method);

        const pattern = this.route.split('?', 1).pop();

        this.pattern = (pattern.length) ? new UrlPattern(pattern) : null;
        this.render = props.render || null;

    }

    public match(url: string) {

        if (!this.pattern) {
            return false;
        }


        return this.pattern.match(url);

    }

    public async handle(...args: any[]) {

        if (!this.internal.handler) {
            return {};
        }

        const handlers = !Array.isArray(this.internal.handler)
            ? [this.internal.handler]
            : this.internal.handler;

        const res = await joinPromises(handlers, ...args);

        return res.reduce((prev, curr) => merge({}, prev, curr));

    }

}
