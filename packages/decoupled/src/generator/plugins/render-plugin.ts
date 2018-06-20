/**
 * Metalsmith React render plugin
 */

import Chalk from 'chalk';

import { Renderer } from '../../renderer';
import { Site } from '../../site/site';
import { SiteDependent } from '../../lib/common/site-dependent';

class RenderPlugin extends SiteDependent {

    private logger: any;

    constructor(site: Site, logger) {
        super(site);
        this.logger = logger;
    }

    public async run(files, metalsmith, done) {
        this.logger.info(`> Start rendering process (${Object.keys(files).length} files).`);

        await Promise.all(Object.entries(files).map(([key, data]) => this.renderFile(files, key, data)));

        done();
    }

    public async renderFile(files, key, data) {
        const filePath = `${key}index.html`.replace(/^[\s/]+|[\s/]+$/g, '');
        let html;

        this.logger.debug(Chalk.yellow('Rendering'), filePath);

        try {
            html = await this.render(data);
        } catch (e) {
            this.logger.error('RenderPlugin.renderFile', e.message, e.stack);
        }

        /* eslint-disable */
        files[filePath] = {
            contents: Buffer.from(html, 'utf8'),
            mode: '0644',
            stats: {},
        };

        // remove old key
        delete files[key];
        /* eslint-enable */

        return true;
    }

    public async render(state) {
        try {
            const renderer = new Renderer(this.site /*, TODO: renderer-module */);
            return await renderer.render(state);
        } catch (err) {
            this.logger.error(err.message);
        }

        return '';
    }
}

export default (site: Site, logger) => async (files, metalsmith, done) => {
    const plugin = new RenderPlugin(site, logger);

    try {
        await plugin.run(files, metalsmith, done);
    } catch (error) {
        logger.error(`${Chalk.red('error')} RenderPluginError: ${error.message}`);
    }
};
