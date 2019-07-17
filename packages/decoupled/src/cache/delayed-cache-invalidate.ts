import { resolve } from 'path';
import { Site } from '../site/site';

export const delayedCacheInvalidate = async (site: Site, items: any[]) => {

    const invalidator = site.config.get('cache.invalidator', false);

    if (!invalidator) {
        return void 0;
    }

    // TODO: generalize / bullet-proof this callable-from-config pattern,
    // it's used in multiple locations (also see require-muliple)
    const callback = (typeof invalidator === 'string')
        ? require(resolve(invalidator)) || false
        : invalidator;

    if (typeof callback === 'function') {
        await callback(items);
    } else if (Array.isArray(callback)) {
        const promises = [];

        callback.forEach((promise) => {
            promises.push(promise(site, items));
        });

        await Promise.all(promises).then(
            site.backendNotify.sendNotification("All Cache invalidation processes ended", ['Cache'])
        );
    }

};
