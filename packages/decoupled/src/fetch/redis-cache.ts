/**
 * Redis caching service
 */

import Redis from 'ioredis';
import { config } from 'multisite-config';

export default class RedisCache {

    private cache: Redis;

    /**
     * Initializes features, which require access to the config.
     */
    public init() {
        const host = config.get('cache.redis', false);

        if (!host) {
            throw new Error('No Redis host found');
        }

        try {
            this.cache = new Redis(host);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get cache
     * @param {String} key
     * @returns {*}
     */
    public async get(key) {
        try {
            const data = await this.cache.get(key);
            return JSON.parse(data);
        } catch (err) {
            return false;
        }
    }

    /**
     * Set cache
     * @param {String} key
     * @param {*} data
     * @param {int} ttl
     * @return {Boolean}
     */
    public set(key, data, ttl = 60000) {
        this.cache.set(key, JSON.stringify(data), 'EX', ttl);
    }

    /**
     * Delete single cache
     * @param key
     */
    public destroy(key) {
        this.cache.del(key);
    }

    /**
     * Flush all cache
     */
    public flushAll() {
        this.cache.flushdb();
    }

}
