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
            logging = {...logging, ...{format: logFormat(siteId, config.get('logging.format', {}))}};
        } catch (e) {
            console.error('Can not load default config.');
        }
    }

    const options = { ...defaultOptions, ...logging };

    return new Logger(options);
}
