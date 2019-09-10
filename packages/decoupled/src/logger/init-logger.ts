import { provideConfig, hasDecoupledConfig } from '../config';
import { Logger, logFormat } from 'decoupled-logger';

export function initLogger(siteId: string, env?: string) {
    const defaultOptions = {
        format: {},
        level: 'info',
        transports: [
            { type: 'Console' },
        ],
    };

    let logging = {};
    if (hasDecoupledConfig()) { // skip errors when running in non-project environments (i.e. tests)
        try {
            const config = provideConfig(siteId, env);
            logging = config.get('logging', defaultOptions);
        } catch (e) {
            console.error('Can not load default config.');
        }
    }

    const options = { ...defaultOptions, ...logging };
    options.format = logFormat(siteId, options.format);
    // Allow setting a global log-level
    if (process.env.LOG_LEVEL) {
        options.level = process.env.LOG_LEVEL;
    }

    return new Logger(options);
}
