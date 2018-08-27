/**
 * Static site generator
 */

import Chalk from 'chalk';
import MetalSmith from 'metalsmith';
import { logger } from '../logger';
import path from 'path';

import renderPlugin from './plugins/render-plugin';
import sourcePlugin from './plugins/source-plugin';
import { Site } from '../site/site';

export class Generator {

    private options: AnyObject;
    private source: string;
    private totalPlugins: number;
    private currentPlugin: number;
    private site: Site;

    /**
     * Generator constructor
     *
     * @param {string} site
     * @param {string} env
     * @param {string} source
     * @param {object} logger
     */
    constructor(siteId: string, options: AnyObject) {

        this.site = new Site(siteId);
        this.options = options;
        this.source = options.source;
        this.totalPlugins = 0;
        this.currentPlugin = 0;

        const infoLine = `Loading ${options.site} configuration.`;
        const borderLine = '='.repeat(infoLine.length);

        logger.info(borderLine);
        logger.info(`Loading ${Chalk.green(options.site)} configuration.`);
        logger.info(borderLine);
    }

    /**
     * Run the generator
     */
    public run() {
        return new Promise((resolve, reject) => {
            const dataSourcePlugin = sourcePlugin(this.source, logger);

            try {
                const smith = MetalSmith(path.resolve())
                    .source(this.site.config.get('generator.sourcePath'))
                    .use(this.trackProgress(dataSourcePlugin, `Populate input files from ${this.source.toUpperCase()}`))
                    .use(this.trackProgress(renderPlugin(this.site, logger), 'Render views from input files'))
                    .destination(this.site.config.get('generator.outputPath'));

                const files = smith.build((err) => {
                    if (err) {
                        logger.error(err.message, '\n', err.stack);
                        reject(err);
                    }
                    resolve({
                        destination: smith.destination(),
                        files: Object.keys(files || {}),
                        source: smith.source(),
                    });
                });
            } catch (err) {
                logger.error(err.message);
                reject(err);
            }
        });
    }

    /**
     * Track generator progress
     *
     * @param {function} plugin
     * @param {string} status
     * @returns {function(*=, *=, *=)}
     */
    public trackProgress(plugin, status) {
        this.totalPlugins += 1;

        return (files, metalsmith, done) => {
            this.currentPlugin += 1;
            logger.info(`${Chalk.green('started')} ${status}.`);

            plugin(files, metalsmith, this.updateProgress(done));
        };
    }

    /**
     * Update generator progress
     * @param {function()} done
     * @returns {function()}
     */
    public updateProgress(done) {
        return () => {
            const percent = this.currentPlugin / this.totalPlugins * 100;
            logger.info(`${Chalk.green('success')} ${percent}% completed`);
            done();
        };
    }
}
