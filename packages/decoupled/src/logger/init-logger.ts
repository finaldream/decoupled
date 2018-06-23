import { provideConfig } from '../config';
import { logFormat } from './log-format';
import { Logger } from './logger';

export function initLogger(siteId: string, env?: string) {

    const defaultOptions = {
        format: logFormat(siteId),
        transports: [
            { type: 'Console', level: 'debug' },
        ],
    };

    const config = provideConfig(siteId, env);
    const logging = config.get('logging', defaultOptions);

    return new Logger({ ...defaultOptions, ...logging });
}
