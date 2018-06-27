import path from 'path';
import { Site } from '../site/site';

export const handleDelayedCacheInvalidate = async (site: Site, items) => {

    const invalidator = site.config.get('cache.invalidator', false);

    if (!invalidator) {
        return void 0;
    }

    // TODO: generalize / bullet-proof this callable-from-config pattern,
    // it's used in multiple locations (also see require-muliple)
    const callback =
        (typeof invalidator === 'string') ? require(path.resolve(process.env.PWD, invalidator)) || false : invalidator;

    if (typeof callback === 'function') {
        await callback(items);
    } else if (Array.isArray(callback)) {
        const promises = [];

        callback.forEach((promise) => {
            promises.push(promise(items));
        });

        await Promise.all(promises);
    }

};
