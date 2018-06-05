
import chalk from 'chalk';
import { config } from 'multisite-config';

import logger from '../logger';
import NodeCache from './node-cache';
import RedisCache from './redis-cache';

class Cache {

    // @todo create an interface
    private cache: NodeCache | RedisCache;

    constructor() {

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.destroy = this.destroy.bind(this);
        this.flushAll = this.flushAll.bind(this);
    }

    public init() {
        logger.info('Initialize cache configuration');

        const redis = config.get('cache.redis', false);

        logger.info(`Using ${chalk.yellow((redis) ? 'REDIS' : 'NODE-CACHE')} as caching service.`);

        this.cache = (redis) ? new RedisCache() : new NodeCache();

        this.cache.init();
    }

    public async get(key) {
        this.cache.get(key);
    }

    public set(key, data, ttl = 60000) {
        this.cache.set(key, data, ttl);
    }

    public destroy(key) {
        this.cache.destroy(key);
    }

    public flushAll() {
        this.cache.flushAll();
    }
}

export default new Cache();
