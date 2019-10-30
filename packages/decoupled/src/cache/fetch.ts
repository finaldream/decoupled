/**
 * Function to query cached Fetch state
 */

import { fetch } from '../fetch/fetch';
import { Site } from '../site/site';


export const cachedFetch = async (site: Site, url: string, cacheKey: string): Promise<AnyObject> => {
    
    const cached: AnyObject | void = await site.cache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const result = await fetch(site, url);

    // TODO: use Expiry headers
    site.cache.set(cacheKey, result, 6000);

    return result;
};
