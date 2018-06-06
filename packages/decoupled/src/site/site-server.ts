/**
 * SiteServer class for single site
 */

import { get } from 'lodash';
import { config } from 'multisite-config';
import { fixTrailingSlash, isAbsoluteUrl, shouldFixTrailingSlash } from '../lib';
import logger from '../logger';
import { Renderer } from '../renderer';
import { Router } from '../router';
import { ResponseData } from '../router/response-data';
import { ServerRequest, ServerResponse } from '../server';
import { Site } from './site';

// TODO: Merge Server & Site-Server
export default class SiteServer {

    public site: Site;
    public router: Router;
    public renderer: Renderer;


    constructor(siteId) {
        this.site = new Site();
        this.router = new Router();
        this.renderer = new Renderer(config.get('render.engine', null));

        this.site.loadFromConfig(siteId);
        this.router.addRoutesWithDefaults(this.site.routes);

        this.handleRequest = this.handleRequest.bind(this);

        if (!this.site.enabled) {
            logger.warn(`${this.site.id} is disabled.`);
            return;
        }

        if (!this.site.directory) {
            logger.error(`Required value 'site.directory' not set for ${siteId}.`);
        }
    }

    /**
     * Handle error response
     * @param {{}} res
     * @param {{}} error
     * @param {{}} responseData
     *
     * @returns {Promise.<void>}
     */
    public async handleError(res = null, error, responseData: ResponseData) {

        logger.error(error);

        const errorCode = error.statusCode || 500;

        const renderError = config.get('render.renderError', true);
        const traceError = config.get('render.traceError', false);

        const errorState = {
            code: errorCode,
            error: (traceError) ? error : false,
            meta: {
                template: 'error',
            },
        };

        Object.assign(responseData.state, errorState);

        let body = JSON.stringify(error);

        if (renderError) {
            try {
                body = await this.renderer.render(responseData);
            } catch (e) {
                logger.error(e);
            }
        }

        res.statusCode = errorCode;
        res.write(body);
        res.end();
    }

    /**
     * Handle redirect response
     */
    public handleRedirect(res: ServerResponse, data) {

        const { statusCode = 301, location = '/' } = data;

        logger.info(`SiteServer.handleRedirect: Redirect (${statusCode}) to "${location}"`);

        res.writeHead(statusCode, { Location: location });
        res.end();
    }

    /**
     * Handle regular response
     */
    public async handleResponse(req: ServerRequest, res: ServerResponse, responseData: ResponseData) {
        const route = req.route;
        const docType = route.docType;

        // TODO: Support better response for POST request
        // TODO: Shouldn't there also be a rendered response?
        const answer = (req.method === 'POST') ? '' : await this.renderer.render(responseData);
        const content = `${docType}${answer}`;

        if (route.expires) {
            res.expires(route.expires);
        }

        if (route.statusCode) {
            res.statusCode = route.statusCode;
        }

        if (route.headers && typeof res.header === 'function') {
            Object.entries(route.headers).forEach(([k, v]) => res.setHeader(k, v));
        }

        res.setHeader('Content-Length', Buffer.byteLength(content, 'utf-8'));

        res.write(content);
        res.end();
    }

    /**
     * Handle regular request
     *
     * @param request
     * @param response
     * @returns {Promise.<*>}
     */
    public async handleRequest(request: ServerRequest, response: ServerResponse) {
        logger.debug('SiteServer.handleRequest', this.site.id, request.method, request.originalUrl);

        try {

            // Initialize response code & headers
            if (typeof response.header === 'function') {
                // TODO: set directly when creating the response, so it will always report correct values.
                const statusCode = config.get('router.statusCode', 200);
                const headers = config.get('router.headers', {});
                const expires = config.get('router.expires', 2592000);

                response.expires(expires);
                response.statusCode = statusCode;
                Object.entries(headers).forEach(([k, v]) => response.header(k, v));
            }

            // Resolve state data
            let result = new ResponseData();
            let redirect = null;

            if (shouldFixTrailingSlash(request.path)) {
                redirect = request.path;
            } else {
                result = await this.router.resolveUrl(request, response);
                redirect = result && result.state && result.state.redirect;
            }

            // Handle redirects
            if (redirect) {
                const location = isAbsoluteUrl(redirect)
                    ? redirect
                    : `${request.hostUrl}${redirect}`;
                const statusCode = result.state && result.state.statusCode || 301;
                const data = { statusCode, location: fixTrailingSlash(location) };
                this.handleRedirect(response, data);

                return void (0);
            }

            // Handle errors
            if (result.state && result.state.error) {
                const { error } = result.state;
                await this.handleError(response, error, result);
                return void (0);
            }

            /**
             * Writing final response
             */
            await this.handleResponse(request, response, result);

            return void (0);

        } catch (err) {
            await this.handleError(response, err, new ResponseData());
        }
    }
}
