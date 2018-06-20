/**
 * Config Provider
 */

import { merge } from 'lodash';
import fs from 'fs';
import path from 'path';
import { Config } from './config';

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
function loadConfig(domain: string, env: string, rootPath: string): AnyObject {

    const defaultPath = path.join(rootPath, domain);
    const defaultConfig = readConfigFromFiles(defaultPath, getFilePattern());

    if (!env) {
        return defaultConfig;
    }

    const pattern = getFilePattern(env);
    const envConfig = readConfigFromFiles(defaultPath, pattern);

    return merge(defaultConfig, envConfig);
}


export function provideConfig(siteId: string, environment: string = 'development', rootPath: string = './'): Config {

    const rootConfigPath = (path.isAbsolute(rootPath)) ?
        rootPath :
        path.resolve(process.env.PWD || __dirname, rootPath);

    const defaultConfig = loadConfig('default', environment, rootConfigPath);
    const siteConfig = siteId !== 'default' ? loadConfig(siteId, environment, rootConfigPath) : {};

    return new Config(merge(defaultConfig, siteConfig));

}
