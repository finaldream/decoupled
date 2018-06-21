/**
 * Sets up and provides the Winston Logger
 *
 * Uses the configuration from the "default"-site only!
 */

import winston from 'winston';
import { provideConfig } from './config';

function formatTimestamp() {
    const date = new Date().toLocaleDateString('en-GB');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    return `[${date} ${time}]`;
}

export let logger: any;

export function initLogger(env?: string) {

    const defaultOptions = {
        Console: {
            logLevel: process.env.LOG_LEVEL || 'debug',
        },
    };

    // TODO: DRY behaviour
    const config = provideConfig('default', env);
    const logging = config.get('logging', defaultOptions);
    const transports = [];

    Object.entries(logging).forEach(([type, configs]) => {

        if (typeof winston.transports[type] === 'undefined') {
            return false;
        }

        const options: any = configs;

        options.timestamp = formatTimestamp;
        options.level = process.env.LOG_LEVEL || options.logLevel || 'info';
        options.colorize = true;

        transports.push(new (winston.transports[type])(options));

        return true;
    });

    logger = new ((winston as any).Logger)({ transports });
}
