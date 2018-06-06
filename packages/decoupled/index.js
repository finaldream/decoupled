/**
 * Public exports
 * todo: also move to typescript
 */

const { config } = require('multisite-config');
const { default: logger } = require('./dist/logger');
const { cachedFetch } = require('./dist/fetch/cached-fetch');
const { default: apiFetch } = require('./dist/fetch/api-fetch');
const { default: cache } = require('./dist/fetch/cache');
const { default: globalStore } = require('./dist/services/global-store');

module.exports = {
    config,
    logger,
    cachedFetch,
    apiFetch,
    cache,
    globalStore,
};
