/**
 * TODO: Description here.
 */

import { provideConfig, Config, getFromDecoupledJson } from '../config';
import path from 'path';
import { Route } from '../router/route';
import { Router } from '../router';
import { Renderer } from '../renderer';
import { Cache } from '../cache/cache';
import { TaskRunner } from '../services/task-runner';
import { GlobalStore } from '../services/global-store';
import { cachedFetch } from '../fetch';

export class Site {

    public id: string;
    public appPath: string;
    public cache: Cache;
    public config: Config;
    public directory: string;
    public enabled: boolean;
    public router: Router;
    public renderer: Renderer;
    public taskrunner: TaskRunner;
    public globalStore: GlobalStore;

    constructor(siteId: string) {

        this.id = siteId;

        this.appPath = getFromDecoupledJson('appPath', './');
        this.config = provideConfig(siteId, process.env.NODE_ENV, path.join(this.appPath, 'config'));

        this.cache = new Cache(this);

        this.enabled = this.config.get('site.enabled', false);

        const dir = this.config.get('site.directory', path.join('sites', this.id));
        this.directory = path.resolve(process.env.PWD, this.appPath, dir);

        if (!this.directory) {
            throw new Error(`Required value 'site.directory' not set for ${siteId}.`);
        }

        this.renderer = new Renderer(this, this.config.get('render.engine', null));

        const routes: Route[] = this.config.get('router.routes', []).map((route) => new Route(route));

        this.router = new Router(this);
        this.router.addRoutesWithDefaults(routes);

        this.taskrunner = new TaskRunner(this.config.get('tasks'));

        this.globalStore = new GlobalStore();
    }

    /**
     * Wrapper for cachedFetch()
     *
     * @TODO: generalize and simplify, get rid of type...
     */
    public cachedFetch(params) {
        cachedFetch(this, params);
    }

}
