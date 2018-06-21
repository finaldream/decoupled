/**
 * Redis caching service
 */

import Redis from 'ioredis';
import { CacheInterface } from './cache-interface';
import { Site } from '../site/site';
import { SiteDependent } from '../lib/common/site-dependent';

export default class RedisCache extends SiteDependent implements CacheInterface {

    private cache: Redis;

    constructor(site: Site) {

        super(site);

    }

    /**
     * Initializes features, which require access to the config.
     */
    public init() {
        const host = this.site.config.get('cache.redis', false);

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
     * @param key
     */
    public async get(key: string) {
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
     */
    public set(key: string, value: any, ttl: number = 60000): boolean {
        return this.cache.set(key, JSON.stringify(value), 'EX', ttl);
    }

    /**
     * Delete single cache
     * @param key
     */
    public delete(key: string) {
        this.cache.del(key);
    }

    /**
     * Clear all cache
     */
    public clear() {
        this.cache.flushdb();
    }

}
