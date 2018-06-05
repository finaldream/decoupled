/**
 * Populate metalsmith source files from API
 */

import Chalk from 'chalk';
import promiseMap from 'promise.map';
import { config } from 'multisite-config';

import { cachedFetch } from '../../fetch';
import { Router, DefaultRoutes } from '../../router';
import { removeTrailingSlash, ServerRequest } from '../../lib';
import { ServerResponse } from 'http';

const DEFAULT_CONCURRENCY = 8;

class WpApi {

    private logger: any;

    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Run this plugin
     * @returns {Promise}
     */
    public async run(files, metalsmith, done) {
        // Get an index of all posts
        const posts = await this.fetchList();
        this.logger.info(`Fetched ${posts.length} posts.`);

        if (!posts || !posts.length) {
            this.logger.info('Got empty file-list from server. Nothing to do.');
            done();
            return;
        }

        const router = new Router();
        router.addRoutes(DefaultRoutes);

        // iterate each post & language
        const states = {};
        const concurreny = config.get('generator.concurrency', DEFAULT_CONCURRENCY);

        await promiseMap(
            posts,
            async (post) => {
                const permalink = decodeURIComponent(post.permalink);

                const req = new ServerRequest({ url: permalink });
                const res = new ServerRequest();

                try {
                    // TODO: this probably won't work for the generator!
                    states[post.permalink] = await router.resolveUrl(req, res);
                } catch (e) {
                    this.logger.error(post.permalink, e.message);
                }
            },
            concurreny,
        );

        Object.assign(files, states);

        done();
    }

    public async fetchList() {
        const list = await cachedFetch({ type: 'list', params: {} });

        return list.posts || [];
    }
}

module.exports = function wpApi(logger) {
    return function wpApiPlugin(files, metalsmith, done) {
        const plugin = new WpApi(logger);

        try {
            plugin.run(files, metalsmith, done);
        } catch (error) {
            logger.error(`${Chalk.red('error')} ApiPluginError:`, error.message, error.stack);
        }
    };
};
