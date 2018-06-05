/**
 * Node caching service
 */

import { config } from 'multisite-config';
import jetpack from 'fs-jetpack';
import NodeCache from 'node-cache';
import path from 'path';


export default class Cache {

    public persist: boolean;
    public cachePath: string;
    private cache: NodeCache;

    /**
     * Cache constructor
     */
    constructor() {
        this.cache = new NodeCache({ stdTTL: 60000, checkperiod: 120 });

        this.init = this.init.bind(this);
        this.loadPersisted = this.loadPersisted.bind(this);
    }

    /**
     * Initializes features, which require access to the config.
     */
    public init() {
        this.persist = config.get('cache.persist', false);

        if (this.persist) {
            this.cachePath = path.join(process.env.PWD, '.dcoupled-cache');
            jetpack.dir(this.cachePath);
            this.loadPersisted();
        }
    }

    /**
     * Get cache
     * @param {String} key
     * @returns {*}
     */
    public get(key) {
        try {
            return this.cache.get(key, true);
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
        if (this.persist) {
            this.persistValue(key, data);
        }

        return this.cache.set(key, data, ttl);
    }

    public destroy(key) {
        return this.cache.del(key);
    }

    public flushAll() {
        return this.cache.flushAll();
    }

    public persistValue(key, value) {
        jetpack.write(path.join(this.cachePath, `${key}.json`), value);
    }

    public loadPersisted() {
        const list = jetpack.list(this.cachePath);

        if (!list || !list.length) {
            return;
        }

        /* eslint-disable */
        for (const file of list) {
            let key = file.split('.');
            key.pop();
            key = key.join('.');

            const data = jetpack.read(path.join(this.cachePath, file), 'json');
            if (!data) {
                return;
            }

            this.cache.set(key, data);
        }
        /* eslint-enable */
    }
}
