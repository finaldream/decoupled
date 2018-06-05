/**
 * TODO: Description here.
 */

import { config } from 'multisite-config';
import path from 'path';
import { Route } from '../router/route';

export class Site {

    public id: string;
    public directory: string;
    public enabled: boolean;
    public routes: Route[];

    constructor() {
        this.id = null;
        this.directory = null;
        this.enabled = false;
    }

    public loadFromConfig(siteId) {
        this.id = siteId;
        this.enabled = config.get('site.enabled', false);
        this.routes = config.get('router.routes', []).map((route) => new Route(route));

        const dir = config.get('site.directory', path.join('sites', this.id));
        this.directory = path.resolve(process.env.PWD, dir);
    }
}
