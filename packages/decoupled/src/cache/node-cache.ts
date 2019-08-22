/**
 * Node caching service
 */

import jetpack from 'fs-jetpack';
import NodeCache from 'node-cache';
import path from 'path';
import { CacheInterface } from './cache-interface';
import { Site } from '../site/site';
import { SiteDependent } from '../lib/common/site-dependent';


export default class Cache extends SiteDependent implements CacheInterface {

    public persist: boolean;
    public cachePath: string;
    private cache: NodeCache;

    /**
     * Cache constructor
     */
    constructor(site: Site) {

        super(site);

        this.cache = new NodeCache({ stdTTL: 60000, checkperiod: 120 });
        this.loadPersisted = this.loadPersisted.bind(this);
        this.persist = this.site.config.get('cache.persist', false);

        if (this.persist) {
            this.cachePath = path.resolve('.decoupled-cache');
            jetpack.dir(this.cachePath);
            this.loadPersisted();
        }
    }

    public async get(key: string): Promise<any> {
        try {
            return this.cache.get(key);
        } catch (err) {
            return false;
        }
    }

    public set(key: string, value: string, ttl: number = 60000): boolean {
        if (this.persist) {
            this.persistValue(key, value);
        }

        return this.cache.set(key, value, ttl);
    }

    public delete(key: string) {
        return this.cache.del(key);
    }

    public clear() {
        return this.cache.flushAll();
    }

    private persistValue(key, value) {
        jetpack.write(path.join(this.cachePath, `${key}.json`), value);
    }

    private loadPersisted() {
        const list = jetpack.list(this.cachePath);

        if (!list || !list.length) {
            return;
        }

        /* eslint-disable */
        for (const file of list) {
            let arrkey = file.split('.');
            arrkey.pop();
            const key = arrkey.join('.');

            const data = jetpack.read(path.join(this.cachePath, file), 'json');
            if (!data) {
                return;
            }

            this.cache.set(key, data);
        }
        /* eslint-enable */
    }
}
