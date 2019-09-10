/**
 * Server class for serving dynamic sites
 */



import express from 'express';
import vhost from 'vhost';

import { appPath } from '../lib';
import { logger } from '../logger';

import { Site } from '../site/site';
import { getSiteIDs } from '../config';
import { redirectsMiddleware } from '../server/middleware/redirects';

export class Server {

    public environment: string;
    public app: any;
    public sites: Site[] = [];

    constructor(environment) {
        this.environment = environment;
        this.app = express();
    }

    get siteIds() {
        return getSiteIDs(appPath('sites'));
    }

    public init() {

        // register redirect middleware before any site-server
        this.app.use(redirectsMiddleware(logger));

        for (const siteId of this.siteIds) {
            const site = new Site(siteId);

            if (!site.enabled) {
                continue;
            }

            const host = site.config.get('site.domain'); // TODO: domain should be called host

            this.sites.push(site);
            this.app.use(vhost(host, site.connect()));
        }

    }

    /**
     * Start the server
     */
    public listen(port: number, host: string) {

        this.app.listen(port, host, () => {
            logger.log('info', `Server listening on http://${host}:${port}`);

            const maybePort = port !== 80 ? `:${port}` : '';

            for (const site of this.sites) {
                logger.log('info', `${site.id} on http://${site.host}${maybePort}`);
            }

        });
    }

}
