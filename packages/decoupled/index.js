/**
 * Public exports
 */

const { config } = require('multisite-config');
const logger = require('./dist/src/logger');
const { cachedFetch } = require('./dist/src/fetch/cached-fetch');
const apiFetch = require('./dist/src/fetch/api-fetch');
const cache = require('./dist/src/fetch/cache');
const globalStore = require('./dist/src/services/global-store');

module.exports = {
    config,
    logger,
    cachedFetch,
    apiFetch,
    cache,
    globalStore,
};
