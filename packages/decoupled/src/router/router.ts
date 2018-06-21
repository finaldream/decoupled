/**
 * Router class.
 *
 * Manages route-handlers and matches incoming urls.
 */

import Chalk from 'chalk';
import { merge } from 'lodash';
import { validateHttpMethod } from '../lib';
import { logger } from '../logger';
import { ServerRequest } from '../server/server-request';
import { ServerResponse } from '../server/server-response';
import { collectRoutes } from './collect-routes';
import { DefaultRoutes } from './default-routes';
import HttpError from './http-error';
import { Redirect } from './redirect';
import { Route } from './route';
import { ResponseData } from './response-data';
import { SiteDependent } from '../lib/common/site-dependent';

export class Router extends SiteDependent {

    public routes: object = {};
    public redirects: Redirect[] = [];


    /**
     * Define routes to be used
     * @param {Route} route
     */
    public addRoute(route: Route) {

        if (!route.pattern) {
            logger.error('Router.useRoute: invalid pattern for', route.method, route.route);
            return;
        }

        logger.debug('Router.useRoute', route.method, route.route);

        if (!this.routes[route.method]) {
            this.routes[route.method] = [];
        }

        this.routes[route.method].push(route);
    }

    /**
     * Adds multiple routes at once
     * @param {Array<Route>} routes
     */
    public addRoutes(routes: Route[]) {
        if (!Array.isArray(routes)) {
            throw new Error('Array expected');
        }

        routes.forEach((route) => this.addRoute(route));
    }

    public addRoutesWithDefaults(routes: Route[]) {

        this.addRoutes(
            collectRoutes(DefaultRoutes, routes),
        );

    }

    /**
     * Check route and return route handler
     *
     * @param {{}} req
     *
     * @returns {{handler: undefined, route: undefined, params: {}}}
     */
    public match(req: ServerRequest): Route | null {

        const method = req.method || 'GET';

        logger.debug('Router.match', method, req.url);

        validateHttpMethod(method);

        const routes = this.routes[method];

        let result = null;

        routes.some((route) => {
            if (route.match(req.path)) {
                result = route;
                return true;
            }
            return false;
        });

        return result;
    }

    /**
     * Resolves a provided URL into a state-object
     *
     * @param {ServerRequest} request Request-object
     * @param {ServerResponse} response Response-object
     *
     * @throws HttpError on Error
     */
    public async resolveUrl(request: ServerRequest, response: ServerResponse): Promise<ResponseData> {

        logger.debug('Router.resolveURL', request.method, request.url);

        // Find matched route
        const route = this.match(request);

        if (!route) {
            logger.debug(`Router.resolveURL: ${Chalk.red('No match')}`, request.url);
            throw new HttpError(404, 'Not found');
        }

        if (!route.handler) {
            logger.error(`Router.resolveURL: ${Chalk.red('Empty route-handler')}`, route.route, request.url);
            throw new HttpError(500, 'Empty route-handler');
        }

        request.route = route;

        logger.debug(`Router.resolveURL: ${Chalk.green('matched')}`, request.url);

        // Prepare state data
        let state = {};

        try {
            state = await route.handle(this.site, request);
        } catch (e) {
            logger.error('Router.resolveUrl', e);
        }

        return {
            request,
            response,
            route,
            site: this.site,
            state,
        };
    }
}
