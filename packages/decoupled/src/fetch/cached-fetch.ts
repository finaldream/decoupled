/**
 * Function to query cached Fetch state
 */

import { genAPICacheKey } from '../lib';
import fetch from './api-fetch';
import cache from './cache';
import FetchStore from './fetch-store';

const store = new FetchStore({});

export const cachedFetch = async ({ type, params }): Promise<AnyObject> => {
    const key = genAPICacheKey(type, params);
    const cached: AnyObject | void = await cache.get(key);

    if (cached) {
        return cached;
    }

    const result = await fetch({ type, params });

    // TODO: use Expiry headers
    cache.set(key, result, 6000);

    return result;
};
