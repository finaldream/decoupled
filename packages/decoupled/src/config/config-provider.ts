import { merge } from 'lodash';
import { Config } from './config';
import { ConfigValidator } from './config-validator';
import { Bundle, defaultBundleManager } from '../bundles';
import { logger } from '../logger';

const configCache = new Map();
const filePatterns = {};

export class ConfigProvider {

    public get cacheKey(): string {
        return `${this.siteId}/${this.env}`;
    }

    private static getFilePattern(env: string = 'default'): RegExp {
        if (!filePatterns[env]) {
            filePatterns[env] = (env === 'default') ?
                new RegExp('^\.\/([^.]*\.(ts|js)$)') :
                new RegExp(`^\.\/([^.]*\.${env}\.(ts|js)$)`);
        }

        return filePatterns[env];
    }

    constructor(
        private readonly siteId: string,
        private readonly env: string = process.env.NODE_ENV,
    ) {}

    public load(): Config {
        const { siteId, cacheKey } = this;

        if (configCache.has(cacheKey)) {
            return configCache[cacheKey];
        }

        const bundles = [];

        const defaultBundle = defaultBundleManager.getBundle('default');
        if (!defaultBundle) {
            logger.error(`Config: Bundle for "default" not found`);
            return null;
        } else {
            bundles.push(defaultBundle);
        }

        const siteBundle = defaultBundleManager.getBundle(siteId);
        if (!siteBundle) {
            logger.error(`Config: Bundle for "${siteId}" not found`);
            return null;
        } else {
            bundles.push(siteBundle);
        }

        const configs = bundles.map((bundle) => this.loadConfig(bundle));

        const config = new Config(merge({}, ...configs));
        configCache[cacheKey] = config;

        return config;
    }

    public validate(data, options = {}) {
        const validator = new ConfigValidator(options);

        return validator.validate(data);
    }

    public loadConfig(bundle: Bundle) {
        const { env } = this;
        const defaultConfig = this.readConfigFromFiles(bundle, 'default');

        if (!env) {
            return defaultConfig;
        }

        const envConfig = this.readConfigFromFiles(bundle, env);

        return merge(defaultConfig, envConfig);
    }

    private readConfigFromFiles(bundle: Bundle, env: string): AnyObject {
        let result = {};

        const { config } = bundle || {};
        const { keys } = config || {};
        const pattern = ConfigProvider.getFilePattern(env);

        if (!config || typeof config.keys !== 'function') {
            logger.error(`Bundle ${bundle.siteId} config.keys is not a function.`);
            return {};
        }

        const configKeys = keys();

        if (!configKeys || !configKeys.length) {
            logger.warn(`No config-keys found in bundle ${bundle.siteId}`);
            return {};
        }

        configKeys.forEach((key) => {
            if (key.match(pattern)) {
                let value = config(key);
                if (value.default) {
                    value = merge({}, value, value.default);
                    delete value.default;
                }
                result = merge({}, result, value);
            }
        });

        return result;
    }
}
