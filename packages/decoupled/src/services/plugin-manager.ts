import { resolve } from 'path';
import { Site } from '../site/site';
import { SiteDependent } from '../lib/common/site-dependent';
import { appPath } from '../lib';


export class PluginManager extends SiteDependent {

    public plugins: object;
    public initializedPlugins: object = {};

    /**
     * PluginManager constructor
     */
    constructor(site: Site, plugins: Nullable<object>) {
        super(site);

        this.plugins = plugins || {};

        this.init();
    }

    public init() {
        Object.entries(this.plugins).forEach(([path, args]) => {
            try {
                const modulePath = resolve(appPath(), path);
                const module = require(modulePath);
                const plugin = module.default || module;

                this.initializedPlugins[path] = plugin(this.site, args);
                this.logger.info(`Plugin loaded: ${path}`);
            } catch (e) {
                this.logger.error(`Plugin failed to load: ${path}`);
            }
        });

    }

    public get(key) {
        if (!this.initializedPlugins[key]) {
            throw new Error(`Invalid plugin key: ${key}`);
        }

        return this.initializedPlugins[key];
    }

}
