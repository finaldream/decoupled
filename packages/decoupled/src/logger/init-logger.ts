import { provideConfig, hasDecoupledJson } from '../config';
import { logFormat } from './log-format';
import { Logger } from './logger';

export function initLogger(siteId: string, env?: string) {

    const defaultOptions = {
        format: logFormat(siteId),
        level: 'info',
        transports: [
            { type: 'Console' },
        ],
    };

    let logging = {};
    if (hasDecoupledJson()) { // skip errors when running in non-project environments (i.e. tests)
        try {
            const config = provideConfig(siteId, env);
            logging = config.get('logging', defaultOptions);
        } catch (e) {
            console.error('Can not load default config.');
        }
    }

    const options = { ...defaultOptions, ...logging };

    // Allow setting a global log-level
    if (process.env.LOG_LEVEL) {
        options.level = process.env.LOG_LEVEL;
    }

    return new Logger(options);
}
