/**
 * Server class for serving dynamic sites
 */


import bodyParser from 'body-parser';
import express from 'express';
import { config } from 'multisite-config';
import path from 'path';
import serveStatic from 'serve-static';

import SiteServer from '../site/site-server';
import { ServerRequest } from './server-request';

import logger from '../logger';

// Connect Middleware
import basicAuth from './middleware/basic-auth';
import errorHandle from './middleware/error-handle';
import expiresHeader from './middleware/expires-header';
import redirects from './middleware/redirects';
import requestLogger from './middleware/request-logger';
import statusCodeHelper from './middleware/status-code-helper';

export class Server {

    public siteId: string;
    public environment: string;
    public server: any;
    public siteServer: SiteServer;

    constructor(siteId, environment) {
        this.siteId = siteId;
        this.environment = environment;

        this.server = express();
        this.siteServer = new SiteServer(this.siteId);
    }

    /**
     * Start the server
     *
     * @param {int} port
     * @param {String} host
     */
    public listen(port, host) {
        this.server.use(requestLogger);
        this.server.use(statusCodeHelper);
        this.server.use(basicAuth());
        this.server.use(redirects);
        this.server.use(expiresHeader);
        this.server.use(bodyParser.json());

        const staticFiles = config.get('site.staticFiles', []);

        // Set up static file locations
        if (Array.isArray(staticFiles)) {
            staticFiles.forEach((location) => {
                const dir = path.resolve(process.env.PWD, location.path);
                logger.info('Serving static files from:', dir);
                this.server.use(serveStatic(dir));
            });
        }

        this.server.use((req, res) => this.siteServer.handleRequest(new ServerRequest(req), res));
        this.server.use(errorHandle);

        this.server.listen(port, host, () => {
            logger.log('info', `Server listening on http://${host}:${port}`);
        });
    }
}
