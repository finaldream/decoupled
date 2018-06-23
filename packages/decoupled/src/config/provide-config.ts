/**
 * Config Provider
 */

import { merge } from 'lodash';
import fs from 'fs';
import path from 'path';
import { Config } from './config';
import { appPath } from '../lib';

const configCache = new Map();
/**
 * Read any config file match input pattern
 */
function readConfigFromFiles(configDir: string, pattern: RegExp): AnyObject {

    const result = {};

    if (!fs.statSync(configDir).isDirectory()) {
        throw new Error(`${configDir} is not a directory`);
    }

    const files = fs.readdirSync(configDir);

    files.forEach((file) => {

        if (file.match(pattern)) {

            const filePath = path.join(configDir, file);

            if (fs.statSync(filePath).isFile()) {
                try {
                    merge(result, (require(filePath) || {})); // eslint-disable-line
                } catch (error) {
                    console.error(filePath, error);
                    throw new Error('Can not load config files');
                }
            }
        }
    });

    return result;
}

const filePatterns = {};

/**
 * Get environment config file pattern
 */
function getFilePattern(env: string = 'default'): RegExp {

    if (!filePatterns[env]) {
        filePatterns[env] = (env === 'default') ?
            new RegExp('^([^.]*.(js)$)') :
            new RegExp(`^([^.]*.(${env}.js)$)`);
    }

    return filePatterns[env];
}

/**
 * Return environment config for single site
 */
function loadConfig(domain: string, env: string, rootPath?: string): AnyObject {

    const basePath = !rootPath
        ? appPath('config')
        : rootPath;
    const defaultPath = path.join(basePath, domain);
    const defaultConfig = readConfigFromFiles(defaultPath, getFilePattern());

    if (!env) {
        return defaultConfig;
    }

    const pattern = getFilePattern(env);
    const envConfig = readConfigFromFiles(defaultPath, pattern);

    return merge(defaultConfig, envConfig);
}

/**
 * Returns the config for a specified site-id/environment combination.
 * Requested configs are cached, so that they are initialized only once.
 *
 * @param siteId site-id to load
 * @param environment environment version. Defaults to NODE_ENV or 'development'
 * @param rootPath path to look for a config
 */
export function provideConfig(siteId: string, environment?: string, rootPath?: string): Config {


    const env = environment || process.env.NODE_ENV;
    const cacheKey = `${siteId}/${environment}`;

    if (configCache.has(cacheKey)) {
        return configCache[cacheKey];
    }

    const rootConfigPath = path.resolve(rootPath || appPath('config'));


    const defaultConfig = loadConfig('default', env, rootConfigPath);
    const siteConfig = siteId !== 'default' ? loadConfig(siteId, env, rootConfigPath) : {};

    const config = new Config(merge(defaultConfig, siteConfig));
    configCache[cacheKey] = config;

    return config;

}
