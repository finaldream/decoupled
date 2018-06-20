/**
 * WP API Fetch
 */

import chalk from 'chalk';
import httpError from 'http-errors';
import { get } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';
import { logger } from '../logger';
import { Site } from '../site/site';


export default async (site: Site, { type, params }) => {
    const { endpoint, authentication } = site.config.get('services.wpapi');

    const headers = {};

    if (authentication) {
        if (authentication.username && authentication.password) {
            const encoded = new Buffer(`${authentication.username}:${authentication.password}`).toString('base64');
            Object.assign(headers, { Authorization: `Basic ${encoded}` });
        }
        if (authentication.token) {
            Object.assign(headers, { 'dcoupled-token': authentication.token });
        }
    }

    let url = `${endpoint.replace(/\/$/, '')}/${type}/`;

    if (params) {
        url = `${url}?${qs.stringify(params)}`;
    }

    logger.log('debug', `Requesting ${url}`);

    let res;

    try {
        res = await fetch(url, { method: 'GET', headers });
    } catch (e) {
        logger.error('api-fetch', url, e.message);
        throw e;
    }

    if (!res.ok) {
        logger.error('api-fetch: reponse not ok', url, res.status, res.statusText);
        throw httpError(res.status, res.statusText);
    }

    let json;
    try {
        json = await res.json();
    } catch (e) {
        logger.error('api-fetch: json error', e.message);
        throw e;
    }

    const group = type === 'menus' ? null : 'posts';
    const pagination = {
        total: get(res.headers, '_headers.x-wp-total.0', 1),
        totalPages: get(res.headers, '_headers.x-wp-totalpages.0', 1),
    };

    // TODO: move `meta` from the state up one level to the responseData-object
    const result = {
        meta: json.meta || {},
        pagination,
    };

    if (group) {
        result[group] = json.result;
    } else {
        Object.assign(result, json.result || json);
    }

    logger.debug('api-fetch', chalk.green('success'), url);

    return result;
};
