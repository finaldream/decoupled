
import { Site } from '../site/site';
import nodeFetch, { RequestInit, Response } from 'node-fetch';

export const fetch = async (site: Site, url: string, init?: RequestInit): Promise<Response> => {

    const authentication = this.site.config.get('services.wpapi.authentication');
    if (authentication) {
        if (authentication.username && authentication.password) {
            const encoded = new Buffer(`${authentication.username}:${authentication.password}`).toString('base64');
            Object.assign(init.headers, { Authorization: `Basic ${encoded}` });
        }
        if (authentication.token) {
            Object.assign(init.headers, { 'decoupled-token': authentication.token });
        }
    }


    site.logger.debug('decoupled-fetch', `Requesting ${url}`);

    let result;
    
    try {
        result = await nodeFetch(url, init);
    } catch (e) {
        site.logger.error('decoupled-fetch', url, e.message);
        throw e;
    }

    return result;
};
