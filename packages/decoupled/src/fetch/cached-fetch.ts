/**
 * Function to query cached Fetch state
 */

import { genAPICacheKey } from '../lib';
import fetch from './api-fetch';
import FetchStore from './fetch-store';
import { Site } from '../site/site';

const store = new FetchStore({});

export const cachedFetch = async (site: Site, { type, params }): Promise<AnyObject> => {
    const key = genAPICacheKey(type, params);
    const cached: AnyObject | void = await site.cache.get(key);

    if (cached) {
        return cached;
    }

    const result = await fetch(site, { type, params });

    // TODO: use Expiry headers
    site.cache.set(key, result, 6000);

    return result;
};
